/**
 * Builds stay-information-only content for Print Entry Pass and Download Ticket.
 * Both actions display only the stay information card (no payment, no messaging).
 */
const STAY_CARD_STYLES = `
  body { font-family: Arial, sans-serif; margin: 24px; color: #0f172a; }
  .card { border: 1px solid #e2e8f0; border-radius: 24px; padding: 24px; max-width: 840px; margin: 0 auto; }
  .card-title { font-size: 11px; font-weight: 800; color: #2563eb; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 24px; border-bottom: 1px solid #f8fafc; padding-bottom: 16px; }
  .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
  .row { border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px 12px; display: flex; flex-direction: column; }
  .label { font-size: 10px; letter-spacing: .08em; text-transform: uppercase; color: #64748b; font-weight: 700; }
  .value { margin-top: 4px; font-size: 14px; font-weight: 700; color: #0f172a; }
  @media print { body { margin: 0; } .card { border: none; } }
`;

/**
 * @param {Array<[string, string]>} rows - [label, value] pairs for the stay card
 * @param {string} bookingId
 * @param {boolean} autoPrint - if true, adds script to trigger print on load
 */
export function getStayCardPrintHtml(rows, bookingId, autoPrint = true) {
  const rowsHtml = rows
    .map(([label, value]) => `<div class="row"><span class="label">${escapeHtml(label)}</span><span class="value">${escapeHtml(value)}</span></div>`)
    .join("");
  const printScript = autoPrint ? `<script>window.onload = () => window.print();</script>` : "";
  return `<!doctype html>
<html><head><meta charset="utf-8" /><title>Entry Pass ${escapeHtml(String(bookingId))}</title>
<style>${STAY_CARD_STYLES}</style></head>
<body><div class="card"><h2 class="card-title">Stay Information</h2><div class="grid">${rowsHtml}</div></div>${printScript}</body></html>`;
}

/**
 * Same content as print but without auto-print script (for download).
 */
export function getStayCardDownloadHtml(rows, bookingId) {
  return getStayCardPrintHtml(rows, bookingId, false);
}

function escapeHtml(str) {
  if (str == null) return "";
  const s = String(str);
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
