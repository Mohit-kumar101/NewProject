import Link from "next/link";
import { getCalculatorBySlug } from "@/lib/calculators";
import { getToolHref } from "@/lib/cryptoFormulas";
import {
  FEATURED_PLANNER_SLUGS,
  GROWTH_CLUSTERS,
} from "@/lib/growthClusters";

export function FeaturedPlanners() {
  const tools = FEATURED_PLANNER_SLUGS.map((slug) => getCalculatorBySlug(slug)).filter(
    Boolean
  );

  return (
    <section className="border-b border-[var(--border)] bg-[var(--surface)]/40 py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-[var(--accent)] uppercase">
              Featured planners
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight sm:text-3xl">
              Start with high-intent tools
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-[var(--muted)] sm:text-base">
              Fitness phase planners and money milestone tools — built for searches
              people already make.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm font-semibold">
            {GROWTH_CLUSTERS.map((c) => (
              <Link
                key={c.id}
                href={c.href}
                className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-[var(--accent)] hover:border-[var(--accent)]"
              >
                {c.title} →
              </Link>
            ))}
          </div>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {tools.map((tool) =>
            tool ? (
              <li key={tool.slug}>
                <Link
                  href={getToolHref(tool.slug)}
                  className="flex h-full flex-col rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-4 transition hover:border-[var(--accent)]"
                >
                  <span className="text-sm font-semibold">{tool.title}</span>
                  <span className="mt-2 line-clamp-2 text-xs text-[var(--muted)]">
                    {tool.description}
                  </span>
                </Link>
              </li>
            ) : null
          )}
        </ul>
      </div>
    </section>
  );
}
