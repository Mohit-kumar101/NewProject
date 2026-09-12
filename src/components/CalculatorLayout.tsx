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
        <p className="mb-3 inline-flex rounded-full border border-[var(--border)] bg-[var(--surface-solid)] px-2.5 py-1 text-[11px] font-semibold tracking-wide text-[var(--muted)] uppercase">
          {tool.category}
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-[1.55rem] font-bold leading-snug tracking-tight break-words-safe sm:text-3xl sm:leading-tight">
          {tool.h1}
        </h1>
        <p className="mt-2 text-sm font-medium text-[var(--accent)] break-words-safe">
          {tool.benefit}
        </p>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--muted)] sm:text-[15px]">
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
