import type { Calculator } from "@/lib/types";
import type { KeywordPack, KeywordVariation } from "@/lib/keywords";
import {
  buildLongTailIntro,
  buildLongTailSubtitle,
} from "@/lib/keywords";

/**
 * Natural long-tail copy: subtitle, contextual intro, use cases,
 * localized examples, and feature bullets — not a stuffed keyword list.
 */
export function LongTailKeywordContent({
  calculator,
  pack,
  variation,
}: {
  calculator: Calculator;
  pack: KeywordPack;
  variation?: KeywordVariation;
}) {
  const subtitle = buildLongTailSubtitle(calculator, pack, variation);
  const intro = buildLongTailIntro(calculator, pack, variation);

  return (
    <section
      className="mt-12 max-w-3xl space-y-8"
      aria-labelledby="long-tail-heading"
    >
      <div className="space-y-3">
        <h2
          id="long-tail-heading"
          className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight"
        >
          {variation
            ? `Built for “${variation.focus}”`
            : `Who this ${calculator.title.replace(/\s+Calculator$/i, "")} helps`}
        </h2>
        <p className="text-sm font-medium text-[var(--accent)] sm:text-base">
          {subtitle}
        </p>
        <p className="text-sm leading-relaxed text-[color-mix(in_srgb,var(--foreground)_78%,var(--muted))] sm:text-base">
          {intro}
        </p>
      </div>

      {pack.useCases.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight">
            Common use cases
          </h3>
          <ul className="space-y-2.5">
            {pack.useCases.map((useCase) => (
              <li
                key={useCase}
                className="flex gap-3 text-sm leading-relaxed text-[color-mix(in_srgb,var(--foreground)_75%,var(--muted))] sm:text-base"
              >
                <span
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]"
                  aria-hidden
                />
                <span>{useCase}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {pack.regions.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight">
            Localized examples
          </h3>
          <ul className="space-y-2.5">
            {pack.regions.map((region) => (
              <li
                key={region}
                className="flex gap-3 text-sm leading-relaxed text-[color-mix(in_srgb,var(--foreground)_75%,var(--muted))] sm:text-base"
              >
                <span
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]"
                  aria-hidden
                />
                <span>{region}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {pack.features.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight">
            What you get
          </h3>
          <ul className="grid gap-2 sm:grid-cols-1">
            {pack.features.map((feature) => (
              <li
                key={feature}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm leading-relaxed text-[color-mix(in_srgb,var(--foreground)_82%,var(--muted))]"
              >
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
