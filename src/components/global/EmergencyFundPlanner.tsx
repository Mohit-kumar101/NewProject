"use client";

import { useMemo, useState } from "react";
import type { Calculator } from "@/lib/types";
import { Field, Panel, ResultHero, Row } from "@/components/global/ui";
import {
  SHOCK_LABELS,
  calculateEmergencyFund,
  type ShockType,
} from "@/lib/globalPlanners/emergencyFund";
import { money } from "@/lib/globalPlanners/money";

export function EmergencyFundPlanner({
  calculator,
}: {
  calculator: Calculator;
  related: Calculator[];
}) {
  const [liquidSavings, setLiquidSavings] = useState(12000);
  const [monthlyExpenses, setMonthlyExpenses] = useState(3200);
  const [monthlyIncome, setMonthlyIncome] = useState(5500);
  const [targetMonths, setTargetMonths] = useState(6);
  const [monthlySavingsCapacity, setMonthlySavingsCapacity] = useState(800);
  const [shock, setShock] = useState<ShockType>("none");
  const [medicalBillAmount, setMedicalBillAmount] = useState(4000);
  const [rentHikePct, setRentHikePct] = useState(20);
  const [partnerIncomeShare, setPartnerIncomeShare] = useState(40);

  const result = useMemo(
    () =>
      calculateEmergencyFund({
        liquidSavings,
        monthlyExpenses,
        monthlyIncome,
        targetMonths,
        monthlySavingsCapacity,
        shock,
        medicalBillAmount,
        rentHikePct,
        partnerIncomeShare,
      }),
    [
      liquidSavings,
      monthlyExpenses,
      monthlyIncome,
      targetMonths,
      monthlySavingsCapacity,
      shock,
      medicalBillAmount,
      rentHikePct,
      partnerIncomeShare,
    ]
  );

  return (
    <div className="space-y-6">
      <p className="rounded-xl border border-[var(--accent)]/30 bg-[var(--accent)]/5 px-4 py-3 text-sm text-[var(--muted)]">
        <strong className="text-[var(--foreground)]">Life-shock simulator:</strong>{" "}
        stress-test job loss, medical bills, rent hikes, or lost partner income —
        feature often locked behind paid finance apps.
      </p>
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Fund & runway">
          <Field label="Liquid savings" value={liquidSavings} min={0} max={500000} step={500} onChange={setLiquidSavings} />
          <Field label="Monthly expenses" value={monthlyExpenses} min={500} max={30000} step={100} onChange={setMonthlyExpenses} />
          <Field label="Monthly income" value={monthlyIncome} min={0} max={50000} step={100} onChange={setMonthlyIncome} />
          <Field label="Target months of expenses" value={targetMonths} min={1} max={24} step={1} onChange={setTargetMonths} />
          <Field label="Monthly savings capacity" value={monthlySavingsCapacity} min={0} max={20000} step={50} onChange={setMonthlySavingsCapacity} />
          <div>
            <p className="mb-2 text-sm font-medium">Life shock</p>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(SHOCK_LABELS) as ShockType[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setShock(s)}
                  className={`rounded-xl border px-2 py-2 text-left text-xs font-medium ${
                    shock === s
                      ? "border-[var(--accent)] bg-[var(--accent)]/10"
                      : "border-[var(--border)]"
                  }`}
                >
                  {SHOCK_LABELS[s]}
                </button>
              ))}
            </div>
          </div>
          {shock === "medicalBill" && (
            <Field label="Medical / emergency bill" value={medicalBillAmount} min={500} max={50000} step={500} onChange={setMedicalBillAmount} />
          )}
          {shock === "rentHike" && (
            <Field label="Rent hike %" value={rentHikePct} min={5} max={50} step={5} onChange={setRentHikePct} />
          )}
          {shock === "partnerIncomeGone" && (
            <Field label="Partner share of income %" value={partnerIncomeShare} min={10} max={80} step={5} onChange={setPartnerIncomeShare} />
          )}
        </Panel>
        <div className="space-y-5">
          <ResultHero
            eyebrow={shock === "none" ? "Current runway" : "Post-shock runway"}
            value={`${(shock === "none" ? result.currentMonths : result.postShockMonths).toFixed(1)} mo`}
            insight={result.insight}
          >
            <dl className="mt-4 space-y-2 border-t border-[var(--border)] pt-4">
              <Row label="Target fund" value={money(result.targetAmount)} />
              <Row label="Gap" value={money(result.gap)} />
              <Row
                label="Months to target"
                value={
                  result.monthsToTarget == null
                    ? "Raise savings capacity"
                    : `${result.monthsToTarget}`
                }
              />
            </dl>
          </ResultHero>
        </div>
      </div>
      <Panel title="Balance over time">
        <div className="flex h-40 items-end gap-1">
          {result.timeline.slice(0, 18).map((t) => {
            const maxB = Math.max(...result.timeline.map((x) => x.balance), 1);
            return (
              <div key={t.month} className="min-w-0 flex-1" title={`M${t.month}: ${money(t.balance)}`}>
                <div
                  className={`mx-auto w-full max-w-3 rounded-t ${t.depleted ? "bg-red-400/80" : "bg-[var(--accent)]/80"}`}
                  style={{ height: `${Math.max(4, (t.balance / maxB) * 100)}%` }}
                />
              </div>
            );
          })}
        </div>
        <p className="text-xs text-[var(--muted)]">{calculator.seoContent.intro}</p>
      </Panel>
    </div>
  );
}
