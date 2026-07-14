import { writeFileSync } from "node:fs";
import { buildQrBillData } from "../src/lib/qrbill/buildData.js";
import { sampleCreditor, sampleItem, sampleMapping } from "../src/lib/qrbill/fixtures.js";
import { generateQrBillPdf } from "../src/lib/qrbill/generatePdf.js";

const bytes = await generateQrBillPdf(buildQrBillData(sampleItem, sampleMapping, sampleCreditor));
writeFileSync("sample-qr-bill.pdf", bytes);
console.log(`written sample-qr-bill.pdf (${bytes.length} bytes)`);
