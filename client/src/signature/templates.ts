import compactStackSource from "./templates/1c-compact-stack.html?raw";
import ledgerSource from "./templates/2a-ledger.html?raw";
import labelFrameSource from "./templates/2e-label-frame.html?raw";

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
  source: string;
}

export const TEMPLATES: SignatureTemplate[] = [
  {
    id: "compact-stack",
    code: "1C",
    name: "Compact stack",
    description:
      "The shortest block: logo beside the name, contacts on one line. Best for long email threads.",
    width: 520,
    source: compactStackSource,
  },
  {
    id: "ledger",
    code: "2A",
    name: "Ledger",
    description:
      "Two columns under a dark rule, contacts in a labelled table. The most formal of the three.",
    width: 560,
    source: ledgerSource,
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
];

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
