import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AffordabilityPage } from "@/components/affordability/AffordabilityPage";
import {
  generateAffordabilityStaticParams,
  getAffordabilityPage,
} from "@/lib/affordability/catalog";
import { buildAffordabilityMetadata } from "@/lib/affordability/metadata";

/**
 * Programmatic SEO route for the Affordability Engine.
 * Path: /affordability/{category}/{slug}
 *
 * READY: 6 representative pages (1 per category).
 * TODO: enable remaining taxonomyTodos slugs in data/affordability.config.json
 *       (presets + seo + ready:true) — generateStaticParams picks them up automatically.
 */
type PageProps = {
  params: Promise<{ category: string; slug: string }>;
};

export function generateStaticParams() {
  return generateAffordabilityStaticParams();
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const page = getAffordabilityPage(category, slug);
  if (!page) return { title: "Affordability Calculator Not Found" };
  return buildAffordabilityMetadata(page);
}

export default async function AffordabilitySlugPage({ params }: PageProps) {
  const { category, slug } = await params;
  const page = getAffordabilityPage(category, slug);
  if (!page) notFound();
  return <AffordabilityPage page={page} />;
}
