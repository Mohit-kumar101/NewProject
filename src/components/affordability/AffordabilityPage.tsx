import Link from "next/link";
import { FaqAccordion } from "@/components/FaqAccordion";
import { ToolLayout } from "@/components/layouts/ToolLayout";
import { ToolSearchFooter } from "@/components/ToolSearchFooter";
import { AffordabilityEngine } from "@/components/affordability/AffordabilityEngine";
import { AffordabilityJsonLd } from "@/components/affordability/AffordabilityJsonLd";
import { AffordabilityRuleSection } from "@/components/affordability/AffordabilityRuleSection";
import { AFFORDABILITY_DISPLAY_CATEGORY } from "@/lib/categoryPaths";
import {
  getAffordabilityCategory,
  getAffordabilityCategoryHref,
  getAffordabilityPages,
  getAffordabilityHref,
} from "@/lib/affordability/catalog";
import { buildAffordabilityFaqs } from "@/lib/affordability/faqs";
import type { AffordabilityPageConfig } from "@/lib/affordability/types";

export function AffordabilityPage({
  page,
}: {
  page: AffordabilityPageConfig;
}) {
  const category = getAffordabilityCategory(page.category);
  const faqs = buildAffordabilityFaqs(page);
  const relatedPages = getAffordabilityPages({ readyOnly: true }).filter(
    (p) => p.slug !== page.slug
  );

  return (
    <ToolLayout>
      <AffordabilityJsonLd page={page} />

      <nav
        aria-label="Breadcrumb"
        className="mb-6 text-sm text-[var(--muted)]"
      >
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-[var(--accent)]">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              href="/affordability"
              className="hover:text-[var(--accent)]"
            >
              Affordability
            </Link>
          </li>
          {category ? (
            <>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href={getAffordabilityCategoryHref(category.slug)}
                  className="hover:text-[var(--accent)]"
                >
                  {category.name}
                </Link>
              </li>
            </>
          ) : null}
          <li aria-hidden="true">/</li>
          <li className="text-[var(--foreground)]">{page.h1}</li>
        </ol>
      </nav>

      <header className="mb-8 max-w-3xl">
        <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-[var(--accent)] uppercase">
          Can I Afford…? · Free · No sign up · Instant
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
          {page.h1}
        </h1>
        {category ? (
          <p className="mt-2 text-sm text-[var(--muted)]">{category.name}</p>
        ) : null}
        <p className="mt-4 text-base leading-relaxed text-[color-mix(in_srgb,var(--foreground)_78%,var(--muted))] sm:text-lg">
          {page.seoContent.intro}
        </p>
      </header>

      <AffordabilityEngine page={page} />

      <AffordabilityRuleSection ruleSet={page.ruleSet} />

      <section className="mt-16 max-w-3xl space-y-4">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight">
          How to use this calculator
        </h2>
        <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-[color-mix(in_srgb,var(--foreground)_78%,var(--muted))] sm:text-base">
          {page.seoContent.howToUse.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <section className="mt-16 max-w-3xl">
        <h2 className="mb-5 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight">
          Frequently Asked Questions
        </h2>
        <FaqAccordion faqs={faqs} />
      </section>

      {relatedPages.length > 0 && (
        <section className="mt-16 max-w-3xl space-y-4">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight">
            Related affordability checks
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {relatedPages.slice(0, 6).map((related) => (
              <li key={related.slug}>
                <Link
                  href={getAffordabilityHref(related)}
                  className="block rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm font-medium transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                >
                  {related.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <ToolSearchFooter
        currentCategory={AFFORDABILITY_DISPLAY_CATEGORY}
        currentSlug={page.slug}
      />
    </ToolLayout>
  );
}
