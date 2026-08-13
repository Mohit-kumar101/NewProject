"use client";

export function formatUsd(n: number, digits = 0): string {
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(n);
}

export function formatPct(n: number, digits = 0): string {
  if (!Number.isFinite(n)) return "—";
  return `${n.toFixed(digits)}%`;
}

export function formatCad(n: number, digits = 2): string {
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(n);
}

export type PseoField = {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (n: number) => void;
  inputType?: "number" | "checkbox";
};

export function PseoCalcShell({
  fields,
  primaryLabel,
  primaryValue,
  rows,
  note,
}: {
  fields: PseoField[];
  primaryLabel: string;
  primaryValue: string;
  rows: { label: string; value: string }[];
  note?: string;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
        <h2 className="mb-5 text-lg font-semibold">Inputs</h2>
        <div className="space-y-6">
          {fields.map((input) =>
            input.inputType === "checkbox" ? (
              <label
                key={input.id}
                htmlFor={input.id}
                className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3"
              >
                <span className="text-sm font-medium text-[var(--foreground)]">
                  {input.label}
                </span>
                <input
                  id={input.id}
                  type="checkbox"
                  checked={input.value >= 0.5}
                  onChange={(e) => input.onChange(e.target.checked ? 1 : 0)}
                  className="h-5 w-5 accent-[var(--accent)]"
                />
              </label>
            ) : (
              <div key={input.id}>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label
                    htmlFor={input.id}
                    className="text-sm font-medium text-[var(--foreground)]"
                  >
                    {input.label}
                  </label>
                  <input
                    id={`${input.id}-number`}
                    type="number"
                    min={input.min}
                    max={input.max}
                    step={input.step}
                    value={input.value}
                    onChange={(e) => {
                      const n = Number(e.target.value);
                      input.onChange(Number.isFinite(n) ? n : input.value);
                    }}
                    className="w-28 rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-right text-sm outline-none focus:border-[var(--accent)]"
                  />
                </div>
                <input
                  id={input.id}
                  type="range"
                  min={input.min}
                  max={input.max}
                  step={input.step}
                  value={input.value}
                  onChange={(e) => input.onChange(Number(e.target.value))}
                  className="range-input w-full"
                />
              </div>
            )
          )}
        </div>
      </div>

      <aside className="lg:sticky lg:top-24">
        <div className="results-card rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <p className="text-xs font-semibold tracking-[0.16em] text-[var(--accent)] uppercase">
            Live results
          </p>
          <p className="mt-3 text-sm text-[var(--muted)]">{primaryLabel}</p>
          <p className="result-glow mt-1 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
            {primaryValue}
          </p>
          <dl className="mt-6 space-y-3 border-t border-[var(--border)] pt-5 text-sm">
            {rows.map((row) => (
              <div key={row.label} className="flex justify-between gap-4">
                <dt className="text-[var(--muted)]">{row.label}</dt>
                <dd className="text-right font-semibold">{row.value}</dd>
              </div>
            ))}
          </dl>
          {note ? (
            <p className="mt-5 text-xs leading-relaxed text-[var(--muted)]">
              {note}
            </p>
          ) : null}
        </div>
      </aside>
    </div>
  );
}
