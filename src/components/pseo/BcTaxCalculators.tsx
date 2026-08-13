"use client";

import { useMemo, useState } from "react";
import {
  PseoCalcShell,
  formatCad,
  formatPct,
} from "@/components/pseo/PseoCalcShell";

function bcPstRate(taxable: number, isZev: boolean): number {
  if (isZev) return 0;
  if (taxable < 125_000) return 0.12;
  if (taxable < 150_000) return 0.15;
  return 0.2;
}

export function BcUsedCarPstCalculator() {
  const [purchase, setPurchase] = useState(14000);
  const [blackBook, setBlackBook] = useState(18500);
  const [zev, setZev] = useState(0);

  const result = useMemo(() => {
    const isZev = zev >= 0.5;
    const taxable = Math.max(purchase, blackBook);
    const rate = bcPstRate(taxable, isZev);
    const pst = taxable * rate;
    const basis =
      purchase > blackBook
        ? "Purchase price"
        : blackBook > purchase
          ? "Black Book wholesale"
          : "Tied";
    let tier = "Zero-emission — 0%";
    if (!isZev) {
      if (taxable < 125_000) tier = "Under $125,000 — 12%";
      else if (taxable < 150_000) tier = "$125,000–$149,999 — 15%";
      else tier = "$150,000+ — 20%";
    }
    return { taxable, rate, pst, basis, tier, isZev };
  }, [purchase, blackBook, zev]);

  return (
    <PseoCalcShell
      fields={[
        {
          id: "purchase",
          label: "Purchase price ($ CAD)",
          value: purchase,
          min: 0,
          max: 500000,
          step: 100,
          onChange: setPurchase,
        },
        {
          id: "blackBook",
          label: "Black Book wholesale ($ CAD)",
          value: blackBook,
          min: 0,
          max: 500000,
          step: 100,
          onChange: setBlackBook,
        },
        {
          id: "zev",
          label: "Zero-emission vehicle (EV / ZEV)",
          value: zev,
          min: 0,
          max: 1,
          step: 1,
          onChange: setZev,
          inputType: "checkbox",
        },
      ]}
      primaryLabel="PST owed"
      primaryValue={formatCad(result.pst)}
      rows={[
        { label: "Taxable value", value: formatCad(result.taxable) },
        { label: "PST rate", value: formatPct(result.rate * 100) },
        { label: "Tier", value: result.tier },
        { label: "Taxed on", value: result.basis },
      ]}
      note="ICBC generally taxes the greater of purchase price or Canadian Black Book wholesale. ZEV = 0%. Planning estimate—confirm at transfer."
    />
  );
}

/** BC PTT brackets + 2024/26 FTHB planning caps ($835k full / $860k phase-out). */
function bcPttOnValue(fmv: number): number {
  const v = Math.max(0, fmv);
  let tax = Math.min(v, 200_000) * 0.01;
  if (v > 200_000) tax += (Math.min(v, 2_000_000) - 200_000) * 0.02;
  if (v > 2_000_000) tax += (Math.min(v, 3_000_000) - 2_000_000) * 0.03;
  if (v > 3_000_000) tax += (v - 3_000_000) * 0.05;
  return tax;
}

const FTHB_FULL = 835_000;
const FTHB_PARTIAL = 860_000;

export function BcPttFirstTimeBuyerCalculator() {
  const [fmv, setFmv] = useState(500000);
  const [fthb, setFthb] = useState(1);
  const [residential, setResidential] = useState(1);

  const result = useMemo(() => {
    const isFthb = fthb >= 0.5;
    const isRes = residential >= 0.5;
    const base = bcPttOnValue(fmv);
    const additional = isRes && fmv > 3_000_000 ? (fmv - 3_000_000) * 0.02 : 0;
    const fullPtt = base + additional;
    let payable = fullPtt;
    let exemption = "None";
    if (isFthb) {
      if (fmv <= FTHB_FULL) {
        payable = 0;
        exemption = "Full FTHB exemption";
      } else if (fmv < FTHB_PARTIAL) {
        const used = (fmv - FTHB_FULL) / (FTHB_PARTIAL - FTHB_FULL);
        payable = fullPtt * used;
        exemption = "Partial FTHB phase-out";
      } else {
        exemption = "Over FTHB cap — no exemption";
      }
    }
    return { fullPtt, payable, saved: fullPtt - payable, exemption, additional };
  }, [fmv, fthb, residential]);

  return (
    <PseoCalcShell
      fields={[
        {
          id: "fmv",
          label: "Fair market value ($ CAD)",
          value: fmv,
          min: 50000,
          max: 5000000,
          step: 5000,
          onChange: setFmv,
        },
        {
          id: "fthb",
          label: "Qualifying first-time home buyer",
          value: fthb,
          min: 0,
          max: 1,
          step: 1,
          onChange: setFthb,
          inputType: "checkbox",
        },
        {
          id: "residential",
          label: "Residential property (extra 2% over $3M)",
          value: residential,
          min: 0,
          max: 1,
          step: 1,
          onChange: setResidential,
          inputType: "checkbox",
        },
      ]}
      primaryLabel="PTT after exemption"
      primaryValue={formatCad(result.payable)}
      rows={[
        { label: "Full PTT (no exemption)", value: formatCad(result.fullPtt) },
        { label: "Exemption applied", value: result.exemption },
        { label: "Tax saved", value: formatCad(result.saved) },
        {
          label: "Additional 2% over $3M",
          value: formatCad(result.additional),
        },
      ]}
      note="Brackets: 1% to $200k, 2% to $2M, 3% to $3M, 5% above. FTHB planning caps $835k full / $860k phase-out. Confirm current gov.bc.ca tables before closing."
    />
  );
}

export function BcStatHolidayPayCalculator() {
  const [wages, setWages] = useState(2400);
  const [daysWorked, setDaysWorked] = useState(18);
  const [workedStat, setWorkedStat] = useState(0);
  const [statHours, setStatHours] = useState(8);
  const [hourly, setHourly] = useState(22);

  const result = useMemo(() => {
    const days = Math.max(0, daysWorked);
    const avgDay = days > 0 ? wages / days : 0;
    const worked = workedStat >= 0.5;
    const premium = worked ? statHours * hourly * 1.5 : 0;
    const total = avgDay + premium;
    return { avgDay, premium, total, worked };
  }, [wages, daysWorked, workedStat, statHours, hourly]);

  return (
    <PseoCalcShell
      fields={[
        {
          id: "wages",
          label: "Wages in prior 30 days ($ CAD)",
          value: wages,
          min: 0,
          max: 20000,
          step: 25,
          onChange: setWages,
        },
        {
          id: "daysWorked",
          label: "Days worked in those 30 days",
          value: daysWorked,
          min: 0,
          max: 30,
          step: 1,
          onChange: setDaysWorked,
        },
        {
          id: "workedStat",
          label: "Employee works the statutory holiday",
          value: workedStat,
          min: 0,
          max: 1,
          step: 1,
          onChange: setWorkedStat,
          inputType: "checkbox",
        },
        {
          id: "statHours",
          label: "Hours worked on the stat",
          value: statHours,
          min: 0,
          max: 16,
          step: 0.5,
          onChange: setStatHours,
        },
        {
          id: "hourly",
          label: "Regular hourly wage ($)",
          value: hourly,
          min: 0,
          max: 80,
          step: 0.25,
          onChange: setHourly,
        },
      ]}
      primaryLabel="Stat holiday pay"
      primaryValue={formatCad(result.total)}
      rows={[
        { label: "Average day's pay", value: formatCad(result.avgDay) },
        {
          label: "1.5× hours if they work",
          value: result.worked ? formatCad(result.premium) : "Not working",
        },
        {
          label: "If they have the day off",
          value: formatCad(result.avgDay),
        },
      ]}
      note="Average day's pay = wages in the 30 days before the stat ÷ days worked. If they work the day, B.C. ESA typically adds 1.5× for those hours plus an average day's pay. Qualifying tests still apply."
    />
  );
}
