import type { AffordabilityFaq } from "./types";
import type { AffordabilityPageConfig } from "./types";
import {
  getRuleExplainer,
  type AffordabilityRuleSet,
} from "@/lib/formulas_affordability";

/**
 * Ensure FAQPage schema always features the exact intent question
 * plus a rule-of-thumb explainer for the page’s category.
 */
export function buildAffordabilityFaqs(
  page: AffordabilityPageConfig
): AffordabilityFaq[] {
  const rule = getRuleExplainer(page.ruleSet);
  const fromConfig = page.seoContent.faqs ?? [];
  const hasIntent = fromConfig.some(
    (f) =>
      f.question.toLowerCase() === page.intentQuestion.toLowerCase()
  );

  const intentFaq: AffordabilityFaq = {
    question: page.intentQuestion,
    answer:
      fromConfig.find(
        (f) =>
          f.question.toLowerCase() === page.intentQuestion.toLowerCase()
      )?.answer ??
      `${page.seoContent.intro} Use the live Affordability Engine above for numbers tailored to your income.`,
  };

  const ruleFaq: AffordabilityFaq = {
    question: `What is the ${rule.title.replace(/^The\s+/i, "")}?`,
    answer: `${rule.summary} ${rule.bullets[0] ?? ""}`.trim(),
  };

  const merged: AffordabilityFaq[] = [];
  if (!hasIntent) merged.push(intentFaq);
  merged.push(...fromConfig);

  const hasRule = merged.some((f) =>
    f.question.toLowerCase().includes(ruleTitleKey(page.ruleSet))
  );
  if (!hasRule) merged.push(ruleFaq);

  return merged.slice(0, 8);
}

function ruleTitleKey(ruleSet: AffordabilityRuleSet): string {
  switch (ruleSet) {
    case "auto-20-4-10":
      return "20/4/10";
    case "housing-28-36":
      return "28/36";
    case "rent-30":
      return "30%";
    case "fifty-30-20":
      return "50/30/20";
    case "cash-cushion":
      return "cash cushion";
    case "debt-payoff":
      return "debt";
    default:
      return "afford";
  }
}
