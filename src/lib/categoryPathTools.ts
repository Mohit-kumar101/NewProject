/**
 * Unified registry for `/tools/{category}/{slug}` pSEO tools
 * (expansion + long-tail + intent-80 + niche-65 hubs).
 */

import type { Calculator, LongTailModifier } from "@/lib/types";
import {
  EXPANSION_READY_TOOLS,
  EXPANSION_SLUGS,
  EXPANSION_TOOLS,
  getExpansionToolBySlug,
  getRoutableLongTailModifiers,
} from "@/lib/expansion/tools";
import {
  LONGTAIL_HUB_READY_TOOLS,
  LONGTAIL_HUB_SLUGS,
  LONGTAIL_HUB_TOOLS,
  getLongtailHubToolBySlug,
} from "@/lib/hubs/longTailPack";
import {
  INTENT80_READY_TOOLS,
  INTENT80_SLUGS,
  INTENT80_TOOLS,
  getIntent80ToolBySlug,
} from "@/lib/hubs/intent80Pack";
import {
  NICHE65_READY_TOOLS,
  NICHE65_SLUGS,
  NICHE65_TOOLS,
  getNiche65ToolBySlug,
} from "@/lib/hubs/niche65Pack";

import {
  HEALTH_READY_TOOLS,
  HEALTH_SLUGS,
  HEALTH_TOOLS,
  getHealthToolBySlug,
} from "@/lib/hubs/healthPack";
import {
  NICHE50_READY_TOOLS,
  NICHE50_SLUGS,
  NICHE50_TOOLS,
  getNiche50ToolBySlug,
} from "@/lib/hubs/niche50Pack";
import {
  TRADES_NICHE_READY_TOOLS,
  TRADES_NICHE_SLUGS,
  TRADES_NICHE_TOOLS,
  getTradesNicheToolBySlug,
} from "@/lib/hubs/tradesNichePack";
import {
  TECH_NICHE_READY_TOOLS,
  TECH_NICHE_SLUGS,
  TECH_NICHE_TOOLS,
  getTechNicheToolBySlug,
} from "@/lib/hubs/techNichePack";
import {
  ADVANCED_TOOLS,
  ADVANCED_CATEGORY_PATH_SLUGS,
  getAdvancedToolBySlug,
} from "@/lib/hubs/advancedToolsPack";
import {
  GLOBAL_PLANNER_TOOLS,
  GLOBAL_CATEGORY_PATH_SLUGS,
  getGlobalPlannerBySlug,
} from "@/lib/hubs/globalPlannersPack";

export const CATEGORY_PATH_READY_TOOLS: Calculator[] = [
  ...EXPANSION_READY_TOOLS,
  ...LONGTAIL_HUB_READY_TOOLS,
  ...INTENT80_READY_TOOLS,
  ...NICHE65_READY_TOOLS,
  ...HEALTH_READY_TOOLS,
  ...NICHE50_READY_TOOLS,
  ...TRADES_NICHE_READY_TOOLS,
  ...TECH_NICHE_READY_TOOLS,
  ...ADVANCED_TOOLS.filter((t) => t.useCategoryPath),
  ...GLOBAL_PLANNER_TOOLS.filter((t) => t.useCategoryPath),
];

export const CATEGORY_PATH_ALL_TOOLS: Calculator[] = [
  ...EXPANSION_TOOLS,
  ...LONGTAIL_HUB_TOOLS,
  ...INTENT80_TOOLS,
  ...NICHE65_TOOLS,
  ...HEALTH_TOOLS,
  ...NICHE50_TOOLS,
  ...TRADES_NICHE_TOOLS,
  ...TECH_NICHE_TOOLS,
  ...ADVANCED_TOOLS.filter((t) => t.useCategoryPath),
  ...GLOBAL_PLANNER_TOOLS.filter((t) => t.useCategoryPath),
];

export const CATEGORY_PATH_SLUGS = new Set([
  ...EXPANSION_SLUGS,
  ...LONGTAIL_HUB_SLUGS,
  ...INTENT80_SLUGS,
  ...NICHE65_SLUGS,
  ...HEALTH_SLUGS,
  ...NICHE50_SLUGS,
  ...TRADES_NICHE_SLUGS,
  ...TECH_NICHE_SLUGS,
  ...ADVANCED_CATEGORY_PATH_SLUGS,
  ...GLOBAL_CATEGORY_PATH_SLUGS,
]);

/** Prefer newer hub packs when slugs overlap. */
export function getCategoryPathToolBySlug(
  slug: string
): Calculator | undefined {
  return (
    getGlobalPlannerBySlug(slug) ??
    getAdvancedToolBySlug(slug) ??
    getTechNicheToolBySlug(slug) ??
    getTradesNicheToolBySlug(slug) ??
    getNiche50ToolBySlug(slug) ??
    getHealthToolBySlug(slug) ??
    getNiche65ToolBySlug(slug) ??
    getIntent80ToolBySlug(slug) ??
    getLongtailHubToolBySlug(slug) ??
    getExpansionToolBySlug(slug)
  );
}

export function getCategoryPathModifiers(
  tool: Calculator
): LongTailModifier[] {
  return getRoutableLongTailModifiers(tool);
}
