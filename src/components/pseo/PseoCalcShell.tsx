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
    <div className="grid gap-5 sm:gap-6 lg:grid-cols-2 lg:items-start">
      {/* Results first on phone so users see output while scrolling inputs */}
      <aside className="order-1 lg:order-2 lg:sticky lg:top-24">
        <div className="results-card rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-6">
          <p className="text-[10px] font-semibold tracking-[0.14em] text-[var(--accent)] uppercase sm:text-xs sm:tracking-[0.16em]">
            Live results
          </p>
          <p className="mt-2 text-sm text-[var(--muted)] break-words-safe">
            {primaryLabel}
          </p>
          <p className="result-glow mt-1 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight break-words-safe sm:text-3xl md:text-4xl">
            {primaryValue}
          </p>
          <dl className="mt-5 space-y-3 border-t border-[var(--border)] pt-4 text-sm sm:mt-6 sm:pt-5">
            {rows.map((row) => (
              <div
                key={row.label}
                className="flex flex-col gap-0.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4"
              >
                <dt className="min-w-0 text-[var(--muted)] break-words-safe">
                  {row.label}
                </dt>
                <dd className="shrink-0 font-semibold sm:text-right break-words-safe">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
          {note ? (
            <p className="mt-4 text-xs leading-relaxed text-[var(--muted)] sm:mt-5">
              {note}
            </p>
          ) : null}
        </div>
      </aside>

      <div className="order-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-6 lg:order-1">
        <h2 className="mb-4 text-base font-semibold sm:mb-5 sm:text-lg">
          Inputs
        </h2>
        <div className="space-y-5 sm:space-y-6">
          {fields.map((input) =>
            input.inputType === "checkbox" ? (
              <label
                key={input.id}
                htmlFor={input.id}
                className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-3 sm:px-4"
              >
                <span className="min-w-0 text-sm font-medium text-[var(--foreground)] break-words-safe">
                  {input.label}
                </span>
                <input
                  id={input.id}
                  type="checkbox"
                  checked={input.value >= 0.5}
                  onChange={(e) => input.onChange(e.target.checked ? 1 : 0)}
                  className="h-5 w-5 shrink-0 accent-[var(--accent)]"
                />
              </label>
            ) : (
              <div key={input.id}>
                <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                  <label
                    htmlFor={input.id}
                    className="min-w-0 text-sm font-medium text-[var(--foreground)] break-words-safe"
                  >
                    {input.label}
                  </label>
                  <input
                    id={`${input.id}-number`}
                    type="number"
                    inputMode="decimal"
                    min={input.min}
                    max={input.max}
                    step={input.step}
                    value={input.value}
                    onChange={(e) => {
                      const n = Number(e.target.value);
                      input.onChange(Number.isFinite(n) ? n : input.value);
                    }}
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-right text-sm outline-none focus:border-[var(--accent)] sm:w-28 sm:px-2.5 sm:py-1.5"
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
    </div>
  );
}
