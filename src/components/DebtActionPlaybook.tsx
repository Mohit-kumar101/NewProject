"use client";

import { useEffect, useMemo, useState } from "react";
import { jsPDF } from "jspdf";
import { downloadTextFile } from "@/lib/monetization/tokenomicsSeries";
import {
  buildPlaybookSteps,
  formatDebtMoney,
  formatDebtMonths,
  loadPlaybookChecks,
  playbookPlanKey,
  playbookToPlainText,
  savePlaybookChecks,
  type DebtEntry,
  type DebtSimulationResult,
  type DebtStrategy,
  type PlaybookStep,
} from "@/lib/debtPayoff";

function wrapPdfText(
  pdf: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const lines = pdf.splitTextToSize(text, maxWidth) as string[];
  for (const line of lines) {
    pdf.text(line, x, y);
    y += lineHeight;
  }
  return y;
}

function downloadPlaybookPdf(
  strategy: DebtStrategy,
  result: DebtSimulationResult,
  steps: PlaybookStep[],
  checked: Set<string>
) {
  const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 48;
  const maxWidth = pageWidth - margin * 2;
  let y = margin;

  const ensureSpace = (need: number) => {
    if (y + need > pageHeight - margin) {
      pdf.addPage();
      y = margin;
    }
  };

  const strategyLabel =
    strategy === "avalanche" ? "Debt Avalanche" : "Debt Snowball";

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  pdf.text("CalculioHub Action Playbook", margin, y);
  y += 24;

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);
  y = wrapPdfText(
    pdf,
    `${strategyLabel} plan · Debt-free in ${formatDebtMonths(result.months)} · Interest ${formatDebtMoney(result.totalInterest)} · Total paid ${formatDebtMoney(result.totalPaid)}`,
    margin,
    y,
    maxWidth,
    14
  );
  y += 8;
  pdf.setFontSize(9);
  pdf.setTextColor(100);
  pdf.text(`Generated ${new Date().toLocaleDateString()} · Free local export`, margin, y);
  pdf.setTextColor(0);
  y += 20;

  steps.forEach((step, index) => {
    ensureSpace(72);
    const done = checked.has(step.id);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.text(
      `${done ? "[x]" : "[ ]"}  ${index + 1}. ${step.monthLabel ?? "Step"} — ${step.title}`,
      margin,
      y
    );
    y += 16;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    y = wrapPdfText(pdf, step.detail, margin + 18, y, maxWidth - 18, 13);
    y += 14;
  });

  ensureSpace(40);
  pdf.setFontSize(8);
  pdf.setTextColor(120);
  pdf.text(
    "Estimates for planning only — not financial advice. Figures stay in your browser.",
    margin,
    y
  );

  pdf.save(
    `calculiohub-${strategy}-playbook.pdf`
  );
}

export function DebtActionPlaybook({
  debts,
  extraPayment,
  strategy,
  result,
}: {
  debts: DebtEntry[];
  extraPayment: number;
  strategy: DebtStrategy;
  result: DebtSimulationResult | null | undefined;
}) {
  const steps = useMemo(() => {
    if (!result || result.unreachable) return [];
    return buildPlaybookSteps(debts, extraPayment, result);
  }, [debts, extraPayment, result]);

  const planKey = useMemo(() => {
    if (!result) return "";
    return playbookPlanKey(strategy, extraPayment, result);
  }, [result, strategy, extraPayment]);

  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [hydrated, setHydrated] = useState(false);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  useEffect(() => {
    if (!planKey) {
      setChecked(new Set());
      setHydrated(true);
      return;
    }
    setChecked(loadPlaybookChecks(planKey));
    setHydrated(true);
  }, [planKey]);

  useEffect(() => {
    if (!hydrated || !planKey) return;
    savePlaybookChecks(planKey, checked);
  }, [checked, hydrated, planKey]);

  const doneCount = steps.filter((s) => checked.has(s.id)).length;
  const progress = steps.length > 0 ? doneCount / steps.length : 0;

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const resetChecks = () => {
    setChecked(new Set());
  };

  const exportTxt = () => {
    if (!steps.length) return;
    const text = playbookToPlainText(strategy, steps, checked);
    downloadTextFile(
      `calculiohub-${strategy}-playbook.txt`,
      text,
      "text/plain;charset=utf-8"
    );
  };

  const exportPdf = () => {
    if (!result || !steps.length) return;
    setPdfBusy(true);
    setPdfError(null);
    try {
      downloadPlaybookPdf(strategy, result, steps, checked);
    } catch (err) {
      setPdfError(
        err instanceof Error ? err.message : "Could not generate PDF."
      );
    } finally {
      setPdfBusy(false);
    }
  };

  if (!result) {
    return (
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
        <p className="text-xs font-semibold tracking-[0.16em] text-[var(--accent)] uppercase">
          Action playbook
        </p>
        <h2 className="mt-1 font-[family-name:var(--font-display)] text-xl font-bold tracking-tight">
          Month-by-month checklist
        </h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Add debts (or load sample data) to generate your custom payoff
          playbook, check off milestones, and download a PDF.
        </p>
      </section>
    );
  }

  if (result.unreachable || steps.length === 0) {
    return (
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
        <p className="text-xs font-semibold tracking-[0.16em] text-[var(--accent)] uppercase">
          Action playbook
        </p>
        <h2 className="mt-1 font-[family-name:var(--font-display)] text-xl font-bold tracking-tight">
          Month-by-month checklist
        </h2>
        <p className="mt-2 text-sm text-[#b91c1c] dark:text-[#f87171]">
          This plan can’t finish with current payments. Raise minimums or extra
          payment, then your checklist will unlock here.
        </p>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
      <div className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-gradient-to-br from-[#00E5FF22] to-[#2979FF18] blur-2xl" />

      <div className="relative flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-[var(--accent)] uppercase">
            Action playbook
          </p>
          <h2 className="mt-1 font-[family-name:var(--font-display)] text-xl font-bold tracking-tight">
            Month-by-month checklist
          </h2>
          <p className="mt-1 max-w-xl text-sm text-[var(--muted)]">
            Built from your{" "}
            {strategy === "avalanche" ? "avalanche" : "snowball"} simulation.
            Check off steps as you go — progress saves in this browser. Export a
            PDF anytime.
          </p>
        </div>
        <p className="rounded-full border border-[var(--border)] px-2.5 py-1 text-[11px] font-semibold text-[var(--muted)]">
          {doneCount}/{steps.length} done
        </p>
      </div>

      <div className="relative mt-4">
        <div className="h-2 overflow-hidden rounded-full bg-[var(--background)]">
          <div
            className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-300"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
      </div>

      <ul className="relative mt-5 space-y-2">
        {steps.map((step, index) => {
          const isDone = checked.has(step.id);
          return (
            <li key={step.id}>
              <label
                className={`flex cursor-pointer gap-3 rounded-xl border px-3.5 py-3 transition ${
                  isDone
                    ? "border-[color-mix(in_srgb,#22c55e_40%,var(--border))] bg-[color-mix(in_srgb,#22c55e_8%,var(--background))]"
                    : "border-[var(--border)] bg-[var(--background)] hover:border-[var(--accent)]"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isDone}
                  onChange={() => toggle(step.id)}
                  className="mt-1 h-4 w-4 shrink-0 accent-[var(--accent)]"
                />
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <span className="text-[11px] font-semibold tracking-wide text-[var(--accent)] uppercase">
                      {step.monthLabel ?? `Step ${index + 1}`}
                    </span>
                    <span
                      className={`text-sm font-semibold ${
                        isDone
                          ? "text-[var(--muted)] line-through"
                          : "text-[var(--foreground)]"
                      }`}
                    >
                      {step.title}
                    </span>
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-[var(--muted)] sm:text-sm">
                    {step.detail}
                  </span>
                </span>
              </label>
            </li>
          );
        })}
      </ul>

      <div className="relative mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={exportPdf}
          disabled={pdfBusy}
          className="rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[#041018] transition hover:opacity-90 disabled:opacity-60"
        >
          {pdfBusy ? "Building PDF…" : "Download PDF playbook"}
        </button>
        <button
          type="button"
          onClick={exportTxt}
          className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm font-semibold transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          Download text
        </button>
        <button
          type="button"
          onClick={resetChecks}
          className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-semibold text-[var(--muted)] transition hover:border-[#ef4444] hover:text-[#ef4444]"
        >
          Reset checks
        </button>
      </div>

      {pdfError && (
        <p className="relative mt-3 text-sm text-[#b91c1c] dark:text-[#f87171]">
          {pdfError}
        </p>
      )}

      <p className="relative mt-4 text-xs leading-relaxed text-[var(--muted)]">
        Checklist progress and your debt list stay on this device only. PDF
        export runs in your browser — nothing is uploaded.
      </p>
    </section>
  );
}
