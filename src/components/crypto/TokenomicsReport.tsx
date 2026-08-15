"use client";

import { useRef, useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import type { TokenomicsPoint } from "@/lib/monetization/tokenomicsSeries";
import { SITE_NAME } from "@/lib/calculators";

export function TokenomicsReportPanel({
  series,
  inputs,
}: {
  series: TokenomicsPoint[];
  inputs: Record<string, number>;
}) {
  const reportRef = useRef<HTMLDivElement>(null);
  const [brandName, setBrandName] = useState(SITE_NAME);
  const [accent, setAccent] = useState("#00B8D4");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const last = series[series.length - 1];

  const downloadPdf = async () => {
    if (!reportRef.current) return;
    setBusy(true);
    setError(null);
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        logging: false,
        // Avoid lab()/oklch() paint issues from page chrome outside the card.
        foreignObjectRendering: false,
      });
      const img = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 24;
      const usableWidth = pageWidth - margin * 2;
      const usableHeight = pageHeight - margin * 2;
      const ratio = Math.min(usableWidth / canvas.width, usableHeight / canvas.height);
      let w = canvas.width * ratio;
      let h = canvas.height * ratio;

      // Multi-page when the report is taller than one A4 sheet.
      if (h <= usableHeight) {
        pdf.addImage(img, "PNG", (pageWidth - w) / 2, margin, w, h);
      } else {
        const pageCanvas = document.createElement("canvas");
        const pageCtx = pageCanvas.getContext("2d");
        if (!pageCtx) throw new Error("Canvas unavailable");
        const sliceHeightPx = Math.floor((usableHeight / w) * canvas.width);
        pageCanvas.width = canvas.width;
        let offset = 0;
        let page = 0;
        while (offset < canvas.height) {
          const slice = Math.min(sliceHeightPx, canvas.height - offset);
          pageCanvas.height = slice;
          pageCtx.clearRect(0, 0, pageCanvas.width, slice);
          pageCtx.drawImage(
            canvas,
            0,
            offset,
            canvas.width,
            slice,
            0,
            0,
            canvas.width,
            slice
          );
          const sliceImg = pageCanvas.toDataURL("image/png");
          const sliceH = (slice / canvas.width) * w;
          if (page > 0) pdf.addPage();
          pdf.addImage(sliceImg, "PNG", (pageWidth - w) / 2, margin, w, sliceH);
          offset += slice;
          page += 1;
        }
      }

      pdf.save("tokenomics-report.pdf");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not generate PDF.";
      setError(
        `${message} Try Chrome/Edge, disable extensions, or refresh and retry.`
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-xl font-bold">
            Tokenomics report
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Generate a downloadable PDF from your current scenario. Branding is
            optional.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void downloadPdf()}
          disabled={busy}
          className="rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[#041018] disabled:opacity-60"
        >
          {busy ? "Building PDF…" : "Download PDF"}
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-xs">
          <span className="font-medium text-[var(--muted)]">Brand name</span>
          <input
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-sm"
          />
        </label>
        <label className="text-xs">
          <span className="font-medium text-[var(--muted)]">Accent color</span>
          <input
            type="color"
            value={accent}
            onChange={(e) => setAccent(e.target.value)}
            className="mt-1 h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--background)]"
          />
        </label>
      </div>

      {error ? (
        <p className="text-xs text-red-500" role="alert">
          {error}
        </p>
      ) : null}

      <div
        ref={reportRef}
        className="rounded-2xl border border-[#d7e0ea] bg-white p-8 text-[#0b1220]"
        style={{ color: "#0b1220", backgroundColor: "#ffffff" }}
      >
        <div
          className="mb-6 h-1.5 w-24 rounded-full"
          style={{ background: accent }}
        />
        <p className="text-xs font-semibold tracking-[0.18em] uppercase opacity-70">
          {brandName} · Tokenomics Report
        </p>
        <h3 className="mt-2 text-2xl font-bold tracking-tight">
          Supply expansion overview
        </h3>
        <p className="mt-2 text-sm opacity-80">
          Generated {new Date().toLocaleString()}. For informational and
          educational purposes only — not financial advice.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {Object.entries(inputs).map(([k, v]) => (
            <div
              key={k}
              className="rounded-xl border border-[#d7e0ea] px-3 py-2 text-sm"
            >
              <div className="text-xs opacity-60">{k}</div>
              <div className="font-semibold">{Number(v).toLocaleString()}</div>
            </div>
          ))}
        </div>

        {last ? (
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-[#f7fafc] p-4">
              <div className="text-xs opacity-60">Final circulating</div>
              <div className="text-lg font-bold">
                {Math.round(last.circulating).toLocaleString()}
              </div>
            </div>
            <div className="rounded-xl bg-[#f7fafc] p-4">
              <div className="text-xs opacity-60">Final locked</div>
              <div className="text-lg font-bold">
                {Math.round(last.locked).toLocaleString()}
              </div>
            </div>
            <div className="rounded-xl bg-[#f7fafc] p-4">
              <div className="text-xs opacity-60">Horizon</div>
              <div className="text-lg font-bold">{last.month} months</div>
            </div>
          </div>
        ) : null}

        <table className="mt-6 w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#d7e0ea]">
              <th className="py-2">Month</th>
              <th className="py-2">Circulating</th>
              <th className="py-2">Locked</th>
            </tr>
          </thead>
          <tbody>
            {series
              .filter((r) => r.month % 6 === 0 || r.month === series.length - 1)
              .map((r) => (
                <tr key={r.month} className="border-b border-[#eef2f6]">
                  <td className="py-1.5">{r.month}</td>
                  <td className="py-1.5">
                    {Math.round(r.circulating).toLocaleString()}
                  </td>
                  <td className="py-1.5">
                    {Math.round(r.locked).toLocaleString()}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
