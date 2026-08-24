"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { SmartAdviceBox } from "@/components/SmartAdviceBox";
import { StrategicInsightsPanel } from "@/components/strategic/StrategicInsightsPanel";
import type { AdviceItem } from "@/lib/types";
import type { Calculator } from "@/lib/types";
import { getToolHref } from "@/lib/cryptoFormulas";
import {
  LoanMetricCards,
  LoanNumberField,
  LoanRelatedTools,
  LoanSparkline,
  LoanWhatIfBanner,
  LoanWorkspaceFrame,
} from "@/components/loans/LoanUi";
import {
  MAX_LOAN_MONTHS,
  amortizeLoan,
  formatLoanMoney,
  formatLoanMonths,
  loadLoanToolState,
  saveLoanToolState,
  simulateBiWeekly,
  type AmortRow,
} from "@/lib/loanTools";

const FORMULA_TYPE = "monthlyMortgage";

function defaultsFromCalculator(calculator: Calculator): Record<string, number> {
  const base = Object.fromEntries(
    calculator.inputs.map((input) => [input.id, input.defaultValue])
  );
  return {
    ...base,
    pitiEnabled: 0,
    annualPropertyTax: Math.round((base.homePrice ?? 425000) * 0.012),
    homeownersInsurance: 1400,
    extraPayment: 0,
  };
}

function fieldMeta(calculator: Calculator, id: string) {
  return calculator.inputs.find((i) => i.id === id);
}

function sumPeriod(rows: AmortRow[]) {
  let interest = 0;
  let principal = 0;
  for (const row of rows) {
    interest += row.interest;
    principal += row.principal;
  }
  return { interest, principal, total: interest + principal };
}

function AmortRatioViz({
  rows,
  label,
}: {
  rows: AmortRow[];
  label: string;
}) {
  const { interest, principal, total } = sumPeriod(rows);
  if (total <= 0) return null;
  const interestPct = (interest / total) * 100;
  const principalPct = (principal / total) * 100;

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
      <p className="text-[11px] font-semibold tracking-[0.14em] text-[var(--accent)] uppercase">
        {label} — interest vs principal
      </p>
      <div className="mt-3 flex h-3 overflow-hidden rounded-full">
        <div
          className="bg-[#f59e0b]"
          style={{ width: `${interestPct}%` }}
          title={`Interest ${interestPct.toFixed(0)}%`}
        />
        <div
          className="bg-[var(--accent)]"
          style={{ width: `${principalPct}%` }}
          title={`Principal ${principalPct.toFixed(0)}%`}
        />
      </div>
      <div className="mt-3 flex flex-wrap gap-4 text-xs">
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#f59e0b]" />
          Interest {formatLoanMoney(interest)} ({interestPct.toFixed(0)}%)
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
          Principal {formatLoanMoney(principal)} ({principalPct.toFixed(0)}%)
        </span>
      </div>
    </div>
  );
}

function AmortPeriodTable({ rows }: { rows: AmortRow[] }) {
  if (rows.length === 0) return null;
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full min-w-[480px] text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--border)] text-[11px] tracking-wide text-[var(--muted)] uppercase">
            <th className="py-2 pr-3 font-semibold">Mo</th>
            <th className="py-2 pr-3 font-semibold">Payment</th>
            <th className="py-2 pr-3 font-semibold">Interest</th>
            <th className="py-2 pr-3 font-semibold">Principal</th>
            <th className="py-2 font-semibold">Balance</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.month} className="border-b border-[var(--border)]">
              <td className="py-2 pr-3 font-medium">{row.month}</td>
              <td className="py-2 pr-3">{formatLoanMoney(row.payment)}</td>
              <td className="py-2 pr-3">{formatLoanMoney(row.interest)}</td>
              <td className="py-2 pr-3">{formatLoanMoney(row.principal)}</td>
              <td className="py-2">{formatLoanMoney(row.balance)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function MonthlyMortgageWorkspace({
  calculator,
  related,
}: {
  calculator: Calculator;
  related: Calculator[];
}) {
  const [hydrated, setHydrated] = useState(false);
  const [values, setValues] = useState<Record<string, number>>(() =>
    defaultsFromCalculator(calculator)
  );
  const [accelerateOpen, setAccelerateOpen] = useState(false);
  const [amortView, setAmortView] = useState<"first" | "last">("first");

  useEffect(() => {
    const saved = loadLoanToolState(FORMULA_TYPE);
    if (saved) {
      setValues((prev) => ({ ...prev, ...saved }));
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveLoanToolState(FORMULA_TYPE, values);
  }, [values, hydrated]);

  const set = (id: string, raw: number) => {
    setValues((prev) => ({
      ...prev,
      [id]: Number.isFinite(raw) ? raw : prev[id],
    }));
  };

  const reset = () => setValues(defaultsFromCalculator(calculator));

  const homePrice = Math.max(0, values.homePrice ?? 0);
  const downPayment = Math.max(0, Math.min(homePrice, values.downPayment ?? 0));
  const annualRate = Math.max(0, values.annualRate ?? 0);
  const termYears = Math.max(1, values.termYears ?? 30);
  const termMonths = Math.round(termYears * 12);
  const principal = Math.max(0, homePrice - downPayment);
  const pitiEnabled = (values.pitiEnabled ?? 0) >= 0.5;
  const annualPropertyTax = Math.max(0, values.annualPropertyTax ?? 0);
  const homeownersInsurance = Math.max(0, values.homeownersInsurance ?? 0);
  const extraPayment = Math.max(0, values.extraPayment ?? 0);

  const monthlyTax = pitiEnabled ? annualPropertyTax / 12 : 0;
  const monthlyInsurance = pitiEnabled ? homeownersInsurance / 12 : 0;

  const baseline = useMemo(
    () =>
      amortizeLoan({
        principal,
        annualRate,
        termMonths,
        maxScheduleRows: MAX_LOAN_MONTHS,
      }),
    [principal, annualRate, termMonths]
  );

  const withExtra = useMemo(
    () =>
      amortizeLoan({
        principal,
        annualRate,
        termMonths,
        extraPayment,
        maxScheduleRows: MAX_LOAN_MONTHS,
      }),
    [principal, annualRate, termMonths, extraPayment]
  );

  const biWeekly = useMemo(
    () =>
      simulateBiWeekly({
        principal,
        annualRate,
        termYears,
      }),
    [principal, annualRate, termYears]
  );

  const monthlyPI = baseline.basePayment;
  const monthlyPITI = monthlyPI + monthlyTax + monthlyInsurance;

  const first12 = baseline.schedule.slice(0, 12);
  const last12 =
    baseline.schedule.length >= 12
      ? baseline.schedule.slice(-12)
      : baseline.schedule;

  const accelerateLine = useMemo(() => {
    if (extraPayment <= 0) return null;
    const monthsSaved = Math.max(0, baseline.months - withExtra.months);
    const interestSaved = Math.max(0, baseline.interest - withExtra.interest);
    if (monthsSaved <= 0 && interestSaved <= 0) return null;
    return `Adding ${formatLoanMoney(extraPayment)}/mo to principal shaves ${monthsSaved} month${monthsSaved === 1 ? "" : "s"} off your loan and saves ${formatLoanMoney(interestSaved)} in interest.`;
  }, [extraPayment, baseline, withExtra]);

  const biWeeklyLine = useMemo(() => {
    if (biWeekly.monthsSavedVsMonthly <= 0) return null;
    return `Bi-weekly payments (26 half-payments per year) can finish about ${biWeekly.monthsSavedVsMonthly} months sooner and save ${formatLoanMoney(biWeekly.interestSavedVsMonthly)} vs standard monthly — similar to one extra payment per year.`;
  }, [biWeekly]);

  const advice: AdviceItem[] = [];
  if (pitiEnabled) {
    advice.push({
      tone: "info",
      badge: "PITI",
      title: "Budget for the full payment",
      message: `Your all-in estimate is ${formatLoanMoney(monthlyPITI)}/mo — that includes ${formatLoanMoney(monthlyPI)} P&I plus ${formatLoanMoney(monthlyTax + monthlyInsurance)} for tax and insurance escrow.`,
    });
  }
  if (extraPayment > 0) {
    advice.push({
      tone: "positive",
      badge: "Accelerating",
      title: "Extra principal is working",
      message: accelerateLine ?? "Your extra payment reduces total interest over the life of the loan.",
    });
  } else {
    advice.push({
      tone: "info",
      badge: "Tip",
      title: "Try an extra $100/mo",
      message: "Open “Pay off faster” below to see how small extra payments shorten a 30-year mortgage.",
    });
  }

  const amortRows = amortView === "first" ? first12 : last12;
  const amortLabel =
    amortView === "first"
      ? "First 12 months"
      : `Last 12 months (mo ${last12[0]?.month ?? "—"}–${last12[last12.length - 1]?.month ?? "—"})`;

  return (
    <LoanWorkspaceFrame
      title="Monthly mortgage payment studio"
      blurb="Core inputs unchanged — add optional PITI, explore extra or bi-weekly payoffs, and compare how interest vs principal shifts over time."
    >
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
        <p className="text-[11px] font-semibold tracking-[0.14em] text-[var(--accent)] uppercase">
          {pitiEnabled ? "Estimated monthly PITI" : "Principal & interest"}
        </p>
        <p className="result-glow mt-2 font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight sm:text-5xl">
          {hydrated ? formatLoanMoney(pitiEnabled ? monthlyPITI : monthlyPI) : "—"}
        </p>
        <p className="mt-1 text-sm text-[var(--muted)]">
          {pitiEnabled ? "PITI (tax & insurance included)" : "P&I only — toggle PITI below for taxes & insurance"}
        </p>

        {pitiEnabled && (
          <dl className="mt-5 grid gap-2 border-t border-[var(--border)] pt-4 text-sm sm:grid-cols-2">
            <div className="flex justify-between gap-3 rounded-lg bg-[var(--background)] px-3 py-2">
              <dt className="text-[var(--muted)]">Principal & interest</dt>
              <dd className="font-semibold">{formatLoanMoney(monthlyPI)}</dd>
            </div>
            <div className="flex justify-between gap-3 rounded-lg bg-[var(--background)] px-3 py-2">
              <dt className="text-[var(--muted)]">Property tax</dt>
              <dd className="font-semibold">{formatLoanMoney(monthlyTax)}</dd>
            </div>
            <div className="flex justify-between gap-3 rounded-lg bg-[var(--background)] px-3 py-2">
              <dt className="text-[var(--muted)]">Insurance</dt>
              <dd className="font-semibold">{formatLoanMoney(monthlyInsurance)}</dd>
            </div>
            <div className="flex justify-between gap-3 rounded-lg border border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_8%,var(--background))] px-3 py-2">
              <dt className="font-medium">Total PITI</dt>
              <dd className="font-bold text-[var(--accent)]">
                {formatLoanMoney(monthlyPITI)}
              </dd>
            </div>
          </dl>
        )}
      </div>

      <LoanMetricCards
        items={[
          {
            label: "Loan amount",
            value: hydrated ? formatLoanMoney(principal) : "—",
            accent: true,
          },
          {
            label: "P&I payment",
            value: hydrated ? formatLoanMoney(monthlyPI) : "—",
          },
          {
            label: "Total interest",
            value: hydrated ? formatLoanMoney(baseline.interest) : "—",
          },
          {
            label: "Payoff",
            value: hydrated ? formatLoanMonths(baseline.months) : "—",
          },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold">Mortgage inputs</h3>
            <button
              type="button"
              onClick={reset}
              className="text-xs font-semibold text-[var(--muted)] hover:text-[var(--accent)]"
            >
              Reset
            </button>
          </div>

          <div className="space-y-6">
            {(["homePrice", "downPayment", "annualRate", "termYears"] as const).map(
              (id) => {
                const meta = fieldMeta(calculator, id);
                if (!meta) return null;
                return (
                  <LoanNumberField
                    key={id}
                    id={id}
                    label={meta.label}
                    value={values[id] ?? meta.defaultValue}
                    min={meta.min}
                    max={meta.max}
                    step={meta.step}
                    onChange={(n) => set(id, n)}
                  />
                );
              }
            )}
          </div>

          <div className="mt-8 border-t border-[var(--border)] pt-6">
            <label
              htmlFor="piti-toggle"
              className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3"
            >
              <span>
                <span className="block text-sm font-medium">
                  Include taxes & insurance (PITI)
                </span>
                <span className="mt-0.5 block text-xs text-[var(--muted)]">
                  Add estimated annual property tax and homeowners insurance to
                  your monthly total.
                </span>
              </span>
              <input
                id="piti-toggle"
                type="checkbox"
                checked={pitiEnabled}
                onChange={(e) => set("pitiEnabled", e.target.checked ? 1 : 0)}
                className="h-5 w-5 shrink-0 accent-[var(--accent)]"
              />
            </label>

            {pitiEnabled && (
              <div className="mt-4 space-y-6">
                <LoanNumberField
                  id="annualPropertyTax"
                  label="Estimated annual property tax ($)"
                  value={annualPropertyTax}
                  min={0}
                  max={100000}
                  step={100}
                  onChange={(n) => set("annualPropertyTax", n)}
                />
                <LoanNumberField
                  id="homeownersInsurance"
                  label="Annual homeowners insurance ($)"
                  value={homeownersInsurance}
                  min={0}
                  max={20000}
                  step={50}
                  onChange={(n) => set("homeownersInsurance", n)}
                />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
            <button
              type="button"
              onClick={() => setAccelerateOpen((o) => !o)}
              className="flex w-full items-start justify-between gap-3 text-left"
              aria-expanded={accelerateOpen}
            >
              <div>
                <p className="text-[11px] font-semibold tracking-[0.14em] text-[var(--accent)] uppercase">
                  Pay off faster
                </p>
                <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">
                  Extra monthly or bi-weekly — how much time do you save?
                </p>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  Want to see how an extra $100/mo or bi-weekly payments change
                  things? Open this section.
                </p>
              </div>
              <span
                className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--border)] text-[var(--muted)] transition ${
                  accelerateOpen ? "rotate-180" : ""
                }`}
                aria-hidden
              >
                ▾
              </span>
            </button>

            {accelerateOpen && (
              <div className="mt-5 space-y-4 border-t border-[var(--border)] pt-5">
                <LoanNumberField
                  id="extraPayment"
                  label="Extra monthly payment ($)"
                  value={extraPayment}
                  min={0}
                  max={5000}
                  step={25}
                  onChange={(n) => set("extraPayment", n)}
                />
                <LoanWhatIfBanner text={accelerateLine} />
                <p className="text-sm leading-relaxed text-[var(--muted)]">
                  {biWeeklyLine}
                </p>
                <Link
                  href={getToolHref("bi-weekly-mortgage-payment-calculator")}
                  className="inline-block text-xs font-semibold text-[var(--accent)] hover:underline"
                >
                  Open full bi-weekly mortgage calculator →
                </Link>
              </div>
            )}
          </div>

          <LoanSparkline
            values={withExtra.balanceSeries}
            label="Remaining loan balance"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold">Amortization snapshot</h3>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Compare how much of each payment goes to interest vs principal at
              the start vs near payoff.
            </p>
          </div>
          <div className="flex rounded-xl border border-[var(--border)] p-1">
            <button
              type="button"
              onClick={() => setAmortView("first")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                amortView === "first"
                  ? "bg-[var(--accent)] text-[#041018]"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              First 12 mo
            </button>
            <button
              type="button"
              onClick={() => setAmortView("last")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                amortView === "last"
                  ? "bg-[var(--accent)] text-[#041018]"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              Last 12 mo
            </button>
          </div>
        </div>

        <div className="mt-5">
          <AmortRatioViz rows={amortRows} label={amortLabel} />
        </div>
        <AmortPeriodTable rows={amortRows} />
      </div>

      <StrategicInsightsPanel
        config={{
          monthlyPayment: pitiEnabled ? monthlyPITI : monthlyPI,
          comparePayment: pitiEnabled ? monthlyPI : undefined,
          principal,
          annualRate,
          termMonths,
          inflationNominal: principal,
          inflationYears: termYears,
          inflationLabel: "Equity built (principal repaid)",
          defaultLiquidReserve: monthlyPITI * 3,
          showPartner: true,
        }}
      />

      <SmartAdviceBox items={advice} />
      <LoanRelatedTools calculator={calculator} related={related} />
    </LoanWorkspaceFrame>
  );
}
