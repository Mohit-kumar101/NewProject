/** Encode / decode calculator inputs in the URL for shareable scenarios. */

const PARAM = "scenario";

export function encodeScenarioValues(
  values: Record<string, number>
): string {
  try {
    const compact = JSON.stringify(values);
    if (typeof window === "undefined") {
      return Buffer.from(compact, "utf8").toString("base64url");
    }
    const bytes = new TextEncoder().encode(compact);
    let binary = "";
    bytes.forEach((b) => {
      binary += String.fromCharCode(b);
    });
    return btoa(binary)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/g, "");
  } catch {
    return "";
  }
}

export function decodeScenarioValues(
  encoded: string
): Record<string, number> | null {
  try {
    const b64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
    let json: string;
    if (typeof window === "undefined") {
      json = Buffer.from(padded, "base64").toString("utf8");
    } else {
      const binary = atob(padded);
      const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
      json = new TextDecoder().decode(bytes);
    }
    const parsed = JSON.parse(json) as Record<string, unknown>;
    if (!parsed || typeof parsed !== "object") return null;
    const out: Record<string, number> = {};
    for (const [k, v] of Object.entries(parsed)) {
      const n = typeof v === "number" ? v : Number(v);
      if (Number.isFinite(n)) out[k] = n;
    }
    return Object.keys(out).length ? out : null;
  } catch {
    return null;
  }
}

export function readScenarioFromLocation(): Record<string, number> | null {
  if (typeof window === "undefined") return null;
  try {
    const sp = new URLSearchParams(window.location.search);
    const raw = sp.get(PARAM);
    if (!raw) return null;
    return decodeScenarioValues(raw);
  } catch {
    return null;
  }
}

export function buildScenarioUrl(
  values: Record<string, number>,
  path?: string
): string {
  const encoded = encodeScenarioValues(values);
  if (!encoded) return path || (typeof window !== "undefined" ? window.location.href : "");
  if (typeof window === "undefined") {
    return `${path || ""}?${PARAM}=${encoded}`;
  }
  const url = new URL(path || window.location.href, window.location.origin);
  url.searchParams.set(PARAM, encoded);
  return url.toString();
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
