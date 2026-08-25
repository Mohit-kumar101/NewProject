import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE_NAME, SITE_URL } from "@/lib/calculators";
import { getToolHref } from "@/lib/cryptoFormulas";
import { buildPageMetadata } from "@/lib/pageMetadata";
import { buildScenarioUrl } from "@/lib/scenarioLinks";
import {
  WORKFLOWS,
  getWorkflowBySlug,
  getWorkflowHref,
} from "@/lib/workflows";

export function generateStaticParams() {
  return WORKFLOWS.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const workflow = getWorkflowBySlug(slug);
  if (!workflow) return {};
  return buildPageMetadata({
    title: workflow.shortTitle,
    description: workflow.description,
    path: getWorkflowHref(workflow.slug),
    keywords: [workflow.shortTitle, "workflow", "calculator guide", SITE_NAME],
    ogTitle: `${workflow.title} | ${SITE_NAME}`,
  });
}

export default async function WorkflowPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const workflow = getWorkflowBySlug(slug);
  if (!workflow) notFound();

  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: workflow.title,
    description: workflow.description,
    url: `${SITE_URL}${getWorkflowHref(workflow.slug)}`,
    step: workflow.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.label,
      text: step.verdict,
      url: `${SITE_URL}${getToolHref(step.toolSlug)}`,
    })),
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
          <li>
            <Link href="/workflows" className="hover:text-[var(--accent)]">
              Workflows
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="font-medium text-[var(--foreground)]" aria-current="page">
            {workflow.shortTitle}
          </li>
        </ol>
      </nav>

      <p className="text-xs font-semibold tracking-[0.18em] text-[var(--accent)] uppercase">
        {workflow.eyebrow}
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
        {workflow.title}
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-[color-mix(in_srgb,var(--foreground)_78%,var(--muted))]">
        {workflow.description}
      </p>

      <ol className="mt-10 space-y-4">
        {workflow.steps.map((step, index) => {
          const href = step.preset
            ? buildScenarioUrl(step.preset, getToolHref(step.toolSlug))
            : getToolHref(step.toolSlug);
          return (
            <li key={step.toolSlug}>
              <Link
                href={href}
                className="block rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 py-5 transition hover:border-[var(--accent)]"
              >
                <div className="flex flex-wrap items-start gap-4">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[var(--border)] text-sm font-bold text-[var(--accent)]">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-[family-name:var(--font-display)] text-lg font-bold">
                      {step.label}
                    </h2>
                    <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">
                      {step.verdict}
                    </p>
                    <p className="mt-3 text-xs font-semibold text-[var(--accent)]">
                      Open tool →
                    </p>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ol>

      <p className="mt-10 text-sm text-[var(--muted)]">
            <Link href="/workflows" className="font-semibold text-[var(--accent)] hover:underline">
          ← All workflows
        </Link>
      </p>
    </main>
  );
}
