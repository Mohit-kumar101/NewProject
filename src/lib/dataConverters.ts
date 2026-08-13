/**
 * Client-side Data & Code conversion helpers.
 * Pure functions — safe to call from browser converter UIs.
 */

import Papa from "papaparse";
import { dump as yamlDump, load as yamlLoad } from "js-yaml";
import { marked } from "marked";
import TurndownService from "turndown";

export type ConvertResult = {
  output: string;
  mimeType: string;
  extension: string;
};

export class ConvertError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConvertError";
  }
}

function ensureNonEmpty(input: string): string {
  const trimmed = input.replace(/^\uFEFF/, "");
  if (!trimmed.trim()) {
    throw new ConvertError("Input is empty. Paste text or drop a file first.");
  }
  return trimmed;
}

function parseJson(input: string): unknown {
  try {
    return JSON.parse(ensureNonEmpty(input));
  } catch {
    throw new ConvertError("Invalid JSON. Check brackets, commas, and quotes.");
  }
}

function stringifyJson(value: unknown): string {
  return `${JSON.stringify(value, null, 2)}\n`;
}

/* ─── JSON ↔ CSV ─────────────────────────────────────────────── */

function rowsFromJson(value: unknown): Record<string, unknown>[] {
  if (Array.isArray(value)) {
    if (value.length === 0) return [];
    if (value.every((row) => row !== null && typeof row === "object" && !Array.isArray(row))) {
      return value as Record<string, unknown>[];
    }
    throw new ConvertError("JSON array must contain objects to convert to CSV.");
  }
  if (value !== null && typeof value === "object") {
    return [value as Record<string, unknown>];
  }
  throw new ConvertError("JSON must be an object or an array of objects for CSV.");
}

export function jsonToCsv(input: string): ConvertResult {
  const rows = rowsFromJson(parseJson(input));
  const csv = Papa.unparse(rows, { quotes: false });
  return { output: csv.endsWith("\n") ? csv : `${csv}\n`, mimeType: "text/csv", extension: "csv" };
}

export function csvToJson(input: string): ConvertResult {
  const parsed = Papa.parse<Record<string, string>>(ensureNonEmpty(input), {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
  });
  if (parsed.errors.length > 0) {
    throw new ConvertError(parsed.errors[0]?.message || "Could not parse CSV.");
  }
  return {
    output: stringifyJson(parsed.data),
    mimeType: "application/json",
    extension: "json",
  };
}

/* ─── XML ↔ JSON ─────────────────────────────────────────────── */

function xmlNodeToJson(node: Node): unknown {
  if (node.nodeType === Node.TEXT_NODE || node.nodeType === Node.CDATA_SECTION_NODE) {
    const text = node.textContent?.trim() ?? "";
    return text || undefined;
  }

  if (node.nodeType !== Node.ELEMENT_NODE) return undefined;
  const el = node as Element;
  const obj: Record<string, unknown> = {};

  for (const attr of Array.from(el.attributes)) {
    obj[`@${attr.name}`] = attr.value;
  }

  const children = Array.from(el.childNodes).filter((child) => {
    if (child.nodeType === Node.TEXT_NODE || child.nodeType === Node.CDATA_SECTION_NODE) {
      return (child.textContent ?? "").trim().length > 0;
    }
    return child.nodeType === Node.ELEMENT_NODE;
  });

  if (children.length === 0) {
    return Object.keys(obj).length > 0 ? obj : "";
  }

  const onlyText =
    children.length === 1 &&
    (children[0].nodeType === Node.TEXT_NODE ||
      children[0].nodeType === Node.CDATA_SECTION_NODE);

  if (onlyText) {
    const text = children[0].textContent?.trim() ?? "";
    if (Object.keys(obj).length === 0) return text;
    obj["#text"] = text;
    return obj;
  }

  for (const child of children) {
    if (child.nodeType !== Node.ELEMENT_NODE) {
      const text = child.textContent?.trim();
      if (text) obj["#text"] = text;
      continue;
    }
    const childEl = child as Element;
    const name = childEl.tagName;
    const value = xmlNodeToJson(childEl);
    if (value === undefined) continue;
    if (Object.prototype.hasOwnProperty.call(obj, name)) {
      const existing = obj[name];
      obj[name] = Array.isArray(existing) ? [...existing, value] : [existing, value];
    } else {
      obj[name] = value;
    }
  }

  return obj;
}

export function xmlToJson(input: string): ConvertResult {
  const xml = ensureNonEmpty(input);
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  const parseError = doc.querySelector("parsererror");
  if (parseError) {
    throw new ConvertError("Invalid XML. Fix tags and try again.");
  }
  const root = doc.documentElement;
  if (!root) throw new ConvertError("XML document has no root element.");
  const payload = { [root.tagName]: xmlNodeToJson(root) };
  return {
    output: stringifyJson(payload),
    mimeType: "application/json",
    extension: "json",
  };
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function jsonToXmlNode(key: string, value: unknown, indent: number): string {
  const pad = "  ".repeat(indent);
  const safeKey = key.replace(/[^\w:.-]/g, "_") || "item";

  if (value === null || value === undefined) {
    return `${pad}<${safeKey}/>`;
  }
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return `${pad}<${safeKey}>${escapeXml(String(value))}</${safeKey}>`;
  }
  if (Array.isArray(value)) {
    return value.map((item) => jsonToXmlNode(safeKey, item, indent)).join("\n");
  }
  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    const attrs: string[] = [];
    const children: string[] = [];
    let textContent = "";

    for (const [k, v] of Object.entries(record)) {
      if (k.startsWith("@")) {
        attrs.push(`${k.slice(1)}="${escapeXml(String(v ?? ""))}"`);
      } else if (k === "#text") {
        textContent = escapeXml(String(v ?? ""));
      } else {
        children.push(jsonToXmlNode(k, v, indent + 1));
      }
    }

    const attrStr = attrs.length ? ` ${attrs.join(" ")}` : "";
    if (children.length === 0) {
      return textContent
        ? `${pad}<${safeKey}${attrStr}>${textContent}</${safeKey}>`
        : `${pad}<${safeKey}${attrStr}/>`;
    }
    return `${pad}<${safeKey}${attrStr}>\n${children.join("\n")}${
      textContent ? `\n${"  ".repeat(indent + 1)}${textContent}` : ""
    }\n${pad}</${safeKey}>`;
  }
  return `${pad}<${safeKey}>${escapeXml(String(value))}</${safeKey}>`;
}

export function jsonToXml(input: string): ConvertResult {
  const value = parseJson(input);
  let body: string;
  if (value !== null && typeof value === "object" && !Array.isArray(value)) {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 1) {
      body = jsonToXmlNode(entries[0][0], entries[0][1], 0);
    } else {
      body = jsonToXmlNode("root", value, 0);
    }
  } else {
    body = jsonToXmlNode("root", value, 0);
  }
  const output = `<?xml version="1.0" encoding="UTF-8"?>\n${body}\n`;
  return { output, mimeType: "application/xml", extension: "xml" };
}

/* ─── YAML ↔ JSON ────────────────────────────────────────────── */

export function yamlToJson(input: string): ConvertResult {
  try {
    const value = yamlLoad(ensureNonEmpty(input));
    return {
      output: stringifyJson(value ?? null),
      mimeType: "application/json",
      extension: "json",
    };
  } catch (err) {
    throw new ConvertError(
      err instanceof Error ? `Invalid YAML: ${err.message}` : "Invalid YAML."
    );
  }
}

export function jsonToYaml(input: string): ConvertResult {
  const value = parseJson(input);
  try {
    const output = yamlDump(value, {
      indent: 2,
      lineWidth: 100,
      noRefs: true,
      sortKeys: false,
    });
    return { output, mimeType: "text/yaml", extension: "yaml" };
  } catch (err) {
    throw new ConvertError(
      err instanceof Error ? err.message : "Could not convert JSON to YAML."
    );
  }
}

/* ─── CSV ↔ TSV ──────────────────────────────────────────────── */

function convertDelimited(
  input: string,
  from: string,
  to: string,
  extension: string,
  mimeType: string
): ConvertResult {
  const parsed = Papa.parse<string[]>(ensureNonEmpty(input), {
    delimiter: from,
    skipEmptyLines: false,
  });
  if (parsed.errors.length > 0) {
    throw new ConvertError(parsed.errors[0]?.message || "Could not parse delimited file.");
  }
  const output = Papa.unparse(parsed.data, { delimiter: to });
  return {
    output: output.endsWith("\n") ? output : `${output}\n`,
    mimeType,
    extension,
  };
}

export function csvToTsv(input: string): ConvertResult {
  return convertDelimited(input, ",", "\t", "tsv", "text/tab-separated-values");
}

export function tsvToCsv(input: string): ConvertResult {
  return convertDelimited(input, "\t", ",", "csv", "text/csv");
}

/* ─── HTML ↔ Markdown ────────────────────────────────────────── */

const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
});

export async function htmlToMarkdown(input: string): Promise<ConvertResult> {
  const html = ensureNonEmpty(input);
  const output = turndown.turndown(html);
  return {
    output: output.endsWith("\n") ? output : `${output}\n`,
    mimeType: "text/markdown",
    extension: "md",
  };
}

export async function markdownToHtml(input: string): Promise<ConvertResult> {
  const md = ensureNonEmpty(input);
  marked.setOptions({ gfm: true, breaks: false });
  const html = await marked.parse(md);
  return {
    output: typeof html === "string" ? html : String(html),
    mimeType: "text/html",
    extension: "html",
  };
}

/* ─── Base64 ↔ Text ──────────────────────────────────────────── */

export function textToBase64(input: string): ConvertResult {
  const text = ensureNonEmpty(input);
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  const output = btoa(binary);
  return { output: `${output}\n`, mimeType: "text/plain", extension: "b64" };
}

export function base64ToText(input: string): ConvertResult {
  const cleaned = ensureNonEmpty(input).replace(/\s+/g, "");
  try {
    const binary = atob(cleaned);
    const bytes = Uint8Array.from(binary, (ch) => ch.charCodeAt(0));
    const output = new TextDecoder().decode(bytes);
    return { output, mimeType: "text/plain", extension: "txt" };
  } catch {
    throw new ConvertError("Invalid Base64. Remove whitespace issues or padding errors.");
  }
}

/* ─── Properties ↔ JSON ──────────────────────────────────────── */

export function propertiesToJson(input: string): ConvertResult {
  const text = ensureNonEmpty(input);
  const result: Record<string, string> = {};

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#") || line.startsWith("!")) continue;

    let splitAt = -1;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if ((ch === "=" || ch === ":") && line[i - 1] !== "\\") {
        splitAt = i;
        break;
      }
    }

    let key: string;
    let value: string;
    if (splitAt === -1) {
      key = line;
      value = "";
    } else {
      key = line.slice(0, splitAt).trim();
      value = line.slice(splitAt + 1).trim();
    }

    key = key.replace(/\\([=:\\])/g, "$1");
    value = value.replace(/\\n/g, "\n").replace(/\\t/g, "\t").replace(/\\([=:\\])/g, "$1");
    if (key) result[key] = value;
  }

  return {
    output: stringifyJson(result),
    mimeType: "application/json",
    extension: "json",
  };
}

export function jsonToProperties(input: string): ConvertResult {
  const value = parseJson(input);
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new ConvertError("JSON must be a flat object of string keys for .properties.");
  }

  const lines: string[] = ["# Generated by CalculioHub"];
  for (const [key, raw] of Object.entries(value as Record<string, unknown>)) {
    if (raw !== null && typeof raw === "object") {
      throw new ConvertError(
        `Nested value at "${key}" is not supported. Flatten objects before converting.`
      );
    }
    const escapedKey = key.replace(/([=:\\])/g, "\\$1");
    const escapedVal = String(raw ?? "")
      .replace(/\\/g, "\\\\")
      .replace(/\n/g, "\\n")
      .replace(/\t/g, "\\t");
    lines.push(`${escapedKey}=${escapedVal}`);
  }

  return {
    output: `${lines.join("\n")}\n`,
    mimeType: "text/plain",
    extension: "properties",
  };
}
