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

/** Hyper-niche 50-tool pack — five pSEO directory categories. */
export const CRAFTERS_MAKERS_CATEGORY = "Crafters, Makers & DIY" as const;
export const SPECIALIZED_PETS_CATEGORY = "Specialized Pets & Aquatics" as const;
export const GIG_ECONOMY_CATEGORY = "Gig Economy & Content Creators" as const;
export const HOMESTEADING_CATEGORY = "Homesteading & Micro-Gardening" as const;
export const NICHE_EVENTS_CATEGORY = "Event Planning & Niche Hobbies" as const;

export const NICHE50_HUB_CATEGORIES = [
  CRAFTERS_MAKERS_CATEGORY,
  SPECIALIZED_PETS_CATEGORY,
  GIG_ECONOMY_CATEGORY,
  HOMESTEADING_CATEGORY,
  NICHE_EVENTS_CATEGORY,
] as const;

/** Skilled-trades niche pack — HVAC, plumbing, electrical, roofing, construction. */
export const HVAC_TRADES_CATEGORY = "HVAC & Climate Control" as const;
export const PLUMBING_TRADES_CATEGORY = "Plumbing & Piping" as const;
export const ELECTRICAL_TRADES_CATEGORY = "Electrical & Wiring" as const;
export const ROOFING_TRADES_CATEGORY = "Roofing & Exterior" as const;
export const CONSTRUCTION_TRADES_CATEGORY = "Construction & Bidding" as const;
export const LANDSCAPING_TRADES_CATEGORY = "Landscaping & Hardscape" as const;
export const MASONRY_TRADES_CATEGORY = "Masonry & Concrete" as const;

export const TRADES_NICHE_HUB_CATEGORIES = [
  HVAC_TRADES_CATEGORY,
  PLUMBING_TRADES_CATEGORY,
  ELECTRICAL_TRADES_CATEGORY,
  ROOFING_TRADES_CATEGORY,
  CONSTRUCTION_TRADES_CATEGORY,
  LANDSCAPING_TRADES_CATEGORY,
  MASONRY_TRADES_CATEGORY,
] as const;

/** Tech & engineering calculator pack — networking, dev, cloud, hardware, SEO. */
export const NETWORKING_IT_CATEGORY = "Networking & IT Infrastructure" as const;
export const SOFTWARE_DEV_CATEGORY = "Software Development & Programming" as const;
export const CLOUD_AI_CATEGORY = "Cloud Computing & AI Tech" as const;
export const ELECTRONICS_HW_CATEGORY = "Electronics & Hardware Engineering" as const;
export const DIGITAL_SEO_CATEGORY = "Digital Tech & SEO Marketing" as const;

export const TECH_NICHE_HUB_CATEGORIES = [
  NETWORKING_IT_CATEGORY,
  SOFTWARE_DEV_CATEGORY,
  CLOUD_AI_CATEGORY,
  ELECTRONICS_HW_CATEGORY,
  DIGITAL_SEO_CATEGORY,
] as const;

export type ExpansionCategory = (typeof EXPANSION_CATEGORIES)[number];
export type LongtailHubCategory = (typeof LONGTAIL_HUB_CATEGORIES)[number];
export type Intent80HubCategory = (typeof INTENT80_HUB_CATEGORIES)[number];
export type Niche65HubCategory = (typeof NICHE65_HUB_CATEGORIES)[number];
export type AffordabilityHubCategory =
  (typeof AFFORDABILITY_HUB_CATEGORIES)[number];
export type HealthHubCategory = (typeof HEALTH_HUB_CATEGORIES)[number];
export type Niche50HubCategory = (typeof NICHE50_HUB_CATEGORIES)[number];
export type TradesNicheHubCategory = (typeof TRADES_NICHE_HUB_CATEGORIES)[number];
export type TechNicheHubCategory = (typeof TECH_NICHE_HUB_CATEGORIES)[number];
