"use client";

import { useMemo, useState } from "react";
import type { Calculator } from "@/lib/types";
import { Field, Panel, ResultHero, Row } from "@/components/global/ui";
import { calculateFreelanceRate } from "@/lib/globalPlanners/freelanceRate";
import { money } from "@/lib/globalPlanners/money";
import { PlannerHandoffChrome } from "@/components/shared/PlannerHandoffChrome";
import { applyBagToSetters, useApplyScenarioBag } from "@/components/shared/useHandoffHydration";

const FREELANCE_DEFAULTS = {
  desiredNetMonthly: 4000,
  billableHoursPerWeek: 25,
  weeksPerMonth: 4,
  taxPct: 25,
};

export function FreelanceTrueRatePlanner({
  calculator,
}: {
  calculator: Calculator;
  related: Calculator[];
}) {
  const [desiredNetMonthly, setDesiredNetMonthly] = useState(
    FREELANCE_DEFAULTS.desiredNetMonthly
  );
  const [billableHoursPerWeek, setBillableHoursPerWeek] = useState(
    FREELANCE_DEFAULTS.billableHoursPerWeek
  );
  const [weeksPerMonth, setWeeksPerMonth] = useState(FREELANCE_DEFAULTS.weeksPerMonth);
  const [platformFeePct, setPlatformFeePct] = useState(20);
  const [processorFeePct, setProcessorFeePct] = useState(2.9);
  const [processorFixed, setProcessorFixed] = useState(0.3);
  const [fxLossPct, setFxLossPct] = useState(1);
  const [taxPct, setTaxPct] = useState(25);
  const [nonBillablePct, setNonBillablePct] = useState(30);

  useApplyScenarioBag((bag) =>
    applyBagToSetters(bag, {
      desiredNetMonthly: setDesiredNetMonthly,
      billableHoursPerWeek: setBillableHoursPerWeek,
      weeksPerMonth: setWeeksPerMonth,
      taxPct: setTaxPct,
    })
  );

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
    <PlannerHandoffChrome
      slug={calculator.slug}
      values={{
        desiredNetMonthly,
        billableHoursPerWeek,
        weeksPerMonth,
        taxPct,
      }}
      extras={{ invoiceGross: result.invoiceGross }}
      onClear={() => {
        setDesiredNetMonthly(FREELANCE_DEFAULTS.desiredNetMonthly);
        setBillableHoursPerWeek(FREELANCE_DEFAULTS.billableHoursPerWeek);
        setWeeksPerMonth(FREELANCE_DEFAULTS.weeksPerMonth);
        setTaxPct(FREELANCE_DEFAULTS.taxPct);
      }}
    >
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
            eyebrow="Hourly floor to hit your net"
            value={money(result.hourlyBillRate, 2)}
            insight={result.insight}
          >
            <p className="mt-2 text-sm font-medium text-[var(--foreground)]">
              This assumes {billableHoursPerWeek} billable hours/week, not
              40×52.
            </p>
            <dl className="mt-4 space-y-2 border-t border-[var(--border)] pt-4">
              <Row label="Invoice gross" value={money(result.invoiceGross)} />
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
    </PlannerHandoffChrome>
  );
}
