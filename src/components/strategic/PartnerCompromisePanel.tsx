"use client";

import { useMemo, useState } from "react";
import {
  computePartnerCompromise,
  formatStrategicMoney,
} from "@/lib/strategicInsights";

export function PartnerCompromisePanel({
  targetPayment,
}: {
  targetPayment: number;
}) {
  const [open, setOpen] = useState(false);
  const [ceilingA, setCeilingA] = useState(0);
  const [ceilingB, setCeilingB] = useState(0);

  const result = useMemo(
    () =>
      computePartnerCompromise({
        ceilingA,
        ceilingB,
        targetPayment,
      }),
    [ceilingA, ceilingB, targetPayment]
  );

  const hasInput = ceilingA > 0 || ceilingB > 0;

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-start justify-between gap-3 text-left"
        aria-expanded={open}
      >
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-[var(--accent)] uppercase">
            Strategic insight
          </p>
          <h3 className="mt-1 font-[family-name:var(--font-display)] text-lg font-bold tracking-tight">
            Partner compromise zone
          </h3>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Buying with a partner? Compare comfort ceilings and find overlap.
          </p>
        </div>
        <span
          className={`text-xl text-[var(--muted)] transition ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
          ▾
        </span>
      </button>

      {open && (
        <div className="mt-5 space-y-4 border-t border-[var(--border)] pt-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="partner-a"
                className="mb-1.5 block text-sm font-medium"
              >
                Partner A max comfortable payment ($/mo)
              </label>
              <input
                id="partner-a"
                type="number"
                min={0}
                step={50}
                value={ceilingA || ""}
                onChange={(e) =>
                  setCeilingA(Math.max(0, Number(e.target.value) || 0))
                }
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
              />
            </div>
            <div>
              <label
                htmlFor="partner-b"
                className="mb-1.5 block text-sm font-medium"
              >
                Partner B max comfortable payment ($/mo)
              </label>
              <input
                id="partner-b"
                type="number"
                min={0}
                step={50}
                value={ceilingB || ""}
                onChange={(e) =>
                  setCeilingB(Math.max(0, Number(e.target.value) || 0))
                }
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
              />
            </div>
          </div>

          {hasInput ? (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold tracking-[0.14em] text-[var(--accent)] uppercase">
                    Compromise score
                  </p>
                  <p className="mt-1 text-3xl font-bold">
                    {result.compromiseScore}
                    <span className="text-base font-medium text-[var(--muted)]">
                      /100
                    </span>
                  </p>
                </div>
                <div className="text-right text-sm">
                  <p className="text-[var(--muted)]">Sweet-spot zone</p>
                  <p className="font-semibold">
                    {formatStrategicMoney(result.sweetSpotMin)} –{" "}
                    {formatStrategicMoney(result.sweetSpotMax)}/mo
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                {result.verdict}
              </p>
              <p className="mt-2 text-xs text-[var(--muted)]">
                Current plan: {formatStrategicMoney(targetPayment)}/mo
                {result.bothComfortable
                  ? " — within joint comfort."
                  : " — review together."}
              </p>
            </div>
          ) : (
            <p className="text-sm text-[var(--muted)]">
              Enter each partner&apos;s monthly payment ceiling to compute overlap
              with your {formatStrategicMoney(targetPayment)}/mo target.
            </p>
          )}
        </div>
      )}
    </section>
  );
}
