"use client";

import { useMemo, useState } from "react";
import {
  PseoCalcShell,
  formatPct,
  formatUsd,
} from "@/components/pseo/PseoCalcShell";

export function EngineerTurnoverCalculator() {
  const [hireCost, setHireCost] = useState(28000);
  const [vacancyMonths, setVacancyMonths] = useState(2);
  const [vacancyImpact, setVacancyImpact] = useState(12000);
  const [rampMonths, setRampMonths] = useState(3);
  const [productivity, setProductivity] = useState(50);
  const [monthlyLoaded, setMonthlyLoaded] = useState(15000);
  const [extras, setExtras] = useState(0);

  const result = useMemo(() => {
    const vacancy = vacancyMonths * vacancyImpact;
    const ramp =
      rampMonths * ((100 - Math.min(100, productivity)) / 100) * monthlyLoaded;
    const total = hireCost + vacancy + ramp + extras;
    return { vacancy, ramp, total };
  }, [
    hireCost,
    vacancyMonths,
    vacancyImpact,
    rampMonths,
    productivity,
    monthlyLoaded,
    extras,
  ]);

  return (
    <PseoCalcShell
      fields={[
        {
          id: "hireCost",
          label: "Cost to hire replacement ($)",
          value: hireCost,
          min: 0,
          max: 150000,
          step: 500,
          onChange: setHireCost,
        },
        {
          id: "vacancyMonths",
          label: "Vacancy months",
          value: vacancyMonths,
          min: 0,
          max: 12,
          step: 0.5,
          onChange: setVacancyMonths,
        },
        {
          id: "vacancyImpact",
          label: "Lost output / vacancy month ($)",
          value: vacancyImpact,
          min: 0,
          max: 80000,
          step: 500,
          onChange: setVacancyImpact,
        },
        {
          id: "rampMonths",
          label: "Ramp months",
          value: rampMonths,
          min: 0,
          max: 12,
          step: 0.5,
          onChange: setRampMonths,
        },
        {
          id: "productivity",
          label: "Ramp productivity (%)",
          value: productivity,
          min: 0,
          max: 100,
          step: 5,
          onChange: setProductivity,
        },
        {
          id: "monthlyLoaded",
          label: "Monthly loaded pay ($)",
          value: monthlyLoaded,
          min: 0,
          max: 40000,
          step: 250,
          onChange: setMonthlyLoaded,
        },
        {
          id: "extras",
          label: "Severance / knowledge extras ($)",
          value: extras,
          min: 0,
          max: 100000,
          step: 500,
          onChange: setExtras,
        },
      ]}
      primaryLabel="True replacement cost"
      primaryValue={formatUsd(result.total)}
      rows={[
        { label: "Vacancy drag", value: formatUsd(result.vacancy) },
        { label: "Ramp under-productivity", value: formatUsd(result.ramp) },
        { label: "Hire + extras", value: formatUsd(hireCost + extras) },
      ]}
      note="Replacement = hire cost + vacancy months × impact + ramp months × (1 − productivity%) × loaded pay + extras."
    />
  );
}

export function ProratedPtoCalculator() {
  const [annualPto, setAnnualPto] = useState(15);
  const [periodsYear, setPeriodsYear] = useState(24);
  const [remaining, setRemaining] = useState(12);

  const result = useMemo(() => {
    const periods = Math.max(1, periodsYear);
    const left = Math.min(periods, Math.max(0, remaining));
    const fraction = left / periods;
    const grantLeft = annualPto * fraction;
    const perPeriod = left > 0 ? grantLeft / left : 0;
    const fullYearPer = annualPto / periods;
    return { fraction, grantLeft, perPeriod, fullYearPer };
  }, [annualPto, periodsYear, remaining]);

  return (
    <PseoCalcShell
      fields={[
        {
          id: "annualPto",
          label: "Annual PTO (days)",
          value: annualPto,
          min: 0,
          max: 40,
          step: 0.5,
          onChange: setAnnualPto,
        },
        {
          id: "periodsYear",
          label: "Pay periods / year",
          value: periodsYear,
          min: 12,
          max: 52,
          step: 1,
          onChange: setPeriodsYear,
        },
        {
          id: "remaining",
          label: "Remaining pay periods this year",
          value: remaining,
          min: 0,
          max: 52,
          step: 1,
          onChange: setRemaining,
        },
      ]}
      primaryLabel="Accrual per remaining paycheck"
      primaryValue={`${result.perPeriod.toFixed(3)} days`}
      rows={[
        { label: "Year fraction remaining", value: formatPct(result.fraction * 100, 1) },
        { label: "PTO left to grant", value: `${result.grantLeft.toFixed(2)} days` },
        {
          label: "If hired Jan 1 (full year)",
          value: `${result.fullYearPer.toFixed(3)} days / period`,
        },
      ]}
      note="Accrual per period = (annual PTO × remaining year fraction) ÷ remaining pay periods. Follow your handbook and local wage rules."
    />
  );
}

export function TimeAndHalfOvertimeCalculator() {
  const [rate, setRate] = useState(32);
  const [hours, setHours] = useState(48);
  const [threshold, setThreshold] = useState(40);

  const result = useMemo(() => {
    const otHours = Math.max(0, hours - threshold);
    const regularHours = Math.min(hours, threshold);
    const regularPay = regularHours * rate;
    const otPay = otHours * rate * 1.5;
    return { otHours, regularHours, regularPay, otPay, total: regularPay + otPay };
  }, [rate, hours, threshold]);

  return (
    <PseoCalcShell
      fields={[
        {
          id: "rate",
          label: "Hourly rate ($)",
          value: rate,
          min: 0,
          max: 120,
          step: 0.25,
          onChange: setRate,
        },
        {
          id: "hours",
          label: "Hours this workweek",
          value: hours,
          min: 0,
          max: 80,
          step: 0.25,
          onChange: setHours,
        },
        {
          id: "threshold",
          label: "OT threshold (hours)",
          value: threshold,
          min: 32,
          max: 48,
          step: 1,
          onChange: setThreshold,
        },
      ]}
      primaryLabel="Total weekly pay"
      primaryValue={formatUsd(result.total, 2)}
      rows={[
        { label: "Regular hours", value: `${result.regularHours}` },
        { label: "Regular pay", value: formatUsd(result.regularPay, 2) },
        { label: "OT hours (1.5×)", value: `${result.otHours}` },
        { label: "OT pay", value: formatUsd(result.otPay, 2) },
      ]}
      note="OT hours = max(0, weekly hours − 40). OT pay = OT hours × rate × 1.5. Weekly FLSA-style rule only—not California daily OT."
    />
  );
}

export function RestaurantLaborCalculator() {
  const [fohShifts, setFohShifts] = useState(40);
  const [fohHours, setFohHours] = useState(6);
  const [fohWage, setFohWage] = useState(18);
  const [bohShifts, setBohShifts] = useState(28);
  const [bohHours, setBohHours] = useState(8);
  const [bohWage, setBohWage] = useState(22);
  const [sales, setSales] = useState(32000);

  const result = useMemo(() => {
    const foh = fohShifts * fohHours * fohWage;
    const boh = bohShifts * bohHours * bohWage;
    const labor = foh + boh;
    const pct = sales > 0 ? (labor / sales) * 100 : 0;
    return { foh, boh, labor, pct };
  }, [fohShifts, fohHours, fohWage, bohShifts, bohHours, bohWage, sales]);

  return (
    <PseoCalcShell
      fields={[
        {
          id: "fohShifts",
          label: "FOH shifts / week",
          value: fohShifts,
          min: 0,
          max: 120,
          step: 1,
          onChange: setFohShifts,
        },
        {
          id: "fohHours",
          label: "FOH hours / shift",
          value: fohHours,
          min: 0,
          max: 12,
          step: 0.5,
          onChange: setFohHours,
        },
        {
          id: "fohWage",
          label: "FOH wage ($/hr)",
          value: fohWage,
          min: 0,
          max: 50,
          step: 0.25,
          onChange: setFohWage,
        },
        {
          id: "bohShifts",
          label: "BOH shifts / week",
          value: bohShifts,
          min: 0,
          max: 120,
          step: 1,
          onChange: setBohShifts,
        },
        {
          id: "bohHours",
          label: "BOH hours / shift",
          value: bohHours,
          min: 0,
          max: 12,
          step: 0.5,
          onChange: setBohHours,
        },
        {
          id: "bohWage",
          label: "BOH wage ($/hr)",
          value: bohWage,
          min: 0,
          max: 50,
          step: 0.25,
          onChange: setBohWage,
        },
        {
          id: "sales",
          label: "Weekly sales ($)",
          value: sales,
          min: 0,
          max: 200000,
          step: 500,
          onChange: setSales,
        },
      ]}
      primaryLabel="Weekly labor cost"
      primaryValue={formatUsd(result.labor)}
      rows={[
        { label: "FOH labor", value: formatUsd(result.foh) },
        { label: "BOH labor", value: formatUsd(result.boh) },
        { label: "Labor % of sales", value: formatPct(result.pct, 1) },
      ]}
      note="Weekly labor = Σ (shifts × hours × wage). Labor % = labor ÷ weekly sales. Add OT separately if anyone exceeds 40 hours."
    />
  );
}

export function SoloDevRateCalculator() {
  const [target, setTarget] = useState(140000);
  const [costs, setCosts] = useState(12000);
  const [weeklyHours, setWeeklyHours] = useState(30);
  const [utilization, setUtilization] = useState(70);
  const [margin, setMargin] = useState(0);

  const result = useMemo(() => {
    const billable = 52 * weeklyHours * (utilization / 100);
    const need = target + costs;
    const floor = billable > 0 ? need / billable : 0;
    const rate = floor * (1 + margin / 100);
    return { billable, floor, rate };
  }, [target, costs, weeklyHours, utilization, margin]);

  return (
    <PseoCalcShell
      fields={[
        {
          id: "target",
          label: "Target take-home equivalent ($/yr)",
          value: target,
          min: 20000,
          max: 400000,
          step: 1000,
          onChange: setTarget,
        },
        {
          id: "costs",
          label: "Annual business costs ($)",
          value: costs,
          min: 0,
          max: 80000,
          step: 500,
          onChange: setCosts,
        },
        {
          id: "weeklyHours",
          label: "Hours available / week",
          value: weeklyHours,
          min: 5,
          max: 60,
          step: 1,
          onChange: setWeeklyHours,
        },
        {
          id: "utilization",
          label: "Billable utilization (%)",
          value: utilization,
          min: 20,
          max: 100,
          step: 1,
          onChange: setUtilization,
        },
        {
          id: "margin",
          label: "Extra profit margin (%)",
          value: margin,
          min: 0,
          max: 50,
          step: 1,
          onChange: setMargin,
        },
      ]}
      primaryLabel="Minimum hourly rate"
      primaryValue={formatUsd(result.rate, 0)}
      rows={[
        { label: "Billable hours / year", value: Math.round(result.billable).toLocaleString() },
        { label: "Floor (no margin)", value: formatUsd(result.floor, 0) },
        { label: "Need to cover", value: formatUsd(target + costs) },
      ]}
      note="Rate = (target + costs) ÷ (52 × weekly hours × utilization%). 100% utilization is a planning error."
    />
  );
}
