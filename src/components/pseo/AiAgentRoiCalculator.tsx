"use client";

import { useMemo, useState } from "react";
import {
  PseoCalcShell,
  formatPct,
  formatUsd,
} from "@/components/pseo/PseoCalcShell";

export function AiAgentRoiCalculator() {
  const [tickets, setTickets] = useState(4000);
  const [deflection, setDeflection] = useState(35);
  const [humanCost, setHumanCost] = useState(4.5);
  const [aiCost, setAiCost] = useState(1200);

  const result = useMemo(() => {
    const rate = Math.min(100, Math.max(0, deflection)) / 100;
    const deflected = tickets * rate;
    const humanAvoided = deflected * humanCost;
    const savings = humanAvoided - aiCost;
    const roi = aiCost > 0 ? (savings / aiCost) * 100 : Infinity;
    return { deflected, humanAvoided, savings, roi };
  }, [tickets, deflection, humanCost, aiCost]);

  return (
    <PseoCalcShell
      fields={[
        {
          id: "tickets",
          label: "Tickets / month",
          value: tickets,
          min: 0,
          max: 50000,
          step: 50,
          onChange: setTickets,
        },
        {
          id: "deflection",
          label: "AI deflection rate (%)",
          value: deflection,
          min: 0,
          max: 100,
          step: 1,
          onChange: setDeflection,
        },
        {
          id: "humanCost",
          label: "Human cost / ticket ($)",
          value: humanCost,
          min: 0,
          max: 80,
          step: 0.25,
          onChange: setHumanCost,
        },
        {
          id: "aiCost",
          label: "AI stack + review cost / month ($)",
          value: aiCost,
          min: 0,
          max: 50000,
          step: 50,
          onChange: setAiCost,
        },
      ]}
      primaryLabel="Monthly savings"
      primaryValue={formatUsd(result.savings)}
      rows={[
        {
          label: "Tickets deflected",
          value: Math.round(result.deflected).toLocaleString(),
        },
        {
          label: "Human cost avoided",
          value: formatUsd(result.humanAvoided),
        },
        {
          label: "ROI on AI spend",
          value: Number.isFinite(result.roi) ? formatPct(result.roi, 0) : "—",
        },
        {
          label: "Payback",
          value:
            result.savings > 0
              ? "Under 1 month"
              : "Not yet saving vs AI cost",
        },
      ]}
      note="Savings = deflected tickets × human cost/ticket − AI stack cost. ROI = savings ÷ AI cost. Count only fully resolved tickets for a conservative figure."
    />
  );
}
