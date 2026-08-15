"use client";

import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TokenomicsPoint } from "@/lib/monetization/tokenomicsSeries";

/** Hex colors — SVG attrs often fail to resolve CSS variables. */
const ACCENT = "#00B8D4";
const ACCENT_STRONG = "#2979FF";
const GRID = "#d7e0ea";

const tooltipStyle = {
  background: "#ffffff",
  border: `1px solid ${GRID}`,
  borderRadius: 12,
  fontSize: 12,
  color: "#0b1220",
};

export function TokenomicsCharts({ series }: { series: TokenomicsPoint[] }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  const chartData = series.map((p) => ({
    month: `M${p.month}`,
    circulating: Math.round(p.circulating),
    locked: Math.round(p.locked),
    vested: Math.round(p.vestedUnlocked),
    emissions: Math.round(p.emissions),
  }));

  if (!ready) {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-72 animate-pulse rounded-2xl border border-[var(--border)] bg-[var(--background)]" />
        <div className="h-72 animate-pulse rounded-2xl border border-[var(--border)] bg-[var(--background)]" />
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="flex h-72 flex-col rounded-2xl border border-[var(--border)] bg-[var(--background)] p-3 sm:p-4">
        <p className="mb-2 shrink-0 text-xs font-semibold tracking-wide text-[var(--accent)] uppercase">
          Circulating vs locked
        </p>
        <div className="min-h-0 flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} width={56} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Area
                type="monotone"
                dataKey="circulating"
                stackId="1"
                stroke={ACCENT}
                fill={ACCENT}
                fillOpacity={0.35}
              />
              <Area
                type="monotone"
                dataKey="locked"
                stackId="1"
                stroke={ACCENT_STRONG}
                fill={ACCENT_STRONG}
                fillOpacity={0.25}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex h-72 flex-col rounded-2xl border border-[var(--border)] bg-[var(--background)] p-3 sm:p-4">
        <p className="mb-2 shrink-0 text-xs font-semibold tracking-wide text-[var(--accent)] uppercase">
          Vesting & emissions
        </p>
        <div className="min-h-0 flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData.filter(
                (_, i) => i % 3 === 0 || i === chartData.length - 1
              )}
            >
              <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} width={56} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Bar dataKey="vested" fill={ACCENT} radius={[4, 4, 0, 0]} />
              <Bar
                dataKey="emissions"
                fill={ACCENT_STRONG}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
