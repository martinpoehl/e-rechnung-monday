# E-Rechnung für monday.com (XRechnung)

monday.com-Board-View-App, die aus Board-Daten **EN-16931-konforme deutsche E-Rechnungen (XRechnung 3.0, CII)** erzeugt – Pflichtformat für B2B in Deutschland ab 01.01.2027 (Umsatz > 800 k€) bzw. 01.01.2028 (alle).

Schwester-App von [swiss-qr-monday](https://github.com/martinpoehl/swiss-qr-monday); gleiche Architektur (React + Vite, Engine als reine TS-Library, komplett client-seitig – keine Server-Komponente, keine Datenweitergabe).

## Stand (MVP-Kern, 14.07.2026)

- [x] Engine: Board-Item → Rechnungsdaten (deutsche Betrags-/Datumsformate, USt-Berechnung, BT-10-Fallback)
- [x] XRechnung-3.0-XML-Generator (`node-zugferd`, Profil EN 16931, CII)
- [x] Deutsche Pflichtfeld-Validierung mit verständlichen Meldungen (DE/EN)
- [x] Mapping-UI mit Auto-Vorschlägen, Verkäufer-Einstellungen, XML-Download
- [x] **KoSIT-Gate:** generierte Fixture besteht den offiziellen Validator (Schema + Schematron, XRechnung 3.0.2)
- [ ] monday-App-Registrierung, Deployment, Demo-Board, Listing (Texte/Screenshots/Help)
- [ ] Phase 2: ZUGFeRD (PDF/A-3), USt 0 % / Kleinunternehmer, Perioden-Mapping, Gutschriften

## Entwicklung

```bash
npm install
npm run check        # vitest + tsc
npm run dev          # Dev-Server (Port 8301)
npm run build        # Produktions-Build (dist/)
```

## KoSIT-Validierungs-Gate

Der Integrationstest `src/lib/erechnung/kosit.integration.test.ts` jagt die generierte
Fixture-Rechnung durch den offiziellen KoSIT-Validator. Einmalig einrichten:

```bash
./scripts/kosit-setup.sh   # lädt Validator 1.6.2 + XRechnung-Config 3.0.2 nach ~/.cache/kosit-validator
```

Ohne Java oder Cache überspringt sich der Test selbst.

## Architektur-Notizen

- `src/lib/erechnung/` – Engine (types, buildData, generateXml, validate, autoMapping); UI-frei und einzeln getestet.
- `strict: false` bei node-zugferd: die XSD-Prüfung der Library braucht Java und ist im Browser
  weder möglich noch nötig – die verbindliche Prüfung macht das KoSIT-Gate im CI.
- `vite.config.ts` externalisiert `xsd-schema-validator` (nur vom nie erreichten strict-Pfad importiert).
- Bekannte Punkte: Bundle ~1.3 MB (Code-Splitting offen); Help-Site (public/help) ist noch die der QR-App und wird mit dem Listing ersetzt.
