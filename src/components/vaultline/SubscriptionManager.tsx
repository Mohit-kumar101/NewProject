"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SubscriptionManager({
  initial,
}: {
  initial: {
    id: string;
    name: string;
    cost: number;
    billingCycle: string;
    nextRenewalDate: string;
    status: string;
  }[];
}) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [name, setName] = useState("");
  const [cost, setCost] = useState("");
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [nextRenewalDate, setNextRenewalDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function addSub(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/vaultline/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          cost: Number(cost),
          billingCycle,
          nextRenewalDate: nextRenewalDate || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not add subscription.");
        return;
      }
      setItems((prev) =>
        [...prev, data.subscription].sort(
          (a, b) =>
            new Date(a.nextRenewalDate).getTime() -
            new Date(b.nextRenewalDate).getTime()
        )
      );
      setName("");
      setCost("");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function remove(id: string) {
    await fetch(`/api/vaultline/subscriptions/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((s) => s.id !== id));
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={addSub}
        className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5"
      >
        <h2 className="text-lg font-semibold">Add subscription</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <input
            required
            placeholder="Service name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
          />
          <input
            required
            type="number"
            min={0}
            step="0.01"
            placeholder="Cost"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
          />
          <select
            value={billingCycle}
            onChange={(e) => setBillingCycle(e.target.value)}
            className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          <input
            type="date"
            value={nextRenewalDate}
            onChange={(e) => setNextRenewalDate(e.target.value)}
            className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
          />
        </div>
        {error ? (
          <p className="mt-3 text-sm text-red-500">{error}</p>
        ) : null}
        <button
          type="submit"
          disabled={loading}
          className="mt-4 rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[#041018] disabled:opacity-60"
        >
          {loading ? "Saving…" : "Add subscription"}
        </button>
      </form>

      <ul className="space-y-3">
        {items.length === 0 ? (
          <li className="rounded-xl border border-dashed border-[var(--border)] px-4 py-8 text-center text-sm text-[var(--muted)]">
            No subscriptions tracked yet.
          </li>
        ) : (
          items.map((s) => (
            <li
              key={s.id}
              className="flex flex-col gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-semibold">{s.name}</p>
                <p className="text-sm text-[var(--muted)]">
                  ${s.cost.toFixed(2)} / {s.billingCycle}
                </p>
                <p className="mt-1 text-xs text-[var(--accent)]">
                  Renews {new Date(s.nextRenewalDate).toLocaleDateString()}
                </p>
              </div>
              <button
                type="button"
                onClick={() => remove(s.id)}
                className="text-sm text-[var(--muted)] hover:text-red-500"
              >
                Remove
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
