import type { Metadata } from "next";
import Link from "next/link";
import { getCalculatorBySlug, SITE_NAME, SITE_URL } from "@/lib/calculators";
import { getToolHref } from "@/lib/cryptoFormulas";
import { getGrowthClusterById } from "@/lib/growthClusters";
import { buildPageMetadata } from "@/lib/pageMetadata";
import { EmailCapture } from "@/components/growth/EmailCapture";
import { AffiliateSlot } from "@/components/growth/AffiliateSlot";
import { getWorkflowHref } from "@/lib/workflows";

const cluster = getGrowthClusterById("money")!;

export const metadata: Metadata = buildPageMetadata({
  title: "Money Milestone Planners",
  description: cluster.description,
  path: cluster.href,
  keywords: cluster.seoKeywords,
});

export default function MoneyMilestonesHubPage() {
  const tools = cluster.toolSlugs
    .map((slug) => getCalculatorBySlug(slug))
    .filter(Boolean);

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: cluster.h1,
    description: cluster.description,
    url: `${SITE_URL}${cluster.href}`,
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <p className="text-xs font-semibold tracking-[0.18em] text-[var(--accent)] uppercase">
        Growth hub · Money
      </p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
        {cluster.h1}
      </h1>
      <p className="mt-4 text-base leading-relaxed text-[var(--muted)] sm:text-lg">
        {cluster.description}
      </p>
      {cluster.workflowSlug ? (
        <p className="mt-3 text-sm">
          Prefer a guided path?{" "}
          <Link
            href={getWorkflowHref(cluster.workflowSlug)}
            className="font-semibold text-[var(--accent)] hover:underline"
          >
            Money runway workflow →
          </Link>
        </p>
      ) : null}

      <ol className="mt-10 space-y-3">
        {tools.map((tool, i) =>
          tool ? (
            <li key={tool.slug}>
              <Link
                href={getToolHref(tool.slug)}
                className="flex gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-4 transition hover:border-[var(--accent)]"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/15 text-sm font-bold text-[var(--accent)]">
                  {i + 1}
                </span>
                <span>
                  <span className="block font-semibold">{tool.title}</span>
                  <span className="mt-1 block text-sm text-[var(--muted)]">
                    {tool.description}
                  </span>
                </span>
              </Link>
            </li>
          ) : null
        )}
      </ol>

      <AffiliateSlot cluster="money" />
      <EmailCapture
        source="hub-money"
        headline="Get money milestone tips"
        subtext="One tip on runway, goals, and rates each week — plus a free planner. No spam."
      />

      <p className="mt-10 text-sm text-[var(--muted)]">
        Also explore{" "}
        <Link href="/hubs/fitness-planners" className="text-[var(--accent)] hover:underline">
          Fitness planners
        </Link>{" "}
        or{" "}
        <Link href="/tools" className="text-[var(--accent)] hover:underline">
          all tools
        </Link>
        .
      </p>
    </div>
  );
}
