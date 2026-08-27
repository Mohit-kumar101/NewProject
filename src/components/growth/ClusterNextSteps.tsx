import Link from "next/link";
import { getToolHref } from "@/lib/cryptoFormulas";
import {
  getGrowthClusterForSlug,
  getClusterMateSlugs,
} from "@/lib/growthClusters";
import { getCalculatorBySlug } from "@/lib/calculators";

/**
 * Strong internal links between cluster mates + hub page.
 */
export function ClusterNextSteps({ toolSlug }: { toolSlug: string }) {
  const cluster = getGrowthClusterForSlug(toolSlug);
  if (!cluster) return null;

  const mates = getClusterMateSlugs(toolSlug, 5)
    .map((slug) => getCalculatorBySlug(slug))
    .filter(Boolean);

  if (mates.length === 0) return null;

  return (
    <section className="mt-12 max-w-3xl rounded-2xl border border-[var(--accent)]/25 bg-[var(--accent)]/5 p-5 sm:p-6">
      <p className="text-xs font-semibold tracking-[0.16em] text-[var(--accent)] uppercase">
        Next in {cluster.title}
      </p>
      <h2 className="mt-1 font-[family-name:var(--font-display)] text-xl font-bold tracking-tight">
        Keep going with related planners
      </h2>
      <p className="mt-2 text-sm text-[var(--muted)]">
        These tools share the same journey — use them together for better
        decisions.
      </p>
      <ul className="mt-4 space-y-2">
        {mates.map((tool) =>
          tool ? (
            <li key={tool.slug}>
              <Link
                href={getToolHref(tool.slug)}
                className="block rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm font-medium transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                {tool.title}
                <span className="mt-0.5 block text-xs font-normal text-[var(--muted)]">
                  {tool.description}
                </span>
              </Link>
            </li>
          ) : null
        )}
      </ul>
      <Link
        href={cluster.href}
        className="mt-4 inline-block text-sm font-semibold text-[var(--accent)] hover:underline"
      >
        See all {cluster.title} →
      </Link>
    </section>
  );
}
