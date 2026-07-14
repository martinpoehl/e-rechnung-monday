import type { AppSettings, SellerSettings } from "../lib/erechnung/types";
import { LANGS, LANG_NAMES } from "../lib/i18n";
import type { UIStrings } from "../lib/i18n";

interface Props {
  settings: AppSettings;
  strings: UIStrings;
  onChange: (settings: AppSettings) => void;
}

/** Textfelder in Anzeige-Reihenfolge; Zahlungsziel und USt-Satz haben eigene Eingaben. */
const SELLER_TEXT_KEYS = [
  "name",
  "address",
  "zip",
  "city",
  "vatId",
  "email",
  "phone",
  "contactName",
  "iban",
] as const;

const PLACEHOLDERS: Record<(typeof SELLER_TEXT_KEYS)[number], string> = {
  name: "Muster GmbH",
  address: "Musterstrasse 1",
  zip: "10115",
  city: "Berlin",
  vatId: "DE123456789",
  email: "rechnung@firma.de",
  phone: "+49 30 1234567",
  contactName: "Max Muster",
  iban: "DE89 3704 0044 0532 0130 00",
};

/** MVP: Standard- und ermässigter Satz; 0 % (Kleinunternehmer u.a.) folgt in Phase 2. */
const VAT_RATES = [19, 7];

/** Einmalige Angaben zum Rechnungssteller – alles Pflichtfelder der XRechnung. */
export function SettingsForm({ settings, strings, onChange }: Props) {
  const setSeller = (key: keyof SellerSettings, value: string | number) =>
    onChange({ ...settings, seller: { ...settings.seller, [key]: value } });

  return (
    <fieldset style={{ border: "1px solid #797e93", borderRadius: 8, padding: "1rem" }}>
      <legend style={{ fontWeight: 600 }}>{strings.step1Legend}</legend>
      <p style={{ margin: "0 0 0.75rem", opacity: 0.75 }}>{strings.step1Hint}</p>
      <div style={{ display: "grid", gridTemplateColumns: "auto minmax(200px, 320px)", gap: "0.4rem 1rem", alignItems: "center" }}>
        {SELLER_TEXT_KEYS.map((key) => (
          <label key={key} style={{ display: "contents" }}>
            <span>{strings.sellerLabels[key]} *</span>
            <input
              type="text"
              value={settings.seller[key]}
              placeholder={PLACEHOLDERS[key]}
              onChange={(e) => setSeller(key, e.target.value)}
              style={{ padding: "0.3rem 0.5rem" }}
            />
          </label>
        ))}

        <span>{strings.sellerLabels.paymentTermsDays} *</span>
        <input
          type="number"
          min={0}
          value={settings.seller.paymentTermsDays}
          onChange={(e) => setSeller("paymentTermsDays", Number(e.target.value))}
          style={{ padding: "0.3rem 0.5rem" }}
        />

        <span>{strings.sellerLabels.vatRate} *</span>
        <select
          value={settings.seller.vatRate}
          onChange={(e) => setSeller("vatRate", Number(e.target.value))}
        >
          {VAT_RATES.map((rate) => (
            <option key={rate} value={rate}>
              {rate} %
            </option>
          ))}
        </select>

        <span>{strings.uiLangLabel}</span>
        <select
          value={settings.uiLanguage}
          onChange={(e) => onChange({ ...settings, uiLanguage: e.target.value as AppSettings["uiLanguage"] })}
        >
          <option value="auto">{strings.uiLangAuto}</option>
          {LANGS.map((lang) => (
            <option key={lang} value={lang}>
              {LANG_NAMES[lang]}
            </option>
          ))}
        </select>
      </div>
    </fieldset>
  );
}
