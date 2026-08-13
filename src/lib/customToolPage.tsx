/**
 * Shared App Router page helper for dedicated custom tool routes
 * (expense tracker, file converters, etc.).
 */

import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ToolPageShell } from "@/components/ToolPageShell";
import { getCalculatorBySlug } from "@/lib/calculators";
import { buildToolMetadata } from "@/lib/seo";

export function buildCustomToolMetadata(slug: string, fallbackTitle: string): Metadata {
  const calculator = getCalculatorBySlug(slug);
  if (!calculator) return { title: fallbackTitle };
  return buildToolMetadata(calculator);
}

export function CustomToolPage({
  slug,
  fallbackTitle,
  workspace,
}: {
  slug: string;
  fallbackTitle: string;
  workspace: ReactNode;
}) {
  const calculator = getCalculatorBySlug(slug);
  if (!calculator) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-2xl font-bold">{fallbackTitle} unavailable</h1>
        <p className="mt-2 text-[var(--muted)]">
          Catalog entry missing. Please refresh or contact support.
        </p>
      </div>
    );
  }

  return <ToolPageShell calculator={calculator} workspace={workspace} />;
}
