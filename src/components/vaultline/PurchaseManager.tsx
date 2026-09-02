"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { STORE_OPTIONS } from "@/lib/vaultline/returnPolicies";
import { ReturnCountdown } from "@/components/vaultline/DashboardPanels";

type PurchaseRow = {
  id: string;
  itemName: string;
  retailer: string | null;
  price: number;
  purchaseDate: string;
  returnDeadline: string | null;
  returnWindowDays?: number | null;
  status: string;
};

function daysLeft(deadline: string | null): number | null {
  if (!deadline) return null;
  return Math.ceil(
    (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
}

export function PurchaseManager({ initial }: { initial: PurchaseRow[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [itemName, setItemName] = useState("");
  const [retailer, setRetailer] = useState("");
  const [customRetailer, setCustomRetailer] = useState("");
  const [price, setPrice] = useState("");
  const [returnWindowDays, setReturnWindowDays] = useState("30");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setItems(initial);
  }, [initial]);

  function resolvedRetailer(): string {
    if (retailer === "__custom__") return customRetailer.trim();
    return retailer;
  }

  function onStoreChange(value: string) {
    setRetailer(value);
    if (value !== "__custom__") {
      const store = STORE_OPTIONS.find((s) => s.value === value);
      if (store) setReturnWindowDays(String(store.returnWindowDays));
    }
  }

  async function addPurchase(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const store = resolvedRetailer();
    try {
      const res = await fetch("/api/vaultline/purchases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemName,
          retailer: store || undefined,
          price: Number(price),
          returnWindowDays: Number(returnWindowDays),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not add purchase.");
        return;
      }
      const purchase = {
        ...data.purchase,
        purchaseDate: data.purchase.purchaseDate,
        returnDeadline: data.purchase.returnDeadline,
      };
      setItems((prev) => [purchase, ...prev]);
      setItemName("");
      setRetailer("");
      setCustomRetailer("");
      setPrice("");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function remove(id: string) {
    setError("");
    const res = await fetch(`/api/vaultline/purchases/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Could not remove purchase.");
      return;
    }
    setItems((prev) => prev.filter((p) => p.id !== id));
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={addPurchase}
        className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5"
      >
        <h2 className="text-lg font-semibold">Add purchase manually</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <input
            required
            placeholder="Item name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
          />
          <select
            value={retailer}
            onChange={(e) => onStoreChange(e.target.value)}
            className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
          >
            <option value="">Select store (optional)</option>
            {STORE_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label} ({s.returnWindowDays}d returns)
              </option>
            ))}
            <option value="__custom__">Other store…</option>
          </select>
          {retailer === "__custom__" ? (
            <input
              placeholder="Store name"
              value={customRetailer}
              onChange={(e) => setCustomRetailer(e.target.value)}
              className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)] sm:col-span-2"
            />
          ) : null}
          <input
            required
            type="number"
            min={0}
            step="0.01"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
          />
          <input
            type="number"
            min={0}
            placeholder="Return window (days)"
            value={returnWindowDays}
            onChange={(e) => setReturnWindowDays(e.target.value)}
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
          {loading ? "Saving…" : "Add purchase"}
        </button>
      </form>

      <ul className="space-y-3">
        {items.length === 0 ? (
          <li className="rounded-xl border border-dashed border-[var(--border)] px-4 py-8 text-center text-sm text-[var(--muted)]">
            No purchases yet. Add one below to track return windows.
          </li>
        ) : (
          items.map((p) => (
            <li
              key={p.id}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold break-words-safe">{p.itemName}</p>
                  <p className="text-sm text-[var(--muted)]">
                    {p.retailer || "—"} · ${p.price.toFixed(2)}
                  </p>
                  <ReturnCountdown
                    itemName={p.itemName}
                    retailer={p.retailer}
                    daysLeft={daysLeft(p.returnDeadline)}
                    returnDeadline={p.returnDeadline}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => remove(p.id)}
                  className="shrink-0 text-sm text-[var(--muted)] hover:text-red-500"
                >
                  Remove
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
