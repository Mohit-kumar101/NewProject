import type { Metadata } from "next";
import { PresentationStudio } from "@/components/presentation/PresentationStudio";
import { getCalculatorBySlug, SITE_NAME } from "@/lib/calculators";
import { buildPageMetadata } from "@/lib/pageMetadata";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ scenario?: string; template?: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getCalculatorBySlug(slug);
  const title = tool
    ? `${tool.title} presentation`
    : "Scenario presentation";
  return buildPageMetadata({
    title,
    description: `Preview and download a multi-slide presentation with charts for ${
      tool?.title ?? "your calculator scenario"
    } on ${SITE_NAME}.`,
    path: `/presentation/${slug}`,
    noIndex: true,
  });
}

export default async function PresentationPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params;
  const sp = await searchParams;
  return (
    <PresentationStudio
      slug={slug}
      scenarioRaw={sp.scenario ?? null}
      initialTemplate={sp.template ?? null}
    />
  );
}
