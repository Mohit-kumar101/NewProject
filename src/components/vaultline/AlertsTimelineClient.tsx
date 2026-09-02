"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AlertTriangle,
  Bell,
  Clock,
  RefreshCw,
  Shield,
  TrendingDown,
  X,
} from "lucide-react";
import type { DashboardAlert } from "@/lib/vaultline/types";

const TYPE_ICONS: Record<string, typeof Bell> = {
  return_expiry: Clock,
  warranty_expiry: Shield,
  subscription_renewal: RefreshCw,
  price_drop: TrendingDown,
};

const URGENCY_STYLES: Record<string, string> = {
  high: "border-red-400/40 bg-red-500/10",
  medium: "border-amber-400/30 bg-amber-500/8",
  low: "border-[var(--border)] bg-[var(--surface)]",
};

export function AlertsTimelineClient({
  initialAlerts,
}: {
  initialAlerts: DashboardAlert[];
}) {
  const router = useRouter();
  const [alerts, setAlerts] = useState(initialAlerts);
  const [dismissing, setDismissing] = useState<string | null>(null);

  async function dismiss(alertId: string) {
    setDismissing(alertId);
    try {
      const res = await fetch("/api/vaultline/alerts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alertId, action: "dismiss" }),
      });
      if (res.ok) {
        setAlerts((prev) => prev.filter((a) => a.id !== alertId));
        router.refresh();
      }
    } finally {
      setDismissing(null);
    }
  }

  if (alerts.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--border)] px-5 py-10 text-center">
        <Bell className="mx-auto h-8 w-8 text-[var(--muted)]" />
        <p className="mt-3 text-sm font-medium">No upcoming alerts</p>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Add a purchase or subscription to start your reminder timeline.
        </p>
      </div>
    );
  }

  return (
    <ol className="relative space-y-0 border-l border-[var(--border)] pl-6">
      {alerts.map((alert) => {
        const Icon = TYPE_ICONS[alert.type] ?? AlertTriangle;
        const urgencyClass =
          URGENCY_STYLES[alert.urgency] ?? URGENCY_STYLES.low;

        return (
          <li key={alert.id} className="relative pb-5 last:pb-0">
            <span
              className={`absolute -left-[1.65rem] flex h-7 w-7 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--background)] ${
                alert.urgency === "high" ? "text-red-500" : "text-[var(--accent)]"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
            </span>

            <div className={`rounded-xl border px-4 py-3 ${urgencyClass}`}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="text-sm font-semibold">{alert.title}</p>
                <div className="flex items-center gap-2">
                  <span className="shrink-0 text-xs font-medium text-[var(--muted)]">
                    {alert.daysLeft <= 0
                      ? "Due now"
                      : `${alert.daysLeft}d left`}
                  </span>
                  {alert.persisted ? (
                    <button
                      type="button"
                      disabled={dismissing === alert.id}
                      onClick={() => dismiss(alert.id)}
                      className="rounded-lg p-1 text-[var(--muted)] hover:bg-[var(--background)] hover:text-[var(--foreground)] disabled:opacity-50"
                      aria-label="Dismiss alert"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  ) : null}
                </div>
              </div>
              <p className="mt-1 text-sm text-[var(--muted)]">{alert.body}</p>
              {alert.templateBody ? (
                <details className="mt-2">
                  <summary className="cursor-pointer text-xs font-medium text-[var(--accent)]">
                    View support template
                  </summary>
                  <pre className="mt-2 max-h-32 overflow-auto rounded-lg bg-[var(--background)] p-2 text-xs whitespace-pre-wrap text-[var(--muted)]">
                    {alert.templateBody}
                  </pre>
                </details>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
