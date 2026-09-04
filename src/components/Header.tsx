"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { href: "/workflows", label: "Workflows" },
  { href: "/crypto", label: "Crypto" },
  { href: "/tools", label: "All Tools" },
  { href: "/hubs/fitness-planners", label: "Fitness" },
  { href: "/hubs/money-milestones", label: "Money" },
  { href: "/about", label: "About" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6">
        <div className="min-w-0 shrink">
          <Logo size="sm" priority />
        </div>

        <nav
          aria-label="Primary"
          className="flex shrink-0 items-center gap-1.5 sm:gap-3"
        >
          <div className="hidden items-center gap-1 md:flex">
            {links.slice(0, 4).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover-tint rounded-lg px-3 py-2 text-sm font-medium text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--foreground)]"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{open ? "Close" : "Menu"}</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              {open ? (
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </nav>
      </div>

      {open ? (
        <div
          id="mobile-nav"
          className="border-t border-[var(--border)] bg-[var(--background)] md:hidden"
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 sm:px-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-base font-medium text-[var(--foreground)] transition hover:bg-[var(--surface)] hover:text-[var(--accent)]"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="mt-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-3 text-center text-sm font-semibold text-[var(--accent)]"
            >
              Contact
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
