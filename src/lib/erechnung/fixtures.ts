import type { FieldMapping, MondayItem, SellerSettings } from "./types";

/** Gemeinsame Testdaten – gleiche Werte wie der KoSIT-validierte Spike vom 13.07.2026. */

export const SELLER: SellerSettings = {
  name: "Pöhl IT Solutions",
  address: "Musterstrasse 1",
  zip: "10115",
  city: "Berlin",
  vatId: "DE123456789",
  email: "rechnung@example.de",
  phone: "+49 30 1234567",
  contactName: "Martin Muster",
  iban: "DE89370400440532013000",
  paymentTermsDays: 30,
  vatRate: 19,
};

export const MAPPING: FieldMapping = {
  invoiceNumber: "col_nr",
  buyerName: "col_name",
  buyerAddress: "col_addr",
  buyerZip: "col_zip",
  buyerCity: "col_city",
  buyerEmail: "col_mail",
  netAmount: "col_net",
  serviceDate: "col_date",
  description: "col_desc",
};

export const ITEM: MondayItem = {
  id: "42",
  name: "Auftrag Juli",
  columnValues: [
    { id: "col_nr", text: "RE-2026-0007" },
    { id: "col_name", text: "Muster GmbH" },
    { id: "col_addr", text: "Beispielweg 2" },
    { id: "col_zip", text: "01067" },
    { id: "col_city", text: "Dresden" },
    { id: "col_mail", text: "buchhaltung@muster-gmbh.de" },
    { id: "col_net", text: "1.234,56 €" },
    { id: "col_date", text: "2026-07-31" },
    { id: "col_desc", text: "IT-Dienstleistung Juli" },
  ],
};

export const ISSUE_DATE = new Date("2026-07-14");
