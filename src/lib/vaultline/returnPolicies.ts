import type { ReturnPolicy } from "@/lib/vaultline/types";

export const RETURN_POLICIES: ReturnPolicy[] = [
  {
    merchantKey: "amazon",
    displayName: "Amazon",
    returnWindowDays: 30,
    warrantyDays: 365,
    priceMatchDays: 7,
  },
  {
    merchantKey: "target",
    displayName: "Target",
    returnWindowDays: 90,
    warrantyDays: 365,
    priceMatchDays: 14,
  },
  {
    merchantKey: "walmart",
    displayName: "Walmart",
    returnWindowDays: 90,
    warrantyDays: 365,
    priceMatchDays: 0,
  },
  {
    merchantKey: "bestbuy",
    displayName: "Best Buy",
    returnWindowDays: 15,
    warrantyDays: 365,
    priceMatchDays: 15,
  },
  {
    merchantKey: "costco",
    displayName: "Costco",
    returnWindowDays: 90,
    warrantyDays: 730,
    priceMatchDays: 30,
  },
  {
    merchantKey: "apple",
    displayName: "Apple",
    returnWindowDays: 14,
    warrantyDays: 365,
    priceMatchDays: 14,
  },
  {
    merchantKey: "nordstrom",
    displayName: "Nordstrom",
    returnWindowDays: 45,
    warrantyDays: 0,
    priceMatchDays: 0,
  },
  {
    merchantKey: "home depot",
    displayName: "Home Depot",
    returnWindowDays: 90,
    warrantyDays: 365,
    priceMatchDays: 30,
  },
  {
    merchantKey: "default",
    displayName: "Standard retailer",
    returnWindowDays: 30,
    warrantyDays: 365,
    priceMatchDays: 0,
  },
];

const ALIASES: Record<string, string> = {
  amzn: "amazon",
  "amazon.com": "amazon",
  "target.com": "target",
  "walmart.com": "walmart",
  "best buy": "bestbuy",
  "bestbuy.com": "bestbuy",
  "costco.com": "costco",
  "apple.com": "apple",
  "the home depot": "home depot",
  homedepot: "home depot",
};

function normalizeMerchant(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9\s]/g, " ").trim();
}

export function lookupReturnPolicy(merchantName: string): ReturnPolicy {
  const normalized = normalizeMerchant(merchantName);
  const aliasKey = ALIASES[normalized] ?? normalized;

  for (const policy of RETURN_POLICIES) {
    if (policy.merchantKey === "default") continue;
    if (
      normalized.includes(policy.merchantKey) ||
      aliasKey.includes(policy.merchantKey)
    ) {
      return policy;
    }
  }

  return RETURN_POLICIES.find((p) => p.merchantKey === "default")!;
}

/** Store options for manual purchase entry UI. */
export const STORE_OPTIONS = RETURN_POLICIES.filter(
  (p) => p.merchantKey !== "default"
).map((p) => ({
  value: p.displayName,
  label: p.displayName,
  returnWindowDays: p.returnWindowDays,
}));

export function computeReturnDeadline(
  purchaseDate: Date,
  returnWindowDays: number
): Date {
  const deadline = new Date(purchaseDate);
  deadline.setDate(deadline.getDate() + returnWindowDays);
  return deadline;
}

export function computeWarrantyDeadline(
  purchaseDate: Date,
  warrantyDays: number
): Date | null {
  if (!warrantyDays || warrantyDays <= 0) return null;
  const deadline = new Date(purchaseDate);
  deadline.setDate(deadline.getDate() + warrantyDays);
  return deadline;
}
