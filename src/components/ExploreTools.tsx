"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export type ExploreTool = {
  slug: string;
  title: string;
  description: string;
  category: string;
};

const POPULAR_SLUGS = [
  "scientific-calculator",
  "ai-nutrition-calorie-calculator",
  "compound-interest-calculator",
] as const;

const MAX_RESULTS = 9;

function matchesQuery(tool: ExploreTool, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return false;
  return (
    tool.title.toLowerCase().includes(q) ||
    tool.description.toLowerCase().includes(q) ||
    tool.category.toLowerCase().includes(q) ||
    tool.slug.includes(q)
  );
}

export function ExploreTools({
  tools,
  currentSlug,
}: {
  tools: ExploreTool[];
  currentSlug: string;
}) {
  const [query, setQuery] = useState("");

  const others = useMemo(
    () => tools.filter((tool) => tool.slug !== currentSlug),
    [tools, currentSlug]
  );

  const popularDefaults = useMemo(() => {
    const bySlug = new Map(others.map((tool) => [tool.slug, tool]));
    const curated = POPULAR_SLUGS.map((slug) => bySlug.get(slug)).filter(
      (tool): tool is ExploreTool => Boolean(tool)
    );

    if (curated.length >= 3) return curated.slice(0, 3);

    const fillers = others
      .filter((tool) => !curated.some((c) => c.slug === tool.slug))
      .slice(0, 3 - curated.length);

    return [...curated, ...fillers].slice(0, 3);
  }, [others]);

  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q) return popularDefaults;
    return others.filter((tool) => matchesQuery(tool, q)).slice(0, MAX_RESULTS);
  }, [others, popularDefaults, query]);

  const isSearching = query.trim().length > 0;

  return (
    <section
      className="mt-16 max-w-3xl"
      aria-labelledby="explore-tools-heading"
    >
      <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
        <div className="pointer-events-none absolute -right-16 -top-20 h-44 w-44 rounded-full bg-gradient-to-br from-[#00E5FF33] to-[#2979FF22] blur-2xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-10 h-36 w-36 rounded-full bg-gradient-to-tr from-[#2979FF22] to-transparent blur-2xl" />

        <div className="relative">
          <p className="text-xs font-semibold tracking-[0.16em] text-[var(--accent)] uppercase">
            Discover & search
          </p>
          <h2
            id="explore-tools-heading"
            className="mt-2 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight"
          >
            Explore More Calculators
          </h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Find another tool without leaving this page—every card links to its
            dedicated URL.
          </p>

          <label className="mt-5 block">
            <span className="sr-only">Search other calculators</span>
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
                placeholder="Search other calculators (e.g., scientific, nutrition, interest)..."
                className="w-full bg-transparent text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted)] sm:text-[15px]"
                autoComplete="off"
                spellCheck={false}
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="shrink-0 rounded-md border border-[var(--border)] px-2 py-0.5 text-[11px] font-medium text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                >
                  Clear
                </button>
              )}
            </div>
          </label>

          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="text-xs text-[var(--muted)]" aria-live="polite">
              {isSearching
                ? `${filtered.length} match${filtered.length === 1 ? "" : "es"}`
                : "Popular tools"}
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
              No tools match “{query.trim()}”. Try scientific, nutrition, or
              interest.
            </p>
          ) : (
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {filtered.map((tool, index) => (
                <Link
                  key={tool.slug}
                  href={`/tools/${tool.slug}`}
                  className="result-card group rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 transition hover:border-[var(--accent)] hover:shadow-[0_14px_30px_-20px_rgba(41,121,255,0.55)]"
                  style={{
                    animationDelay: `${Math.min(index, 8) * 35}ms`,
                  }}
                >
                  <div className="mb-3 h-1 w-10 rounded-full bg-gradient-to-r from-[#00E5FF] to-[#2979FF] transition group-hover:w-14" />
                  <h3 className="text-sm font-semibold text-[var(--foreground)] group-hover:text-[var(--accent)]">
                    {tool.title}
                  </h3>
                  <p className="mt-1 text-[10px] font-semibold tracking-wide text-[var(--accent)] uppercase">
                    {tool.category}
                  </p>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[var(--muted)]">
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
