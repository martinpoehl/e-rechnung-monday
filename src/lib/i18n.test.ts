import { describe, expect, it } from "vitest";
import { LANGS, STRINGS, formatIssue, resolveLang } from "./i18n";
import { MAPPING_FIELDS } from "./erechnung/mappingFields";

describe("resolveLang", () => {
  it("erkennt monday-Sprachcodes inkl. Region", () => {
    expect(resolveLang("de")).toBe("de");
    expect(resolveLang("de-DE")).toBe("de");
    expect(resolveLang("en-US")).toBe("en");
  });

  it("fällt bei Unbekanntem/Fehlendem auf Englisch zurück", () => {
    expect(resolveLang("fr")).toBe("en");
    expect(resolveLang("es")).toBe("en");
    expect(resolveLang(undefined)).toBe("en");
    expect(resolveLang(null)).toBe("en");
  });
});

describe("STRINGS", () => {
  it("alle Sprachen haben exakt dieselben Schlüssel", () => {
    const shape = (obj: object): string =>
      JSON.stringify(
        Object.entries(obj)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([k, v]) => (typeof v === "object" && v !== null ? [k, shape(v)] : k)),
      );
    const reference = shape(STRINGS.de);
    for (const lang of LANGS) {
      expect(shape(STRINGS[lang]), `Sprache ${lang}`).toBe(reference);
    }
  });

  it("beschriftet jedes Mapping-Feld", () => {
    for (const lang of LANGS) {
      for (const field of MAPPING_FIELDS) {
        expect(STRINGS[lang].fieldLabels[field.key], `${lang}/${field.key}`).toBeTruthy();
      }
    }
  });
});

describe("formatIssue", () => {
  const s = STRINGS.de;

  it("übersetzt einfache Codes direkt", () => {
    expect(formatIssue({ code: "vat_id_invalid" }, s)).toBe(s.issues.vat_id_invalid);
    expect(formatIssue({ code: "amount_invalid" }, s)).toBe(s.issues.amount_invalid);
  });

  it("setzt Feldnamen in buyer_field_missing ein", () => {
    const msg = formatIssue({ code: "buyer_field_missing", field: "city" }, s);
    expect(msg).toContain(s.fieldNames.city);
    expect(msg).not.toContain("{field}");
  });

  it("setzt die Partei in zip_invalid ein", () => {
    const msg = formatIssue({ code: "zip_invalid", party: "buyer" }, s);
    expect(msg).toContain(s.party.buyer);
    expect(msg).not.toContain("{party}");
  });
});
