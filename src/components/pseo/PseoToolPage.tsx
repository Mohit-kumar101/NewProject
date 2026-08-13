import { FaqAccordion } from "@/components/FaqAccordion";
import { ToolBreadcrumbs } from "@/components/ToolBreadcrumbs";
import { ToolSearchFooter } from "@/components/ToolSearchFooter";
import {
  ToolRailRelated,
  ToolRailSpotlight,
} from "@/components/ads/ToolRailFillers";
import { ToolLayout } from "@/components/layouts/ToolLayout";
import { CalculatorRenderer } from "@/components/pseo/CalculatorRenderer";
import { PseoJsonLd } from "@/components/pseo/PseoJsonLd";
import {
  getCalculatorBySlug,
  getSidebarRelatedTools,
  getSidebarSpotlightTools,
  isBcTaxCalculator,
} from "@/lib/calculators";
import type { PseoTool } from "@/lib/pseo/types";

export function PseoToolPage({ tool }: { tool: PseoTool }) {
  const calculator = getCalculatorBySlug(tool.slug);
  const related = calculator ? getSidebarRelatedTools(calculator, 6) : [];
  const spotlight = calculator ? getSidebarSpotlightTools(calculator, 5) : [];
  const bcTax = isBcTaxCalculator({ slug: tool.slug, category: tool.category });

  return (
    <ToolLayout
      leftAd={
        <ToolRailRelated
          category={bcTax ? "BC Local Taxes" : tool.category}
          tools={related}
        />
      }
      rightAd={
        <ToolRailSpotlight
          tools={spotlight}
          kicker={bcTax ? "Also useful" : "Try next"}
          heading={bcTax ? "Tax & housing" : "Popular calculators"}
        />
      }
    >
      <PseoJsonLd tool={tool} />

      <ToolBreadcrumbs toolTitle={tool.h1} category={tool.category} />

      <header className="mb-8 max-w-3xl">
        <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-[var(--accent)] uppercase">
          Free online tool · No sign up · Instant calculation
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
          {tool.h1}
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">{tool.category}</p>
        <p className="mt-4 text-base leading-relaxed text-[color-mix(in_srgb,var(--foreground)_78%,var(--muted))] sm:text-lg">
          {tool.whatIsIt}
        </p>
      </header>

      <CalculatorRenderer id={tool.id} />

      <section className="mt-16 max-w-3xl space-y-4">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight">
          What is it?
        </h2>
        <p className="text-sm leading-relaxed text-[color-mix(in_srgb,var(--foreground)_78%,var(--muted))] sm:text-base">
          {tool.whatIsIt}
        </p>
      </section>

      <section className="mt-16 max-w-3xl space-y-4">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight">
          The Formula
        </h2>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-4 sm:px-5">
          <p className="text-[11px] font-semibold tracking-[0.14em] text-[var(--accent)] uppercase">
            Governing formula
          </p>
          <p className="mt-2 overflow-x-auto font-mono text-sm leading-relaxed text-[var(--foreground)] sm:text-[15px]">
            {tool.formula}
          </p>
        </div>
      </section>

      <section className="mt-16 max-w-3xl space-y-4">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight">
          Real-World Example
        </h2>
        <p className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm leading-relaxed text-[color-mix(in_srgb,var(--foreground)_78%,var(--muted))] sm:text-base">
          {tool.realWorldExample}
        </p>
      </section>

      <section className="mt-16 max-w-3xl space-y-4">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight">
          Why It Matters
        </h2>
        <p className="text-sm leading-relaxed text-[color-mix(in_srgb,var(--foreground)_78%,var(--muted))] sm:text-base">
          {tool.whyItMatters}
        </p>
      </section>

      <section className="mt-16 max-w-3xl">
        <h2 className="mb-5 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight">
          Frequently Asked Questions
        </h2>
        <FaqAccordion faqs={tool.schemaData.faqs} />
      </section>

      <ToolSearchFooter currentCategory={tool.category} currentSlug={tool.slug} />
    </ToolLayout>
  );
}
