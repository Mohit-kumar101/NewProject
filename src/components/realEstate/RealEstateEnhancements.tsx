"use client";

import { useState } from "react";
import Link from "next/link";
import type { CalcResult, Calculator } from "@/lib/types";
import { getToolHref } from "@/lib/cryptoFormulas";
import { buildScenarioUrl, copyText } from "@/lib/scenarioLinks";
import {
  loadHomeScenarios,
  saveHomeScenario,
  type HomeScenario,
} from "@/lib/toolPersistence";
import { StrategicInsightsPanel } from "@/components/strategic/StrategicInsightsPanel";
import { parseMoneyish } from "@/lib/investingEnhancements";

export function RealEstateEnhancements({
  calculator,
  values,
  result,
  onLoadScenario,
}: {
  calculator: Calculator;
  values: Record<string, number>;
  result: CalcResult;
  onLoadScenario?: (values: Record<string, number>) => void;
}) {
  const [name, setName] = useState("Home scenario");
  const [saved, setSaved] = useState<HomeScenario[]>(() => loadHomeScenarios());
  const [status, setStatus] = useState<string | null>(null);

  if (calculator.formulaType === "monthlyMortgage") {
    return null; // already has dedicated workspace
  }

  const primaryMoney = parseMoneyish(result.primary.value);
  const years = values.years ?? values.termYears ?? 30;
  const monthlyProxy =
    values.monthlyRent ??
    values.mortgagePayment ??
    values.monthlyContribution ??
    (Number.isFinite(primaryMoney) ? primaryMoney * 0.005 : 0);

  const save = () => {
    const list = saveHomeScenario({
      name: name.trim() || "Home scenario",
      toolSlug: calculator.slug,
      values,
      primary: `${result.primary.label}: ${result.primary.value}`,
    });
    setSaved(list);
    setStatus("Home scenario saved on this device");
  };

  const copyLink = async () => {
    const ok = await copyText(buildScenarioUrl(values));
    setStatus(ok ? "Scenario link copied" : "Copy failed");
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
        <p className="text-xs font-semibold tracking-[0.16em] text-[var(--accent)] uppercase">
          House-hunt studio
        </p>
        <h2 className="mt-1 font-[family-name:var(--font-display)] text-lg font-bold">
          Save this home scenario
        </h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Compare listings across visits. Scenarios stay on this device — no
          account required.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. 123 Oak St"
            className="min-w-[180px] flex-1 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
          />
          <button
            type="button"
            onClick={save}
            className="rounded-xl bg-[var(--accent)] px-3.5 py-2 text-sm font-semibold text-[#041018]"
          >
            Save scenario
          </button>
          <button
            type="button"
            onClick={copyLink}
            className="rounded-xl border border-[var(--border)] px-3.5 py-2 text-sm font-semibold"
          >
            Copy link
          </button>
        </div>
        {status ? (
          <p className="mt-2 text-xs text-[var(--accent)]">{status}</p>
        ) : null}

        {saved.length > 0 ? (
          <ul className="mt-4 space-y-2 border-t border-[var(--border)] pt-4">
            {saved.slice(0, 6).map((s) => (
              <li
                key={s.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
              >
                <span>
                  <strong>{s.name}</strong>
                  <span className="text-[var(--muted)]"> — {s.primary}</span>
                </span>
                {onLoadScenario && s.toolSlug === calculator.slug ? (
                  <button
                    type="button"
                    className="text-xs font-semibold text-[var(--accent)]"
                    onClick={() => onLoadScenario(s.values)}
                  >
                    Load
                  </button>
                ) : (
                  <Link
                    href={getToolHref(s.toolSlug)}
                    className="text-xs font-semibold text-[var(--accent)]"
                  >
                    Open tool
                  </Link>
                )}
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      <StrategicInsightsPanel
        config={{
          monthlyPayment: Math.max(0, monthlyProxy),
          inflationNominal: Number.isFinite(primaryMoney)
            ? primaryMoney
            : undefined,
          inflationYears: Math.max(1, years),
          inflationLabel: result.primary.label,
          showPartner: true,
        }}
      />

      <section className="grid gap-3">
        <Link
          href={getToolHref("compound-interest-calculator")}
          className="rounded-xl border border-[color-mix(in_srgb,var(--accent)_35%,var(--border))] bg-[color-mix(in_srgb,var(--accent)_12%,var(--background))] px-4 py-3.5 text-sm font-semibold transition hover:text-[var(--accent)]"
        >
          → Invest leftover cash (compound interest)
        </Link>
        <Link
          href={getToolHref("monthly-mortgage-payment-calculator")}
          className="rounded-xl border border-[color-mix(in_srgb,var(--accent)_35%,var(--border))] bg-[color-mix(in_srgb,var(--accent)_12%,var(--background))] px-4 py-3.5 text-sm font-semibold transition hover:text-[var(--accent)]"
        >
          → Refine monthly mortgage / PITI
        </Link>
        <Link
          href={getToolHref("investment-management-fee-impact-calculator")}
          className="rounded-xl border border-[color-mix(in_srgb,var(--accent)_35%,var(--border))] bg-[color-mix(in_srgb,var(--accent)_12%,var(--background))] px-4 py-3.5 text-sm font-semibold transition hover:text-[var(--accent)]"
        >
          → Compare fee drag vs housing costs
        </Link>
      </section>
    </div>
  );
}
