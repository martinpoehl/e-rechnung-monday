import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { buildInvoiceData } from "./buildData";
import { ISSUE_DATE, ITEM, MAPPING, SELLER } from "./fixtures";
import { generateInvoiceXml } from "./generateXml";

// Verbindliches Compliance-Gate: Die generierte Rechnung muss den offiziellen
// KoSIT-Validator (XRechnung 3.0.2) bestehen. Setup via scripts/kosit-setup.sh;
// ohne Java oder Cache überspringt sich der Test selbst (lokal wie im CI sichtbar).
const CACHE = process.env.KOSIT_CACHE ?? join(process.env.HOME ?? "", ".cache/kosit-validator");
const JAR = join(CACHE, "validator.jar");
const CONFIG = join(CACHE, "xr-config");

const hasJava = (() => {
  try {
    execFileSync("java", ["-version"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
})();
const ready = hasJava && existsSync(JAR) && existsSync(join(CONFIG, "scenarios.xml"));

describe.skipIf(!ready)("KoSIT-Gate (Integration)", () => {
  it("Fixture-Rechnung besteht den Validator als XRechnung 3.0 (ACCEPTABLE)", async () => {
    const xml = await generateInvoiceXml(buildInvoiceData(ITEM, MAPPING, SELLER, ISSUE_DATE));
    const file = join(mkdtempSync(join(tmpdir(), "kosit-")), "fixture.xml");
    writeFileSync(file, xml);

    let output = "";
    try {
      output = execFileSync(
        "java",
        ["-jar", JAR, "-s", join(CONFIG, "scenarios.xml"), "-r", CONFIG, file],
        { encoding: "utf8" },
      );
    } catch (e) {
      // Validator beendet mit Exit-Code ≠ 0 bei REJECT – Output trotzdem auswerten.
      const err = e as { stdout?: string; stderr?: string };
      output = (err.stdout ?? "") + (err.stderr ?? "");
    }

    expect(output).toContain("Acceptable:  1");
    expect(output).not.toContain("Rejected:  1");
  }, 120_000);
});
