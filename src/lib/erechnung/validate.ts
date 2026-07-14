import type { InvoiceData } from "./types";

/**
 * Sprachneutrale Validierungs-Codes; die UI übersetzt sie via i18n.formatIssue.
 * Geprüft wird, was der KoSIT-Validator später hart ablehnen würde – der Nutzer
 * bekommt so eine verständliche Meldung statt einer abgelehnten Rechnung.
 */
export type ValidationIssue =
  | { code: "number_missing" }
  | { code: "amount_invalid" }
  | { code: "buyer_field_missing"; field: "name" | "address" | "city" }
  | { code: "zip_invalid"; party: "buyer" | "seller" }
  | { code: "buyer_email_invalid" }
  | { code: "service_date_missing" }
  | { code: "vat_id_invalid" }
  | { code: "phone_invalid" }
  | { code: "iban_invalid" }
  | { code: "vat_rate_invalid" };

// ISO-7064-Mod-97 über die umgestellte IBAN; Buchstaben zählen als 10–35.
const mod97 = (s: string): number => {
  let rest = 0;
  for (const ch of s) {
    const v = /[A-Z]/.test(ch) ? String(ch.charCodeAt(0) - 55) : ch;
    for (const digit of v) rest = (rest * 10 + Number(digit)) % 97;
  }
  return rest;
};

export const isIbanValid = (raw: string): boolean => {
  const iban = raw.replace(/\s/g, "").toUpperCase();
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(iban)) return false;
  return mod97(iban.slice(4) + iban.slice(0, 4)) === 1;
};

const isPlausibleEmail = (s: string) => /.+@.+\..+/.test(s);
// Deutsche Postleitzahlen sind fünfstellig, führende Null ist gültig (z.B. Dresden).
const isGermanZip = (s: string) => /^\d{5}$/.test(s);
// MVP unterstützt Standard- und ermässigten Satz; 0 % (Kleinunternehmer u.a.) ist Phase 2.
const SUPPORTED_VAT_RATES = [19, 7];

export function validateInvoiceData(d: InvoiceData): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!d.number) issues.push({ code: "number_missing" });
  if (!(d.netAmount > 0)) issues.push({ code: "amount_invalid" });

  if (!d.buyer.name) issues.push({ code: "buyer_field_missing", field: "name" });
  if (!d.buyer.address) issues.push({ code: "buyer_field_missing", field: "address" });
  if (!d.buyer.city) issues.push({ code: "buyer_field_missing", field: "city" });
  if (!isGermanZip(d.buyer.zip)) issues.push({ code: "zip_invalid", party: "buyer" });
  if (!isPlausibleEmail(d.buyer.email)) issues.push({ code: "buyer_email_invalid" });
  if (!d.serviceDate) issues.push({ code: "service_date_missing" });

  // Verkäufer-Stammdaten: würden BR-S-02 bzw. BR-DE-6/27 im KoSIT-Validator reissen.
  if (!/^DE\d{9}$/.test(d.seller.vatId.replace(/\s/g, ""))) issues.push({ code: "vat_id_invalid" });
  if ((d.seller.phone.match(/\d/g)?.length ?? 0) < 3) issues.push({ code: "phone_invalid" });
  if (!isIbanValid(d.seller.iban)) issues.push({ code: "iban_invalid" });
  if (!SUPPORTED_VAT_RATES.includes(d.vatRate)) issues.push({ code: "vat_rate_invalid" });

  return issues;
}
