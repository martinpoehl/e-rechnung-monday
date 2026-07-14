# Marketplace-Listing – Texte & Checkliste

Stand 09.07.2026. Quelle: aktueller Projektstand, monday Developer Center / Submission-Formular und lokale App-Artefakte.

## App-Name (max. 30 Zeichen, ohne «monday»)

**Swiss QR-Rechnung** im Developer Center / **Swiss QR Invoice** im englischen Listing. Vor Submission konsistent entscheiden; Empfehlung: Developer-Center-Name nur ändern, wenn ohne Review-Risiko möglich. Listing-Text kann englisch bleiben.

## Short Description (max. 60 Zeichen)

EN: `Create compliant Swiss QR bills from your board items.` (55)

## Long Description (200–2500 Zeichen, EN primär)

```text
Swiss QR Invoice generates fully compliant Swiss QR bills (QR-Rechnung) directly from your monday.com boards — no exports, no external tools.

HOW IT WORKS
1. Enter your payee details once (company, address, IBAN or QR-IBAN) — they are stored securely in monday storage.
2. Map your board columns to the invoice fields. Matching columns are suggested automatically.
3. Click "Create PDF" next to any item to download a ready-to-send QR bill.

KEY FEATURES
• Compliant with the Swiss Payment Standards (SIX) — scannable by every Swiss banking app
• Supports IBAN and QR-IBAN with QR reference (QRR), with built-in validation of IBAN checksums, reference rules and field lengths
• Full A4 page with payment part, or payment-part-only PDF to attach to your own invoice
• Invoice language per customer: German, French, Italian or English
• App interface in DE / FR / IT / EN — follows your monday language automatically
• Privacy by design: PDFs are generated entirely in your browser. No customer or payment data ever leaves monday or reaches any third-party server.

MADE FOR SWITZERLAND
Built for Swiss and Liechtenstein companies that manage customers, projects or orders on monday.com and want to invoice with the official QR bill — without switching to a separate accounting tool.
```

(ca. 1200 Zeichen — innerhalb des Limits)

## Deutsche Variante (für DE-Absatz / Übersetzung)

```text
Swiss QR Invoice erzeugt vollständig konforme Schweizer QR-Rechnungen direkt aus deinen monday.com-Boards – ohne Export, ohne Zusatztools.

SO FUNKTIONIERT ES
1. Absenderdaten einmal erfassen (Firma, Adresse, IBAN oder QR-IBAN)
2. Board-Spalten den Rechnungsfeldern zuordnen – passende Spalten werden automatisch vorgeschlagen
3. Bei jedem Eintrag auf «PDF erstellen» klicken – fertig ist die versandbereite QR-Rechnung

FUNKTIONEN
• Konform mit den Swiss Payment Standards (SIX) – von jeder Schweizer Banking-App scannbar
• IBAN und QR-IBAN mit QR-Referenz (QRR), inkl. Validierung von Prüfziffern, Referenzregeln und Feldlängen
• Ganze A4-Seite mit Zahlteil oder nur Zahlteil zum Anhängen
• Rechnungssprache pro Kunde: Deutsch, Französisch, Italienisch, Englisch
• App-Oberfläche in DE / FR / IT / EN – folgt automatisch deiner monday-Sprache
• Datenschutz eingebaut: PDFs entstehen komplett im Browser. Keine Kunden- oder Zahlungsdaten verlassen monday oder erreichen einen Drittserver.
```

## Keywords (max. 10)

`invoice, qr bill, qr-rechnung, switzerland, swiss, billing, iban, payment, rechnung, facture`

## Kategorien (max. 3)

Finance / Accounting · Productivity · (dritte offenlassen oder «Operations»)

## Assets (Pflichtgrössen)

| Asset | Datei | Status |
|---|---|---|
| App-Icon 192×192 | `assets/icon-192.png` | ✅ fertig |
| Developer-Icon 192×192 | `assets/developer-icon-192.png` | ✅ fertig (MP-Monogramm) |
| App-Card 592×348 | `assets/app-card-592x348.png` | ✅ fertig |
| Galerie 3–5 Bilder 1920×960 | `assets/gallery/` | ✅ 4 Screenshots vorbereitet |
| Demo-Video ≤120 s, ≤50 MB | externer teilbarer Link | ⬜ echtes monday-Screen-Recording noch offen |

### Galerie-Screenshot-Plan (1920×960, im Board aufnehmen)

1. Die 3-Schritte-View komplett im Board (Schritt 1–3 sichtbar)
2. Schritt 2 mit Auto-Mapping-Vorschlägen im Dropdown
3. Erfolgsmoment: Browser/PDF-Download sichtbar machen
4. Danach das heruntergeladene A4-PDF öffnen und den Zahlteil kurz zeigen
5. Optional: Sprachwechsel (gleiche View auf FR/IT)

## Support & Links (Pflichtfelder)

| Feld | Wert | Status |
|---|---|---|
| Support-E-Mail | `martinpoehl@me.com` | ✅ fuer Free-Demand-Test |
| Website / Entity Website | `https://v129801be4ddd53528ff3ff907b76418c.cdn2.monday.app/help/` | ✅ monday-CDN |
| How-to-Seite (HTTPS) | `https://v129801be4ddd53528ff3ff907b76418c.cdn2.monday.app/help/` | ✅ |
| Terms of Service | `https://v129801be4ddd53528ff3ff907b76418c.cdn2.monday.app/help/terms.html` | ✅ Entwurf, Martin akzeptiert rechtlich selbst |
| Privacy Policy | `https://v129801be4ddd53528ff3ff907b76418c.cdn2.monday.app/help/privacy.html` | ✅ |
| Demo-Link (nur fürs Review) | teilbarer Link zum echten monday-Screen-Recording | ⬜ noch offen |

## Technische Pflichtpunkte (Product Requirements)

- [x] `valueCreatedForUser`-Event nach erfolgreichem PDF-Download (v3)
- [x] How-to-Link in der App (Footer, v3)
- [x] Pagination für grosse Boards (items_page-Cursor)
- [x] Mehrere Spalten gleichen Typs (freie Zuordnung per Dropdown)
- [ ] Verhalten für Viewer/Guests prüfen (Storage-Schreibrechte)
- [x] Install-Link notiert: `https://auth.monday.com/oauth2/authorize?client_id=b57ba9876176a00c088edb6140d64a66&response_type=install`

## Submission (Reihenfolge)

1. Echtes Demo-Video in monday aufnehmen und als teilbaren Link bereitstellen. Keine Slideshow und keine generierte QR-Vorschau verwenden; die App lädt ein PDF herunter.
2. Submission-Formular mit den vorbereiteten Antworten aus dem Vault ausfüllen: `02 Projekte/Swiss QR-Rechnung für monday/Submission-Formular Antworten.md`.
3. **Pricing: Free** wählen.
4. App Review Checklist durchgehen.
5. Martin akzeptiert die rechtlichen Checkboxen/Signatur selbst und sendet das Formular ab.
6. Antwort in ~72 Arbeitsstunden; Rückfragen kommen über ein geteiltes monday-Board.
