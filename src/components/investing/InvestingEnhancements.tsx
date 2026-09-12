"use client";

import { useMemo } from "react";
import type { CalcResult, Calculator } from "@/lib/types";
import { runCalculation } from "@/lib/formulas";
import { StrategicInsightsPanel } from "@/components/strategic/StrategicInsightsPanel";
import { InvestingWhatIfPanel } from "@/components/investing/InvestingWhatIfPanel";
import { InvestingLifestyleTranslator } from "@/components/investing/InvestingLifestyleTranslator";
import { InvestingNextSteps } from "@/components/investing/InvestingNextSteps";
import { InvestingExpandedFaq } from "@/components/investing/InvestingExpandedFaq";
import { buildInvestingInsightsConfig } from "@/lib/investingEnhancements";

/**
 * Modular Investing & Wealth Building enhancements.
 * Appended below the existing calculator output — does not rewrite core forms or formulas.
 */
export function InvestingEnhancements({
  calculator,
  values,
  result,
  onApplyWhatIf,
}: {
  calculator: Calculator;
  values: Record<string, number>;
  result: CalcResult;
  onApplyWhatIf?: (next: Record<string, number>) => void;
}) {
  const insightsConfig = useMemo(
    () =>
      buildInvestingInsightsConfig(calculator.formulaType, values, result),
    [calculator.formulaType, values, result]
  );

  return (
    <div className="space-y-6">
      {calculator.formulaType === "compoundInterest" ? (
        <CompoundContributionCompare values={values} />
      ) : null}

      <InvestingWhatIfPanel
        calculator={calculator}
        baseValues={values}
        onApply={onApplyWhatIf}
      />

      <div className="space-y-4">
        <StrategicInsightsPanel config={insightsConfig} />
        <InvestingLifestyleTranslator
          formulaType={calculator.formulaType}
          values={values}
          result={result}
        />
      </div>

      <InvestingNextSteps
        calculator={calculator}
        values={values}
        result={result}
      />

      <InvestingExpandedFaq calculator={calculator} />
    </div>
  );
}

function parseUsd(value: string): number {
  const n = Number(value.replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function CompoundContributionCompare({
  values,
}: {
  values: Record<string, number>;
}) {
  const monthly = values.monthlyContribution ?? 0;
  const withContrib = runCalculation("compoundInterest", values);
  const withoutContrib = runCalculation("compoundInterest", {
    ...values,
    monthlyContribution: 0,
  });
  const withAmt = parseUsd(withContrib.primary.value);
  const withoutAmt = parseUsd(withoutContrib.primary.value);
  const maxAmt = Math.max(withAmt, withoutAmt, 1);
  const gap = Math.max(0, withAmt - withoutAmt);

  return (
    <section className="calc-panel rounded-2xl p-5 sm:p-6">
      <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight">
        With vs without monthly contributions
      </h2>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Same deposit, rate, and years. The only change is{" "}
        {monthly > 0 ? `$${monthly}/mo` : "your monthly contribution"}.
      </p>
      <div className="mt-4 space-y-3">
        <div>
          <div className="flex justify-between text-sm">
            <span>With contributions</span>
            <span className="font-semibold">{withContrib.primary.value}</span>
          </div>
          <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-[var(--background)]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#00E5FF] to-[#2979FF]"
              style={{ width: `${(withAmt / maxAmt) * 100}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm">
            <span>Deposit only</span>
            <span className="font-semibold">{withoutContrib.primary.value}</span>
          </div>
          <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-[var(--background)]">
            <div
              className="h-full rounded-full bg-[var(--muted)]/40"
              style={{ width: `${(withoutAmt / maxAmt) * 100}%` }}
            />
          </div>
        </div>
      </div>
      {gap > 0 ? (
        <p className="mt-4 text-sm font-semibold">
          Monthly deposits add about{" "}
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
          }).format(gap)}{" "}
          to the ending balance.
        </p>
      ) : (
        <p className="mt-4 text-sm text-[var(--muted)]">
          Add a monthly contribution above to see the gap.
        </p>
      )}
    </section>
  );
}
