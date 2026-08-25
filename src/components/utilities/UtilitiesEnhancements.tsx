"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { CalcResult, Calculator } from "@/lib/types";
import { getToolHref } from "@/lib/cryptoFormulas";
import { buildScenarioUrl, copyText } from "@/lib/scenarioLinks";
import {
  loadNamedSubscriptions,
  saveNamedSubscriptions,
  type NamedSubscription,
} from "@/lib/toolPersistence";
import { runCalculation } from "@/lib/formulas";

function money(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(n) ? n : 0);
}

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function UtilitiesEnhancements({
  calculator,
  values,
  result,
}: {
  calculator: Calculator;
  values: Record<string, number>;
  result: CalcResult;
}) {
  const [subs, setSubs] = useState<NamedSubscription[]>(() => {
    const saved = loadNamedSubscriptions();
    if (saved.length) return saved;
    return [
      { id: uid(), name: "Streaming", amount: values.sub1 ?? 16 },
      { id: uid(), name: "Software", amount: values.sub2 ?? 13 },
      { id: uid(), name: "Other", amount: values.sub3 ?? 10 },
    ];
  });
  const [status, setStatus] = useState<string | null>(null);

  const activeTotal = useMemo(
    () =>
      subs.reduce((sum, s) => sum + (s.paused ? 0 : Math.max(0, s.amount)), 0),
    [subs]
  );
  const pausedTotal = useMemo(
    () =>
      subs.reduce((sum, s) => sum + (s.paused ? Math.max(0, s.amount) : 0), 0),
    [subs]
  );

  const persist = (next: NamedSubscription[]) => {
    setSubs(next);
    saveNamedSubscriptions(next);
  };

  const emergencyBridge = useMemo(() => {
    if (pausedTotal <= 0) return null;
    const months = values.monthsCoverage ?? 6;
    const expenses = values.monthlyExpenses ?? 3500;
    const current = values.currentSavings ?? 2000;
    const target = expenses * months;
    const gap = Math.max(0, target - current);
    const monthsFaster =
      pausedTotal > 0 ? gap / pausedTotal : 0;
    return {
      pausedTotal,
      monthsFaster: Number.isFinite(monthsFaster) ? monthsFaster : 0,
      gap,
    };
  }, [pausedTotal, values]);

  const showTracker =
    calculator.formulaType === "subscriptionAggregator" ||
    calculator.formulaType === "emergencyFund" ||
    calculator.formulaType === "latteFactor";

  const showTipShare = calculator.formulaType === "tipBillSplit";

  const copyTipShare = async () => {
    const tipResult = runCalculation("tipBillSplit", values);
    const text = [
      "Bill split via CalculioHub",
      `${tipResult.primary.label}: ${tipResult.primary.value}`,
      ...tipResult.secondary.map((s) => `${s.label}: ${s.value}`),
      buildScenarioUrl(values),
    ].join("\n");
    const ok = await copyText(text);
    setStatus(ok ? "Split summary + link copied" : "Copy failed");
  };

  return (
    <div className="space-y-6">
      {showTracker ? (
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
          <p className="text-xs font-semibold tracking-[0.16em] text-[var(--accent)] uppercase">
            Habit tracker
          </p>
          <h2 className="mt-1 font-[family-name:var(--font-display)] text-lg font-bold">
            Subscriptions on this device
          </h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Name your recurring costs, pause ones you&apos;ll cut, and see how
            fast that feeds an emergency fund.
          </p>

          <ul className="mt-4 space-y-2">
            {subs.map((sub) => (
              <li
                key={sub.id}
                className="grid grid-cols-[1fr_90px_auto] items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2"
              >
                <input
                  value={sub.name}
                  onChange={(e) =>
                    persist(
                      subs.map((s) =>
                        s.id === sub.id ? { ...s, name: e.target.value } : s
                      )
                    )
                  }
                  className="bg-transparent text-sm outline-none"
                />
                <input
                  type="number"
                  min={0}
                  step={0.5}
                  value={sub.amount}
                  onChange={(e) =>
                    persist(
                      subs.map((s) =>
                        s.id === sub.id
                          ? { ...s, amount: Number(e.target.value) || 0 }
                          : s
                      )
                    )
                  }
                  className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2 py-1 text-right text-sm"
                />
                <button
                  type="button"
                  onClick={() =>
                    persist(
                      subs.map((s) =>
                        s.id === sub.id ? { ...s, paused: !s.paused } : s
                      )
                    )
                  }
                  className={`rounded-lg px-2 py-1 text-xs font-semibold ${
                    sub.paused
                      ? "bg-[var(--accent)] text-[#041018]"
                      : "border border-[var(--border)]"
                  }`}
                >
                  {sub.paused ? "Cut" : "Keep"}
                </button>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="mt-3 text-sm font-semibold text-[var(--accent)]"
            onClick={() =>
              persist([
                ...subs,
                { id: uid(), name: "New subscription", amount: 9.99 },
              ])
            }
          >
            + Add subscription
          </button>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-3 text-sm">
              Active monthly: <strong>{money(activeTotal)}</strong>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-3 text-sm">
              Marked to cut: <strong>{money(pausedTotal)}</strong>/mo
            </div>
          </div>

          {emergencyBridge && emergencyBridge.pausedTotal > 0 ? (
            <p className="mt-4 rounded-xl border border-[color-mix(in_srgb,var(--accent)_35%,var(--border))] bg-[color-mix(in_srgb,var(--accent)_8%,var(--background))] px-4 py-3 text-sm leading-relaxed">
              Cut {money(emergencyBridge.pausedTotal)}/mo → that&apos;s about{" "}
              {emergencyBridge.monthsFaster.toFixed(1)} months faster toward a
              typical emergency-fund gap
              {emergencyBridge.gap > 0
                ? ` (${money(emergencyBridge.gap)} remaining at default assumptions)`
                : ""}
              .
            </p>
          ) : null}

          <Link
            href={getToolHref("emergency-fund-target-calculator")}
            className="mt-4 inline-flex rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[#041018]"
          >
            → Open emergency fund calculator
          </Link>
        </section>
      ) : null}

      {showTipShare ? (
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-bold">
            Share this bill split
          </h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Copy a summary with a scenario link so everyone opens the same
            numbers.
          </p>
          <p className="mt-3 text-sm">
            {result.primary.label}: <strong>{result.primary.value}</strong>
          </p>
          <button
            type="button"
            onClick={copyTipShare}
            className="mt-4 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[#041018]"
          >
            Copy split + link
          </button>
          {status ? (
            <p className="mt-2 text-xs text-[var(--accent)]">{status}</p>
          ) : null}
        </section>
      ) : null}

      {calculator.formulaType === "latteFactor" ? (
        <p className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm">
          Redirect this habit spend into savings:{" "}
          <Link
            href={getToolHref("emergency-fund-target-calculator")}
            className="font-semibold text-[var(--accent)]"
          >
            emergency fund target →
          </Link>
        </p>
      ) : null}
    </div>
  );
}
