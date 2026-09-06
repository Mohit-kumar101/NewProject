"use client";

import { useSyncExternalStore } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ChartPoint } from "@/lib/presentation/buildDeck";
import { allocationPercents } from "@/lib/presentation/insights";

const COLORS = [
  "#00B8D4",
  "#2979FF",
  "#00E5FF",
  "#5C6BC0",
  "#26A69A",
  "#42A5F5",
  "#78909C",
  "#00897B",
];

const tooltipStyle = {
  background: "#ffffff",
  border: "1px solid #d7e0ea",
  borderRadius: 12,
  fontSize: 12,
  color: "#0b1220",
};

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

function ChartSkeleton() {
  return (
    <div className="h-64 animate-pulse rounded-xl border border-[#d7e0ea] bg-[#f7fafc] sm:h-80" />
  );
}

export function PresentationPieChart({ points }: { points: ChartPoint[] }) {
  const ready = useIsClient();
  if (!ready) return <ChartSkeleton />;

  const total = points.reduce((sum, p) => sum + p.value, 0);
  const percents = allocationPercents(points.map((p) => p.value));
  const legend = points.map((p, i) => ({
    ...p,
    color: COLORS[i % COLORS.length],
    percent: percents[i] ?? 0,
  }));
  const currencyPrefix =
    points.find((p) => /\$|£|€|₹/.test(p.display))?.display.match(
      /^[^0-9-]*/
    )?.[0] ?? "$";
  const formattedTotal =
    total > 0
      ? `${currencyPrefix}${Math.round(total).toLocaleString()}`
      : "";

  return (
    <div
      className="grid min-w-0 gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] sm:items-center"
      data-presentation-chart="pie"
    >
      <div className="mx-auto h-52 w-full max-w-[260px] min-w-0 sm:mx-0 sm:h-72 sm:max-w-none">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
            <Pie
              data={points}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius="42%"
              outerRadius="72%"
              paddingAngle={2}
              stroke="#ffffff"
              strokeWidth={2}
              label={false}
              labelLine={false}
              isAnimationActive={false}
            >
              {points.map((_, i) => (
                <Cell
                  key={`${points[i].name}-${i}`}
                  fill={COLORS[i % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(_value, _name, item) => {
                const payload = item?.payload as ChartPoint | undefined;
                const display = payload?.display ?? String(_value);
                const idx = points.findIndex(
                  (p) =>
                    p.name === payload?.name && p.value === payload?.value
                );
                const pct = idx >= 0 ? percents[idx] : null;
                return [
                  pct != null ? `${display} (${pct}%)` : display,
                  "Amount",
                ];
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="min-w-0 space-y-3">
        <ul className="space-y-2.5">
          {legend.map((item, i) => (
            <li
              key={`${item.name}-${i}`}
              className="flex items-start gap-3 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] px-3 py-2.5"
            >
              <span
                className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: item.color }}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold leading-snug break-words-safe text-[#0b1220]">
                  {item.name}
                </p>
                <p className="mt-1 text-sm font-bold tabular-nums break-words-safe text-[#0b1220]">
                  {item.display}
                  <span className="ml-2 text-xs font-semibold text-[#64748b]">
                    {item.percent}%
                  </span>
                </p>
              </div>
            </li>
          ))}
        </ul>
        {formattedTotal ? (
          <p className="border-t border-[#e2e8f0] pt-2 text-xs text-[#64748b]">
            Parts total:{" "}
            <span className="font-semibold text-[#0b1220]">
              {formattedTotal}
            </span>
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function PresentationBarChart({ points }: { points: ChartPoint[] }) {
  const ready = useIsClient();
  if (!ready) return <ChartSkeleton />;

  const labeled = points.map((p) => ({
    ...p,
    shortName:
      p.name.length > 16 ? `${p.name.slice(0, 14)}…` : p.name,
  }));

  return (
    <div className="space-y-3" data-presentation-chart="bars">
      <div className="h-64 w-full sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
        <BarChart
            data={labeled}
            margin={{ top: 12, right: 8, left: 4, bottom: 52 }}
          >
            <CartesianGrid stroke="#d7e0ea" strokeDasharray="3 3" />
            <XAxis
              dataKey="shortName"
              tick={{ fontSize: 10, fill: "#334155" }}
              interval={0}
              angle={-22}
              textAnchor="end"
              height={58}
            />
            <YAxis tick={{ fontSize: 10, fill: "#334155" }} width={56} />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(_value, _name, item) => {
                const display =
                  (item?.payload as ChartPoint | undefined)?.display ??
                  String(_value);
                return [display, "Value"];
              }}
              labelFormatter={(_label, payload) => {
                const row = payload?.[0]?.payload as ChartPoint | undefined;
                return row?.name ?? String(_label);
              }}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} isAnimationActive={false}>
              {labeled.map((_, i) => (
                <Cell
                  key={`${labeled[i].name}-${i}`}
                  fill={COLORS[i % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <ul className="grid gap-2 sm:grid-cols-2">
        {points.map((p, i) => (
          <li
            key={`${p.name}-${i}`}
            className="flex items-center justify-between gap-2 rounded-lg border border-[#e2e8f0] bg-white px-3 py-2 text-xs"
          >
            <span className="min-w-0 truncate font-medium text-[#475569]">
              {p.name}
            </span>
            <span className="shrink-0 font-bold tabular-nums text-[#0b1220]">
              {p.display}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PresentationLineChart({
  points,
  caption,
}: {
  points: ChartPoint[];
  caption?: string;
}) {
  const ready = useIsClient();
  if (!ready) return <ChartSkeleton />;

  return (
    <div className="space-y-2">
      <div
        className="h-64 w-full sm:h-80"
        data-presentation-chart="line"
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={points} margin={{ top: 8, right: 12, left: 8, bottom: 8 }}>
            <defs>
              <linearGradient id="presLineFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00E5FF" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#00E5FF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#d7e0ea" strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#334155" }} />
            <YAxis tick={{ fontSize: 10, fill: "#334155" }} width={56} />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(value, _name, item) => {
                const display =
                  (item?.payload as ChartPoint | undefined)?.display ??
                  String(value);
                return [display, "Level"];
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#00B8D4"
              strokeWidth={3}
              fill="url(#presLineFill)"
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#2979FF"
              strokeWidth={2}
              dot={{ r: 3, fill: "#FF8C42" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {caption ? (
        <p className="text-xs text-[#64748b]">{caption}</p>
      ) : null}
    </div>
  );
}
