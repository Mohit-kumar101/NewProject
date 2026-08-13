"use client";

import { useMemo, useState } from "react";
import {
  PseoCalcShell,
  formatPct,
  formatUsd,
} from "@/components/pseo/PseoCalcShell";

export function Mt4UsdJpyLotCalculator() {
  const [balance, setBalance] = useState(10000);
  const [riskPct, setRiskPct] = useState(0.5);
  const [stopPips, setStopPips] = useState(25);
  const [usdjpy, setUsdjpy] = useState(151.5);

  const result = useMemo(() => {
    const cashRisk = balance * (riskPct / 100);
    const pipValuePerLot = usdjpy > 0 ? (0.01 / usdjpy) * 100_000 : 0;
    const denom = stopPips * pipValuePerLot;
    const lots = denom > 0 ? cashRisk / denom : 0;
    return { cashRisk, pipValuePerLot, lots };
  }, [balance, riskPct, stopPips, usdjpy]);

  return (
    <PseoCalcShell
      fields={[
        {
          id: "balance",
          label: "Account balance (USD)",
          value: balance,
          min: 100,
          max: 500000,
          step: 100,
          onChange: setBalance,
        },
        {
          id: "riskPct",
          label: "Risk per trade (%)",
          value: riskPct,
          min: 0.1,
          max: 5,
          step: 0.1,
          onChange: setRiskPct,
        },
        {
          id: "stopPips",
          label: "Stop loss (pips)",
          value: stopPips,
          min: 1,
          max: 200,
          step: 1,
          onChange: setStopPips,
        },
        {
          id: "usdjpy",
          label: "USD/JPY price",
          value: usdjpy,
          min: 80,
          max: 200,
          step: 0.1,
          onChange: setUsdjpy,
        },
      ]}
      primaryLabel="Position size"
      primaryValue={`${result.lots.toFixed(2)} lots`}
      rows={[
        { label: "Cash at risk", value: formatUsd(result.cashRisk, 2) },
        {
          label: "Pip value / 1.00 lot",
          value: formatUsd(result.pipValuePerLot, 2),
        },
        {
          label: "Risk if stop hits",
          value: formatUsd(result.cashRisk, 2),
        },
      ]}
      note="Lots = (balance × risk%) ÷ (stop pips × pip value). USD/JPY pip value ≈ (0.01 / price) × 100,000 for a standard lot. Education only—not trading advice."
    />
  );
}

export function WarehousePickerCalculator() {
  const [wage, setWage] = useState(24);
  const [lph, setLph] = useState(85);
  const [pickers, setPickers] = useState(4);
  const [hours, setHours] = useState(8);

  const result = useMemo(() => {
    const costPerLine = lph > 0 ? wage / lph : 0;
    const lines = lph * hours * pickers;
    const shiftCost = wage * hours * pickers;
    return { costPerLine, lines, shiftCost };
  }, [wage, lph, pickers, hours]);

  return (
    <PseoCalcShell
      fields={[
        {
          id: "wage",
          label: "Loaded wage ($/hr)",
          value: wage,
          min: 0,
          max: 80,
          step: 0.5,
          onChange: setWage,
        },
        {
          id: "lph",
          label: "Lines per hour (LPH)",
          value: lph,
          min: 1,
          max: 300,
          step: 1,
          onChange: setLph,
        },
        {
          id: "pickers",
          label: "Pickers on the shift",
          value: pickers,
          min: 1,
          max: 80,
          step: 1,
          onChange: setPickers,
        },
        {
          id: "hours",
          label: "Hours / shift",
          value: hours,
          min: 1,
          max: 12,
          step: 0.5,
          onChange: setHours,
        },
      ]}
      primaryLabel="Labor cost per line"
      primaryValue={formatUsd(result.costPerLine, 2)}
      rows={[
        { label: "Lines / shift", value: Math.round(result.lines).toLocaleString() },
        { label: "Shift labor cost", value: formatUsd(result.shiftCost) },
      ]}
      note="Cost per line = loaded hourly wage ÷ LPH. Shift cost = wage × hours × pickers."
    />
  );
}

export function YoutubeRpmCalculator() {
  const [costs, setCosts] = useState(1800);
  const [rpm, setRpm] = useState(8);
  const [views, setViews] = useState(250000);

  const result = useMemo(() => {
    const perView = rpm / 1000;
    const breakEven = perView > 0 ? costs / perView : Infinity;
    const revenue = views * perView;
    const profit = revenue - costs;
    return { breakEven, revenue, profit };
  }, [costs, rpm, views]);

  return (
    <PseoCalcShell
      fields={[
        {
          id: "costs",
          label: "Monthly production + tools ($)",
          value: costs,
          min: 0,
          max: 50000,
          step: 50,
          onChange: setCosts,
        },
        {
          id: "rpm",
          label: "RPM ($ / 1,000 views)",
          value: rpm,
          min: 0.5,
          max: 40,
          step: 0.5,
          onChange: setRpm,
        },
        {
          id: "views",
          label: "Monthly views",
          value: views,
          min: 0,
          max: 5000000,
          step: 5000,
          onChange: setViews,
        },
      ]}
      primaryLabel="Break-even views / month"
      primaryValue={
        Number.isFinite(result.breakEven)
          ? Math.ceil(result.breakEven).toLocaleString()
          : "—"
      }
      rows={[
        { label: "Ad revenue at your views", value: formatUsd(result.revenue) },
        { label: "Profit after costs", value: formatUsd(result.profit) },
      ]}
      note="Break-even views = monthly costs ÷ (RPM / 1000). Use YouTube Studio RPM, not sold CPM."
    />
  );
}

export function DropshippingRoasCalculator() {
  const [price, setPrice] = useState(49);
  const [cogs, setCogs] = useState(14);
  const [ship, setShip] = useState(6);
  const [feePct, setFeePct] = useState(3);
  const [returns, setReturns] = useState(2);

  const result = useMemo(() => {
    const fees = price * (feePct / 100);
    const contribution = price - cogs - ship - fees - returns;
    const beRoas = contribution > 0 ? price / contribution : Infinity;
    const margin = price > 0 ? (contribution / price) * 100 : 0;
    return { fees, contribution, beRoas, margin };
  }, [price, cogs, ship, feePct, returns]);

  return (
    <PseoCalcShell
      fields={[
        {
          id: "price",
          label: "Selling price ($)",
          value: price,
          min: 1,
          max: 500,
          step: 1,
          onChange: setPrice,
        },
        {
          id: "cogs",
          label: "Product COGS ($)",
          value: cogs,
          min: 0,
          max: 400,
          step: 0.5,
          onChange: setCogs,
        },
        {
          id: "ship",
          label: "Shipping / fulfillment ($)",
          value: ship,
          min: 0,
          max: 80,
          step: 0.5,
          onChange: setShip,
        },
        {
          id: "feePct",
          label: "Payment + platform fees (%)",
          value: feePct,
          min: 0,
          max: 15,
          step: 0.1,
          onChange: setFeePct,
        },
        {
          id: "returns",
          label: "Return reserve / order ($)",
          value: returns,
          min: 0,
          max: 40,
          step: 0.25,
          onChange: setReturns,
        },
      ]}
      primaryLabel="Break-even ROAS"
      primaryValue={
        Number.isFinite(result.beRoas) ? result.beRoas.toFixed(2) : "Unprofitable"
      }
      rows={[
        { label: "Fees / order", value: formatUsd(result.fees, 2) },
        { label: "Contribution / order", value: formatUsd(result.contribution, 2) },
        { label: "Contribution margin", value: formatPct(result.margin, 1) },
      ]}
      note="Contribution = price − COGS − ship − fees − return reserve. Break-even ROAS = price ÷ contribution. Ads at 2.0 ROAS only work if this number is below 2.0."
    />
  );
}

export function PmVsDowntimeCalculator() {
  const [pmCost, setPmCost] = useState(2400);
  const [failPct, setFailPct] = useState(15);
  const [downHours, setDownHours] = useState(10);
  const [lossPerHour, setLossPerHour] = useState(1800);
  const [emergency, setEmergency] = useState(4000);

  const result = useMemo(() => {
    const expectedDown =
      (failPct / 100) * (downHours * lossPerHour + emergency);
    const delta = expectedDown - pmCost;
    const winner = delta > 0 ? "PM is cheaper" : "Skipping PM looks cheaper";
    return { expectedDown, delta, winner };
  }, [pmCost, failPct, downHours, lossPerHour, emergency]);

  return (
    <PseoCalcShell
      fields={[
        {
          id: "pmCost",
          label: "Annual PM cost ($)",
          value: pmCost,
          min: 0,
          max: 100000,
          step: 100,
          onChange: setPmCost,
        },
        {
          id: "failPct",
          label: "Annual failure chance without PM (%)",
          value: failPct,
          min: 0,
          max: 100,
          step: 1,
          onChange: setFailPct,
        },
        {
          id: "downHours",
          label: "Hours down if it fails",
          value: downHours,
          min: 0,
          max: 168,
          step: 1,
          onChange: setDownHours,
        },
        {
          id: "lossPerHour",
          label: "Lost margin / hour ($)",
          value: lossPerHour,
          min: 0,
          max: 20000,
          step: 50,
          onChange: setLossPerHour,
        },
        {
          id: "emergency",
          label: "Emergency repair ($)",
          value: emergency,
          min: 0,
          max: 100000,
          step: 100,
          onChange: setEmergency,
        },
      ]}
      primaryLabel="Expected downtime cost"
      primaryValue={formatUsd(result.expectedDown)}
      rows={[
        { label: "Preventative maintenance", value: formatUsd(pmCost) },
        {
          label: "PM savings vs expected failure",
          value: formatUsd(result.delta),
        },
        { label: "Recommendation", value: result.winner },
      ]}
      note="Expected downtime = probability × (hours × lost margin/hour + emergency repair). Compare that expected value to annual PM."
    />
  );
}
