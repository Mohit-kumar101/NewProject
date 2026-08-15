import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME } from "@/lib/calculators";
import { TokenCreatorWizard } from "@/components/crypto/TokenCreatorWizard";
import { buildPageMetadata } from "@/lib/pageMetadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Token Creator Wizard",
  description:
    "Free multi-step ERC-20 token creator for Base, Polygon, and Ethereum—ready for MetaMask via viem.",
  path: "/crypto/token-creator",
  keywords: ["ERC-20 creator", "token wizard", "Base", "Polygon", SITE_NAME],
});

export default function TokenCreatorPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-[var(--muted)]">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="hover:text-[var(--accent)]">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href="/crypto" className="hover:text-[var(--accent)]">
              Crypto
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="font-medium text-[var(--foreground)]">Token Creator</li>
        </ol>
      </nav>

      <header className="mb-10 max-w-3xl">
        <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-[var(--accent)] uppercase">
          Free · Base, Polygon, Ethereum
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
          Token Creator Wizard
        </h1>
        <p className="mt-4 text-base leading-relaxed text-[var(--muted)] sm:text-lg">
          Configure a standard ERC-20, download Remix-ready Solidity, and
          optionally connect MetaMask. Live wallet deploy stays opt-in via
          environment flags.
        </p>
      </header>

      <TokenCreatorWizard />

      <section className="mt-14 max-w-3xl">
        <h2 className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight">
          Related crypto tools
        </h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          <li>
            <Link
              href="/crypto/token-launch-cost-calculator"
              className="text-sm font-medium text-[var(--accent)] hover:underline"
            >
              Token Launch Cost Calculator →
            </Link>
          </li>
          <li>
            <Link
              href="/crypto/tokenomics-calculator"
              className="text-sm font-medium text-[var(--accent)] hover:underline"
            >
              Tokenomics Calculator →
            </Link>
          </li>
          <li>
            <Link
              href="/crypto/reports"
              className="text-sm font-medium text-[var(--accent)] hover:underline"
            >
              Tokenomics Report Studio →
            </Link>
          </li>
          <li>
            <Link
              href="/crypto"
              className="text-sm font-medium text-[var(--accent)] hover:underline"
            >
              All crypto calculators →
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
