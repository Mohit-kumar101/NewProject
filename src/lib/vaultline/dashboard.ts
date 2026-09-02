import type { Alert, Purchase, Subscription } from "@prisma/client";
import { buildAlerts, type VaultlineAlert } from "@/lib/vaultline/alerts";
import type { DashboardAlert } from "@/lib/vaultline/types";

function daysUntil(date: Date): number {
  return Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

/** Merge persisted Alert rows with live computed alerts from purchases/subs. */
export function mergeDashboardAlerts(
  dbAlerts: Alert[],
  purchases: Purchase[],
  subscriptions: Subscription[]
): DashboardAlert[] {
  const computed = buildAlerts(purchases, subscriptions);
  const seen = new Set<string>();

  const fromDb: DashboardAlert[] = dbAlerts
    .filter((a) => a.status !== "dismissed")
    .map((a) => {
      seen.add(`${a.type}-${a.purchaseId ?? a.subscriptionId ?? a.id}`);
      return {
        id: a.id,
        type: a.type,
        title: a.title,
        body: a.body,
        templateBody: a.templateBody,
        urgency: a.urgency,
        status: a.status,
        dueAt: a.dueAt.toISOString(),
        daysLeft: daysUntil(a.dueAt),
        purchaseId: a.purchaseId,
        subscriptionId: a.subscriptionId,
        persisted: true,
      };
    });

  const fromComputed: DashboardAlert[] = computed
    .filter((a) => {
      const key = `${a.type}-${a.id}`;
      return !seen.has(key);
    })
    .map((a) => computedToDashboard(a));

  return [...fromDb, ...fromComputed].sort(
    (a, b) => a.daysLeft - b.daysLeft
  );
}

function computedToDashboard(a: VaultlineAlert): DashboardAlert {
  return {
    id: a.id,
    type: a.type,
    title: a.title,
    body: a.detail,
    templateBody: null,
    urgency: a.urgency,
    status: "pending",
    dueAt: a.date.toISOString(),
    daysLeft: a.daysLeft,
    purchaseId: a.id.startsWith("return-")
      ? a.id.replace("return-", "")
      : a.id.startsWith("warranty-")
        ? a.id.replace("warranty-", "")
        : null,
    subscriptionId: a.id.startsWith("renewal-")
      ? a.id.replace("renewal-", "")
      : null,
    persisted: false,
  };
}

export function purchaseDaysLeft(returnDeadline: Date | null): number | null {
  if (!returnDeadline) return null;
  return daysUntil(returnDeadline);
}
