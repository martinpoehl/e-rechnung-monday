import mondaySdk from "monday-sdk-js";
import type { MondayClientSdk } from "monday-sdk-js";

let sdk: MondayClientSdk | undefined;

/**
 * Meldet monday, dass die App für den Nutzer Wert erzeugt hat (Pflicht für
 * Marketplace-Apps; steuert u.a. Trial-/Nutzungs-Metriken). Best-effort.
 */
export function reportValueCreated(): void {
  try {
    sdk ??= mondaySdk();
    void sdk.execute("valueCreatedForUser");
  } catch {
    // Ausserhalb von monday (Tests, lokale Vorschau) still ignorieren.
  }
}
