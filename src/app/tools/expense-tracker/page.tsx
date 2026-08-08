import type { Metadata } from "next";
import { ExpenseTracker } from "@/components/ExpenseTracker";
import { ToolPageShell } from "@/components/ToolPageShell";
import { getCalculatorBySlug } from "@/lib/calculators";
import { buildToolMetadata } from "@/lib/seo";

const SLUG = "expense-tracker";

export function generateMetadata(): Metadata {
  const calculator = getCalculatorBySlug(SLUG);
  if (!calculator) {
    return { title: "Personal Expense Tracker" };
  }
  return buildToolMetadata(calculator);
}

export default function ExpenseTrackerPage() {
  const calculator = getCalculatorBySlug(SLUG);
  if (!calculator) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-2xl font-bold">Expense tracker unavailable</h1>
        <p className="mt-2 text-[var(--muted)]">
          Catalog entry missing. Please refresh or contact support.
        </p>
      </div>
    );
  }

  return (
    <ToolPageShell
      calculator={calculator}
      workspace={<ExpenseTracker />}
    />
  );
}
