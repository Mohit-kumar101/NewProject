import type { Metadata } from "next";
import Link from "next/link";
import { getPublicCalculators, SITE_NAME } from "@/lib/calculators";
import { getToolHref } from "@/lib/cryptoFormulas";
import { buildPageMetadata } from "@/lib/pageMetadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Site index",
  description: `Numbered A–Z index of every ${SITE_NAME} calculator and converter.`,
  path: "/site-index",
  noIndex: true,
});

const LETTERS = [
  "0-9",
  ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
] as const;

function indexLetter(title: string): string {
  const ch = title.replace(/^[^a-zA-Z0-9]+/, "").charAt(0);
  if (!ch) return "0-9";
  if (/[0-9]/.test(ch)) return "0-9";
  return ch.toUpperCase();
}

export default function SiteIndexPage() {
  const tools = [...getPublicCalculators()].sort((a, b) =>
    a.title.localeCompare(b.title, "en", { sensitivity: "base" })
  );

  const rows = tools.map((tool, i) => ({
    n: i + 1,
    title: tool.title,
    href: getToolHref(tool.slug),
    category: tool.category,
    letter: indexLetter(tool.title),
  }));

  const used = new Set(rows.map((row) => row.letter));
  const groups = LETTERS.filter((letter) => used.has(letter)).map((letter) => ({
    letter,
    items: rows.filter((row) => row.letter === letter),
  }));

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <p className="text-xs font-semibold tracking-[0.18em] text-[var(--muted)] uppercase">
        Internal index
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
        Site index
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
        Every public calculator and converter, numbered, A–Z. {rows.length}{" "}
        tools.
      </p>

      <nav
        aria-label="Jump to letter"
        className="sticky top-14 z-10 mt-8 flex flex-wrap gap-1 border-y border-[var(--border)] bg-[var(--surface-solid)] py-3 sm:top-16"
      >
        {LETTERS.map((letter) =>
          used.has(letter) ? (
            <a
              key={letter}
              href={`#letter-${letter}`}
              className="rounded px-1.5 py-0.5 text-xs font-semibold text-[var(--accent)] hover:underline"
            >
              {letter}
            </a>
          ) : (
            <span
              key={letter}
              className="px-1.5 py-0.5 text-xs text-[var(--muted)]/40"
            >
              {letter}
            </span>
          )
        )}
      </nav>

      {groups.map((group) => (
        <section key={group.letter} className="mt-10">
          <h2
            id={`letter-${group.letter}`}
            className="scroll-mt-28 font-[family-name:var(--font-display)] text-2xl font-bold"
          >
            {group.letter}
          </h2>
          <ol className="mt-3 divide-y divide-[var(--border)] border-t border-[var(--border)]">
            {group.items.map((item) => (
              <li key={`${item.n}-${item.href}`}>
                <Link
                  href={item.href}
                  className="flex gap-3 py-2.5 text-sm hover:text-[var(--accent)]"
                >
                  <span className="w-10 shrink-0 tabular-nums text-[var(--muted)]">
                    {item.n}.
                  </span>
                  <span className="min-w-0">
                    <span className="font-medium">{item.title}</span>
                    <span className="mt-0.5 block text-xs text-[var(--muted)]">
                      {item.category}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
