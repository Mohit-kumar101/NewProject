import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalculatorWorkspace } from "@/components/CalculatorWorkspace";
import { ToolPageShell } from "@/components/ToolPageShell";
import { categoryToSlug } from "@/lib/categoryPaths";
import {
  CATEGORY_PATH_READY_TOOLS,
  getCategoryPathToolBySlug,
} from "@/lib/categoryPathTools";
import { getRelatedCalculators } from "@/lib/calculators";
import { buildToolMetadata } from "@/lib/seo";

/**
 * Category-prefixed tool pages: `/tools/{category}/{toolSlug}`
 * First segment must be named `slug` to match `tools/[slug]/page.tsx`
 * (Next.js disallows sibling dynamic segments with different names).
 */
type PageProps = {
  params: Promise<{ slug: string; toolSlug: string }>;
};

export function generateStaticParams() {
  return CATEGORY_PATH_READY_TOOLS.filter((tool) => tool.useCategoryPath).map(
    (tool) => ({
      slug: categoryToSlug(tool.category),
      toolSlug: tool.slug,
    })
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug: category, toolSlug } = await params;
  const tool = getCategoryPathToolBySlug(toolSlug);
  if (!tool || categoryToSlug(tool.category) !== category) {
    return { title: "Calculator Not Found" };
  }
  return buildToolMetadata(tool);
}

export default async function CategoryToolPage({ params }: PageProps) {
  const { slug: category, toolSlug } = await params;
  const calculator = getCategoryPathToolBySlug(toolSlug);
  if (
    !calculator ||
    calculator.ready === false ||
    categoryToSlug(calculator.category) !== category
  ) {
    notFound();
  }

  const related = getRelatedCalculators(calculator, 6);

  return (
    <ToolPageShell
      calculator={calculator}
      related={related}
      workspace={
        <CalculatorWorkspace calculator={calculator} related={related} />
      }
    />
  );
}
