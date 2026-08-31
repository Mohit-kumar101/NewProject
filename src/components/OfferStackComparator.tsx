"use client";

import { useMemo, useState } from "react";

type OfferKey = "A" | "B" | "C";

type OfferInputs = {
  label: string;
  base: number;
  bonus: number;
  signing: number;
  rsu1: number;
  rsu2: number;
  rsu3: number;
  matchPct: number;
  commute: number;
};

type OfferScore = OfferInputs & {
  key: OfferKey;
  matchYear: number;
  rsuTotal: number;
  commute3: number;
  threeYear: number;
  annualized: number;
};

const DEFAULTS: Record<OfferKey, OfferInputs> = {
  A: {
    label: "Offer A",
    base: 120000,
    bonus: 15000,
    signing: 10000,
    rsu1: 25000,
    rsu2: 25000,
    rsu3: 25000,
    matchPct: 4,
    commute: 4800,
  },
  B: {
    label: "Offer B",
    base: 135000,
    bonus: 10000,
    signing: 0,
    rsu1: 15000,
    rsu2: 15000,
    rsu3: 15000,
    matchPct: 5,
    commute: 1200,
  },
  C: {
    label: "Offer C",
    base: 110000,
    bonus: 20000,
    signing: 20000,
    rsu1: 30000,
    rsu2: 30000,
    rsu3: 30000,
    matchPct: 3,
    commute: 0,
  },
};

function money(n: number, digits = 0): string {
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(n);
}

function scoreOffer(key: OfferKey, o: OfferInputs): OfferScore {
  const matchYear = (o.matchPct / 100) * o.base;
  const rsuTotal = o.rsu1 + o.rsu2 + o.rsu3;
  const commute3 = 3 * o.commute;
  const threeYear =
    3 * (o.base + o.bonus + matchYear - o.commute) + rsuTotal + o.signing;
  return {
    ...o,
    key,
    matchYear,
    rsuTotal,
    commute3,
    threeYear,
    annualized: threeYear / 3,
  };
}

const FIELD_META: {
  id: keyof Omit<OfferInputs, "label">;
  label: string;
  min: number;
  max: number;
  step: number;
}[] = [
  { id: "base", label: "Base ($/yr)", min: 30000, max: 500000, step: 1000 },
  { id: "bonus", label: "Bonus ($/yr)", min: 0, max: 200000, step: 500 },
  { id: "signing", label: "Signing bonus ($)", min: 0, max: 150000, step: 500 },
  { id: "rsu1", label: "RSU year 1 ($)", min: 0, max: 300000, step: 1000 },
  { id: "rsu2", label: "RSU year 2 ($)", min: 0, max: 300000, step: 1000 },
  { id: "rsu3", label: "RSU year 3 ($)", min: 0, max: 300000, step: 1000 },
  { id: "matchPct", label: "401k match (%)", min: 0, max: 15, step: 0.5 },
  { id: "commute", label: "Commute/WFH ($/yr)", min: 0, max: 30000, step: 100 },
];

type OfferStackComparatorProps = {
  formulaSummary: string;
};

/**
 * Unique feature: side-by-side Offer A / B / optional C total-comp compare
 * with winner banner, gap-to-leader, and per-offer stack breakdown.
 */
export function OfferStackComparator({
  formulaSummary,
}: OfferStackComparatorProps) {
  const [includeC, setIncludeC] = useState(false);
  const [offers, setOffers] = useState(DEFAULTS);
  const [mobileTab, setMobileTab] = useState<OfferKey>("A");

  const activeKeys: OfferKey[] = includeC ? ["A", "B", "C"] : ["A", "B"];

  const scored = useMemo(() => {
    const keys: OfferKey[] = includeC ? ["A", "B", "C"] : ["A", "B"];
    return keys.map((k) => scoreOffer(k, offers[k]));
  }, [includeC, offers]);

  const winner = useMemo(() => {
    return scored.reduce((best, cur) =>
      cur.threeYear > best.threeYear ? cur : best
    );
  }, [scored]);

  const howCalculated = useMemo(() => {
    const lines = scored
      .map(
        (o) =>
          `${o.label}: 3 × (${money(o.base)} + ${money(o.bonus)} + match ${money(o.matchYear)} − commute ${money(o.commute)}) + RSU ${money(o.rsuTotal)} + signing ${money(o.signing)} = ${money(o.threeYear)}`
      )
      .join(" ");
    const gaps = scored
      .filter((o) => o.key !== winner.key)
      .map(
        (o) =>
          `${winner.label} leads ${o.label} by ${money(winner.threeYear - o.threeYear)}`
      )
      .join("; ");
    return `How it's calculated: For each offer, 3-year total = 3 × (base + bonus + retirement match − commute) + 3-year RSU vesting + signing bonus. ${lines} Winner: ${winner.label} at ${money(winner.threeYear)} (${money(winner.annualized)}/yr average). ${gaps}. Free online offer stack comparator · estimator tool · Excel template alternative · 2026 update—not tax advice.`;
  }, [scored, winner]);

  function patch(key: OfferKey, id: keyof OfferInputs, value: number | string) {
    setOffers((prev) => ({
      ...prev,
      [key]: { ...prev[key], [id]: value },
    }));
  }

  const columns = includeC ? "lg:grid-cols-3" : "lg:grid-cols-2";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[var(--muted)]">
          Compare competing offers on the same 3-year stack formula.
        </p>
        <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={includeC}
            onChange={(e) => {
              setIncludeC(e.target.checked);
              if (e.target.checked) setMobileTab("C");
              else if (mobileTab === "C") setMobileTab("A");
            }}
            className="h-4 w-4 accent-[var(--accent)]"
          />
          Include Offer C
        </label>
      </div>

      {/* Mobile offer tabs */}
      <div className="flex gap-2 lg:hidden">
        {activeKeys.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setMobileTab(k)}
            className={`flex-1 rounded-xl border px-3 py-2 text-sm font-semibold transition ${
              mobileTab === k
                ? "border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_12%,var(--surface))] text-[var(--foreground)]"
                : "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)]"
            }`}
          >
            Offer {k}
          </button>
        ))}
      </div>

      <div className={`grid gap-4 ${columns}`}>
        {activeKeys.map((key) => {
          const o = offers[key];
          const hideOnMobile = mobileTab !== key;
          return (
            <div
              key={key}
              className={`rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5 ${
                hideOnMobile ? "hidden lg:block" : ""
              }`}
            >
              <div className="mb-4 flex items-center justify-between gap-2">
                <input
                  type="text"
                  value={o.label}
                  onChange={(e) => patch(key, "label", e.target.value)}
                  aria-label={`Offer ${key} name`}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-sm font-semibold outline-none focus:border-[var(--accent)]"
                />
                <span className="shrink-0 rounded-full border border-[var(--border)] px-2 py-0.5 text-[11px] font-semibold tracking-wide text-[var(--muted)] uppercase">
                  {key}
                </span>
              </div>
              <div className="space-y-4">
                {FIELD_META.map((field) => (
                  <div key={field.id}>
                    <div className="mb-1.5 flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
                      <label
                        htmlFor={`${key}-${field.id}`}
                        className="min-w-0 text-xs font-medium text-[var(--foreground)] break-words-safe sm:text-sm"
                      >
                        {field.label}
                      </label>
                      <input
                        id={`${key}-${field.id}-number`}
                        type="number"
                        inputMode="decimal"
                        min={field.min}
                        max={field.max}
                        step={field.step}
                        value={o[field.id]}
                        onChange={(e) => {
                          const n = Number(e.target.value);
                          if (Number.isFinite(n)) patch(key, field.id, n);
                        }}
                        className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-right text-sm outline-none focus:border-[var(--accent)] sm:w-24 sm:px-2 sm:py-1"
                      />
                    </div>
                    <input
                      id={`${key}-${field.id}`}
                      type="range"
                      min={field.min}
                      max={field.max}
                      step={field.step}
                      value={o[field.id]}
                      onChange={(e) =>
                        patch(key, field.id, Number(e.target.value))
                      }
                      className="range-input w-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Winner + comparison table */}
      <aside className="results-card rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5 md:p-6">
        <p className="text-[10px] font-semibold tracking-[0.14em] text-[var(--accent)] uppercase sm:text-xs sm:tracking-[0.16em]">
          Side-by-side results
        </p>
        <p className="mt-2 text-sm text-[var(--muted)] sm:mt-3">Highest 3-year stack</p>
        <p className="result-glow mt-1 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight break-words-safe sm:text-3xl md:text-4xl">
          {winner.label}
        </p>
        <p className="mt-1 text-base font-semibold text-[var(--foreground)] break-words-safe sm:text-lg">
          {money(winner.threeYear)}
          <span className="ml-2 text-sm font-normal text-[var(--muted)]">
            (~{money(winner.annualized)}/yr avg)
          </span>
        </p>

        <div className="mt-5 -mx-1 overflow-x-auto border-t border-[var(--border)] pt-4 sm:mt-6 sm:mx-0 sm:pt-5">
          <table className="w-full min-w-[20rem] text-left text-xs sm:min-w-[28rem] sm:text-sm">
            <thead>
              <tr className="text-[var(--muted)]">
                <th className="pb-3 pr-3 font-medium">Metric</th>
                {scored.map((o) => (
                  <th
                    key={o.key}
                    className={`pb-3 pr-3 font-semibold ${
                      o.key === winner.key ? "text-[var(--accent)]" : "text-[var(--foreground)]"
                    }`}
                  >
                    {o.label}
                    {o.key === winner.key ? " ★" : ""}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="align-top">
              {(
                [
                  ["3-year total", (o: OfferScore) => money(o.threeYear)],
                  ["Annualized", (o: OfferScore) => money(o.annualized)],
                  ["Cash + match (3yr)", (o: OfferScore) => money(3 * (o.base + o.bonus + o.matchYear))],
                  ["Equity (3yr)", (o: OfferScore) => money(o.rsuTotal)],
                  ["Signing bonus", (o: OfferScore) => money(o.signing)],
                  ["Commute drag (3yr)", (o: OfferScore) => money(o.commute3)],
                  [
                    "Gap vs leader",
                    (o: OfferScore) =>
                      o.key === winner.key
                        ? "—"
                        : `−${money(winner.threeYear - o.threeYear)}`,
                  ],
                ] as const
              ).map(([label, fmt]) => (
                <tr key={label} className="border-t border-[var(--border)]">
                  <td className="py-2.5 pr-3 text-[var(--muted)]">{label}</td>
                  {scored.map((o) => (
                    <td
                      key={o.key}
                      className={`py-2.5 pr-3 font-semibold ${
                        o.key === winner.key ? "text-[var(--accent)]" : ""
                      }`}
                    >
                      {fmt(o)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-5 text-xs leading-relaxed text-[var(--muted)]">
          Planning estimate. Equity values can change; verify vesting on each
          offer letter. Not tax or legal advice.
        </p>
      </aside>

      <section
        className="max-w-3xl rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6"
        aria-labelledby="how-calculated-heading"
      >
        <h2
          id="how-calculated-heading"
          className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight sm:text-2xl"
        >
          How it&apos;s calculated
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[color-mix(in_srgb,var(--foreground)_78%,var(--muted))] sm:text-base">
          {howCalculated}
        </p>
        <p className="mt-4 text-xs leading-relaxed text-[var(--muted)]">
          Formula summary: {formulaSummary}
        </p>
      </section>
    </div>
  );
}
