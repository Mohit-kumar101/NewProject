"use client";

import { useMemo, useState } from "react";
import type { Calculator } from "@/lib/types";
import { Field, Panel, ResultHero, Row } from "@/components/global/ui";
import { calculateFreelanceRate } from "@/lib/globalPlanners/freelanceRate";
import { money } from "@/lib/globalPlanners/money";

export function FreelanceTrueRatePlanner({
  calculator,
}: {
  calculator: Calculator;
  related: Calculator[];
}) {
  const [desiredNetMonthly, setDesiredNetMonthly] = useState(4000);
  const [billableHoursPerWeek, setBillableHoursPerWeek] = useState(25);
  const [weeksPerMonth, setWeeksPerMonth] = useState(4);
  const [platformFeePct, setPlatformFeePct] = useState(20);
  const [processorFeePct, setProcessorFeePct] = useState(2.9);
  const [processorFixed, setProcessorFixed] = useState(0.3);
  const [fxLossPct, setFxLossPct] = useState(1);
  const [taxPct, setTaxPct] = useState(25);
  const [nonBillablePct, setNonBillablePct] = useState(30);

  const result = useMemo(
    () =>
      calculateFreelanceRate({
        desiredNetMonthly,
        billableHoursPerWeek,
        weeksPerMonth,
        platformFeePct,
        processorFeePct,
        processorFixed,
        fxLossPct,
        taxPct,
        nonBillablePct,
      }),
    [
      desiredNetMonthly,
      billableHoursPerWeek,
      weeksPerMonth,
      platformFeePct,
      processorFeePct,
      processorFixed,
      fxLossPct,
      taxPct,
      nonBillablePct,
    ]
  );

  return (
    <div className="space-y-6">
      <p className="rounded-xl border border-[var(--accent)]/30 bg-[var(--accent)]/5 px-4 py-3 text-sm text-[var(--muted)]">
        <strong className="text-[var(--foreground)]">Fee waterfall:</strong>{" "}
        platform → processor → FX → tax → admin time, then reverse-solves the
        invoice so you still hit your net — often a paid freelancer-app feature.
      </p>
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Target & fees">
          <Field label="Desired net / month" value={desiredNetMonthly} min={500} max={50000} step={100} onChange={setDesiredNetMonthly} />
          <Field label="Billable hours / week" value={billableHoursPerWeek} min={5} max={60} step={1} onChange={setBillableHoursPerWeek} />
          <Field label="Weeks / month" value={weeksPerMonth} min={3} max={5} step={0.5} onChange={setWeeksPerMonth} />
          <Field label="Platform fee %" value={platformFeePct} min={0} max={35} step={0.5} onChange={setPlatformFeePct} />
          <Field label="Processor fee %" value={processorFeePct} min={0} max={10} step={0.1} onChange={setProcessorFeePct} />
          <Field label="Processor fixed fee" value={processorFixed} min={0} max={5} step={0.1} onChange={setProcessorFixed} />
          <Field label="FX / currency loss %" value={fxLossPct} min={0} max={8} step={0.5} onChange={setFxLossPct} />
          <Field label="Tax reserve %" value={taxPct} min={0} max={50} step={1} onChange={setTaxPct} />
          <Field label="Non-billable time %" value={nonBillablePct} min={0} max={60} step={5} onChange={setNonBillablePct} />
        </Panel>
        <div className="space-y-5">
          <ResultHero
            eyebrow="Invoice this amount"
            value={money(result.invoiceGross)}
            insight={result.insight}
          >
            <dl className="mt-4 space-y-2 border-t border-[var(--border)] pt-4">
              <Row label="Hourly bill rate" value={money(result.hourlyBillRate, 2)} />
              <Row label="Take-home %" value={`${result.effectiveTakeHomePct.toFixed(1)}%`} />
            </dl>
          </ResultHero>
        </div>
      </div>
      <Panel title="Fee waterfall">
        <div className="space-y-3">
          {result.waterfall.map((step) => (
            <div
              key={step.label}
              className="flex flex-wrap items-baseline justify-between gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm"
            >
              <div>
                <p className="font-medium">{step.label}</p>
                <p className="text-xs text-[var(--muted)]">{step.pctOrAmount}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{money(step.amountAfter)}</p>
                {step.deducted > 0 && (
                  <p className="text-xs text-red-500">−{money(step.deducted)}</p>
                )}
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-[var(--muted)]">{calculator.seoContent.intro}</p>
      </Panel>
    </div>
  );
}
