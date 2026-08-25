"use client";

import type { Calculator } from "@/lib/types";
import { FaqAccordion } from "@/components/FaqAccordion";
import { getInvestingExpandedFaqs } from "@/lib/investingEnhancements";

/**
 * Expanded high-intent FAQ block for investing tools.
 * Additive — does not replace ToolPageShell FAQs.
 */
export function InvestingExpandedFaq({
  calculator,
}: {
  calculator: Calculator;
}) {
  const faqs = getInvestingExpandedFaqs(calculator.formulaType);
  if (faqs.length === 0) return null;

  return (
    <section
      className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6"
      aria-labelledby="investing-expanded-faq-heading"
    >
      <p className="text-xs font-semibold tracking-[0.16em] text-[var(--accent)] uppercase">
        SEO & planning guide
      </p>
      <h2
        id="investing-expanded-faq-heading"
        className="mt-1 font-[family-name:var(--font-display)] text-lg font-bold tracking-tight sm:text-xl"
      >
        Investing questions people search for
      </h2>
      <p className="mt-2 mb-5 text-sm text-[var(--muted)]">
        FIRE numbers, fee drag, DCA vs lump sum, and related planning intents —
        answered for clarity and search context.
      </p>
      <FaqAccordion faqs={faqs} />
    </section>
  );
}
