# Demo video briefing

Goal: create a short, real screen recording for the monday Marketplace submission. Keep it under 120 seconds. No marketing voiceover needed; a clean screen recording is enough.

Important: do not use a slideshow or a generated storyboard as the submission demo. The reviewer should see the actual app running inside monday. The app does not display a QR code preview at the end; it downloads a PDF. After the download, open the PDF briefly and show the Swiss payment part.

## Setup

- Use a monday test board with one realistic Swiss invoice item.
- Board columns should include debtor name, street, postal code, city, amount, IBAN/QR-IBAN and optional reference.
- Use non-sensitive dummy data only.
- Browser zoom around 100%; hide unrelated tabs/bookmarks if possible.

## Recording flow

1. Show the installed app as a board view: “Swiss QR-Rechnung” / “Swiss QR Invoice”.
2. Show payee settings: company/address/IBAN, language and PDF format.
3. Show the column mapping dropdowns with auto-suggested fields.
4. Click “Create PDF” / “QR-Rechnung erstellen” for one item.
5. Show the browser/PDF download state.
6. Open the downloaded PDF briefly and zoom to the QR payment part.
7. Optional final frame: Help link / Privacy note, showing that PDFs are generated client-side.

## Suggested narration or captions

- “Swiss QR Invoice creates compliant Swiss QR bills directly from monday board items.”
- “Payee settings and column mapping are stored in monday app storage.”
- “The app validates IBAN, QR reference rules and field lengths.”
- “The PDF is generated in the browser; no customer or payment data is sent to external servers.”

## Output

- MP4 or Loom-style share link.
- Keep under 120 seconds and below 50 MB if uploading directly.
- Put the final link into the monday submission field `Demo Link`.
- Do not submit `assets/demo/swiss-qr-invoice-demo.mp4` if it was generated from the storyboard harness; it is not a real screen recording.
