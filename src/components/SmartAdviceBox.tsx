"use client";

import type { AdviceItem, AdviceTone } from "@/lib/types";

const toneStyles: Record<
  AdviceTone,
  { badge: string; border: string; glow: string }
> = {
  positive: {
    badge:
      "bg-[color-mix(in_srgb,#22c55e_18%,var(--surface))] text-[#15803d] dark:text-[#4ade80]",
    border: "border-[color-mix(in_srgb,#22c55e_35%,var(--border))]",
    glow: "from-[#22c55e55] to-transparent",
  },
  caution: {
    badge:
      "bg-[color-mix(in_srgb,#f59e0b_18%,var(--surface))] text-[#b45309] dark:text-[#fbbf24]",
    border: "border-[color-mix(in_srgb,#f59e0b_35%,var(--border))]",
    glow: "from-[#f59e0b55] to-transparent",
  },
  warning: {
    badge:
      "bg-[color-mix(in_srgb,#ef4444_16%,var(--surface))] text-[#b91c1c] dark:text-[#f87171]",
    border: "border-[color-mix(in_srgb,#ef4444_35%,var(--border))]",
    glow: "from-[#ef444455] to-transparent",
  },
  info: {
    badge:
      "bg-[color-mix(in_srgb,#2979FF_16%,var(--surface))] text-[#1d4ed8] dark:text-[#93c5fd]",
    border: "border-[color-mix(in_srgb,#2979FF_35%,var(--border))]",
    glow: "from-[#00E5FF44] to-[#2979FF22]",
  },
};

export function SmartAdviceBox({
  items,
  className = "",
}: {
  items: AdviceItem[];
  className?: string;
}) {
  if (!items.length) return null;

  const leadTone = items[0]?.tone ?? "info";
  const lead = toneStyles[leadTone];

  return (
    <section
      className={`relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 ${className}`}
      aria-labelledby="smart-advice-heading"
      aria-live="polite"
    >
      <div
        className={`pointer-events-none absolute -right-16 -top-20 h-44 w-44 rounded-full bg-gradient-to-br ${lead.glow} blur-2xl`}
      />
      <div className="pointer-events-none absolute -bottom-14 -left-10 h-32 w-32 rounded-full bg-gradient-to-tr from-[#2979FF18] to-transparent blur-2xl" />

      <div className="relative">
        <p className="text-xs font-semibold tracking-[0.16em] text-[var(--accent)] uppercase">
          Smart analysis
        </p>
        <h2
          id="smart-advice-heading"
          className="mt-1 font-[family-name:var(--font-display)] text-lg font-bold tracking-tight text-[var(--foreground)] sm:text-xl"
        >
          Recommendations
        </h2>
        <p className="mt-1.5 text-sm text-[color-mix(in_srgb,var(--foreground)_72%,var(--muted))]">
          Tailored to your live inputs and result—guidance only, not professional
          advice.
        </p>

        <ul className="mt-4 space-y-3">
          {items.map((advice) => {
            const styles = toneStyles[advice.tone];
            return (
              <li
                key={`${advice.badge}-${advice.title}`}
                className={`rounded-xl border ${styles.border} bg-[var(--background)]/80 p-3.5 sm:p-4`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase ${styles.badge}`}
                  >
                    {advice.badge}
                  </span>
                  <p className="text-sm font-semibold text-[var(--foreground)]">
                    {advice.title}
                  </p>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-[color-mix(in_srgb,var(--foreground)_78%,var(--muted))]">
                  {advice.message}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
