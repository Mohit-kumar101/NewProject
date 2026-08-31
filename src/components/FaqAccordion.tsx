"use client";

import { useState } from "react";
import type { CalculatorFaq } from "@/lib/types";

export function FaqAccordion({ faqs }: { faqs: CalculatorFaq[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-[var(--border)] rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
      {faqs.map((faq, index) => {
        const open = openIndex === index;
        return (
          <div key={faq.question}>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              aria-expanded={open}
              onClick={() => setOpenIndex(open ? null : index)}
            >
              <span className="min-w-0 text-sm font-semibold text-[var(--foreground)] break-words-safe sm:text-base">
                {faq.question}
              </span>
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--border)] text-[var(--accent)] transition ${open ? "rotate-45" : ""}`}
                aria-hidden
              >
                +
              </span>
            </button>
            {open && (
              <div className="px-5 pb-5 text-sm leading-relaxed text-[var(--muted)]">
                {faq.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
