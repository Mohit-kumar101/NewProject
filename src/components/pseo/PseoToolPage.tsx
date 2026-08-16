import { FaqAccordion } from "@/components/FaqAccordion";
import { ToolBreadcrumbs } from "@/components/ToolBreadcrumbs";
import { ToolSearchFooter } from "@/components/ToolSearchFooter";
import { LongTailKeywordContent } from "@/components/seo/LongTailKeywordContent";
import { RelatedCalculators } from "@/components/seo/RelatedCalculators";
import { ToolLayout } from "@/components/layouts/ToolLayout";
import { CalculatorRenderer } from "@/components/pseo/CalculatorRenderer";
import { PseoJsonLd } from "@/components/pseo/PseoJsonLd";
import {
  getCalculatorBySlug,
  getRelatedCalculators,
} from "@/lib/calculators";
import {
  buildLongTailSubtitle,
  mergeToolFaqs,
  resolveKeywordPack,
} from "@/lib/keywords";
import type { PseoTool } from "@/lib/pseo/types";

export function PseoToolPage({ tool }: { tool: PseoTool }) {
  const calculator = getCalculatorBySlug(tool.slug);
  const pack = calculator
    ? resolveKeywordPack(calculator)
    : resolveKeywordPack({
        slug: tool.slug,
        title: tool.h1,
        category: tool.category,
        description: tool.metaDescription,
        inputs: [],
        formulaType: tool.id,
        seoContent: {
          intro: tool.whatIsIt,
          howToUse: [],
          faqs: tool.schemaData.faqs,
        },
      });
  const faqs = calculator
    ? mergeToolFaqs(calculator, pack)
    : [...tool.schemaData.faqs, ...pack.faqs].slice(0, 8);
  const related = calculator ? getRelatedCalculators(calculator, 6) : [];
  const subtitle = calculator
    ? buildLongTailSubtitle(calculator, pack)
    : `${tool.targetKeyword} — free online, instant results, no sign up.`;

  return (
    <ToolLayout>
      <PseoJsonLd tool={tool} faqs={faqs} />

      <ToolBreadcrumbs toolTitle={tool.h1} category={tool.category} />

      <header className="mb-8 max-w-3xl">
        <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-[var(--accent)] uppercase">
          Free online tool · No sign up · Instant calculation
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
          {tool.h1}
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">{tool.category}</p>
        <p className="mt-3 text-sm font-medium text-[var(--accent)] sm:text-base">
          {subtitle}
        </p>
        <p className="mt-4 text-base leading-relaxed text-[color-mix(in_srgb,var(--foreground)_78%,var(--muted))] sm:text-lg">
          {tool.whatIsIt}
        </p>
      </header>

      <CalculatorRenderer id={tool.id} />

      {calculator ? (
        <LongTailKeywordContent calculator={calculator} pack={pack} />
      ) : null}

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
        <FaqAccordion faqs={faqs} />
      </section>

      <RelatedCalculators tools={related} category={tool.category} />

      <ToolSearchFooter currentCategory={tool.category} currentSlug={tool.slug} />
    </ToolLayout>
  );
}
