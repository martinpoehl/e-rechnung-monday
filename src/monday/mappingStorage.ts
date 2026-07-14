import mondaySdk from "monday-sdk-js";
import type { MondayClientSdk } from "monday-sdk-js";
import type { AppSettings, FieldMapping, SellerSettings } from "../lib/erechnung/types";

const STORAGE_KEY = "fieldMapping";
const SETTINGS_KEY = "appSettings";

const DEFAULT_SELLER: SellerSettings = {
  name: "",
  address: "",
  zip: "",
  city: "",
  vatId: "",
  email: "",
  phone: "",
  contactName: "",
  iban: "",
  paymentTermsDays: 30,
  vatRate: 19,
};

export const DEFAULT_SETTINGS: AppSettings = {
  seller: DEFAULT_SELLER,
  uiLanguage: "auto",
};

const LANG_VALUES = ["de", "en"] as const;
const isLang = (v: unknown): v is (typeof LANG_VALUES)[number] =>
  typeof v === "string" && (LANG_VALUES as readonly string[]).includes(v);

/** Schlanke Key-Value-Sicht auf monday.storage.instance, injizierbar für Tests. */
export interface KeyValueStorage {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
}

let sdk: MondayClientSdk | undefined;

const mondayStorage: KeyValueStorage = {
  async get(key) {
    sdk ??= mondaySdk();
    const res = await sdk.storage.instance.getItem(key);
    const value = (res as any)?.data?.value;
    return typeof value === "string" ? value : null;
  },
  async set(key, value) {
    sdk ??= mondaySdk();
    await sdk.storage.instance.setItem(key, value);
  },
};

export async function loadMapping(
  storage: KeyValueStorage = mondayStorage,
): Promise<Partial<FieldMapping>> {
  const raw = await storage.get(STORAGE_KEY);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

export async function saveMapping(
  mapping: Partial<FieldMapping>,
  storage: KeyValueStorage = mondayStorage,
): Promise<void> {
  await storage.set(STORAGE_KEY, JSON.stringify(mapping));
}

export async function loadSettings(
  storage: KeyValueStorage = mondayStorage,
): Promise<AppSettings> {
  const raw = await storage.get(SETTINGS_KEY);
  if (!raw) return structuredClone(DEFAULT_SETTINGS);
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return structuredClone(DEFAULT_SETTINGS);
    // Fehlende Felder mit Defaults auffüllen (ältere/teilweise gespeicherte Stände).
    const seller = { ...DEFAULT_SELLER, ...(parsed.seller ?? {}) };
    seller.paymentTermsDays = Number(seller.paymentTermsDays) || DEFAULT_SELLER.paymentTermsDays;
    seller.vatRate = Number(seller.vatRate) || DEFAULT_SELLER.vatRate;
    return {
      seller,
      uiLanguage:
        parsed.uiLanguage === "auto" || isLang(parsed.uiLanguage)
          ? parsed.uiLanguage
          : DEFAULT_SETTINGS.uiLanguage,
    };
  } catch {
    return structuredClone(DEFAULT_SETTINGS);
  }
}

export async function saveSettings(
  settings: AppSettings,
  storage: KeyValueStorage = mondayStorage,
): Promise<void> {
  await storage.set(SETTINGS_KEY, JSON.stringify(settings));
}
