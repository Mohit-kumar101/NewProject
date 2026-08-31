import type { ReactNode } from "react";
import type { Calculator, LongTailModifier } from "@/lib/types";
import { FaqAccordion } from "@/components/FaqAccordion";
import { JsonLd } from "@/components/JsonLd";
import { ReviewSection } from "@/components/ReviewSection";
import { SuggestionBox } from "@/components/SuggestionBox";
import { ToolBreadcrumbs } from "@/components/ToolBreadcrumbs";
import { ToolExplanation } from "@/components/ToolExplanation";
import { ToolTermsGuide } from "@/components/ToolTermsGuide";
import { ToolSearchFooter } from "@/components/ToolSearchFooter";
import { LongTailKeywordContent } from "@/components/seo/LongTailKeywordContent";
import { RelatedCalculators } from "@/components/seo/RelatedCalculators";
import { ClusterNextSteps } from "@/components/growth/ClusterNextSteps";
import { EmailCapture } from "@/components/growth/EmailCapture";
import { AffiliateSlot } from "@/components/growth/AffiliateSlot";
import { getGrowthClusterForSlug } from "@/lib/growthClusters";
import { ToolLayout } from "@/components/layouts/ToolLayout";
import { getRelatedCalculators } from "@/lib/calculators";
import {
  buildVariantExplanation,
} from "@/lib/expansion/tools";
import {
  buildLongTailSubtitle,
  mergeToolFaqs,
  resolveKeywordPack,
  type KeywordVariation,
} from "@/lib/keywords";
import {
  buildModifierFaqs,
  getFaqHeading,
  getFormulaHeading,
  getHowToHeading,
  getPracticalExample,
  getToolCanonicalUrl,
  getToolPageH1,
  getToolVariationCanonicalUrl,
  longTailModifierToVariation,
} from "@/lib/seo";
import {
  buildToolTermsGuide,
  getToolExplanation,
} from "@/lib/toolExplanations";

/**
 * Unified tool page template:
 * Ad rails → Breadcrumbs → H1 → Workspace → Long-tail → How-to → Formula → FAQ → Related → Explore → Reviews
 */
export function ToolPageShell({
  calculator,
  workspace,
  guideExtra,
  variation,
  modifier,
  related: relatedProp,
}: {
  calculator: Calculator;
  workspace: ReactNode;
  guideExtra?: ReactNode;
  variation?: KeywordVariation;
  modifier?: LongTailModifier;
  related?: Calculator[];
}) {
  const pack = resolveKeywordPack(calculator);
  const resolvedVariation =
    variation ?? (modifier ? longTailModifierToVariation(modifier) : undefined);
  const faqs = modifier
    ? buildModifierFaqs(calculator, modifier)
    : mergeToolFaqs(calculator, pack, resolvedVariation);
  const related = relatedProp ?? getRelatedCalculators(calculator, 6);
  const toolUrl = resolvedVariation
    ? getToolVariationCanonicalUrl(calculator, resolvedVariation.slug)
    : getToolCanonicalUrl(calculator);
  const explanation = getToolExplanation(calculator);
  const termsGuide = buildToolTermsGuide(calculator);
  const subtitle = buildLongTailSubtitle(calculator, pack, resolvedVariation);
  const contextualCopy = buildVariantExplanation(calculator, modifier);
  const pageTitle =
    modifier?.focusKeyword ||
    resolvedVariation?.focus ||
    calculator.title;

  const termsPanel = (
    <ToolTermsGuide toolTitle={pageTitle} guide={termsGuide} compact />
  );

  return (
    <ToolLayout rightAd={termsPanel}>
      <JsonLd
        calculator={calculator}
        faqs={faqs}
        variation={resolvedVariation}
      />

      <ToolBreadcrumbs
        toolTitle={pageTitle}
        category={calculator.category}
      />

      <header className="mb-6 max-w-3xl sm:mb-8">
        <p className="mb-2 text-[10px] font-semibold tracking-[0.12em] text-[var(--accent)] uppercase sm:mb-3 sm:text-xs sm:tracking-[0.18em]">
          <span className="sm:hidden">Free online · No sign up</span>
          <span className="hidden sm:inline">
            Free online tool · No sign up · Instant calculation
          </span>
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-[1.65rem] font-bold leading-snug tracking-tight break-words-safe sm:text-3xl sm:leading-tight md:text-4xl">
          {modifier?.focusKeyword ||
            resolvedVariation?.focus ||
            getToolPageH1(calculator)}
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">{calculator.category}</p>
        <p className="mt-2 text-sm font-medium text-[var(--accent)] break-words-safe sm:mt-3 sm:text-base">
          {subtitle}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-[color-mix(in_srgb,var(--foreground)_78%,var(--muted))] sm:mt-4 sm:text-base md:text-lg">
          {modifier?.explanation ||
            resolvedVariation?.intro ||
            calculator.seoContent.intro}
        </p>
      </header>

      <div className="min-w-0">{workspace}</div>

      {/* Right-rail guide is desktop-only; show the same help on smaller screens. */}
      <div className="mt-8 lg:hidden">{termsPanel}</div>

      {(calculator.seoContextTemplate ||
        calculator.explanationTemplate ||
        modifier) && (
        <section className="mt-12 max-w-3xl space-y-3">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight">
            {modifier
              ? `About “${modifier.focusKeyword}”`
              : "How this calculator works"}
          </h2>
          <p className="text-sm leading-relaxed text-[color-mix(in_srgb,var(--foreground)_78%,var(--muted))] sm:text-base">
            {contextualCopy}
          </p>
          {calculator.formulaSummary ? (
            <p className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 font-mono text-sm text-[var(--foreground)]">
              {calculator.formulaSummary}
            </p>
          ) : null}
          {calculator.realWorldExample ? (
            <p className="text-sm leading-relaxed text-[var(--muted)] sm:text-base">
              <span className="font-medium text-[var(--foreground)]">
                Example:{" "}
              </span>
              {calculator.realWorldExample}
            </p>
          ) : null}
        </section>
      )}

      <LongTailKeywordContent
        calculator={calculator}
        pack={pack}
        variation={resolvedVariation}
      />

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
        <FaqAccordion faqs={faqs} />
      </section>

      <RelatedCalculators tools={related} category={calculator.category} />

      <ClusterNextSteps toolSlug={calculator.slug} />

      {(() => {
        const cluster = getGrowthClusterForSlug(calculator.slug);
        return cluster ? (
          <>
            <AffiliateSlot cluster={cluster.id} />
            <EmailCapture
              source={`tool-${calculator.slug}`}
              headline={
                cluster.id === "fitness"
                  ? "Email me fitness planner tips"
                  : "Email me money milestone tips"
              }
            />
          </>
        ) : (
          <EmailCapture source={`tool-${calculator.slug}`} />
        );
      })()}

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
