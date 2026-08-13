"use client";

import { useId, useState } from "react";
import type { ToolExplanationContent } from "@/lib/types";

export function ToolExplanation({
  title,
  heading,
  example,
  content,
  defaultOpen = true,
}: {
  title: string;
  heading?: string;
  example?: string;
  content: ToolExplanationContent;
  defaultOpen?: boolean;
}) {
  const panelId = useId();
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section
      className="mt-16 max-w-3xl"
      aria-labelledby="tool-explanation-heading"
    >
      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-[color-mix(in_srgb,var(--accent)_6%,transparent)] sm:px-6"
        >
          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-[0.16em] text-[var(--accent)] uppercase">
              Formula & methodology
            </p>
            <h2
              id="tool-explanation-heading"
              className="mt-1 font-[family-name:var(--font-display)] text-xl font-bold tracking-tight text-[var(--foreground)] sm:text-2xl"
            >
              {heading ?? `How ${title} Works`}
            </h2>
          </div>
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--background)] text-[var(--muted)] transition ${
              open ? "rotate-180" : ""
            }`}
            aria-hidden
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 9l6 6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>

        <div
          id={panelId}
          hidden={!open}
          className="border-t border-[var(--border)] px-5 pb-6 pt-5 sm:px-6"
        >
          <div className="pointer-events-none relative mb-5 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-4 sm:px-5">
            <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br from-[#00E5FF33] to-[#2979FF22] blur-2xl" />
            <p className="relative text-[11px] font-semibold tracking-[0.14em] text-[var(--accent)] uppercase">
              Governing formula
            </p>
            <p className="relative mt-2 overflow-x-auto font-mono text-sm leading-relaxed text-[var(--foreground)] sm:text-[15px]">
              {content.formula}
            </p>
          </div>

          <p className="text-sm leading-relaxed text-[color-mix(in_srgb,var(--foreground)_78%,var(--muted))] sm:text-base">
            {content.summary}
          </p>

          {example ? (
            <p className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm leading-relaxed text-[color-mix(in_srgb,var(--foreground)_78%,var(--muted))] sm:text-base">
              {example}
            </p>
          ) : null}

          <h3 className="mt-6 text-sm font-semibold tracking-[0.12em] text-[var(--foreground)] uppercase">
            Variable definitions
          </h3>
          <ul className="mt-3 space-y-3">
            {content.variables.map((variable) => (
              <li
                key={`${variable.symbol}-${variable.name}`}
                className="flex gap-3 rounded-xl border border-transparent px-1 py-1 sm:gap-4"
              >
                <span className="mt-0.5 flex h-8 min-w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#00E5FF] to-[#2979FF] px-2 font-mono text-xs font-bold text-white">
                  {variable.symbol}
                </span>
                <div className="min-w-0 pt-0.5">
                  <p className="text-sm font-semibold text-[var(--foreground)]">
                    {variable.name}
                  </p>
                  <p className="mt-0.5 text-sm leading-relaxed text-[color-mix(in_srgb,var(--foreground)_75%,var(--muted))]">
                    {variable.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          {content.notes && content.notes.length > 0 ? (
            <ul className="mt-5 space-y-1.5 border-t border-[var(--border)] pt-4">
              {content.notes.map((note) => (
                <li
                  key={note}
                  className="text-xs leading-relaxed text-[color-mix(in_srgb,var(--foreground)_65%,var(--muted))]"
                >
                  {note}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  );
}
