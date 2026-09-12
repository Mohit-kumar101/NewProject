/**
 * Growth focus clusters — Fitness + Money milestones.
 * Used for hub pages, related-tool ranking, and internal linking.
 */

export type GrowthClusterId = "fitness" | "money" | "life";

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
      "when-can-i-retire",
      "how-much-money-do-i-need-to-retire",
      "how-long-will-my-money-last",
    ],
    workflowSlug: "money-runway",
  },
  {
    id: "life",
    slug: "life-questions",
    href: "/hubs/life-questions",
    title: "Life questions",
    h1: "When Can I Retire — and What Does the Rest of Life Add Up To?",
    description:
      "Question-led calculators for retirement timing, days you have already lived, small money habits, and how long you have been with someone. Planning estimates, not fortune-telling.",
    seoKeywords: [
      "when can I retire calculator",
      "how many days have I been alive",
      "how long will my money last",
      "days we have been together",
      "first 100k calculator",
    ],
    toolSlugs: [
      "when-can-i-retire",
      "how-long-will-my-money-last",
      "how-much-money-do-i-need-to-retire",
      "how-many-days-have-i-been-alive",
      "weekends-left-until-80",
      "if-i-invested-100-every-month",
      "how-long-to-save-first-100k",
      "if-i-stop-spending-10-a-day",
      "days-we-have-been-together",
      "days-until-1000th-day-together",
    ],
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
  "when-can-i-retire",
  "how-many-days-have-i-been-alive",
] as const;
