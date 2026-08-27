"use client";

import { useMemo, useState } from "react";
import type { Calculator } from "@/lib/types";
import { Field, Panel, ResultHero, Row } from "@/components/global/ui";
import { calculateBabyCost } from "@/lib/globalPlanners/babyCost";
import { money } from "@/lib/globalPlanners/money";

export function BabyCostPlanner({
  calculator,
}: {
  calculator: Calculator;
  related: Calculator[];
}) {
  const [oneTimeCosts, setOneTimeCosts] = useState(2500);
  const [monthlyRecurring, setMonthlyRecurring] = useState(350);
  const [childcareMonthly, setChildcareMonthly] = useState(900);
  const [childcareStartMonth, setChildcareStartMonth] = useState(7);
  const [normalMonthlyIncome, setNormalMonthlyIncome] = useState(4200);
  const [leaveMonths, setLeaveMonths] = useState(4);
  const [leaveIncomePct, setLeaveIncomePct] = useState(55);
  const [partnerIncomeMonthly, setPartnerIncomeMonthly] = useState(2800);
  const [currentSavings, setCurrentSavings] = useState(8000);

  const result = useMemo(
    () =>
      calculateBabyCost({
        oneTimeCosts,
        monthlyRecurring,
        childcareMonthly,
        childcareStartMonth,
        normalMonthlyIncome,
        leaveMonths,
        leaveIncomePct,
        partnerIncomeMonthly,
        currentSavings,
      }),
    [
      oneTimeCosts,
      monthlyRecurring,
      childcareMonthly,
      childcareStartMonth,
      normalMonthlyIncome,
      leaveMonths,
      leaveIncomePct,
      partnerIncomeMonthly,
      currentSavings,
    ]
  );

  return (
    <div className="space-y-6">
      <p className="rounded-xl border border-[var(--accent)]/30 bg-[var(--accent)]/5 px-4 py-3 text-sm text-[var(--muted)]">
        <strong className="text-[var(--foreground)]">Parental leave bridge:</strong>{" "}
        models reduced pay → return to work → childcare start so you see the
        worst cash month — not just average baby costs.
      </p>
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Costs & leave">
          <Field label="One-time setup costs" value={oneTimeCosts} min={0} max={20000} step={100} onChange={setOneTimeCosts} />
          <Field label="Monthly recurring (diapers, etc.)" value={monthlyRecurring} min={0} max={3000} step={25} onChange={setMonthlyRecurring} />
          <Field label="Childcare / month" value={childcareMonthly} min={0} max={5000} step={50} onChange={setChildcareMonthly} />
          <Field label="Childcare starts (month)" value={childcareStartMonth} min={0} max={12} step={1} onChange={setChildcareStartMonth} />
          <Field label="Your normal income / mo" value={normalMonthlyIncome} min={0} max={30000} step={100} onChange={setNormalMonthlyIncome} />
          <Field label="Leave length (months)" value={leaveMonths} min={0} max={12} step={1} onChange={setLeaveMonths} />
          <Field label="Income during leave %" value={leaveIncomePct} min={0} max={100} step={5} onChange={setLeaveIncomePct} />
          <Field label="Partner income / mo" value={partnerIncomeMonthly} min={0} max={30000} step={100} onChange={setPartnerIncomeMonthly} />
          <Field label="Savings buffer" value={currentSavings} min={0} max={100000} step={500} onChange={setCurrentSavings} />
        </Panel>
        <div className="space-y-5">
          <ResultHero
            eyebrow="First-year total"
            value={money(result.firstYearTotal)}
            insight={result.insight}
          >
            <dl className="mt-4 space-y-2 border-t border-[var(--border)] pt-4">
              <Row label="Worst month" value={`Month ${result.worstMonth}`} />
              <Row label="Worst month net" value={money(result.worstMonthNet)} />
            </dl>
          </ResultHero>
        </div>
      </div>
      <Panel title="12-month bridge">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-sm text-left">
            <thead>
              <tr className="border-b border-[var(--border)] text-[var(--muted)]">
                <th className="py-2">Mo</th>
                <th className="py-2">Phase</th>
                <th className="py-2">Income</th>
                <th className="py-2">Costs</th>
                <th className="py-2">Net</th>
                <th className="py-2">Cumulative</th>
              </tr>
            </thead>
            <tbody>
              {result.months.map((m) => (
                <tr
                  key={m.month}
                  className={`border-b border-[var(--border)]/50 ${m.month === result.worstMonth ? "bg-amber-500/10" : ""}`}
                >
                  <td className="py-2">{m.month}</td>
                  <td className="py-2 capitalize">{m.phase}</td>
                  <td className="py-2">{money(m.income)}</td>
                  <td className="py-2">{money(m.costs)}</td>
                  <td className={`py-2 font-semibold ${m.net < 0 ? "text-red-500" : ""}`}>{money(m.net)}</td>
                  <td className="py-2">{money(m.cumulative)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-[var(--muted)]">{calculator.seoContent.intro}</p>
      </Panel>
    </div>
  );
}
