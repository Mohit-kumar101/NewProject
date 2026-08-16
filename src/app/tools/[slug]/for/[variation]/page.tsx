import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalculatorWorkspace } from "@/components/CalculatorWorkspace";
import { ToolPageShell } from "@/components/ToolPageShell";
import {
  getAllKeywordPacks,
  getKeywordVariation,
  getRoutableVariations,
} from "@/lib/keywords";
import {
  getCalculatorBySlug,
  getRelatedCalculators,
} from "@/lib/calculators";
import { buildToolMetadata } from "@/lib/seo";

type PageProps = {
  params: Promise<{ slug: string; variation: string }>;
};

export function generateStaticParams() {
  const packs = getAllKeywordPacks();
  const params: Array<{ slug: string; variation: string }> = [];

  for (const slug of Object.keys(packs)) {
    for (const variation of getRoutableVariations(slug)) {
      params.push({ slug, variation: variation.slug });
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug, variation: variationSlug } = await params;
  const calculator = getCalculatorBySlug(slug);
  const variation = getKeywordVariation(slug, variationSlug);
  if (!calculator || !variation) {
    return { title: "Calculator Not Found" };
  }
  return buildToolMetadata(calculator, variation);
}

export default async function ToolKeywordVariationPage({ params }: PageProps) {
  const { slug, variation: variationSlug } = await params;
  const calculator = getCalculatorBySlug(slug);
  const variation = getKeywordVariation(slug, variationSlug);
  if (!calculator || !variation) notFound();

  const related = getRelatedCalculators(calculator, 6);

  return (
    <ToolPageShell
      calculator={calculator}
      variation={variation}
      related={related}
      workspace={
        <CalculatorWorkspace calculator={calculator} related={related} />
      }
    />
  );
}
