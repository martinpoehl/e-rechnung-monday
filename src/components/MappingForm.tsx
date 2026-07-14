import type { FieldMapping } from "../lib/erechnung/types";
import { MAPPING_FIELDS } from "../lib/erechnung/mappingFields";
import type { BoardColumn } from "../monday/board";
import type { UIStrings } from "../lib/i18n";

interface Props {
  columns: BoardColumn[];
  mapping: Partial<FieldMapping>;
  strings: UIStrings;
  onChange: (key: keyof FieldMapping, columnId: string) => void;
}

/** Pro Rechnungsfeld ein Dropdown mit den Board-Spalten. */
export function MappingForm({ columns, mapping, strings, onChange }: Props) {
  return (
    <fieldset style={{ border: "1px solid #797e93", borderRadius: 8, padding: "1rem" }}>
      <legend style={{ fontWeight: 600 }}>{strings.step2Legend}</legend>
      <p style={{ margin: "0 0 0.75rem", opacity: 0.75 }}>{strings.step2Hint}</p>
      <div style={{ display: "grid", gridTemplateColumns: "auto minmax(200px, 320px)", gap: "0.4rem 1rem", alignItems: "center" }}>
        {MAPPING_FIELDS.map((field) => (
          <label key={field.key} style={{ display: "contents" }}>
            <span>
              {strings.fieldLabels[field.key]}
              {field.required ? " *" : ""}
            </span>
            <select
              value={mapping[field.key] ?? ""}
              onChange={(e) => onChange(field.key, e.target.value)}
            >
              <option value="">{field.required ? strings.choose : strings.none}</option>
              {columns.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.title}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
