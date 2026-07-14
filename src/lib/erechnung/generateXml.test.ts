import { describe, expect, it } from "vitest";
import { buildInvoiceData } from "./buildData";
import { ISSUE_DATE, ITEM, MAPPING, SELLER } from "./fixtures";
import { XRECHNUNG_CUSTOMIZATION_ID, generateInvoiceXml } from "./generateXml";

const xmlOf = () => generateInvoiceXml(buildInvoiceData(ITEM, MAPPING, SELLER, ISSUE_DATE));

describe("generateInvoiceXml", () => {
  it("erzeugt CII-XML mit XRechnung-3.0-CustomizationID und Business Process", async () => {
    const xml = await xmlOf();
    expect(xml).toContain("<rsm:CrossIndustryInvoice");
    expect(xml).toContain(XRECHNUNG_CUSTOMIZATION_ID);
    expect(xml).toContain("urn:fdc:peppol.eu:2017:poacc:billing:01:1.0");
  });

  it("übernimmt Rechnungsnummer, BuyerReference und Rechnungsdatum", async () => {
    const xml = await xmlOf();
    expect(xml).toContain("<ram:ID>RE-2026-0007</ram:ID>");
    expect(xml).toContain("<ram:BuyerReference>RE-2026-0007</ram:BuyerReference>");
    expect(xml).toContain('format="102">20260714</udt:DateTimeString>');
  });

  it("enthält die deutschen Pflichtangaben des Verkäufers (BT-31, BT-34, BT-42)", async () => {
    const xml = await xmlOf();
    expect(xml).toContain("DE123456789");
    expect(xml).toContain("rechnung@example.de");
    expect(xml).toContain("+49 30 1234567");
    expect(xml).toContain("Martin Muster");
  });

  it("enthält die elektronische Adresse des Käufers (BT-49)", async () => {
    const xml = await xmlOf();
    expect(xml).toContain("buchhaltung@muster-gmbh.de");
  });

  it("rechnet die Beträge korrekt in die Summenblöcke", async () => {
    const xml = await xmlOf();
    expect(xml).toContain("<ram:LineTotalAmount>1234.56</ram:LineTotalAmount>");
    expect(xml).toContain("<ram:TaxBasisTotalAmount>1234.56</ram:TaxBasisTotalAmount>");
    expect(xml).toContain('currencyID="EUR">234.57</ram:TaxTotalAmount>');
    expect(xml).toContain("<ram:GrandTotalAmount>1469.13</ram:GrandTotalAmount>");
    expect(xml).toContain("<ram:DuePayableAmount>1469.13</ram:DuePayableAmount>");
  });

  it("enthält IBAN, Überweisungs-Zahlungsart und Fälligkeitsdatum", async () => {
    const xml = await xmlOf();
    expect(xml).toContain("DE89370400440532013000");
    expect(xml).toContain("<ram:TypeCode>58</ram:TypeCode>");
    expect(xml).toContain("20260813");
  });

  it("bildet das Leistungsdatum als Abrechnungsperiode ab (BG-14, BR-DE-TMP-32)", async () => {
    const xml = await xmlOf();
    expect(xml).toContain("<ram:BillingSpecifiedPeriod>");
    const occurrences = xml.match(/20260731/g) ?? [];
    expect(occurrences.length).toBeGreaterThanOrEqual(2); // Start- und Enddatum
  });

  it("weist die USt korrekt aus (Kategorie S, Satz aus den Einstellungen)", async () => {
    const xml = await xmlOf();
    expect(xml).toContain("<ram:CategoryCode>S</ram:CategoryCode>");
    expect(xml).toContain("<ram:RateApplicablePercent>19</ram:RateApplicablePercent>");
  });
});
