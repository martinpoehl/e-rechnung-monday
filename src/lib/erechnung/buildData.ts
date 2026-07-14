import type { FieldMapping, InvoiceData, MondayItem, SellerSettings } from "./types";

const col = (item: MondayItem, id: string): string =>
  item.columnValues.find((c) => c.id === id)?.text.trim() ?? "";

/** Kaufmännische Rundung auf 2 Nachkommastellen (EPSILON gegen Float-Artefakte). */
const round2 = (n: number): number => Math.round((n + Number.EPSILON) * 100) / 100;

// Deutsche monday-Boards liefern Beträge oft formatiert: "1.234,56 €", "99,90".
// Punkt UND Komma → Punkt ist Tausendertrenner; nur Komma → Dezimaltrenner.
export const parseAmount = (raw: string): number => {
  let s = raw.replace(/eur|€/gi, "").replace(/[\s'’ʼ]/g, "");
  if (s.includes(".") && s.includes(",")) s = s.replace(/\./g, "").replace(",", ".");
  else if (s.includes(",")) s = s.replace(",", ".");
  const n = Number(s);
  return Number.isNaN(n) || s === "" ? NaN : round2(n);
};

// monday-Datumsspalten liefern ISO ("2026-07-31"); manuelle Textspalten oft "31.07.2026".
export const parseGermanDate = (raw: string): Date | null => {
  const s = raw.trim();
  const iso = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  const de = s.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  const [y, m, d] = iso
    ? [Number(iso[1]), Number(iso[2]), Number(iso[3])]
    : de
      ? [Number(de[3]), Number(de[2]), Number(de[1])]
      : [0, 0, 0];
  if (!y) return null;
  const date = new Date(Date.UTC(y, m - 1, d));
  // Roundtrip-Check fängt unmögliche Daten wie 31.02. ab.
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d
    ? date
    : null;
};

const DAY_MS = 24 * 60 * 60 * 1000;

export function buildInvoiceData(
  item: MondayItem,
  m: FieldMapping,
  seller: SellerSettings,
  issueDate: Date = new Date(),
): InvoiceData {
  const netAmount = parseAmount(col(item, m.netAmount));
  const vatAmount = round2(netAmount * (seller.vatRate / 100));
  const description = m.description ? col(item, m.description) : "";
  const number = col(item, m.invoiceNumber);
  const buyerReference = m.buyerReference ? col(item, m.buyerReference) : "";

  return {
    number,
    // BR-DE-15 verlangt BT-10 zwingend; ohne gemappte Spalte ist die
    // Rechnungsnummer der pragmatische, konforme Rückfallwert.
    buyerReference: buyerReference || number,
    issueDate,
    dueDate: new Date(issueDate.getTime() + seller.paymentTermsDays * DAY_MS),
    serviceDate: parseGermanDate(col(item, m.serviceDate)),
    currency: "EUR",
    itemDescription: description || item.name,
    netAmount,
    vatRate: seller.vatRate,
    vatAmount,
    grossAmount: round2(netAmount + vatAmount),
    seller,
    buyer: {
      name: col(item, m.buyerName),
      address: col(item, m.buyerAddress),
      zip: col(item, m.buyerZip),
      city: col(item, m.buyerCity),
      email: col(item, m.buyerEmail),
      country: "DE",
    },
  };
}
