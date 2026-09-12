"use client";

import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import Link from "next/link";
import type { Calculator, CalcResult } from "@/lib/types";
import { runCalculation } from "@/lib/formulas";
import { getToolHref } from "@/lib/cryptoFormulas";
import { getSmartAdvice } from "@/lib/smartAdvice";
import { ScientificCalculator } from "@/components/ScientificCalculator";
import { ExpenseTracker } from "@/components/ExpenseTracker";
import { DebtPayoffWorkspace } from "@/components/DebtPayoffWorkspace";
import {
  LoansCategoryWorkspace,
  isLoansDebtCategoryFormula,
} from "@/components/LoansCategoryWorkspace";
import { MonthlyMortgageWorkspace } from "@/components/realEstate/MonthlyMortgageWorkspace";
import { BulkCutMacroPlanner } from "@/components/health/BulkCutMacroPlanner";
import { FinancialFreedomPlanner } from "@/components/investing/FinancialFreedomPlanner";
import { CtcSalaryCalculator } from "@/components/payroll/CtcSalaryCalculator";
import { ReverseDietPlanner } from "@/components/global/ReverseDietPlanner";
import { EmergencyFundPlanner } from "@/components/global/EmergencyFundPlanner";
import { SavingsGoalPlanner } from "@/components/global/SavingsGoalPlanner";
import { RecompPlanner } from "@/components/global/RecompPlanner";
import { FreelanceTrueRatePlanner } from "@/components/global/FreelanceTrueRatePlanner";
import { WeddingBudgetPlanner } from "@/components/global/WeddingBudgetPlanner";
import { BabyCostPlanner } from "@/components/global/BabyCostPlanner";
import { SubscriptionAuditPlanner } from "@/components/global/SubscriptionAuditPlanner";
import { CarTcoPlanner } from "@/components/global/CarTcoPlanner";
import { SmartAdviceBox } from "@/components/SmartAdviceBox";
import { CryptoProWorkspace } from "@/components/crypto/CryptoProWorkspace";
import { CRYPTO_CATEGORY } from "@/lib/cryptoFormulas";
import { InvestingEnhancements } from "@/components/investing/InvestingEnhancements";
import { isInvestingCalculator } from "@/lib/investingEnhancements";
import { ToolMemoryBar } from "@/components/shared/ToolMemoryBar";
import { ScenarioComparePanel } from "@/components/shared/ScenarioComparePanel";
import { HandoffCards } from "@/components/shared/HandoffCards";
import { HandoffArrivalBanner } from "@/components/shared/HandoffArrivalBanner";
import { takeScenarioBag } from "@/components/shared/useHandoffHydration";
import { parseMoneyText } from "@/lib/handoffs";
import { FreelanceEnhancements } from "@/components/freelance/FreelanceEnhancements";
import { UtilitiesEnhancements } from "@/components/utilities/UtilitiesEnhancements";
import { RealEstateEnhancements } from "@/components/realEstate/RealEstateEnhancements";
import { TaxEnhancements } from "@/components/tax/TaxEnhancements";
import {
  AFFORDABILITY_DISPLAY_CATEGORY,
  HEALTH_DISPLAY_CATEGORY,
} from "@/lib/categoryPaths";
import {
  HealthEnhancements,
  ProgressSnapshotsPanel,
} from "@/components/health/HealthEnhancements";
import { LifeCuriosityWorkspace } from "@/components/lifeCuriosity/LifeCuriosityWorkspace";
import { isLifeCuriosityFormula } from "@/lib/hubs/lifeCuriosityPack";

function usesStickyMemory(calculator: Calculator): boolean {
  return (
    isInvestingCalculator(calculator) ||
    calculator.category === "Freelance & Self-Employment" ||
    calculator.category === "Everyday Utilities & Savings" ||
    calculator.category === "Real Estate & Housing" ||
    calculator.category === "Canadian Taxes" ||
    calculator.category === "BC Local Taxes" ||
    calculator.category === HEALTH_DISPLAY_CATEGORY ||
    calculator.category === AFFORDABILITY_DISPLAY_CATEGORY
  );
}

export function CalculatorWorkspace({
  calculator,
  related,
}: {
  calculator: Calculator;
  related: Calculator[];
}) {
  const isScientific = calculator.formulaType === "scientificCalculator";
  const isExpenseTracker = calculator.formulaType === "expenseTracker";
  const isDebtPayoff =
    calculator.formulaType === "debtSnowball" ||
    calculator.formulaType === "debtAvalanche";
  const isLoansCategory = isLoansDebtCategoryFormula(calculator.formulaType);

  const [values, setValues] = useState<Record<string, number>>(() =>
    Object.fromEntries(
      calculator.inputs.map((input) => [input.id, input.defaultValue])
    )
  );

  if (isScientific) {
    return (
      <div className="space-y-5">
        <ScientificCalculator />
        <aside className="calc-panel rounded-2xl p-4 sm:p-5">
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <h2 className="text-xs font-semibold tracking-[0.14em] text-[var(--accent)] uppercase sm:text-sm">
              Related tools
            </h2>
            <p className="text-[11px] text-[var(--muted)]">{calculator.category}</p>
          </div>
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((tool) => (
              <li key={tool.slug}>
                <Link
                  href={getToolHref(tool.slug)}
                  className="block rounded-xl border border-transparent px-3 py-2 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--border)] hover:bg-[var(--background)] hover:text-[var(--accent)]"
                >
                  {tool.title}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    );
  }

  if (isExpenseTracker) {
    return <ExpenseTracker />;
  }

  if (isDebtPayoff) {
    return (
      <DebtPayoffWorkspace
        calculator={calculator}
        related={related}
        preferredStrategy={
          calculator.formulaType === "debtAvalanche" ? "avalanche" : "snowball"
        }
      />
    );
  }

  if (isLoansCategory) {
    return (
      <LoansCategoryWorkspace calculator={calculator} related={related} />
    );
  }

  if (calculator.formulaType === "monthlyMortgage") {
    return (
      <MonthlyMortgageWorkspace calculator={calculator} related={related} />
    );
  }

  if (calculator.formulaType === "bulkCutMacroPlanner") {
    return <BulkCutMacroPlanner calculator={calculator} related={related} />;
  }

  if (calculator.formulaType === "financialFreedomPropertyPlanner") {
    return (
      <FinancialFreedomPlanner calculator={calculator} related={related} />
    );
  }

  if (calculator.formulaType === "salaryCtcInHand") {
    return <CtcSalaryCalculator calculator={calculator} related={related} />;
  }

  if (calculator.formulaType === "reverseDietPlanner") {
    return <ReverseDietPlanner calculator={calculator} related={related} />;
  }
  if (calculator.formulaType === "emergencyFundRunwayPlanner") {
    return <EmergencyFundPlanner calculator={calculator} related={related} />;
  }
  if (calculator.formulaType === "multiGoalSavingsPlanner") {
    return <SavingsGoalPlanner calculator={calculator} related={related} />;
  }
  if (calculator.formulaType === "bodyRecompPlanner") {
    return <RecompPlanner calculator={calculator} related={related} />;
  }
  if (calculator.formulaType === "freelanceTrueRatePlanner") {
    return (
      <FreelanceTrueRatePlanner calculator={calculator} related={related} />
    );
  }
  if (calculator.formulaType === "weddingBudgetCashflowPlanner") {
    return <WeddingBudgetPlanner calculator={calculator} related={related} />;
  }
  if (calculator.formulaType === "babyFirstYearCostPlanner") {
    return <BabyCostPlanner calculator={calculator} related={related} />;
  }
  if (calculator.formulaType === "subscriptionRunwayAudit") {
    return (
      <SubscriptionAuditPlanner calculator={calculator} related={related} />
    );
  }
  if (calculator.formulaType === "keepLeaseBuyCarTco") {
    return <CarTcoPlanner calculator={calculator} related={related} />;
  }

  if (isLifeCuriosityFormula(calculator.formulaType)) {
    return (
      <LifeCuriosityWorkspace calculator={calculator} related={related} />
    );
  }

  return (
    <StandardCalculatorWorkspace
      calculator={calculator}
      related={related}
      values={values}
      setValues={setValues}
    />
  );
}

function handoffExtrasFromResult(
  formulaType: string,
  result: CalcResult
): Record<string, number> | undefined {
  const extras: Record<string, number> = {};
  if (formulaType === "healthTdee") {
    const tdee = parseMoneyText(result.primary.value);
    if (tdee != null) extras.tdee = tdee;
  }
  if (formulaType === "homeAffordability") {
    const payment = parseMoneyText(result.featured?.[0]?.value);
    if (payment != null) extras.monthlyPayment = payment;
  }
  return Object.keys(extras).length ? extras : undefined;
}

function StandardCalculatorWorkspace({
  calculator,
  related,
  values,
  setValues,
}: {
  calculator: Calculator;
  related: Calculator[];
  values: Record<string, number>;
  setValues: Dispatch<SetStateAction<Record<string, number>>>;
}) {
  const result = useMemo(
    () => runCalculation(calculator.formulaType, values),
    [calculator.formulaType, values]
  );

  const advice = useMemo(
    () => getSmartAdvice(calculator.formulaType, values, result),
    [calculator.formulaType, values, result]
  );

  useEffect(() => {
    const bag = takeScenarioBag();
    if (!bag) return;
    setValues((prev) => ({ ...prev, ...bag }));
  }, [calculator.slug, setValues]);

  const update = (id: string, raw: string) => {
    const next = Number(raw);
    setValues((prev) => ({
      ...prev,
      [id]: Number.isFinite(next) ? next : prev[id],
    }));
  };

  return (
    <div className="space-y-6">
      <HandoffArrivalBanner
        onClear={() =>
          setValues(
            Object.fromEntries(
              calculator.inputs.map((input) => [input.id, input.defaultValue])
            )
          )
        }
      />
      {usesStickyMemory(calculator) ? (
        <ToolMemoryBar
          slug={calculator.slug}
          values={values}
          onRestore={(next) => setValues((prev) => ({ ...prev, ...next }))}
        />
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <div className="calc-panel rounded-2xl p-5 sm:p-6">
          <h2 className="mb-5 text-lg font-semibold">Inputs</h2>
          <div className="space-y-6">
            {calculator.inputs.map((input) => {
              const value = values[input.id] ?? input.defaultValue;
              if (input.inputType === "checkbox") {
                const checked = value >= 0.5;
                return (
                  <div key={input.id}>
                    <label
                      htmlFor={input.id}
                      className="calc-inset flex cursor-pointer items-center justify-between gap-3 rounded-xl px-4 py-3"
                    >
                      <span className="text-sm font-medium text-[var(--foreground)]">
                        {input.label}
                      </span>
                      <input
                        id={input.id}
                        type="checkbox"
                        checked={checked}
                        onChange={(e) =>
                          setValues((prev) => ({
                            ...prev,
                            [input.id]: e.target.checked ? 1 : 0,
                          }))
                        }
                        className="h-5 w-5 accent-[var(--accent)]"
                      />
                    </label>
                  </div>
                );
              }
              return (
                <div key={input.id} className="min-w-0">
                  <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <label
                      htmlFor={input.id}
                      className="min-w-0 text-sm font-medium break-words-safe text-[var(--foreground)]"
                    >
                      {input.label}
                    </label>
                    <input
                      id={`${input.id}-number`}
                      type="number"
                      inputMode="decimal"
                      min={input.min}
                      max={input.max}
                      step={input.step}
                      value={value}
                      onChange={(e) => update(input.id, e.target.value)}
                      className="calc-inset w-full max-w-[9.5rem] shrink-0 self-end rounded-lg px-2.5 py-1.5 text-right text-sm outline-none focus:border-[var(--accent)] sm:w-28 sm:self-auto"
                    />
                  </div>
                  <input
                    id={input.id}
                    type="range"
                    min={input.min}
                    max={input.max}
                    step={input.step}
                    value={value}
                    onChange={(e) => update(input.id, e.target.value)}
                    className="range-input w-full max-w-full"
                  />
                  <div className="mt-1 flex justify-between gap-2 text-[11px] text-[var(--muted)]">
                    <span className="min-w-0 truncate">{input.min}</span>
                    <span className="min-w-0 truncate text-right">{input.max}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <aside className="lg:sticky lg:top-24">
          <div className="results-card relative z-0 rounded-2xl p-6">
            <div className="relative z-[1]">
            <p className="text-xs font-semibold tracking-[0.16em] text-[var(--accent)] uppercase">
              Live results
            </p>
            <p className="mt-3 text-sm text-[var(--muted)]">
              {result.primary.label}
            </p>
            <p className="result-glow mt-1 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight break-words-safe sm:text-4xl">
              {result.primary.value}
            </p>

            {result.featured && result.featured.length > 0 && (
              <div className="mt-6 space-y-4 border-t border-[var(--border)] pt-5">
                {result.featured.map((item) => (
                  <div key={item.label}>
                    <p className="text-sm text-[var(--muted)]">{item.label}</p>
                    <p className="result-glow mt-1 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight sm:text-3xl">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <dl className="mt-8 space-y-4">
              {result.secondary.map((item) => (
                <div
                  key={item.label}
                  className="flex items-start justify-between gap-3 border-t border-[var(--border)] pt-4"
                >
                  <dt className="min-w-0 flex-1 text-sm break-words-safe text-[var(--muted)]">
                    {item.label}
                  </dt>
                  <dd className="max-w-[50%] shrink-0 text-right text-sm font-semibold break-words-safe text-[var(--foreground)]">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>

            {result.insight && (
              <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
                <p className="text-[11px] font-semibold tracking-[0.14em] text-[var(--accent)] uppercase">
                  Coasting insight
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                  {result.insight}
                </p>
              </div>
            )}

            <p className="mt-6 text-xs leading-relaxed text-[var(--muted)]">
              {calculator.category === "Crypto & Digital Assets"
                ? "Results are for informational and educational purposes only and do not constitute financial, investment, or trading advice. Crypto markets are volatile—verify figures independently before making decisions."
                : "Estimates update instantly in your browser. Figures are for planning guidance and are not professional advice."}
            </p>
            </div>
          </div>
        </aside>
      </div>

      {calculator.formulaType === "carRentalTotal" ? (
        <CarRentalHowCalculated
          values={values}
          onTaxPreset={(n) =>
            setValues((prev) => ({
              ...prev,
              taxRate: n,
            }))
          }
        />
      ) : null}

      <SmartAdviceBox items={advice} />

      <HandoffCards
        slug={calculator.slug}
        values={values}
        result={result}
        extras={handoffExtrasFromResult(calculator.formulaType, result)}
      />

      <ScenarioComparePanel calculator={calculator} values={values} />

      {calculator.category === CRYPTO_CATEGORY ? (
        <CryptoProWorkspace calculator={calculator} values={values} />
      ) : null}

      {/* Additive Investing enhancements — base form & formulas unchanged */}
      {isInvestingCalculator(calculator) ? (
        <InvestingEnhancements
          calculator={calculator}
          values={values}
          result={result}
          onApplyWhatIf={setValues}
        />
      ) : null}

      {calculator.category === "Freelance & Self-Employment" ? (
        <FreelanceEnhancements
          calculator={calculator}
          values={values}
          result={result}
          onApplyRate={(patch) =>
            setValues((prev) => ({ ...prev, ...patch }))
          }
        />
      ) : null}

      {calculator.category === "Everyday Utilities & Savings" &&
      calculator.formulaType !== "expenseTracker" ? (
        <UtilitiesEnhancements
          calculator={calculator}
          values={values}
          result={result}
        />
      ) : null}

      {calculator.category === "Real Estate & Housing" ? (
        <RealEstateEnhancements
          calculator={calculator}
          values={values}
          result={result}
          onLoadScenario={(next) =>
            setValues((prev) => ({ ...prev, ...next }))
          }
        />
      ) : null}

      {calculator.category === "Canadian Taxes" ||
      calculator.category === "BC Local Taxes" ? (
        <TaxEnhancements
          calculator={calculator}
          values={values}
          result={result}
        />
      ) : null}

      {calculator.category === HEALTH_DISPLAY_CATEGORY ? (
        <HealthEnhancements calculator={calculator} result={result} />
      ) : null}

      {calculator.category === AFFORDABILITY_DISPLAY_CATEGORY ? (
        <ProgressSnapshotsPanel
          slug={calculator.slug}
          result={result}
          title="Affordability check-ins"
          disclaimer="Snapshots stay on this device. Recalculate when rates or income change. Not lending approval or financial advice."
        />
      ) : null}

      <aside className="calc-panel rounded-2xl p-4 sm:p-5">
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <h2 className="text-xs font-semibold tracking-[0.14em] text-[var(--accent)] uppercase sm:text-sm">
            Related tools
          </h2>
          <p className="text-[11px] text-[var(--muted)]">{calculator.category}</p>
        </div>
        <ul className="grid gap-2 sm:grid-cols-2">
          {related.map((tool) => (
            <li key={tool.slug}>
              <Link
                href={getToolHref(tool.slug)}
                className="block rounded-xl border border-transparent px-3 py-2.5 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--border)] hover:bg-[var(--background)] hover:text-[var(--accent)]"
              >
                {tool.title}
              </Link>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}

function money(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(n);
}

function CarRentalHowCalculated({
  values,
  onTaxPreset,
}: {
  values: Record<string, number>;
  onTaxPreset: (n: number) => void;
}) {
  const dailyRate = values.dailyRate ?? 0;
  const days = values.days ?? 0;
  const taxRate = values.taxRate ?? 0;
  const extras = values.extras ?? 0;
  const base = dailyRate * days;
  const taxShare = Math.max(0, base * (taxRate / 100));
  const taxed = base + taxShare;
  const total = taxed + extras;
  const parts = [
    { label: "Days", value: base, color: "bg-[#2979FF]" },
    { label: "Taxes / fees", value: taxShare, color: "bg-[#00E5FF]" },
    { label: "Extras", value: extras, color: "bg-[#f59e0b]" },
  ];
  const partTotal = parts.reduce((sum, p) => sum + Math.max(0, p.value), 0);

  return (
    <section
      className="max-w-3xl space-y-4"
      aria-labelledby="car-rental-how-calculated-heading"
    >
      <h2
        id="car-rental-how-calculated-heading"
        className="font-[family-name:var(--font-display)] text-base font-semibold tracking-tight sm:text-lg"
      >
        How the rental car total is calculated
      </h2>
      <p className="font-mono text-sm text-[var(--foreground)]">
        Total = (daily rate × days) × (1 + taxes/fees %) + extras
      </p>
      <p className="text-sm leading-relaxed text-[color-mix(in_srgb,var(--foreground)_78%,var(--muted))]">
        Base days cost {money(dailyRate)} × {days} = {money(base)}. After{" "}
        {taxRate}% taxes and fees that is {money(taxed)}, then extras{" "}
        {money(extras)} bring the rental total to {money(total)}.
      </p>
      {partTotal > 0 ? (
        <div>
          <div className="flex h-4 overflow-hidden rounded-full">
            {parts.map((part) => (
              <div
                key={part.label}
                className={part.color}
                style={{
                  width: `${Math.max(0, part.value) / partTotal * 100}%`,
                }}
                title={`${part.label} ${money(part.value)}`}
              />
            ))}
          </div>
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-[var(--muted)]">
            {parts.map((part) => (
              <span key={part.label} className="inline-flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${part.color}`} />
                {part.label} {money(part.value)}
              </span>
            ))}
          </div>
        </div>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onTaxPreset(12)}
          className={
            taxRate === 12
              ? "rounded-lg bg-gradient-to-r from-[#00E5FF] to-[#2979FF] px-3 py-1.5 text-xs font-semibold text-white"
              : "rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-semibold"
          }
        >
          Off-airport 12%
        </button>
        <button
          type="button"
          onClick={() => onTaxPreset(18)}
          className={
            taxRate === 18
              ? "rounded-lg bg-gradient-to-r from-[#00E5FF] to-[#2979FF] px-3 py-1.5 text-xs font-semibold text-white"
              : "rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-semibold"
          }
        >
          Airport 18%
        </button>
      </div>
      <p className="text-sm text-[var(--muted)]">
        Airport counters often add concession and facility fees. Put those in
        the taxes/fees % instead of the daily rate so the day count stays
        honest.
      </p>
    </section>
  );
}
