import type { ReactNode } from "react";
import type { Calculator } from "@/lib/types";
import { FaqAccordion } from "@/components/FaqAccordion";
import { JsonLd } from "@/components/JsonLd";
import { ReviewSection } from "@/components/ReviewSection";
import { SuggestionBox } from "@/components/SuggestionBox";
import { ToolBreadcrumbs } from "@/components/ToolBreadcrumbs";
import { ToolExplanation } from "@/components/ToolExplanation";
import { ToolSearchFooter } from "@/components/ToolSearchFooter";
import {
  ToolRailRelated,
  ToolRailSpotlight,
} from "@/components/ads/ToolRailFillers";
import { ToolLayout } from "@/components/layouts/ToolLayout";
import {
  getSidebarRelatedTools,
  getSidebarSpotlightTools,
  isBcTaxCalculator,
} from "@/lib/calculators";
import {
  getFaqHeading,
  getFormulaHeading,
  getHowToHeading,
  getPracticalExample,
  getToolCanonicalUrl,
  getToolPageH1,
} from "@/lib/seo";
import { getToolExplanation } from "@/lib/toolExplanations";

/**
 * Unified tool page template:
 * Ad rails → Breadcrumbs → H1 → Workspace → How-to → Formula → FAQ → Explore → Reviews
 */
export function ToolPageShell({
  calculator,
  workspace,
  guideExtra,
}: {
  calculator: Calculator;
  workspace: ReactNode;
  guideExtra?: ReactNode;
}) {
  const toolUrl = getToolCanonicalUrl(calculator);
  const explanation = getToolExplanation(calculator);
  const relatedRail = getSidebarRelatedTools(calculator, 6);
  const spotlight = getSidebarSpotlightTools(calculator, 5);
  const bcTax = isBcTaxCalculator(calculator);

  return (
    <ToolLayout
      leftAd={
        <ToolRailRelated
          category={bcTax ? "BC Local Taxes" : calculator.category}
          tools={relatedRail}
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
      <JsonLd calculator={calculator} />

      <ToolBreadcrumbs
        toolTitle={calculator.title}
        category={calculator.category}
      />

      <header className="mb-8 max-w-3xl">
        <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-[var(--accent)] uppercase">
          Free online tool · No sign up · Instant calculation
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
          {getToolPageH1(calculator)}
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">{calculator.category}</p>
        <p className="mt-4 text-base leading-relaxed text-[color-mix(in_srgb,var(--foreground)_78%,var(--muted))] sm:text-lg">
          {calculator.seoContent.intro}
        </p>
      </header>

      <div className="min-w-0">{workspace}</div>

      <section className="mt-16 max-w-3xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight">
          {getHowToHeading(calculator)}
        </h2>
        <ol className="mt-5 space-y-3">
          {calculator.seoContent.howToUse.map((step, index) => (
            <li
              key={step}
              className="flex gap-3 text-sm leading-relaxed text-[color-mix(in_srgb,var(--foreground)_75%,var(--muted))] sm:text-base"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#00E5FF] to-[#2979FF] text-xs font-bold text-white">
                {index + 1}
              </span>
              <span className="pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <ToolExplanation
        title={calculator.title}
        heading={getFormulaHeading(calculator)}
        example={getPracticalExample(calculator)}
        content={explanation}
      />

      {guideExtra}

      <section className="mt-16 max-w-3xl">
        <h2 className="mb-5 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight">
          {getFaqHeading()}
        </h2>
        <FaqAccordion faqs={calculator.seoContent.faqs} />
      </section>

      <ToolSearchFooter
        currentCategory={calculator.category}
        currentSlug={calculator.slug}
      />

      <div className="mt-4 max-w-3xl">
        <ReviewSection toolTitle={calculator.title} toolUrl={toolUrl} />
        <SuggestionBox toolTitle={calculator.title} toolUrl={toolUrl} />
      </div>
    </ToolLayout>
  );
}
