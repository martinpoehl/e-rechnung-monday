import { zugferd } from "node-zugferd";
import { EN16931 } from "node-zugferd/profile/en16931";
import type { InvoiceData } from "./types";

/** BT-24: CustomizationID der XRechnung 3.0 – muss exakt dieser URN sein, sonst greift kein KoSIT-Szenario. */
export const XRECHNUNG_CUSTOMIZATION_ID =
  "urn:cen.eu:en16931:2017#compliant#urn:xeinkauf.de:kosit:xrechnung_3.0";

/** BT-23: Business Process, von BR-DE-21 verlangt; Peppol-Billing ist der übliche Default. */
export const BUSINESS_PROCESS = "urn:fdc:peppol.eu:2017:poacc:billing:01:1.0";

// strict: false schaltet die XSD-Prüfung der Library ab (bräuchte Java) – die
// verbindliche Prüfung übernimmt der KoSIT-Validator im CI-Gate.
const invoicer = zugferd({ profile: EN16931, strict: false });

/** Beträge immer mit 2 Nachkommastellen serialisieren, damit keine Float-Artefakte ins XML gelangen. */
const amt = (n: number): string => n.toFixed(2);

/**
 * Erzeugt aus den Rechnungsdaten ein XRechnung-3.0-konformes CII-XML.
 * Feld-Mapping identisch zum KoSIT-validierten Spike vom 13.07.2026.
 */
export async function generateInvoiceXml(d: InvoiceData): Promise<string> {
  const doc = invoicer.create({
    specificationIdentifier: XRECHNUNG_CUSTOMIZATION_ID,
    businessProcessType: BUSINESS_PROCESS,
    number: d.number,
    typeCode: "380",
    issueDate: d.issueDate,
    transaction: {
      tradeAgreement: {
        buyerReference: d.buyerReference,
        seller: {
          name: d.seller.name,
          postalAddress: {
            countryCode: "DE",
            city: d.seller.city,
            postCode: d.seller.zip,
            line1: d.seller.address,
          },
          taxRegistration: { vatIdentifier: d.seller.vatId },
          electronicAddress: { value: d.seller.email, schemeIdentifier: "EM" },
          tradeContact: {
            name: d.seller.contactName,
            phoneNumber: d.seller.phone,
            emailAddress: d.seller.email,
          },
        },
        buyer: {
          name: d.buyer.name,
          postalAddress: {
            countryCode: d.buyer.country,
            city: d.buyer.city,
            postCode: d.buyer.zip,
            line1: d.buyer.address,
          },
          electronicAddress: { value: d.buyer.email, schemeIdentifier: "EM" },
        },
      },
      tradeDelivery: {},
      tradeSettlement: {
        currencyCode: d.currency,
        vatBreakdown: [
          {
            typeCode: "VAT",
            categoryCode: "S",
            rateApplicablePercent: d.vatRate,
            basisAmount: amt(d.netAmount),
            calculatedAmount: amt(d.vatAmount),
          },
        ],
        // BR-DE-TMP-32: Leistungsdatum als eintägige Abrechnungsperiode (BG-14) –
        // das BASIC-WL-Schema der Library kennt kein BT-72-Einzeldatum.
        ...(d.serviceDate
          ? { invoicingPeriod: { startDate: d.serviceDate, endDate: d.serviceDate } }
          : {}),
        paymentInstruction: {
          typeCode: "58",
          transfers: [{ paymentAccountIdentifier: d.seller.iban.replace(/\s/g, "") }],
        },
        paymentTerms: {
          description: `Zahlbar innerhalb von ${d.seller.paymentTermsDays} Tagen ohne Abzug.`,
          dueDate: d.dueDate,
        },
        monetarySummation: {
          lineTotalAmount: amt(d.netAmount),
          taxBasisTotalAmount: amt(d.netAmount),
          taxTotal: { amount: amt(d.vatAmount), currencyCode: d.currency },
          grandTotalAmount: amt(d.grossAmount),
          duePayableAmount: amt(d.grossAmount),
        },
      },
      line: [
        {
          identifier: "1",
          tradeProduct: { name: d.itemDescription },
          tradeAgreement: { netTradePrice: { chargeAmount: amt(d.netAmount) } },
          tradeDelivery: { billedQuantity: { amount: 1, unitMeasureCode: "C62" } },
          tradeSettlement: {
            tradeTax: { typeCode: "VAT", categoryCode: "S", rateApplicablePercent: d.vatRate },
            monetarySummation: { lineTotalAmount: amt(d.netAmount) },
          },
        },
      ],
    },
  });
  return doc.toXML();
}
