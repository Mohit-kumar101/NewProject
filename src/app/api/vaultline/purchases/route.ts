import { prisma } from "@/lib/prisma";
import { createReturnAlertsForPurchase } from "@/lib/vaultline/alertService";
import { jsonError, jsonOk, handleRouteError } from "@/lib/vaultline/api";
import { getLimits } from "@/lib/vaultline/limits";
import { requireUser } from "@/lib/vaultline/session";
import {
  parseFiniteNumber,
  parseOptionalDate,
  parsePositiveInt,
} from "@/lib/vaultline/validation";
import { lookupReturnPolicy } from "@/lib/vaultline/returnPolicies";
import {
  computeReturnDeadline,
  computeWarrantyDeadline,
} from "@/lib/vaultline/returnPolicies";

export async function GET() {
  try {
    const user = await requireUser();
    const purchases = await prisma.purchase.findMany({
      where: { userId: user.id },
      orderBy: { purchaseDate: "desc" },
    });
    return jsonOk({ purchases });
  } catch (e) {
    return handleRouteError(e, "purchases list");
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const limits = getLimits(user.tier);
    const count = await prisma.purchase.count({ where: { userId: user.id } });
    if (count >= limits.purchases) {
      return jsonError(
        `Free plan limit: ${limits.purchases} purchases. Upgrade to Pro for unlimited.`,
        403
      );
    }

    const body = await request.json();
    const itemName = String(body.itemName ?? "").trim();
    if (!itemName) return jsonError("Item name is required.");

    const priceResult = parseFiniteNumber(body.price, "price");
    if (!priceResult.ok || priceResult.value < 0) {
      return jsonError("Valid price is required.");
    }

    const purchaseDateResult = parseOptionalDate(body.purchaseDate);
    if (!purchaseDateResult.ok) return jsonError(purchaseDateResult.error);
    const purchaseDate = purchaseDateResult.value ?? new Date();

    let returnWindowDays: number | null = null;
    if (body.returnWindowDays !== undefined && body.returnWindowDays !== "") {
      const rw = parsePositiveInt(body.returnWindowDays, "return window days");
      if (!rw.ok) return jsonError(rw.error);
      returnWindowDays = rw.value;
    } else if (body.retailer) {
      const policy = lookupReturnPolicy(String(body.retailer));
      returnWindowDays = policy.returnWindowDays;
    }

    let returnDeadline: Date | null = null;
    const returnDeadlineResult = parseOptionalDate(body.returnDeadline);
    if (!returnDeadlineResult.ok) return jsonError(returnDeadlineResult.error);
    returnDeadline = returnDeadlineResult.value;

    if (!returnDeadline && returnWindowDays && returnWindowDays > 0) {
      returnDeadline = computeReturnDeadline(purchaseDate, returnWindowDays);
    }

    const warrantyResult = parseOptionalDate(body.warrantyDeadline);
    if (!warrantyResult.ok) return jsonError(warrantyResult.error);
    let warrantyDeadline = warrantyResult.value;
    if (!warrantyDeadline && body.retailer && returnWindowDays) {
      const policy = lookupReturnPolicy(String(body.retailer));
      warrantyDeadline = computeWarrantyDeadline(
        purchaseDate,
        policy.warrantyDays ?? 0
      );
    }

    const purchase = await prisma.purchase.create({
      data: {
        userId: user.id,
        itemName,
        retailer: body.retailer ? String(body.retailer).trim() : null,
        sku: body.sku ? String(body.sku).trim() : null,
        category: body.category ? String(body.category).trim() : null,
        price: priceResult.value,
        currency: body.currency ? String(body.currency) : "USD",
        purchaseDate,
        returnDeadline,
        warrantyDeadline,
        returnWindowDays: returnWindowDays ?? undefined,
        notes: body.notes ? String(body.notes) : null,
        status: "active",
      },
    });

    if (purchase.returnDeadline) {
      await createReturnAlertsForPurchase(user.id, purchase);
    }

    return jsonOk({ purchase }, 201);
  } catch (e) {
    return handleRouteError(e, "purchase create");
  }
}
