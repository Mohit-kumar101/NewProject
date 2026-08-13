"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { calculators, toolMatchesQuery } from "@/lib/calculators";
import { getToolHref } from "@/lib/cryptoFormulas";

export type ToolSearchFooterProps = {
  /** Full CalculioHub category name for topical clustering. */
  currentCategory: string;
  /** Active tool slug — never linked as a self-reference. */
  currentSlug: string;
};

const DEFAULT_RELATED = 3;
/** Cap search hits so the footer stays scannable while still filtering the full catalog. */
const SEARCH_LIMIT = 12;

/**
 * Post-FAQ internal linking widget.
 * Default: 3 same-category tools · Search: live filter across the full catalog.
 * Present on every tool page via ToolPageShell (including all file converters).
 */
export function ToolSearchFooter({
  currentCategory,
  currentSlug,
}: ToolSearchFooterProps) {
  const [query, setQuery] = useState("");

  const catalog = useMemo(
    () => calculators.filter((tool) => tool.slug !== currentSlug),
    [currentSlug]
  );

  const relatedInCategory = useMemo(
    () =>
      catalog
        .filter((tool) => tool.category === currentCategory)
        .slice(0, DEFAULT_RELATED),
    [catalog, currentCategory]
  );

  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q) return relatedInCategory;
    return catalog
      .filter((tool) => toolMatchesQuery(tool, q))
      .slice(0, SEARCH_LIMIT);
  }, [catalog, query, relatedInCategory]);

  const isSearching = query.trim().length > 0;
  const totalMatches = useMemo(() => {
    if (!isSearching) return relatedInCategory.length;
    return catalog.filter((tool) => toolMatchesQuery(tool, query)).length;
  }, [catalog, isSearching, query, relatedInCategory.length]);

  return (
    <section
      className="mt-16 w-full"
      aria-labelledby="tool-search-footer-heading"
    >
      <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
        <div className="pointer-events-none absolute -right-16 -top-20 h-44 w-44 rounded-full bg-gradient-to-br from-[#00E5FF33] to-[#2979FF22] blur-2xl" />
        <div className="pointer-events-none absolute -bottom-14 -left-10 h-32 w-32 rounded-full bg-gradient-to-tr from-[#2979FF22] to-transparent blur-2xl" />

        <div className="relative">
          <p className="text-xs font-semibold tracking-[0.16em] text-[var(--accent)] uppercase">
            Discover & search
          </p>
          <h2
            id="tool-search-footer-heading"
            className="mt-2 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-[var(--foreground)]"
          >
            Explore More Tools
          </h2>
          <p className="mt-2 text-sm text-[color-mix(in_srgb,var(--foreground)_75%,var(--muted))]">
            {isSearching
              ? "Searching all CalculioHub calculators and file converters."
              : `Related tools in ${currentCategory} — strengthening topical internal links.`}
          </p>

          <label className="mt-5 block">
            <span className="sr-only">Search other tools</span>
            <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-3 transition focus-within:border-[var(--accent)] focus-within:shadow-[0_0_0_4px_rgba(0,229,255,0.12)]">
              <svg
                width="18"
                height="18"
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
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search tools (e.g. pdf, mp3, json, png, mortgage)…"
                className="w-full bg-transparent text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted)] sm:text-[15px]"
                autoComplete="off"
                spellCheck={false}
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="shrink-0 rounded-md border border-[var(--border)] px-2 py-0.5 text-[11px] font-medium text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                >
                  Clear
                </button>
              ) : null}
            </div>
          </label>

          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="text-xs text-[var(--muted)]" aria-live="polite">
              {isSearching
                ? `${filtered.length} of ${totalMatches} match${totalMatches === 1 ? "" : "es"}`
                : `Same category · ${filtered.length} tool${filtered.length === 1 ? "" : "s"}`}
            </p>
            <Link
              href="/tools"
              className="text-xs font-semibold tracking-wide text-[var(--accent)] uppercase transition hover:brightness-110"
            >
              Browse all →
            </Link>
          </div>

          {filtered.length === 0 ? (
            <p className="mt-4 rounded-xl border border-dashed border-[var(--border)] px-4 py-10 text-center text-sm text-[var(--muted)]">
              {isSearching
                ? `No tools match “${query.trim()}”. Try pdf, mp3, json, or mortgage.`
                : "No other tools found in this category yet."}
            </p>
          ) : (
            <div
              className={`mt-4 grid grid-cols-1 gap-4 ${
                isSearching ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-3"
              }`}
            >
              {filtered.map((tool, index) => (
                <Link
                  key={tool.slug}
                  href={getToolHref(tool.slug)}
                  className="result-card group rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 transition duration-200 hover:-translate-y-0.5 hover:border-[var(--accent)] hover:shadow-[0_14px_30px_-20px_rgba(41,121,255,0.55)]"
                  style={{
                    animationDelay: `${Math.min(index, 6) * 35}ms`,
                  }}
                >
                  <div className="mb-3 h-1 w-10 rounded-full bg-gradient-to-r from-[#00E5FF] to-[#2979FF] transition-all group-hover:w-14" />
                  <h3 className="text-sm font-semibold text-[var(--foreground)] group-hover:text-[var(--accent)]">
                    {tool.title}
                  </h3>
                  <p className="mt-1 text-[10px] font-semibold tracking-wide text-[var(--accent)] uppercase">
                    {tool.category}
                  </p>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[color-mix(in_srgb,var(--foreground)_72%,var(--muted))]">
                    {tool.description}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
