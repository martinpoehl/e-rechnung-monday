import { useEffect, useState } from "react";
import type { AppSettings, FieldMapping, MondayItem } from "../lib/erechnung/types";
import { buildInvoiceData } from "../lib/erechnung/buildData";
import { validateInvoiceData } from "../lib/erechnung/validate";
import { generateInvoiceXml } from "../lib/erechnung/generateXml";
import { isMappingComplete } from "../lib/erechnung/mappingFields";
import { suggestMapping } from "../lib/erechnung/autoMapping";
import { STRINGS, formatIssue, resolveLang } from "../lib/i18n";
import { getBoardColumns, getBoardItems } from "../monday/board";
import type { BoardColumn } from "../monday/board";
import {
  DEFAULT_SETTINGS,
  loadMapping,
  loadSettings,
  saveMapping,
  saveSettings,
} from "../monday/mappingStorage";
import { reportValueCreated } from "../monday/events";
import { MappingForm } from "./MappingForm";
import { SettingsForm } from "./SettingsForm";

interface Props {
  boardId: string | number;
  dark?: boolean;
  /** Sprachcode des monday-Nutzers (z.B. "de", "en-US"). */
  mondayLang?: string;
}

function downloadXml(xml: string, filename: string) {
  const blob = new Blob([xml], { type: "application/xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

const safeFilename = (name: string) =>
  `XRechnung ${name}`.replace(/[\\/:*?"<>|]+/g, "-").slice(0, 120) + ".xml";

// Alle Textfelder gefüllt und Zahlungsziel plausibel – Details prüft validateInvoiceData.
const sellerComplete = (s: AppSettings) =>
  Object.entries(s.seller).every(([key, v]) =>
    typeof v === "string" ? v.trim() !== "" : key !== "paymentTermsDays" || v >= 0,
  );

export function BoardView({ boardId, dark = false, mondayLang }: Props) {
  const warnColor = dark ? "#f4c94e" : "#8a6d00";
  const errorColor = dark ? "#f0666b" : "#b00020";
  const okColor = dark ? "#33d391" : "#007a5a";

  const [columns, setColumns] = useState<BoardColumn[]>([]);
  const [items, setItems] = useState<MondayItem[]>([]);
  const [mapping, setMapping] = useState<Partial<FieldMapping>>({});
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [itemErrors, setItemErrors] = useState<Record<string, string[]>>({});
  const [doneItem, setDoneItem] = useState<string | null>(null);
  const [busyItem, setBusyItem] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const lang = settings.uiLanguage === "auto" ? resolveLang(mondayLang) : settings.uiLanguage;
  const strings = STRINGS[lang];

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError(null);
    Promise.all([getBoardColumns(boardId), getBoardItems(boardId), loadMapping(), loadSettings()])
      .then(([cols, boardItems, savedMapping, savedSettings]) => {
        if (cancelled) return;
        setColumns(cols);
        setItems(boardItems);
        setSettings(savedSettings);
        // Gespeichertes Mapping gewinnt; Lücken werden aus den Spaltennamen vorgeschlagen.
        setMapping({ ...suggestMapping(cols), ...savedMapping });
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err instanceof Error ? err.message : String(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [boardId]);

  const onMappingChange = (key: keyof FieldMapping, columnId: string) => {
    const next = { ...mapping, [key]: columnId || undefined };
    setMapping(next);
    // Persistenz best-effort; UI-State ist führend.
    void saveMapping(next).catch(() => {});
  };

  const onSettingsChange = (next: AppSettings) => {
    setSettings(next);
    void saveSettings(next).catch(() => {});
  };

  const ready = isMappingComplete(mapping) && sellerComplete(settings);

  const generate = async (item: MondayItem) => {
    if (!isMappingComplete(mapping)) return;
    setBusyItem(item.id);
    setDoneItem(null);
    try {
      const data = buildInvoiceData(item, mapping, settings.seller);
      const issues = validateInvoiceData(data);
      if (issues.length > 0) {
        setItemErrors((prev) => ({
          ...prev,
          [item.id]: issues.map((i) => formatIssue(i, strings)),
        }));
        return;
      }
      setItemErrors((prev) => ({ ...prev, [item.id]: [] }));
      const xml = await generateInvoiceXml(data);
      downloadXml(xml, safeFilename(data.number || item.name));
      setDoneItem(item.id);
      reportValueCreated();
    } catch (err) {
      setItemErrors((prev) => ({
        ...prev,
        [item.id]: [err instanceof Error ? err.message : String(err)],
      }));
    } finally {
      setBusyItem(null);
    }
  };

  if (loading) return <p>{strings.loading}</p>;
  if (loadError) return <p style={{ color: errorColor }}>{strings.errorPrefix}: {loadError}</p>;

  return (
    <div style={{ display: "grid", gap: "1.25rem", maxWidth: 720 }}>
      <SettingsForm settings={settings} strings={strings} onChange={onSettingsChange} />
      <MappingForm columns={columns} mapping={mapping} strings={strings} onChange={onMappingChange} />

      <section style={{ border: "1px solid #797e93", borderRadius: 8, padding: "1rem" }}>
        <h2 style={{ fontSize: "1rem", margin: "0 0 0.25rem", fontWeight: 600 }}>
          {strings.step3Title}
        </h2>
        {!ready && (
          <p style={{ color: warnColor, margin: "0.25rem 0 0.75rem" }}>
            {!sellerComplete(settings) && `${strings.hintSeller} `}
            {!isMappingComplete(mapping) && strings.hintMapping}
          </p>
        )}
        {ready && (
          <p style={{ margin: "0.25rem 0 0.75rem", opacity: 0.75 }}>{strings.readyHint}</p>
        )}
        {items.length === 0 && <p>{strings.noItems}</p>}
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "0.4rem" }}>
          {items.map((item) => (
            <li
              key={item.id}
              style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}
            >
              <button
                onClick={() => void generate(item)}
                disabled={!ready || busyItem === item.id}
                style={{ padding: "0.3rem 0.75rem" }}
              >
                {busyItem === item.id ? strings.btnBusy : strings.btnCreate}
              </button>
              <span>{item.name}</span>
              {doneItem === item.id && <span style={{ color: okColor }}>{strings.done}</span>}
              {(itemErrors[item.id] ?? []).length > 0 && (
                <span style={{ color: errorColor }}>{itemErrors[item.id].join("; ")}</span>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
