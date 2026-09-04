/** The markup between `<body>` and `</body>` — the signature itself, without the page around it. */
export function signatureFragment(html: string) {
  const match = /<body[^>]*>([\s\S]*)<\/body>/i.exec(html);

  return (match ? match[1] : html).trim();
}

/**
 * Email signature editors take pasted *rendered* content, not markup — pasting
 * source into Gmail's signature box gives you a wall of angle brackets. So the
 * clipboard gets an HTML flavour, which those editors render on paste.
 *
 * It has to be the source fragment rather than the browser's serialisation of
 * the selected preview: a range serialisation drops comment nodes, and the
 * comments are what carry the Outlook poster-frame fallback. Selecting the
 * preview is kept as the fallback for browsers without ClipboardItem.
 */
export async function copySignature(frame: HTMLIFrameElement, html: string) {
  const doc = frame.contentDocument;
  const plainText = doc?.body?.innerText ?? "";

  if (typeof ClipboardItem !== "undefined" && navigator.clipboard?.write) {
    await navigator.clipboard.write([
      new ClipboardItem({
        "text/html": new Blob([signatureFragment(html)], { type: "text/html" }),
        "text/plain": new Blob([plainText], { type: "text/plain" }),
      }),
    ]);
    return;
  }

  const selection = doc?.defaultView?.getSelection();
  if (!doc?.body || !selection) throw new Error("Nothing to copy");

  const range = doc.createRange();
  range.selectNodeContents(doc.body);
  selection.removeAllRanges();
  selection.addRange(range);

  const copied = doc.execCommand("copy");
  selection.removeAllRanges();

  if (!copied) throw new Error("Copy rejected");
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
