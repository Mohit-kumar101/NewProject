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
          One configurable engine powers high-intent affordability pages across
          six category hubs. Each ready page ships with preset targets, dynamic
          metadata, FAQ schema, and the matching rule of thumb.
        </p>
        <p className="mt-3 text-sm text-[var(--muted)]">
          {ready.length} live pages · {todoCount} taxonomy slugs marked TODO
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        {AFFORDABILITY_CATEGORIES.map((category) => {
          const pages = ready.filter((p) => p.category === category.id);
          return (
            <Link
              key={category.id}
              href={getAffordabilityCategoryHref(category.slug)}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 transition hover:border-[var(--accent)]"
            >
              <h2 className="font-[family-name:var(--font-display)] text-lg font-bold tracking-tight">
                {category.name}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                {category.description}
              </p>
              <p className="mt-3 text-xs font-semibold tracking-[0.12em] text-[var(--accent)] uppercase">
                {pages.length} live · rule {category.defaultRuleSet}
              </p>
            </Link>
          );
        })}
      </section>

      <section className="mt-14 max-w-3xl space-y-4">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight">
          Featured calculators
        </h2>
        <ul className="grid gap-3">
          {ready.map((page) => (
            <li key={page.slug}>
              <Link
                href={getAffordabilityHref(page)}
                className="flex flex-col gap-1 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 transition hover:border-[var(--accent)] sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="font-medium">{page.title}</span>
                <span className="font-mono text-[11px] text-[var(--muted)]">
                  /affordability/{page.category}/{page.slug}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </ToolLayout>
  );
}
