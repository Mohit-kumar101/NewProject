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
import { getToolEditorialGuide } from "@/lib/editorial/toolGuides";
import { ToolEditorialGuidePanel } from "@/components/editorial/ToolEditorialGuidePanel";
import { AuthorByline } from "@/components/AuthorByline";

/**
 * Unified tool page template:
 * Breadcrumbs → H1 → Workspace → Long-tail → How-to → Formula → FAQ → Related → Explore → Reviews
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
  const editorial =
    !resolvedVariation && !modifier
      ? getToolEditorialGuide(calculator.slug)
      : undefined;

  const termsPanel = (
    <ToolTermsGuide toolTitle={pageTitle} guide={termsGuide} compact />
  );

  return (
    <ToolLayout sidebar={termsPanel}>
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
        <p className="mb-3 inline-flex rounded-full border border-[var(--border)] bg-[var(--surface-solid)] px-2.5 py-1 text-[11px] font-semibold tracking-wide text-[var(--muted)] uppercase">
          {calculator.category}
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-[1.55rem] font-bold leading-snug tracking-tight break-words-safe sm:text-3xl sm:leading-tight">
          {modifier?.focusKeyword ||
            resolvedVariation?.focus ||
            getToolPageH1(calculator)}
        </h1>
        <p className="mt-2 text-sm font-medium text-[var(--accent)] break-words-safe sm:mt-2.5">
          {subtitle}
        </p>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--muted)] sm:text-[15px]">
          {modifier?.explanation ||
            resolvedVariation?.intro ||
            calculator.seoContent.intro}
        </p>
        {!resolvedVariation && !modifier ? (
          <AuthorByline compact dateLabel="Maintained by CalculioHub" />
        ) : null}
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

      {editorial ? (
        <ToolEditorialGuidePanel
          guide={editorial}
          toolTitle={calculator.title}
        />
      ) : null}

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
          <EmailCapture
            source={`tool-${calculator.slug}`}
            headline={
              cluster.id === "fitness"
                ? "Email me when you add a fitness planner"
                : cluster.id === "life"
                  ? "Email me when you add a life tool"
                  : "Email me when you add a money planner"
            }
          />
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
