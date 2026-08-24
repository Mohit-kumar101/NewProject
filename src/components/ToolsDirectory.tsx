"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CATEGORIES,
  calculators,
  toolMatchesQuery,
} from "@/lib/calculators";
import { getToolHref } from "@/lib/cryptoFormulas";
import type { Calculator } from "@/lib/types";

function categoryId(category: string) {
  return category.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

const SUGGESTION_CHIPS = [
  "pdf",
  "heic",
  "mp3",
  "json",
  "mortgage",
  "GPA",
  "BMI",
  "crypto",
];

export function ToolsDirectory() {
  const [query, setQuery] = useState("");
  const q = query.trim();
  const isSearching = q.length > 0;

  const filtered = useMemo(() => {
    if (!isSearching) return calculators;
    return calculators.filter((tool) => toolMatchesQuery(tool, q));
  }, [isSearching, q]);

  const grouped = useMemo(() => {
    const byCategory = new Map<string, Calculator[]>();
    for (const tool of filtered) {
      const list = byCategory.get(tool.category) ?? [];
      list.push(tool);
      byCategory.set(tool.category, list);
    }
    return CATEGORIES.map((category) => ({
      category,
      tools: byCategory.get(category) ?? [],
    })).filter((group) => group.tools.length > 0);
  }, [filtered]);

  return (
    <div>
      <div className="mb-8">
        <label className="block">
          <span className="sr-only">Search all tools</span>
          <div className="command-bar flex w-full items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-4 shadow-[0_0_0_1px_rgba(0,229,255,0.08)] transition focus-within:border-[var(--accent)] focus-within:shadow-[0_0_0_4px_rgba(0,229,255,0.15)]">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              className="shrink-0 text-[var(--muted)]"
              aria-hidden
            >
              <circle
                cx="11"
                cy="11"
                r="7"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path
                d="M20 20l-3.5-3.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search calculators & converters… mortgage, pdf, heic, BMI…"
              className="w-full bg-transparent text-base text-[var(--foreground)] outline-none placeholder:text-[var(--muted)] sm:text-lg"
              autoComplete="off"
              aria-label="Search all calculators and converters"
            />
            {isSearching && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="shrink-0 rounded-lg border border-[var(--border)] px-2.5 py-1 text-xs font-medium text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                Clear
              </button>
            )}
          </div>
        </label>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {SUGGESTION_CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => setQuery(chip)}
              className="rounded-full border border-[var(--border)] bg-[var(--background)] px-3 py-1 text-xs font-medium text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              {chip}
            </button>
          ))}
        </div>

        <p className="mt-3 text-sm text-[var(--muted)]" aria-live="polite">
          {isSearching
            ? filtered.length === 0
              ? `No tools match “${q}”.`
              : `${filtered.length} tool${filtered.length === 1 ? "" : "s"} match “${q}”`
            : `${calculators.length} tools across ${CATEGORIES.length} categories`}
        </p>
      </div>

      {!isSearching && (
        <div className="mb-10 flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <a
              key={category}
              href={`#${categoryId(category)}`}
              className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              {category}
            </a>
          ))}
        </div>
      )}

      {grouped.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--border)] px-4 py-16 text-center">
          <p className="text-sm text-[var(--muted)]">
            No tools match “{q}”. Try another keyword like{" "}
            <button
              type="button"
              onClick={() => setQuery("pdf")}
              className="font-medium text-[var(--accent)] underline-offset-2 hover:underline"
            >
              pdf
            </button>
            ,{" "}
            <button
              type="button"
              onClick={() => setQuery("mortgage")}
              className="font-medium text-[var(--accent)] underline-offset-2 hover:underline"
            >
              mortgage
            </button>
            , or{" "}
            <button
              type="button"
              onClick={() => setQuery("BMI")}
              className="font-medium text-[var(--accent)] underline-offset-2 hover:underline"
            >
              BMI
            </button>
            .
          </p>
        </div>
      ) : (
        <div className="space-y-14">
          {grouped.map(({ category, tools }) => (
            <section
              key={category}
              id={isSearching ? undefined : categoryId(category)}
            >
              <div className="mb-5 flex items-baseline justify-between gap-3">
                <h2 className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight sm:text-2xl">
                  {category}
                </h2>
                <span className="text-sm text-[var(--muted)]">
                  {tools.length} tool{tools.length === 1 ? "" : "s"}
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {tools.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={getToolHref(tool.slug)}
                    className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 py-4 transition hover:border-[var(--accent)] hover:bg-[var(--background)]"
                  >
                    <div className="font-semibold text-[var(--foreground)]">
                      {tool.title}
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-[var(--muted)]">
                      {tool.description}
                    </p>
                    <p className="mt-3 text-xs font-semibold tracking-wide text-[var(--accent)] uppercase">
                      Open tool →
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
