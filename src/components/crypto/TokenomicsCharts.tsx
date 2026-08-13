"use client";

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

const tooltipStyle = {
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: 12,
  fontSize: 12,
};

export function TokenomicsCharts({ series }: { series: TokenomicsPoint[] }) {
  const chartData = series.map((p) => ({
    month: `M${p.month}`,
    circulating: Math.round(p.circulating),
    locked: Math.round(p.locked),
    vested: Math.round(p.vestedUnlocked),
    emissions: Math.round(p.emissions),
  }));

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="h-72 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-3 sm:p-4">
        <p className="mb-2 text-xs font-semibold tracking-wide text-[var(--accent)] uppercase">
          Circulating vs locked
        </p>
        <ResponsiveContainer width="100%" height="90%">
          <AreaChart data={chartData}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} width={56} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend />
            <Area
              type="monotone"
              dataKey="circulating"
              stackId="1"
              stroke="var(--accent)"
              fill="var(--accent)"
              fillOpacity={0.35}
            />
            <Area
              type="monotone"
              dataKey="locked"
              stackId="1"
              stroke="var(--accent-strong)"
              fill="var(--accent-strong)"
              fillOpacity={0.25}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="h-72 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-3 sm:p-4">
        <p className="mb-2 text-xs font-semibold tracking-wide text-[var(--accent)] uppercase">
          Vesting & emissions
        </p>
        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={chartData.filter((_, i) => i % 3 === 0 || i === chartData.length - 1)}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} width={56} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend />
            <Bar dataKey="vested" fill="var(--accent)" radius={[4, 4, 0, 0]} />
            <Bar
              dataKey="emissions"
              fill="var(--accent-strong)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
