import Link from "next/link";
import type { Calculator } from "@/lib/types";
import { getToolHref } from "@/lib/cryptoFormulas";

type ToolRailRelatedProps = {
  category: string;
  tools: Calculator[];
};

/** Left-rail filler until ads are live — topical internal links. */
export function ToolRailRelated({ category, tools }: ToolRailRelatedProps) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="mb-3 h-1 w-10 rounded-full bg-gradient-to-r from-[#00E5FF] to-[#2979FF]" />
      <p className="text-[10px] font-semibold tracking-[0.14em] text-[var(--accent)] uppercase">
        In this category
      </p>
      <h2 className="mt-1 font-[family-name:var(--font-display)] text-sm font-bold tracking-tight text-[var(--foreground)]">
        Related tools
      </h2>
      <p className="mt-1 text-[11px] leading-relaxed text-[color-mix(in_srgb,var(--foreground)_70%,var(--muted))]">
        More from {category}
      </p>

      {tools.length === 0 ? (
        <p className="mt-4 text-xs text-[var(--muted)]">
          No other tools in this category yet.
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {tools.map((tool) => (
            <li key={tool.slug}>
              <Link
                href={getToolHref(tool.slug)}
                className="block rounded-lg border border-transparent px-2.5 py-2 transition hover:border-[var(--border)] hover:bg-[var(--background)]"
              >
                <span className="line-clamp-3 block text-xs font-semibold leading-snug text-[var(--foreground)] group-hover:text-[var(--accent)]">
                  {railTitle(tool)}
                </span>
                <span className="mt-0.5 line-clamp-2 block text-[10px] leading-relaxed text-[var(--muted)]">
                  {tool.description}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Link
        href="/tools"
        className="mt-4 inline-flex text-[11px] font-semibold tracking-wide text-[var(--accent)] uppercase transition hover:brightness-110"
      >
        Browse all →
      </Link>
    </div>
  );
}

const RAIL_SHORT_TITLES: Record<string, string> = {
  "bc-used-vehicle-private-sale-pst-calculator": "BC private sale PST",
  "bc-used-car-private-sale-pst-calculator-black-book-value":
    "BC used car PST (Black Book)",
  "bc-property-transfer-tax-first-time-home-buyer-exemption-calculator-2026":
    "BC property transfer tax 2026",
  "bc-stat-holiday-pay-calculator-average-days-pay-formula":
    "BC stat holiday pay",
};

function railTitle(tool: Calculator): string {
  return RAIL_SHORT_TITLES[tool.slug] ?? tool.title;
}

type ToolRailSpotlightProps = {
  tools: Calculator[];
  kicker?: string;
  heading?: string;
};

/** Right-rail filler until ads are live — popular shortcuts + tip. */
export function ToolRailSpotlight({
  tools,
  kicker = "Try next",
  heading = "Popular calculators",
}: ToolRailSpotlightProps) {
  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br from-[#00E5FF33] to-[#2979FF22] blur-2xl" />
        <div className="relative">
          <p className="text-[10px] font-semibold tracking-[0.14em] text-[var(--accent)] uppercase">
            {kicker}
          </p>
          <h2 className="mt-1 font-[family-name:var(--font-display)] text-sm font-bold tracking-tight text-[var(--foreground)]">
            {heading}
          </h2>
          <ul className="mt-4 space-y-2">
            {tools.map((tool) => (
              <li key={tool.slug}>
                <Link
                  href={getToolHref(tool.slug)}
                  className="block rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-2 transition hover:border-[var(--accent)]"
                >
                  <span className="line-clamp-3 block text-xs font-semibold text-[var(--foreground)]">
                    {railTitle(tool)}
                  </span>
                  <span className="mt-0.5 block text-[10px] font-medium tracking-wide text-[var(--accent)] uppercase">
                    {tool.category.split("&")[0]?.trim() ?? tool.category}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <p className="text-[10px] font-semibold tracking-[0.14em] text-[var(--accent)] uppercase">
          Quick tip
        </p>
        <p className="mt-2 text-xs leading-relaxed text-[color-mix(in_srgb,var(--foreground)_75%,var(--muted))]">
          Bookmark this page and tweak inputs live—results update instantly in
          your browser with no signup.
        </p>
        <Link
          href="/"
          className="mt-3 inline-flex text-[11px] font-semibold tracking-wide text-[var(--accent)] uppercase transition hover:brightness-110"
        >
          Back to home →
        </Link>
      </div>
    </div>
  );
}
