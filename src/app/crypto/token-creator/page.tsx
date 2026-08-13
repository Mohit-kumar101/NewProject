import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/calculators";
import { TokenCreatorWizard } from "@/components/crypto/TokenCreatorWizard";

export const metadata: Metadata = {
  title: "Token Creator Wizard",
  description:
    "Free multi-step ERC-20 token creator for Base, Polygon, and Ethereum—ready for MetaMask via viem.",
  alternates: { canonical: `${SITE_URL}/crypto/token-creator` },
  openGraph: {
    title: `Token Creator Wizard | ${SITE_NAME}`,
    url: `${SITE_URL}/crypto/token-creator`,
    siteName: SITE_NAME,
  },
};

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
          Configure a standard ERC-20, pick a chain, and connect MetaMask. Live
          bytecode deploy stays opt-in via environment flags.
        </p>
      </header>

      <TokenCreatorWizard />
    </div>
  );
}
