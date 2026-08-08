"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { SmartAdviceBox } from "@/components/SmartAdviceBox";
import type { AdviceItem } from "@/lib/types";
import {
  EXPENSE_ONLY_CATEGORIES,
  INCOME_CATEGORIES,
  type ExpenseCategory,
  type ExpenseTransaction,
  type ExpenseType,
  createTransactionId,
  formatMoney,
  loadExpenseTransactions,
  saveExpenseTransactions,
  summarizeExpenses,
  todayISODate,
} from "@/lib/expenseTracker";

function buildExpenseAdvice(
  rows: ExpenseTransaction[],
  income: number,
  expenses: number,
  balance: number
): AdviceItem[] {
  if (rows.length === 0) {
    return [
      {
        tone: "info",
        badge: "Get started",
        title: "Log your first transaction",
        message:
          "Add a paycheck as income and a few everyday expenses. Your balance, filters, and advice will update instantly—and stay in this browser only.",
      },
    ];
  }

  const advice: AdviceItem[] = [];

  if (balance < 0) {
    advice.push({
      tone: "warning",
      badge: "Deficit",
      title: "Expenses exceed income",
      message: `Your ledger is ${formatMoney(Math.abs(balance))} underwater. Trim discretionary categories or add missing income entries to restore a surplus.`,
    });
  } else if (balance === 0 && income > 0) {
    advice.push({
      tone: "caution",
      badge: "Break-even",
      title: "Income equals expenses",
      message:
        "You’re covering costs but not building buffer. Aim to keep at least a small surplus each period for irregular bills.",
    });
  } else if (income > 0 && expenses / income > 0.9) {
    advice.push({
      tone: "caution",
      badge: "Tight margin",
      title: "Spending is over 90% of income",
      message: `Expenses are ${((expenses / income) * 100).toFixed(0)}% of logged income. A 10–20% surplus target leaves room for surprises.`,
    });
  } else if (income > 0 && expenses / income <= 0.7) {
    advice.push({
      tone: "positive",
      badge: "Healthy gap",
      title: "Strong savings room in this ledger",
      message: `You’re spending about ${((expenses / income) * 100).toFixed(0)}% of logged income. Consider routing the surplus to an emergency fund or investment goal.`,
    });
  } else {
    advice.push({
      tone: "positive",
      badge: "On track",
      title: "Balance looks sustainable",
      message: `Net balance is ${formatMoney(balance)}. Keep categorizing consistently so trends stay meaningful month to month.`,
    });
  }

  const expenseRows = rows.filter((r) => r.type === "expense");
  if (expenseRows.length >= 3) {
    const byCat = new Map<string, number>();
    for (const row of expenseRows) {
      byCat.set(row.category, (byCat.get(row.category) ?? 0) + row.amount);
    }
    const top = [...byCat.entries()].sort((a, b) => b[1] - a[1])[0];
    if (top && expenses > 0 && top[1] / expenses >= 0.35) {
      advice.push({
        tone: "info",
        badge: "Top category",
        title: `${top[0]} is your largest spend`,
        message: `${top[0]} accounts for about ${((top[1] / expenses) * 100).toFixed(0)}% of expenses (${formatMoney(top[1])}). Use the ledger filter to audit that category first.`,
      });
    }
  }

  return advice.slice(0, 3);
}

const emptyForm = {
  title: "",
  amount: "",
  type: "expense" as ExpenseType,
  category: "Food" as ExpenseCategory,
  /** Set after mount to avoid SSR/client date mismatch. */
  date: "",
};

export function ExpenseTracker() {
  const [hydrated, setHydrated] = useState(false);
  const [transactions, setTransactions] = useState<ExpenseTransaction[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | ExpenseType>("all");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    setTransactions(loadExpenseTransactions());
    setForm((prev) => ({ ...prev, date: todayISODate() }));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      saveExpenseTransactions(transactions);
    } catch {
      // Quota / private-mode failures should not crash the UI.
    }
  }, [transactions, hydrated]);

  const summary = useMemo(
    () => summarizeExpenses(transactions),
    [transactions]
  );

  const categoryOptions = useMemo(
    () => (form.type === "income" ? INCOME_CATEGORIES : EXPENSE_ONLY_CATEGORIES),
    [form.type]
  );

  useEffect(() => {
    if (!categoryOptions.includes(form.category)) {
      setForm((prev) => ({
        ...prev,
        category: categoryOptions[0] ?? "Other",
      }));
    }
  }, [form.category, categoryOptions]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...transactions]
      .filter((row) => (typeFilter === "all" ? true : row.type === typeFilter))
      .filter((row) => {
        if (!q) return true;
        return `${row.title} ${row.category} ${row.type} ${row.date}`
          .toLowerCase()
          .includes(q);
      })
      .sort((a, b) => {
        if (a.date === b.date) return b.createdAt.localeCompare(a.createdAt);
        return b.date.localeCompare(a.date);
      });
  }, [transactions, query, typeFilter]);

  const advice = useMemo(
    () =>
      buildExpenseAdvice(
        transactions,
        summary.income,
        summary.expenses,
        summary.balance
      ),
    [transactions, summary]
  );

  const addTransaction = (event: FormEvent) => {
    event.preventDefault();
    const title = form.title.trim();
    const amount = Number(form.amount);
    if (!title) {
      setFormError("Add a short title for this transaction.");
      return;
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      setFormError("Enter an amount greater than zero.");
      return;
    }
    if (!form.date) {
      setFormError("Pick a date for the transaction.");
      return;
    }

    const next: ExpenseTransaction = {
      id: createTransactionId(),
      title,
      amount,
      type: form.type,
      category: form.category,
      date: form.date,
      createdAt: new Date().toISOString(),
    };

    setTransactions((prev) => [next, ...prev]);
    setForm({
      ...emptyForm,
      type: form.type,
      category: form.category,
      date: form.date,
    });
    setFormError("");
  };

  const removeTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((row) => row.id !== id));
  };

  const clearAll = () => {
    if (
      transactions.length > 0 &&
      window.confirm("Clear all transactions from this browser?")
    ) {
      setTransactions([]);
    }
  };

  const balanceTone =
    summary.balance > 0
      ? "text-[#15803d] dark:text-[#4ade80]"
      : summary.balance < 0
        ? "text-[#b91c1c] dark:text-[#f87171]"
        : "text-[var(--foreground)]";

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5">
          <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-[#00E5FF33] to-[#2979FF22] blur-2xl" />
          <p className="text-[11px] font-semibold tracking-[0.14em] text-[var(--accent)] uppercase">
            Total balance
          </p>
          <p
            className={`relative mt-2 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight sm:text-3xl ${balanceTone}`}
          >
            {hydrated ? formatMoney(summary.balance) : "—"}
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5">
          <p className="text-[11px] font-semibold tracking-[0.14em] text-[var(--accent)] uppercase">
            Income
          </p>
          <p className="mt-2 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-[#15803d] dark:text-[#4ade80] sm:text-3xl">
            {hydrated ? formatMoney(summary.income) : "—"}
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5">
          <p className="text-[11px] font-semibold tracking-[0.14em] text-[var(--accent)] uppercase">
            Expenses
          </p>
          <p className="mt-2 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-[#b91c1c] dark:text-[#f87171] sm:text-3xl">
            {hydrated ? formatMoney(summary.expenses) : "—"}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <form
          onSubmit={addTransaction}
          className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6"
        >
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            Add transaction
          </h2>
          <p className="mt-1 text-sm text-[color-mix(in_srgb,var(--foreground)_72%,var(--muted))]">
            Saved locally in this browser—no account required.
          </p>

          <div className="mt-5 space-y-4">
            <div>
              <label
                htmlFor="expense-title"
                className="mb-1.5 block text-sm font-medium"
              >
                Title
              </label>
              <input
                id="expense-title"
                value={form.title}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="e.g. Grocery run, Biweekly paycheck"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="expense-amount"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Amount ($)
                </label>
                <input
                  id="expense-amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.amount}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, amount: e.target.value }))
                  }
                  placeholder="0.00"
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
                />
              </div>
              <div>
                <label
                  htmlFor="expense-date"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Date
                </label>
                <input
                  id="expense-date"
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, date: e.target.value }))
                  }
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <span className="mb-1.5 block text-sm font-medium">Type</span>
                <div className="inline-flex w-full rounded-xl border border-[var(--border)] bg-[var(--background)] p-1">
                  {(["expense", "income"] as ExpenseType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({ ...prev, type }))
                      }
                      className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold capitalize transition ${
                        form.type === type
                          ? "bg-gradient-to-r from-[#00E5FF] to-[#2979FF] text-white"
                          : "text-[var(--muted)] hover:text-[var(--foreground)]"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label
                  htmlFor="expense-category"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Category
                </label>
                <select
                  id="expense-category"
                  value={form.category}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      category: e.target.value as ExpenseCategory,
                    }))
                  }
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
                >
                  {categoryOptions.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {formError ? (
              <p className="text-sm text-[#b91c1c] dark:text-[#f87171]">
                {formError}
              </p>
            ) : null}

            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#2979FF] px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_-16px_rgba(0,229,255,0.85)] transition hover:brightness-105"
            >
              Add transaction
            </button>
          </div>
        </form>

        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-[var(--foreground)]">
                Ledger
              </h2>
              <p className="mt-1 text-sm text-[color-mix(in_srgb,var(--foreground)_72%,var(--muted))]">
                {hydrated
                  ? `${filtered.length} shown · ${transactions.length} total`
                  : "Loading…"}
              </p>
            </div>
            <button
              type="button"
              onClick={clearAll}
              disabled={!hydrated || transactions.length === 0}
              className="rounded-lg border border-[var(--border)] px-2.5 py-1.5 text-[11px] font-medium text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-40"
            >
              Clear all
            </button>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <div className="flex flex-1 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                className="shrink-0 text-[var(--muted)]"
                aria-hidden
              >
                <circle
                  cx="11"
                  cy="11"
                  r="7"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <path
                  d="M20 20l-3.5-3.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search title, category…"
                className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--muted)]"
              />
            </div>
            <div className="inline-flex rounded-xl border border-[var(--border)] bg-[var(--background)] p-1">
              {(
                [
                  ["all", "All"],
                  ["income", "Income"],
                  ["expense", "Expense"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setTypeFilter(value)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    typeFilter === value
                      ? "bg-gradient-to-r from-[#00E5FF] to-[#2979FF] text-white"
                      : "text-[var(--muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 max-h-[min(52vh,420px)] overflow-auto overscroll-contain rounded-xl border border-[var(--border)]">
            {!hydrated ? (
              <p className="px-4 py-12 text-center text-sm text-[var(--muted)]">
                Loading your local ledger…
              </p>
            ) : filtered.length === 0 ? (
              <div className="px-4 py-12 text-center">
                <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-gradient-to-r from-[#00E5FF] to-[#2979FF] opacity-60" />
                <p className="text-sm font-medium text-[var(--foreground)]">
                  {transactions.length === 0
                    ? "No transactions yet"
                    : "No matches for this filter"}
                </p>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {transactions.length === 0
                    ? "Add an income or expense on the left to start your ledger."
                    : "Try clearing search or switching the type filter."}
                </p>
              </div>
            ) : (
              <table className="w-full min-w-[520px] border-collapse text-left text-sm">
                <thead className="sticky top-0 bg-[var(--surface)]">
                  <tr className="border-b border-[var(--border)] text-[11px] tracking-wide text-[var(--muted)] uppercase">
                    <th className="px-3 py-2.5 font-semibold">Date</th>
                    <th className="px-3 py-2.5 font-semibold">Title</th>
                    <th className="px-3 py-2.5 font-semibold">Category</th>
                    <th className="px-3 py-2.5 font-semibold text-right">
                      Amount
                    </th>
                    <th className="px-3 py-2.5 font-semibold text-right">
                      <span className="sr-only">Delete</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-[var(--border)] last:border-b-0"
                    >
                      <td className="whitespace-nowrap px-3 py-2.5 text-[var(--muted)]">
                        {row.date}
                      </td>
                      <td className="px-3 py-2.5">
                        <p className="font-medium text-[var(--foreground)]">
                          {row.title}
                        </p>
                        <p className="text-[10px] font-semibold tracking-wide text-[var(--accent)] uppercase">
                          {row.type}
                        </p>
                      </td>
                      <td className="px-3 py-2.5 text-[var(--muted)]">
                        {row.category}
                      </td>
                      <td
                        className={`px-3 py-2.5 text-right font-semibold ${
                          row.type === "income"
                            ? "text-[#15803d] dark:text-[#4ade80]"
                            : "text-[#b91c1c] dark:text-[#f87171]"
                        }`}
                      >
                        {row.type === "income" ? "+" : "−"}
                        {formatMoney(row.amount)}
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        <button
                          type="button"
                          onClick={() => removeTransaction(row.id)}
                          className="rounded-md border border-[var(--border)] px-2 py-0.5 text-[11px] font-medium text-[var(--muted)] transition hover:border-[#ef4444] hover:text-[#ef4444]"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>

      <SmartAdviceBox items={advice} />
    </div>
  );
}
