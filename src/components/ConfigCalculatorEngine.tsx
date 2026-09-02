"use client";

import { useMemo, useState } from "react";
import {
  getConfigCalculatorBySlug,
  type ConfigCalculator,
} from "@/config/calculators";
import { OfferStackComparator } from "@/components/OfferStackComparator";
import { SaveCalculationButton } from "@/components/vaultline/SaveCalculationButton";
import { PseoCalcShell } from "@/components/pseo/PseoCalcShell";

function GenericConfigCalculatorEngine({ tool }: { tool: ConfigCalculator }) {
  const [values, setValues] = useState<Record<string, number>>(() =>
    Object.fromEntries(tool.fields.map((f) => [f.id, f.defaultValue]))
  );

  const result = useMemo(() => tool.compute(values), [tool, values]);

  return (
    <div className="space-y-6">
      <PseoCalcShell
        fields={tool.fields.map((field) => ({
          id: field.id,
          label: field.label,
          value: values[field.id] ?? field.defaultValue,
          min: field.min,
          max: field.max,
          step: field.step,
          inputType: field.inputType,
          onChange: (n) =>
            setValues((prev) => ({
              ...prev,
              [field.id]: n,
            })),
        }))}
        primaryLabel={result.primaryLabel}
        primaryValue={result.primaryValue}
        rows={result.rows}
        note={result.note}
      />

      <SaveCalculationButton
        payload={{
          toolSlug: tool.slug,
          toolTitle: tool.topic,
          inputs: values,
          result: {
            primaryLabel: result.primaryLabel,
            primaryValue: result.primaryValue,
            rows: result.rows,
          },
        }}
      />

      <section
        className="max-w-3xl rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6"
        aria-labelledby="how-calculated-heading"
      >
        <h2
          id="how-calculated-heading"
          className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight sm:text-2xl"
        >
          How it&apos;s calculated
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[color-mix(in_srgb,var(--foreground)_78%,var(--muted))] sm:text-base">
          {result.howCalculated}
        </p>
        <p className="mt-4 text-xs leading-relaxed text-[var(--muted)]">
          Formula summary: {tool.formulaSummary}
        </p>
      </section>
    </div>
  );
}

/**
 * Looks up calculator config on the client by slug so `compute` is never
 * passed as a prop from a Server Component (non-serializable).
 */
export function ConfigCalculatorEngine({ slug }: { slug: string }) {
  const tool = getConfigCalculatorBySlug(slug);

  if (!tool) {
    return (
      <p className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] px-5 py-8 text-center text-sm text-[var(--muted)]">
        Calculator not found.
      </p>
    );
  }

  if (tool.slug === "offer-stack-comparator-calculator") {
    return <OfferStackComparator formulaSummary={tool.formulaSummary} />;
  }

  return <GenericConfigCalculatorEngine tool={tool} />;
}
