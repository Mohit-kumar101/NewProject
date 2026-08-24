"use client";

import { useEffect, useMemo, useState } from "react";
import type { Calculator } from "@/lib/types";
import { SmartAdviceBox } from "@/components/SmartAdviceBox";
import type { AdviceItem } from "@/lib/types";
import {
  LoanExportBar,
  LoanMetricCards,
  LoanNumberField,
  LoanRelatedTools,
  LoanScheduleTable,
  LoanSparkline,
  LoanWhatIfBanner,
  LoanWorkspaceFrame,
} from "@/components/loans/LoanUi";
import {
  amortizeLoan,
  comparePersonalOffers,
  formatLoanMoney,
  formatLoanMonths,
  loadLoanToolState,
  saveLoanToolState,
  schedulePreview,
  simulateBalloon,
  simulateBiWeekly,
  simulateCreditCardPayoff,
  simulateHomeEquity,
  simulateRefinance,
} from "@/lib/loanTools";

const LOAN_FORMULA_TYPES = new Set([
  "carLoanPayoff",
  "studentLoanPayoff",
  "personalLoan",
  "creditCardMinimum",
  "loanRefinance",
  "homeEquityLoan",
  "biWeeklyMortgage",
  "balloonLoan",
]);

export function isLoansDebtCategoryFormula(formulaType: string): boolean {
  return LOAN_FORMULA_TYPES.has(formulaType);
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function defaultsFromCalculator(calculator: Calculator): Record<string, number> {
  return Object.fromEntries(
    calculator.inputs.map((input) => [input.id, input.defaultValue])
  );
}

function usePersistedLoanValues(calculator: Calculator) {
  const [hydrated, setHydrated] = useState(false);
  const [values, setValues] = useState<Record<string, number>>(() =>
    defaultsFromCalculator(calculator)
  );

  useEffect(() => {
    const saved = loadLoanToolState(calculator.formulaType);
    if (saved) {
      setValues((prev) => ({ ...prev, ...saved }));
    } else {
      setValues(defaultsFromCalculator(calculator));
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset only when tool changes
  }, [calculator.formulaType, calculator.slug]);

  useEffect(() => {
    if (!hydrated) return;
    saveLoanToolState(calculator.formulaType, values);
  }, [values, hydrated, calculator.formulaType]);

  const set = (id: string, raw: number) => {
    setValues((prev) => ({ ...prev, [id]: Number.isFinite(raw) ? raw : prev[id] }));
  };

  const reset = () => setValues(defaultsFromCalculator(calculator));

  return { values, set, reset, hydrated };
}

function fieldMeta(calculator: Calculator, id: string) {
  return calculator.inputs.find((i) => i.id === id);
}

function StandardLoanFields({
  calculator,
  values,
  set,
  ids,
}: {
  calculator: Calculator;
  values: Record<string, number>;
  set: (id: string, n: number) => void;
  ids: string[];
}) {
  return (
    <div className="space-y-6">
      {ids.map((id) => {
        const meta = fieldMeta(calculator, id);
        if (!meta) return null;
        return (
          <LoanNumberField
            key={id}
            id={id}
            label={meta.label}
            value={values[id] ?? meta.defaultValue}
            min={meta.min}
            max={meta.max}
            step={meta.step}
            onChange={(n) => set(id, n)}
          />
        );
      })}
    </div>
  );
}

/* ─── Car / Student (amortize + extra) ───────────────────────── */

function AmortExtraWorkspace({
  calculator,
  related,
  kind,
}: {
  calculator: Calculator;
  related: Calculator[];
  kind: "car" | "student";
}) {
  const { values, set, reset, hydrated } = usePersistedLoanValues(calculator);
  const principal = values.principal ?? 0;
  const annualRate = values.annualRate ?? 0;
  const termMonths = values.termMonths ?? 60;
  const extraPayment = values.extraPayment ?? 0;

  const baseline = useMemo(
    () =>
      amortizeLoan({
        principal,
        annualRate,
        termMonths,
        extraPayment: 0,
      }),
    [principal, annualRate, termMonths]
  );
  const withExtra = useMemo(
    () =>
      amortizeLoan({
        principal,
        annualRate,
        termMonths,
        extraPayment,
      }),
    [principal, annualRate, termMonths, extraPayment]
  );

  const whatIf =
    extraPayment > 0 && !withExtra.unreachable && !baseline.unreachable
      ? `Adding ${formatLoanMoney(extraPayment)}/mo shaves ${Math.max(0, baseline.months - withExtra.months)} months off your timeline and saves ${formatLoanMoney(Math.max(0, baseline.interest - withExtra.interest))} in interest!`
      : null;

  const advice: AdviceItem[] = [];
  if (withExtra.unreachable) {
    advice.push({
      tone: "warning",
      badge: "Payment too low",
      title: "This payment can’t cover interest",
      message: "Raise the payment or lower the rate — otherwise the balance never shrinks.",
    });
  } else if (extraPayment > 0) {
    advice.push({
      tone: "positive",
      badge: "Accelerating",
      title: "Extra payments are working",
      message: `You’re on track to finish in ${formatLoanMonths(withExtra.months)} instead of ${formatLoanMonths(baseline.months)}.`,
    });
  } else {
    advice.push({
      tone: "info",
      badge: "Tip",
      title: "Try a small extra payment",
      message: "Even $50–$100/mo often cuts years of interest on long auto or student loans.",
    });
  }

  const title =
    kind === "car" ? "Car loan payoff studio" : "Student loan payoff studio";

  return (
    <LoanWorkspaceFrame
      title={title}
      blurb="Saved in this browser. Slide extra payments to see live payoff savings — then export a PDF summary."
    >
      <LoanMetricCards
        items={[
          {
            label: "Base payment",
            value: hydrated ? formatLoanMoney(withExtra.basePayment) : "—",
            accent: true,
          },
          {
            label: "Payoff time",
            value: hydrated
              ? withExtra.unreachable
                ? "Unreachable"
                : formatLoanMonths(withExtra.months)
              : "—",
          },
          {
            label: "Total interest",
            value: hydrated ? formatLoanMoney(withExtra.interest) : "—",
          },
          {
            label: "Total paid",
            value: hydrated ? formatLoanMoney(withExtra.totalPaid) : "—",
          },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold">Inputs</h3>
            <button
              type="button"
              onClick={reset}
              className="text-xs font-semibold text-[var(--muted)] hover:text-[var(--accent)]"
            >
              Reset
            </button>
          </div>
          <StandardLoanFields
            calculator={calculator}
            values={values}
            set={set}
            ids={["principal", "annualRate", "termMonths", "extraPayment"]}
          />
          <div className="mt-5">
            <LoanWhatIfBanner text={whatIf} />
            <LoanSparkline
              values={withExtra.balanceSeries}
              label="Remaining balance"
            />
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
          <h3 className="text-lg font-semibold">Plan summary</h3>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-3 border-t border-[var(--border)] pt-3">
              <dt className="text-[var(--muted)]">Without extra</dt>
              <dd className="font-semibold">
                {formatLoanMonths(baseline.months)} ·{" "}
                {formatLoanMoney(baseline.interest)} interest
              </dd>
            </div>
            <div className="flex justify-between gap-3 border-t border-[var(--border)] pt-3">
              <dt className="text-[var(--muted)]">With extra</dt>
              <dd className="font-semibold">
                {formatLoanMonths(withExtra.months)} ·{" "}
                {formatLoanMoney(withExtra.interest)} interest
              </dd>
            </div>
          </dl>
          <LoanExportBar
            title={calculator.title}
            filenameBase={calculator.slug}
            lines={[
              `Principal: ${formatLoanMoney(principal)}`,
              `APR: ${annualRate}%`,
              `Term: ${termMonths} months`,
              `Extra / mo: ${formatLoanMoney(extraPayment)}`,
              `Base payment: ${formatLoanMoney(withExtra.basePayment)}`,
              `Payoff: ${formatLoanMonths(withExtra.months)}`,
              `Interest: ${formatLoanMoney(withExtra.interest)}`,
              `Total paid: ${formatLoanMoney(withExtra.totalPaid)}`,
              whatIf ?? "",
            ]}
          />
        </div>
      </div>

      <LoanScheduleTable rows={schedulePreview(withExtra.schedule)} />
      <SmartAdviceBox items={advice} />
      <LoanRelatedTools calculator={calculator} related={related} />
    </LoanWorkspaceFrame>
  );
}

/* ─── Personal loan (compare offers) ─────────────────────────── */

function PersonalLoanWorkspace({
  calculator,
  related,
}: {
  calculator: Calculator;
  related: Calculator[];
}) {
  const { values, set, reset, hydrated } = usePersistedLoanValues(calculator);
  const [offerB, setOfferB] = useState({
    annualRate: 14.9,
    termMonths: 48,
    fees: 150,
  });

  const principal = values.principal ?? 10000;
  const rateA = values.annualRate ?? 11.5;
  const termA = values.termMonths ?? 36;
  const extra = values.extraPayment ?? 0;

  // Ensure extraPayment exists in state bag even if JSON defaults lack it
  useEffect(() => {
    if (values.extraPayment == null) set("extraPayment", 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const compared = useMemo(
    () =>
      comparePersonalOffers([
        {
          id: "a",
          label: "Offer A",
          principal,
          annualRate: rateA,
          termMonths: termA,
          fees: 0,
        },
        {
          id: "b",
          label: "Offer B",
          principal,
          annualRate: offerB.annualRate,
          termMonths: offerB.termMonths,
          fees: offerB.fees,
        },
      ]),
    [principal, rateA, termA, offerB]
  );
  const primary = useMemo(
    () =>
      amortizeLoan({
        principal,
        annualRate: rateA,
        termMonths: termA,
        extraPayment: extra,
      }),
    [principal, rateA, termA, extra]
  );
  const baseline = useMemo(
    () =>
      amortizeLoan({
        principal,
        annualRate: rateA,
        termMonths: termA,
        extraPayment: 0,
      }),
    [principal, rateA, termA]
  );

  const whatIf =
    extra > 0 && !primary.unreachable
      ? `Adding ${formatLoanMoney(extra)}/mo saves ${formatLoanMoney(Math.max(0, baseline.interest - primary.interest))} and finishes ${Math.max(0, baseline.months - primary.months)} months sooner.`
      : null;

  const winner = compared[0];

  return (
    <LoanWorkspaceFrame
      title="Personal loan comparison studio"
      blurb="Compare two offers on total cost, then stress-test Offer A with extra payments. Autosaved locally."
    >
      <LoanMetricCards
        items={[
          {
            label: "Offer A payment",
            value: hydrated ? formatLoanMoney(primary.basePayment) : "—",
            accent: true,
          },
          {
            label: "Payoff (w/ extra)",
            value: hydrated
              ? primary.unreachable
                ? "Unreachable"
                : formatLoanMonths(primary.months)
              : "—",
          },
          {
            label: "Best total cost",
            value: hydrated && winner ? formatLoanMoney(winner.totalCost) : "—",
          },
          {
            label: "Winner",
            value: hydrated && winner ? winner.label : "—",
          },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
          <div className="mb-5 flex justify-between">
            <h3 className="text-lg font-semibold">Offer A</h3>
            <button
              type="button"
              onClick={reset}
              className="text-xs font-semibold text-[var(--muted)] hover:text-[var(--accent)]"
            >
              Reset A
            </button>
          </div>
          <StandardLoanFields
            calculator={calculator}
            values={values}
            set={set}
            ids={["principal", "annualRate", "termMonths"]}
          />
          <div className="mt-6">
            <LoanNumberField
              id="extraPayment"
              label="Extra monthly payment ($)"
              value={extra}
              min={0}
              max={2000}
              step={25}
              onChange={(n) => set("extraPayment", n)}
            />
          </div>
          <div className="mt-4">
            <LoanWhatIfBanner text={whatIf} />
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
          <h3 className="mb-5 text-lg font-semibold">Offer B</h3>
          <div className="space-y-6">
            <LoanNumberField
              id="offerB-rate"
              label="APR (%)"
              value={offerB.annualRate}
              min={0}
              max={40}
              step={0.1}
              onChange={(n) => setOfferB((p) => ({ ...p, annualRate: n }))}
            />
            <LoanNumberField
              id="offerB-term"
              label="Term (months)"
              value={offerB.termMonths}
              min={6}
              max={84}
              step={1}
              onChange={(n) => setOfferB((p) => ({ ...p, termMonths: n }))}
            />
            <LoanNumberField
              id="offerB-fees"
              label="Origination / fees ($)"
              value={offerB.fees}
              min={0}
              max={5000}
              step={25}
              onChange={(n) => setOfferB((p) => ({ ...p, fees: n }))}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {compared.map((c) => (
          <div
            key={c.id}
            className={`rounded-2xl border p-5 ${
              winner?.id === c.id
                ? "border-[var(--accent)] bg-[var(--surface)]"
                : "border-[var(--border)] bg-[var(--surface)]"
            }`}
          >
            <p className="text-[11px] font-semibold tracking-[0.14em] text-[var(--accent)] uppercase">
              {winner?.id === c.id ? "Lowest total cost" : "Compare"}
            </p>
            <h3 className="mt-1 text-lg font-bold">{c.label}</h3>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-[var(--muted)]">Payment</dt>
                <dd className="font-semibold">{formatLoanMoney(c.payment)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[var(--muted)]">Interest</dt>
                <dd className="font-semibold">{formatLoanMoney(c.interest)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[var(--muted)]">Total cost (w/ fees)</dt>
                <dd className="font-semibold">{formatLoanMoney(c.totalCost)}</dd>
              </div>
            </dl>
          </div>
        ))}
      </div>

      <LoanSparkline values={primary.balanceSeries} label="Offer A balance (w/ extra)" />
      <LoanScheduleTable rows={schedulePreview(primary.schedule)} />
      <LoanExportBar
        title={calculator.title}
        filenameBase={calculator.slug}
        lines={compared.flatMap((c) => [
          `${c.label}: payment ${formatLoanMoney(c.payment)}, interest ${formatLoanMoney(c.interest)}, total ${formatLoanMoney(c.totalCost)}`,
        ])}
      />
      <SmartAdviceBox
        items={[
          {
            tone: "info",
            badge: "Compare carefully",
            title: "Lowest payment isn’t always cheapest",
            message:
              "Longer terms cut the monthly bill but usually raise lifetime interest. Use total cost (including fees) as the tie-breaker.",
          },
        ]}
      />
      <LoanRelatedTools calculator={calculator} related={related} />
    </LoanWorkspaceFrame>
  );
}

/* ─── Credit card ────────────────────────────────────────────── */

function CreditCardWorkspace({
  calculator,
  related,
}: {
  calculator: Calculator;
  related: Calculator[];
}) {
  const { values, set, reset, hydrated } = usePersistedLoanValues(calculator);
  const balance = values.balance ?? 0;
  const annualRate = values.annualRate ?? 0;
  const minPaymentPercent = values.minPaymentPercent ?? 2;
  const minPaymentFloor = values.minPaymentFloor ?? 25;
  const extraPayment = values.extraPayment ?? 0;
  const fixedPayment = values.fixedPayment ?? 200;

  useEffect(() => {
    if (values.extraPayment == null) set("extraPayment", 50);
    if (values.fixedPayment == null) set("fixedPayment", 200);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const minOnly = useMemo(
    () =>
      simulateCreditCardPayoff({
        balance,
        annualRate,
        minPaymentPercent,
        minPaymentFloor,
        extraPayment: 0,
      }),
    [balance, annualRate, minPaymentPercent, minPaymentFloor]
  );
  const minPlusExtra = useMemo(
    () =>
      simulateCreditCardPayoff({
        balance,
        annualRate,
        minPaymentPercent,
        minPaymentFloor,
        extraPayment,
      }),
    [balance, annualRate, minPaymentPercent, minPaymentFloor, extraPayment]
  );
  const fixed = useMemo(
    () =>
      simulateCreditCardPayoff({
        balance,
        annualRate,
        minPaymentPercent,
        minPaymentFloor,
        fixedPayment,
      }),
    [balance, annualRate, minPaymentPercent, minPaymentFloor, fixedPayment]
  );

  const whatIf =
    extraPayment > 0 && !minPlusExtra.unreachable && !minOnly.unreachable
      ? `Adding ${formatLoanMoney(extraPayment)}/mo above the minimum shaves ${Math.max(0, minOnly.months - minPlusExtra.months)} months and saves ${formatLoanMoney(Math.max(0, minOnly.interest - minPlusExtra.interest))} in interest!`
      : null;

  return (
    <LoanWorkspaceFrame
      title="Credit card payoff studio"
      blurb="Compare minimum-only vs minimum+extra vs a fixed monthly payment. Progress autosaves in this browser."
    >
      <LoanMetricCards
        items={[
          {
            label: "Min-only payoff",
            value: hydrated
              ? minOnly.unreachable
                ? "Never"
                : formatLoanMonths(minOnly.months)
              : "—",
            accent: true,
          },
          {
            label: "Min-only interest",
            value: hydrated ? formatLoanMoney(minOnly.interest) : "—",
          },
          {
            label: "With extra",
            value: hydrated
              ? minPlusExtra.unreachable
                ? "Never"
                : formatLoanMonths(minPlusExtra.months)
              : "—",
          },
          {
            label: "Fixed payment",
            value: hydrated
              ? fixed.unreachable
                ? "Never"
                : formatLoanMonths(fixed.months)
              : "—",
          },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
          <div className="mb-5 flex justify-between">
            <h3 className="text-lg font-semibold">Card details</h3>
            <button
              type="button"
              onClick={reset}
              className="text-xs font-semibold text-[var(--muted)] hover:text-[var(--accent)]"
            >
              Reset
            </button>
          </div>
          <StandardLoanFields
            calculator={calculator}
            values={values}
            set={set}
            ids={[
              "balance",
              "annualRate",
              "minPaymentPercent",
              "minPaymentFloor",
            ]}
          />
          <div className="mt-6 space-y-6">
            <LoanNumberField
              id="extraPayment"
              label="Extra above minimum ($)"
              value={extraPayment}
              min={0}
              max={2000}
              step={25}
              onChange={(n) => set("extraPayment", n)}
            />
            <LoanNumberField
              id="fixedPayment"
              label="Fixed monthly payment ($)"
              value={fixedPayment}
              min={25}
              max={5000}
              step={25}
              onChange={(n) => set("fixedPayment", n)}
            />
          </div>
          <div className="mt-5">
            <LoanWhatIfBanner text={whatIf} />
          </div>
        </div>

        <div className="space-y-4">
          {[
            { title: "Minimum only", s: minOnly },
            { title: "Minimum + extra", s: minPlusExtra },
            { title: "Fixed payment", s: fixed },
          ].map(({ title, s }) => (
            <div
              key={title}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"
            >
              <h3 className="font-semibold">{title}</h3>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-[var(--muted)]">Time</dt>
                  <dd className="font-semibold">
                    {s.unreachable ? "Unreachable" : formatLoanMonths(s.months)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[var(--muted)]">Interest</dt>
                  <dd className="font-semibold">{formatLoanMoney(s.interest)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[var(--muted)]">Total paid</dt>
                  <dd className="font-semibold">{formatLoanMoney(s.totalPaid)}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      </div>

      <LoanSparkline
        values={minPlusExtra.balanceSeries}
        label="Balance with minimum + extra"
      />
      <LoanExportBar
        title={calculator.title}
        filenameBase={calculator.slug}
        lines={[
          `Balance ${formatLoanMoney(balance)} @ ${annualRate}% APR`,
          `Min only: ${formatLoanMonths(minOnly.months)}, interest ${formatLoanMoney(minOnly.interest)}`,
          `Min + extra: ${formatLoanMonths(minPlusExtra.months)}, interest ${formatLoanMoney(minPlusExtra.interest)}`,
          `Fixed ${formatLoanMoney(fixedPayment)}: ${formatLoanMonths(fixed.months)}, interest ${formatLoanMoney(fixed.interest)}`,
          whatIf ?? "",
          "Next step: model multiple cards in Debt Avalanche / Snowball.",
        ]}
      />
      <SmartAdviceBox
        items={[
          {
            tone: minOnly.months > 60 ? "warning" : "caution",
            badge: "Minimum trap",
            title: "Minimums maximize bank interest",
            message:
              "If payoff exceeds 5 years on minimums, switch to a fixed payment you can sustain — or roll cards into avalanche/snowball.",
          },
          {
            tone: "info",
            badge: "Multi-card?",
            title: "Use the debt strategy tools next",
            message:
              "Open Debt Avalanche or Snowball to prioritize several cards with one monthly budget.",
          },
        ]}
      />
      <LoanRelatedTools calculator={calculator} related={related} />
    </LoanWorkspaceFrame>
  );
}

/* ─── Refinance ──────────────────────────────────────────────── */

function RefinanceWorkspace({
  calculator,
  related,
}: {
  calculator: Calculator;
  related: Calculator[];
}) {
  const { values, set, reset, hydrated } = usePersistedLoanValues(calculator);
  const result = useMemo(
    () =>
      simulateRefinance({
        balance: values.balance ?? 0,
        currentRate: values.currentRate ?? 0,
        currentTerm: values.currentTerm ?? 1,
        newRate: values.newRate ?? 0,
        newTerm: values.newTerm ?? 1,
        fees: values.fees ?? 0,
      }),
    [values]
  );

  const worthIt =
    result.lifetimeSavings > 0 && Number.isFinite(result.breakEvenMonths);

  return (
    <LoanWorkspaceFrame
      title="Refinance decision studio"
      blurb="Current vs new side-by-side with break-even timing. Autosaved locally — export when you’re ready to decide."
    >
      <LoanMetricCards
        items={[
          {
            label: "New payment",
            value: hydrated ? formatLoanMoney(result.newPayment) : "—",
            accent: true,
          },
          {
            label: "Monthly savings",
            value: hydrated ? formatLoanMoney(result.monthlySavings) : "—",
          },
          {
            label: "Lifetime savings",
            value: hydrated ? formatLoanMoney(result.lifetimeSavings) : "—",
          },
          {
            label: "Break-even",
            value: hydrated
              ? Number.isFinite(result.breakEvenMonths)
                ? formatLoanMonths(result.breakEvenMonths)
                : "N/A"
              : "—",
          },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
          <div className="mb-5 flex justify-between">
            <h3 className="text-lg font-semibold">Loan details</h3>
            <button
              type="button"
              onClick={reset}
              className="text-xs font-semibold text-[var(--muted)] hover:text-[var(--accent)]"
            >
              Reset
            </button>
          </div>
          <StandardLoanFields
            calculator={calculator}
            values={values}
            set={set}
            ids={[
              "balance",
              "currentRate",
              "currentTerm",
              "newRate",
              "newTerm",
              "fees",
            ]}
          />
        </div>

        <div className="grid gap-4 content-start">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <h3 className="font-semibold">Current loan</h3>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-[var(--muted)]">Payment</dt>
                <dd className="font-semibold">
                  {formatLoanMoney(result.oldPayment)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[var(--muted)]">Total remaining</dt>
                <dd className="font-semibold">{formatLoanMoney(result.oldTotal)}</dd>
              </div>
            </dl>
          </div>
          <div className="rounded-2xl border border-[var(--accent)] bg-[var(--surface)] p-5">
            <h3 className="font-semibold">New loan</h3>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-[var(--muted)]">Payment</dt>
                <dd className="font-semibold">
                  {formatLoanMoney(result.newPayment)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[var(--muted)]">Total + fees</dt>
                <dd className="font-semibold">{formatLoanMoney(result.newTotal)}</dd>
              </div>
            </dl>
          </div>
          <LoanWhatIfBanner
            text={
              worthIt
                ? `Refinancing pays for itself in ${formatLoanMonths(result.breakEvenMonths)} and can save ${formatLoanMoney(result.lifetimeSavings)} over the remaining life of the loan.`
                : result.monthlySavings <= 0
                  ? "The new payment isn’t lower — refinancing mainly helps if you need a different term, not monthly cash-flow."
                  : "Fees wipe out the benefit at these inputs — negotiate fees or wait for a better rate."
            }
          />
        </div>
      </div>

      <LoanSparkline
        values={result.newAmort.balanceSeries}
        label="New loan remaining balance"
      />
      <LoanExportBar
        title={calculator.title}
        filenameBase={calculator.slug}
        lines={[
          `Balance ${formatLoanMoney(values.balance ?? 0)}`,
          `Current: ${formatLoanMoney(result.oldPayment)}/mo, total ${formatLoanMoney(result.oldTotal)}`,
          `New: ${formatLoanMoney(result.newPayment)}/mo, total+fees ${formatLoanMoney(result.newTotal)}`,
          `Monthly savings ${formatLoanMoney(result.monthlySavings)}`,
          `Lifetime savings ${formatLoanMoney(result.lifetimeSavings)}`,
          `Break-even ${Number.isFinite(result.breakEvenMonths) ? formatLoanMonths(result.breakEvenMonths) : "N/A"}`,
        ]}
      />
      <SmartAdviceBox
        items={[
          {
            tone: worthIt ? "positive" : "caution",
            badge: "Decision",
            title: worthIt ? "Refinance looks favorable" : "Run the numbers again",
            message: worthIt
              ? "Confirm you can stay past break-even and that credit/fees match this estimate."
              : "A lower rate with a much longer term can still raise lifetime interest — watch total cost, not just payment.",
          },
        ]}
      />
      <LoanRelatedTools calculator={calculator} related={related} />
    </LoanWorkspaceFrame>
  );
}

/* ─── Home equity ────────────────────────────────────────────── */

function HomeEquityWorkspace({
  calculator,
  related,
}: {
  calculator: Calculator;
  related: Calculator[];
}) {
  const { values, set, reset, hydrated } = usePersistedLoanValues(calculator);
  const result = useMemo(
    () =>
      simulateHomeEquity({
        homeValue: values.homeValue ?? 0,
        mortgageBalance: values.mortgageBalance ?? 0,
        ltvLimit: values.ltvLimit ?? 80,
        loanAmount: values.loanAmount ?? 0,
        annualRate: values.annualRate ?? 0,
        termMonths: values.termMonths ?? 120,
      }),
    [values]
  );

  return (
    <LoanWorkspaceFrame
      title="Home equity loan studio"
      blurb="See available equity under your LTV cap, payment, and interest — then export a summary."
    >
      <LoanMetricCards
        items={[
          {
            label: "Available equity",
            value: hydrated ? formatLoanMoney(result.maxLoan) : "—",
            accent: true,
          },
          {
            label: "Loan used",
            value: hydrated ? formatLoanMoney(result.loanUsed) : "—",
          },
          {
            label: "Monthly payment",
            value: hydrated ? formatLoanMoney(result.payment) : "—",
          },
          {
            label: "Total interest",
            value: hydrated ? formatLoanMoney(result.interest) : "—",
          },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
          <div className="mb-5 flex justify-between">
            <h3 className="text-lg font-semibold">Inputs</h3>
            <button
              type="button"
              onClick={reset}
              className="text-xs font-semibold text-[var(--muted)] hover:text-[var(--accent)]"
            >
              Reset
            </button>
          </div>
          <StandardLoanFields
            calculator={calculator}
            values={values}
            set={set}
            ids={[
              "homeValue",
              "mortgageBalance",
              "ltvLimit",
              "loanAmount",
              "annualRate",
              "termMonths",
            ]}
          />
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
          <h3 className="text-lg font-semibold">Equity usage</h3>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-[var(--background)]">
            <div
              className="h-full rounded-full bg-[var(--accent)] transition-[width]"
              style={{
                width: `${clamp(result.equityUsedPct, 0, 100)}%`,
              }}
            />
          </div>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Using {result.equityUsedPct.toFixed(0)}% of available equity under a{" "}
            {values.ltvLimit ?? 80}% combined LTV cap.
          </p>
          {result.capped && (
            <LoanWhatIfBanner text="Desired loan exceeds available equity — amount is capped to the maximum allowed under your LTV limit." />
          )}
          <div className="mt-5">
            <LoanSparkline
              values={result.amort.balanceSeries}
              label="HEL remaining balance"
            />
          </div>
        </div>
      </div>

      <LoanScheduleTable rows={schedulePreview(result.amort.schedule)} />
      <LoanExportBar
        title={calculator.title}
        filenameBase={calculator.slug}
        lines={[
          `Home ${formatLoanMoney(values.homeValue ?? 0)}, mortgage ${formatLoanMoney(values.mortgageBalance ?? 0)}`,
          `Available equity ${formatLoanMoney(result.maxLoan)}`,
          `Loan used ${formatLoanMoney(result.loanUsed)}`,
          `Payment ${formatLoanMoney(result.payment)}`,
          `Interest ${formatLoanMoney(result.interest)}`,
        ]}
      />
      <SmartAdviceBox
        items={[
          {
            tone: "caution",
            badge: "Home at risk",
            title: "Equity loans are secured by your house",
            message:
              "Only borrow what you can repay comfortably. Stress-test the payment against your budget before closing.",
          },
        ]}
      />
      <LoanRelatedTools calculator={calculator} related={related} />
    </LoanWorkspaceFrame>
  );
}

/* ─── Bi-weekly mortgage ─────────────────────────────────────── */

function BiWeeklyWorkspace({
  calculator,
  related,
}: {
  calculator: Calculator;
  related: Calculator[];
}) {
  const { values, set, reset, hydrated } = usePersistedLoanValues(calculator);
  const extraMonthly = values.extraMonthly ?? 0;

  useEffect(() => {
    if (values.extraMonthly == null) set("extraMonthly", 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const result = useMemo(
    () =>
      simulateBiWeekly({
        principal: values.principal ?? 0,
        annualRate: values.annualRate ?? 0,
        termYears: values.termYears ?? 30,
        extraMonthly,
      }),
    [values, extraMonthly]
  );

  return (
    <LoanWorkspaceFrame
      title="Bi-weekly mortgage studio"
      blurb="Compare standard monthly, bi-weekly (26 half-payments/year), and an equivalent extra monthly payment."
    >
      <LoanMetricCards
        items={[
          {
            label: "Bi-weekly payment",
            value: hydrated ? formatLoanMoney(result.biWeeklyPayment) : "—",
            accent: true,
          },
          {
            label: "Interest saved",
            value: hydrated
              ? formatLoanMoney(result.interestSavedVsMonthly)
              : "—",
          },
          {
            label: "Months saved",
            value: hydrated
              ? `${result.monthsSavedVsMonthly}`
              : "—",
          },
          {
            label: "Bi-weekly payoff",
            value: hydrated
              ? formatLoanMonths(result.biWeeklyApprox.months)
              : "—",
          },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
          <div className="mb-5 flex justify-between">
            <h3 className="text-lg font-semibold">Mortgage inputs</h3>
            <button
              type="button"
              onClick={reset}
              className="text-xs font-semibold text-[var(--muted)] hover:text-[var(--accent)]"
            >
              Reset
            </button>
          </div>
          <StandardLoanFields
            calculator={calculator}
            values={values}
            set={set}
            ids={["principal", "annualRate", "termYears"]}
          />
          <div className="mt-6">
            <LoanNumberField
              id="extraMonthly"
              label="Alt: extra monthly ($)"
              value={extraMonthly}
              min={0}
              max={2000}
              step={25}
              onChange={(n) => set("extraMonthly", n)}
              hint="Compare vs bi-weekly"
            />
          </div>
        </div>

        <div className="space-y-4">
          {[
            {
              title: "Standard monthly",
              months: result.monthly.months,
              interest: result.monthly.interest,
              pay: result.monthlyPayment,
            },
            {
              title: "Bi-weekly plan",
              months: result.biWeeklyApprox.months,
              interest: result.biWeeklyApprox.interest,
              pay: result.biWeeklyPayment,
            },
            {
              title: "Monthly + extra",
              months: result.extraMonthlyMatch.months,
              interest: result.extraMonthlyMatch.interest,
              pay: result.monthlyPayment + extraMonthly,
            },
          ].map((row) => (
            <div
              key={row.title}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"
            >
              <h3 className="font-semibold">{row.title}</h3>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-[var(--muted)]">Payment</dt>
                  <dd className="font-semibold">{formatLoanMoney(row.pay)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[var(--muted)]">Payoff</dt>
                  <dd className="font-semibold">{formatLoanMonths(row.months)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[var(--muted)]">Interest</dt>
                  <dd className="font-semibold">
                    {formatLoanMoney(row.interest)}
                  </dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      </div>

      <LoanWhatIfBanner
        text={`Switching to bi-weekly can save about ${formatLoanMoney(result.interestSavedVsMonthly)} in interest and finish roughly ${result.monthsSavedVsMonthly} months sooner versus standard monthly payments.`}
      />
      <LoanSparkline
        values={result.biWeeklyApprox.balanceSeries}
        label="Bi-weekly balance path"
      />
      <LoanExportBar
        title={calculator.title}
        filenameBase={calculator.slug}
        lines={[
          `Principal ${formatLoanMoney(values.principal ?? 0)} @ ${values.annualRate}%`,
          `Monthly ${formatLoanMoney(result.monthlyPayment)} → ${formatLoanMonths(result.monthly.months)}`,
          `Bi-weekly ${formatLoanMoney(result.biWeeklyPayment)} → ${formatLoanMonths(result.biWeeklyApprox.months)}`,
          `Interest saved ${formatLoanMoney(result.interestSavedVsMonthly)}`,
        ]}
      />
      <SmartAdviceBox
        items={[
          {
            tone: "info",
            badge: "How it works",
            title: "26 half-payments ≈ one extra monthly/year",
            message:
              "Bi-weekly schedules create the effect of 13 monthly payments annually, which is why payoff accelerates.",
          },
        ]}
      />
      <LoanRelatedTools calculator={calculator} related={related} />
    </LoanWorkspaceFrame>
  );
}

/* ─── Balloon ────────────────────────────────────────────────── */

function BalloonWorkspace({
  calculator,
  related,
}: {
  calculator: Calculator;
  related: Calculator[];
}) {
  const { values, set, reset, hydrated } = usePersistedLoanValues(calculator);
  const result = useMemo(
    () =>
      simulateBalloon({
        principal: values.principal ?? 0,
        annualRate: values.annualRate ?? 0,
        amortYears: values.amortYears ?? 30,
        balloonYears: values.balloonYears ?? 5,
      }),
    [values]
  );

  return (
    <LoanWorkspaceFrame
      title="Balloon loan studio"
      blurb="See the amortizing payment, interest before the balloon, and the lump sum due — plan the exit early."
    >
      <LoanMetricCards
        items={[
          {
            label: "Balloon due",
            value: hydrated ? formatLoanMoney(result.balloon) : "—",
            accent: true,
          },
          {
            label: "Monthly payment",
            value: hydrated ? formatLoanMoney(result.payment) : "—",
          },
          {
            label: "Payments before balloon",
            value: hydrated ? `${result.balloonMonths}` : "—",
          },
          {
            label: "Interest before balloon",
            value: hydrated
              ? formatLoanMoney(result.interestBeforeBalloon)
              : "—",
          },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
          <div className="mb-5 flex justify-between">
            <h3 className="text-lg font-semibold">Inputs</h3>
            <button
              type="button"
              onClick={reset}
              className="text-xs font-semibold text-[var(--muted)] hover:text-[var(--accent)]"
            >
              Reset
            </button>
          </div>
          <StandardLoanFields
            calculator={calculator}
            values={values}
            set={set}
            ids={["principal", "annualRate", "amortYears", "balloonYears"]}
          />
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 space-y-4">
          <LoanWhatIfBanner
            text={`After ${result.balloonMonths} payments of ${formatLoanMoney(result.payment)}, you’ll still owe about ${formatLoanMoney(result.balloon)}. Start a refinance or savings plan well before that date.`}
          />
          <LoanSparkline
            values={result.balanceSeries}
            label="Balance until balloon"
          />
          <LoanExportBar
            title={calculator.title}
            filenameBase={calculator.slug}
            lines={[
              `Principal ${formatLoanMoney(values.principal ?? 0)}`,
              `Payment ${formatLoanMoney(result.payment)}`,
              `Balloon at month ${result.balloonMonths}: ${formatLoanMoney(result.balloon)}`,
              `Interest before balloon ${formatLoanMoney(result.interestBeforeBalloon)}`,
            ]}
          />
        </div>
      </div>

      <LoanScheduleTable
        rows={schedulePreview(result.schedule)}
        title="Schedule until balloon"
      />
      <SmartAdviceBox
        items={[
          {
            tone: "warning",
            badge: "Lump-sum risk",
            title: "Balloons require an exit plan",
            message:
              "If you can’t refinance or pay the balloon, you may face default risk. Model refinance options in the Loan Refinance calculator.",
          },
        ]}
      />
      <LoanRelatedTools calculator={calculator} related={related} />
    </LoanWorkspaceFrame>
  );
}

/* ─── Router ─────────────────────────────────────────────────── */

export function LoansCategoryWorkspace({
  calculator,
  related,
}: {
  calculator: Calculator;
  related: Calculator[];
}) {
  switch (calculator.formulaType) {
    case "carLoanPayoff":
      return (
        <AmortExtraWorkspace
          calculator={calculator}
          related={related}
          kind="car"
        />
      );
    case "studentLoanPayoff":
      return (
        <AmortExtraWorkspace
          calculator={calculator}
          related={related}
          kind="student"
        />
      );
    case "personalLoan":
      return (
        <PersonalLoanWorkspace calculator={calculator} related={related} />
      );
    case "creditCardMinimum":
      return (
        <CreditCardWorkspace calculator={calculator} related={related} />
      );
    case "loanRefinance":
      return <RefinanceWorkspace calculator={calculator} related={related} />;
    case "homeEquityLoan":
      return <HomeEquityWorkspace calculator={calculator} related={related} />;
    case "biWeeklyMortgage":
      return <BiWeeklyWorkspace calculator={calculator} related={related} />;
    case "balloonLoan":
      return <BalloonWorkspace calculator={calculator} related={related} />;
    default:
      return null;
  }
}
