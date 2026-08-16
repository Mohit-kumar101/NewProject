import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalculatorWorkspace } from "@/components/CalculatorWorkspace";
import { ToolPageShell } from "@/components/ToolPageShell";
import { categoryToSlug } from "@/lib/categoryPaths";
import {
  CATEGORY_PATH_READY_TOOLS,
  getCategoryPathModifiers,
  getCategoryPathToolBySlug,
} from "@/lib/categoryPathTools";
import { getRelatedCalculators } from "@/lib/calculators";
import { buildToolMetadata } from "@/lib/seo";

/**
 * Long-tail modifier pages: `/tools/{category}/{toolSlug}/{modifier}`
 * First segment is `slug` (category) to satisfy Next.js dynamic-segment naming.
 */
type PageProps = {
  params: Promise<{ slug: string; toolSlug: string; modifier: string }>;
};

export function generateStaticParams() {
  return CATEGORY_PATH_READY_TOOLS.flatMap((tool) => {
    if (!tool.useCategoryPath) return [];
    const category = categoryToSlug(tool.category);
    return getCategoryPathModifiers(tool).map((modifier) => ({
      slug: category,
      toolSlug: tool.slug,
      modifier: modifier.slug,
    }));
  });
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug: category, toolSlug, modifier: modifierSlug } = await params;
  const tool = getCategoryPathToolBySlug(toolSlug);
  const modifier = tool
    ? getCategoryPathModifiers(tool).find((item) => item.slug === modifierSlug)
    : undefined;
  if (!tool || !modifier || categoryToSlug(tool.category) !== category) {
    return { title: "Calculator Not Found" };
  }
  return buildToolMetadata(tool, undefined, modifier);
}

export default async function CategoryToolModifierPage({ params }: PageProps) {
  const { slug: category, toolSlug, modifier: modifierSlug } = await params;
  const calculator = getCategoryPathToolBySlug(toolSlug);
  const modifier = calculator
    ? getCategoryPathModifiers(calculator).find(
        (item) => item.slug === modifierSlug
      )
    : undefined;

  if (
    !calculator ||
    !modifier ||
    calculator.ready === false ||
    categoryToSlug(calculator.category) !== category
  ) {
    notFound();
  }

  const related = getRelatedCalculators(calculator, 6);

  return (
    <ToolPageShell
      calculator={calculator}
      modifier={modifier}
      related={related}
      workspace={
        <CalculatorWorkspace calculator={calculator} related={related} />
      }
    />
  );
}
