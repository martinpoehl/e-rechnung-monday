export interface MondayColumnValue { id: string; text: string; }
export interface MondayItem { id: string; name: string; columnValues: MondayColumnValue[]; }

/** Zuordnung Board-Spalten → Rechnungsfelder. Nur Kunden-/Auftragsdaten kommen aus dem Board. */
export interface FieldMapping {
  invoiceNumber: string;
  buyerName: string; buyerAddress: string; buyerZip: string; buyerCity: string;
  /** BT-49: elektronische Adresse des Käufers – Pflicht in der XRechnung. */
  buyerEmail: string;
  netAmount: string;
  /** BT-72: Leistungs-/Lieferdatum – Pflicht nach BR-DE-TMP-32 (alternativ Periode, Phase 2). */
  serviceDate: string;
  description?: string;
  /** BT-10: Käufer-Referenz (Bestell-/Kundennummer); ohne Mapping fällt sie auf die Rechnungsnummer zurück. */
  buyerReference?: string;
}

/** Verkäuferdaten – werden einmalig in den App-Einstellungen erfasst. */
export interface SellerSettings {
  name: string;
  address: string;
  zip: string;
  city: string;
  /** BT-31: USt-IdNr, bei Steuerkategorie S zwingend (BR-S-02). */
  vatId: string;
  /** BT-34: elektronische Adresse (E-Mail, Scheme EM). */
  email: string;
  /** BT-42: Telefon mit mind. 3 Ziffern (BR-DE-6/27). */
  phone: string;
  /** BR-DE-2: Ansprechpartner. */
  contactName: string;
  iban: string;
  /** Zahlungsziel in Tagen; ergibt Fälligkeitsdatum und Zahlungsbedingungs-Text. */
  paymentTermsDays: number;
  /** USt-Satz in Prozent (19/7/0) – MVP: ein Satz pro Board. */
  vatRate: number;
}

/** Von der App-UI unterstützte Sprachen (Rechnungsinhalt ist formatbedingt sprachneutral). */
export type AppLanguage = "de" | "en";

/** In monday.storage persistierte App-Einstellungen. */
export interface AppSettings {
  seller: SellerSettings;
  uiLanguage: "auto" | AppLanguage;
}

/** Vollständige Rechnungsdaten – Input für den XML-Generator. */
export interface InvoiceData {
  number: string;
  /** BT-10, Pflicht in der XRechnung (BR-DE-15). */
  buyerReference: string;
  issueDate: Date;
  dueDate: Date;
  serviceDate: Date | null;
  currency: "EUR";
  itemDescription: string;
  netAmount: number;
  vatRate: number;
  vatAmount: number;
  grossAmount: number;
  seller: SellerSettings;
  buyer: { name: string; address: string; zip: string; city: string; email: string; country: "DE" };
}
