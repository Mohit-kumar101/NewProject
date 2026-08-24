"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { SmartAdviceBox } from "@/components/SmartAdviceBox";
import { StrategicInsightsPanel } from "@/components/strategic/StrategicInsightsPanel";
import { DebtActionPlaybook } from "@/components/DebtActionPlaybook";
import { BalanceTrendChart } from "@/components/loans/BalanceTrendChart";
import type { Calculator } from "@/lib/types";
import type { AdviceItem } from "@/lib/types";
import { getToolHref } from "@/lib/cryptoFormulas";
import {
  EXTRA_PAYMENT_MAX,
  INITIAL_EMPTY_DEBT,
  SAMPLE_DEBTS,
  activeDebts,
  compareDebtStrategies,
  createDebtId,
  createEmptyDebt,
  formatDebtMoney,
  formatDebtMonths,
  loadDebtPayoffState,
  saveDebtPayoffState,
  totalBalances,
  totalMinPayments,
  type DebtEntry,
  type DebtStrategy,
} from "@/lib/debtPayoff";

function buildDebtAdvice(
  debts: DebtEntry[],
  preferred: DebtStrategy,
  comparison: ReturnType<typeof compareDebtStrategies> | null
): AdviceItem[] {
  if (activeDebts(debts).length === 0) {
    return [
      {
        tone: "info",
        badge: "Get started",
        title: "Add your debts to compare strategies",
        message:
          "Enter each balance, APR, and minimum payment—or load sample data. Avalanche and snowball results update instantly in your browser.",
      },
    ];
  }

  if (!comparison) return [];

  const advice: AdviceItem[] = [];
  const { avalanche, snowball } = comparison;

  if (avalanche.interestTrap || snowball.interestTrap) {
    advice.push({
      tone: "warning",
      badge: "Interest trap",
      title: "A minimum payment is below monthly interest",
      message:
        "At least one debt’s minimum doesn’t cover interest accruing each month, so the balance can grow. Raise that minimum or add extra payment before the plan can finish.",
    });
  }

  if (avalanche.unreachable || snowball.unreachable) {
    advice.push({
      tone: "warning",
      badge: "Unreachable",
      title: "Current payments can’t clear these debts in time",
      message:
        "Increase your extra monthly payment or minimums. The simulator stops after 50 years to avoid infinite loops.",
    });
  }

  const interestGap = snowball.totalInterest - avalanche.totalInterest;
  if (interestGap > 1) {
    advice.push({
      tone: preferred === "avalanche" ? "positive" : "caution",
      badge: "Interest math",
      title: `Avalanche saves ${formatDebtMoney(interestGap)} vs snowball`,
      message:
        preferred === "avalanche"
          ? "Highest-APR-first usually minimizes interest when rates differ. Stick with avalanche if consistency isn’t an issue."
          : "Snowball costs more interest here, but clearing small balances first can keep you motivated—pick the plan you’ll follow.",
    });
  } else if (Math.abs(interestGap) <= 1 && !avalanche.unreachable) {
    advice.push({
      tone: "info",
      badge: "Close call",
      title: "Avalanche and snowball finish nearly the same",
      message:
        "When APRs are similar, choose the method that feels easiest to stick with—results are almost identical.",
    });
  }

  if (
    comparison.snowballFirstWinSoonerMonths > 0 &&
    snowball.firstWinMonth != null
  ) {
    advice.push({
      tone: "info",
      badge: "First win",
      title: `Snowball’s first payoff is ${comparison.snowballFirstWinSoonerMonths} month${comparison.snowballFirstWinSoonerMonths === 1 ? "" : "s"} sooner`,
      message: `You’ll knock out a full account around month ${snowball.firstWinMonth} with snowball, which can reinforce the habit before the larger balances fall.`,
    });
  }

  if (comparison.interestSavedVsBaseline > 1) {
    advice.push({
      tone: "positive",
      badge: "Extra payment",
      title: `Your extra payment saves ${formatDebtMoney(comparison.interestSavedVsBaseline)}`,
      message: `Versus minimums only, you’re also ${comparison.monthsSavedVsBaseline} month${comparison.monthsSavedVsBaseline === 1 ? "" : "s"} closer to debt-free.`,
    });
  }

  return advice.slice(0, 3);
}

function StrategyCard({
  title,
  subtitle,
  result,
  emphasized,
}: {
  title: string;
  subtitle: string;
  result: ReturnType<typeof compareDebtStrategies>["avalanche"];
  emphasized: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 sm:p-6 ${
        emphasized
          ? "border-[var(--accent)] bg-[var(--surface)] shadow-[0_0_0_1px_color-mix(in_srgb,var(--accent)_35%,transparent)]"
          : "border-[var(--border)] bg-[var(--surface)]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.14em] text-[var(--accent)] uppercase">
            {emphasized ? "Focus strategy" : "Compare"}
          </p>
          <h3 className="mt-1 font-[family-name:var(--font-display)] text-xl font-bold tracking-tight">
            {title}
          </h3>
          <p className="mt-1 text-sm text-[var(--muted)]">{subtitle}</p>
        </div>
      </div>

      {result.unreachable ? (
        <p className="mt-5 text-sm font-medium text-[#b91c1c] dark:text-[#f87171]">
          Cannot reach debt-free with current payments
        </p>
      ) : (
        <>
          <p className="mt-5 text-sm text-[var(--muted)]">Debt-free in</p>
          <p className="result-glow mt-1 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight sm:text-3xl">
            {formatDebtMonths(result.months)}
          </p>
        </>
      )}

      <dl className="mt-6 space-y-3">
        <div className="flex items-start justify-between gap-3 border-t border-[var(--border)] pt-3">
          <dt className="text-sm text-[var(--muted)]">Total interest</dt>
          <dd className="text-right text-sm font-semibold">
            {formatDebtMoney(result.totalInterest)}
          </dd>
        </div>
        <div className="flex items-start justify-between gap-3 border-t border-[var(--border)] pt-3">
          <dt className="text-sm text-[var(--muted)]">Total paid</dt>
          <dd className="text-right text-sm font-semibold">
            {formatDebtMoney(result.totalPaid)}
          </dd>
        </div>
        <div className="flex items-start justify-between gap-3 border-t border-[var(--border)] pt-3">
          <dt className="text-sm text-[var(--muted)]">First debt cleared</dt>
          <dd className="text-right text-sm font-semibold">
            {result.firstWinMonth != null
              ? `Month ${result.firstWinMonth}`
              : "—"}
          </dd>
        </div>
        <div className="flex items-start justify-between gap-3 border-t border-[var(--border)] pt-3">
          <dt className="text-sm text-[var(--muted)]">Debts cleared</dt>
          <dd className="text-right text-sm font-semibold">
            {result.milestones.length}
          </dd>
        </div>
      </dl>
    </div>
  );
}

export function DebtPayoffWorkspace({
  calculator,
  related,
  preferredStrategy,
}: {
  calculator: Calculator;
  related: Calculator[];
  preferredStrategy: DebtStrategy;
}) {
  const [hydrated, setHydrated] = useState(false);
  const [debts, setDebts] = useState<DebtEntry[]>([INITIAL_EMPTY_DEBT]);
  const [extraPayment, setExtraPayment] = useState(200);

  useEffect(() => {
    const saved = loadDebtPayoffState();
    if (saved && saved.debts.length > 0) {
      setDebts(saved.debts);
      setExtraPayment(saved.extraPayment);
    }
    // Keep INITIAL_EMPTY_DEBT when nothing saved — avoids a second random-id flash.
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveDebtPayoffState({ debts, extraPayment });
  }, [debts, extraPayment, hydrated]);

  const comparison = useMemo(() => {
    if (activeDebts(debts).length === 0) return null;
    return compareDebtStrategies(debts, extraPayment, preferredStrategy);
  }, [debts, extraPayment, preferredStrategy]);

  const advice = useMemo(
    () => buildDebtAdvice(debts, preferredStrategy, comparison),
    [debts, preferredStrategy, comparison]
  );

  const preferredResult =
    preferredStrategy === "avalanche"
      ? comparison?.avalanche
      : comparison?.snowball;

  const whatIfLine = useMemo(() => {
    if (!comparison || !preferredResult || extraPayment <= 0) return null;
    if (preferredResult.unreachable || comparison.baseline.unreachable) {
      return null;
    }
    const months = comparison.monthsSavedVsBaseline;
    const interest = comparison.interestSavedVsBaseline;
    if (months <= 0 && interest <= 0) return null;
    return `Adding ${formatDebtMoney(extraPayment)}/mo shaves ${months} month${months === 1 ? "" : "s"} off your timeline and saves ${formatDebtMoney(interest)} in interest!`;
  }, [comparison, preferredResult, extraPayment]);

  const clashLine = useMemo(() => {
    if (!comparison) return null;
    const { avalanche, snowball, snowballFirstWinSoonerMonths } = comparison;
    if (avalanche.unreachable && snowball.unreachable) return null;

    const interestSaved = snowball.totalInterest - avalanche.totalInterest;
    const absInterest = Math.abs(interestSaved);

    if (interestSaved > 1 && snowballFirstWinSoonerMonths > 0) {
      return `Avalanche saves you ${formatDebtMoney(interestSaved)} in interest, but Snowball gives you your first psychological win ${snowballFirstWinSoonerMonths} month${snowballFirstWinSoonerMonths === 1 ? "" : "s"} sooner.`;
    }
    if (interestSaved > 1) {
      return `Avalanche saves you ${formatDebtMoney(interestSaved)} in interest versus Snowball—mathematically the leaner path.`;
    }
    if (interestSaved < -1) {
      return `With these inputs, Snowball actually costs ${formatDebtMoney(absInterest)} less interest (unusual—check rates and minimums).`;
    }
    if (snowballFirstWinSoonerMonths > 0) {
      return `Interest ends up nearly identical. Snowball still delivers your first cleared account ${snowballFirstWinSoonerMonths} month${snowballFirstWinSoonerMonths === 1 ? "" : "s"} sooner.`;
    }
    return `Avalanche and Snowball finish in lockstep here—choose the story you’ll stick with.`;
  }, [comparison]);

  const updateDebt = (
    id: string,
    patch: Partial<Omit<DebtEntry, "id">>
  ) => {
    setDebts((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        const next = { ...d, ...patch };
        if (typeof patch.balance === "number") {
          next.balance = Math.max(0, patch.balance);
        }
        if (typeof patch.apr === "number") {
          next.apr = Math.max(0, Math.min(99.99, patch.apr));
        }
        if (typeof patch.minPayment === "number") {
          next.minPayment = Math.max(0, patch.minPayment);
        }
        return next;
      })
    );
  };

  const addDebt = () => {
    setDebts((prev) => [...prev, createEmptyDebt()]);
  };

  const removeDebt = (id: string) => {
    setDebts((prev) => {
      const next = prev.filter((d) => d.id !== id);
      return next.length > 0 ? next : [createEmptyDebt()];
    });
  };

  const loadSample = () => {
    setDebts(
      SAMPLE_DEBTS.map((d) => ({
        ...d,
        id: createDebtId(),
      }))
    );
    setExtraPayment(200);
  };

  const clearAll = () => {
    if (
      activeDebts(debts).length > 0 &&
      typeof window !== "undefined" &&
      !window.confirm("Clear all debts from this browser?")
    ) {
      return;
    }
    setDebts([createEmptyDebt()]);
    setExtraPayment(0);
  };

  const balanceTotal = totalBalances(debts);
  const minsTotal = totalMinPayments(debts);
  const scheduleValues =
    preferredResult?.schedule.map((s) => s.remainingBalance) ?? [];

  const weightedApr = useMemo(() => {
    const list = activeDebts(debts);
    if (list.length === 0 || balanceTotal <= 0) return 0;
    return (
      list.reduce((sum, d) => sum + d.balance * d.apr, 0) / balanceTotal
    );
  }, [debts, balanceTotal]);

  const planMonthly = minsTotal + extraPayment;

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5">
          <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-[#00E5FF33] to-[#2979FF22] blur-2xl" />
          <p className="text-[11px] font-semibold tracking-[0.14em] text-[var(--accent)] uppercase">
            Total balances
          </p>
          <p className="relative mt-2 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight sm:text-3xl">
            {hydrated ? formatDebtMoney(balanceTotal) : "—"}
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5">
          <p className="text-[11px] font-semibold tracking-[0.14em] text-[var(--accent)] uppercase">
            Min. payments / mo
          </p>
          <p className="mt-2 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight sm:text-3xl">
            {hydrated ? formatDebtMoney(minsTotal) : "—"}
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5">
          <p className="text-[11px] font-semibold tracking-[0.14em] text-[var(--accent)] uppercase">
            Plan total / mo
          </p>
          <p className="mt-2 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight sm:text-3xl">
            {hydrated ? formatDebtMoney(minsTotal + extraPayment) : "—"}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              Your debts
            </h2>
            <p className="mt-1 text-sm text-[color-mix(in_srgb,var(--foreground)_72%,var(--muted))]">
              Saved locally in this browser—no account required. Results update
              as you type.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={loadSample}
              className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs font-semibold transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Load sample data
            </button>
            <button
              type="button"
              onClick={clearAll}
              className="rounded-xl border border-[var(--border)] px-3 py-2 text-xs font-semibold text-[var(--muted)] transition hover:border-[#ef4444] hover:text-[#ef4444]"
            >
              Clear all
            </button>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          {debts.map((debt, index) => (
            <div
              key={debt.id}
              className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <p className="text-xs font-semibold tracking-[0.12em] text-[var(--muted)] uppercase">
                  Debt {index + 1}
                </p>
                <button
                  type="button"
                  onClick={() => removeDebt(debt.id)}
                  className="text-xs font-medium text-[var(--muted)] transition hover:text-[#ef4444]"
                  aria-label={`Remove debt ${index + 1}`}
                >
                  Remove
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="sm:col-span-2 lg:col-span-1">
                  <label
                    htmlFor={`${debt.id}-name`}
                    className="mb-1.5 block text-sm font-medium"
                  >
                    Debt name
                  </label>
                  <input
                    id={`${debt.id}-name`}
                    value={debt.name}
                    onChange={(e) =>
                      updateDebt(debt.id, { name: e.target.value })
                    }
                    placeholder="e.g. Chase Credit Card"
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
                  />
                </div>
                <div>
                  <label
                    htmlFor={`${debt.id}-balance`}
                    className="mb-1.5 block text-sm font-medium"
                  >
                    Balance ($)
                  </label>
                  <input
                    id={`${debt.id}-balance`}
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step={50}
                    value={debt.balance || ""}
                    onChange={(e) =>
                      updateDebt(debt.id, {
                        balance: Number(e.target.value) || 0,
                      })
                    }
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
                  />
                </div>
                <div>
                  <label
                    htmlFor={`${debt.id}-apr`}
                    className="mb-1.5 block text-sm font-medium"
                  >
                    APR (%)
                  </label>
                  <input
                    id={`${debt.id}-apr`}
                    type="number"
                    inputMode="decimal"
                    min={0}
                    max={99.99}
                    step={0.1}
                    value={debt.apr || ""}
                    onChange={(e) =>
                      updateDebt(debt.id, {
                        apr: Number(e.target.value) || 0,
                      })
                    }
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
                  />
                </div>
                <div>
                  <label
                    htmlFor={`${debt.id}-min`}
                    className="mb-1.5 block text-sm font-medium"
                  >
                    Min. payment ($)
                  </label>
                  <input
                    id={`${debt.id}-min`}
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step={5}
                    value={debt.minPayment || ""}
                    onChange={(e) =>
                      updateDebt(debt.id, {
                        minPayment: Number(e.target.value) || 0,
                      })
                    }
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addDebt}
          className="mt-4 w-full rounded-xl border border-dashed border-[var(--border)] px-4 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          + Add another debt
        </button>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Extra monthly payment</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              What-if slider — watch payoff time and interest update live.
            </p>
          </div>
          <p className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-[var(--accent)]">
            {formatDebtMoney(extraPayment)}
            <span className="text-sm font-medium text-[var(--muted)]">/mo</span>
          </p>
        </div>

        <input
          type="range"
          min={0}
          max={EXTRA_PAYMENT_MAX}
          step={25}
          value={extraPayment}
          onChange={(e) => setExtraPayment(Number(e.target.value))}
          className="range-input mt-5 w-full"
          aria-label="Extra monthly payment"
        />
        <div className="mt-1 flex justify-between text-[11px] text-[var(--muted)]">
          <span>$0</span>
          <span>${EXTRA_PAYMENT_MAX.toLocaleString()}</span>
        </div>

        {whatIfLine && (
          <p
            className="mt-5 rounded-xl border border-[color-mix(in_srgb,var(--accent)_35%,var(--border))] bg-[color-mix(in_srgb,var(--accent)_8%,var(--background))] px-4 py-3 text-sm leading-relaxed text-[var(--foreground)]"
            aria-live="polite"
          >
            {whatIfLine}
          </p>
        )}

        {preferredResult && scheduleValues.length > 1 && (
          <BalanceTrendChart
            values={scheduleValues}
            label={`${preferredStrategy === "avalanche" ? "Avalanche" : "Snowball"} remaining balance`}
            className="mt-5"
          />
        )}
      </div>

      {comparison && (
        <div className="grid gap-4 lg:grid-cols-2">
          <StrategyCard
            title="Debt Avalanche"
            subtitle="Highest APR first — minimize interest"
            result={comparison.avalanche}
            emphasized={preferredStrategy === "avalanche"}
          />
          <StrategyCard
            title="Debt Snowball"
            subtitle="Smallest balance first — fastest wins"
            result={comparison.snowball}
            emphasized={preferredStrategy === "snowball"}
          />
        </div>
      )}

      {clashLine && (
        <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
          <div className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-gradient-to-br from-[#2979FF33] to-transparent blur-2xl" />
          <p className="text-xs font-semibold tracking-[0.16em] text-[var(--accent)] uppercase">
            Behavioral vs mathematical clash
          </p>
          <p className="relative mt-3 font-[family-name:var(--font-display)] text-lg font-semibold leading-snug tracking-tight sm:text-xl">
            {clashLine}
          </p>
          {comparison &&
            comparison.avalanche.milestones.length > 0 &&
            !comparison.avalanche.unreachable && (
              <div className="relative mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-3">
                  <p className="text-[11px] font-semibold tracking-wide text-[var(--muted)] uppercase">
                    Avalanche payoff order
                  </p>
                  <ol className="mt-2 space-y-1.5 text-sm">
                    {comparison.avalanche.milestones.map((m) => (
                      <li key={`a-${m.debtId}`}>
                        <span className="text-[var(--muted)]">
                          Mo {m.month}:
                        </span>{" "}
                        {m.debtName}
                      </li>
                    ))}
                  </ol>
                </div>
                <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-3">
                  <p className="text-[11px] font-semibold tracking-wide text-[var(--muted)] uppercase">
                    Snowball payoff order
                  </p>
                  <ol className="mt-2 space-y-1.5 text-sm">
                    {comparison.snowball.milestones.map((m) => (
                      <li key={`s-${m.debtId}`}>
                        <span className="text-[var(--muted)]">
                          Mo {m.month}:
                        </span>{" "}
                        {m.debtName}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            )}
        </div>
      )}

      <StrategicInsightsPanel
        config={{
          monthlyPayment: planMonthly,
          comparePayment: minsTotal > 0 ? minsTotal : undefined,
          principal: balanceTotal,
          annualRate: weightedApr,
          termMonths: Math.max(1, preferredResult?.months ?? 60),
          inflationNominal: balanceTotal,
          inflationYears: Math.max(
            1,
            Math.round((preferredResult?.months ?? 60) / 12)
          ),
          inflationLabel: "Debt cleared (nominal balance)",
          defaultLiquidReserve: planMonthly * 3,
          showPartner: true,
        }}
      />

      <SmartAdviceBox items={advice} />

      <DebtActionPlaybook
        debts={debts}
        extraPayment={extraPayment}
        strategy={preferredStrategy}
        result={preferredResult}
      />

      <aside className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5">
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <h2 className="text-xs font-semibold tracking-[0.14em] text-[var(--accent)] uppercase sm:text-sm">
            Related tools
          </h2>
          <p className="text-[11px] text-[var(--muted)]">{calculator.category}</p>
        </div>
        <ul className="grid gap-2 sm:grid-cols-2">
          {related.map((tool) => (
            <li key={tool.slug}>
              <Link
                href={getToolHref(tool.slug)}
                className="block rounded-xl border border-transparent px-3 py-2.5 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--border)] hover:bg-[var(--background)] hover:text-[var(--accent)]"
              >
                {tool.title}
              </Link>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
