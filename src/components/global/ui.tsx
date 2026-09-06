"use client";

import type { ReactNode } from "react";

export function Field({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (n: number) => void;
}) {
  return (
    <div>
      <div className="mb-1.5 flex justify-between gap-2">
        <label className="text-sm font-medium">{label}</label>
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className="calc-inset w-28 rounded-lg px-2 py-1 text-right text-sm outline-none focus:border-[var(--accent)]"
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range-input w-full"
      />
    </div>
  );
}

export function ResultHero({
  eyebrow,
  value,
  insight,
  children,
}: {
  eyebrow: string;
  value: string;
  insight: string;
  children?: ReactNode;
}) {
  return (
    <div className="results-card relative z-0 rounded-2xl p-6">
      <div className="relative z-[1]">
        <p className="text-xs font-semibold tracking-[0.16em] text-[var(--accent)] uppercase">
          {eyebrow}
        </p>
        <p className="result-glow mt-2 font-[family-name:var(--font-display)] text-3xl font-bold">
          {value}
        </p>
        <p className="mt-2 text-sm text-[var(--muted)]">{insight}</p>
        {children}
      </div>
    </div>
  );
}

export function Panel({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="calc-panel rounded-2xl p-5 sm:p-6">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

export function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <dt className="text-[var(--muted)]">{label}</dt>
      <dd className="font-semibold tabular-nums">{value}</dd>
    </div>
  );
}
