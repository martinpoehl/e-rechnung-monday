import { describe, expect, it } from "vitest";
import { buildInvoiceData, parseAmount, parseGermanDate } from "./buildData";
import { ITEM as item, MAPPING as mapping, SELLER as seller } from "./fixtures";
import type { MondayItem } from "./types";

describe("parseAmount", () => {
  it("versteht deutsches Format mit Tausenderpunkt und Komma", () => {
    expect(parseAmount("1.234,56 €")).toBe(1234.56);
  });

  it("versteht reines Komma als Dezimaltrenner", () => {
    expect(parseAmount("99,90")).toBe(99.9);
  });

  it("versteht Punkt als Dezimaltrenner ohne Komma", () => {
    expect(parseAmount("1234.56")).toBe(1234.56);
  });

  it("liefert NaN für Unlesbares", () => {
    expect(parseAmount("offen")).toBeNaN();
  });
});

describe("parseGermanDate", () => {
  it("versteht ISO-Datum aus monday-Datumsspalten", () => {
    expect(parseGermanDate("2026-07-31")?.toISOString().slice(0, 10)).toBe("2026-07-31");
  });

  it("versteht deutsches Datum DD.MM.YYYY", () => {
    expect(parseGermanDate("31.07.2026")?.toISOString().slice(0, 10)).toBe("2026-07-31");
  });

  it("liefert null für Unlesbares", () => {
    expect(parseGermanDate("bald")).toBeNull();
  });
});

describe("buildInvoiceData", () => {
  const issueDate = new Date("2026-07-14");

  it("baut die Rechnung aus gemappten Spalten inkl. USt-Berechnung", () => {
    const d = buildInvoiceData(item, mapping, seller, issueDate);
    expect(d.number).toBe("RE-2026-0007");
    expect(d.buyer).toEqual({
      name: "Muster GmbH",
      address: "Beispielweg 2",
      zip: "01067",
      city: "Dresden",
      email: "buchhaltung@muster-gmbh.de",
      country: "DE",
    });
    expect(d.netAmount).toBe(1234.56);
    expect(d.vatRate).toBe(19);
    expect(d.vatAmount).toBe(234.57); // 1234.56 * 0.19 = 234.5664 → kaufmännisch gerundet
    expect(d.grossAmount).toBe(1469.13);
    expect(d.currency).toBe("EUR");
    expect(d.itemDescription).toBe("IT-Dienstleistung Juli");
  });

  it("berechnet das Fälligkeitsdatum aus dem Zahlungsziel", () => {
    const d = buildInvoiceData(item, mapping, seller, issueDate);
    expect(d.dueDate.toISOString().slice(0, 10)).toBe("2026-08-13");
  });

  it("übernimmt das Leistungsdatum aus der Spalte", () => {
    const d = buildInvoiceData(item, mapping, seller, issueDate);
    expect(d.serviceDate?.toISOString().slice(0, 10)).toBe("2026-07-31");
  });

  it("fällt ohne Beschreibungs-Spalte auf den Item-Namen zurück", () => {
    const d = buildInvoiceData(item, { ...mapping, description: undefined }, seller, issueDate);
    expect(d.itemDescription).toBe("Auftrag Juli");
  });

  it("übernimmt die BuyerReference aus der gemappten Spalte", () => {
    const withRef: MondayItem = {
      ...item,
      columnValues: [...item.columnValues, { id: "col_ref", text: "BESTELL-88" }],
    };
    const d = buildInvoiceData(withRef, { ...mapping, buyerReference: "col_ref" }, seller, issueDate);
    expect(d.buyerReference).toBe("BESTELL-88");
  });

  it("fällt ohne BuyerReference-Spalte auf die Rechnungsnummer zurück (BR-DE-15)", () => {
    const d = buildInvoiceData(item, mapping, seller, issueDate);
    expect(d.buyerReference).toBe("RE-2026-0007");
  });

  it("rundet Rappenbeträge kaufmännisch (Halbrappen aufwärts)", () => {
    const cheap: MondayItem = {
      ...item,
      columnValues: item.columnValues.map((c) => (c.id === "col_net" ? { ...c, text: "99,99" } : c)),
    };
    const d = buildInvoiceData(cheap, mapping, seller, issueDate);
    expect(d.vatAmount).toBe(19.0); // 99.99 * 0.19 = 18.9981
    expect(d.grossAmount).toBe(118.99);
  });
});
