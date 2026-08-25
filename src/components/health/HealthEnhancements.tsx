"use client";

import { useState } from "react";
import type { CalcResult, Calculator } from "@/lib/types";
import {
  loadSnapshots,
  pushSnapshot,
  type ProgressSnapshot,
} from "@/lib/toolPersistence";

export function ProgressSnapshotsPanel({
  slug,
  result,
  title = "Progress snapshots",
  disclaimer,
}: {
  slug: string;
  result: CalcResult;
  title?: string;
  disclaimer: string;
}) {
  const [shots, setShots] = useState<ProgressSnapshot[]>(() =>
    loadSnapshots(slug)
  );
  const [status, setStatus] = useState<string | null>(null);

  const save = () => {
    const list = pushSnapshot(slug, {
      label: result.primary.label,
      primary: result.primary.value,
    });
    setShots(list);
    setStatus("Snapshot saved on this device");
  };

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
      <p className="text-xs font-semibold tracking-[0.16em] text-[var(--accent)] uppercase">
        Come back later
      </p>
      <h2 className="mt-1 font-[family-name:var(--font-display)] text-lg font-bold">
        {title}
      </h2>
      <p className="mt-2 text-sm text-[var(--muted)]">{disclaimer}</p>

      <button
        type="button"
        onClick={save}
        className="mt-4 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[#041018]"
      >
        Save snapshot of current result
      </button>
      {status ? (
        <p className="mt-2 text-xs text-[var(--accent)]">{status}</p>
      ) : null}

      {shots.length > 0 ? (
        <ol className="mt-4 space-y-2 border-t border-[var(--border)] pt-4">
          {shots.map((s) => (
            <li
              key={s.at}
              className="flex flex-wrap items-baseline justify-between gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
            >
              <span>
                <strong>{s.primary}</strong>
                <span className="text-[var(--muted)]"> · {s.label}</span>
              </span>
              <time className="text-[11px] text-[var(--muted)]">
                {new Date(s.at).toLocaleString()}
              </time>
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-3 text-sm text-[var(--muted)]">
          No snapshots yet — save one to track change over time.
        </p>
      )}
    </section>
  );
}

export function HealthEnhancements({
  calculator,
  result,
}: {
  calculator: Calculator;
  result: CalcResult;
}) {
  return (
    <ProgressSnapshotsPanel
      slug={calculator.slug}
      result={result}
      title="Health check-in history"
      disclaimer="Private on this device only. Not a medical diagnosis or treatment advice — talk to a qualified clinician for health decisions."
    />
  );
}
