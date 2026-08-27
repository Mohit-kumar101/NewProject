/**
 * Growth focus clusters — Fitness + Money milestones.
 * Used for hub pages, related-tool ranking, and internal linking.
 */

export type GrowthClusterId = "fitness" | "money";

export type GrowthCluster = {
  id: GrowthClusterId;
  slug: string;
  href: string;
  title: string;
  h1: string;
  description: string;
  seoKeywords: string[];
  /** Primary tool slugs in recommended order */
  toolSlugs: string[];
  workflowSlug?: string;
};

export const GROWTH_CLUSTERS: GrowthCluster[] = [
  {
    id: "fitness",
    slug: "fitness-planners",
    href: "/hubs/fitness-planners",
    title: "Fitness planners",
    h1: "Free Fitness Macro & Phase Planners",
    description:
      "Bulk, cut, reverse diet, and recomp planners that adjust calories and macros to your training — free, instant, no sign up.",
    seoKeywords: [
      "bulk cut macro calculator",
      "reverse diet calculator",
      "body recomposition calculator",
      "TDEE macro planner",
      "free fitness calculators",
    ],
    toolSlugs: [
      "bulk-cut-macro-planner",
      "reverse-diet-planner",
      "body-recomposition-planner",
      "tdee-calculator-weight-loss",
      "calorie-deficit-calculator",
      "protein-intake-calculator",
      "weight-gain-calorie-surplus-calculator",
      "ai-nutrition-calorie-calculator",
    ],
    workflowSlug: "fitness-phase",
  },
  {
    id: "money",
    slug: "money-milestones",
    href: "/hubs/money-milestones",
    title: "Money milestones",
    h1: "Free Money Milestone & Runway Planners",
    description:
      "Emergency fund, multi-goal savings, subscriptions, FIRE, and freelance true-rate planners — free tools for cashflow clarity.",
    seoKeywords: [
      "emergency fund calculator",
      "savings goal calculator",
      "FIRE calculator",
      "subscription spending calculator",
      "freelance rate calculator",
    ],
    toolSlugs: [
      "emergency-fund-runway-planner",
      "multi-goal-savings-planner",
      "subscription-runway-audit",
      "financial-freedom-property-planner",
      "fire-early-retirement-calculator",
      "compound-interest-calculator",
      "freelance-true-rate-planner",
      "wedding-budget-cashflow-planner",
      "baby-first-year-cost-planner",
      "keep-lease-buy-car-tco",
    ],
    workflowSlug: "money-runway",
  },
];

const slugToCluster = new Map<string, GrowthCluster>();
for (const cluster of GROWTH_CLUSTERS) {
  for (const toolSlug of cluster.toolSlugs) {
    slugToCluster.set(toolSlug, cluster);
  }
}

export function getGrowthClusterById(
  id: GrowthClusterId
): GrowthCluster | undefined {
  return GROWTH_CLUSTERS.find((c) => c.id === id);
}

export function getGrowthClusterForSlug(
  toolSlug: string
): GrowthCluster | undefined {
  return slugToCluster.get(toolSlug);
}

export function getClusterMateSlugs(
  toolSlug: string,
  limit = 6
): string[] {
  const cluster = slugToCluster.get(toolSlug);
  if (!cluster) return [];
  return cluster.toolSlugs.filter((s) => s !== toolSlug).slice(0, limit);
}

/** Featured on home / footer for traffic focus */
export const FEATURED_PLANNER_SLUGS = [
  "bulk-cut-macro-planner",
  "reverse-diet-planner",
  "body-recomposition-planner",
  "emergency-fund-runway-planner",
  "multi-goal-savings-planner",
  "freelance-true-rate-planner",
  "financial-freedom-property-planner",
  "subscription-runway-audit",
] as const;
