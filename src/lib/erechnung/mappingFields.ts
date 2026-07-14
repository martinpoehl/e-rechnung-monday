import type { FieldMapping } from "./types";

export interface MappingField {
  key: keyof FieldMapping;
  required: boolean;
}

/** Rechnungsfelder in Anzeige-Reihenfolge; Beschriftungen kommen aus i18n (fieldLabels). */
export const MAPPING_FIELDS: MappingField[] = [
  { key: "invoiceNumber", required: true },
  { key: "buyerName", required: true },
  { key: "buyerAddress", required: true },
  { key: "buyerZip", required: true },
  { key: "buyerCity", required: true },
  { key: "buyerEmail", required: true },
  { key: "netAmount", required: true },
  { key: "serviceDate", required: true },
  { key: "description", required: false },
  { key: "buyerReference", required: false },
];

/** True, wenn alle Pflichtfelder auf eine Spalte gemappt sind. */
export function isMappingComplete(mapping: Partial<FieldMapping>): mapping is FieldMapping {
  return MAPPING_FIELDS.filter((f) => f.required).every((f) => !!mapping[f.key]);
}
