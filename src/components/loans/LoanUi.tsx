"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import type { Calculator } from "@/lib/types";
import { getToolHref } from "@/lib/cryptoFormulas";
import {
  formatLoanMoney,
  type AmortRow,
} from "@/lib/loanTools";
import { BalanceTrendChart } from "@/components/loans/BalanceTrendChart";
import { jsPDF } from "jspdf";
import { downloadTextFile } from "@/lib/monetization/tokenomicsSeries";

export function LoanMetricCards({
  items,
}: {
  items: { label: string; value: string; accent?: boolean }[];
}) {
  return (
    <div
      className={`grid gap-3 ${
        items.length >= 4
          ? "sm:grid-cols-2 lg:grid-cols-4"
          : items.length === 3
            ? "sm:grid-cols-3"
            : "sm:grid-cols-2"
      }`}
    >
      {items.map((item) => (
        <div
          key={item.label}
          className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5"
        >
          {item.accent && (
            <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-[#00E5FF33] to-[#2979FF22] blur-2xl" />
          )}
          <p className="text-[11px] font-semibold tracking-[0.14em] text-[var(--accent)] uppercase">
            {item.label}
          </p>
          <p className="relative mt-2 font-[family-name:var(--font-display)] text-xl font-bold tracking-tight sm:text-2xl">
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}

export function LoanSparkline({
  values,
  label,
}: {
  values: number[];
  label: string;
}) {
  return <BalanceTrendChart values={values} label={label} className="mt-4" />;
}

export function LoanScheduleTable({
  rows,
  title = "Amortization preview",
}: {
  rows: AmortRow[];
  title?: string;
}) {
  if (rows.length === 0) return null;
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Showing key months from your schedule (client-side only).
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-[11px] tracking-wide text-[var(--muted)] uppercase">
              <th className="py-2 pr-3 font-semibold">Mo</th>
              <th className="py-2 pr-3 font-semibold">Payment</th>
              <th className="py-2 pr-3 font-semibold">Interest</th>
              <th className="py-2 pr-3 font-semibold">Principal</th>
              <th className="py-2 font-semibold">Balance</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.month} className="border-b border-[var(--border)]">
                <td className="py-2 pr-3 font-medium">{row.month}</td>
                <td className="py-2 pr-3">{formatLoanMoney(row.payment)}</td>
                <td className="py-2 pr-3">{formatLoanMoney(row.interest)}</td>
                <td className="py-2 pr-3">{formatLoanMoney(row.principal)}</td>
                <td className="py-2">{formatLoanMoney(row.balance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function LoanNumberField({
  id,
  label,
  value,
  min,
  max,
  step,
  onChange,
  hint,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (n: number) => void;
  hint?: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-[var(--foreground)]">
          {label}
        </label>
        <input
          id={`${id}-number`}
          type="number"
          inputMode="decimal"
          min={min}
          max={max}
          step={step}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => {
            const next = Number(e.target.value);
            onChange(Number.isFinite(next) ? next : value);
          }}
          className="w-28 rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-right text-sm outline-none focus:border-[var(--accent)]"
        />
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={Math.min(max, Math.max(min, value))}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range-input w-full"
      />
      <div className="mt-1 flex justify-between text-[11px] text-[var(--muted)]">
        <span>{min}</span>
        <span>{hint ?? max}</span>
      </div>
    </div>
  );
}

export function LoanWhatIfBanner({ text }: { text: string | null }) {
  if (!text) return null;
  return (
    <p
      className="rounded-xl border border-[color-mix(in_srgb,var(--accent)_35%,var(--border))] bg-[color-mix(in_srgb,var(--accent)_8%,var(--background))] px-4 py-3 text-sm leading-relaxed text-[var(--foreground)]"
      aria-live="polite"
    >
      {text}
    </p>
  );
}

export function LoanExportBar({
  title,
  lines,
  filenameBase,
}: {
  title: string;
  lines: string[];
  filenameBase: string;
}) {
  const exportTxt = () => {
    downloadTextFile(
      `${filenameBase}.txt`,
      [`CalculioHub — ${title}`, "", ...lines].join("\n"),
      "text/plain;charset=utf-8"
    );
  };

  const exportPdf = () => {
    const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
    const margin = 48;
    const maxWidth = pdf.internal.pageSize.getWidth() - margin * 2;
    let y = margin;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.text(`CalculioHub — ${title}`, margin, y);
    y += 22;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(100);
    pdf.text(`Generated ${new Date().toLocaleDateString()}`, margin, y);
    pdf.setTextColor(0);
    y += 20;
    for (const line of lines) {
      const wrapped = pdf.splitTextToSize(line || " ", maxWidth) as string[];
      for (const w of wrapped) {
        if (y > pdf.internal.pageSize.getHeight() - margin) {
          pdf.addPage();
          y = margin;
        }
        pdf.text(w, margin, y);
        y += 14;
      }
    }
    pdf.save(`${filenameBase}.pdf`);
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={exportPdf}
        className="rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[#041018] transition hover:opacity-90"
      >
        Download PDF summary
      </button>
      <button
        type="button"
        onClick={exportTxt}
        className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm font-semibold transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
      >
        Download text
      </button>
    </div>
  );
}

export function LoanRelatedTools({
  calculator,
  related,
}: {
  calculator: Calculator;
  related: Calculator[];
}) {
  return (
    <aside className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h2 className="text-xs font-semibold tracking-[0.14em] text-[var(--accent)] uppercase sm:text-sm">
          Related tools
        </h2>
        <p className="text-[11px] text-[var(--muted)]">{calculator.category}</p>
      </div>
      <ul className="grid gap-2 sm:grid-cols-2">
        {related.map((tool) => (
          <li key={tool.slug}>
            <Link
              href={getToolHref(tool.slug)}
              className="block rounded-xl border border-transparent px-3 py-2.5 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--border)] hover:bg-[var(--background)] hover:text-[var(--accent)]"
            >
              {tool.title}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export function LoanWorkspaceFrame({
  title,
  blurb,
  children,
}: {
  title: string;
  blurb: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
        <p className="text-xs font-semibold tracking-[0.16em] text-[var(--accent)] uppercase">
          Interactive workspace
        </p>
        <h2 className="mt-1 font-[family-name:var(--font-display)] text-xl font-bold tracking-tight">
          {title}
        </h2>
        <p className="mt-1 text-sm text-[var(--muted)]">{blurb}</p>
      </div>
      {children}
    </div>
  );
}
