import type { Purchase, Subscription } from "@prisma/client";

export type VaultlineAlert = {
  id: string;
  type: "return" | "renewal" | "warranty";
  title: string;
  detail: string;
  date: Date;
  daysLeft: number;
  urgency: "high" | "medium" | "low";
};

function daysUntil(date: Date): number {
  const ms = date.getTime() - Date.now();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

export function buildAlerts(
  purchases: Purchase[],
  subscriptions: Subscription[]
): VaultlineAlert[] {
  const alerts: VaultlineAlert[] = [];

  for (const p of purchases) {
    if (p.status !== "active") continue;
    if (p.returnDeadline) {
      const daysLeft = daysUntil(p.returnDeadline);
      if (daysLeft <= 14) {
        alerts.push({
          id: `return-${p.id}`,
          type: "return",
          title: p.itemName,
          detail: `Return window at ${p.retailer ?? "retailer"}`,
          date: p.returnDeadline,
          daysLeft,
          urgency: daysLeft <= 3 ? "high" : daysLeft <= 7 ? "medium" : "low",
        });
      }
    }
    if (p.warrantyDeadline) {
      const daysLeft = daysUntil(p.warrantyDeadline);
      if (daysLeft <= 30) {
        alerts.push({
          id: `warranty-${p.id}`,
          type: "warranty",
          title: p.itemName,
          detail: "Warranty ending",
          date: p.warrantyDeadline,
          daysLeft,
          urgency: daysLeft <= 7 ? "high" : "low",
        });
      }
    }
  }

  for (const s of subscriptions) {
    if (s.status !== "active") continue;
    const daysLeft = daysUntil(s.nextRenewalDate);
    if (daysLeft <= s.reminderDaysBefore + 7) {
      alerts.push({
        id: `renewal-${s.id}`,
        type: "renewal",
        title: s.name,
        detail: `$${s.cost.toFixed(2)} ${s.billingCycle} renewal`,
        date: s.nextRenewalDate,
        daysLeft,
        urgency: daysLeft <= s.reminderDaysBefore ? "high" : "medium",
      });
    }
  }

  return alerts.sort((a, b) => a.daysLeft - b.daysLeft);
}
