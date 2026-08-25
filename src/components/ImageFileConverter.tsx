"use client";

import { useEffect, useRef, useState, useTransition } from "react";
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

export function ImageFileConverter({ slug }: { slug: ImageConverterSlug }) {
  const tool = getImageConverterTool(slug);
  const directions = tool?.directions ?? [];
  const [directionId, setDirectionId] = useState(directions[0]?.id ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [sourcePreview, setSourcePreview] = useState<string | null>(null);
  const [resultPreview, setResultPreview] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [meta, setMeta] = useState<{
    width: number;
    height: number;
    extension: string;
    mimeType: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

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
  const resultUrlRef = useRef<string | null>(null);

  const direction: ImageConverterDirection | undefined =
    directions.find((d) => d.id === directionId) ?? directions[0];

  useEffect(() => {
    return () => {
      revokeObjectUrl(sourceUrlRef.current);
      revokeObjectUrl(resultUrlRef.current);
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

  const setResultUrl = (url: string | null) => {
    revokeObjectUrl(resultUrlRef.current);
    resultUrlRef.current = url;
    setResultPreview(url);
  };

  if (!tool || !direction) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <p className="text-sm text-[var(--muted)]">Converter configuration missing.</p>
      </div>
    );
  }

  const runConvert = (nextFile: File, dir: ImageConverterDirection) => {
    setError(null);
    startTransition(async () => {
      try {
        const result = await convertImage(nextFile, {
          target: dir.target,
          quality,
          resizeMode: dir.showIcoSizes ? "original" : resizeMode,
          width,
          height,
          percent,
          lockAspect,
          background,
          icoSizes: dir.showIcoSizes ? icoSizes : undefined,
        });
        setResultBlob(result.blob);
        setResultUrl(result.previewUrl);
        setMeta({
          width: result.width,
          height: result.height,
          extension: result.extension,
          mimeType: result.mimeType,
        });
        recordConverterJob(
          slug,
          nextFile.name,
          dir.label ?? dir.id
        );
      } catch (err) {
        setResultBlob(null);
        setResultUrl(null);
        setMeta(null);
        setError(
          err instanceof ImageConvertError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Conversion failed."
        );
      }
    });
  };

  const onFilesChange = (files: File[]) => {
    const next = files[0] ?? null;
    setFile(next);
    setResultBlob(null);
    setResultUrl(null);
    setMeta(null);
    setError(null);
    setNatural(null);

    if (!next) {
      setSourceUrl(null);
      return;
    }

    const url = URL.createObjectURL(next);
    setSourceUrl(url);

    const probe = new Image();
    probe.onload = () => {
      setNatural({ w: probe.naturalWidth, h: probe.naturalHeight });
      setWidth(probe.naturalWidth);
      setHeight(probe.naturalHeight);
    };
    probe.onerror = () => {
      // HEIC/TIFF may not preview natively — conversion still works.
      setNatural(null);
    };
    probe.src = url;

    runConvert(next, direction);
  };

  const onDirectionChange = (nextId: string) => {
    setDirectionId(nextId);
    setResultBlob(null);
    setResultUrl(null);
    setMeta(null);
    setError(null);
    const next = directions.find((d) => d.id === nextId);
    if (next && file) runConvert(file, next);
  };

  const toggleIcoSize = (size: number) => {
    setIcoSizes((prev) => {
      const has = prev.includes(size);
      const next = has ? prev.filter((s) => s !== size) : [...prev, size].sort((a, b) => a - b);
      return next.length ? next : prev;
    });
  };

  const onDownload = () => {
    if (!resultBlob || !meta) return;
    const filename = file
      ? replaceExtension(file.name, meta.extension)
      : `converted.${meta.extension}`;
    triggerDownload(resultBlob, {
      filename,
      mimeType: meta.mimeType,
      revokeAfterMs: false,
    });
  };

  const clearAll = () => {
    setFile(null);
    setSourceUrl(null);
    setResultBlob(null);
    setResultUrl(null);
    setMeta(null);
    setError(null);
    setNatural(null);
  };

  const showOpaqueBg =
    direction.target === "jpeg" ||
    direction.target === "bmp" ||
    direction.target === "tiff";

  return (
    <div className="space-y-5">
      <ConverterPrivacyRecent toolSlug={slug} />
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-[var(--accent)] uppercase">
              Direction
            </p>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Converts with Canvas in your browser—nothing is uploaded.
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
        {direction.note ? (
          <p className="mt-3 text-xs text-[var(--muted)] sm:text-sm">{direction.note}</p>
        ) : null}
      </div>

      <FileDropzone
        accept={direction.accept}
        maxSizeBytes={MAX_SIZE}
        multiple={false}
        label={`Drop a ${direction.fromLabel} image, or browse`}
        hint={`${direction.fromLabel} → ${direction.toLabel} · max ${formatFileSize(MAX_SIZE)} · private`}
        onFilesChange={onFilesChange}
      />

      {/* Options */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5">
        <p className="text-xs font-semibold tracking-[0.14em] text-[var(--muted)] uppercase">
          Output options
        </p>

        {!direction.showIcoSizes ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <label className="block text-sm">
              <span className="mb-1.5 block text-xs font-medium text-[var(--muted)]">
                Resize
              </span>
              <select
                value={resizeMode}
                onChange={(e) => setResizeMode(e.target.value as ResizeMode)}
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
                  onChange={(e) => setPercent(Number(e.target.value))}
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
                    onChange={(e) => setWidth(Math.max(1, Number(e.target.value) || 1))}
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
                    onChange={(e) => setHeight(Math.max(1, Number(e.target.value) || 1))}
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
                  ? `Source ${natural.w}×${natural.h}px`
                  : "Source dimensions appear after a previewable file loads."}
              </div>
            )}
          </div>
        ) : (
          <div className="mt-4">
            <p className="mb-2 text-xs font-medium text-[var(--muted)]">
              Favicon sizes to include
            </p>
            <div className="flex flex-wrap gap-2">
              {FAVICON_SIZE_PRESETS.map((size) => {
                const active = icoSizes.includes(size);
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleIcoSize(size)}
                    className={
                      active
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
                onChange={(e) => setQuality(Number(e.target.value))}
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

      {/* Previews */}
      <div className="grid gap-4 lg:grid-cols-2">
        <figure className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
          <figcaption className="flex items-center justify-between border-b border-[var(--border)] px-4 py-2.5 text-xs font-semibold tracking-[0.12em] text-[var(--muted)] uppercase">
            <span>Original · {direction.fromLabel}</span>
            {file ? (
              <span className="normal-case tracking-normal text-[var(--accent)]">
                {formatFileSize(file.size)}
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
              <img
                src={sourcePreview}
                alt="Original preview"
                loading="lazy"
                decoding="async"
                className="max-h-[320px] max-w-full object-contain"
              />
            ) : (
              <p className="text-sm text-[var(--muted)]">Drop an image to preview</p>
            )}
          </div>
        </figure>

        <figure className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
          <figcaption className="flex items-center justify-between border-b border-[var(--border)] px-4 py-2.5 text-xs font-semibold tracking-[0.12em] text-[var(--muted)] uppercase">
            <span>Result · {direction.toLabel}</span>
            {resultBlob ? (
              <span className="normal-case tracking-normal text-[var(--accent)]">
                {formatFileSize(resultBlob.size)}
                {meta ? ` · ${meta.width}×${meta.height}` : ""}
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
            {resultPreview ? (
              <img
                src={resultPreview}
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
          disabled={!file || isPending}
          onClick={() => file && runConvert(file, direction)}
          className="rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#2979FF] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Converting…" : "Convert"}
        </button>
        <button
          type="button"
          disabled={!resultBlob}
          onClick={onDownload}
          className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Download
        </button>
        <button
          type="button"
          disabled={!file && !resultBlob}
          onClick={clearAll}
          className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-semibold text-[var(--muted)] transition hover:border-red-400/50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
