import { writeFileSync } from "node:fs";
import { isIBANValid, isQRIBAN } from "swissqrbill/utils";
import { generateQrBillPdf } from "../src/lib/qrbill/generatePdf.js";
import type { QrBillData } from "../src/lib/qrbill/types.js";

const iban = "CH6109000000162981261";
console.log("IBAN gültig:", isIBANValid(iban), "| ist QR-IBAN:", isQRIBAN(iban));

const data: QrBillData = {
  currency: "CHF",
  amount: 250,
  creditor: { account: iban, name: "Pöhl IT Solutions", address: "Musterstrasse 1", zip: 8424, city: "Embrach", country: "CH" },
  debtor:   { name: "Muster AG", address: "Beispielweg 2", zip: 8000, city: "Zürich", country: "CH" },
};
const bytes = await generateQrBillPdf(data);
writeFileSync("sample-qr-bill-real.pdf", bytes);
console.log(`written sample-qr-bill-real.pdf (${bytes.length} bytes)`);
