"use client";

import { useRouter } from "next/navigation";
import type { PresentationDeckInput } from "@/lib/presentation/buildDeck";
import {
  loadPresentationCompare,
  presentationHref,
  savePresentationPayload,
} from "@/lib/presentation/storage";
import { encodeScenarioValues } from "@/lib/scenarioLinks";
import { PRESENTATION_TEMPLATES } from "@/lib/presentation/templates";

export function PresentationLaunchCard({
  slug,
  toolHref,
  deck,
  numericValues,
}: {
  slug: string;
  toolHref?: string;
  deck: PresentationDeckInput;
  /** When available, encoded into the presentation URL for share/reload. */
  numericValues?: Record<string, number>;
}) {
  const router = useRouter();

  const openStudio = () => {
    const compare = deck.compare ?? loadPresentationCompare(slug) ?? undefined;
    savePresentationPayload({
      ...deck,
      compare,
      slug,
      toolHref,
      savedAt: new Date().toISOString(),
    });
    const scenario =
      numericValues && Object.keys(numericValues).length > 0
        ? encodeScenarioValues(numericValues)
        : undefined;
    router.push(presentationHref(slug, scenario || undefined));
  };

  return (
    <section className="calc-panel relative mt-8 overflow-hidden rounded-3xl p-4 sm:p-7">
      <div
        className="pointer-events-none absolute -right-10 -top-16 hidden h-48 w-48 rounded-full opacity-40 sm:block"
        style={{
          background:
            "radial-gradient(circle, rgba(0,229,255,0.35), transparent 70%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-20 -left-10 hidden h-44 w-44 rounded-full opacity-35 sm:block"
        style={{
          background:
            "radial-gradient(circle, rgba(255,140,66,0.28), transparent 70%)",
        }}
        aria-hidden
      />

      <div className="relative z-[1] grid min-w-0 gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-[0.18em] text-[var(--accent)] uppercase">
            Presentation studio
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-display)] text-xl font-bold tracking-tight break-words-safe sm:text-3xl">
            Turn this scenario into a full presentation
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--muted)] sm:text-base">
            Preview a structured multi-slide deck with charts — then download a
            PDF or slide-image ZIP at the end. Choose Executive Brief, Visual
            Story, or Analyst Deck.
          </p>

          <ul className="mt-5 grid gap-2 sm:grid-cols-3">
            {PRESENTATION_TEMPLATES.map((t) => (
              <li
                key={t.id}
                className="calc-inset rounded-xl px-3 py-3 text-left"
              >
                <p className="text-xs font-semibold text-[var(--foreground)]">
                  {t.name}
                </p>
                <p className="mt-1 text-[11px] leading-snug text-[var(--muted)]">
                  {t.tagline}
                </p>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={openStudio}
            className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-[var(--accent)] px-5 py-4 text-base font-bold text-[#041018] shadow-[0_18px_40px_-18px_var(--glow)] transition hover:opacity-95 sm:w-auto sm:min-w-[260px]"
          >
            Presentation preview →
          </button>
          <p className="mt-2 text-xs text-[var(--muted)]">
            Uses your current inputs and live results.
          </p>
        </div>

        <div className="glass-3d-strong hidden rounded-2xl p-4 sm:block">
          <p className="text-[10px] font-semibold tracking-[0.14em] text-[var(--accent)] uppercase">
            Live snapshot
          </p>
          <p className="mt-2 text-sm text-[var(--muted)]">{deck.primaryLabel}</p>
          <p className="result-glow mt-1 font-[family-name:var(--font-display)] text-3xl font-bold">
            {deck.primaryValue}
          </p>
          <dl className="mt-4 space-y-2 border-t border-[var(--glass-border)] pt-3">
            {deck.rows.slice(0, 3).map((row) => (
              <div
                key={row.label}
                className="flex items-start justify-between gap-3 text-xs"
              >
                <dt className="text-[var(--muted)]">{row.label}</dt>
                <dd className="font-semibold text-[var(--foreground)]">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
