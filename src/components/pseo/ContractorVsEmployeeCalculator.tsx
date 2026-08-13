"use client";

import { useMemo, useState } from "react";
import {
  PseoCalcShell,
  formatPct,
  formatUsd,
} from "@/components/pseo/PseoCalcShell";

export function ContractorVsEmployeeCalculator() {
  const [salary, setSalary] = useState(140000);
  const [loadPct, setLoadPct] = useState(30);
  const [fixed, setFixed] = useState(3000);
  const [rate, setRate] = useState(95);
  const [hours, setHours] = useState(1880);

  const result = useMemo(() => {
    const w2Loaded = salary * (1 + Math.max(0, loadPct) / 100) + Math.max(0, fixed);
    const contractor = Math.max(0, rate) * Math.max(0, hours);
    const delta = w2Loaded - contractor;
    const cheaper =
      Math.abs(delta) < 1
        ? "Roughly even"
        : delta > 0
          ? "1099 is cheaper"
          : "W2 is cheaper";
    const w2Hourly = hours > 0 ? w2Loaded / hours : 0;
    return { w2Loaded, contractor, delta, cheaper, w2Hourly };
  }, [salary, loadPct, fixed, rate, hours]);

  return (
    <PseoCalcShell
      fields={[
        {
          id: "salary",
          label: "W2 base salary ($)",
          value: salary,
          min: 30000,
          max: 400000,
          step: 1000,
          onChange: setSalary,
        },
        {
          id: "loadPct",
          label: "W2 load (tax + benefits + overhead %)",
          value: loadPct,
          min: 0,
          max: 80,
          step: 1,
          onChange: setLoadPct,
        },
        {
          id: "fixed",
          label: "W2 fixed costs / year ($)",
          value: fixed,
          min: 0,
          max: 25000,
          step: 100,
          onChange: setFixed,
        },
        {
          id: "rate",
          label: "1099 bill rate ($/hour)",
          value: rate,
          min: 20,
          max: 400,
          step: 1,
          onChange: setRate,
        },
        {
          id: "hours",
          label: "Comparable hours / year",
          value: hours,
          min: 200,
          max: 2500,
          step: 20,
          onChange: setHours,
        },
      ]}
      primaryLabel="True cost difference (W2 − 1099)"
      primaryValue={formatUsd(result.delta)}
      rows={[
        { label: "W2 fully loaded / year", value: formatUsd(result.w2Loaded) },
        { label: "1099 cost / year", value: formatUsd(result.contractor) },
        { label: "W2 effective hourly", value: formatUsd(result.w2Hourly, 2) },
        { label: "Cheaper option", value: result.cheaper },
        {
          label: "W2 load as % of salary",
          value: formatPct(loadPct),
        },
      ]}
      note="W2 loaded = salary × (1 + load%) + fixed costs. Contractor = rate × hours. Compare equal productive hours. Not tax, legal, or classification advice."
    />
  );
}
