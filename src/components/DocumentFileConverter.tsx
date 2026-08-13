"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { FileDropzone } from "@/components/FileDropzone";
import type { DocumentConverterSlug } from "@/lib/customToolSlugs";
import {
  getDocumentConverterTool,
  type DocumentDirection,
} from "@/lib/documentConverterTools";
import {
  DocumentConvertError,
  getPdfPageCount,
  htmlToPdf,
  imagesToPdf,
  markdownToPdf,
  mergePdfs,
  pdfToImages,
  pdfToText,
  splitPdf,
  textToPdf,
  type DocumentResult,
  type ProgressUpdate,
  type SplitMode,
} from "@/lib/documentConverters";
import {
  formatFileSize,
  readFileAsText,
  revokeObjectUrl,
  triggerDownload,
} from "@/lib/converter-utils";

const MAX_SIZE = 40 * 1024 * 1024;

function ProgressBar({ progress }: { progress: ProgressUpdate | null }) {
  if (!progress) return null;
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 sm:px-5">
      <div className="flex items-center justify-between gap-3 text-xs sm:text-sm">
        <span className="font-medium text-[var(--muted)]">{progress.phase}</span>
        <span className="font-semibold text-[var(--foreground)]">
          {progress.current}/{progress.total} · {progress.percent}%
        </span>
      </div>
      <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-[var(--background)]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#00E5FF] to-[#2979FF] transition-[width] duration-200 ease-out"
          style={{ width: `${progress.percent}%` }}
          role="progressbar"
          aria-valuenow={progress.percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={progress.phase}
        />
      </div>
    </div>
  );
}

export function DocumentFileConverter({
  slug,
}: {
  slug: DocumentConverterSlug;
}) {
  const tool = getDocumentConverterTool(slug);
  const directions = tool?.directions ?? [];
  const [directionId, setDirectionId] = useState(directions[0]?.id ?? "");
  const [files, setFiles] = useState<File[]>([]);
  const [text, setText] = useState("");
  const [result, setResult] = useState<DocumentResult | null>(null);
  const [progress, setProgress] = useState<ProgressUpdate | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [imageFormat, setImageFormat] = useState<"png" | "jpeg">("png");
  const [renderScale, setRenderScale] = useState(2);
  const [splitMode, setSplitMode] = useState<SplitMode>("each-page");
  const [rangeText, setRangeText] = useState("1-1");
  const [pageCount, setPageCount] = useState<number | null>(null);

  const previewUrlsRef = useRef<string[]>([]);

  const direction: DocumentDirection | undefined =
    directions.find((d) => d.id === directionId) ?? directions[0];

  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach(revokeObjectUrl);
      previewUrlsRef.current = [];
    };
  }, []);

  useEffect(() => {
    if (!directions.some((d) => d.id === directionId) && directions[0]) {
      setDirectionId(directions[0].id);
    }
  }, [directionId, directions]);

  if (!tool || !direction) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <p className="text-sm text-[var(--muted)]">Converter configuration missing.</p>
      </div>
    );
  }

  const clearPreviews = () => {
    previewUrlsRef.current.forEach(revokeObjectUrl);
    previewUrlsRef.current = [];
  };

  const storeResult = (next: DocumentResult) => {
    clearPreviews();
    if (next.previewUrls?.length) {
      previewUrlsRef.current = next.previewUrls;
    }
    setResult(next);
  };

  const onProgress = (update: ProgressUpdate) => setProgress(update);

  const parseRanges = (raw: string, total: number) => {
    const ranges: { from: number; to: number }[] = [];
    for (const part of raw.split(/[,;\s]+/).map((p) => p.trim()).filter(Boolean)) {
      const m = /^(\d+)(?:\s*-\s*(\d+))?$/.exec(part);
      if (!m) {
        throw new DocumentConvertError(
          `Invalid range "${part}". Use forms like 1-3 or 5.`
        );
      }
      const from = Number(m[1]);
      const to = m[2] ? Number(m[2]) : from;
      if (from < 1 || to > total || from > to) {
        throw new DocumentConvertError(
          `Range ${from}-${to} is outside 1–${total}.`
        );
      }
      ranges.push({ from, to });
    }
    if (!ranges.length) {
      throw new DocumentConvertError("Enter at least one page range.");
    }
    return ranges;
  };

  const run = () => {
    setError(null);
    setProgress(null);
    startTransition(async () => {
      try {
        let next: DocumentResult;
        switch (direction.id) {
          case "pdf-to-text": {
            if (!files[0]) throw new DocumentConvertError("Drop a PDF first.");
            next = await pdfToText(files[0], onProgress);
            break;
          }
          case "text-to-pdf": {
            const body = text.trim()
              ? text
              : files[0]
                ? await readFileAsText(files[0])
                : "";
            if (!body.trim()) {
              throw new DocumentConvertError("Paste text or drop a .txt file.");
            }
            next = await textToPdf(body, { onProgress });
            break;
          }
          case "images-to-pdf": {
            if (!files.length) {
              throw new DocumentConvertError("Add one or more images.");
            }
            next = await imagesToPdf(files, onProgress);
            break;
          }
          case "pdf-to-images": {
            if (!files[0]) throw new DocumentConvertError("Drop a PDF first.");
            next = await pdfToImages(files[0], {
              scale: renderScale,
              format: imageFormat,
              onProgress,
            });
            break;
          }
          case "html-to-pdf": {
            const body = text.trim()
              ? text
              : files[0]
                ? await readFileAsText(files[0])
                : "";
            next = await htmlToPdf(body, onProgress);
            break;
          }
          case "markdown-to-pdf": {
            const body = text.trim()
              ? text
              : files[0]
                ? await readFileAsText(files[0])
                : "";
            next = await markdownToPdf(body, onProgress);
            break;
          }
          case "merge-pdfs": {
            next = await mergePdfs(files, onProgress);
            break;
          }
          case "split-pdf": {
            if (!files[0]) throw new DocumentConvertError("Drop a PDF first.");
            const total = pageCount ?? (await getPdfPageCount(files[0]));
            next = await splitPdf(files[0], {
              mode: splitMode,
              ranges:
                splitMode === "range" ? parseRanges(rangeText, total) : undefined,
              onProgress,
            });
            break;
          }
          default:
            throw new DocumentConvertError("Unknown conversion mode.");
        }
        storeResult(next);
        setProgress({
          phase: "Done",
          current: next.pageCount ?? 1,
          total: next.pageCount ?? 1,
          percent: 100,
        });
      } catch (err) {
        setResult(null);
        clearPreviews();
        setError(
          err instanceof DocumentConvertError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Conversion failed."
        );
        setProgress(null);
      }
    });
  };

  const onFilesChange = async (nextFiles: File[]) => {
    setFiles(nextFiles);
    setResult(null);
    clearPreviews();
    setError(null);
    setProgress(null);
    setPageCount(null);

    if (direction.textInput && nextFiles[0]) {
      try {
        const body = await readFileAsText(nextFiles[0]);
        setText(body);
      } catch {
        setError("Could not read that file as text.");
      }
    }

    if (
      (direction.id === "split-pdf" || direction.id === "pdf-to-images") &&
      nextFiles[0]
    ) {
      try {
        const count = await getPdfPageCount(nextFiles[0]);
        setPageCount(count);
        setRangeText(`1-${count}`);
      } catch {
        // PDF.js/pdf-lib will surface a clearer error on convert.
      }
    }
  };

  const onDirectionChange = (id: string) => {
    setDirectionId(id as DocumentDirection["id"]);
    setFiles([]);
    setText("");
    setResult(null);
    clearPreviews();
    setError(null);
    setProgress(null);
    setPageCount(null);
  };

  const onDownload = () => {
    if (!result) return;
    triggerDownload(result.blob, {
      filename: result.filename,
      mimeType: result.mimeType,
      revokeAfterMs: false,
    });
  };

  const clearAll = () => {
    setFiles([]);
    setText("");
    setResult(null);
    clearPreviews();
    setError(null);
    setProgress(null);
    setPageCount(null);
  };

  const canRun = (() => {
    if (direction.textInput) return Boolean(text.trim() || files[0]);
    if (direction.multiple) {
      if (direction.id === "merge-pdfs") return files.length >= 2;
      return files.length >= 1;
    }
    return Boolean(files[0]);
  })();

  const placeholder =
    direction.textInput === "html"
      ? "<h1>Hello</h1>\n<p>Paste HTML to turn into a PDF.</p>"
      : direction.textInput === "markdown"
        ? "# Hello\n\nPaste **Markdown** to export as PDF."
        : "Paste plain text to build a PDF…";

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-[var(--accent)] uppercase">
              Mode
            </p>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Client-side with pdf-lib / jsPDF — nothing is uploaded.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {directions.map((dir) => {
              const active = dir.id === direction.id;
              return (
                <button
                  key={dir.id}
                  type="button"
                  onClick={() => onDirectionChange(dir.id)}
                  className={
                    active
                      ? "rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#2979FF] px-3.5 py-2 text-sm font-semibold text-white shadow-[0_6px_18px_rgba(41,121,255,0.22)]"
                      : "rounded-xl border border-[var(--border)] px-3.5 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  }
                >
                  {dir.label}
                </button>
              );
            })}
          </div>
        </div>
        <p className="mt-3 text-xs text-[var(--muted)] sm:text-sm">{direction.hint}</p>
      </div>

      <FileDropzone
        accept={direction.accept}
        maxSizeBytes={MAX_SIZE}
        multiple={direction.multiple}
        files={files}
        label={
          direction.multiple
            ? `Drop ${direction.id === "merge-pdfs" ? "PDFs" : "images"}, or browse`
            : `Drop a file, or browse`
        }
        hint={`Max ${formatFileSize(MAX_SIZE)} per file · private browser processing`}
        onFilesChange={(next) => {
          void onFilesChange(next);
        }}
      />

      {direction.textInput ? (
        <label className="block">
          <span className="mb-2 block text-xs font-semibold tracking-[0.14em] text-[var(--muted)] uppercase">
            {direction.textInput === "html"
              ? "HTML"
              : direction.textInput === "markdown"
                ? "Markdown"
                : "Text"}{" "}
            input
          </span>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={placeholder}
            spellCheck={direction.textInput === "text"}
            rows={14}
            className="w-full resize-y rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 font-mono text-xs leading-relaxed text-[var(--foreground)] outline-none transition focus:border-[var(--accent)] sm:text-sm"
          />
        </label>
      ) : null}

      {direction.imageExtractControls ? (
        <div className="grid gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:grid-cols-2 sm:p-5">
          <label className="block text-sm">
            <span className="mb-1.5 block text-xs font-medium text-[var(--muted)]">
              Image format
            </span>
            <select
              value={imageFormat}
              onChange={(e) => setImageFormat(e.target.value as "png" | "jpeg")}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
            >
              <option value="png">PNG</option>
              <option value="jpeg">JPEG</option>
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block text-xs font-medium text-[var(--muted)]">
              Render scale ({renderScale}×)
            </span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.5}
              value={renderScale}
              onChange={(e) => setRenderScale(Number(e.target.value))}
              className="mt-3 w-full accent-[#2979FF]"
            />
          </label>
          {pageCount ? (
            <p className="sm:col-span-2 text-sm text-[var(--muted)]">
              Detected {pageCount} page{pageCount === 1 ? "" : "s"}
            </p>
          ) : null}
        </div>
      ) : null}

      {direction.splitControls ? (
        <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5">
          <div className="flex flex-wrap gap-2">
            {(
              [
                ["each-page", "Every page"],
                ["range", "Custom ranges"],
              ] as const
            ).map(([mode, label]) => {
              const active = splitMode === mode;
              return (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setSplitMode(mode)}
                  className={
                    active
                      ? "rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#2979FF] px-3 py-1.5 text-xs font-semibold text-white"
                      : "rounded-xl border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--foreground)]"
                  }
                >
                  {label}
                </button>
              );
            })}
          </div>
          {splitMode === "range" ? (
            <label className="block text-sm">
              <span className="mb-1.5 block text-xs font-medium text-[var(--muted)]">
                Page ranges {pageCount ? `(1–${pageCount})` : ""}
              </span>
              <input
                value={rangeText}
                onChange={(e) => setRangeText(e.target.value)}
                placeholder="1-3, 5, 8-10"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 font-mono text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
              />
            </label>
          ) : (
            <p className="text-sm text-[var(--muted)]">
              Exports one PDF per page into a ZIP
              {pageCount ? ` (${pageCount} files)` : ""}.
            </p>
          )}
        </div>
      ) : null}

      <ProgressBar
        progress={
          isPending || progress
            ? progress ?? { phase: "Starting…", current: 0, total: 1, percent: 2 }
            : null
        }
      />

      {error ? (
        <p
          role="alert"
          className="rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-500"
        >
          {error}
        </p>
      ) : null}

      {result?.textPreview ? (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5">
          <p className="text-xs font-semibold tracking-[0.14em] text-[var(--muted)] uppercase">
            Text preview
          </p>
          <pre className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap rounded-xl bg-[var(--background)] p-3 font-mono text-xs leading-relaxed text-[var(--foreground)] sm:text-sm">
            {result.textPreview}
          </pre>
        </div>
      ) : null}

      {result?.previewUrls && result.previewUrls.length > 0 ? (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5">
          <p className="text-xs font-semibold tracking-[0.14em] text-[var(--muted)] uppercase">
            Page previews
            {result.pageCount && result.pageCount > result.previewUrls.length
              ? ` (showing ${result.previewUrls.length} of ${result.pageCount})`
              : ""}
          </p>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {result.previewUrls.map((url, index) => (
              <div
                key={`${url}-${index}`}
                className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)]"
              >
                <img
                  src={url}
                  alt={`Page ${index + 1}`}
                  className="aspect-[3/4] w-full object-contain p-2"
                />
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {result ? (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--muted)]">
          Ready:{" "}
          <span className="font-medium text-[var(--foreground)]">
            {result.filename}
          </span>{" "}
          · {formatFileSize(result.blob.size)}
          {result.pageCount ? ` · ${result.pageCount} page(s)` : ""}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={!canRun || isPending}
          onClick={run}
          className="rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#2979FF] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Working…" : "Convert"}
        </button>
        <button
          type="button"
          disabled={!result}
          onClick={onDownload}
          className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Download
        </button>
        <button
          type="button"
          disabled={!files.length && !text && !result}
          onClick={clearAll}
          className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-semibold text-[var(--muted)] transition hover:border-red-400/50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
