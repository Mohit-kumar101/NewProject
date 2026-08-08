import Link from "next/link";
import { Logo } from "./Logo";
import { CATEGORIES } from "@/lib/calculators";

const LEGAL_LINKS = [
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
] as const;

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div className="space-y-4">
          <Logo size="sm" />
          <p className="max-w-sm text-sm leading-relaxed text-[var(--muted)]">
            CalculioHub delivers fast, accurate calculators across finance,
            education, math, HR, travel, and lifestyle—built for clarity and
            constantly expanding.
          </p>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold text-[var(--foreground)]">
            Categories
          </h3>
          <ul className="space-y-2">
            {CATEGORIES.slice(0, 6).map((category) => (
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
              <Link href="/tools" className="hover:text-[var(--accent)]">
                All Calculators
              </Link>
            </li>
            <li>
              <Link
                href="/tools/scientific-calculator"
                className="hover:text-[var(--accent)]"
              >
                Scientific Calculator
              </Link>
            </li>
            <li>
              <Link
                href="/tools/expense-tracker"
                className="hover:text-[var(--accent)]"
              >
                Expense Tracker
              </Link>
            </li>
            <li>
              <a
                href="https://calculiohub.com"
                className="hover:text-[var(--accent)]"
              >
                calculiohub.com
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold text-[var(--foreground)]">
            Company & legal
          </h3>
          <ul className="space-y-2 text-sm text-[var(--muted)]">
            {LEGAL_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-[var(--accent)]">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-[var(--border)] py-5 text-center text-xs text-[var(--muted)]">
        <p>
          © {new Date().getFullYear()} CalculioHub. Built for clarity in every
          calculation.
        </p>
        <p className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
          {LEGAL_LINKS.map((link) => (
            <Link
              key={`bottom-${link.href}`}
              href={link.href}
              className="transition hover:text-[var(--accent)]"
            >
              {link.label}
            </Link>
          ))}
        </p>
      </div>
    </footer>
  );
}
