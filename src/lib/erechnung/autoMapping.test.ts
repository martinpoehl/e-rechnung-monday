import { describe, expect, it } from "vitest";
import { suggestMapping } from "./autoMapping";
import type { BoardColumn } from "../../monday/board";

const cols = (...titles: [string, string][]): BoardColumn[] =>
  titles.map(([id, title]) => ({ id, title }));

describe("suggestMapping", () => {
  it("erkennt typische deutsche Spaltennamen", () => {
    const suggestion = suggestMapping(
      cols(
        ["c1", "Rechnungsnummer"],
        ["c2", "Kunde"],
        ["c3", "Strasse"],
        ["c4", "PLZ"],
        ["c5", "Ort"],
        ["c6", "E-Mail"],
        ["c7", "Netto-Betrag"],
        ["c8", "Leistungsdatum"],
      ),
    );
    expect(suggestion).toEqual({
      invoiceNumber: "c1",
      buyerName: "c2",
      buyerAddress: "c3",
      buyerZip: "c4",
      buyerCity: "c5",
      buyerEmail: "c6",
      netAmount: "c7",
      serviceDate: "c8",
    });
  });

  it("vergibt jede Spalte höchstens einmal", () => {
    const suggestion = suggestMapping(cols(["c1", "Betrag"]));
    const values = Object.values(suggestion);
    expect(new Set(values).size).toBe(values.length);
  });

  it("greift bei einer Spalte 'Leistung' nicht fürs Leistungsdatum", () => {
    const suggestion = suggestMapping(cols(["c1", "Leistung"]));
    expect(suggestion.serviceDate).toBeUndefined();
    expect(suggestion.description).toBe("c1");
  });

  it("rät lieber nicht als falsch", () => {
    expect(suggestMapping(cols(["c1", "Status"], ["c2", "Priorität"]))).toEqual({});
  });
});
