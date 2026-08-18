/** Category display name → URL slug used in `/tools/{category}/{slug}` paths. */
export function categoryToSlug(category: string): string {
  return category
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** New categories introduced by the 33-tool expansion pack. */
export const EXPANSION_CATEGORIES = [
  "Canadian Taxes",
  "E-commerce Fees",
  "Living Expenses",
] as const;

/**
 * Long-tail hub categories for shift/commute/housing/food pSEO tools.
 * Wired into CATEGORIES, HomeExplorer, and /tools index.
 */
export const LONGTAIL_HUB_CATEGORIES = [
  "Shift Work & Payroll",
  "Commute & Vehicle Costs",
  "Short-term Rental & Housing",
  "Food & Meal Planning",
] as const;

/** Intent-80 high-search hubs (appliances, payroll, roommates, catering, etc.). */
export const INTENT80_HUB_CATEGORIES = [
  "Home & Appliance Utilities",
  "Payroll & Shift Work",
  "Rent & Roommate Splits",
  "Freelance & Micro-Business",
  "Food & Catering Business",
] as const;

/** Niche-65 hubs (logistics, pets, remote work, trades, hospitality). */
export const NICHE65_HUB_CATEGORIES = [
  "E-Commerce, Logistics & Storage",
  "Home Utilities, Appliances & Specialty Amenities",
  "Pet Care & Household Expenses",
  "Remote Work & Home Office",
  "Local Services & Trade Pricing",
  "Events, Hospitality & Micro-Business",
] as const;

/**
 * Single directory category for every “Can I Afford…?” tool.
 * Internal pSEO hubs still live under `/affordability/{hub}/{slug}`.
 */
export const AFFORDABILITY_DISPLAY_CATEGORY = "Can I Afford…?" as const;

export const AFFORDABILITY_HUB_CATEGORIES = [
  AFFORDABILITY_DISPLAY_CATEGORY,
] as const;

/** Single directory category for the 48-tool health calculator pack. */
export const HEALTH_DISPLAY_CATEGORY = "Health, Fitness & Wellness" as const;

export const HEALTH_HUB_CATEGORIES = [
  HEALTH_DISPLAY_CATEGORY,
] as const;

export type ExpansionCategory = (typeof EXPANSION_CATEGORIES)[number];
export type LongtailHubCategory = (typeof LONGTAIL_HUB_CATEGORIES)[number];
export type Intent80HubCategory = (typeof INTENT80_HUB_CATEGORIES)[number];
export type Niche65HubCategory = (typeof NICHE65_HUB_CATEGORIES)[number];
export type AffordabilityHubCategory =
  (typeof AFFORDABILITY_HUB_CATEGORIES)[number];
export type HealthHubCategory = (typeof HEALTH_HUB_CATEGORIES)[number];
