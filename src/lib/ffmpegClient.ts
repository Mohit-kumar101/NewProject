/**
 * Singleton FFmpeg.wasm client with WASM download + init progress.
 * Single-thread core (no COOP/COEP required).
 */

import type { FFmpeg } from "@ffmpeg/ffmpeg";

export type FfmpegLoadPhase =
  | "idle"
  | "downloading-core"
  | "downloading-wasm"
  | "initializing"
  | "ready"
  | "error";

export type FfmpegLoadState = {
  phase: FfmpegLoadPhase;
  /** 0–100 overall load progress */
  percent: number;
  message: string;
  error?: string;
};

export type FfmpegProcessProgress = {
  /** 0–100 during exec (from FFmpeg progress events) */
  percent: number;
  timeMicros: number;
};

type LoadListener = (state: FfmpegLoadState) => void;
type ProcessListener = (progress: FfmpegProcessProgress) => void;

const CORE_VERSION = "0.12.10";
const CORE_BASE = `https://cdn.jsdelivr.net/npm/@ffmpeg/core@${CORE_VERSION}/dist/umd`;

let ffmpegInstance: FFmpeg | null = null;
let loadPromise: Promise<FFmpeg> | null = null;
let loadState: FfmpegLoadState = {
  phase: "idle",
  percent: 0,
  message: "FFmpeg is idle",
};

const loadListeners = new Set<LoadListener>();
const processListeners = new Set<ProcessListener>();

function emitLoad(partial: Partial<FfmpegLoadState>) {
  loadState = { ...loadState, ...partial };
  loadListeners.forEach((listener) => listener(loadState));
}

export function getFfmpegLoadState(): FfmpegLoadState {
  return loadState;
}

export function subscribeFfmpegLoad(listener: LoadListener): () => void {
  loadListeners.add(listener);
  listener(loadState);
  return () => loadListeners.delete(listener);
}

export function subscribeFfmpegProgress(listener: ProcessListener): () => void {
  processListeners.add(listener);
  return () => processListeners.delete(listener);
}

function onProcessProgress(progress: number, time: number) {
  const percent = Math.max(0, Math.min(100, Math.round(progress * 100)));
  const update = { percent, timeMicros: time };
  processListeners.forEach((listener) => listener(update));
}

/**
 * Fetch a remote asset into a blob URL, reading the Response body only once.
 *
 * Avoids @ffmpeg/util's toBlobURL(progress=true) path, which can call
 * getReader() and then resp.arrayBuffer() on the same Response when
 * Content-Length disagrees with bytes received (common on CDNs).
 */
async function fetchToBlobURL(
  url: string,
  mimeType: string,
  onProgress?: (received: number, total: number) => void
): Promise<string> {
  const resp = await fetch(url);
  if (!resp.ok) {
    throw new Error(`Failed to download ${url} (${resp.status})`);
  }

  const contentLength = parseInt(resp.headers.get("Content-Length") || "0", 10);
  const total = Number.isFinite(contentLength) && contentLength > 0 ? contentLength : 0;
  const reader = resp.body?.getReader();

  let buffer: ArrayBuffer;

  if (!reader) {
    // Body has no stream reader; consume once via arrayBuffer.
    buffer = await resp.arrayBuffer();
    onProgress?.(buffer.byteLength, buffer.byteLength);
  } else {
    const chunks: Uint8Array[] = [];
    let received = 0;

    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value) continue;
      chunks.push(value);
      received += value.length;
      onProgress?.(received, total || received);
    }

    const data = new Uint8Array(received);
    let offset = 0;
    for (const chunk of chunks) {
      data.set(chunk, offset);
      offset += chunk.length;
    }
    buffer = data.buffer;
  }

  return URL.createObjectURL(new Blob([buffer], { type: mimeType }));
}

/**
 * Load (or reuse) the FFmpeg WASM engine. Safe to call repeatedly.
 */
export async function ensureFfmpeg(): Promise<FFmpeg> {
  if (ffmpegInstance?.loaded) return ffmpegInstance;
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    try {
      const { FFmpeg } = await import("@ffmpeg/ffmpeg");

      const ffmpeg = new FFmpeg();
      ffmpegInstance = ffmpeg;

      ffmpeg.on("progress", ({ progress, time }) => {
        onProcessProgress(progress, time);
      });

      emitLoad({
        phase: "downloading-core",
        percent: 2,
        message: "Downloading FFmpeg JavaScript core…",
        error: undefined,
      });

      const coreURL = await fetchToBlobURL(
        `${CORE_BASE}/ffmpeg-core.js`,
        "text/javascript",
        (received, total) => {
          if (!total) return;
          const pct = Math.round((received / total) * 40);
          emitLoad({
            phase: "downloading-core",
            percent: Math.max(2, Math.min(40, pct)),
            message: `Downloading FFmpeg core… ${Math.round((received / total) * 100)}%`,
          });
        }
      );

      emitLoad({
        phase: "downloading-wasm",
        percent: 42,
        message: "Downloading WebAssembly module…",
      });

      const wasmURL = await fetchToBlobURL(
        `${CORE_BASE}/ffmpeg-core.wasm`,
        "application/wasm",
        (received, total) => {
          if (!total) return;
          const pct = 42 + Math.round((received / total) * 48);
          emitLoad({
            phase: "downloading-wasm",
            percent: Math.max(42, Math.min(90, pct)),
            message: `Downloading WebAssembly… ${Math.round((received / total) * 100)}%`,
          });
        }
      );

      emitLoad({
        phase: "initializing",
        percent: 92,
        message: "Initializing WebAssembly engine…",
      });

      await ffmpeg.load({ coreURL, wasmURL });

      emitLoad({
        phase: "ready",
        percent: 100,
        message: "FFmpeg ready — convert locally in your browser",
      });

      return ffmpeg;
    } catch (err) {
      loadPromise = null;
      ffmpegInstance = null;
      const message =
        err instanceof Error ? err.message : "Failed to load FFmpeg WASM.";
      emitLoad({
        phase: "error",
        percent: 0,
        message: "FFmpeg failed to load",
        error: message,
      });
      throw err;
    }
  })();

  return loadPromise;
}

export async function resetFfmpegFs(paths: string[]): Promise<void> {
  const ffmpeg = await ensureFfmpeg();
  for (const path of paths) {
    try {
      await ffmpeg.deleteFile(path);
    } catch {
      // ignore missing files
    }
  }
}
