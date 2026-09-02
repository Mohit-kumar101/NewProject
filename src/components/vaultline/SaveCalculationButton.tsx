"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type SavePayload = {
  toolSlug: string;
  toolTitle: string;
  inputs: Record<string, unknown>;
  result: {
    primaryLabel: string;
    primaryValue: string;
    rows: { label: string; value: string }[];
  };
};

export function SaveCalculationButton({
  payload,
}: {
  payload: SavePayload;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  async function save() {
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/vaultline/saved-calculations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          label: `${payload.toolTitle} — ${payload.result.primaryValue}`,
        }),
      });
      const data = await res.json();
      if (res.status === 401) {
        const next = encodeURIComponent(
          typeof window !== "undefined" ? window.location.pathname : "/tools"
        );
        window.location.href = `/vaultline/login?next=${next}`;
        return;
      }
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Could not save.");
        return;
      }
      setStatus("done");
      setMessage("Saved to your dashboard.");
      router.refresh();
    } catch {
      setStatus("error");
      setMessage("Network error.");
    }
  }

  return (
    <div className="rounded-2xl border border-[color-mix(in_srgb,var(--accent)_30%,var(--border))] bg-[color-mix(in_srgb,var(--accent)_8%,var(--surface))] p-4 sm:p-5">
      <p className="text-xs font-semibold tracking-[0.14em] text-[var(--accent)] uppercase">
        Vaultline
      </p>
      <p className="mt-1 text-sm text-[var(--foreground)]">
        Sign in to save this result to your free Vaultline dashboard.
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={status === "loading" || status === "done"}
          className="rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[#041018] disabled:opacity-60"
        >
          {status === "loading"
            ? "Saving…"
            : status === "done"
              ? "Saved ✓"
              : "Save to Vaultline"}
        </button>
        <Link
          href="/vaultline"
          className="text-sm font-medium text-[var(--accent)] hover:underline"
        >
          Open dashboard
        </Link>
      </div>
      {message ? (
        <p
          className={`mt-2 text-sm ${status === "error" ? "text-red-500" : "text-[var(--muted)]"}`}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
