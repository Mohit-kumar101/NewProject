import Link from "next/link";
import type { Calculator } from "@/lib/types";
import { getToolHref } from "@/lib/cryptoFormulas";
import { getToolMetricName } from "@/lib/seo";

/**
 * Internal-linking grid that passes relevance between calculator pages.
 */
export function RelatedCalculators({
  tools,
  category,
  heading = "Related calculators",
}: {
  tools: Calculator[];
  category?: string;
  heading?: string;
}) {
  if (tools.length === 0) return null;

  return (
    <section
      className="mt-16"
      aria-labelledby="related-calculators-heading"
    >
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
        <h2
          id="related-calculators-heading"
          className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight"
        >
          {heading}
        </h2>
        {category ? (
          <p className="text-xs text-[var(--muted)] sm:text-sm">{category}</p>
        ) : null}
      </div>

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => {
          const metric = getToolMetricName(tool);
          return (
            <li key={tool.slug}>
              <Link
                href={getToolHref(tool.slug)}
                className="group flex h-full flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-4 transition hover:border-[color-mix(in_srgb,var(--accent)_45%,var(--border))] hover:bg-[var(--background)]"
              >
                <span className="text-sm font-semibold text-[var(--foreground)] transition group-hover:text-[var(--accent)]">
                  {tool.title}
                </span>
                <span className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-[var(--muted)]">
                  {tool.description ||
                    `Free ${metric.toLowerCase()} tool — instant results, no sign up.`}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
