"use client";

import { useEffect, useState } from "react";
import { getCalculatorBySlug } from "@/lib/calculators";
import {
  readHandoffFromSlug,
  stripHandoffQuery,
} from "@/lib/scenarioLinks";

export function HandoffArrivalBanner({
  onClear,
}: {
  onClear: () => void;
}) {
  const [fromTitle, setFromTitle] = useState<string | null>(null);

  useEffect(() => {
    const slug = readHandoffFromSlug();
    if (!slug) return;
    const tool = getCalculatorBySlug(slug);
    setFromTitle(tool?.title ?? slug.replace(/-/g, " "));
  }, []);

  if (!fromTitle) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--accent)]/35 bg-[var(--accent)]/8 px-4 py-3">
      <p className="text-sm text-[var(--foreground)]">
        Filled from <span className="font-semibold">{fromTitle}</span>. Numbers
        came from that page — change anything that looks off.
      </p>
      <button
        type="button"
        onClick={() => {
          stripHandoffQuery();
          setFromTitle(null);
          onClear();
        }}
        className="shrink-0 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs font-semibold hover:border-[var(--accent)]"
      >
        Clear and use defaults
      </button>
    </div>
  );
}
