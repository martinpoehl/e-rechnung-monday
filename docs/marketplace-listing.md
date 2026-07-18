# Marketplace-Listing – Texte & Checkliste (E-Rechnung / XRechnung)

Stand 19.07.2026. Quelle: Projektstand E-Rechnung, K3-Validierung (Vault: `03 Bereiche/Selbständigkeit/K3-Validierung XRechnung für monday.md`) und das Submission-Playbook der QR-App.

## App-Name (max. 30 Zeichen, ohne «monday»)

Empfehlung: **«XRechnung E-Rechnung»** (20 Zeichen) – beide deutschen Suchbegriffe direkt im Titel, denn der Marketplace matcht Titel-Keywords am stärksten (Faktoora scheitert genau daran: nur englisches Listing, matcht «XRechnung»/«E-Rechnung» nicht). UI-Titel der App bleibt «E-Invoice – XRechnung from board data» / «E-Rechnung – XRechnung aus Board-Daten».

## Short Description (max. 60 Zeichen)

EN: `Create compliant German e-invoices (XRechnung) from boards.` (59)

## Long Description (200–2500 Zeichen, EN primär)

```text
E-Invoice (XRechnung) generates fully compliant German e-invoices directly from your monday.com boards — no exports, no sync, no second subscription.

WHY NOW
Germany mandates structured B2B e-invoices (EN 16931, e.g. XRechnung): receiving since 2025, issuing progressively from 2027/2028. A plain PDF invoice will no longer qualify.

HOW IT WORKS
1. Enter your seller details once (company, address, VAT ID, IBAN, payment terms, VAT rate) — stored securely in monday storage.
2. Map your board columns to the invoice fields. Matching columns are suggested automatically.
3. Click "Create XRechnung" next to any item to download a ready-to-send XRechnung 3.0 XML file.

KEY FEATURES
• Compliant with XRechnung 3.0 (EN 16931, UN/CEFACT CII) — validated against the official KoSIT validator
• All German mandatory fields built in: seller VAT ID, contact details, buyer reference (BT-10), service date
• Built-in validation before download: VAT ID format, IBAN checksum, postal codes, email, amounts
• Works on ANY board — no monday CRM subscription required
• App interface in German and English — follows your monday language automatically
• Privacy by design: the XML is generated entirely in your browser. No customer or payment data ever leaves monday or reaches any third-party server.

MADE FOR GERMANY
Built for companies that manage customers, orders or projects on monday.com and need to issue legally compliant German B2B e-invoices — without switching to a separate accounting tool or paying for a second SaaS.
```

(ca. 1500 Zeichen — innerhalb des Limits)

## Deutsche Variante (für DE-Absatz / Übersetzung)

```text
E-Rechnung (XRechnung) erzeugt vollständig konforme deutsche E-Rechnungen direkt aus deinen monday.com-Boards – ohne Export, ohne Sync, ohne Zweit-Abo.

WARUM JETZT
Deutschland verlangt strukturierte B2B-E-Rechnungen (EN 16931, z.B. XRechnung): Empfang seit 2025 Pflicht, Ausstellung stufenweise ab 2027/2028. Eine reine PDF-Rechnung genügt dann nicht mehr.

SO FUNKTIONIERT ES
1. Verkäuferdaten einmal erfassen (Firma, Adresse, USt-IdNr, IBAN, Zahlungsziel, USt-Satz)
2. Board-Spalten den Rechnungsfeldern zuordnen – passende Spalten werden automatisch vorgeschlagen
3. Bei jedem Eintrag auf «XRechnung erstellen» klicken – fertig ist die XRechnung-3.0-XML-Datei

FUNKTIONEN
• Konform mit XRechnung 3.0 (EN 16931, UN/CEFACT CII) – geprüft gegen den offiziellen KoSIT-Validator
• Alle deutschen Pflichtfelder eingebaut: USt-IdNr, Kontaktdaten, Käufer-Referenz (BT-10), Leistungsdatum
• Validierung vor dem Download: USt-IdNr-Format, IBAN-Prüfsumme, PLZ, E-Mail, Beträge
• Funktioniert auf JEDEM Board – kein monday-CRM-Abo nötig
• App-Oberfläche in Deutsch und Englisch – folgt automatisch deiner monday-Sprache
• Datenschutz eingebaut: Die XML entsteht komplett im Browser. Keine Kunden- oder Zahlungsdaten verlassen monday oder erreichen einen Drittserver.
```

## Abgrenzung (aus K3-Validierung, für Review-Rückfragen)

- **vs. monday-natives Quotes & Invoices:** nur im CRM-Produkt, reine PDFs ohne Steuer-/Compliance-Felder (keine USt-IdNr, keine Leitweg-ID, kein XML) → für deutsches B2B ab 01.01.2027 unbrauchbar. Diese App erzeugt EN-16931-konforme XRechnung aus jedem beliebigen Board – auch ohne CRM-Abo.
- **vs. Faktoora (einziger Nachbar):** Sync-Connector zum eigenen SaaS (Doppel-Abo €9–129/Mt), synct Rechnungen **aus** Faktoora **in** Boards, erzeugt keine E-Rechnungen aus Board-Daten.

## Keywords (max. 10)

`xrechnung, e-rechnung, e-invoice, zugferd, germany, deutschland, rechnung, invoice, en 16931, billing`

## Kategorien (max. 3)

Finance / Accounting · Productivity · (dritte offenlassen)

## Assets (Pflichtgrössen) – noch zu erstellen

| Asset | Datei | Status |
|---|---|---|
| App-Icon 192×192 | `assets/icon-192.png` | ⬜ neu gestalten (nicht QR-Icon wiederverwenden) |
| Developer-Icon 192×192 | `assets/developer-icon-192.png` | ✅ MP-Monogramm aus QR-App übernehmbar |
| App-Card 592×348 | `assets/app-card-592x348.png` | ⬜ |
| Galerie 3–5 Bilder 1920×960 | `assets/gallery/` | ⬜ nach Deploy im Demo-Board aufnehmen |
| Demo-Video ≤120 s, ≤50 MB | externer teilbarer Link | ⬜ Playwright-Pipeline der QR-App wiederverwenden (`docs/demo-video-briefing.md`) |

### Galerie-Screenshot-Plan (1920×960, im Demo-Board aufnehmen)

1. Die 3-Schritte-View komplett im Board (Schritt 1–3 sichtbar)
2. Schritt 2 mit Auto-Mapping-Vorschlägen im Dropdown
3. Erfolgsmoment: XML-Download sichtbar machen
4. Die heruntergeladene XML kurz zeigen (z.B. im Editor mit hervorgehobenen Pflichtfeldern) oder KoSIT-Report
5. Optional: Sprachwechsel DE/EN

## Support & Links (Pflichtfelder)

| Feld | Wert | Status |
|---|---|---|
| Support-E-Mail | `martinpoehl@me.com` | ✅ wie QR-App |
| Website / Entity Website | `<CDN-URL>/help/index.html` | ⬜ URL entsteht beim Deploy; **immer mit `index.html`** – `/help/` allein liefert die leere App-Hülle (weisse Seite, QR-Erfahrung) |
| How-to-Seite (HTTPS) | `<CDN-URL>/help/index.html` | ⬜ Seite fertig in `public/help/` |
| Terms of Service | `<CDN-URL>/help/terms.html` | ⬜ Seite fertig, Martin akzeptiert rechtlich selbst |
| Privacy Policy | `<CDN-URL>/help/privacy.html` | ⬜ Seite fertig |
| Demo-Link (nur fürs Review) | teilbarer Link zum echten monday-Screen-Recording | ⬜ |

## Technische Pflichtpunkte (Product Requirements)

- [x] `valueCreatedForUser`-Event nach erfolgreichem XML-Download (`src/monday/events.ts`)
- [x] How-to-Link in der App (Footer, `./help/index.html`)
- [x] Pagination für grosse Boards (items_page-Cursor, `src/monday/board.ts`)
- [x] Mehrere Spalten gleichen Typs (freie Zuordnung per Dropdown)
- [ ] Verhalten für Viewer/Guests prüfen (Storage-Schreibrechte) – gleicher offener Punkt wie bei der QR-App
- [ ] Install-Link nach Registrierung hier notieren

## Submission (Reihenfolge, Playbook der QR-App)

1. App im Developer Center registrieren (Board-View-Feature), Build via apps-cli auf monday-CDN deployen.
2. In-monday-Test auf Demo-Board mit deutschen Beispieldaten; XML gegen KoSIT-Validator gegenprüfen.
3. Echtes Demo-Video aufnehmen (keine Slideshow; die App lädt eine XML herunter) und als teilbaren Link bereitstellen.
4. Submission-Formular mit den Antworten nach dem Muster der QR-App ausfüllen (Vault: `02 Projekte/Swiss QR-Rechnung für monday/Submission-Formular Antworten.md`); Mobile = No, AI/LLM = None, Built using monday code = Yes.
5. **Pricing: Free** (Demand-Test, Gates: ≥ 10 Installs + ≥ 3 aktive Accounts in 30 Tagen → Pro-Tier).
6. Martin akzeptiert die rechtlichen Checkboxen/Signatur selbst und sendet ab. Antwort in ~72 Arbeitsstunden; Rückfragen über geteiltes monday-Board.
