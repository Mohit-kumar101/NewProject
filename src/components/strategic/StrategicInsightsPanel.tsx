"use client";

import { useMemo, useState } from "react";
import { LifeShockInjector } from "@/components/strategic/LifeShockInjector";
import { InflationRealistToggle } from "@/components/strategic/InflationRealistToggle";
import { LifestyleTradeOff } from "@/components/strategic/LifestyleTradeOff";
import { PartnerCompromisePanel } from "@/components/strategic/PartnerCompromisePanel";
import {
  computeResilienceScore,
  estimateRateShockPaymentIncrease,
  type LifeShockId,
  type LifeShockState,
} from "@/lib/strategicInsights";

export type StrategicInsightsConfig = {
  /** Primary monthly obligation (PITI, debt plan total, etc.). */
  monthlyPayment: number;
  /** Optional cheaper baseline for lifestyle “difference” copy. */
  comparePayment?: number;
  /** For rate-shock simulation. */
  principal?: number;
  annualRate?: number;
  termMonths?: number;
  /** Nominal future figure (equity, savings, etc.) for inflation toggle. */
  inflationNominal?: number;
  inflationYears?: number;
  inflationLabel?: string;
  /** Show partner compromise module. */
  showPartner?: boolean;
  /** Default liquid reserve for resilience. */
  defaultLiquidReserve?: number;
};

const DEFAULT_SHOCKS: LifeShockState = {
  sabbatical: false,
  rateShock: false,
  emergency: false,
};

export function StrategicInsightsPanel({
  config,
}: {
  config: StrategicInsightsConfig;
}) {
  const [shocks, setShocks] = useState<LifeShockState>(DEFAULT_SHOCKS);
  const [liquidReserve, setLiquidReserve] = useState(
    config.defaultLiquidReserve ??
      Math.max(0, config.monthlyPayment * 3)
  );

  const rateShockDelta = useMemo(() => {
    if (
      config.principal == null ||
      config.annualRate == null ||
      config.termMonths == null
    ) {
      return 0;
    }
    return estimateRateShockPaymentIncrease({
      principal: config.principal,
      annualRate: config.annualRate,
      termMonths: config.termMonths,
    });
  }, [config.principal, config.annualRate, config.termMonths]);

  const resilience = useMemo(
    () =>
      computeResilienceScore({
        monthlyObligation: config.monthlyPayment,
        liquidReserve,
        shocks,
        rateShockPaymentIncrease: rateShockDelta,
      }),
    [config.monthlyPayment, liquidReserve, shocks, rateShockDelta]
  );

  const toggleShock = (id: LifeShockId) => {
    setShocks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (config.monthlyPayment <= 0 && !config.inflationNominal) {
    return null;
  }

  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold tracking-[0.18em] text-[var(--accent)] uppercase">
        Pro strategic insights
      </p>

      <LifeShockInjector
        result={resilience}
        shocks={shocks}
        onToggle={toggleShock}
        liquidReserve={liquidReserve}
        onLiquidChange={setLiquidReserve}
      />

      {config.inflationNominal != null &&
        config.inflationYears != null &&
        config.inflationYears > 0 && (
          <InflationRealistToggle
            nominalValue={config.inflationNominal}
            years={config.inflationYears}
            label={config.inflationLabel ?? "Future value"}
          />
        )}

      {config.monthlyPayment > 0 && (
        <LifestyleTradeOff
          monthlyPayment={config.monthlyPayment}
          comparePayment={config.comparePayment}
        />
      )}

      {config.showPartner !== false && config.monthlyPayment > 0 && (
        <PartnerCompromisePanel targetPayment={config.monthlyPayment} />
      )}
    </div>
  );
}
