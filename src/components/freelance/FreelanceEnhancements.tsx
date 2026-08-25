"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { CalcResult, Calculator } from "@/lib/types";
import { getToolHref } from "@/lib/cryptoFormulas";
import { copyText } from "@/lib/scenarioLinks";
import {
  loadRateCards,
  saveRateCards,
  type FreelanceRateCard,
} from "@/lib/toolPersistence";

function money(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(n) ? n : 0);
}

export function FreelanceEnhancements({
  calculator,
  values,
  result,
  onApplyRate,
}: {
  calculator: Calculator;
  values: Record<string, number>;
  result: CalcResult;
  onApplyRate?: (patch: Record<string, number>) => void;
}) {
  const [cards, setCards] = useState<FreelanceRateCard[]>(() => loadRateCards());
  const [name, setName] = useState("Client A");
  const [bufferPct, setBufferPct] = useState(25);
  const [hours, setHours] = useState(10);
  const [copied, setCopied] = useState(false);

  const baseRate = useMemo(() => {
    const fromPrimary = Number(
      String(result.primary.value).replace(/[^0-9.]/g, "")
    );
    if (
      calculator.formulaType === "freelanceHourlyRate" &&
      Number.isFinite(fromPrimary) &&
      fromPrimary > 0
    ) {
      return fromPrimary;
    }
    const hint =
      values.targetHourlyRate ?? values.hourlyRate ?? values.hourlyWage;
    if (typeof hint === "number" && Number.isFinite(hint) && hint > 0) {
      return hint;
    }
    return Number.isFinite(fromPrimary) && fromPrimary > 0 ? fromPrimary : 75;
  }, [calculator.formulaType, result.primary.value, values]);

  const quoted = baseRate * (1 + bufferPct / 100);
  const weekTotal = quoted * hours;

  const invoiceBlurb = `Invoice this week — ${name}: ${hours}h × ${money(quoted)}/hr (includes ${bufferPct}% tax/buffer) = ${money(weekTotal)}. Rate before buffer: ${money(baseRate)}/hr.`;

  const saveCard = () => {
    const card: FreelanceRateCard = {
      id: `${Date.now()}`,
      name: name.trim() || "Rate card",
      hourlyRate: quoted,
      taxBufferPct: bufferPct,
      hoursPerWeek: hours,
    };
    const next = [card, ...cards].slice(0, 8);
    setCards(next);
    saveRateCards(next);
  };

  const copyInvoice = async () => {
    const ok = await copyText(invoiceBlurb);
    setCopied(ok);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
        <p className="text-xs font-semibold tracking-[0.16em] text-[var(--accent)] uppercase">
          Quote builder
        </p>
        <h2 className="mt-1 font-[family-name:var(--font-display)] text-lg font-bold tracking-tight">
          Tax buffer & invoice this week
        </h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Add a tax/buffer pad on top of your calculated rate, save rate cards on
          this device, and copy a ready-to-send invoice line.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="text-[var(--muted)]">Client / card name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 outline-none focus:border-[var(--accent)]"
            />
          </label>
          <label className="block text-sm">
            <span className="text-[var(--muted)]">Hours this week</span>
            <input
              type="number"
              min={1}
              max={80}
              value={hours}
              onChange={(e) => setHours(Number(e.target.value) || 0)}
              className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 outline-none focus:border-[var(--accent)]"
            />
          </label>
        </div>

        <div className="mt-4">
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-[var(--muted)]">Tax / buffer (%)</span>
            <span className="font-semibold">{bufferPct}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={50}
            step={1}
            value={bufferPct}
            onChange={(e) => setBufferPct(Number(e.target.value))}
            className="range-input w-full"
          />
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-3">
            <p className="text-[11px] text-[var(--muted)] uppercase">Base rate</p>
            <p className="font-[family-name:var(--font-display)] text-xl font-bold">
              {money(baseRate)}/hr
            </p>
          </div>
          <div className="rounded-xl border border-[color-mix(in_srgb,var(--accent)_35%,var(--border))] bg-[color-mix(in_srgb,var(--accent)_8%,var(--background))] p-3">
            <p className="text-[11px] text-[var(--accent)] uppercase">Safe quote</p>
            <p className="font-[family-name:var(--font-display)] text-xl font-bold">
              {money(quoted)}/hr
            </p>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-3">
            <p className="text-[11px] text-[var(--muted)] uppercase">This week</p>
            <p className="font-[family-name:var(--font-display)] text-xl font-bold">
              {money(weekTotal)}
            </p>
          </div>
        </div>

        <p className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm leading-relaxed text-[var(--foreground)]">
          {invoiceBlurb}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={copyInvoice}
            className="rounded-xl bg-[var(--accent)] px-3.5 py-2 text-sm font-semibold text-[#041018]"
          >
            {copied ? "Copied ✓" : "Copy invoice line"}
          </button>
          <button
            type="button"
            onClick={saveCard}
            className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-2 text-sm font-semibold"
          >
            Save rate card
          </button>
        </div>

        {cards.length > 0 ? (
          <ul className="mt-5 space-y-2 border-t border-[var(--border)] pt-4">
            {cards.map((card) => (
              <li
                key={card.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
              >
                <span>
                  <strong>{card.name}</strong> · {money(card.hourlyRate)}/hr ·{" "}
                  {card.taxBufferPct}% buffer
                </span>
                {onApplyRate ? (
                  <button
                    type="button"
                    className="text-xs font-semibold text-[var(--accent)]"
                    onClick={() =>
                      onApplyRate({
                        targetAnnualIncome: card.hourlyRate * 1600,
                      })
                    }
                  >
                    Use as target hint
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      <section className="grid gap-3">
        <Link
          href={getToolHref("self-employment-tax-estimator")}
          className="rounded-xl border border-[color-mix(in_srgb,var(--accent)_35%,var(--border))] bg-[color-mix(in_srgb,var(--accent)_12%,var(--background))] px-4 py-3.5 text-sm font-semibold transition hover:text-[var(--accent)]"
        >
          → Estimate self-employment tax on this income
        </Link>
        <Link
          href={getToolHref("side-hustle-net-profit-calculator")}
          className="rounded-xl border border-[color-mix(in_srgb,var(--accent)_35%,var(--border))] bg-[color-mix(in_srgb,var(--accent)_12%,var(--background))] px-4 py-3.5 text-sm font-semibold transition hover:text-[var(--accent)]"
        >
          → Calculate side-hustle net profit
        </Link>
        <Link
          href={getToolHref("take-home-pay-net-income-calculator")}
          className="rounded-xl border border-[color-mix(in_srgb,var(--accent)_35%,var(--border))] bg-[color-mix(in_srgb,var(--accent)_12%,var(--background))] px-4 py-3.5 text-sm font-semibold transition hover:text-[var(--accent)]"
        >
          → Check take-home / net pay
        </Link>
      </section>
    </div>
  );
}
