"use client";

import { useEffect, useState } from "react";
import {
  buildScenarioUrl,
  copyText,
  readScenarioFromLocation,
} from "@/lib/scenarioLinks";
import { loadToolValues, saveToolValues } from "@/lib/toolPersistence";

/**
 * Shared “remember + share” bar for sticky calculator categories.
 * Additive — does not change formula logic.
 */
export function ToolMemoryBar({
  slug,
  values,
  onRestore,
  autosave = true,
}: {
  slug: string;
  values: Record<string, number>;
  onRestore: (next: Record<string, number>) => void;
  autosave?: boolean;
}) {
  const [status, setStatus] = useState<string | null>(null);
  const [hasSaved, setHasSaved] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const fromUrl = readScenarioFromLocation();
    if (fromUrl) {
      onRestore(fromUrl);
      setStatus("Loaded shared scenario from link");
      setHydrated(true);
      return;
    }
    const saved = loadToolValues(slug);
    if (saved) {
      setHasSaved(true);
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- one-time hydrate
  }, [slug]);

  useEffect(() => {
    if (!hydrated || !autosave) return;
    const t = window.setTimeout(() => {
      saveToolValues(slug, values);
      setHasSaved(true);
    }, 400);
    return () => window.clearTimeout(t);
  }, [slug, values, hydrated, autosave]);

  const restoreSaved = () => {
    const saved = loadToolValues(slug);
    if (!saved) {
      setStatus("No saved inputs on this device yet");
      return;
    }
    onRestore({ ...values, ...saved });
    setStatus("Restored last visit inputs");
  };

  const copyLink = async () => {
    const url = buildScenarioUrl(values);
    const ok = await copyText(url);
    setStatus(ok ? "Scenario link copied" : "Could not copy link");
  };

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 sm:px-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.14em] text-[var(--accent)] uppercase">
            Remember · Share
          </p>
          <p className="mt-0.5 text-xs text-[var(--muted)] sm:text-sm">
            Inputs save on this device only. Share a link to reopen your exact
            numbers.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={restoreSaved}
            disabled={!hasSaved}
            className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)] disabled:opacity-40 sm:text-sm"
          >
            Restore last visit
          </button>
          <button
            type="button"
            onClick={copyLink}
            className="rounded-xl bg-[var(--accent)] px-3 py-2 text-xs font-semibold text-[#041018] transition hover:opacity-90 sm:text-sm"
          >
            Copy scenario link
          </button>
        </div>
      </div>
      {status ? (
        <p className="mt-2 text-xs font-medium text-[var(--accent)]">{status}</p>
      ) : null}
    </div>
  );
}
