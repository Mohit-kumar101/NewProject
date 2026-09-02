export type VaultlineUser = {
  id: string;
  email: string;
  name: string | null;
  tier: string;
};

export type ReturnPolicy = {
  merchantKey: string;
  displayName: string;
  returnWindowDays: number;
  warrantyDays?: number;
  priceMatchDays?: number;
};

export type DashboardAlert = {
  id: string;
  type: string;
  title: string;
  body: string;
  templateBody?: string | null;
  urgency: string;
  status: string;
  dueAt: string;
  daysLeft: number;
  purchaseId?: string | null;
  subscriptionId?: string | null;
  persisted?: boolean;
};

export type DashboardPurchase = {
  id: string;
  itemName: string;
  retailer: string | null;
  price: number;
  purchaseDate: string;
  returnDeadline: string | null;
  returnWindowDays: number | null;
  category: string | null;
  sku: string | null;
  daysLeft: number | null;
};

export type DashboardSubscription = {
  id: string;
  name: string;
  cost: number;
  billingCycle: string;
  nextRenewalDate: string;
  daysLeft: number;
};
