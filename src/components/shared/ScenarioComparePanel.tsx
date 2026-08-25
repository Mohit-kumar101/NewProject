"use client";

import { useMemo, useState } from "react";
import type { Calculator, CalcResult } from "@/lib/types";
import { runCalculation } from "@/lib/formulas";
import { buildScenarioUrl, copyText } from "@/lib/scenarioLinks";

type ScenarioSnap = {
  name: string;
  values: Record<string, number>;
  result: CalcResult;
};

function parsePrimaryNumber(result: CalcResult): number | null {
  const raw = result.primary.value.replace(/[^0-9.+-eE]/g, "");
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

/**
 * Capture two input snapshots and compare primary outcomes side-by-side.
 */
export function ScenarioComparePanel({
  calculator,
  values,
}: {
  calculator: Calculator;
  values: Record<string, number>;
}) {
  const [a, setA] = useState<ScenarioSnap | null>(null);
  const [b, setB] = useState<ScenarioSnap | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const delta = useMemo(() => {
    if (!a || !b) return null;
    const na = parsePrimaryNumber(a.result);
    const nb = parsePrimaryNumber(b.result);
    if (na == null || nb == null) return null;
    return nb - na;
  }, [a, b]);

  const capture = (slot: "a" | "b") => {
    const result = runCalculation(calculator.formulaType, values);
    const snap: ScenarioSnap = {
      name: slot === "a" ? "Scenario A" : "Scenario B",
      values: { ...values },
      result,
    };
    if (slot === "a") setA(snap);
    else setB(snap);
    setStatus(`Saved ${snap.name} from current inputs`);
  };

  const swap = () => {
    setA(b);
    setB(a);
    setStatus("Swapped A and B");
  };

  const copyActive = async (snap: ScenarioSnap | null) => {
    if (!snap) {
      setStatus("Capture a scenario first");
      return;
    }
    const ok = await copyText(buildScenarioUrl(snap.values));
    setStatus(ok ? `${snap.name} link copied` : "Copy failed");
  };

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
      <p className="text-xs font-semibold tracking-[0.16em] text-[var(--accent)] uppercase">
        Scenario studio
      </p>
      <h2 className="mt-1 font-[family-name:var(--font-display)] text-lg font-bold">
        Compare A vs B
      </h2>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Capture two sets of inputs on this device, then see which outcome wins.
        Share either scenario with a link.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => capture("a")}
          className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs font-semibold transition hover:border-[var(--accent)] sm:text-sm"
        >
          Set as A
        </button>
        <button
          type="button"
          onClick={() => capture("b")}
          className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs font-semibold transition hover:border-[var(--accent)] sm:text-sm"
        >
          Set as B
        </button>
        <button
          type="button"
          onClick={swap}
          disabled={!a && !b}
          className="rounded-xl border border-[var(--border)] px-3 py-2 text-xs font-semibold text-[var(--muted)] transition hover:border-[var(--accent)] disabled:opacity-40 sm:text-sm"
        >
          Swap
        </button>
        <button
          type="button"
          onClick={() => copyActive(a)}
          disabled={!a}
          className="rounded-xl bg-[var(--accent)] px-3 py-2 text-xs font-semibold text-[#041018] transition hover:opacity-90 disabled:opacity-40 sm:text-sm"
        >
          Copy A link
        </button>
        <button
          type="button"
          onClick={() => copyActive(b)}
          disabled={!b}
          className="rounded-xl border border-[var(--border)] px-3 py-2 text-xs font-semibold transition hover:border-[var(--accent)] disabled:opacity-40 sm:text-sm"
        >
          Copy B link
        </button>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {[a, b].map((snap, i) => (
          <div
            key={i === 0 ? "a" : "b"}
            className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3"
          >
            <p className="text-[11px] font-semibold tracking-[0.12em] text-[var(--muted)] uppercase">
              {i === 0 ? "Scenario A" : "Scenario B"}
            </p>
            {snap ? (
              <>
                <p className="mt-2 text-xl font-bold text-[var(--foreground)]">
                  {snap.result.primary.value}
                </p>
                <p className="mt-0.5 text-xs text-[var(--muted)]">
                  {snap.result.primary.label}
                </p>
                {snap.result.secondary.slice(0, 2).map((row) => (
                  <p
                    key={row.label}
                    className="mt-1 text-xs text-[var(--muted)]"
                  >
                    {row.label}:{" "}
                    <span className="font-medium text-[var(--foreground)]">
                      {row.value}
                    </span>
                  </p>
                ))}
              </>
            ) : (
              <p className="mt-2 text-sm text-[var(--muted)]">
                Adjust inputs, then capture this slot.
              </p>
            )}
          </div>
        ))}
      </div>

      {delta != null && a && b ? (
        <p className="mt-4 text-sm text-[var(--muted)]">
          B − A on primary:{" "}
          <span className="font-semibold text-[var(--accent)]">
            {delta > 0 ? "+" : ""}
            {delta.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </span>{" "}
          (same unit as the primary result when numeric)
        </p>
      ) : null}

      {status ? (
        <p className="mt-2 text-xs font-medium text-[var(--accent)]">{status}</p>
      ) : null}
    </section>
  );
}
