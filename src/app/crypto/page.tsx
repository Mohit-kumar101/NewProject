import type { Metadata } from "next";
import Link from "next/link";
import {
  SITE_NAME,
  SITE_URL,
  getCalculatorsByCategory,
} from "@/lib/calculators";
import { CRYPTO_CATEGORY, CRYPTO_SHORT_SLUGS } from "@/lib/cryptoFormulas";
import { buildPageMetadata } from "@/lib/pageMetadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Crypto Calculators",
  description:
    "Free crypto calculators for profit, ROI, DCA, market cap, FDV, tokenomics, DEX liquidity, staking, and launch costs. Instant browser results.",
  path: "/crypto",
  keywords: [
    "crypto calculators",
    "bitcoin calculator",
    "crypto profit calculator",
    "DCA calculator",
    "FDV calculator",
    "staking calculator",
    "tokenomics calculator",
  ],
});

const shortByToolSlug = Object.fromEntries(
  Object.entries(CRYPTO_SHORT_SLUGS).map(([short, full]) => [full, short])
);

export default function CryptoHubPage() {
  const tools = getCalculatorsByCategory(CRYPTO_CATEGORY);

  const itemList = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Crypto Calculators | ${SITE_NAME}`,
    description:
      "Directory of CalculioHub crypto and digital-asset calculators.",
    url: `${SITE_URL}/crypto`,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: tools.length,
      itemListElement: tools.map((tool, index) => {
        const short = shortByToolSlug[tool.slug];
        return {
          "@type": "ListItem",
          position: index + 1,
          url: short
            ? `${SITE_URL}/crypto/${short}`
            : `${SITE_URL}/tools/${tool.slug}`,
          name: tool.title,
        };
      }),
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
          <li>
            <Link href="/tools" className="hover:text-[var(--accent)]">
              Tools
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="font-medium text-[var(--foreground)]" aria-current="page">
            Crypto
          </li>
        </ol>
      </nav>

      <header className="mb-10 max-w-3xl">
        <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-[var(--accent)] uppercase">
          Crypto & Digital Assets
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
          Crypto calculators
        </h1>
        <p className="mt-4 text-base leading-relaxed text-[var(--muted)] sm:text-lg">
          Ten modular tools for trading P&amp;L, DCA planning, valuations,
          tokenomics, DEX liquidity, staking yield, ROI, and launch budgets—all
          computed instantly on-device.
        </p>
      </header>

      <div className="mb-10 grid gap-3 sm:grid-cols-2">
        <Link
          href="/crypto/reports"
          className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 py-4 transition hover:border-[var(--accent)]"
        >
          <p className="text-xs font-semibold tracking-wide text-[var(--accent)] uppercase">
            Free
          </p>
          <p className="mt-1 font-semibold">Tokenomics Report Studio</p>
        </Link>
        <Link
          href="/crypto/token-creator"
          className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 py-4 transition hover:border-[var(--accent)]"
        >
          <p className="text-xs font-semibold tracking-wide text-[var(--accent)] uppercase">
            Free
          </p>
          <p className="mt-1 font-semibold">Token Creator Wizard</p>
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {tools.map((tool) => {
          const short = shortByToolSlug[tool.slug];
          const href = short ? `/crypto/${short}` : `/tools/${tool.slug}`;
          return (
            <Link
              key={tool.slug}
              href={href}
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
          );
        })}
      </div>

      <p className="mt-10 max-w-3xl text-xs leading-relaxed text-[var(--muted)]">
        Results are for informational and educational purposes only and do not
        constitute financial, investment, legal, or trading advice. Always do
        your own research and consult qualified professionals when needed.
      </p>
    </div>
  );
}
