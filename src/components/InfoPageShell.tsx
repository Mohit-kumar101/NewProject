import type { ReactNode } from "react";
import Link from "next/link";

export function InfoPageShell({
  eyebrow,
  title,
  description,
  children,
  updated,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  updated?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <nav aria-label="Breadcrumb" className="mb-8 text-sm text-[var(--muted)]">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="transition hover:text-[var(--accent)]">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="font-medium text-[var(--foreground)]">{title}</li>
        </ol>
      </nav>

      <header className="mb-10">
        <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-[var(--accent)] uppercase">
          {eyebrow}
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
          {title}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-[color-mix(in_srgb,var(--foreground)_78%,var(--muted))] sm:text-lg">
          {description}
        </p>
        {updated ? (
          <p className="mt-3 text-xs text-[var(--muted)]">Last updated: {updated}</p>
        ) : null}
        <div className="mt-6 h-1 w-14 rounded-full bg-gradient-to-r from-[#00E5FF] to-[#2979FF]" />
      </header>

      <article className="space-y-8 text-sm leading-relaxed text-[color-mix(in_srgb,var(--foreground)_78%,var(--muted))] sm:text-base">
        {children}
      </article>
    </div>
  );
}

export function InfoSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
      <h2 className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight text-[var(--foreground)]">
        {title}
      </h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}
