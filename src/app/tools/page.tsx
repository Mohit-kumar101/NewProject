import type { Metadata } from "next";
import Link from "next/link";
import { CATEGORIES, getPublicCalculators, SITE_NAME, SITE_URL } from "@/lib/calculators";
import { getToolHref } from "@/lib/cryptoFormulas";
import { buildPageMetadata } from "@/lib/pageMetadata";
import { ToolsDirectory } from "@/components/ToolsDirectory";
import { SpecialCareerTools } from "@/components/SpecialCareerTools";

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

export default function ToolsIndexPage() {
  const publicTools = getPublicCalculators();
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
      numberOfItems: publicTools.length,
      itemListElement: publicTools.map((tool, index) => ({
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
          and crypto calculators. Browse {publicTools.length} tools across{" "}
          {CATEGORIES.length} categories. Every tool is free, private, and on
          its own URL.
        </p>
      </header>

      <SpecialCareerTools variant="tools" />

      <ToolsDirectory />
    </div>
  );
}
