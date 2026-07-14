import { describe, expect, it } from "vitest";
import { MAPPING } from "./fixtures";
import { MAPPING_FIELDS, isMappingComplete } from "./mappingFields";

describe("MAPPING_FIELDS", () => {
  it("führt alle Pflichtfelder der XRechnung auf", () => {
    const required = MAPPING_FIELDS.filter((f) => f.required).map((f) => f.key);
    expect(required).toEqual([
      "invoiceNumber",
      "buyerName",
      "buyerAddress",
      "buyerZip",
      "buyerCity",
      "buyerEmail",
      "netAmount",
      "serviceDate",
    ]);
  });

  it("führt Beschreibung und BuyerReference als optionale Felder", () => {
    const optional = MAPPING_FIELDS.filter((f) => !f.required).map((f) => f.key);
    expect(optional).toEqual(["description", "buyerReference"]);
  });
});

describe("isMappingComplete", () => {
  it("akzeptiert ein vollständiges Mapping", () => {
    expect(isMappingComplete(MAPPING)).toBe(true);
  });

  it("lehnt ein Mapping ohne Pflichtfeld ab", () => {
    expect(isMappingComplete({ ...MAPPING, buyerEmail: undefined })).toBe(false);
  });

  it("akzeptiert fehlende optionale Felder", () => {
    expect(isMappingComplete({ ...MAPPING, description: undefined })).toBe(true);
  });
});
