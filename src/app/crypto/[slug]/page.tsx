import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalculatorWorkspace } from "@/components/CalculatorWorkspace";
import { ToolPageShell } from "@/components/ToolPageShell";
import { getCalculatorBySlug, getRelatedCalculators } from "@/lib/calculators";
import { CRYPTO_SHORT_SLUGS } from "@/lib/cryptoFormulas";
import { buildToolMetadata } from "@/lib/seo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return Object.keys(CRYPTO_SHORT_SLUGS).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const toolSlug = CRYPTO_SHORT_SLUGS[slug];
  if (!toolSlug) {
    return { title: "Crypto Calculator Not Found" };
  }
  const calculator = getCalculatorBySlug(toolSlug);
  if (!calculator) {
    return { title: "Crypto Calculator Not Found" };
  }

  return buildToolMetadata(calculator);
}

export default async function CryptoToolPage({ params }: PageProps) {
  const { slug } = await params;
  const toolSlug = CRYPTO_SHORT_SLUGS[slug];
  if (!toolSlug) notFound();

  const calculator = getCalculatorBySlug(toolSlug);
  if (!calculator) notFound();

  const related = getRelatedCalculators(calculator, 6);

  return (
    <ToolPageShell
      calculator={calculator}
      workspace={
        <CalculatorWorkspace calculator={calculator} related={related} />
      }
    />
  );
}
