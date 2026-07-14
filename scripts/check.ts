import { isIBANValid, isQRIBAN, isQRReferenceValid, isQRReference } from "swissqrbill/utils";
const iban = "CH4431999123000889012";
const ref = "210000000003139471430009017";
console.log("IBAN gültig:", isIBANValid(iban));
console.log("ist QR-IBAN:", isQRIBAN(iban));
console.log("QR-Referenz gültig:", isQRReferenceValid(ref));
console.log("ist QR-Referenz:", isQRReference(ref));
