"use client";

import { useMemo, useState } from "react";
import {
  PseoCalcShell,
  formatPct,
  formatUsd,
} from "@/components/pseo/PseoCalcShell";

export function HiringCostCalculator() {
  const [ads, setAds] = useState(1200);
  const [salary, setSalary] = useState(160000);
  const [agencyPct, setAgencyPct] = useState(20);
  const [interviewHours, setInterviewHours] = useState(40);
  const [loadedHourly, setLoadedHourly] = useState(90);
  const [tools, setTools] = useState(400);
  const [signing, setSigning] = useState(0);

  const result = useMemo(() => {
    const agency = salary * (Math.max(0, agencyPct) / 100);
    const interview = interviewHours * loadedHourly;
    const total = ads + agency + interview + tools + signing;
    const pctOfSalary = salary > 0 ? (total / salary) * 100 : 0;
    return { agency, interview, total, pctOfSalary };
  }, [ads, salary, agencyPct, interviewHours, loadedHourly, tools, signing]);

  return (
    <PseoCalcShell
      fields={[
        {
          id: "ads",
          label: "Job ads / sourcing ($)",
          value: ads,
          min: 0,
          max: 25000,
          step: 50,
          onChange: setAds,
        },
        {
          id: "salary",
          label: "First-year salary for fee ($)",
          value: salary,
          min: 40000,
          max: 400000,
          step: 1000,
          onChange: setSalary,
        },
        {
          id: "agencyPct",
          label: "Agency / recruiter fee (%)",
          value: agencyPct,
          min: 0,
          max: 35,
          step: 1,
          onChange: setAgencyPct,
        },
        {
          id: "interviewHours",
          label: "Internal interview hours",
          value: interviewHours,
          min: 0,
          max: 200,
          step: 1,
          onChange: setInterviewHours,
        },
        {
          id: "loadedHourly",
          label: "Loaded cost of interviewers ($/hr)",
          value: loadedHourly,
          min: 0,
          max: 400,
          step: 5,
          onChange: setLoadedHourly,
        },
        {
          id: "tools",
          label: "Assessments / tools ($)",
          value: tools,
          min: 0,
          max: 10000,
          step: 50,
          onChange: setTools,
        },
        {
          id: "signing",
          label: "Signing bonus / extras ($)",
          value: signing,
          min: 0,
          max: 80000,
          step: 500,
          onChange: setSigning,
        },
      ]}
      primaryLabel="Cost to hire (before first paycheck)"
      primaryValue={formatUsd(result.total)}
      rows={[
        { label: "Agency / recruiter fee", value: formatUsd(result.agency) },
        { label: "Interview time cost", value: formatUsd(result.interview) },
        { label: "Ads + tools + signing", value: formatUsd(ads + tools + signing) },
        {
          label: "Hire cost as % of salary",
          value: formatPct(result.pctOfSalary, 1),
        },
      ]}
      note="Cost to hire = ads + agency fee + (interview hours × loaded rate) + tools + signing extras. Set agency % to 0 for a fully internal search."
    />
  );
}
