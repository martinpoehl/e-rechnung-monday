import type { AppLanguage, FieldMapping, SellerSettings } from "./erechnung/types";
import type { ValidationIssue } from "./erechnung/validate";

export type Lang = AppLanguage;
export const LANGS: Lang[] = ["de", "en"];

/** Sprachnamen als Endonyme – in allen UI-Sprachen identisch. */
export const LANG_NAMES: Record<Lang, string> = {
  de: "Deutsch",
  en: "English",
};

export interface UIStrings {
  title: string;
  waitingContext: string;
  loading: string;
  errorPrefix: string;
  step1Legend: string;
  step1Hint: string;
  sellerLabels: Record<keyof SellerSettings, string>;
  uiLangLabel: string;
  uiLangAuto: string;
  step2Legend: string;
  step2Hint: string;
  fieldLabels: Record<keyof FieldMapping, string>;
  choose: string;
  none: string;
  step3Title: string;
  hintSeller: string;
  hintMapping: string;
  readyHint: string;
  noItems: string;
  help: string;
  btnCreate: string;
  btnBusy: string;
  done: string;
  issues: {
    number_missing: string;
    amount_invalid: string;
    buyer_field_missing: string;
    zip_invalid: string;
    buyer_email_invalid: string;
    service_date_missing: string;
    vat_id_invalid: string;
    phone_invalid: string;
    iban_invalid: string;
    vat_rate_invalid: string;
  };
  party: { buyer: string; seller: string };
  fieldNames: { name: string; address: string; city: string };
}

export const STRINGS: Record<Lang, UIStrings> = {
  de: {
    title: "E-Rechnung – XRechnung aus Board-Daten",
    waitingContext:
      "Warte auf monday-Kontext … Diese Ansicht funktioniert nur als Board-View innerhalb von monday.com.",
    loading: "Lade Board-Daten …",
    errorPrefix: "Fehler",
    step1Legend: "1 · Ihre Angaben (Rechnungssteller)",
    step1Hint:
      "Einmal ausfüllen – wird gespeichert und auf jeder E-Rechnung als Verkäufer verwendet. Alle Felder sind Pflichtangaben der XRechnung.",
    sellerLabels: {
      name: "Firma / Name",
      address: "Strasse / Nr.",
      zip: "PLZ",
      city: "Ort",
      vatId: "USt-IdNr (DE…)",
      email: "E-Mail (Rechnungsversand)",
      phone: "Telefon",
      contactName: "Ansprechpartner",
      iban: "IBAN",
      paymentTermsDays: "Zahlungsziel (Tage)",
      vatRate: "USt-Satz",
    },
    uiLangLabel: "Sprache der App",
    uiLangAuto: "Automatisch (wie monday)",
    step2Legend: "2 · Rechnungsdaten aus dem Board",
    step2Hint:
      "Wählen Sie, in welchen Board-Spalten die Rechnungsdaten stehen. Passende Spalten wurden automatisch vorgeschlagen – bitte prüfen.",
    fieldLabels: {
      invoiceNumber: "Rechnungsnummer",
      buyerName: "Kunde: Firma / Name",
      buyerAddress: "Kunde: Strasse / Nr.",
      buyerZip: "Kunde: PLZ",
      buyerCity: "Kunde: Ort",
      buyerEmail: "Kunde: E-Mail",
      netAmount: "Netto-Betrag",
      serviceDate: "Leistungs-/Lieferdatum",
      description: "Leistungsbeschreibung",
      buyerReference: "Käufer-Referenz (Bestell-Nr.)",
    },
    choose: "– Spalte wählen –",
    none: "– keine –",
    step3Title: "3 · XRechnung erzeugen",
    hintSeller: "Bitte zuerst Ihre Angaben unter Schritt 1 vollständig ausfüllen.",
    hintMapping: "Bitte alle mit * markierten Spalten unter Schritt 2 zuordnen.",
    readyHint: "Klicken Sie beim gewünschten Eintrag auf «XRechnung erstellen».",
    noItems: "Keine Einträge auf diesem Board.",
    help: "Anleitung & Hilfe",
    btnCreate: "XRechnung erstellen",
    btnBusy: "Erzeuge …",
    done: "✓ heruntergeladen",
    issues: {
      number_missing: "Rechnungsnummer fehlt",
      amount_invalid: "Netto-Betrag fehlt oder ist nicht grösser als 0",
      buyer_field_missing: "Kunde: {field} fehlt",
      zip_invalid: "{party}: PLZ muss fünfstellig sein",
      buyer_email_invalid: "Kunde: gültige E-Mail-Adresse nötig (Pflicht in der XRechnung)",
      service_date_missing: "Leistungs-/Lieferdatum fehlt oder ist nicht lesbar (z.B. 31.07.2026)",
      vat_id_invalid: "USt-IdNr ungültig – Format DE + 9 Ziffern",
      phone_invalid: "Telefonnummer braucht mindestens 3 Ziffern",
      iban_invalid: "IBAN fehlt oder ungültig",
      vat_rate_invalid: "USt-Satz wird nicht unterstützt (19 % oder 7 %)",
    },
    party: { buyer: "Kunde", seller: "Rechnungssteller" },
    fieldNames: { name: "Name", address: "Adresse", city: "Ort" },
  },
  en: {
    title: "E-Invoice – XRechnung from board data",
    waitingContext:
      "Waiting for monday context … This view only works as a board view inside monday.com.",
    loading: "Loading board data …",
    errorPrefix: "Error",
    step1Legend: "1 · Your details (seller)",
    step1Hint:
      "Fill in once – saved and used as the seller on every e-invoice. All fields are mandatory for XRechnung.",
    sellerLabels: {
      name: "Company / Name",
      address: "Street / No.",
      zip: "Postal code",
      city: "City",
      vatId: "VAT ID (DE…)",
      email: "Email (invoicing)",
      phone: "Phone",
      contactName: "Contact person",
      iban: "IBAN",
      paymentTermsDays: "Payment terms (days)",
      vatRate: "VAT rate",
    },
    uiLangLabel: "App language",
    uiLangAuto: "Automatic (same as monday)",
    step2Legend: "2 · Invoice data from the board",
    step2Hint:
      "Choose which board columns contain the invoice data. Matching columns were suggested automatically – please review.",
    fieldLabels: {
      invoiceNumber: "Invoice number",
      buyerName: "Customer: Company / Name",
      buyerAddress: "Customer: Street / No.",
      buyerZip: "Customer: Postal code",
      buyerCity: "Customer: City",
      buyerEmail: "Customer: Email",
      netAmount: "Net amount",
      serviceDate: "Service/delivery date",
      description: "Service description",
      buyerReference: "Buyer reference (order no.)",
    },
    choose: "– Select column –",
    none: "– none –",
    step3Title: "3 · Generate XRechnung",
    hintSeller: "Please fill in all your details in step 1 first.",
    hintMapping: "Please map all columns marked with * in step 2.",
    readyHint: "Click “Create XRechnung” next to the entry you want.",
    noItems: "No items on this board.",
    help: "Help & guide",
    btnCreate: "Create XRechnung",
    btnBusy: "Generating …",
    done: "✓ downloaded",
    issues: {
      number_missing: "Invoice number missing",
      amount_invalid: "Net amount missing or not greater than 0",
      buyer_field_missing: "Customer: {field} missing",
      zip_invalid: "{party}: postal code must have 5 digits",
      buyer_email_invalid: "Customer: valid email required (mandatory in XRechnung)",
      service_date_missing: "Service/delivery date missing or unreadable (e.g. 2026-07-31)",
      vat_id_invalid: "VAT ID invalid – format DE + 9 digits",
      phone_invalid: "Phone number needs at least 3 digits",
      iban_invalid: "IBAN missing or invalid",
      vat_rate_invalid: "VAT rate not supported (19% or 7%)",
    },
    party: { buyer: "Customer", seller: "Seller" },
    fieldNames: { name: "name", address: "address", city: "city" },
  },
};

/** monday liefert Codes wie "de", "de-DE", "en-US" – auf unsere Sprachen abbilden, sonst EN. */
export function resolveLang(mondayLang?: string | null): Lang {
  const code = (mondayLang ?? "").toLowerCase().slice(0, 2);
  return (LANGS as string[]).includes(code) ? (code as Lang) : "en";
}

/** Übersetzt einen Validierungs-Code in eine anzeigbare Meldung. */
export function formatIssue(issue: ValidationIssue, s: UIStrings): string {
  switch (issue.code) {
    case "buyer_field_missing":
      return s.issues.buyer_field_missing.replace("{field}", s.fieldNames[issue.field]);
    case "zip_invalid":
      return s.issues.zip_invalid.replace("{party}", s.party[issue.party]);
    default:
      return s.issues[issue.code];
  }
}
