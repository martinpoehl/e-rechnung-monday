import { describe, expect, it } from "vitest";
import { buildInvoiceData } from "./buildData";
import { ISSUE_DATE, ITEM, MAPPING, SELLER } from "./fixtures";
import { validateInvoiceData } from "./validate";
import type { MondayItem } from "./types";

const withColumn = (id: string, text: string): MondayItem => ({
  ...ITEM,
  columnValues: ITEM.columnValues.map((c) => (c.id === id ? { ...c, text } : c)),
});

const validate = (item: MondayItem = ITEM, seller = SELLER) =>
  validateInvoiceData(buildInvoiceData(item, MAPPING, seller, ISSUE_DATE));

describe("validateInvoiceData", () => {
  it("liefert keine Issues für die valide Fixture", () => {
    expect(validate()).toEqual([]);
  });

  it("meldet fehlende Rechnungsnummer", () => {
    expect(validate(withColumn("col_nr", ""))).toContainEqual({ code: "number_missing" });
  });

  it("meldet unlesbaren oder nicht positiven Betrag", () => {
    expect(validate(withColumn("col_net", "offen"))).toContainEqual({ code: "amount_invalid" });
    expect(validate(withColumn("col_net", "0"))).toContainEqual({ code: "amount_invalid" });
  });

  it("meldet fehlende Käuferfelder einzeln", () => {
    expect(validate(withColumn("col_name", ""))).toContainEqual({
      code: "buyer_field_missing",
      field: "name",
    });
    expect(validate(withColumn("col_city", ""))).toContainEqual({
      code: "buyer_field_missing",
      field: "city",
    });
  });

  it("meldet ungültige deutsche PLZ des Käufers", () => {
    expect(validate(withColumn("col_zip", "123"))).toContainEqual({
      code: "zip_invalid",
      party: "buyer",
    });
  });

  it("meldet fehlende oder unplausible Käufer-E-Mail (BT-49)", () => {
    expect(validate(withColumn("col_mail", ""))).toContainEqual({ code: "buyer_email_invalid" });
    expect(validate(withColumn("col_mail", "keine-mail"))).toContainEqual({
      code: "buyer_email_invalid",
    });
  });

  it("meldet fehlendes Leistungsdatum (BR-DE-TMP-32)", () => {
    expect(validate(withColumn("col_date", ""))).toContainEqual({ code: "service_date_missing" });
  });

  it("meldet ungültige USt-IdNr des Verkäufers (BT-31)", () => {
    expect(validate(ITEM, { ...SELLER, vatId: "123456789" })).toContainEqual({
      code: "vat_id_invalid",
    });
  });

  it("meldet Telefon mit weniger als drei Ziffern (BR-DE-27)", () => {
    expect(validate(ITEM, { ...SELLER, phone: "+4" })).toContainEqual({ code: "phone_invalid" });
  });

  it("meldet ungültige IBAN (Prüfziffer)", () => {
    expect(validate(ITEM, { ...SELLER, iban: "DE89370400440532013001" })).toContainEqual({
      code: "iban_invalid",
    });
  });

  it("meldet nicht unterstützten USt-Satz", () => {
    expect(validate(ITEM, { ...SELLER, vatRate: 12 })).toContainEqual({ code: "vat_rate_invalid" });
  });
});
