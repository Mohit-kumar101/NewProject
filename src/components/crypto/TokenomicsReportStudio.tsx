"use client";

import { useMemo, useState } from "react";
import { projectTokenomicsSeries } from "@/lib/monetization/tokenomicsSeries";
import { TokenomicsCharts } from "@/components/crypto/TokenomicsCharts";
import { TokenomicsReportPanel } from "@/components/crypto/TokenomicsReport";

const DEFAULTS = {
  totalSupply: 1_000_000_000,
  tgeCirculating: 100_000_000,
  vestedAllocation: 300_000_000,
  cliffMonths: 6,
  vestingMonths: 24,
  monthlyEmission: 2_000_000,
  projectionMonths: 36,
};

export function TokenomicsReportStudio() {
  const [inputs, setInputs] = useState(DEFAULTS);

  const series = useMemo(() => projectTokenomicsSeries(inputs), [inputs]);

  const update = (key: keyof typeof DEFAULTS, raw: string) => {
    const n = Number(raw);
    setInputs((prev) => ({
      ...prev,
      [key]: Number.isFinite(n) ? n : prev[key],
    }));
  };

  return (
    <div className="space-y-10">
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <h2 className="text-lg font-semibold">Scenario inputs</h2>
          <div className="mt-4 space-y-3">
            {(
              [
                ["totalSupply", "Total supply"],
                ["tgeCirculating", "TGE circulating"],
                ["vestedAllocation", "Vested allocation"],
                ["cliffMonths", "Cliff (months)"],
                ["vestingMonths", "Vesting (months)"],
                ["monthlyEmission", "Monthly emissions"],
                ["projectionMonths", "Projection months"],
              ] as const
            ).map(([id, label]) => (
              <label key={id} className="block text-sm">
                <span className="text-[var(--muted)]">{label}</span>
                <input
                  type="number"
                  value={inputs[id]}
                  onChange={(e) => update(id, e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
                />
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <TokenomicsCharts series={series} />
        </div>
      </div>

      <TokenomicsReportPanel series={series} inputs={inputs} />

      <p className="text-xs leading-relaxed text-[var(--muted)]">
        Charts and PDFs are for informational and educational purposes only and
        do not constitute financial, investment, or legal advice.
      </p>
    </div>
  );
}
