"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import JSZip from "jszip";
import { FileDropzone } from "@/components/FileDropzone";
import type { ImageConverterSlug } from "@/lib/customToolSlugs";
import {
  getImageConverterTool,
  type ImageConverterDirection,
} from "@/lib/imageConverterTools";
import {
  FAVICON_SIZE_PRESETS,
  ImageConvertError,
  convertImage,
  type ResizeMode,
} from "@/lib/imageConverters";
import {
  formatFileSize,
  replaceExtension,
  revokeObjectUrl,
  triggerDownload,
} from "@/lib/converter-utils";
import {
  ConverterPrivacyRecent,
  recordConverterJob,
} from "@/components/converters/ConverterPrivacyRecent";

const MAX_SIZE = 25 * 1024 * 1024;
const MAX_BATCH = 20;

type QualityPreset = "custom" | "email" | "print" | "archive";

const PRESETS: Record<
  Exclude<QualityPreset, "custom">,
  { label: string; quality: number; resizeMode: ResizeMode; maxEdge: number }
> = {
  email: { label: "Email", quality: 0.72, resizeMode: "max", maxEdge: 1600 },
  print: { label: "Print", quality: 0.92, resizeMode: "max", maxEdge: 3200 },
  archive: {
    label: "Archive",
    quality: 0.98,
    resizeMode: "original",
    maxEdge: 8192,
  },
};

type BatchItem = {
  id: string;
  file: File;
  blob: Blob;
  extension: string;
  mimeType: string;
  width: number;
  height: number;
  previewUrl: string;
};

export function ImageFileConverter({ slug }: { slug: ImageConverterSlug }) {
  const tool = getImageConverterTool(slug);
  const directions = tool?.directions ?? [];
  const [directionId, setDirectionId] = useState(directions[0]?.id ?? "");
  const [files, setFiles] = useState<File[]>([]);
  const [batch, setBatch] = useState<BatchItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [sourcePreview, setSourcePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [preset, setPreset] = useState<QualityPreset>("custom");
  const [resizeMode, setResizeMode] = useState<ResizeMode>("original");
  const [width, setWidth] = useState(1024);
  const [height, setHeight] = useState(1024);
  const [percent, setPercent] = useState(100);
  const [lockAspect, setLockAspect] = useState(true);
  const [quality, setQuality] = useState(0.92);
  const [background, setBackground] = useState("#ffffff");
  const [icoSizes, setIcoSizes] = useState<number[]>([16, 32, 48]);
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);

  const sourceUrlRef = useRef<string | null>(null);
  const batchUrlsRef = useRef<string[]>([]);

  const direction: ImageConverterDirection | undefined =
    directions.find((d) => d.id === directionId) ?? directions[0];

  const active = batch.find((b) => b.id === activeId) ?? batch[0] ?? null;

  useEffect(() => {
    return () => {
      revokeObjectUrl(sourceUrlRef.current);
      for (const url of batchUrlsRef.current) revokeObjectUrl(url);
    };
  }, []);

  useEffect(() => {
    if (!directions.some((d) => d.id === directionId) && directions[0]) {
      setDirectionId(directions[0].id);
    }
  }, [directionId, directions]);

  const setSourceUrl = (url: string | null) => {
    revokeObjectUrl(sourceUrlRef.current);
    sourceUrlRef.current = url;
    setSourcePreview(url);
  };

  const clearBatch = () => {
    for (const url of batchUrlsRef.current) revokeObjectUrl(url);
    batchUrlsRef.current = [];
    setBatch([]);
    setActiveId(null);
  };

  const applyPreset = (next: QualityPreset) => {
    setPreset(next);
    if (next === "custom") return;
    const p = PRESETS[next];
    setQuality(p.quality);
    setResizeMode(p.resizeMode);
    if (p.resizeMode === "max") {
      setWidth(p.maxEdge);
      setHeight(p.maxEdge);
    }
  };

  if (!tool || !direction) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <p className="text-sm text-[var(--muted)]">Converter configuration missing.</p>
      </div>
    );
  }

  const convertOptions = (dir: ImageConverterDirection) => ({
    target: dir.target,
    quality,
    resizeMode: dir.showIcoSizes ? ("original" as const) : resizeMode,
    width,
    height,
    percent,
    lockAspect,
    background,
    icoSizes: dir.showIcoSizes ? icoSizes : undefined,
  });

  const runBatch = (nextFiles: File[], dir: ImageConverterDirection) => {
    setError(null);
    setProgress(null);
    clearBatch();
    startTransition(async () => {
      const items: BatchItem[] = [];
      try {
        for (let i = 0; i < nextFiles.length; i++) {
          const file = nextFiles[i];
          setProgress(`Converting ${i + 1} of ${nextFiles.length}…`);
          const result = await convertImage(file, convertOptions(dir));
          batchUrlsRef.current.push(result.previewUrl);
          items.push({
            id: `${file.name}-${i}-${Date.now()}`,
            file,
            blob: result.blob,
            extension: result.extension,
            mimeType: result.mimeType,
            width: result.width,
            height: result.height,
            previewUrl: result.previewUrl,
          });
          recordConverterJob(slug, file.name, dir.label ?? dir.id);
        }
        setBatch(items);
        setActiveId(items[0]?.id ?? null);
        setProgress(
          items.length > 1
            ? `Done — ${items.length} files converted on this device`
            : null
        );
      } catch (err) {
        setBatch(items);
        setActiveId(items[0]?.id ?? null);
        setError(
          err instanceof ImageConvertError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Conversion failed."
        );
        setProgress(null);
      }
    });
  };

  const onFilesChange = (picked: File[]) => {
    const next = picked.slice(0, MAX_BATCH);
    setFiles(next);
    setError(null);
    setNatural(null);
    setProgress(null);

    if (!next.length) {
      setSourceUrl(null);
      clearBatch();
      return;
    }

    const first = next[0];
    const url = URL.createObjectURL(first);
    setSourceUrl(url);

    const probe = new Image();
    probe.onload = () => {
      setNatural({ w: probe.naturalWidth, h: probe.naturalHeight });
      if (preset === "custom" && resizeMode === "original") {
        setWidth(probe.naturalWidth);
        setHeight(probe.naturalHeight);
      }
    };
    probe.onerror = () => setNatural(null);
    probe.src = url;

    runBatch(next, direction);
  };

  const onDirectionChange = (nextId: string) => {
    setDirectionId(nextId);
    setError(null);
    const next = directions.find((d) => d.id === nextId);
    if (next && files.length) runBatch(files, next);
  };

  const toggleIcoSize = (size: number) => {
    setIcoSizes((prev) => {
      const has = prev.includes(size);
      const next = has
        ? prev.filter((s) => s !== size)
        : [...prev, size].sort((a, b) => a - b);
      return next.length ? next : prev;
    });
  };

  const onDownloadActive = () => {
    if (!active) return;
    triggerDownload(active.blob, {
      filename: replaceExtension(active.file.name, active.extension),
      mimeType: active.mimeType,
      revokeAfterMs: false,
    });
  };

  const onDownloadZip = async () => {
    if (batch.length < 2) return;
    const zip = new JSZip();
    for (const item of batch) {
      zip.file(replaceExtension(item.file.name, item.extension), item.blob);
    }
    const blob = await zip.generateAsync({ type: "blob" });
    triggerDownload(blob, {
      filename: `converted-${slug}.zip`,
      mimeType: "application/zip",
      revokeAfterMs: false,
    });
  };

  const clearAll = () => {
    setFiles([]);
    setSourceUrl(null);
    clearBatch();
    setError(null);
    setNatural(null);
    setProgress(null);
  };

  const showOpaqueBg =
    direction.target === "jpeg" ||
    direction.target === "bmp" ||
    direction.target === "tiff";

  return (
    <div className="space-y-5">
      <ConverterPrivacyRecent toolSlug={slug} engine="canvas" />
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-[var(--accent)] uppercase">
              Direction
            </p>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Converts with Canvas in your browser—nothing is uploaded. Batch up
              to {MAX_BATCH} images.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {directions.map((dir) => {
              const isActive = dir.id === direction.id;
              return (
                <button
                  key={dir.id}
                  type="button"
                  onClick={() => onDirectionChange(dir.id)}
                  className={
                    isActive
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
        {direction.note ? (
          <p className="mt-3 text-xs text-[var(--muted)] sm:text-sm">{direction.note}</p>
        ) : null}
      </div>

      <FileDropzone
        accept={direction.accept}
        maxSizeBytes={MAX_SIZE}
        multiple
        label={`Drop ${direction.fromLabel} images, or browse`}
        hint={`${direction.fromLabel} → ${direction.toLabel} · up to ${MAX_BATCH} files · max ${formatFileSize(MAX_SIZE)} each · private`}
        onFilesChange={onFilesChange}
      />

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5">
        <p className="text-xs font-semibold tracking-[0.14em] text-[var(--muted)] uppercase">
          Output options
        </p>

        {!direction.showIcoSizes ? (
          <>
            <div className="mt-3 flex flex-wrap gap-2">
              {(
                [
                  ["custom", "Custom"],
                  ["email", "Email"],
                  ["print", "Print"],
                  ["archive", "Archive"],
                ] as const
              ).map(([id, label]) => {
                const isActive = preset === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => applyPreset(id)}
                    className={
                      isActive
                        ? "rounded-lg bg-gradient-to-r from-[#00E5FF] to-[#2979FF] px-3 py-1.5 text-xs font-semibold text-white"
                        : "rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)]"
                    }
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-xs text-[var(--muted)]">
              Email = smaller &amp; shareable · Print = high quality · Archive =
              near-lossless original size
            </p>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <label className="block text-sm">
                <span className="mb-1.5 block text-xs font-medium text-[var(--muted)]">
                  Resize
                </span>
                <select
                  value={resizeMode}
                  onChange={(e) => {
                    setPreset("custom");
                    setResizeMode(e.target.value as ResizeMode);
                  }}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]"
                >
                  <option value="original">Original size</option>
                  <option value="max">Fit within max</option>
                  <option value="exact">Exact dimensions</option>
                  <option value="percent">Scale %</option>
                </select>
              </label>

              {resizeMode === "percent" ? (
                <label className="block text-sm">
                  <span className="mb-1.5 block text-xs font-medium text-[var(--muted)]">
                    Scale ({percent}%)
                  </span>
                  <input
                    type="range"
                    min={10}
                    max={200}
                    value={percent}
                    onChange={(e) => {
                      setPreset("custom");
                      setPercent(Number(e.target.value));
                    }}
                    className="mt-2 w-full accent-[#2979FF]"
                  />
                </label>
              ) : resizeMode !== "original" ? (
                <>
                  <label className="block text-sm">
                    <span className="mb-1.5 block text-xs font-medium text-[var(--muted)]">
                      Width (px)
                    </span>
                    <input
                      type="number"
                      min={1}
                      max={8192}
                      value={width}
                      onChange={(e) => {
                        setPreset("custom");
                        setWidth(Math.max(1, Number(e.target.value) || 1));
                      }}
                      className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="mb-1.5 block text-xs font-medium text-[var(--muted)]">
                      Height (px)
                    </span>
                    <input
                      type="number"
                      min={1}
                      max={8192}
                      value={height}
                      onChange={(e) => {
                        setPreset("custom");
                        setHeight(Math.max(1, Number(e.target.value) || 1));
                      }}
                      className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
                    />
                  </label>
                  {resizeMode === "exact" ? (
                    <label className="flex items-center gap-2 self-end pb-2 text-sm text-[var(--foreground)]">
                      <input
                        type="checkbox"
                        checked={lockAspect}
                        onChange={(e) => setLockAspect(e.target.checked)}
                        className="size-4 accent-[#2979FF]"
                      />
                      Lock aspect ratio
                    </label>
                  ) : null}
                </>
              ) : (
                <div className="sm:col-span-3 self-end pb-2 text-sm text-[var(--muted)]">
                  {natural
                    ? `First source ${natural.w}×${natural.h}px`
                    : "Source dimensions appear after a previewable file loads."}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="mt-4">
            <p className="mb-2 text-xs font-medium text-[var(--muted)]">
              Favicon sizes to include
            </p>
            <div className="flex flex-wrap gap-2">
              {FAVICON_SIZE_PRESETS.map((size) => {
                const isActive = icoSizes.includes(size);
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleIcoSize(size)}
                    className={
                      isActive
                        ? "rounded-lg bg-gradient-to-r from-[#00E5FF] to-[#2979FF] px-3 py-1.5 text-xs font-semibold text-white"
                        : "rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)]"
                    }
                  >
                    {size}×{size}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {direction.showQuality ? (
            <label className="block text-sm">
              <span className="mb-1.5 block text-xs font-medium text-[var(--muted)]">
                Quality ({Math.round(quality * 100)}%)
              </span>
              <input
                type="range"
                min={0.4}
                max={1}
                step={0.01}
                value={quality}
                onChange={(e) => {
                  setPreset("custom");
                  setQuality(Number(e.target.value));
                }}
                className="mt-2 w-full accent-[#2979FF]"
              />
            </label>
          ) : null}

          {showOpaqueBg ? (
            <label className="block text-sm">
              <span className="mb-1.5 block text-xs font-medium text-[var(--muted)]">
                Background fill
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                  className="h-10 w-12 cursor-pointer rounded-lg border border-[var(--border)] bg-[var(--background)]"
                />
                <input
                  type="text"
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 font-mono text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
                />
              </div>
            </label>
          ) : null}
        </div>
      </div>

      {batch.length > 1 ? (
        <div className="flex flex-wrap gap-2">
          {batch.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setActiveId(item.id);
                const url = URL.createObjectURL(item.file);
                setSourceUrl(url);
              }}
              className={
                item.id === active?.id
                  ? "rounded-lg bg-[var(--accent)] px-2.5 py-1 text-xs font-semibold text-[#041018]"
                  : "rounded-lg border border-[var(--border)] px-2.5 py-1 text-xs font-semibold text-[var(--muted)] hover:border-[var(--accent)]"
              }
            >
              {index + 1}. {item.file.name.slice(0, 18)}
              {item.file.name.length > 18 ? "…" : ""}
            </button>
          ))}
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <figure className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
          <figcaption className="flex items-center justify-between border-b border-[var(--border)] px-4 py-2.5 text-xs font-semibold tracking-[0.12em] text-[var(--muted)] uppercase">
            <span>Original · {direction.fromLabel}</span>
            {files[0] ? (
              <span className="normal-case tracking-normal text-[var(--accent)]">
                {files.length > 1
                  ? `${files.length} files`
                  : formatFileSize(files[0].size)}
              </span>
            ) : null}
          </figcaption>
          <div
            className="flex min-h-[220px] items-center justify-center p-4"
            style={{
              backgroundImage:
                "linear-gradient(45deg, color-mix(in srgb, var(--border) 70%, transparent) 25%, transparent 25%), linear-gradient(-45deg, color-mix(in srgb, var(--border) 70%, transparent) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, color-mix(in srgb, var(--border) 70%, transparent) 75%), linear-gradient(-45deg, transparent 75%, color-mix(in srgb, var(--border) 70%, transparent) 75%)",
              backgroundSize: "16px 16px",
              backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0",
              backgroundColor: "var(--background)",
            }}
          >
            {sourcePreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={sourcePreview}
                alt="Original preview"
                loading="lazy"
                decoding="async"
                className="max-h-[320px] max-w-full object-contain"
              />
            ) : (
              <p className="text-sm text-[var(--muted)]">Drop images to preview</p>
            )}
          </div>
        </figure>

        <figure className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
          <figcaption className="flex items-center justify-between border-b border-[var(--border)] px-4 py-2.5 text-xs font-semibold tracking-[0.12em] text-[var(--muted)] uppercase">
            <span>Result · {direction.toLabel}</span>
            {active ? (
              <span className="normal-case tracking-normal text-[var(--accent)]">
                {formatFileSize(active.blob.size)}
                {` · ${active.width}×${active.height}`}
              </span>
            ) : isPending ? (
              <span className="normal-case tracking-normal text-[var(--accent)]">
                Converting…
              </span>
            ) : null}
          </figcaption>
          <div
            className="flex min-h-[220px] items-center justify-center p-4"
            style={{
              backgroundImage:
                "linear-gradient(45deg, color-mix(in srgb, var(--border) 70%, transparent) 25%, transparent 25%), linear-gradient(-45deg, color-mix(in srgb, var(--border) 70%, transparent) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, color-mix(in srgb, var(--border) 70%, transparent) 75%), linear-gradient(-45deg, transparent 75%, color-mix(in srgb, var(--border) 70%, transparent) 75%)",
              backgroundSize: "16px 16px",
              backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0",
              backgroundColor: "var(--background)",
            }}
          >
            {active?.previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={active.previewUrl}
                alt="Converted preview"
                loading="lazy"
                decoding="async"
                className="max-h-[320px] max-w-full object-contain"
              />
            ) : (
              <p className="text-sm text-[var(--muted)]">
                Converted preview appears here
              </p>
            )}
          </div>
        </figure>
      </div>

      {progress ? (
        <p className="text-sm font-medium text-[var(--accent)]">{progress}</p>
      ) : null}

      {error ? (
        <p
          role="alert"
          className="rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-500"
        >
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={!files.length || isPending}
          onClick={() => files.length && runBatch(files, direction)}
          className="rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#2979FF] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Converting…" : files.length > 1 ? "Convert all" : "Convert"}
        </button>
        <button
          type="button"
          disabled={!active}
          onClick={onDownloadActive}
          className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Download{batch.length > 1 ? " selected" : ""}
        </button>
        {batch.length > 1 ? (
          <button
            type="button"
            disabled={isPending}
            onClick={() => void onDownloadZip()}
            className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Download ZIP ({batch.length})
          </button>
        ) : null}
        <button
          type="button"
          disabled={!files.length && !batch.length}
          onClick={clearAll}
          className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-semibold text-[var(--muted)] transition hover:border-red-400/50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
