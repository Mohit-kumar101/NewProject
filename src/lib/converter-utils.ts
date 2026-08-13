/**
 * Shared client-side helpers for File Converter tools:
 * blob URL lifecycle, download triggers, and size formatting.
 */

export type DownloadablePayload =
  | Blob
  | ArrayBuffer
  | Uint8Array
  | string;

export type TriggerDownloadOptions = {
  filename: string;
  mimeType?: string;
  /** Revoke the object URL after a short delay (default: true). */
  revokeAfterMs?: number | false;
};

/** Human-readable byte size (e.g. 1.5 MB). */
export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "—";
  if (bytes === 0) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB"] as const;
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );
  const value = bytes / 1024 ** exponent;
  const decimals = exponent === 0 ? 0 : value < 10 ? 2 : 1;
  return `${value.toFixed(decimals)} ${units[exponent]}`;
}

/** Build a Blob from common in-memory payloads. */
export function toBlob(
  data: DownloadablePayload,
  mimeType = "application/octet-stream"
): Blob {
  if (data instanceof Blob) return data;
  if (typeof data === "string") {
    return new Blob([data], { type: mimeType });
  }
  // ArrayBuffer | Uint8Array — BlobPart accepts both.
  return new Blob([data as BlobPart], { type: mimeType });
}

/** Create an object URL for a Blob (caller must revoke when done). */
export function createObjectUrl(blob: Blob): string {
  return URL.createObjectURL(blob);
}

/** Safely revoke a previously created object URL. */
export function revokeObjectUrl(url: string | null | undefined): void {
  if (!url || typeof url !== "string") return;
  if (!url.startsWith("blob:")) return;
  try {
    URL.revokeObjectURL(url);
  } catch {
    // Ignore double-revoke / invalid URL errors.
  }
}

/**
 * Trigger a browser download for in-memory data via a temporary blob URL.
 * Returns the object URL used (already scheduled for revoke unless disabled).
 */
export function triggerDownload(
  data: DownloadablePayload,
  options: TriggerDownloadOptions
): string {
  const {
    filename,
    mimeType = "application/octet-stream",
    revokeAfterMs = 2_000,
  } = options;

  const blob = toBlob(data, mimeType);
  const url = createObjectUrl(blob);

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  if (revokeAfterMs !== false) {
    window.setTimeout(() => revokeObjectUrl(url), revokeAfterMs);
  }

  return url;
}

/** Convenience: download a text string with an explicit MIME type. */
export function downloadText(
  text: string,
  filename: string,
  mimeType = "text/plain;charset=utf-8"
): string {
  return triggerDownload(text, { filename, mimeType });
}

/** Convenience: download JSON (pretty-printed by default). */
export function downloadJson(
  value: unknown,
  filename: string,
  pretty = true
): string {
  const body = pretty
    ? JSON.stringify(value, null, 2)
    : JSON.stringify(value);
  return triggerDownload(body, {
    filename,
    mimeType: "application/json;charset=utf-8",
  });
}

/** Read a File as text (UTF-8). */
export function readFileAsText(file: File): Promise<string> {
  return file.text();
}

/** Read a File as ArrayBuffer. */
export function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return file.arrayBuffer();
}

/** Replace a file's extension while preserving the base name. */
export function replaceExtension(filename: string, nextExt: string): string {
  const ext = nextExt.startsWith(".") ? nextExt : `.${nextExt}`;
  const lastDot = filename.lastIndexOf(".");
  if (lastDot <= 0) return `${filename}${ext}`;
  return `${filename.slice(0, lastDot)}${ext}`;
}
