"use client";

import { useId } from "react";
import { formatLoanMoney } from "@/lib/loanTools";

function downsample(values: number[], maxPoints = 72): number[] {
  if (values.length <= maxPoints) return values;
  const out: number[] = [];
  const step = (values.length - 1) / (maxPoints - 1);
  for (let i = 0; i < maxPoints; i += 1) {
    out.push(values[Math.round(i * step)] ?? 0);
  }
  out[out.length - 1] = values[values.length - 1] ?? out[out.length - 1]!;
  return out;
}

/**
 * Balance / payoff trend chart — padded Y scale, downsampled points,
 * area fill, and start/end labels so the curve is readable.
 */
export function BalanceTrendChart({
  values,
  label,
  className = "",
}: {
  values: number[];
  label: string;
  className?: string;
}) {
  const reactId = useId().replace(/:/g, "");
  const fillId = `balanceFill-${reactId}`;

  const finite = values.filter((v) => Number.isFinite(v));
  if (finite.length < 2) return null;

  const series = downsample(finite);
  const dataMax = Math.max(...series);
  const dataMin = Math.min(...series);
  const rawSpan = dataMax - dataMin;
  const pad = Math.max(rawSpan * 0.12, Math.abs(dataMax) * 0.04, 1);

  const nearZero = dataMin <= Math.max(dataMax * 0.05, 1);
  const yMin = nearZero ? 0 : Math.max(0, dataMin - pad);
  const yMax = Math.max(dataMax + pad, yMin + 1);
  const span = yMax - yMin;

  const w = 560;
  const h = 160;
  const padL = 8;
  const padR = 8;
  const padT = 14;
  const padB = 28;
  const innerW = w - padL - padR;
  const innerH = h - padT - padB;

  const coords = series.map((v, i) => {
    const x = padL + (i / Math.max(series.length - 1, 1)) * innerW;
    const y = padT + (1 - (v - yMin) / span) * innerH;
    return { x, y };
  });

  const linePoints = coords
    .map((c) => `${c.x.toFixed(2)},${c.y.toFixed(2)}`)
    .join(" ");
  const areaPath = [
    `M ${coords[0]!.x.toFixed(2)} ${(padT + innerH).toFixed(2)}`,
    ...coords.map((c) => `L ${c.x.toFixed(2)} ${c.y.toFixed(2)}`),
    `L ${coords[coords.length - 1]!.x.toFixed(2)} ${(padT + innerH).toFixed(2)}`,
    "Z",
  ].join(" ");

  const start = finite[0]!;
  const end = finite[finite.length - 1]!;
  const months = Math.max(0, finite.length - 1);
  const midY = padT + innerH / 2;
  const guides = [0.25, 0.5, 0.75].map((t) => padT + innerH * t);

  return (
    <div
      className={`rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5 ${className}`}
    >
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.14em] text-[var(--accent)] uppercase">
            {label}
          </p>
          <p className="mt-1 text-xs text-[var(--muted)]">
            {months} month{months === 1 ? "" : "s"} ·{" "}
            {formatLoanMoney(start)} → {formatLoanMoney(end)}
          </p>
        </div>
        <div className="text-right text-xs text-[var(--muted)]">
          <p>
            High{" "}
            <span className="font-semibold text-[var(--foreground)]">
              {formatLoanMoney(dataMax)}
            </span>
          </p>
          <p>
            Low{" "}
            <span className="font-semibold text-[var(--foreground)]">
              {formatLoanMoney(dataMin)}
            </span>
          </p>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="mt-3 h-40 w-full text-[var(--muted)]"
        role="img"
        aria-label={`${label}: ${formatLoanMoney(start)} to ${formatLoanMoney(end)} over ${months} months`}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {guides.map((y) => (
          <line
            key={y}
            x1={padL}
            x2={w - padR}
            y1={y}
            y2={y}
            stroke="var(--border)"
            strokeWidth="1"
          />
        ))}

        <path d={areaPath} fill={`url(#${fillId})`} />

        <polyline
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2.75"
          strokeLinejoin="round"
          strokeLinecap="round"
          points={linePoints}
        />

        <circle
          cx={coords[0]!.x}
          cy={coords[0]!.y}
          r="4"
          fill="var(--surface)"
          stroke="var(--accent)"
          strokeWidth="2"
        />
        <circle
          cx={coords[coords.length - 1]!.x}
          cy={coords[coords.length - 1]!.y}
          r="4"
          fill="var(--accent)"
          stroke="var(--accent)"
          strokeWidth="2"
        />

        <text x={padL} y={h - 8} fill="currentColor" fontSize="11">
          Start
        </text>
        <text
          x={w - padR}
          y={h - 8}
          textAnchor="end"
          fill="currentColor"
          fontSize="11"
        >
          Month {months}
        </text>

        <text
          x={padL + 4}
          y={midY - 4}
          fill="currentColor"
          opacity="0.65"
          fontSize="10"
        >
          {formatLoanMoney((yMin + yMax) / 2)}
        </text>
      </svg>
    </div>
  );
}
