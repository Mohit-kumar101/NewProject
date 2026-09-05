import type { Metadata } from "next";
import Link from "next/link";
import { GUIDE_ARTICLES } from "@/lib/guides/articles";
import { SITE_NAME } from "@/lib/calculators";
import { buildPageMetadata } from "@/lib/pageMetadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Guides",
  description: `Practical guides from ${SITE_NAME} on money runway, fitness macros, freelancing, and private file conversion—paired with free calculators.`,
  path: "/guides",
  keywords: [
    "money guides",
    "fitness macro guides",
    "freelance rate guide",
    "PDF privacy",
    SITE_NAME,
  ],
});

const CATEGORY_ORDER = ["Money", "Fitness", "Work", "Converters"] as const;

export default function GuidesIndexPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="max-w-3xl">
        <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-[var(--accent)] uppercase">
          Editorial
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
          Guides
        </h1>
        <p className="mt-4 text-base leading-relaxed text-[color-mix(in_srgb,var(--foreground)_78%,var(--muted))] sm:text-lg">
          Original explainers from CalculioHub—how to size an emergency fund,
          set freelance rates, run bulk/cut macros, and convert files without
          careless uploads. Each guide links to the matching free tool.
        </p>
      </header>

      <div className="mt-12 space-y-12">
        {CATEGORY_ORDER.map((category) => {
          const articles = GUIDE_ARTICLES.filter((a) => a.category === category);
          if (articles.length === 0) return null;
          return (
            <section key={category} aria-labelledby={`guides-${category}`}>
              <h2
                id={`guides-${category}`}
                className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight"
              >
                {category}
              </h2>
              <ul className="mt-5 space-y-4">
                {articles.map((article) => (
                  <li key={article.slug}>
                    <Link
                      href={`/guides/${article.slug}`}
                      className="group block rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 py-4 transition hover:border-[var(--accent)]"
                    >
                      <h3 className="font-semibold text-[var(--foreground)] group-hover:text-[var(--accent)]">
                        {article.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                        {article.description}
                      </p>
                      <p className="mt-2 text-xs text-[var(--muted)]">
                        Updated {article.updated}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </main>
  );
}
