import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, Check, Copy, Code2, Download, RotateCcw } from "lucide-react";
import {
  DEFAULT_FIELDS,
  TEMPLATE_GROUPS,
  TEMPLATES,
  renderSignature,
  type SignatureFields,
  type SignatureTemplate,
} from "./templates";
import {
  copyRenderedSignature,
  copyText,
  downloadHtml,
  signatureFilename,
} from "./clipboard";

const STORAGE_KEY = "drg-signature-details";
const LAYOUT_KEY = "drg-signature-layout";

const FIELDS: { key: keyof SignatureFields; label: string; hint?: string; type: string }[] = [
  { key: "name", label: "Full name", type: "text" },
  { key: "role", label: "Job title", type: "text" },
  { key: "mobile", label: "Mobile", hint: "Shown as typed, dialled as digits", type: "tel" },
  { key: "office", label: "Office phone", type: "tel" },
  { key: "email", label: "Email address", type: "email" },
];

const INSTALL_STEPS: { client: string; steps: string }[] = [
  {
    client: "Gmail",
    steps:
      "Settings (gear icon) → See all settings → Signature → Create new → paste → Save changes at the bottom of the page.",
  },
  {
    client: "Outlook (desktop)",
    steps:
      "File → Options → Mail → Signatures… → New → paste into the edit box → OK. Set it as the default for new messages and replies.",
  },
  {
    client: "Outlook on the web",
    steps: "Settings → Mail → Compose and reply → Email signature → paste → Save.",
  },
  {
    client: "Apple Mail",
    steps:
      "Mail → Settings → Signatures → + → untick “Always match my default message font” → paste.",
  },
];

/** Fields the user has saved before, if any — so a returning colleague need not retype. */
function loadFields(): SignatureFields {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_FIELDS;

    const parsed = JSON.parse(stored) as Partial<SignatureFields>;
    return { ...DEFAULT_FIELDS, ...parsed };
  } catch {
    return DEFAULT_FIELDS;
  }
}

function loadTemplate(): SignatureTemplate {
  try {
    const stored = window.localStorage.getItem(LAYOUT_KEY);
    return TEMPLATES.find((option) => option.id === stored) ?? TEMPLATES[0];
  } catch {
    return TEMPLATES[0];
  }
}

type CopyState = "idle" | "signature" | "code";

export function SignatureTool() {
  const [template, setTemplate] = useState<SignatureTemplate>(loadTemplate);
  const [fields, setFields] = useState<SignatureFields>(loadFields);
  const [copied, setCopied] = useState<CopyState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [frameHeight, setFrameHeight] = useState(320);
  const frameRef = useRef<HTMLIFrameElement>(null);

  const html = useMemo(() => renderSignature(template, fields), [template, fields]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fields));
      window.localStorage.setItem(LAYOUT_KEY, template.id);
    } catch {
      // Private browsing — the tool still works, it just will not remember.
    }
  }, [fields, template]);

  useEffect(() => {
    if (copied === "idle") return;

    const timer = window.setTimeout(() => setCopied("idle"), 2400);
    return () => window.clearTimeout(timer);
  }, [copied]);

  /* srcdoc has no intrinsic height, so the frame is sized from its own content. */
  const measureFrame = useCallback(() => {
    const body = frameRef.current?.contentDocument?.body;
    if (body) setFrameHeight(body.scrollHeight);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(measureFrame, 120);
    return () => window.clearTimeout(timer);
  }, [html, measureFrame]);

  const update = (key: keyof SignatureFields, value: string) =>
    setFields((current) => ({ ...current, [key]: value }));

  const handleCopySignature = async () => {
    const frame = frameRef.current;
    if (!frame) return;

    try {
      await copyRenderedSignature(frame, html);
      setCopied("signature");
      setError(null);
    } catch {
      setError(
        "Your browser blocked the copy. Use “Copy HTML code”, or select the preview and press ⌘/Ctrl+C.",
      );
    }
  };

  const handleCopyCode = async () => {
    try {
      await copyText(html);
      setCopied("code");
      setError(null);
    } catch {
      setError("Your browser blocked the copy. Download the file instead.");
    }
  };

  return (
    <div className="min-h-screen bg-[#2B1810] text-[#F5EFE6]">
      <header className="border-b border-[#CD7E31]/25 px-6 py-8 sm:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3">
          <img
            src="/signature/desert-rose-gin-logo.png"
            alt="The Desert Rose Gin"
            className="h-20 w-auto self-start"
          />
          <div>
            <h1 className="text-2xl font-medium sm:text-3xl">Email signature generator</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#D4A373]">
              Pick one of the twelve layouts, put your own name and details in, then copy it straight
              into Gmail or Outlook. The company logo, awards and legal notice are fixed — everything
              else is yours.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-10 px-6 py-10 sm:px-10 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="flex flex-col gap-8">
          <section>
            <h2 className="text-[11px] font-medium uppercase tracking-[0.24em] text-[#CD7E31]">
              1 — Choose a layout
            </h2>

            {TEMPLATE_GROUPS.map((group) => (
              <div key={group.id} className="mt-6 first:mt-4">
                <h3 className="text-sm font-medium text-[#F5EFE6]">{group.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-[#A9764A]">{group.summary}</p>

                <div className="mt-3 flex flex-col gap-1.5">
                  {group.templates.map((option) => {
                    const isActive = option.id === template.id;

                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setTemplate(option)}
                        aria-pressed={isActive}
                        className={`border px-3 py-2.5 text-left transition-colors ${
                          isActive
                            ? "border-[#CD7E31] bg-[#CD7E31]/10"
                            : "border-[#F5EFE6]/15 hover:border-[#CD7E31]/60"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span
                            className={`px-1.5 py-0.5 text-[10px] font-medium tracking-[0.12em] ${
                              isActive
                                ? "bg-[#CD7E31] text-[#F5EFE6]"
                                : "bg-[#F5EFE6]/85 text-[#2B1810]"
                            }`}
                          >
                            {option.code}
                          </span>
                          <span className="text-sm">{option.name}</span>
                          {option.caveat ? (
                            <AlertTriangle
                              className="h-3.5 w-3.5 shrink-0 text-[#E5A05C]"
                              aria-label="Has a limitation"
                            />
                          ) : null}
                          <span className="ml-auto text-[10px] uppercase tracking-[0.1em] text-[#A9764A]">
                            {option.width}
                          </span>
                        </span>
                        {isActive ? (
                          <span className="mt-2 block text-xs leading-relaxed text-[#D4A373]">
                            {option.description}
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </section>

          <section>
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-[11px] font-medium uppercase tracking-[0.24em] text-[#CD7E31]">
                2 — Your details
              </h2>
              <button
                type="button"
                onClick={() => setFields(DEFAULT_FIELDS)}
                className="flex items-center gap-1.5 text-[11px] text-[#A9764A] transition-colors hover:text-[#F5EFE6]"
              >
                <RotateCcw className="h-3 w-3" aria-hidden="true" />
                Reset
              </button>
            </div>
            <div className="mt-4 flex flex-col gap-4">
              {FIELDS.map((field) => (
                <label key={field.key} className="flex flex-col gap-1.5">
                  <span className="text-[11px] uppercase tracking-[0.14em] text-[#D4A373]">
                    {field.label}
                  </span>
                  <input
                    type={field.type}
                    value={fields[field.key]}
                    onChange={(event) => update(field.key, event.target.value)}
                    spellCheck={false}
                    className="border border-[#F5EFE6]/20 bg-[#241309] px-3 py-2.5 text-sm text-[#F5EFE6] outline-none transition-colors focus:border-[#CD7E31]"
                  />
                  {field.hint ? (
                    <span className="text-[11px] text-[#A9764A]">{field.hint}</span>
                  ) : null}
                </label>
              ))}
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-8">
          {/* Pinned while the layout list scrolls. The background and the padding it
              sits behind are what stop the section below showing through it. */}
          <section className="bg-[#2B1810] lg:sticky lg:top-0 lg:-mt-10 lg:max-h-screen lg:overflow-y-auto lg:pb-6 lg:pt-10">
            <h2 className="text-[11px] font-medium uppercase tracking-[0.24em] text-[#CD7E31]">
              3 — Preview
              <span className="ml-2 normal-case tracking-normal text-[#A9764A]">
                {template.code} {template.name}
              </span>
            </h2>

            {template.caveat ? (
              <p className="mt-4 flex gap-2.5 border border-[#E5A05C]/40 bg-[#E5A05C]/10 px-4 py-3 text-xs leading-relaxed text-[#E5A05C]">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{template.caveat}</span>
              </p>
            ) : null}

            <div className="mt-4 border border-[#F5EFE6]/15 bg-white">
              <iframe
                ref={frameRef}
                title={`${template.name} signature preview`}
                srcDoc={html}
                onLoad={measureFrame}
                className="block w-full"
                style={{ height: frameHeight }}
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleCopySignature}
                className="flex items-center gap-2 bg-[#CD7E31] px-5 py-3 text-[11px] font-medium uppercase tracking-[0.16em] text-[#F5EFE6] transition-colors hover:bg-[#b56c26]"
              >
                {copied === "signature" ? (
                  <Check className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Copy className="h-4 w-4" aria-hidden="true" />
                )}
                {copied === "signature" ? "Copied — now paste it" : "Copy signature"}
              </button>
              <button
                type="button"
                onClick={handleCopyCode}
                className="flex items-center gap-2 border border-[#F5EFE6]/25 px-5 py-3 text-[11px] font-medium uppercase tracking-[0.16em] transition-colors hover:border-[#CD7E31]"
              >
                {copied === "code" ? (
                  <Check className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Code2 className="h-4 w-4" aria-hidden="true" />
                )}
                {copied === "code" ? "HTML copied" : "Copy HTML code"}
              </button>
              <button
                type="button"
                onClick={() => downloadHtml(signatureFilename(fields.name, template.code), html)}
                className="flex items-center gap-2 border border-[#F5EFE6]/25 px-5 py-3 text-[11px] font-medium uppercase tracking-[0.16em] transition-colors hover:border-[#CD7E31]"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Download .html
              </button>
            </div>

            {error ? (
              <p role="alert" className="mt-3 text-xs text-[#E5A05C]">
                {error}
              </p>
            ) : (
              <p className="mt-3 text-xs leading-relaxed text-[#A9764A]">
                <strong className="font-medium text-[#D4A373]">Copy signature</strong> is the one you
                want — it puts the finished signature on the clipboard, ready to paste.{" "}
                <strong className="font-medium text-[#D4A373]">Copy HTML code</strong> gives you the
                source, for clients that ask for markup.
              </p>
            )}
          </section>

          <section>
            <h2 className="text-[11px] font-medium uppercase tracking-[0.24em] text-[#CD7E31]">
              4 — Paste it into your mail client
            </h2>
            <dl className="mt-4 divide-y divide-[#F5EFE6]/10 border-y border-[#F5EFE6]/10">
              {INSTALL_STEPS.map((entry) => (
                <div
                  key={entry.client}
                  className="grid gap-1 py-3 sm:grid-cols-[160px_minmax(0,1fr)] sm:gap-4"
                >
                  <dt className="text-sm font-medium text-[#F5EFE6]">{entry.client}</dt>
                  <dd className="text-xs leading-relaxed text-[#D4A373]">{entry.steps}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-xs leading-relaxed text-[#A9764A]">
              Send yourself a test message and check it on both a phone and a desktop client. Two
              things are expected, not faults: the award mark only alternates where CSS animation
              survives — Outlook and Gmail show the Gold medal, which is the intended still state —
              and Ergon only loads where webfonts are supported, falling back to Tahoma elsewhere.
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-[#CD7E31]/25 px-6 py-6 text-center text-[11px] text-[#A9764A] sm:px-10">
        The Desert Rose Gin Co. Sagl · Lugano, Switzerland
      </footer>
    </div>
  );
}
