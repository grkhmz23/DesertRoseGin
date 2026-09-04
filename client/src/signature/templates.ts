import editorialSource from "./templates/1a-editorial.html?raw";
import sandCardSource from "./templates/1b-sand-card.html?raw";
import compactStackSource from "./templates/1c-compact-stack.html?raw";
import ledgerSource from "./templates/2a-ledger.html?raw";
import navyBandSource from "./templates/2b-navy-band.html?raw";
import sealSource from "./templates/2c-seal.html?raw";
import wideMarginSource from "./templates/2d-wide-margin.html?raw";
import labelFrameSource from "./templates/2e-label-frame.html?raw";
import motionColumnSource from "./templates/3a-motion-column.html?raw";
import loopBannerSource from "./templates/3b-loop-banner.html?raw";
import darkStageSource from "./templates/3c-dark-stage.html?raw";
import stampSource from "./templates/3d-stamp.html?raw";

export interface SignatureFields {
  name: string;
  role: string;
  mobile: string;
  office: string;
  email: string;
}

export interface SignatureTemplate {
  id: string;
  /** The reference the design directions use for this layout. */
  code: string;
  name: string;
  description: string;
  /** Fixed width of the signature table, in px. */
  width: number;
  /** Shown on the layout when it needs something before it can go live. */
  caveat?: string;
  source: string;
}

export interface TemplateGroup {
  id: string;
  title: string;
  summary: string;
  templates: SignatureTemplate[];
}

/**
 * The animated loop is a WebP. Outlook renders neither WebP nor the animation,
 * so the four layouts built on it need an animated GIF of the same crop, plus a
 * still poster frame, before anyone sends one from Outlook.
 */
const LOOP_CAVEAT =
  "Uses the animated loop, which Outlook cannot display. Safe in Apple Mail and modern webmail; needs a GIF version before Outlook users adopt it.";

export const TEMPLATE_GROUPS: TemplateGroup[] = [
  {
    id: "round-1",
    title: "The first three",
    summary: "The original directions. Nothing here depends on anything unusual.",
    templates: [
      {
        id: "editorial",
        code: "1A",
        name: "Editorial",
        description:
          "Large name over a labelled contact grid, both awards side by side behind a vertical rule. The most formal, and safe in every client.",
        width: 560,
        source: editorialSource,
      },
      {
        id: "sand-card",
        code: "1B",
        name: "Sand card",
        description:
          "A cream panel holds the logo and the award badge, contacts sit on white beside it under a thin amber rule. The warmest option.",
        width: 560,
        source: sandCardSource,
      },
      {
        id: "compact-stack",
        code: "1C",
        name: "Compact stack",
        description:
          "The shortest block: logo beside the name, contacts on one line. Best for long email threads.",
        width: 520,
        source: compactStackSource,
      },
    ],
  },
  {
    id: "round-2",
    title: "Five more",
    summary: "A second round, from the most restrained to the most decorative.",
    templates: [
      {
        id: "ledger",
        code: "2A",
        name: "Ledger",
        description:
          "Two columns under a dark rule, contacts in a labelled table. Reads like a letterhead.",
        width: 560,
        source: ledgerSource,
      },
      {
        id: "navy-band",
        code: "2B",
        name: "Dark band",
        description:
          "Name and title reversed out of a dark brown band, contacts and awards on white below it.",
        width: 560,
        source: navyBandSource,
      },
      {
        id: "seal",
        code: "2C",
        name: "Seal",
        description:
          "Centred on a sand ground inside a thin amber border, with the logo set as a seal above the name.",
        width: 560,
        source: sealSource,
      },
      {
        id: "wide-margin",
        code: "2D",
        name: "Wide margin",
        description:
          "The largest name of the twelve, with everything else kept to a single quiet line beneath it.",
        width: 560,
        source: wideMarginSource,
      },
      {
        id: "label-frame",
        code: "2E",
        name: "Label frame",
        description:
          "Centred inside a double border, like a bottle label. The most decorative option.",
        width: 480,
        source: labelFrameSource,
      },
    ],
  },
  {
    id: "round-3",
    title: "With the animated loop",
    summary:
      "Built around the moving bottle loop. Striking in Apple Mail and webmail — but read the note on each before choosing one.",
    templates: [
      {
        id: "motion-column",
        code: "3A",
        name: "Motion column",
        description:
          "The loop and the logo stacked in a left column, contacts in a labelled grid to the right of a rule.",
        width: 560,
        caveat: LOOP_CAVEAT,
        source: motionColumnSource,
      },
      {
        id: "loop-banner",
        code: "3B",
        name: "Loop banner",
        description: "The loop runs full width as a banner across the top, details underneath.",
        width: 560,
        caveat: LOOP_CAVEAT,
        source: loopBannerSource,
      },
      {
        id: "dark-stage",
        code: "3C",
        name: "Dark stage",
        description:
          "Name and title reversed out of dark brown, with the loop held to the left and the award to the right.",
        width: 560,
        caveat: LOOP_CAVEAT,
        source: darkStageSource,
      },
      {
        id: "stamp",
        code: "3D",
        name: "Stamp",
        description:
          "The loop set small and framed like a postage stamp, beside a compact block of details.",
        width: 520,
        caveat: LOOP_CAVEAT,
        source: stampSource,
      },
    ],
  },
];

export const TEMPLATES: SignatureTemplate[] = TEMPLATE_GROUPS.flatMap((group) => group.templates);

export const DEFAULT_FIELDS: SignatureFields = {
  name: "Chiara Previati",
  role: "Sales & Marketing Director",
  mobile: "+39 347 241 1739",
  office: "+41 (0) 91 210 22 32",
  email: "info@thedesertrosegin.com",
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/**
 * `tel:` hrefs take the dialable number only. A parenthesised trunk prefix —
 * the `(0)` in `+41 (0) 91 210 22 32` — is dropped when dialling from abroad,
 * so it must not survive into the link, or the number fails from an Italian phone.
 */
const toTelHref = (value: string) => {
  const international = value.trim().startsWith("+");
  const withoutTrunk = international ? value.replace(/\([^)]*\)/g, "") : value;

  return withoutTrunk.replace(/[^\d+]/g, "").replace(/(?!^)\+/g, "");
};

export function renderSignature(template: SignatureTemplate, fields: SignatureFields): string {
  const values: Record<string, string> = {
    name: fields.name,
    role: fields.role,
    mobile: fields.mobile,
    office: fields.office,
    email: fields.email,
    mobileHref: toTelHref(fields.mobile),
    officeHref: toTelHref(fields.office),
  };

  return template.source.replace(
    /\{\{(\w+)\}\}/g,
    (match, key: string) => (key in values ? escapeHtml(values[key]) : match),
  );
}
