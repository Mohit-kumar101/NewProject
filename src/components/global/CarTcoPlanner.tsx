"use client";

import { useMemo, useState } from "react";
import type { Calculator } from "@/lib/types";
import { Field, Panel, ResultHero, Row } from "@/components/global/ui";
import { calculateCarTco } from "@/lib/globalPlanners/carTco";
import { money } from "@/lib/globalPlanners/money";

export function CarTcoPlanner({
  calculator,
}: {
  calculator: Calculator;
  related: Calculator[];
}) {
  const [years, setYears] = useState(5);
  const [kmPerYear, setKmPerYear] = useState(15000);
  const [fuelPricePerLiter, setFuelPricePerLiter] = useState(1.6);
  const [keepValueNow, setKeepValueNow] = useState(12000);
  const [keepFuelLPer100km, setKeepFuel] = useState(8.5);
  const [keepInsuranceYear, setKeepIns] = useState(1200);
  const [keepRepairYear, setKeepRep] = useState(800);
  const [keepOtherYear, setKeepOther] = useState(200);
  const [leaseDown, setLeaseDown] = useState(2000);
  const [leaseMonthly, setLeaseMonthly] = useState(380);
  const [leaseMonths, setLeaseMonths] = useState(36);
  const [leaseFuelLPer100km, setLeaseFuel] = useState(6.5);
  const [leaseInsuranceYear, setLeaseIns] = useState(1100);
  const [leaseFees, setLeaseFees] = useState(500);
  const [buyPrice, setBuyPrice] = useState(28000);
  const [buyDown, setBuyDown] = useState(5000);
  const [buyLoanRatePct, setBuyRate] = useState(6.5);
  const [buyLoanYears, setBuyYears] = useState(5);
  const [buyFuelLPer100km, setBuyFuel] = useState(7);
  const [buyInsuranceYear, setBuyIns] = useState(1150);
  const [buyRepairYear, setBuyRep] = useState(300);
  const [buyResidualPct, setBuyRes] = useState(40);

  const result = useMemo(
    () =>
      calculateCarTco({
        years,
        kmPerYear,
        fuelPricePerLiter,
        keepValueNow,
        keepFuelLPer100km,
        keepInsuranceYear,
        keepRepairYear,
        keepOtherYear,
        leaseDown,
        leaseMonthly,
        leaseMonths,
        leaseFuelLPer100km,
        leaseInsuranceYear,
        leaseFees,
        buyPrice,
        buyDown,
        buyLoanRatePct,
        buyLoanYears,
        buyFuelLPer100km,
        buyInsuranceYear,
        buyRepairYear,
        buyResidualPct,
      }),
    [
      years,
      kmPerYear,
      fuelPricePerLiter,
      keepValueNow,
      keepFuelLPer100km,
      keepInsuranceYear,
      keepRepairYear,
      keepOtherYear,
      leaseDown,
      leaseMonthly,
      leaseMonths,
      leaseFuelLPer100km,
      leaseInsuranceYear,
      leaseFees,
      buyPrice,
      buyDown,
      buyLoanRatePct,
      buyLoanYears,
      buyFuelLPer100km,
      buyInsuranceYear,
      buyRepairYear,
      buyResidualPct,
    ]
  );

  return (
    <div className="space-y-6">
      <p className="rounded-xl border border-[var(--accent)]/30 bg-[var(--accent)]/5 px-4 py-3 text-sm text-[var(--muted)]">
        <strong className="text-[var(--foreground)]">Three-way fork matrix:</strong>{" "}
        keep vs lease vs buy — cheapest option highlighted each year. Most free
        tools only do lease vs buy.
      </p>
      <div className="grid gap-6 xl:grid-cols-3">
        <Panel title="Shared assumptions">
          <Field label="Horizon (years)" value={years} min={2} max={8} step={1} onChange={setYears} />
          <Field label="Km / year" value={kmPerYear} min={2000} max={60000} step={500} onChange={setKmPerYear} />
          <Field label="Fuel price / liter" value={fuelPricePerLiter} min={0.5} max={4} step={0.05} onChange={setFuelPricePerLiter} />
        </Panel>
        <Panel title="Keep current">
          <Field label="Current car value" value={keepValueNow} min={0} max={80000} step={500} onChange={setKeepValueNow} />
          <Field label="L / 100 km" value={keepFuelLPer100km} min={3} max={20} step={0.1} onChange={setKeepFuel} />
          <Field label="Insurance / yr" value={keepInsuranceYear} min={0} max={5000} step={50} onChange={setKeepIns} />
          <Field label="Repairs / yr" value={keepRepairYear} min={0} max={5000} step={50} onChange={setKeepRep} />
          <Field label="Other / yr" value={keepOtherYear} min={0} max={3000} step={50} onChange={setKeepOther} />
        </Panel>
        <Panel title="Lease new">
          <Field label="Down / drive-off" value={leaseDown} min={0} max={10000} step={100} onChange={setLeaseDown} />
          <Field label="Monthly payment" value={leaseMonthly} min={100} max={1500} step={10} onChange={setLeaseMonthly} />
          <Field label="Lease months" value={leaseMonths} min={12} max={48} step={6} onChange={setLeaseMonths} />
          <Field label="L / 100 km" value={leaseFuelLPer100km} min={3} max={15} step={0.1} onChange={setLeaseFuel} />
          <Field label="Insurance / yr" value={leaseInsuranceYear} min={0} max={5000} step={50} onChange={setLeaseIns} />
          <Field label="Fees" value={leaseFees} min={0} max={3000} step={50} onChange={setLeaseFees} />
        </Panel>
      </div>
      <Panel title="Buy new / used">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Purchase price" value={buyPrice} min={5000} max={120000} step={500} onChange={setBuyPrice} />
          <Field label="Down payment" value={buyDown} min={0} max={50000} step={500} onChange={setBuyDown} />
          <Field label="Loan rate %" value={buyLoanRatePct} min={0} max={15} step={0.25} onChange={setBuyRate} />
          <Field label="Loan years" value={buyLoanYears} min={1} max={7} step={1} onChange={setBuyYears} />
          <Field label="L / 100 km" value={buyFuelLPer100km} min={3} max={15} step={0.1} onChange={setBuyFuel} />
          <Field label="Insurance / yr" value={buyInsuranceYear} min={0} max={5000} step={50} onChange={setBuyIns} />
          <Field label="Repairs / yr" value={buyRepairYear} min={0} max={3000} step={50} onChange={setBuyRep} />
          <Field label="Residual % at end" value={buyResidualPct} min={10} max={70} step={5} onChange={setBuyRes} />
        </div>
      </Panel>
      <ResultHero
        eyebrow="Winner over horizon"
        value={result.winner.toUpperCase()}
        insight={result.insight}
      >
        <dl className="mt-4 grid gap-2 border-t border-[var(--border)] pt-4 sm:grid-cols-3">
          <Row label="Keep total" value={money(result.totals.keep)} />
          <Row label="Lease total" value={money(result.totals.lease)} />
          <Row label="Buy total" value={money(result.totals.buy)} />
        </dl>
      </ResultHero>
      <Panel title="Cheapest fork by year">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[400px] text-sm text-left">
            <thead>
              <tr className="border-b border-[var(--border)] text-[var(--muted)]">
                <th className="py-2">Year</th>
                <th className="py-2">Keep</th>
                <th className="py-2">Lease</th>
                <th className="py-2">Buy</th>
                <th className="py-2">Cheapest</th>
              </tr>
            </thead>
            <tbody>
              {result.byYear.map((r) => (
                <tr key={r.year} className="border-b border-[var(--border)]/50">
                  <td className="py-2">{r.year}</td>
                  <td className={`py-2 ${r.cheapest === "keep" ? "font-bold text-[var(--accent)]" : ""}`}>
                    {money(r.keep)}
                  </td>
                  <td className={`py-2 ${r.cheapest === "lease" ? "font-bold text-[var(--accent)]" : ""}`}>
                    {money(r.lease)}
                  </td>
                  <td className={`py-2 ${r.cheapest === "buy" ? "font-bold text-[var(--accent)]" : ""}`}>
                    {money(r.buy)}
                  </td>
                  <td className="py-2 capitalize font-semibold">{r.cheapest}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-[var(--muted)]">{calculator.seoContent.intro}</p>
      </Panel>
    </div>
  );
}
