import type { Metadata } from "next";
import Link from "next/link";
import { ToolLayout } from "@/components/layouts/ToolLayout";
import { SITE_NAME, SITE_URL } from "@/lib/calculators";
import {
  AFFORDABILITY_CATEGORIES,
  getAffordabilityCategoryHref,
  getAffordabilityHref,
  getAffordabilityPages,
  getAffordabilityTodos,
} from "@/lib/affordability/catalog";
import {
  DEFAULT_OG_IMAGE,
  META_DESCRIPTION_MAX,
  clampMetaText,
} from "@/lib/pageMetadata";

const description = clampMetaText(
  "Can I Afford…? Programmatic affordability calculators for cars, houses, rent, weddings, tech, lifestyle, and debt—pre-filled targets with live math.",
  META_DESCRIPTION_MAX
);

export const metadata: Metadata = {
  title: "Can I Afford…? Affordability Calculators",
  description,
  alternates: { canonical: `${SITE_URL}/affordability` },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: "Can I Afford…? Affordability Calculators",
    description,
    url: `${SITE_URL}/affordability`,
    images: [{ ...DEFAULT_OG_IMAGE, alt: "Affordability Calculators" }],
  },
};

export default function AffordabilityHubPage() {
  const ready = getAffordabilityPages({ readyOnly: true });
  const todoCount = getAffordabilityTodos().length;

  return (
    <ToolLayout>
      <header className="mb-12 max-w-3xl">
        <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-[var(--accent)] uppercase">
          Programmatic SEO · Affordability Engine
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
          Can I Afford…?
        </h1>
        <p className="mt-4 text-base leading-relaxed text-[color-mix(in_srgb,var(--foreground)_78%,var(--muted))] sm:text-lg">
          One category, one engine. Check a car, house, wedding, gadget,
          lifestyle cost, or custom purchase against your income—each page ships
          with preset targets, live math, and the matching rule of thumb.
        </p>
        <p className="mt-3 text-sm text-[var(--muted)]">
          {ready.length} live calculators · {todoCount} more coming soon
        </p>
      </header>

      <section className="max-w-3xl space-y-4">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight">
          All calculators
        </h2>
        <ul className="grid gap-3">
          {ready.map((page) => (
            <li key={page.slug}>
              <Link
                href={getAffordabilityHref(page)}
                className="flex flex-col gap-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 py-4 transition hover:border-[var(--accent)]"
              >
                <span className="font-semibold">{page.title}</span>
                <span className="text-sm text-[var(--muted)]">
                  {page.description}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14 max-w-3xl space-y-4">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-bold tracking-tight">
          Browse by topic
        </h2>
        <p className="text-sm text-[var(--muted)]">
          Same tools, grouped by the kind of purchase you are checking.
        </p>
        <ul className="flex flex-wrap gap-2">
          {AFFORDABILITY_CATEGORIES.map((category) => {
            const pages = ready.filter((p) => p.category === category.id);
            return (
              <li key={category.id}>
                <Link
                  href={getAffordabilityCategoryHref(category.slug)}
                  className="inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                >
                  {category.name}
                  {pages.length > 0 ? ` · ${pages.length}` : ""}
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </ToolLayout>
  );
}
