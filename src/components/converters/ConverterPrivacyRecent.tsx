"use client";

import { useEffect, useState } from "react";
import {
  loadConverterRecent,
  pushConverterRecent,
  type ConverterRecentJob,
} from "@/lib/toolPersistence";

export type ConverterEngineHint = "canvas" | "ffmpeg" | "pdf";

const ENGINE_COPY: Record<
  ConverterEngineHint,
  { title: string; assets: string }
> = {
  canvas: {
    title: "Canvas (on-device)",
    assets: "No CDN engine download for conversion — your image bytes stay local.",
  },
  ffmpeg: {
    title: "FFmpeg.wasm (on-device)",
    assets:
      "Engine scripts may load once from jsDelivr. Your media files are never uploaded to CalculioHub.",
  },
  pdf: {
    title: "pdf.js / pdf-lib (on-device)",
    assets:
      "A PDF worker may load once from unpkg. Your documents are never uploaded to CalculioHub.",
  },
};

/** Privacy badge + recent job metadata (no file bytes stored). */
export function ConverterPrivacyRecent({
  toolSlug,
  engine = "canvas",
  engineReady,
}: {
  toolSlug: string;
  engine?: ConverterEngineHint;
  /** When provided, show live engine status (e.g. FFmpeg warm). */
  engineReady?: boolean | null;
}) {
  const [recent, setRecent] = useState<ConverterRecentJob[]>([]);
  const copy = ENGINE_COPY[engine];

  useEffect(() => {
    setRecent(loadConverterRecent(toolSlug));
  }, [toolSlug]);

  useEffect(() => {
    const onUpdate = () => setRecent(loadConverterRecent(toolSlug));
    window.addEventListener("calculiohub-converter-recent", onUpdate);
    return () =>
      window.removeEventListener("calculiohub-converter-recent", onUpdate);
  }, [toolSlug]);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-[color-mix(in_srgb,var(--accent)_40%,var(--border))] bg-[color-mix(in_srgb,var(--accent)_10%,var(--background))] px-4 py-3 sm:px-5">
        <p className="text-xs font-semibold tracking-[0.16em] text-[var(--accent)] uppercase">
          Private · In-browser · No signup
        </p>
        <p className="mt-1 text-sm text-[color-mix(in_srgb,var(--foreground)_82%,var(--muted))]">
          Your files are processed on this device. CalculioHub does not receive
          uploads of your documents, photos, or media.
        </p>
        <dl className="mt-3 grid gap-2 text-xs sm:grid-cols-2 sm:text-sm">
          <div className="rounded-xl border border-[color-mix(in_srgb,var(--accent)_25%,var(--border))] bg-[var(--background)]/50 px-3 py-2">
            <dt className="font-semibold text-[var(--foreground)]">
              Your files
            </dt>
            <dd className="mt-0.5 text-[var(--muted)]">
              Stay in memory / local processing — not sent to our servers.
            </dd>
          </div>
          <div className="rounded-xl border border-[color-mix(in_srgb,var(--accent)_25%,var(--border))] bg-[var(--background)]/50 px-3 py-2">
            <dt className="font-semibold text-[var(--foreground)]">
              {copy.title}
            </dt>
            <dd className="mt-0.5 text-[var(--muted)]">{copy.assets}</dd>
          </div>
        </dl>
        {engineReady != null ? (
          <p className="mt-2 text-xs font-medium text-[var(--accent)]">
            Engine status: {engineReady ? "Ready on this device" : "Loading…"}
          </p>
        ) : null}
        <p className="mt-2 text-xs text-[var(--muted)]">
          Recent job names below are stored locally as text only — never the
          file bytes.
        </p>
      </div>

      {recent.length > 0 ? (
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 sm:px-5">
          <p className="text-xs font-semibold tracking-[0.14em] text-[var(--muted)] uppercase">
            Recent on this device
          </p>
          <ul className="mt-2 space-y-1.5">
            {recent.map((job) => (
              <li
                key={job.id}
                className="flex flex-wrap items-baseline justify-between gap-2 text-sm"
              >
                <span>
                  {job.label}
                  {job.direction ? (
                    <span className="text-[var(--muted)]">
                      {" "}
                      · {job.direction}
                    </span>
                  ) : null}
                </span>
                <time className="text-[11px] text-[var(--muted)]">
                  {new Date(job.at).toLocaleString()}
                </time>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

/** Call after a successful conversion. */
export function recordConverterJob(
  toolSlug: string,
  label: string,
  direction?: string
): ConverterRecentJob[] {
  const list = pushConverterRecent(toolSlug, { label, direction });
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("calculiohub-converter-recent"));
  }
  return list;
}
