/**
 * Client-side image conversion via Canvas / Image APIs.
 * HEIC and TIFF use small browser-side helpers (heic2any, UTIF)
 * because Chromium cannot decode those formats natively.
 */

import UTIF from "utif";

export class ImageConvertError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ImageConvertError";
  }
}

export type ImageFormat =
  | "png"
  | "jpeg"
  | "webp"
  | "bmp"
  | "ico"
  | "svg"
  | "tiff"
  | "heic";

export type ResizeMode = "original" | "max" | "exact" | "percent";

export type ImageConvertOptions = {
  /** Target MIME subtype / format key. */
  target: ImageFormat;
  /** JPEG / WebP quality 0–1. Default 0.92. */
  quality?: number;
  resizeMode?: ResizeMode;
  /** Used by max / exact modes. */
  width?: number;
  height?: number;
  /** Used by percent mode (100 = unchanged). */
  percent?: number;
  /** Keep aspect ratio for exact mode. Default true. */
  lockAspect?: boolean;
  /** Fill for opaque formats (jpeg/bmp/tiff). Default #ffffff. */
  background?: string;
  /** Favicon sizes when encoding ICO. */
  icoSizes?: number[];
};

export type ImageConvertResult = {
  blob: Blob;
  mimeType: string;
  extension: string;
  width: number;
  height: number;
  previewUrl: string;
};

const DEFAULT_ICO_SIZES = [16, 32, 48];

function ensureBrowser(): void {
  if (typeof document === "undefined") {
    throw new ImageConvertError("Image conversion requires a browser environment.");
  }
}

export function mimeForFormat(format: ImageFormat): string {
  switch (format) {
    case "png":
      return "image/png";
    case "jpeg":
      return "image/jpeg";
    case "webp":
      return "image/webp";
    case "bmp":
      return "image/bmp";
    case "ico":
      return "image/x-icon";
    case "svg":
      return "image/svg+xml";
    case "tiff":
      return "image/tiff";
    case "heic":
      return "image/heic";
    default:
      return "application/octet-stream";
  }
}

export function extensionForFormat(format: ImageFormat): string {
  switch (format) {
    case "jpeg":
      return "jpg";
    case "heic":
      return "heic";
    default:
      return format;
  }
}

function loadHtmlImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new ImageConvertError("Could not decode that image."));
    img.src = url;
  });
}

async function fileToDecodableBlob(file: File): Promise<Blob> {
  const type = (file.type || "").toLowerCase();
  const name = file.name.toLowerCase();
  const isHeic =
    type.includes("heic") ||
    type.includes("heif") ||
    name.endsWith(".heic") ||
    name.endsWith(".heif");

  if (isHeic) {
    const heic2any = (await import("heic2any")).default;
    const converted = await heic2any({
      blob: file,
      toType: "image/jpeg",
      quality: 0.95,
    });
    const blob = Array.isArray(converted) ? converted[0] : converted;
    if (!blob) throw new ImageConvertError("HEIC conversion produced no image.");
    return blob;
  }

  const isTiff =
    type.includes("tif") || name.endsWith(".tif") || name.endsWith(".tiff");

  if (isTiff) {
    const buffer = await file.arrayBuffer();
    const ifds = UTIF.decode(buffer);
    if (!ifds.length) throw new ImageConvertError("No images found in TIFF file.");
    UTIF.decodeImage(buffer, ifds[0]);
    const rgba = UTIF.toRGBA8(ifds[0]);
    const w = ifds[0].width;
    const h = ifds[0].height;
    if (!w || !h) throw new ImageConvertError("Invalid TIFF dimensions.");
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new ImageConvertError("Canvas 2D unavailable.");
    const imageData = new ImageData(new Uint8ClampedArray(rgba), w, h);
    ctx.putImageData(imageData, 0, 0);
    const pngBlob = await canvasToBlob(canvas, "image/png");
    return pngBlob;
  }

  return file;
}

export async function decodeImageFile(
  file: File
): Promise<{ bitmap: ImageBitmap; width: number; height: number; sourceUrl: string }> {
  ensureBrowser();
  const blob = await fileToDecodableBlob(file);
  const sourceUrl = URL.createObjectURL(blob);

  try {
    if (typeof createImageBitmap === "function") {
      try {
        const bitmap = await createImageBitmap(blob);
        return {
          bitmap,
          width: bitmap.width,
          height: bitmap.height,
          sourceUrl,
        };
      } catch {
        // Fall through to HTMLImageElement for SVG / exotic types.
      }
    }

    const img = await loadHtmlImage(sourceUrl);
    const bitmap = await createImageBitmap(img);
    return {
      bitmap,
      width: bitmap.width,
      height: bitmap.height,
      sourceUrl,
    };
  } catch (err) {
    URL.revokeObjectURL(sourceUrl);
    throw err instanceof ImageConvertError
      ? err
      : new ImageConvertError("Could not decode that image in this browser.");
  }
}

function computeTargetSize(
  srcW: number,
  srcH: number,
  options: ImageConvertOptions
): { width: number; height: number } {
  const mode = options.resizeMode ?? "original";
  if (mode === "original") return { width: srcW, height: srcH };

  if (mode === "percent") {
    const pct = Math.max(1, Math.min(400, options.percent ?? 100)) / 100;
    return {
      width: Math.max(1, Math.round(srcW * pct)),
      height: Math.max(1, Math.round(srcH * pct)),
    };
  }

  if (mode === "max") {
    const maxW = Math.max(1, options.width ?? srcW);
    const maxH = Math.max(1, options.height ?? srcH);
    const scale = Math.min(1, maxW / srcW, maxH / srcH);
    return {
      width: Math.max(1, Math.round(srcW * scale)),
      height: Math.max(1, Math.round(srcH * scale)),
    };
  }

  // exact
  const lock = options.lockAspect !== false;
  let width = Math.max(1, Math.round(options.width ?? srcW));
  let height = Math.max(1, Math.round(options.height ?? srcH));
  if (lock) {
    if (options.width && !options.height) {
      height = Math.max(1, Math.round((srcH / srcW) * width));
    } else if (options.height && !options.width) {
      width = Math.max(1, Math.round((srcW / srcH) * height));
    } else {
      const scale = Math.min(width / srcW, height / srcH);
      width = Math.max(1, Math.round(srcW * scale));
      height = Math.max(1, Math.round(srcH * scale));
    }
  }
  return { width, height };
}

function needsOpaqueBackground(format: ImageFormat): boolean {
  return format === "jpeg" || format === "bmp" || format === "tiff";
}

export function drawBitmapToCanvas(
  bitmap: ImageBitmap | HTMLImageElement | HTMLCanvasElement,
  options: ImageConvertOptions
): HTMLCanvasElement {
  ensureBrowser();
  const srcW =
    "naturalWidth" in bitmap && bitmap.naturalWidth
      ? bitmap.naturalWidth
      : bitmap.width;
  const srcH =
    "naturalHeight" in bitmap && bitmap.naturalHeight
      ? bitmap.naturalHeight
      : bitmap.height;

  const { width, height } = computeTargetSize(srcW, srcH, options);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new ImageConvertError("Canvas 2D unavailable.");

  if (needsOpaqueBackground(options.target)) {
    ctx.fillStyle = options.background || "#ffffff";
    ctx.fillRect(0, 0, width, height);
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap, 0, 0, width, height);
  return canvas;
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType: string,
  quality?: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(
            new ImageConvertError(
              `Browser could not encode ${mimeType}. Try another format.`
            )
          );
          return;
        }
        resolve(blob);
      },
      mimeType,
      quality
    );
  });
}

/** Encode 24-bit BMP (no alpha) from canvas pixels. */
export function encodeBmp(canvas: HTMLCanvasElement): Blob {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new ImageConvertError("Canvas 2D unavailable.");
  const { width, height } = canvas;
  const imageData = ctx.getImageData(0, 0, width, height);
  const rowSize = Math.floor((width * 3 + 3) / 4) * 4;
  const pixelBytes = rowSize * height;
  const headerSize = 14 + 40;
  const buffer = new ArrayBuffer(headerSize + pixelBytes);
  const view = new DataView(buffer);
  const bytes = new Uint8Array(buffer);

  // BITMAPFILEHEADER
  view.setUint8(0, 0x42); // B
  view.setUint8(1, 0x4d); // M
  view.setUint32(2, buffer.byteLength, true);
  view.setUint32(10, headerSize, true);

  // BITMAPINFOHEADER
  view.setUint32(14, 40, true);
  view.setInt32(18, width, true);
  view.setInt32(22, height, true); // bottom-up
  view.setUint16(26, 1, true);
  view.setUint16(28, 24, true);
  view.setUint32(30, 0, true);
  view.setUint32(34, pixelBytes, true);

  let offset = headerSize;
  const src = imageData.data;
  for (let y = height - 1; y >= 0; y--) {
    const rowStart = offset;
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      bytes[offset++] = src[i + 2]; // B
      bytes[offset++] = src[i + 1]; // G
      bytes[offset++] = src[i]; // R
    }
    while (offset < rowStart + rowSize) bytes[offset++] = 0;
  }

  return new Blob([buffer], { type: "image/bmp" });
}

function writeIcoPngEntry(
  png: Uint8Array,
  width: number,
  height: number
): { entry: Uint8Array; data: Uint8Array } {
  const entry = new Uint8Array(16);
  entry[0] = width >= 256 ? 0 : width;
  entry[1] = height >= 256 ? 0 : height;
  entry[2] = 0; // color count
  entry[3] = 0;
  entry[4] = 1; // planes low
  entry[5] = 0;
  entry[6] = 32; // bit count low
  entry[7] = 0;
  const view = new DataView(entry.buffer);
  view.setUint32(8, png.byteLength, true);
  // offset filled later
  return { entry, data: png };
}

/** Build a multi-resolution ICO (PNG-compressed images). */
export async function encodeIco(
  source: ImageBitmap | HTMLImageElement | HTMLCanvasElement,
  sizes: number[] = DEFAULT_ICO_SIZES
): Promise<Blob> {
  const unique = [...new Set(sizes.filter((s) => s > 0 && s <= 256))].sort(
    (a, b) => a - b
  );
  if (unique.length === 0) {
    throw new ImageConvertError("Pick at least one favicon size.");
  }

  const parts: { entry: Uint8Array; data: Uint8Array }[] = [];
  for (const size of unique) {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new ImageConvertError("Canvas 2D unavailable.");
    ctx.clearRect(0, 0, size, size);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(source, 0, 0, size, size);
    const pngBlob = await canvasToBlob(canvas, "image/png");
    const png = new Uint8Array(await pngBlob.arrayBuffer());
    parts.push(writeIcoPngEntry(png, size, size));
  }

  const header = new Uint8Array(6);
  const headerView = new DataView(header.buffer);
  headerView.setUint16(0, 0, true); // reserved
  headerView.setUint16(2, 1, true); // type = icon
  headerView.setUint16(4, parts.length, true);

  let offset = 6 + parts.length * 16;
  const chunks: Uint8Array[] = [header];
  for (const part of parts) {
    const view = new DataView(part.entry.buffer);
    view.setUint32(12, offset, true);
    chunks.push(part.entry);
    offset += part.data.byteLength;
  }
  for (const part of parts) chunks.push(part.data);

  const total = chunks.reduce((n, c) => n + c.byteLength, 0);
  const out = new Uint8Array(total);
  let pos = 0;
  for (const c of chunks) {
    out.set(c, pos);
    pos += c.byteLength;
  }
  return new Blob([out], { type: "image/x-icon" });
}

/** Extract the largest image from an ICO as a PNG blob. */
export async function icoToPngBlob(file: File): Promise<Blob> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  if (bytes.byteLength < 6) throw new ImageConvertError("Invalid ICO file.");
  const view = new DataView(buffer);
  const type = view.getUint16(2, true);
  const count = view.getUint16(4, true);
  if (type !== 1 || count < 1) {
    throw new ImageConvertError("Not a valid ICO icon file.");
  }

  type Candidate = { width: number; height: number; offset: number; size: number };
  const candidates: Candidate[] = [];
  for (let i = 0; i < count; i++) {
    const base = 6 + i * 16;
    if (base + 16 > bytes.byteLength) break;
    const wByte = bytes[base];
    const hByte = bytes[base + 1];
    const width = wByte === 0 ? 256 : wByte;
    const height = hByte === 0 ? 256 : hByte;
    const size = view.getUint32(base + 8, true);
    const offset = view.getUint32(base + 12, true);
    candidates.push({ width, height, offset, size });
  }

  candidates.sort((a, b) => b.width * b.height - a.width * a.height);
  const best = candidates[0];
  if (!best) throw new ImageConvertError("ICO contained no images.");

  const slice = bytes.subarray(best.offset, best.offset + best.size);
  // PNG signature
  if (
    slice.length >= 8 &&
    slice[0] === 0x89 &&
    slice[1] === 0x50 &&
    slice[2] === 0x4e &&
    slice[3] === 0x47
  ) {
    return new Blob([slice], { type: "image/png" });
  }

  // BMP stored in ICO: BITMAPINFOHEADER, height is doubled (XOR+AND masks)
  if (slice.length < 40) {
    throw new ImageConvertError("Unsupported ICO image encoding.");
  }
  const dib = new DataView(slice.buffer, slice.byteOffset, slice.byteLength);
  const headerSize = dib.getUint32(0, true);
  const width = dib.getInt32(4, true);
  const heightTotal = Math.abs(dib.getInt32(8, true));
  const height = Math.floor(heightTotal / 2) || heightTotal;
  const bitCount = dib.getUint16(14, true);
  if (bitCount !== 32 && bitCount !== 24) {
    throw new ImageConvertError("Only 24/32-bit ICO bitmaps are supported.");
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new ImageConvertError("Canvas 2D unavailable.");
  const imageData = ctx.createImageData(width, height);
  const out = imageData.data;
  const rowStride =
    bitCount === 32
      ? width * 4
      : Math.floor((width * 3 + 3) / 4) * 4;
  let src = headerSize;

  for (let y = 0; y < height; y++) {
    const destY = height - 1 - y;
    for (let x = 0; x < width; x++) {
      const di = (destY * width + x) * 4;
      if (bitCount === 32) {
        const si = src + x * 4;
        out[di] = slice[si + 2];
        out[di + 1] = slice[si + 1];
        out[di + 2] = slice[si];
        out[di + 3] = slice[si + 3];
      } else {
        const si = src + x * 3;
        out[di] = slice[si + 2];
        out[di + 1] = slice[si + 1];
        out[di + 2] = slice[si];
        out[di + 3] = 255;
      }
    }
    src += rowStride;
  }
  ctx.putImageData(imageData, 0, 0);
  return canvasToBlob(canvas, "image/png");
}

async function pngDataUriFromCanvas(canvas: HTMLCanvasElement): Promise<string> {
  const blob = await canvasToBlob(canvas, "image/png");
  const buffer = await blob.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    const slice = bytes.subarray(i, i + chunk);
    binary += String.fromCharCode.apply(null, Array.from(slice));
  }
  return `data:image/png;base64,${btoa(binary)}`;
}

/** Raster PNG wrapped in an SVG (practical PNG→SVG without tracing). */
export async function encodeSvgFromCanvas(canvas: HTMLCanvasElement): Promise<Blob> {
  const href = await pngDataUriFromCanvas(canvas);
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${canvas.width}" height="${canvas.height}" viewBox="0 0 ${canvas.width} ${canvas.height}">
  <title>Converted with CalculioHub</title>
  <image width="${canvas.width}" height="${canvas.height}" href="${href}" xlink:href="${href}"/>
</svg>
`;
  return new Blob([svg], { type: "image/svg+xml" });
}

export async function encodeTiff(canvas: HTMLCanvasElement): Promise<Blob> {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new ImageConvertError("Canvas 2D unavailable.");
  const { width, height } = canvas;
  const { data } = ctx.getImageData(0, 0, width, height);
  const buffer = UTIF.encodeImage(new Uint8Array(data), width, height);
  return new Blob([buffer], { type: "image/tiff" });
}

export async function convertImage(
  file: File,
  options: ImageConvertOptions
): Promise<ImageConvertResult> {
  ensureBrowser();
  const target = options.target;
  const quality = options.quality ?? 0.92;

  // ICO → PNG special path (parse container first)
  if (
    (file.name.toLowerCase().endsWith(".ico") ||
      file.type === "image/x-icon" ||
      file.type === "image/vnd.microsoft.icon") &&
    target === "png"
  ) {
    const pngBlob = await icoToPngBlob(file);
    const url = URL.createObjectURL(pngBlob);
    try {
      const img = await loadHtmlImage(url);
      const canvas = drawBitmapToCanvas(img, { ...options, target: "png" });
      const blob = await canvasToBlob(canvas, "image/png");
      const previewUrl = URL.createObjectURL(blob);
      return {
        blob,
        mimeType: "image/png",
        extension: "png",
        width: canvas.width,
        height: canvas.height,
        previewUrl,
      };
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  const decoded = await decodeImageFile(file);
  try {
    const canvas = drawBitmapToCanvas(decoded.bitmap, options);

    let blob: Blob;
    switch (target) {
      case "png":
        blob = await canvasToBlob(canvas, "image/png");
        break;
      case "jpeg":
        blob = await canvasToBlob(canvas, "image/jpeg", quality);
        break;
      case "webp":
        blob = await canvasToBlob(canvas, "image/webp", quality);
        break;
      case "bmp":
        blob = encodeBmp(canvas);
        break;
      case "ico":
        blob = await encodeIco(decoded.bitmap, options.icoSizes ?? DEFAULT_ICO_SIZES);
        break;
      case "svg":
        blob = await encodeSvgFromCanvas(canvas);
        break;
      case "tiff":
        blob = await encodeTiff(canvas);
        break;
      default:
        throw new ImageConvertError(`Unsupported target format: ${target}`);
    }

    // Preview always uses something <img> can show (PNG or SVG markup).
    const previewBlob =
      target === "svg"
        ? blob
        : target === "png" || target === "jpeg" || target === "webp" || target === "bmp"
          ? blob
          : await canvasToBlob(canvas, "image/png");

    return {
      blob,
      mimeType: mimeForFormat(target),
      extension: extensionForFormat(target),
      width: target === "ico" ? (options.icoSizes?.[options.icoSizes.length - 1] ?? canvas.width) : canvas.width,
      height: target === "ico" ? (options.icoSizes?.[options.icoSizes.length - 1] ?? canvas.height) : canvas.height,
      previewUrl: URL.createObjectURL(previewBlob),
    };
  } finally {
    decoded.bitmap.close();
    URL.revokeObjectURL(decoded.sourceUrl);
  }
}

export const FAVICON_SIZE_PRESETS = [16, 32, 48, 64, 128, 256] as const;
