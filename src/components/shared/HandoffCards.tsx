"use client";

import Link from "next/link";
import { getHandoffCards, rememberLastHandoff, type HandoffContext } from "@/lib/handoffs";

export function HandoffCards(ctx: HandoffContext) {
  const cards = getHandoffCards(ctx);
  if (!cards.length) return null;

  return (
    <section className="calc-panel rounded-2xl p-5 sm:p-6">
      <p className="text-xs font-semibold tracking-[0.16em] text-[var(--accent)] uppercase">
        Continue with these numbers
      </p>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Opens the next calculator with what you just entered. Planning
        estimates — not a lender or tax filing.
      </p>
      <ul className="mt-4 grid gap-3">
        {cards.map((card) => (
          <li key={card.toSlug}>
            <Link
              href={card.href}
              onClick={() =>
                rememberLastHandoff({
                  fromSlug: ctx.slug,
                  toSlug: card.toSlug,
                  href: card.href,
                  question: card.question,
                  carried: card.carried,
                  at: Date.now(),
                })
              }
              className="block rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 hover:border-[var(--accent)]"
            >
              <p className="font-semibold text-[var(--foreground)]">
                {card.question}
              </p>
              <p className="mt-1 text-xs font-medium text-[var(--accent)]">
                Carrying {card.carried}
              </p>
              <p className="mt-1 text-sm text-[var(--muted)]">{card.why}</p>
              {card.assumed ? (
                <p className="mt-1 text-xs text-[var(--muted)]">{card.assumed}</p>
              ) : null}
              <p className="mt-2 text-sm font-semibold text-[var(--accent)]">
                Open with my numbers →
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
