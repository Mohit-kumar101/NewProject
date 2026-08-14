import type { Metadata } from "next";
import Link from "next/link";
import {
  CATEGORIES,
  SITE_NAME,
  SITE_URL,
  calculators,
  getCalculatorsByCategory,
} from "@/lib/calculators";
import { getToolHref } from "@/lib/cryptoFormulas";
import { buildPageMetadata } from "@/lib/pageMetadata";

export const metadata: Metadata = buildPageMetadata({
  title: "All Calculators & Converters",
  description:
    "Browse every CalculioHub calculator and file converter—PDF, HEIC, video, JSON/CSV, finance, and crypto tools with no paywall.",
  path: "/tools",
  keywords: [
    "all calculators",
    "file converters",
    "free PDF converter",
    "online tools",
    SITE_NAME,
  ],
});

function categoryId(category: string) {
  return category.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export default function ToolsIndexPage() {
  const itemList = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `All Calculators & Converters | ${SITE_NAME}`,
    description:
      "Directory of CalculioHub online calculators and private file converters with dedicated pages for each tool.",
    url: `${SITE_URL}/tools`,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: calculators.length,
      itemListElement: calculators.map((tool, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${SITE_URL}${getToolHref(tool.slug)}`,
        name: tool.title,
      })),
    },
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
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
            Tools
          </li>
        </ol>
      </nav>

      <header className="mb-10 max-w-3xl">
        <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-[var(--accent)] uppercase">
          Free alternative · No paywall
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
          All calculators & file converters
        </h1>
        <p className="mt-4 text-base leading-relaxed text-[var(--muted)] sm:text-lg">
          Same jobs as the paid PDF, video, and image converters — plus finance
          and crypto calculators. Browse {calculators.length} tools across{" "}
          {CATEGORIES.length} categories. Every tool is free, private, and on
          its own URL.
        </p>
      </header>

      <div className="mb-10 flex flex-wrap gap-2">
        {CATEGORIES.map((category) => (
          <a
            key={category}
            href={`#${categoryId(category)}`}
            className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            {category}
          </a>
        ))}
      </div>

      <div className="space-y-14">
        {CATEGORIES.map((category) => {
          const tools = getCalculatorsByCategory(category);
          return (
            <section key={category} id={categoryId(category)}>
              <div className="mb-5 flex items-baseline justify-between gap-3">
                <h2 className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight sm:text-2xl">
                  {category}
                </h2>
                <span className="text-sm text-[var(--muted)]">
                  {tools.length} tools
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {tools.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={getToolHref(tool.slug)}
                    className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 py-4 transition hover:border-[var(--accent)] hover:bg-[var(--background)]"
                  >
                    <div className="font-semibold text-[var(--foreground)]">
                      {tool.title}
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-[var(--muted)]">
                      {tool.description}
                    </p>
                    <p className="mt-3 text-xs font-semibold tracking-wide text-[var(--accent)] uppercase">
                      Open tool →
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
