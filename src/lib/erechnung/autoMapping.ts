import type { FieldMapping } from "./types";
import type { BoardColumn } from "../../monday/board";

// Schlüsselwörter pro Feld (DE/EN), in Prioritätsreihenfolge. Bewusst konservativ:
// lieber ein Feld leer lassen als falsch raten – der Nutzer bestätigt das Mapping ohnehin.
// serviceDate steht vor description, damit "Leistungsdatum" nicht als Positionstext endet.
const KEYWORDS: [keyof FieldMapping, string[]][] = [
  ["invoiceNumber", ["rechnungsnummer", "rechnungs-nr", "rechnung nr", "invoice number", "invoice no", "belegnummer", "re-nr", "rg-nr"]],
  ["buyerName", ["kunde", "kunden", "customer", "client", "firma", "debitor", "empfänger"]],
  ["buyerAddress", ["strasse", "straße", "street", "adresse", "address"]],
  ["buyerZip", ["plz", "zip", "postleitzahl", "postal"]],
  ["buyerCity", ["ort", "city", "stadt"]],
  ["buyerEmail", ["e-mail", "email", "mail"]],
  ["serviceDate", ["leistungsdatum", "lieferdatum", "leistungszeitraum", "delivery date", "service date", "datum"]],
  ["netAmount", ["netto", "betrag", "amount", "summe", "total", "preis", "price"]],
  ["buyerReference", ["bestellnummer", "bestellung", "order", "kundennummer", "referenz", "reference"]],
  ["description", ["beschreibung", "leistung", "position", "description", "text"]],
];

const normalize = (s: string) => s.toLowerCase().trim();

/**
 * Schlägt anhand der Spaltennamen ein Mapping vor. Jede Spalte wird höchstens
 * einem Feld zugewiesen (Reihenfolge = Priorität der Felder).
 */
export function suggestMapping(columns: BoardColumn[]): Partial<FieldMapping> {
  const suggestion: Partial<FieldMapping> = {};
  const used = new Set<string>();

  for (const [field, keywords] of KEYWORDS) {
    const match = columns.find(
      (col) => !used.has(col.id) && keywords.some((kw) => normalize(col.title).includes(kw)),
    );
    if (match) {
      suggestion[field] = match.id;
      used.add(match.id);
    }
  }
  return suggestion;
}
