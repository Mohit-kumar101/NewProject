"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { Calculator } from "@/lib/types";
import { CATEGORIES, toolMatchesQuery } from "@/lib/calculators";
import { AFFORDABILITY_DISPLAY_CATEGORY, HEALTH_DISPLAY_CATEGORY } from "@/lib/categoryPaths";
import { getToolHref } from "@/lib/cryptoFormulas";
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
  "Crypto & Digital Assets": {
    icon: "C",
    blurb: "Profit, DCA, market cap, FDV, staking, and tokenomics.",
    accent: "from-[#00E5FF] to-[#00B8D4]",
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
  "Living Expenses": {
    icon: "U",
    blurb: "Electricity, water, solar, data usage, and download time.",
    accent: "from-[#18FFFF] to-[#2979FF]",
  },
  "Shift Work & Payroll": {
    icon: "W",
    blurb: "Warehouse OT, night differentials, split shifts, and dual-job pay.",
    accent: "from-[#00E5FF] to-[#2979FF]",
  },
  "Commute & Vehicle Costs": {
    icon: "G",
    blurb: "Commute fuel, idling, winter EV charging, and road-trip splits.",
    accent: "from-[#18FFFF] to-[#1565C0]",
  },
  "Short-term Rental & Housing": {
    icon: "A",
    blurb: "Airbnb cleaning, occupancy break-even, deposits, and roommate splits.",
    accent: "from-[#2979FF] to-[#00B8D4]",
  },
  "Food & Meal Planning": {
    icon: "N",
    blurb: "Grocery cost per meal, meal prep servings, coffee, and menu pricing.",
    accent: "from-[#00B8D4] to-[#2979FF]",
  },
  "Home & Appliance Utilities": {
    icon: "H",
    blurb: "Laundry, dishwasher, shower, kettle, and seasonal lighting costs.",
    accent: "from-[#00E5FF] to-[#1565C0]",
  },
  "Payroll & Shift Work": {
    icon: "P",
    blurb: "Shift differentials, night OT, dual jobs, and break-pay impacts.",
    accent: "from-[#2979FF] to-[#00E5FF]",
  },
  "Rent & Roommate Splits": {
    icon: "R",
    blurb: "Room-size rent splits, private baths, utilities, and parking shares.",
    accent: "from-[#00B8D4] to-[#2979FF]",
  },
  "Freelance & Micro-Business": {
    icon: "F",
    blurb: "Platform fees, retainers, scope creep, and income targets.",
    accent: "from-[#18FFFF] to-[#1565C0]",
  },
  "Food & Catering Business": {
    icon: "K",
    blurb: "Meal prep pricing, catering per guest, and food-truck break-even.",
    accent: "from-[#00E5FF] to-[#2979FF]",
  },
  "E-Commerce, Logistics & Storage": {
    icon: "X",
    blurb: "FBA storage, DIM weight, pallets, pick-and-pack, and moving boxes.",
    accent: "from-[#2979FF] to-[#00B8D4]",
  },
  "Home Utilities, Appliances & Specialty Amenities": {
    icon: "Z",
    blurb: "Fridge, hot tub, pool pump, aquarium, and gaming-PC power costs.",
    accent: "from-[#00E5FF] to-[#1565C0]",
  },
  "Pet Care & Household Expenses": {
    icon: "Y",
    blurb: "Dog food, litter, treats, meds, and multi-pet monthly budgets.",
    accent: "from-[#18FFFF] to-[#2979FF]",
  },
  "Remote Work & Home Office": {
    icon: "Q",
    blurb: "WFH electricity, internet per day, home-office deduction, cafe costs.",
    accent: "from-[#00B8D4] to-[#1565C0]",
  },
  "Local Services & Trade Pricing": {
    icon: "J",
    blurb: "Cleaning, lawn, snow, pressure wash, detailing, and handyman quotes.",
    accent: "from-[#2979FF] to-[#00E5FF]",
  },
  "Events, Hospitality & Micro-Business": {
    icon: "V",
    blurb: "Coffee cost per cup, bakery, wedding per guest, and Airbnb nights.",
    accent: "from-[#00E5FF] to-[#2979FF]",
  },
  [AFFORDABILITY_DISPLAY_CATEGORY]: {
    icon: "A",
    blurb: "Cars, houses, weddings, gadgets, lifestyle, and debt — one affordability engine.",
    accent: "from-[#00E5FF] to-[#2979FF]",
  },
  [HEALTH_DISPLAY_CATEGORY]: {
    icon: "H",
    blurb: "BMI, calories, pregnancy, training zones, hydration, sleep, and health cost tools.",
    accent: "from-[#00B8D4] to-[#2979FF]",
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
  "HR & Ops": {
    icon: "O",
    blurb: "Runway, hiring cost, meetings, PTO, and overtime math.",
    accent: "from-[#00E5FF] to-[#2979FF]",
  },
  "BC Local Taxes": {
    icon: "B",
    blurb: "British Columbia PST, property transfer tax, and stat pay.",
    accent: "from-[#2979FF] to-[#00B8D4]",
  },
  "Canadian Taxes": {
    icon: "C",
    blurb: "GST, HST, CPP, EI, and Canada-wide tax planning tools.",
    accent: "from-[#2979FF] to-[#00E5FF]",
  },
  "E-commerce Fees": {
    icon: "S",
    blurb: "PayPal, Stripe, marketplace fees, markup, and margins.",
    accent: "from-[#00B8D4] to-[#1565C0]",
  },
  "Specialized Business": {
    icon: "S",
    blurb: "Warehouse, YouTube RPM, dropshipping, FX lots, and PM vs downtime.",
    accent: "from-[#00B8D4] to-[#1565C0]",
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
  "Data & Code Converters": {
    icon: "D",
    blurb: "JSON, CSV, YAML, XML, Markdown, Base64, and more—client-side.",
    accent: "from-[#00E5FF] to-[#2979FF]",
  },
  "Image Converters": {
    icon: "P",
    blurb: "PNG, JPG, WEBP, SVG, ICO, HEIC, TIFF—Canvas previews, no uploads.",
    accent: "from-[#2979FF] to-[#00E5FF]",
  },
  "Document Converters": {
    icon: "F",
    blurb: "PDF text, images, HTML/Markdown, merge & split—with progress bars.",
    accent: "from-[#00E5FF] to-[#1565C0]",
  },
  "Audio & Video Converters": {
    icon: "V",
    blurb: "MP4, MP3, WAV, MOV, WebM, OGG, FLAC—FFmpeg.wasm in your browser.",
    accent: "from-[#2979FF] to-[#00B8D4]",
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
    const q = query.trim();
    if (!q) return [];
    return calculators.filter((c) => toolMatchesQuery(c, q));
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
                    Free alternative · No paywall
                  </p>
                  <h1 className="font-[family-name:var(--font-display)] max-w-3xl text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-6xl">
                    The tools you paid for,{" "}
                    <span className="gradient-text">now free</span>
                  </h1>
                  <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[var(--muted)] sm:text-lg">
                    Skip the subscription. Convert PDFs, video, and photos — plus
                    finance and crypto calculators — with no watermark, no daily
                    cap, and nothing uploaded.
                  </p>
                  <ul className="mx-auto mt-7 flex flex-wrap justify-center gap-2">
                    {["No subscription", "No watermark", "Files stay on-device"].map(
                      (item) => (
                        <li
                          key={item}
                          className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-medium text-[var(--muted)]"
                        >
                          {item}
                        </li>
                      )
                    )}
                  </ul>
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
                    Type to filter all {calculators.length} tools in real
                    time—calculators and file converters.
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
                    ? "mortgage, pdf, mp3, json, png…"
                    : "Click to search calculators & converters…"
                }
                className="w-full bg-transparent text-lg text-[var(--foreground)] outline-none placeholder:text-[var(--muted)]"
                autoComplete="off"
                aria-label="Search all calculators and converters"
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
                {["pdf", "heic", "mp3", "json", "mortgage", "GPA"].map(
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
                        href={getToolHref(tool.slug)}
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
          <section className="mx-auto max-w-6xl px-4 pt-14 sm:px-6">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-[0.18em] text-[var(--accent)] uppercase">
                  Start here
                </p>
                <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight sm:text-3xl">
                  What people usually pay for
                </h2>
                <p className="mt-2 max-w-2xl text-[var(--muted)]">
                  PDF, photo, and video jobs that paid converters charge for —
                  free here, then keep going with calculators.
                </p>
              </div>
              <Link
                href="/tools"
                className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                Browse all tools →
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                {
                  slug: "pdf-merge-split",
                  blurb: "Merge or split PDFs in the browser — no Smallpdf fee.",
                },
                {
                  slug: "heic-jpg-converter",
                  blurb: "iPhone HEIC photos to JPG, privately on-device.",
                },
                {
                  slug: "mp4-mp3-converter",
                  blurb: "Extract audio from video without a CloudConvert cap.",
                },
              ].map((item) => {
                const tool = calculators.find((c) => c.slug === item.slug);
                if (!tool) return null;
                return (
                  <Link
                    key={tool.slug}
                    href={getToolHref(tool.slug)}
                    className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:shadow-[0_20px_40px_-24px_rgba(41,121,255,0.45)]"
                  >
                    <div className="mb-3 h-1.5 w-14 rounded-full bg-gradient-to-r from-[#00E5FF] to-[#2979FF]" />
                    <h3 className="font-semibold text-[var(--foreground)] group-hover:text-[var(--accent)]">
                      {tool.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                      {item.blurb}
                    </p>
                    <p className="mt-4 text-xs font-semibold tracking-wide text-[var(--accent)] uppercase">
                      /tools/{tool.slug}
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>

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
                          href={getToolHref(tool.slug)}
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
