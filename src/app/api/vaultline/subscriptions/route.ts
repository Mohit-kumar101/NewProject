import { prisma } from "@/lib/prisma";
import { jsonError, jsonOk, handleRouteError } from "@/lib/vaultline/api";
import { getLimits } from "@/lib/vaultline/limits";
import { requireUser } from "@/lib/vaultline/session";
import {
  parseFiniteNumber,
  parseOptionalDate,
  parsePositiveInt,
} from "@/lib/vaultline/validation";

export async function GET() {
  try {
    const user = await requireUser();
    const subscriptions = await prisma.subscription.findMany({
      where: { userId: user.id },
      orderBy: { nextRenewalDate: "asc" },
    });
    return jsonOk({ subscriptions });
  } catch (e) {
    return handleRouteError(e, "subscriptions list");
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const limits = getLimits(user.tier);
    const count = await prisma.subscription.count({
      where: { userId: user.id },
    });
    if (count >= limits.subscriptions) {
      return jsonError(
        `Free plan limit: ${limits.subscriptions} subscriptions.`,
        403
      );
    }

    const body = await request.json();
    const name = String(body.name ?? "").trim();
    if (!name) return jsonError("Subscription name is required.");

    const costResult = parseFiniteNumber(body.cost, "cost");
    if (!costResult.ok || costResult.value < 0) {
      return jsonError("Valid cost is required.");
    }

    const billingCycle = String(body.billingCycle ?? "monthly");
    if (!["weekly", "monthly", "yearly"].includes(billingCycle)) {
      return jsonError("Billing cycle must be weekly, monthly, or yearly.");
    }

    const renewalResult = parseOptionalDate(body.nextRenewalDate);
    if (!renewalResult.ok) return jsonError(renewalResult.error);
    const nextRenewalDate = renewalResult.value ?? new Date();

    let reminderDaysBefore = 3;
    if (body.reminderDaysBefore !== undefined) {
      const reminder = parsePositiveInt(
        body.reminderDaysBefore,
        "reminder days",
        30
      );
      if (!reminder.ok) return jsonError(reminder.error);
      reminderDaysBefore = reminder.value;
    }

    const subscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        name,
        cost: costResult.value,
        currency: body.currency ? String(body.currency) : "USD",
        billingCycle,
        nextRenewalDate,
        reminderDaysBefore,
        status: "active",
      },
    });

    return jsonOk({ subscription }, 201);
  } catch (e) {
    return handleRouteError(e, "subscription create");
  }
}
