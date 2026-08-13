import Link from "next/link";
import { Logo } from "./Logo";
import { CATEGORIES, CONVERTER_CATEGORIES } from "@/lib/calculators";

const LEGAL_LINKS = [
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
] as const;

function categoryHref(category: string) {
  if (category === "Crypto & Digital Assets") return "/crypto";
  return `/#${category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div className="space-y-4">
          <Logo size="sm" />
          <p className="max-w-sm text-sm leading-relaxed text-[var(--muted)]">
            The free alternative to paid converters. CalculioHub gives you
            private PDF, image, and media tools plus finance and crypto
            calculators — no subscription, no watermark.
          </p>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold text-[var(--foreground)]">
            Categories
          </h3>
          <ul className="space-y-2">
            {CATEGORIES.slice(0, 5).map((category) => (
              <li key={category}>
                <Link
                  href={categoryHref(category)}
                  className="text-sm text-[var(--muted)] transition hover:text-[var(--accent)]"
                >
                  {category}
                </Link>
              </li>
            ))}
            {CONVERTER_CATEGORIES.map((category) => (
              <li key={category}>
                <Link
                  href={categoryHref(category)}
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
                All Tools
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
                href="/tools/pdf-text-converter"
                className="hover:text-[var(--accent)]"
              >
                PDF ↔ Text Converter
              </Link>
            </li>
            <li>
              <Link
                href="/tools/mp4-mp3-converter"
                className="hover:text-[var(--accent)]"
              >
                MP4 ↔ MP3 Converter
              </Link>
            </li>
            <li>
              <Link
                href="/tools/json-csv-converter"
                className="hover:text-[var(--accent)]"
              >
                JSON ↔ CSV Converter
              </Link>
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
          calculation and conversion.
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
