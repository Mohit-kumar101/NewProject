import Link from "next/link";
import { GUIDE_ARTICLES } from "@/lib/guides/articles";

/** Homepage strip highlighting original editorial guides. */
export function HomeGuidesSpotlight() {
  const featured = GUIDE_ARTICLES.slice(0, 6);

  return (
    <section
      className="border-t border-[var(--border)] bg-[var(--surface)]"
      aria-labelledby="home-guides-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="mb-2 text-xs font-semibold tracking-[0.18em] text-[var(--accent)] uppercase">
              Guides
            </p>
            <h2
              id="home-guides-heading"
              className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight sm:text-3xl"
            >
              Clear explanations behind the numbers
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--muted)] sm:text-base">
              Original articles on money runway, fitness phases, freelancing, and
              private file conversion—written to pair with the tools, not to
              pad keyword pages.
            </p>
          </div>
          <Link
            href="/guides"
            className="text-sm font-semibold text-[var(--accent)] underline-offset-2 hover:underline"
          >
            All guides →
          </Link>
        </div>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((article) => (
            <li key={article.slug}>
              <Link
                href={`/guides/${article.slug}`}
                className="block h-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-4 transition hover:border-[var(--accent)]"
              >
                <p className="text-[10px] font-semibold tracking-[0.14em] text-[var(--accent)] uppercase">
                  {article.category}
                </p>
                <h3 className="mt-2 text-sm font-semibold leading-snug text-[var(--foreground)]">
                  {article.title}
                </h3>
                <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-[var(--muted)]">
                  {article.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
