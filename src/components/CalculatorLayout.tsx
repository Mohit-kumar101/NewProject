import type { ReactNode } from "react";
import { FaqAccordion } from "@/components/FaqAccordion";
import { ToolBreadcrumbs } from "@/components/ToolBreadcrumbs";
import { ToolSearchFooter } from "@/components/ToolSearchFooter";
import { ToolLayout } from "@/components/layouts/ToolLayout";
import { ConfigCalculatorJsonLd } from "@/components/ConfigCalculatorJsonLd";
import { ConfigCalculatorEngine } from "@/components/ConfigCalculatorEngine";
import type { ConfigCalculator } from "@/config/calculators";

type CalculatorLayoutProps = {
  tool: ConfigCalculator;
  /** Optional override for the interactive area (defaults to config engine) */
  children?: ReactNode;
};

/**
 * Shared wrapper for config-driven niche calculators.
 * Owns H1, intro, form/results slot, math explanation (via engine), FAQs, and JSON-LD.
 * Metadata is set by the dynamic `app/tools/[slug]/page.tsx` route.
 */
export function CalculatorLayout({ tool, children }: CalculatorLayoutProps) {
  return (
    <ToolLayout>
      <ConfigCalculatorJsonLd tool={tool} />

      <ToolBreadcrumbs toolTitle={tool.topic} category={tool.category} />

      <header className="mb-6 max-w-3xl sm:mb-8">
        <p className="mb-2 text-[10px] font-semibold tracking-[0.12em] text-[var(--accent)] uppercase sm:mb-3 sm:text-xs sm:tracking-[0.18em]">
          <span className="sm:hidden">Free online · No sign up</span>
          <span className="hidden sm:inline">
            Free online tool · Estimator · Formula · 2026 update · No sign up
          </span>
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-[1.65rem] font-bold leading-snug tracking-tight break-words-safe sm:text-3xl sm:leading-tight md:text-4xl">
          {tool.h1}
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">{tool.category}</p>
        <p className="mt-2 text-sm font-medium text-[var(--accent)] break-words-safe sm:mt-3 sm:text-base">
          <span className="sm:hidden">{tool.benefit}</span>
          <span className="hidden sm:inline">
            {tool.benefit} — calculator, estimator tool, Excel template
            alternative.
          </span>
        </p>
        <p className="mt-3 text-sm leading-relaxed text-[color-mix(in_srgb,var(--foreground)_78%,var(--muted))] sm:mt-4 sm:text-base sm:text-lg">
          {tool.intro}
        </p>
      </header>

      {children ?? <ConfigCalculatorEngine slug={tool.slug} />}

      <section className="mt-12 max-w-3xl space-y-4 sm:mt-16">
        <h2 className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight break-words-safe sm:text-2xl">
          {tool.topic} FAQ
        </h2>
        <FaqAccordion faqs={tool.faqs} />
      </section>

      <ToolSearchFooter
        currentCategory={tool.category}
        currentSlug={tool.slug}
      />
    </ToolLayout>
  );
}
