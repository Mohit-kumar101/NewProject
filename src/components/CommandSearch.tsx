"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Calculator } from "@/lib/types";

export function CommandSearch({ calculators }: { calculators: Calculator[] }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return calculators
      .filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          c.slug.includes(q)
      )
      .slice(0, 8);
  }, [calculators, query]);

  return (
    <div className="relative mx-auto w-full max-w-2xl">
      <label htmlFor="command-search" className="sr-only">
        Search calculators
      </label>
      <div className="command-bar group flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 shadow-[0_0_0_1px_rgba(0,229,255,0.08)] transition focus-within:border-[var(--accent)] focus-within:shadow-[0_0_0_4px_rgba(0,229,255,0.15)]">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          className="shrink-0 text-[var(--muted)]"
          aria-hidden
        >
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
          <path
            d="M20 20l-3.5-3.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
        <input
          id="command-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search 50 calculators… try “mortgage”, “FIRE”, “tip”"
          className="w-full bg-transparent text-base text-[var(--foreground)] outline-none placeholder:text-[var(--muted)]"
          autoComplete="off"
        />
        <kbd className="hidden rounded-md border border-[var(--border)] bg-[var(--background)] px-2 py-1 text-[10px] font-medium text-[var(--muted)] sm:inline">
          ⌘K
        </kbd>
      </div>

      {query.trim() && (
        <div className="absolute inset-x-0 top-[calc(100%+8px)] z-40 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl">
          {results.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-[var(--muted)]">
              No calculators match “{query.trim()}”
            </p>
          ) : (
            <ul className="max-h-80 overflow-auto py-2">
              {results.map((calc) => (
                <li key={calc.slug}>
                  <Link
                    href={`/tools/${calc.slug}`}
                    className="block px-4 py-3 transition hover:bg-[var(--background)]"
                    onClick={() => setQuery("")}
                  >
                    <div className="text-sm font-semibold text-[var(--foreground)]">
                      {calc.title}
                    </div>
                    <div className="mt-0.5 text-xs text-[var(--muted)]">
                      {calc.category}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
