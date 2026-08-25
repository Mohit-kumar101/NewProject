"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { FileDropzone } from "@/components/FileDropzone";
import type { MediaConverterSlug } from "@/lib/customToolSlugs";
import {
  getMediaConverterTool,
  type MediaDirection,
} from "@/lib/mediaConverterTools";
import {
  ensureFfmpeg,
  subscribeFfmpegLoad,
  subscribeFfmpegProgress,
  type FfmpegLoadState,
} from "@/lib/ffmpegClient";
import {
  MediaConvertError,
  convertMediaFile,
  type MediaConvertResult,
} from "@/lib/mediaConverters";
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

const MAX_SIZE = 100 * 1024 * 1024; // 100 MB soft soft limit for WASM memory

function WasmLoadingCard({ state }: { state: FfmpegLoadState }) {
  const busy =
    state.phase === "downloading-core" ||
    state.phase === "downloading-wasm" ||
    state.phase === "initializing";

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
      <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-gradient-to-br from-[#00E5FF33] to-[#2979FF22] blur-2xl" />
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#00E5FF] to-[#2979FF] text-white shadow-[0_8px_24px_rgba(41,121,255,0.28)]">
          {state.phase === "ready" ? (
            <span className="text-lg font-bold">✓</span>
          ) : state.phase === "error" ? (
            <span className="text-lg font-bold">!</span>
          ) : (
            <span
              className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white"
              aria-hidden
            />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold tracking-[0.16em] text-[var(--accent)] uppercase">
            FFmpeg.wasm engine
          </p>
          <p className="mt-1 font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--foreground)]">
            {state.phase === "ready"
              ? "WebAssembly core ready"
              : state.phase === "error"
                ? "Engine failed to load"
                : "Loading WebAssembly core"}
          </p>
          <p className="mt-1 text-sm text-[var(--muted)]">{state.message}</p>
          {state.error ? (
            <p className="mt-2 text-sm text-red-500">{state.error}</p>
          ) : null}
          {(busy || state.phase === "ready") && (
            <div className="mt-3">
              <div className="mb-1.5 flex justify-between text-xs text-[var(--muted)]">
                <span>Initialization</span>
                <span className="font-semibold text-[var(--foreground)]">
                  {state.percent}%
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-[var(--background)]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#00E5FF] to-[#2979FF] transition-[width] duration-200"
                  style={{ width: `${state.percent}%` }}
                  role="progressbar"
                  aria-valuenow={state.percent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="FFmpeg WASM load progress"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function MediaFileConverter({ slug }: { slug: MediaConverterSlug }) {
  const tool = getMediaConverterTool(slug);
  const directions = tool?.directions ?? [];
  const [directionId, setDirectionId] = useState(directions[0]?.id ?? "");
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<MediaConvertResult | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadState, setLoadState] = useState<FfmpegLoadState>(() => ({
    phase: "idle",
    percent: 0,
    message: "Preparing FFmpeg…",
  }));
  const [processPercent, setProcessPercent] = useState(0);
  const [isConverting, setIsConverting] = useState(false);
  const [isPending, startTransition] = useTransition();

  const direction: MediaDirection | undefined = useMemo(
    () => directions.find((d) => d.id === directionId) ?? directions[0],
    [directionId, directions]
  );

  useEffect(() => {
    const unsubLoad = subscribeFfmpegLoad(setLoadState);
    const unsubProgress = subscribeFfmpegProgress(({ percent }) => {
      setProcessPercent(percent);
    });
    // Warm the WASM engine as soon as the tool opens.
    void ensureFfmpeg().catch(() => {
      /* surfaced via loadState */
    });
    return () => {
      unsubLoad();
      unsubProgress();
    };
  }, []);

  useEffect(() => {
    return () => {
      revokeObjectUrl(previewUrl);
    };
  }, [previewUrl]);

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

  const engineReady = loadState.phase === "ready";
  const file = files[0] ?? null;

  const runConvert = () => {
    if (!file) {
      setError("Drop a media file first.");
      return;
    }
    setError(null);
    setResult(null);
    setProcessPercent(0);
    setIsConverting(true);
    startTransition(async () => {
      try {
        await ensureFfmpeg();
        const next = await convertMediaFile(file, direction.from, direction.to);
        setResult(next);
        setProcessPercent(100);
        recordConverterJob(
          slug,
          file.name,
          `${direction.from} → ${direction.to}`
        );
        revokeObjectUrl(previewUrl);
        const url = URL.createObjectURL(next.blob);
        setPreviewUrl(url);
      } catch (err) {
        setResult(null);
        setError(
          err instanceof MediaConvertError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Conversion failed."
        );
      } finally {
        setIsConverting(false);
      }
    });
  };

  const onDownload = () => {
    if (!result) return;
    const filename = file
      ? replaceExtension(file.name, result.extension)
      : result.filename;
    triggerDownload(result.blob, {
      filename,
      mimeType: result.mimeType,
      revokeAfterMs: false,
    });
  };

  const clearAll = () => {
    setFiles([]);
    setResult(null);
    revokeObjectUrl(previewUrl);
    setPreviewUrl(null);
    setError(null);
    setProcessPercent(0);
  };

  const isVideoOut = direction.to === "mp4" || direction.to === "mov" || direction.to === "webm";
  const isAudioOut =
    direction.to === "mp3" ||
    direction.to === "wav" ||
    direction.to === "ogg" ||
    direction.to === "flac" ||
    result?.extension === "m4a";

  return (
    <div className="space-y-5">
      <ConverterPrivacyRecent toolSlug={slug} />
      <WasmLoadingCard state={loadState} />

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-[var(--accent)] uppercase">
              Direction
            </p>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Converts with FFmpeg.wasm — media never leaves this browser.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {directions.map((dir) => {
              const active = dir.id === direction.id;
              return (
                <button
                  key={dir.id}
                  type="button"
                  onClick={() => {
                    setDirectionId(dir.id);
                    clearAll();
                  }}
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
        multiple={false}
        files={files}
        disabled={!engineReady || isConverting}
        label={
          engineReady
            ? `Drop a ${direction.from.toUpperCase()} file, or browse`
            : "Waiting for FFmpeg WASM to finish loading…"
        }
        hint={`${direction.from.toUpperCase()} → ${direction.to.toUpperCase()} · max ${formatFileSize(MAX_SIZE)} · private`}
        onFilesChange={setFiles}
      />

      {(isConverting || processPercent > 0) && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 sm:px-5">
          <div className="flex items-center justify-between gap-3 text-xs sm:text-sm">
            <span className="font-medium text-[var(--muted)]">
              {isConverting ? "FFmpeg processing media…" : "Last conversion"}
            </span>
            <span className="font-semibold text-[var(--foreground)]">
              {Math.min(100, processPercent)}%
            </span>
          </div>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-[var(--background)]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#00E5FF] to-[#2979FF] transition-[width] duration-150 ease-out"
              style={{ width: `${Math.min(100, processPercent)}%` }}
              role="progressbar"
              aria-valuenow={Math.min(100, processPercent)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="FFmpeg conversion progress"
            />
          </div>
        </div>
      )}

      {error ? (
        <p
          role="alert"
          className="rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-500"
        >
          {error}
        </p>
      ) : null}

      {previewUrl && result ? (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5">
          <p className="text-xs font-semibold tracking-[0.14em] text-[var(--muted)] uppercase">
            Preview · {result.filename}
          </p>
          <div className="mt-3 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)] p-3">
            {isVideoOut && result.extension !== "m4a" ? (
              <video
                src={previewUrl}
                controls
                className="max-h-[360px] w-full rounded-lg"
              />
            ) : isAudioOut || result.mimeType.startsWith("audio/") ? (
              <audio src={previewUrl} controls className="w-full" />
            ) : (
              <p className="text-sm text-[var(--muted)]">
                Preview unavailable — download to play.
              </p>
            )}
          </div>
          <p className="mt-2 text-sm text-[var(--muted)]">
            {formatFileSize(result.blob.size)} · {result.mimeType}
          </p>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={!file || !engineReady || isConverting || isPending}
          onClick={runConvert}
          className="rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#2979FF] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isConverting ? "Converting…" : "Convert"}
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
          disabled={!file && !result}
          onClick={clearAll}
          className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-semibold text-[var(--muted)] transition hover:border-red-400/50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
