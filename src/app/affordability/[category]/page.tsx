import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ToolLayout } from "@/components/layouts/ToolLayout";
import {
  AFFORDABILITY_CATEGORIES,
  getAffordabilityCategory,
  getAffordabilityHref,
  getAffordabilityPages,
  getAffordabilityTodos,
} from "@/lib/affordability/catalog";
import { buildAffordabilityCategoryMetadata } from "@/lib/affordability/metadata";
import type { AffordabilityCategoryId } from "@/lib/affordability/types";

type PageProps = {
  params: Promise<{ category: string }>;
};

export function generateStaticParams() {
  return AFFORDABILITY_CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category } = await params;
  return buildAffordabilityCategoryMetadata(category);
}

export default async function AffordabilityCategoryPage({
  params,
}: PageProps) {
  const { category: categorySlug } = await params;
  const category = getAffordabilityCategory(categorySlug);
  if (!category) notFound();

  const ready = getAffordabilityPages({ readyOnly: true }).filter(
    (p) => p.category === category.id
  );
  const todos = getAffordabilityTodos(category.id as AffordabilityCategoryId);

  return (
    <ToolLayout>
      <nav
        aria-label="Breadcrumb"
        className="mb-6 text-sm text-[var(--muted)]"
      >
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-[var(--accent)]">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              href="/affordability"
              className="hover:text-[var(--accent)]"
            >
              Affordability
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-[var(--foreground)]">{category.name}</li>
        </ol>
      </nav>

      <header className="mb-10 max-w-3xl">
        <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-[var(--accent)] uppercase">
          Category hub
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
          {category.name}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-[color-mix(in_srgb,var(--foreground)_78%,var(--muted))] sm:text-lg">
          {category.description}
        </p>
      </header>

      <section className="max-w-3xl space-y-4">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight">
          Live calculators
        </h2>
        <ul className="grid gap-3">
          {ready.map((page) => (
            <li key={page.slug}>
              <Link
                href={getAffordabilityHref(page)}
                className="block rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 py-4 hover-lift"
              >
                <p className="font-semibold text-[var(--foreground)]">
                  {page.title}
                </p>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {page.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {todos.length > 0 ? (
        <section className="mt-14 max-w-3xl space-y-4">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight">
            Coming soon
          </h2>
          <p className="text-sm text-[var(--muted)]">
            {/* TODO: promote each slug below into pages[] with presets + ready:true */}
            Planned intent pages for this hub (pSEO matrix expansion):
          </p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {todos.map((todo) => (
              <li
                key={todo.slug}
                className="rounded-xl border border-dashed border-[var(--border)] px-4 py-3 text-sm text-[var(--muted)]"
              >
                <span className="font-medium text-[color-mix(in_srgb,var(--foreground)_70%,var(--muted))]">
                  {todo.label}
                </span>
                <span className="mt-1 block font-mono text-[11px]">
                  TODO · {todo.slug}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </ToolLayout>
  );
}
