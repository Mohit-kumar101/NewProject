import calculatorsData from "../../data/calculators.json";
import type { Calculator } from "./types";

export const calculators = calculatorsData as Calculator[];

export const CATEGORIES = [
  "Loans & Debt Management",
  "Real Estate & Housing",
  "Investing & Wealth Building",
  "Freelance & Self-Employment",
  "Everyday Utilities & Savings",
  "Education, GPA & Academic",
  "Statistics, Probability & Advanced Math",
  "Legal, HR & Payroll Management",
  "Automotive, Travel & Transit",
  "Media, Photography, Cooking & Lifestyle",
] as const;

export function getCalculatorBySlug(slug: string): Calculator | undefined {
  return calculators.find((c) => c.slug === slug);
}

export function getCalculatorsByCategory(category: string): Calculator[] {
  return calculators.filter((c) => c.category === category);
}

export function getRelatedCalculators(
  calculator: Calculator,
  limit = 6
): Calculator[] {
  const stop = new Set([
    "and",
    "the",
    "for",
    "with",
    "from",
    "your",
    "calculator",
    "online",
    "free",
  ]);
  const keywords = calculator.title
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 2 && !stop.has(w));

  const sameCategory = calculators.filter(
    (c) => c.category === calculator.category && c.slug !== calculator.slug
  );

  const scored = sameCategory
    .map((c) => {
      const haystack = `${c.title} ${c.description} ${c.slug}`.toLowerCase();
      const score = keywords.reduce(
        (sum, word) => sum + (haystack.includes(word) ? 1 : 0),
        0
      );
      return { c, score };
    })
    .sort((a, b) => b.score - a.score || a.c.title.localeCompare(b.c.title));

  // Prefer 6 related tools; always at least 4 when available
  const target = Math.min(Math.max(limit, 4), 6);
  return scored.slice(0, target).map((s) => s.c);
}

export function searchCalculators(query: string): Calculator[] {
  const q = query.trim().toLowerCase();
  if (!q) return calculators;
  return calculators.filter(
    (c) =>
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.slug.includes(q)
  );
}

export const SITE_URL = "https://calculiohub.com";
export const SITE_NAME = "CalculioHub";
export const SITE_SUPPORT_EMAIL = "calculiohub.support@gmail.com";
