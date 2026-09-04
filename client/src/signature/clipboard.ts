/**
 * Email signature editors take pasted *rendered* content, not markup — pasting
 * source into Gmail's signature box gives you a wall of angle brackets. So the
 * primary path selects the rendered signature inside the preview iframe and
 * copies that, which is exactly what "open the file, select all, copy" does by
 * hand. `execCommand` is the only API that copies a live selection; the async
 * Clipboard API is the fallback for browsers that refuse it.
 */
export async function copyRenderedSignature(frame: HTMLIFrameElement, html: string) {
  const doc = frame.contentDocument;
  const selection = doc?.defaultView?.getSelection();

  if (doc?.body && selection) {
    const range = doc.createRange();
    range.selectNodeContents(doc.body);
    selection.removeAllRanges();
    selection.addRange(range);

    try {
      if (doc.execCommand("copy")) {
        selection.removeAllRanges();
        return;
      }
    } catch {
      // Fall through to the Clipboard API below.
    }

    selection.removeAllRanges();
  }

  const plainText = doc?.body?.innerText ?? "";

  await navigator.clipboard.write([
    new ClipboardItem({
      "text/html": new Blob([html], { type: "text/html" }),
      "text/plain": new Blob([plainText], { type: "text/plain" }),
    }),
  ]);
}

export async function copyText(value: string) {
  await navigator.clipboard.writeText(value);
}

export function downloadHtml(filename: string, html: string) {
  const url = URL.createObjectURL(new Blob([html], { type: "text/html" }));
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

/** `Chiara Previati` + `1C` -> `chiara-previati-signature-1c.html`. */
export function signatureFilename(name: string, code: string) {
  const slug = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `${slug || "desert-rose-gin"}-signature-${code.toLowerCase()}.html`;
}
