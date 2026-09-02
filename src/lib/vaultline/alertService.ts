import { prisma } from "@/lib/prisma";

function daysUntil(date: Date): number {
  return Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

function urgencyForDaysLeft(daysLeft: number): string {
  if (daysLeft <= 3) return "high";
  if (daysLeft <= 7) return "medium";
  return "low";
}

function returnAlertTemplate(
  itemName: string,
  retailer: string,
  daysLeft: number
): string {
  return `Hi,

I'd like to initiate a return for "${itemName}" purchased from ${retailer}. My return window ${
    daysLeft <= 0 ? "has expired or is closing today" : `closes in ${daysLeft} day${daysLeft === 1 ? "" : "s"}`
  }.

Could you please provide a return label or instructions?

Thank you.`;
}

export async function createReturnAlertsForPurchase(
  userId: string,
  purchase: {
    id: string;
    itemName: string;
    retailer: string | null;
    returnDeadline: Date | null;
  }
) {
  if (!purchase.returnDeadline) return;

  const existing = await prisma.alert.findFirst({
    where: {
      userId,
      purchaseId: purchase.id,
      type: "return_expiry",
      status: { not: "dismissed" },
    },
  });
  if (existing) return;

  const daysLeft = daysUntil(purchase.returnDeadline);
  const retailer = purchase.retailer ?? "the retailer";

  await prisma.alert.create({
    data: {
      userId,
      purchaseId: purchase.id,
      type: "return_expiry",
      title: `Return window: ${purchase.itemName}`,
      body: `Your return window at ${retailer} closes ${
        daysLeft <= 0 ? "today" : `in ${daysLeft} day${daysLeft === 1 ? "" : "s"}`
      }.`,
      templateBody: returnAlertTemplate(purchase.itemName, retailer, daysLeft),
      urgency: urgencyForDaysLeft(daysLeft),
      status: "pending",
      dueAt: purchase.returnDeadline,
    },
  });
}
