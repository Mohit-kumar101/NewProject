import Link from "next/link";
import { Logo } from "./Logo";
import { CATEGORIES } from "@/lib/calculators";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.2fr_1fr_1fr]">
        <div className="space-y-4">
          <Logo size="sm" />
          <p className="max-w-sm text-sm leading-relaxed text-[var(--muted)]">
            CalculioHub delivers fast, accurate calculators across finance,
            education, math, HR, travel, and lifestyle—150 tools built for clarity.
          </p>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold text-[var(--foreground)]">
            Categories
          </h3>
          <ul className="space-y-2">
            {CATEGORIES.map((category) => (
              <li key={category}>
                <Link
                  href={`/#${category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                  className="text-sm text-[var(--muted)] transition hover:text-[var(--accent)]"
                >
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold text-[var(--foreground)]">
            Product
          </h3>
          <ul className="space-y-2 text-sm text-[var(--muted)]">
            <li>
              <Link href="/#tools" className="hover:text-[var(--accent)]">
                All 150 Calculators
              </Link>
            </li>
            <li>
              <a href="https://calculiohub.com" className="hover:text-[var(--accent)]">
                calculiohub.com
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[var(--border)] py-5 text-center text-xs text-[var(--muted)]">
        © {new Date().getFullYear()} CalculioHub. Built for clarity in every calculation.
      </div>
    </footer>
  );
}
