"use client";

import { useMemo, useState } from "react";
import {
  PseoCalcShell,
  formatUsd,
} from "@/components/pseo/PseoCalcShell";

const HOURS_PER_YEAR = 2080;

export function MeetingCostCalculator() {
  const [attendees, setAttendees] = useState(6);
  const [loadedSalary, setLoadedSalary] = useState(180000);
  const [hours, setHours] = useState(1);
  const [hoursPerYear, setHoursPerYear] = useState(HOURS_PER_YEAR);

  const result = useMemo(() => {
    const denom = Math.max(1, hoursPerYear);
    const hourly = loadedSalary / denom;
    const meetingCost = attendees * hourly * hours;
    const dailyStandupWeek = attendees * hourly * 5;
    return { hourly, meetingCost, dailyStandupWeek };
  }, [attendees, loadedSalary, hours, hoursPerYear]);

  return (
    <PseoCalcShell
      fields={[
        {
          id: "attendees",
          label: "Engineers in the meeting",
          value: attendees,
          min: 1,
          max: 30,
          step: 1,
          onChange: setAttendees,
        },
        {
          id: "loadedSalary",
          label: "Avg fully loaded annual cost ($)",
          value: loadedSalary,
          min: 40000,
          max: 500000,
          step: 1000,
          onChange: setLoadedSalary,
        },
        {
          id: "hours",
          label: "Meeting length (hours)",
          value: hours,
          min: 0.25,
          max: 8,
          step: 0.25,
          onChange: setHours,
        },
        {
          id: "hoursPerYear",
          label: "Working hours / year",
          value: hoursPerYear,
          min: 1000,
          max: 2500,
          step: 20,
          onChange: setHoursPerYear,
        },
      ]}
      primaryLabel="This meeting costs"
      primaryValue={formatUsd(result.meetingCost)}
      rows={[
        { label: "Loaded hourly rate", value: formatUsd(result.hourly, 2) },
        {
          label: "Daily 1-hour standup / week",
          value: formatUsd(result.dailyStandupWeek),
        },
        {
          label: "Same meeting × 52 weeks",
          value: formatUsd(result.meetingCost * 52),
        },
      ]}
      note="Loaded hourly ≈ annual loaded cost ÷ working hours (default 2,080). Planning estimate—not a payroll system."
    />
  );
}
