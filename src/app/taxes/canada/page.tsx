import Link from "next/link";
import type { Metadata } from "next";
import {
  getCalculatorsByCategory,
  SITE_NAME,
  SITE_URL,
} from "@/lib/calculators";
import { getToolHref } from "@/lib/cryptoFormulas";

export const metadata: Metadata = {
  title: `Canada Tax Calculators ${new Date().getFullYear()} | ${SITE_NAME}`,
  description:
    "Free Canadian and BC tax planning calculators — GST/HST, CPP, EI, property transfer, and more. Private in-browser estimates with saved yearly snapshots.",
  alternates: { canonical: `${SITE_URL}/taxes/canada` },
};

export default function CanadaTaxHubPage() {
  const canadian = getCalculatorsByCategory("Canadian Taxes");
  const bc = getCalculatorsByCategory("BC Local Taxes");
  const year = new Date().getFullYear();

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <p className="text-xs font-semibold tracking-[0.18em] text-[var(--accent)] uppercase">
        Seasonal hub · {year}
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
        Canada & BC tax calculators
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-[color-mix(in_srgb,var(--foreground)_78%,var(--muted))]">
        Plan before filing season (typically March–April). Tools run in your
        browser — save an estimate on your device and compare next year. Not a
        substitute for CRA guidance or professional tax advice.
      </p>

      <section className="mt-10">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold">
          Canadian Taxes
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {canadian.map((tool) => (
            <li key={tool.slug}>
              <Link
                href={getToolHref(tool.slug)}
                className="hover-lift block rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-4"
              >
                <span className="font-semibold">{tool.title}</span>
                <span className="mt-1 block text-xs text-[var(--muted)] line-clamp-2">
                  {tool.description}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold">
          BC Local Taxes
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {bc.map((tool) => (
            <li key={tool.slug}>
              <Link
                href={getToolHref(tool.slug)}
                className="hover-lift block rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-4"
              >
                <span className="font-semibold">{tool.title}</span>
                <span className="mt-1 block text-xs text-[var(--muted)] line-clamp-2">
                  {tool.description}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
