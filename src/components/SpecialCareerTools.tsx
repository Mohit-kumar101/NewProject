import Link from "next/link";
import { CONFIG_CALCULATORS } from "@/config/calculators";

type Props = {
  /** Tighter layout for the /tools directory page */
  variant?: "home" | "tools";
};

export function SpecialCareerTools({ variant = "home" }: Props) {
  const isHome = variant === "home";

  return (
    <section
      className={
        isHome
          ? "border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--accent)_6%,var(--background))] py-14"
          : "mb-10"
      }
    >
      <div className={isHome ? "mx-auto max-w-7xl px-4 sm:px-6" : undefined}>
        <div className="mb-6 max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.18em] text-[var(--accent)] uppercase">
            Special tools
          </p>
          <h2
            className={
              isHome
                ? "mt-2 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight sm:text-3xl"
                : "mt-2 font-[family-name:var(--font-display)] text-xl font-bold tracking-tight sm:text-2xl"
            }
          >
            Career & compensation calculators
          </h2>
          <p className="mt-2 text-sm text-[var(--muted)] sm:text-base">
            Side-by-side offer comparison, remote stipend value, non-compete
            radius, layoff runway, and shift-swap fairness — free to use. Sign
            in for a free Vaultline account to save your results.
          </p>
        </div>

        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CONFIG_CALCULATORS.map((tool) => (
            <li key={tool.slug}>
              <Link
                href={`/tools/${tool.slug}`}
                className="hover-lift flex h-full flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-4"
              >
                <span className="text-sm font-semibold">{tool.topic}</span>
                <span className="mt-2 line-clamp-2 text-xs text-[var(--muted)]">
                  {tool.benefit}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
