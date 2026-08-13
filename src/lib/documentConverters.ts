/**
 * Client-side document conversion with pdf-lib, jsPDF, and PDF.js.
 * Progress callbacks yield between pages so the UI can update.
 */

import { PDFDocument } from "pdf-lib";
import { jsPDF } from "jspdf";
import { marked } from "marked";
import JSZip from "jszip";

export class DocumentConvertError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DocumentConvertError";
  }
}

export type ProgressUpdate = {
  phase: string;
  current: number;
  total: number;
  /** 0–100 */
  percent: number;
};

export type ProgressCallback = (update: ProgressUpdate) => void;

export type DocumentResult = {
  blob: Blob;
  filename: string;
  mimeType: string;
  pageCount?: number;
  textPreview?: string;
  /** Optional page preview object URLs (caller must revoke). */
  previewUrls?: string[];
};

const yieldToUi = () =>
  new Promise<void>((resolve) => {
    window.setTimeout(() => resolve(), 0);
  });

function report(
  onProgress: ProgressCallback | undefined,
  phase: string,
  current: number,
  total: number
) {
  const safeTotal = Math.max(total, 1);
  onProgress?.({
    phase,
    current,
    total: safeTotal,
    percent: Math.min(100, Math.round((current / safeTotal) * 100)),
  });
}

async function getPdfjs() {
  const pdfjs = await import("pdfjs-dist");
  if (!pdfjs.GlobalWorkerOptions.workerSrc) {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
  }
  return pdfjs;
}

/* ─── Text ↔ PDF ─────────────────────────────────────────────── */

function wrapTextLines(
  doc: jsPDF,
  text: string,
  maxWidth: number,
  fontSize: number
): string[] {
  doc.setFontSize(fontSize);
  const paragraphs = text.replace(/\r\n/g, "\n").split("\n");
  const lines: string[] = [];
  for (const para of paragraphs) {
    if (!para.trim()) {
      lines.push("");
      continue;
    }
    const wrapped = doc.splitTextToSize(para, maxWidth) as string[];
    lines.push(...wrapped);
  }
  return lines;
}

export async function textToPdf(
  text: string,
  options: {
    title?: string;
    fontSize?: number;
    onProgress?: ProgressCallback;
  } = {}
): Promise<DocumentResult> {
  const fontSize = options.fontSize ?? 11;
  const onProgress = options.onProgress;
  report(onProgress, "Preparing pages", 0, 1);

  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const margin = 56;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const maxWidth = pageWidth - margin * 2;
  const lineHeight = fontSize * 1.35;
  const lines = wrapTextLines(doc, text || " ", maxWidth, fontSize);
  const linesPerPage = Math.max(1, Math.floor((pageHeight - margin * 2) / lineHeight));
  const pageCount = Math.max(1, Math.ceil(lines.length / linesPerPage));

  for (let page = 0; page < pageCount; page++) {
    if (page > 0) doc.addPage();
    const slice = lines.slice(page * linesPerPage, (page + 1) * linesPerPage);
    let y = margin;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(fontSize);
    doc.setTextColor(20, 24, 32);
    for (const line of slice) {
      doc.text(line, margin, y);
      y += lineHeight;
    }
    report(onProgress, "Rendering text pages", page + 1, pageCount);
    await yieldToUi();
  }

  const blob = doc.output("blob");
  report(onProgress, "Done", pageCount, pageCount);
  return {
    blob,
    filename: "document.pdf",
    mimeType: "application/pdf",
    pageCount,
    textPreview: text.slice(0, 400),
  };
}

export async function pdfToText(
  file: File,
  onProgress?: ProgressCallback
): Promise<DocumentResult> {
  const pdfjs = await getPdfjs();
  report(onProgress, "Loading PDF", 0, 1);
  const data = new Uint8Array(await file.arrayBuffer());
  const loadingTask = pdfjs.getDocument({ data });
  const pdf = await loadingTask.promise;
  const total = pdf.numPages;
  const parts: string[] = [];

  for (let i = 1; i <= total; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items
      .map((item) => ("str" in item ? String(item.str) : ""))
      .filter(Boolean);
    parts.push(strings.join(" ").replace(/\s+/g, " ").trim());
    report(onProgress, `Extracting text (page ${i}/${total})`, i, total);
    await yieldToUi();
  }

  const text = parts.filter(Boolean).join("\n\n");
  if (!text.trim()) {
    throw new DocumentConvertError(
      "No extractable text found. This PDF may be image-only (scanned)."
    );
  }

  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  report(onProgress, "Done", total, total);
  return {
    blob,
    filename: file.name.replace(/\.pdf$/i, "") + ".txt",
    mimeType: "text/plain;charset=utf-8",
    pageCount: total,
    textPreview: text.slice(0, 1200),
  };
}

/* ─── Images ↔ PDF ───────────────────────────────────────────── */

async function embedImageInPdf(
  pdf: PDFDocument,
  file: File
): Promise<void> {
  const bytes = await file.arrayBuffer();
  const name = file.name.toLowerCase();
  const type = (file.type || "").toLowerCase();
  let image;
  if (type.includes("png") || name.endsWith(".png")) {
    image = await pdf.embedPng(bytes);
  } else if (
    type.includes("jpeg") ||
    type.includes("jpg") ||
    name.endsWith(".jpg") ||
    name.endsWith(".jpeg")
  ) {
    image = await pdf.embedJpg(bytes);
  } else {
    // Convert other rasters via canvas → JPEG
    const url = URL.createObjectURL(file);
    try {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const el = new Image();
        el.onload = () => resolve(el);
        el.onerror = () => reject(new DocumentConvertError(`Could not decode ${file.name}`));
        el.src = url;
      });
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new DocumentConvertError("Canvas unavailable.");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      const jpeg = await new Promise<ArrayBuffer>((resolve, reject) => {
        canvas.toBlob(
          async (blob) => {
            if (!blob) {
              reject(new DocumentConvertError("Could not encode image."));
              return;
            }
            resolve(await blob.arrayBuffer());
          },
          "image/jpeg",
          0.92
        );
      });
      image = await pdf.embedJpg(jpeg);
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  const page = pdf.addPage([image.width, image.height]);
  page.drawImage(image, {
    x: 0,
    y: 0,
    width: image.width,
    height: image.height,
  });
}

export async function imagesToPdf(
  files: File[],
  onProgress?: ProgressCallback
): Promise<DocumentResult> {
  if (!files.length) throw new DocumentConvertError("Add at least one image.");
  const pdf = await PDFDocument.create();
  const total = files.length;
  const previewUrls: string[] = [];

  for (let i = 0; i < files.length; i++) {
    report(onProgress, `Embedding ${files[i].name}`, i, total);
    await embedImageInPdf(pdf, files[i]);
    previewUrls.push(URL.createObjectURL(files[i]));
    await yieldToUi();
    report(onProgress, `Embedded ${files[i].name}`, i + 1, total);
  }

  const bytes = await pdf.save();
  report(onProgress, "Done", total, total);
  return {
    blob: new Blob([new Uint8Array(bytes)], { type: "application/pdf" }),
    filename: "images.pdf",
    mimeType: "application/pdf",
    pageCount: total,
    previewUrls,
  };
}

export async function pdfToImages(
  file: File,
  options: {
    scale?: number;
    format?: "png" | "jpeg";
    onProgress?: ProgressCallback;
  } = {}
): Promise<DocumentResult> {
  const scale = options.scale ?? 2;
  const format = options.format ?? "png";
  const mime = format === "jpeg" ? "image/jpeg" : "image/png";
  const pdfjs = await getPdfjs();
  report(options.onProgress, "Loading PDF", 0, 1);

  const data = new Uint8Array(await file.arrayBuffer());
  const pdf = await pdfjs.getDocument({ data }).promise;
  const total = pdf.numPages;
  const zip = new JSZip();
  const previewUrls: string[] = [];
  const base = file.name.replace(/\.pdf$/i, "") || "page";

  for (let i = 1; i <= total; i++) {
    report(options.onProgress, `Rendering page ${i}/${total}`, i - 1, total);
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new DocumentConvertError("Canvas unavailable.");
    await page.render({ canvasContext: ctx, viewport, canvas }).promise;

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new DocumentConvertError("Encode failed"))),
        mime,
        0.92
      );
    });
    const name = `${base}-page-${String(i).padStart(3, "0")}.${format === "jpeg" ? "jpg" : "png"}`;
    zip.file(name, blob);
    if (previewUrls.length < 12) {
      previewUrls.push(URL.createObjectURL(blob));
    }
    report(options.onProgress, `Rendered page ${i}/${total}`, i, total);
    await yieldToUi();
  }

  report(options.onProgress, "Packaging ZIP", total, total + 1);
  const zipBlob = await zip.generateAsync(
    { type: "blob", compression: "DEFLATE" },
    (meta) => {
      options.onProgress?.({
        phase: "Compressing ZIP",
        current: total,
        total: total + 1,
        percent: Math.min(99, Math.round(90 + meta.percent * 0.1)),
      });
    }
  );
  report(options.onProgress, "Done", total + 1, total + 1);

  return {
    blob: zipBlob,
    filename: `${base}-pages.zip`,
    mimeType: "application/zip",
    pageCount: total,
    previewUrls,
  };
}

/* ─── HTML / Markdown → PDF ──────────────────────────────────── */

async function htmlStringToPdf(
  html: string,
  filename: string,
  onProgress?: ProgressCallback
): Promise<DocumentResult> {
  report(onProgress, "Preparing HTML", 0, 3);
  const html2canvas = (await import("html2canvas")).default;

  const host = document.createElement("div");
  host.style.position = "fixed";
  host.style.left = "-10000px";
  host.style.top = "0";
  host.style.width = "794px"; // ~A4 @ 96dpi
  host.style.padding = "32px";
  host.style.background = "#ffffff";
  host.style.color = "#111827";
  host.style.fontFamily = "Georgia, 'Times New Roman', serif";
  host.style.fontSize = "14px";
  host.style.lineHeight = "1.55";
  host.innerHTML = html;
  document.body.appendChild(host);

  try {
    report(onProgress, "Rasterizing content", 1, 3);
    await yieldToUi();
    const canvas = await html2canvas(host, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
    });

    report(onProgress, "Building PDF pages", 2, 3);
    const imgData = canvas.toDataURL("image/jpeg", 0.92);
    const pdf = new jsPDF({ unit: "pt", format: "a4", orientation: "portrait" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;
    let page = 1;

    pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 8) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      page += 1;
      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      report(onProgress, `Writing page ${page}`, 2, 3);
      await yieldToUi();
    }

    const blob = pdf.output("blob");
    report(onProgress, "Done", 3, 3);
    return {
      blob,
      filename,
      mimeType: "application/pdf",
      pageCount: page,
      textPreview: host.innerText.slice(0, 600),
    };
  } finally {
    host.remove();
  }
}

export async function htmlToPdf(
  html: string,
  onProgress?: ProgressCallback
): Promise<DocumentResult> {
  const trimmed = html.trim();
  if (!trimmed) throw new DocumentConvertError("HTML is empty.");
  const wrapped = /<html[\s>]/i.test(trimmed)
    ? trimmed
    : `<article>${trimmed}</article>`;
  return htmlStringToPdf(wrapped, "document.pdf", onProgress);
}

export async function markdownToPdf(
  markdown: string,
  onProgress?: ProgressCallback
): Promise<DocumentResult> {
  const md = markdown.trim();
  if (!md) throw new DocumentConvertError("Markdown is empty.");
  report(onProgress, "Parsing Markdown", 0, 4);
  marked.setOptions({ gfm: true, breaks: false });
  const body = await marked.parse(md);
  const html = `<article class="md">${body}</article>
<style>
  article.md h1,article.md h2,article.md h3{font-family:system-ui,sans-serif;margin:1.1em 0 .4em}
  article.md pre{background:#f3f4f6;padding:12px;overflow:auto;border-radius:8px}
  article.md code{font-family:ui-monospace,monospace;font-size:12px}
  article.md img{max-width:100%}
  article.md table{border-collapse:collapse;width:100%}
  article.md th,article.md td{border:1px solid #d1d5db;padding:6px 8px}
</style>`;
  return htmlStringToPdf(html, "markdown.pdf", onProgress);
}

/* ─── Merge / Split ──────────────────────────────────────────── */

export async function mergePdfs(
  files: File[],
  onProgress?: ProgressCallback
): Promise<DocumentResult> {
  if (files.length < 2) {
    throw new DocumentConvertError("Add at least two PDF files to merge.");
  }
  const merged = await PDFDocument.create();
  let pageTotal = 0;
  const total = files.length;

  for (let i = 0; i < files.length; i++) {
    report(onProgress, `Reading ${files[i].name}`, i, total);
    const bytes = await files[i].arrayBuffer();
    const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const indices = doc.getPageIndices();
    const copied = await merged.copyPages(doc, indices);
    for (const page of copied) {
      merged.addPage(page);
      pageTotal += 1;
    }
    report(onProgress, `Merged ${files[i].name}`, i + 1, total);
    await yieldToUi();
  }

  const out = await merged.save();
  report(onProgress, "Done", total, total);
  return {
    blob: new Blob([new Uint8Array(out)], { type: "application/pdf" }),
    filename: "merged.pdf",
    mimeType: "application/pdf",
    pageCount: pageTotal,
  };
}

export type SplitMode = "each-page" | "range";

export async function splitPdf(
  file: File,
  options: {
    mode: SplitMode;
    /** 1-based inclusive ranges, e.g. [{from:1,to:3},{from:4,to:4}] */
    ranges?: { from: number; to: number }[];
    onProgress?: ProgressCallback;
  }
): Promise<DocumentResult> {
  const bytes = await file.arrayBuffer();
  const source = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const pageCount = source.getPageCount();
  if (pageCount < 1) throw new DocumentConvertError("PDF has no pages.");

  const base = file.name.replace(/\.pdf$/i, "") || "document";
  const zip = new JSZip();

  if (options.mode === "each-page") {
    for (let i = 0; i < pageCount; i++) {
      report(options.onProgress, `Splitting page ${i + 1}/${pageCount}`, i, pageCount);
      const out = await PDFDocument.create();
      const [page] = await out.copyPages(source, [i]);
      out.addPage(page);
      const saved = await out.save();
      zip.file(
        `${base}-page-${String(i + 1).padStart(3, "0")}.pdf`,
        saved
      );
      await yieldToUi();
      report(options.onProgress, `Split page ${i + 1}/${pageCount}`, i + 1, pageCount);
    }
  } else {
    const ranges = options.ranges?.length
      ? options.ranges
      : [{ from: 1, to: pageCount }];
    for (let r = 0; r < ranges.length; r++) {
      const { from, to } = ranges[r];
      if (from < 1 || to > pageCount || from > to) {
        throw new DocumentConvertError(
          `Invalid range ${from}-${to}. PDF has ${pageCount} page(s).`
        );
      }
      report(
        options.onProgress,
        `Building range ${from}-${to}`,
        r,
        ranges.length
      );
      const out = await PDFDocument.create();
      const indices = Array.from({ length: to - from + 1 }, (_, k) => from - 1 + k);
      const pages = await out.copyPages(source, indices);
      pages.forEach((p) => out.addPage(p));
      const saved = await out.save();
      zip.file(`${base}-pages-${from}-${to}.pdf`, saved);
      await yieldToUi();
      report(
        options.onProgress,
        `Saved range ${from}-${to}`,
        r + 1,
        ranges.length
      );
    }
  }

  const zipBlob = await zip.generateAsync({ type: "blob" });
  report(options.onProgress, "Done", 1, 1);
  return {
    blob: zipBlob,
    filename: `${base}-split.zip`,
    mimeType: "application/zip",
    pageCount,
  };
}

export async function getPdfPageCount(file: File): Promise<number> {
  const bytes = await file.arrayBuffer();
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  return doc.getPageCount();
}
