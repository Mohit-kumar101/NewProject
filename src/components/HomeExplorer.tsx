"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { Calculator } from "@/lib/types";
import { CATEGORIES } from "@/lib/calculators";
import { Logo } from "@/components/Logo";

const categoryMeta: Record<
  string,
  { icon: string; blurb: string; accent: string }
> = {
  "Loans & Debt Management": {
    icon: "L",
    blurb: "Payoffs, refinancing, and smarter debt strategies.",
    accent: "from-[#00E5FF] to-[#2979FF]",
  },
  "Real Estate & Housing": {
    icon: "R",
    blurb: "Mortgages, rentals, affordability, and ownership costs.",
    accent: "from-[#2979FF] to-[#00B0FF]",
  },
  "Investing & Wealth Building": {
    icon: "I",
    blurb: "Compounding, FIRE, retirement, and fee impact.",
    accent: "from-[#00B8D4] to-[#2979FF]",
  },
  "Freelance & Self-Employment": {
    icon: "F",
    blurb: "Rates, taxes, overtime, and commission math.",
    accent: "from-[#00E5FF] to-[#1565C0]",
  },
  "Everyday Utilities & Savings": {
    icon: "E",
    blurb: "Tips, discounts, fuel, habits, and emergency funds.",
    accent: "from-[#18FFFF] to-[#2979FF]",
  },
  "Education, GPA & Academic": {
    icon: "A",
    blurb: "GPA, exams, tuition planning, and study tools.",
    accent: "from-[#00E5FF] to-[#2979FF]",
  },
  "Statistics, Probability & Advanced Math": {
    icon: "S",
    blurb: "Stats, probability, algebra, and geometry solvers.",
    accent: "from-[#2979FF] to-[#00B8D4]",
  },
  "Legal, HR & Payroll Management": {
    icon: "H",
    blurb: "Payroll, PTO, hiring metrics, and workplace tools.",
    accent: "from-[#00B0FF] to-[#2979FF]",
  },
  "Automotive, Travel & Transit": {
    icon: "T",
    blurb: "Trips, vehicles, tolls, flights, and travel budgets.",
    accent: "from-[#18FFFF] to-[#1565C0]",
  },
  "Media, Photography, Cooking & Lifestyle": {
    icon: "M",
    blurb: "Recipes, camera math, home projects, and lifestyle.",
    accent: "from-[#00E5FF] to-[#2979FF]",
  },
};

function categoryId(category: string) {
  return category.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export function HomeExplorer({ calculators }: { calculators: Calculator[] }) {
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) {
      setQuery(q);
      setSearchOpen(true);
    }
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return calculators.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.slug.includes(q)
    );
  }, [calculators, query]);

  const splitActive = searchOpen || query.trim().length > 0;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setQuery("");
        setSearchOpen(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const closeSearch = () => {
    setQuery("");
    setSearchOpen(false);
    inputRef.current?.blur();
  };

  return (
    <>
      <section
        className={`relative overflow-hidden border-b border-[var(--border)] transition-[min-height] duration-500 ease-out ${
          splitActive ? "min-h-[min(78vh,820px)]" : "min-h-0"
        }`}
      >
        <div className="hero-glow pointer-events-none absolute inset-0" />

        <div
          className={`relative mx-auto max-w-7xl px-4 sm:px-6 ${
            splitActive
              ? "grid gap-8 py-8 lg:grid-cols-[minmax(280px,0.95fr)_1.35fr] lg:gap-10 lg:py-10"
              : "flex flex-col items-center pb-20 pt-6 text-center sm:pt-10"
          }`}
        >
          {/* Left / hero search panel */}
          <div
            className={`search-panel transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              splitActive
                ? "w-full translate-x-0 opacity-100 lg:sticky lg:top-24 lg:self-start"
                : "w-full max-w-3xl"
            }`}
          >
            <div
              className={`mb-6 flex transition-all duration-500 ${
                splitActive ? "justify-start" : "justify-center"
              }`}
            >
              <Logo size={splitActive ? "md" : "lg"} />
            </div>

            <div
              className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                splitActive
                  ? "max-h-40 opacity-100"
                  : "max-h-96 opacity-100"
              }`}
            >
              {!splitActive && (
                <>
                  <p className="mb-5 text-sm font-medium tracking-[0.2em] text-[var(--accent)] uppercase">
                    150 precision calculators
                  </p>
                  <h1 className="font-[family-name:var(--font-display)] max-w-3xl text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-6xl">
                    Money decisions,{" "}
                    <span className="gradient-text">calculated instantly</span>
                  </h1>
                  <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[var(--muted)] sm:text-lg">
                    CalculioHub is your fintech command center for finance,
                    education, math, HR, travel, and lifestyle tools—fast,
                    private, and free.
                  </p>
                </>
              )}

              {splitActive && (
                <div className="mb-5 text-left">
                  <p className="text-xs font-semibold tracking-[0.18em] text-[var(--accent)] uppercase">
                    Search panel
                  </p>
                  <h1 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight sm:text-3xl">
                    Find the right tool
                  </h1>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    Type to filter all {calculators.length} calculators in real
                    time.
                  </p>
                </div>
              )}
            </div>

            <div
              className={`command-bar flex w-full items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-4 shadow-[0_0_0_1px_rgba(0,229,255,0.08)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] focus-within:border-[var(--accent)] focus-within:shadow-[0_0_0_4px_rgba(0,229,255,0.15)] ${
                splitActive ? "max-w-none" : "mx-auto mt-10 max-w-2xl"
              }`}
            >
              <svg
                width="22"
                height="22"
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
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setSearchOpen(true)}
                placeholder={
                  splitActive
                    ? "mortgage, GPA, tip, FIRE…"
                    : "Click to search all 150 calculators…"
                }
                className="w-full bg-transparent text-lg text-[var(--foreground)] outline-none placeholder:text-[var(--muted)]"
                autoComplete="off"
                aria-label="Search all calculators"
              />
              {splitActive && (
                <button
                  type="button"
                  onClick={closeSearch}
                  className="shrink-0 rounded-lg border border-[var(--border)] px-2.5 py-1 text-xs font-medium text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                >
                  Esc
                </button>
              )}
            </div>

            {splitActive && (
              <div className="mt-4 flex flex-wrap gap-2">
                {["mortgage", "GPA", "tip", "salary", "fuel", "paint"].map(
                  (chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => {
                        setQuery(chip);
                        inputRef.current?.focus();
                      }}
                      className="rounded-full border border-[var(--border)] bg-[var(--background)] px-3 py-1 text-xs font-medium text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                    >
                      {chip}
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          {/* Right results panel */}
          <div
            className={`search-results-panel transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              splitActive
                ? "translate-x-0 opacity-100"
                : "pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0 lg:translate-x-8"
            }`}
            aria-live="polite"
          >
            {splitActive && (
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 p-4 backdrop-blur-sm sm:p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="font-[family-name:var(--font-display)] text-lg font-bold tracking-tight">
                      {query.trim()
                        ? "Matching tools"
                        : "Start typing to filter"}
                    </h2>
                    <p className="text-sm text-[var(--muted)]">
                      {query.trim()
                        ? `${filtered.length} result${filtered.length === 1 ? "" : "s"}`
                        : "Results appear here as you type"}
                    </p>
                  </div>
                </div>

                {!query.trim() ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {CATEGORIES.slice(0, 6).map((category) => {
                      const meta = categoryMeta[category];
                      return (
                        <button
                          key={category}
                          type="button"
                          onClick={() => {
                            const hint = category.split(" ")[0];
                            setQuery(hint);
                            inputRef.current?.focus();
                          }}
                          className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 text-left transition hover:border-[var(--accent)]"
                        >
                          <div
                            className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${meta.accent} text-xs font-bold text-white`}
                          >
                            {meta.icon}
                          </div>
                          <div className="text-sm font-semibold">{category}</div>
                          <p className="mt-1 text-xs text-[var(--muted)]">
                            {meta.blurb}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                ) : filtered.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-[var(--border)] px-4 py-12 text-center text-sm text-[var(--muted)]">
                    No tools match “{query.trim()}”. Try another keyword.
                  </p>
                ) : (
                  <div className="grid max-h-[min(58vh,560px)] gap-3 overflow-y-auto pr-1 sm:grid-cols-2">
                    {filtered.map((tool, index) => (
                      <Link
                        key={tool.slug}
                        href={`/tools/${tool.slug}`}
                        className="result-card rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3.5 transition hover:border-[var(--accent)] hover:shadow-[0_12px_28px_-18px_rgba(41,121,255,0.55)]"
                        style={{ animationDelay: `${Math.min(index, 12) * 30}ms` }}
                      >
                        <div className="text-sm font-semibold text-[var(--foreground)]">
                          {tool.title}
                        </div>
                        <div className="mt-1 text-[11px] font-medium tracking-wide text-[var(--accent)] uppercase">
                          {tool.category}
                        </div>
                        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-[var(--muted)]">
                          {tool.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {!splitActive && (
        <>
          <section id="categories" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight sm:text-3xl">
                  Browse by category
                </h2>
                <p className="mt-2 text-[var(--muted)]">
                  Ten focused collections covering every calculation moment.
                </p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {CATEGORIES.map((category) => {
                const meta = categoryMeta[category];
                const count = calculators.filter(
                  (c) => c.category === category
                ).length;
                return (
                  <a
                    key={category}
                    href={`#${categoryId(category)}`}
                    className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:shadow-[0_20px_40px_-24px_rgba(41,121,255,0.45)]"
                  >
                    <div
                      className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${meta.accent} text-sm font-bold text-white`}
                    >
                      {meta.icon}
                    </div>
                    <h3 className="text-base font-semibold text-[var(--foreground)]">
                      {category}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                      {meta.blurb}
                    </p>
                    <p className="mt-4 text-xs font-medium tracking-wide text-[var(--accent)] uppercase">
                      {count} calculators →
                    </p>
                  </a>
                );
              })}
            </div>
          </section>

          <section id="tools" className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
            <div className="space-y-14">
              {CATEGORIES.map((category) => {
                const tools = calculators.filter((c) => c.category === category);
                return (
                  <div key={category} id={categoryId(category)}>
                    <div className="mb-5 flex items-baseline justify-between gap-3">
                      <h2 className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight sm:text-2xl">
                        {category}
                      </h2>
                      <span className="text-sm text-[var(--muted)]">
                        {tools.length} tools
                      </span>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {tools.map((tool) => (
                        <Link
                          key={tool.slug}
                          href={`/tools/${tool.slug}`}
                          className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 py-4 transition hover:border-[var(--accent)] hover:bg-[var(--background)]"
                        >
                          <div className="font-semibold text-[var(--foreground)]">
                            {tool.title}
                          </div>
                          <p className="mt-1 line-clamp-2 text-sm text-[var(--muted)]">
                            {tool.description}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}
    </>
  );
}
