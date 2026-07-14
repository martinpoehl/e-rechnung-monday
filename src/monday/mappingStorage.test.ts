import { describe, expect, it } from "vitest";
import {
  DEFAULT_SETTINGS,
  loadMapping,
  loadSettings,
  saveMapping,
  saveSettings,
} from "./mappingStorage";
import type { KeyValueStorage } from "./mappingStorage";
import { MAPPING, SELLER } from "../lib/erechnung/fixtures";

function memoryStorage(initial: Record<string, string> = {}): KeyValueStorage {
  const store = new Map(Object.entries(initial));
  return {
    get: async (key) => store.get(key) ?? null,
    set: async (key, value) => void store.set(key, value),
  };
}

describe("Mapping-Persistenz", () => {
  it("liefert ein leeres Mapping, wenn nichts gespeichert ist", async () => {
    expect(await loadMapping(memoryStorage())).toEqual({});
  });

  it("überlebt einen Speichern-Laden-Roundtrip", async () => {
    const storage = memoryStorage();
    await saveMapping(MAPPING, storage);
    expect(await loadMapping(storage)).toEqual(MAPPING);
  });

  it("ignoriert kaputtes JSON", async () => {
    const storage = memoryStorage({ fieldMapping: "{kaputt" });
    expect(await loadMapping(storage)).toEqual({});
  });
});

describe("Settings-Persistenz", () => {
  it("liefert Defaults, wenn nichts gespeichert ist", async () => {
    const settings = await loadSettings(memoryStorage());
    expect(settings).toEqual(DEFAULT_SETTINGS);
    expect(settings.seller.paymentTermsDays).toBe(30);
    expect(settings.seller.vatRate).toBe(19);
    expect(settings.uiLanguage).toBe("auto");
  });

  it("überlebt einen Speichern-Laden-Roundtrip", async () => {
    const storage = memoryStorage();
    await saveSettings({ seller: SELLER, uiLanguage: "de" }, storage);
    expect(await loadSettings(storage)).toEqual({ seller: SELLER, uiLanguage: "de" });
  });

  it("füllt fehlende Felder älterer Stände mit Defaults auf", async () => {
    const storage = memoryStorage({ appSettings: JSON.stringify({ seller: { name: "Nur Name" } }) });
    const settings = await loadSettings(storage);
    expect(settings.seller.name).toBe("Nur Name");
    expect(settings.seller.paymentTermsDays).toBe(30);
    expect(settings.uiLanguage).toBe("auto");
  });

  it("verwirft ungültige Sprachwerte", async () => {
    const storage = memoryStorage({ appSettings: JSON.stringify({ uiLanguage: "fr" }) });
    expect((await loadSettings(storage)).uiLanguage).toBe("auto");
  });
});
