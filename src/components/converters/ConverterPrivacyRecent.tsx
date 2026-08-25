"use client";

import { useEffect, useState } from "react";
import {
  loadConverterRecent,
  pushConverterRecent,
  type ConverterRecentJob,
} from "@/lib/toolPersistence";

/** Privacy badge + recent job metadata (no file bytes stored). */
export function ConverterPrivacyRecent({
  toolSlug,
}: {
  toolSlug: string;
}) {
  const [recent, setRecent] = useState<ConverterRecentJob[]>([]);

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
          Files are processed on your device. We don&apos;t upload your
          documents to CalculioHub servers. Recent job names below are stored
          locally as text only — not the files themselves.
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
