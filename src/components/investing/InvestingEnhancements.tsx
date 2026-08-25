"use client";

import { useMemo } from "react";
import type { CalcResult, Calculator } from "@/lib/types";
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
