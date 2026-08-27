import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/calculators";
import { buildPageMetadata } from "@/lib/pageMetadata";
import { WORKFLOWS, getWorkflowHref } from "@/lib/workflows";

export const metadata: Metadata = buildPageMetadata({
  title: "Workflows",
  description:
    "Guided multi-tool journeys for fitness phases, money runway, buying a home, killing debt, freelancing, and converting files privately — free on CalculioHub.",
  path: "/workflows",
  keywords: [
    "calculator workflow",
    "fitness phase planner",
    "emergency fund runway",
    "home buying calculator",
    "debt payoff plan",
    "freelance rate guide",
    SITE_NAME,
  ],
});

export default function WorkflowsIndexPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Workflows | ${SITE_NAME}`,
    description:
      "Ordered calculator and converter journeys for real decisions — not isolated tools.",
    url: `${SITE_URL}/workflows`,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: WORKFLOWS.length,
      itemListElement: WORKFLOWS.map((w, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${SITE_URL}${getWorkflowHref(w.slug)}`,
        name: w.title,
      })),
    },
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-[var(--muted)]">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="hover:text-[var(--accent)]">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="font-medium text-[var(--foreground)]" aria-current="page">
            Workflows
          </li>
        </ol>
      </nav>

      <p className="text-xs font-semibold tracking-[0.18em] text-[var(--accent)] uppercase">
        Guided journeys
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
        Workflows that finish the job
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-[color-mix(in_srgb,var(--foreground)_78%,var(--muted))]">
        Most sites hand you one calculator. These sequences chain the tools you
        already need — with a clear next step and private, no-signup tools.
      </p>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2">
        {WORKFLOWS.map((workflow) => (
          <li key={workflow.slug}>
            <Link
              href={getWorkflowHref(workflow.slug)}
              className="block h-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 py-5 transition hover:border-[var(--accent)]"
            >
              <p className="text-[11px] font-semibold tracking-[0.14em] text-[var(--accent)] uppercase">
                {workflow.eyebrow}
              </p>
              <h2 className="mt-2 font-[family-name:var(--font-display)] text-xl font-bold">
                {workflow.shortTitle}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                {workflow.description}
              </p>
              <p className="mt-4 text-xs font-semibold text-[var(--accent)]">
                {workflow.steps.length} steps →
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
