import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AuthorByline } from "@/components/AuthorByline";
import {
  getAllGuideSlugs,
  getGuideBySlug,
} from "@/lib/guides/articles";
import { SITE_NAME, SITE_URL } from "@/lib/calculators";
import { buildPageMetadata } from "@/lib/pageMetadata";
import { personSchema } from "@/lib/siteIdentity";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllGuideSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getGuideBySlug(slug);
  if (!article) return { title: "Guide not found" };
  return buildPageMetadata({
    title: article.title,
    description: article.description,
    path: `/guides/${article.slug}`,
    keywords: [article.category, article.title, SITE_NAME],
    ogTitle: `${article.title} | ${SITE_NAME}`,
  });
}

export default async function GuideArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getGuideBySlug(slug);
  if (!article) notFound();

  const url = `${SITE_URL}/guides/${article.slug}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.published,
    dateModified: article.updated,
    author: personSchema(),
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: url,
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <nav aria-label="Breadcrumb" className="mb-8 text-sm text-[var(--muted)]">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="transition hover:text-[var(--accent)]">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link
              href="/guides"
              className="transition hover:text-[var(--accent)]"
            >
              Guides
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="font-medium text-[var(--foreground)] line-clamp-1">
            {article.category}
          </li>
        </ol>
      </nav>

      <header>
        <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-[var(--accent)] uppercase">
          {article.category} guide
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
          {article.title}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-[color-mix(in_srgb,var(--foreground)_78%,var(--muted))] sm:text-lg">
          {article.intro}
        </p>
        <AuthorByline dateLabel={`Updated ${article.updated}`} />
      </header>

      <div className="mt-10 space-y-10">
        {article.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight sm:text-2xl">
              {section.heading}
            </h2>
            {section.paragraphs.map((p) => (
              <p
                key={p.slice(0, 48)}
                className="mt-3 text-sm leading-relaxed text-[color-mix(in_srgb,var(--foreground)_78%,var(--muted))] sm:text-base"
              >
                {p}
              </p>
            ))}
            {section.bullets && section.bullets.length > 0 ? (
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-[color-mix(in_srgb,var(--foreground)_78%,var(--muted))] sm:text-base">
                {section.bullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}

        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
          <h2 className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight">
            Key takeaways
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed sm:text-base">
            {article.takeaways.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight">
            Related tools
          </h2>
          <ul className="mt-4 space-y-2">
            {article.relatedToolHrefs.map((tool) => (
              <li key={tool.href}>
                <Link
                  href={tool.href}
                  className="font-medium text-[var(--accent)] underline-offset-2 hover:underline"
                >
                  {tool.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <p className="mt-12 text-sm text-[var(--muted)]">
        <Link href="/guides" className="text-[var(--accent)] hover:underline">
          ← All guides
        </Link>
      </p>
    </main>
  );
}
