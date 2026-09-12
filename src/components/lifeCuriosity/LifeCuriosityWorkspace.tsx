"use client";

import { useState, type ReactNode } from "react";
import type { Calculator } from "@/lib/types";
import { Chips, Field, Panel, ResultHero, Row } from "@/components/global/ui";
import {
  ageYears,
  clampDate,
  daysBetween,
  futureValue,
  inflate,
  monthsToTarget,
  nestEggForSpend,
  realValue,
  weekendsUntil,
  yearsMoneyLasts,
} from "@/lib/lifeCuriosity/math";
import { HandoffArrivalBanner } from "@/components/shared/HandoffArrivalBanner";
import { HandoffCards } from "@/components/shared/HandoffCards";
import { applyBagToSetters, useApplyScenarioBag } from "@/components/shared/useHandoffHydration";

function money(n: number, digits = 0): string {
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(n);
}

function DateFields({
  label,
  y,
  m,
  d,
  setY,
  setM,
  setD,
}: {
  label: string;
  y: number;
  m: number;
  d: number;
  setY: (n: number) => void;
  setM: (n: number) => void;
  setD: (n: number) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium">{label}</p>
      <div className="grid grid-cols-3 gap-2">
        <Field label="Year" value={y} min={1940} max={2035} step={1} onChange={setY} />
        <Field label="Month" value={m} min={1} max={12} step={1} onChange={setM} />
        <Field label="Day" value={d} min={1} max={31} step={1} onChange={setD} />
      </div>
    </div>
  );
}

export function LifeCuriosityWorkspace({
  calculator,
}: {
  calculator: Calculator;
  related: Calculator[];
}) {
  const kind = calculator.formulaType;

  if (
    kind === "lifeRetireWhen" ||
    kind === "lifeTimeLeftToRetire" ||
    kind === "lifeNestEgg"
  ) {
    return <RetireBlock kind={kind} slug={calculator.slug} />;
  }
  if (kind === "lifeMoneyLasts") return <MoneyLastsBlock slug={calculator.slug} />;
  if (
    kind === "lifeNetWorthAt40" ||
    kind === "lifeNetWorthAt50" ||
    kind === "lifeNetWorthAt60"
  ) {
    const age = kind === "lifeNetWorthAt40" ? 40 : kind === "lifeNetWorthAt50" ? 50 : 60;
    return <NetWorthAgeBlock targetAge={age} />;
  }
  if (kind === "lifeMillionaireWhen") return <MillionaireWhenBlock />;
  if (kind === "lifeSalaryForMillion") return <SalaryMillionBlock />;
  if (
    kind === "lifeThousandAMonth" ||
    kind === "lifeHundredAMonth" ||
    kind === "lifeMoneyInTenYears" ||
    kind === "lifeStopTenADay" ||
    kind === "lifeStartedTenYearsAgo"
  ) {
    return <CompoundBlock kind={kind} slug={calculator.slug} />;
  }
  if (kind === "lifeInflationLoss") return <InflationBlock />;
  if (kind === "lifeLifestyleYear") return <LifestyleBlock />;
  if (kind === "lifeCarReallyCosts") return <CarCostBlock />;
  if (kind === "lifeCoffeeLifetime") return <CoffeeBlock />;
  if (kind === "lifeFirst100k") return <First100kBlock slug={calculator.slug} />;
  if (kind === "lifeDaysAlive") return <DaysAliveBlock />;
  if (kind === "lifeDaysUntilAge") return <DaysUntilAgeBlock />;
  if (kind === "lifeWeekendsLeft") return <WeekendsBlock />;
  if (
    kind === "lifeHoursSleeping" ||
    kind === "lifeSpentWorking" ||
    kind === "lifePhoneTime" ||
    kind === "lifeCommuteDays" ||
    kind === "lifeYearsWorking"
  ) {
    return <TimeUseBlock kind={kind} />;
  }
  if (kind === "lifeYearsLeft" || kind === "lifePercentLived") {
    return <LifeLeftBlock kind={kind} />;
  }
  return <TogetherBlock kind={kind} />;
}

function RetireBlock({
  kind,
  slug,
}: {
  kind: "lifeRetireWhen" | "lifeTimeLeftToRetire" | "lifeNestEgg";
  slug: string;
}) {
  const [age, setAge] = useState(34);
  const [savings, setSavings] = useState(48000);
  const [monthly, setMonthly] = useState(900);
  const [rate, setRate] = useState(7);
  const [spend, setSpend] = useState(42000);
  const [withdraw, setWithdraw] = useState(4);
  const [targetAge, setTargetAge] = useState(62);

  useApplyScenarioBag((bag) =>
    applyBagToSetters(bag, {
      age: setAge,
      savings: setSavings,
      monthly: setMonthly,
      rate: setRate,
      spend: setSpend,
      withdraw: setWithdraw,
    })
  );

  const nest = nestEggForSpend(spend, withdraw);
  const months = monthsToTarget(savings, monthly, rate, nest);
  const yearsTo = months == null ? null : months / 12;
  const retireAge = yearsTo == null ? null : age + yearsTo;
  const yearsLeft = Math.max(0, targetAge - age);
  const atTarget = futureValue(savings, monthly, rate, yearsLeft);
  const gap = nest - atTarget;

  const chrome = (body: ReactNode) => (
    <div className="space-y-6">
      <HandoffArrivalBanner
        onClear={() => {
          setAge(34);
          setSavings(48000);
          setMonthly(900);
          setRate(7);
          setSpend(42000);
          setWithdraw(4);
          setTargetAge(62);
        }}
      />
      {body}
      <HandoffCards
        slug={slug}
        values={{ age, savings, monthly, rate, spend, withdraw }}
        extras={{ nestEgg: nest }}
      />
    </div>
  );

  if (kind === "lifeNestEgg") {
    return chrome(
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="The lifestyle you want later">
          <Field label="Yearly spend in retirement" value={spend} min={12000} max={250000} step={1000} onChange={setSpend} />
          <Field label="Withdrawal rate %" value={withdraw} min={2} max={8} step={0.25} onChange={setWithdraw} />
          <Chips
            value={withdraw}
            onPick={setWithdraw}
            options={[
              { label: "3.5% cautious", value: 3.5 },
              { label: "4% classic", value: 4 },
              { label: "5% looser", value: 5 },
            ]}
          />
        </Panel>
        <ResultHero
          eyebrow="Pile you need on day one"
          value={money(nest)}
          insight={`That is ${withdraw}% of the pile covering ${money(spend)} a year. Markets can be rude in year one; this is a planning mark, not a contract.`}
        />
      </div>
    );
  }

  if (kind === "lifeTimeLeftToRetire") {
    return chrome(
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Your clock and your rate">
          <Field label="Your age" value={age} min={18} max={80} step={1} onChange={setAge} />
          <Field label="Age you want to stop" value={targetAge} min={40} max={85} step={1} onChange={setTargetAge} />
          <Field label="Invested already" value={savings} min={0} max={5000000} step={1000} onChange={setSavings} />
          <Field label="Monthly investing" value={monthly} min={0} max={20000} step={50} onChange={setMonthly} />
          <Field label="Assumed return %" value={rate} min={0} max={12} step={0.25} onChange={setRate} />
          <Field label="Yearly spend later" value={spend} min={12000} max={250000} step={1000} onChange={setSpend} />
        <Field label="Withdrawal %" value={withdraw} min={2} max={8} step={0.25} onChange={setWithdraw} />
        <Chips
          value={withdraw}
          onPick={setWithdraw}
          options={[
            { label: "3.5%", value: 3.5 },
            { label: "4%", value: 4 },
            { label: "5%", value: 5 },
          ]}
        />
      </Panel>
      <ResultHero
        eyebrow="Years on the clock"
          value={`${yearsLeft.toFixed(1)} yr`}
          insight={
            gap <= 0
              ? `At this rate you would have about ${money(atTarget)} by ${targetAge}, which covers the ${money(nest)} target.`
              : `By ${targetAge} this path lands near ${money(atTarget)}. You still need about ${money(Math.max(0, gap))} more in today's target terms.`
          }
        >
          <dl className="mt-4 space-y-2 border-t border-[var(--border)] pt-4">
            <Row label="Target nest egg" value={money(nest)} />
            <Row label="Projected at that age" value={money(atTarget)} />
          </dl>
        </ResultHero>
      </div>
    );
  }

  return chrome(
    <div className="grid gap-6 lg:grid-cols-2">
      <Panel title="What you have and what you want">
        <Field label="Your age" value={age} min={18} max={75} step={1} onChange={setAge} />
        <Field label="Invested already" value={savings} min={0} max={5000000} step={1000} onChange={setSavings} />
        <Field label="Monthly investing" value={monthly} min={0} max={20000} step={50} onChange={setMonthly} />
        <Field label="Assumed return %" value={rate} min={0} max={12} step={0.25} onChange={setRate} />
        <Field label="Yearly spend in retirement" value={spend} min={12000} max={250000} step={1000} onChange={setSpend} />
        <Field label="Withdrawal %" value={withdraw} min={2} max={8} step={0.25} onChange={setWithdraw} />
        <Chips
          value={withdraw}
          onPick={setWithdraw}
          options={[
            { label: "3.5%", value: 3.5 },
            { label: "4%", value: 4 },
            { label: "5%", value: 5 },
          ]}
        />
      </Panel>
      <ResultHero
        eyebrow="Earliest age in this model"
        value={retireAge == null ? "Not on this path" : `${retireAge.toFixed(1)}`}
        insight={
          retireAge == null
            ? "Deposits and return never catch the nest egg. Raise the monthly amount or lower later spending."
            : `About ${yearsTo?.toFixed(1)} years from now if deposits and the ${rate}% return hold. Target pile ${money(nest)}.`
        }
      />
    </div>
  );
}

function MoneyLastsBlock({ slug }: { slug: string }) {
  const [savings, setSavings] = useState(380000);
  const [spend, setSpend] = useState(32000);
  const [rate, setRate] = useState(5);
  const [inflation, setInflation] = useState(2.5);

  useApplyScenarioBag((bag) =>
    applyBagToSetters(bag, {
      savings: setSavings,
      spend: setSpend,
      rate: setRate,
    })
  );

  const years = yearsMoneyLasts(savings, spend, rate, inflation);
  return (
    <div className="space-y-6">
      <HandoffArrivalBanner
        onClear={() => {
          setSavings(380000);
          setSpend(32000);
          setRate(5);
          setInflation(2.5);
        }}
      />
    <div className="grid gap-6 lg:grid-cols-2">
      <Panel title="The pile and the burn">
        <Field label="Invested / cash now" value={savings} min={0} max={8000000} step={5000} onChange={setSavings} />
        <Field label="Yearly spend from it" value={spend} min={1000} max={400000} step={1000} onChange={setSpend} />
        <Field label="Return %" value={rate} min={0} max={12} step={0.25} onChange={setRate} />
        <Field label="Inflation %" value={inflation} min={0} max={10} step={0.25} onChange={setInflation} />
      </Panel>
      <ResultHero
        eyebrow="Years until the account is empty"
        value={years >= 80 ? "80+ years" : `${years.toFixed(1)} yr`}
        insight="Spend rises with inflation each year. A bad first decade would shorten this. A part-time income would lengthen it."
      />
    </div>
      <HandoffCards slug={slug} values={{ savings, spend, rate }} />
    </div>
  );
}

function NetWorthAgeBlock({ targetAge }: { targetAge: number }) {
  const [age, setAge] = useState(Math.min(targetAge - 1, 32));
  const [savings, setSavings] = useState(22000);
  const [monthly, setMonthly] = useState(500);
  const [rate, setRate] = useState(7);
  const years = Math.max(0, targetAge - age);
  const fv = futureValue(savings, monthly, rate, years);
  const putIn = savings + monthly * years * 12;
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Panel title="Path to that birthday">
        <Field label="Your age now" value={age} min={16} max={targetAge} step={1} onChange={setAge} />
        <Field label="Invested already" value={savings} min={0} max={5000000} step={1000} onChange={setSavings} />
        <Field label="Monthly investing" value={monthly} min={0} max={20000} step={25} onChange={setMonthly} />
        <Field label="Assumed return %" value={rate} min={0} max={12} step={0.25} onChange={setRate} />
      </Panel>
      <ResultHero
        eyebrow={`Invested pile at ${targetAge}`}
        value={money(fv)}
        insight={`${years.toFixed(1)} years to go. You would have put in about ${money(putIn)}; the rest is the return you assumed.`}
      />
    </div>
  );
}

function MillionaireWhenBlock() {
  const [savings, setSavings] = useState(40000);
  const [monthly, setMonthly] = useState(1200);
  const [rate, setRate] = useState(7);
  const months = monthsToTarget(savings, monthly, rate, 1_000_000);
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Panel title="Toward $1,000,000">
        <Field label="Invested already" value={savings} min={0} max={999000} step={1000} onChange={setSavings} />
        <Field label="Monthly investing" value={monthly} min={0} max={25000} step={50} onChange={setMonthly} />
        <Field label="Assumed return %" value={rate} min={0} max={12} step={0.25} onChange={setRate} />
      </Panel>
      <ResultHero
        eyebrow="Time to a million in this model"
        value={months == null ? "Never on this path" : `${(months / 12).toFixed(1)} yr`}
        insight={
          months == null
            ? "Without deposits or a return, the pile does not get there."
            : `About ${months} months if you keep sending ${money(monthly)} and the ${rate}% average holds.`
        }
      />
    </div>
  );
}

function SalaryMillionBlock() {
  const [years, setYears] = useState(15);
  const [savings, setSavings] = useState(40000);
  const [rate, setRate] = useState(7);
  const [savePct, setSavePct] = useState(20);
  const r = rate / 100 / 12;
  const n = years * 12;
  const target = 1_000_000;
  let pmt = 0;
  if (n > 0) {
    if (Math.abs(r) < 1e-12) pmt = Math.max(0, (target - savings) / n);
    else {
      const grown = savings * Math.pow(1 + r, n);
      pmt = Math.max(0, ((target - grown) * r) / (Math.pow(1 + r, n) - 1));
    }
  }
  const salary = savePct > 0 ? (pmt * 12) / (savePct / 100) : 0;
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Panel title="Years, savings rate, what you have">
        <Field label="Years you will keep this up" value={years} min={3} max={45} step={1} onChange={setYears} />
        <Field label="Invested already" value={savings} min={0} max={900000} step={1000} onChange={setSavings} />
        <Field label="Assumed return %" value={rate} min={0} max={12} step={0.25} onChange={setRate} />
        <Field label="Share of salary you can invest %" value={savePct} min={5} max={60} step={1} onChange={setSavePct} />
      </Panel>
      <ResultHero
        eyebrow="Gross salary this path wants"
        value={money(salary)}
        insight={`That is ${money(pmt)}/mo at a ${savePct}% savings rate. A match or a cheaper life lowers the salary.`}
      />
    </div>
  );
}

function CompoundBlock({
  kind,
  slug,
}: {
  kind:
    | "lifeThousandAMonth"
    | "lifeHundredAMonth"
    | "lifeMoneyInTenYears"
    | "lifeStopTenADay"
    | "lifeStartedTenYearsAgo";
  slug: string;
}) {
  const defaults = {
    lifeThousandAMonth: { monthly: 1000, years: 20, savings: 0 },
    lifeHundredAMonth: { monthly: 100, years: 30, savings: 0 },
    lifeMoneyInTenYears: { monthly: 200, years: 10, savings: 15000 },
    lifeStopTenADay: { monthly: 304, years: 20, savings: 0 },
    lifeStartedTenYearsAgo: { monthly: 250, years: 10, savings: 0 },
  }[kind];
  const [monthly, setMonthly] = useState(defaults.monthly);
  const [years, setYears] = useState(defaults.years);
  const [savings, setSavings] = useState(defaults.savings);
  const [rate, setRate] = useState(kind === "lifeStartedTenYearsAgo" ? 8 : 7);

  useApplyScenarioBag((bag) =>
    applyBagToSetters(bag, {
      monthly: setMonthly,
      savings: setSavings,
      rate: setRate,
    })
  );

  const fv = futureValue(savings, monthly, rate, years);
  const putIn = savings + monthly * years * 12;
  return (
    <div className="space-y-6">
      <HandoffArrivalBanner
        onClear={() => {
          setMonthly(defaults.monthly);
          setYears(defaults.years);
          setSavings(defaults.savings);
          setRate(kind === "lifeStartedTenYearsAgo" ? 8 : 7);
        }}
      />
    <div className="grid gap-6 lg:grid-cols-2">
      <Panel title="Deposits and time">
        {kind === "lifeStopTenADay" ? (
          <Field
            label="Daily amount you stop spending"
            value={Math.round(monthly / 30.4)}
            min={1}
            max={80}
            step={1}
            onChange={(n) => setMonthly(Math.round(n * 30.4))}
          />
        ) : (
          <Field label="Monthly investing" value={monthly} min={0} max={20000} step={25} onChange={setMonthly} />
        )}
        <Field label="Years" value={years} min={1} max={50} step={1} onChange={setYears} />
        <Field label="Starting amount" value={savings} min={0} max={2000000} step={500} onChange={setSavings} />
        <Field label="Assumed return %" value={rate} min={0} max={12} step={0.25} onChange={setRate} />
        <Chips
          value={rate}
          onPick={setRate}
          options={[
            { label: "5% mixed", value: 5 },
            { label: "7% stocks-heavy", value: 7 },
            { label: "0% cash", value: 0 },
          ]}
        />
      </Panel>
      <ResultHero
        eyebrow={kind === "lifeStartedTenYearsAgo" ? "If that decade had happened" : "What the path adds up to"}
        value={money(fv)}
        insight={`You would have put in ${money(putIn)}. Growth in this model is ${money(fv - putIn)}.`}
      />
    </div>
      <HandoffCards slug={slug} values={{ monthly, savings, rate }} />
    </div>
  );
}

function InflationBlock() {
  const [amount, setAmount] = useState(20000);
  const [inflation, setInflation] = useState(3);
  const [years, setYears] = useState(10);
  const real = realValue(amount, inflation, years);
  const future = inflate(amount, inflation, years);
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Panel title="Cash that just sits">
        <Field label="Amount" value={amount} min={100} max={5000000} step={500} onChange={setAmount} />
        <Field label="Inflation %" value={inflation} min={0} max={15} step={0.25} onChange={setInflation} />
        <Chips
          value={inflation}
          onPick={setInflation}
          options={[
            { label: "2% quiet", value: 2 },
            { label: "3% recent", value: 3 },
            { label: "6% hot", value: 6 },
          ]}
        />
        <Field label="Years" value={years} min={1} max={50} step={1} onChange={setYears} />
      </Panel>
      <ResultHero
        eyebrow="What it buys in today’s goods"
        value={money(real)}
        insight={`The bank still shows ${money(amount)}. To buy the same basket later you would need about ${money(future)}.`}
      />
    </div>
  );
}

function LifestyleBlock() {
  const [monthly, setMonthly] = useState(1100);
  const [annual, setAnnual] = useState(4800);
  const year = monthly * 12 + annual;
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Panel title="The extras">
        <Field label="Monthly discretionary" value={monthly} min={0} max={20000} step={50} onChange={setMonthly} />
        <Field label="Yearly extras (trips, gifts, insurance add-ons)" value={annual} min={0} max={80000} step={100} onChange={setAnnual} />
      </Panel>
      <ResultHero
        eyebrow="Lifestyle bill per year"
        value={money(year)}
        insight={`Ten years of this habit, with no inflation, is ${money(year * 10)}. Rent is not in this total unless you stuffed it into the extras.`}
      />
    </div>
  );
}

function CarCostBlock() {
  const [payment, setPayment] = useState(420);
  const [ins, setIns] = useState(1800);
  const [fuel, setFuel] = useState(160);
  const [maint, setMaint] = useState(900);
  const [parking, setParking] = useState(80);
  const [dep, setDep] = useState(2400);
  const monthly = payment + ins / 12 + fuel + maint / 12 + parking + dep / 12;
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Panel title="The quiet line items">
        <Field label="Loan / lease payment" value={payment} min={0} max={2500} step={10} onChange={setPayment} />
        <Field label="Insurance / year" value={ins} min={0} max={8000} step={50} onChange={setIns} />
        <Field label="Fuel / month" value={fuel} min={0} max={800} step={10} onChange={setFuel} />
        <Field label="Maintenance / year" value={maint} min={0} max={6000} step={50} onChange={setMaint} />
        <Field label="Parking / month" value={parking} min={0} max={600} step={5} onChange={setParking} />
        <Field label="Value drop / year" value={dep} min={0} max={15000} step={100} onChange={setDep} />
      </Panel>
      <ResultHero
        eyebrow="All-in monthly"
        value={money(monthly)}
        insight={`${money(monthly * 12)} a year. Compare that to a transit pass or a cheaper used car before you renew the lease.`}
      />
    </div>
  );
}

function CoffeeBlock() {
  const [drinks, setDrinks] = useState(5);
  const [price, setPrice] = useState(5.5);
  const [years, setYears] = useState(40);
  const life = drinks * price * 52 * years;
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Panel title="The habit">
        <Field label="Drinks per week" value={drinks} min={0} max={21} step={1} onChange={setDrinks} />
        <Field label="Price each" value={price} min={0.25} max={15} step={0.25} onChange={setPrice} />
        <Chips
          value={price}
          onPick={setPrice}
          options={[
            { label: "$2 home", value: 2 },
            { label: "$5.50 shop", value: 5.5 },
            { label: "$7 cafe", value: 7 },
          ]}
        />
        <Field label="Years you keep it" value={years} min={1} max={70} step={1} onChange={setYears} />
      </Panel>
      <ResultHero
        eyebrow="Lifetime coffee tab"
        value={money(life)}
        insight={`${money(drinks * price * 52)} a year. Homebrew changes the price field more than the drink count.`}
      />
    </div>
  );
}

function First100kBlock({ slug }: { slug: string }) {
  const [savings, setSavings] = useState(8000);
  const [monthly, setMonthly] = useState(600);
  const [rate, setRate] = useState(5);

  useApplyScenarioBag((bag) =>
    applyBagToSetters(bag, {
      savings: setSavings,
      monthly: setMonthly,
      rate: setRate,
    })
  );

  const months = monthsToTarget(savings, monthly, rate, 100_000);
  return (
    <div className="space-y-6">
      <HandoffArrivalBanner
        onClear={() => {
          setSavings(8000);
          setMonthly(600);
          setRate(5);
        }}
      />
      <div className="grid gap-6 lg:grid-cols-2">
      <Panel title="Toward the first $100k">
        <Field label="Invested already" value={savings} min={0} max={99000} step={500} onChange={setSavings} />
        <Field label="Monthly investing" value={monthly} min={0} max={15000} step={25} onChange={setMonthly} />
        <Field label="Assumed return %" value={rate} min={0} max={12} step={0.25} onChange={setRate} />
      </Panel>
      <ResultHero
        eyebrow="Time to $100,000"
        value={months == null ? "Not on this path" : `${(months / 12).toFixed(1)} yr`}
        insight={months == null ? "Add a monthly amount." : `About ${months} months if the ${rate}% average holds.`}
      />
    </div>
      <HandoffCards slug={slug} values={{ savings, monthly, rate }} />
    </div>
  );
}

function DaysAliveBlock() {
  const [y, setY] = useState(1993);
  const [m, setM] = useState(3);
  const [d, setD] = useState(12);
  const birth = clampDate(y, m, d);
  const days = Math.max(0, daysBetween(birth, new Date()));
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Panel title="Birthday">
        <DateFields label="Born" y={y} m={m} d={d} setY={setY} setM={setM} setD={setD} />
      </Panel>
      <ResultHero
        eyebrow="Days so far"
        value={days.toLocaleString()}
        insight={`${(days / 365.25).toFixed(1)} years on the calendar. Today is not counted as a finished day.`}
      />
    </div>
  );
}

function DaysUntilAgeBlock() {
  const [y, setY] = useState(1996);
  const [m, setM] = useState(6);
  const [d, setD] = useState(4);
  const [target, setTarget] = useState(40);
  const birth = clampDate(y, m, d);
  const when = new Date(birth.getFullYear() + target, birth.getMonth(), birth.getDate());
  const days = daysBetween(new Date(), when);
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Panel title="The birthday you mean">
        <DateFields label="Born" y={y} m={m} d={d} setY={setY} setM={setM} setD={setD} />
        <Field label="Turning age" value={target} min={18} max={100} step={1} onChange={setTarget} />
      </Panel>
      <ResultHero
        eyebrow={days >= 0 ? "Days until that birthday" : "Days since that birthday"}
        value={Math.abs(days).toLocaleString()}
        insight={days >= 0 ? when.toLocaleDateString() : "That age already happened. Pick a later one if you want a countdown."}
      />
    </div>
  );
}

function WeekendsBlock() {
  const [y, setY] = useState(1990);
  const [m, setM] = useState(1);
  const [d, setD] = useState(15);
  const birth = clampDate(y, m, d);
  const eighty = new Date(birth.getFullYear() + 80, birth.getMonth(), birth.getDate());
  const weekends = weekendsUntil(eighty);
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Panel title="Birthday">
        <DateFields label="Born" y={y} m={m} d={d} setY={setY} setM={setM} setD={setD} />
      </Panel>
      <ResultHero
        eyebrow="Weekends before 80"
        value={weekends.toLocaleString()}
        insight="A weekend here is one Saturday–Sunday pair. Health is not in the model. Spend a few of these on purpose."
      />
    </div>
  );
}

function TimeUseBlock({
  kind,
}: {
  kind:
    | "lifeHoursSleeping"
    | "lifeSpentWorking"
    | "lifePhoneTime"
    | "lifeCommuteDays"
    | "lifeYearsWorking";
}) {
  const [y, setY] = useState(1991);
  const [m, setM] = useState(8);
  const [d, setD] = useState(3);
  const [sleep, setSleep] = useState(7);
  const [workYears, setWorkYears] = useState(12);
  const [weeks, setWeeks] = useState(48);
  const [hours, setHours] = useState(42);
  const [phone, setPhone] = useState(3);
  const [expect, setExpect] = useState(82);
  const [commuteYears, setCommuteYears] = useState(8);
  const [workdays, setWorkdays] = useState(5);
  const [minutes, setMinutes] = useState(35);
  const [startAge, setStartAge] = useState(22);
  const [endAge, setEndAge] = useState(64);

  const birth = clampDate(y, m, d);
  const days = Math.max(0, daysBetween(birth, new Date()));
  const age = ageYears(birth);
  const sleepH = days * sleep;
  const workH = workYears * weeks * hours;
  const workShare = days > 0 ? (workH / (days * 24)) * 100 : 0;
  const daysLeft = Math.max(0, (expect - age) * 365.25);
  const phonePast = days * phone;
  const phoneFuture = daysLeft * phone;
  const cDays = commuteYears * workdays * weeks;
  const cHours = (cDays * minutes * 2) / 60;
  const career = Math.max(0, endAge - startAge);

  if (kind === "lifeHoursSleeping") {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Sleep, honestly">
          <DateFields label="Born" y={y} m={m} d={d} setY={setY} setM={setM} setD={setD} />
          <Field label="Hours asleep per night" value={sleep} min={3} max={12} step={0.25} onChange={setSleep} />
        </Panel>
        <ResultHero
          eyebrow="Hours already spent asleep"
          value={Math.round(sleepH).toLocaleString()}
          insight={`About ${(sleepH / 24 / 365.25).toFixed(1)} years in bed at this average.`}
        />
      </div>
    );
  }
  if (kind === "lifeSpentWorking") {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Paid hours">
          <DateFields label="Born" y={y} m={m} d={d} setY={setY} setM={setM} setD={setD} />
          <Field label="Years you have been working" value={workYears} min={0} max={60} step={1} onChange={setWorkYears} />
          <Field label="Weeks per year" value={weeks} min={20} max={52} step={1} onChange={setWeeks} />
          <Field label="Hours per week" value={hours} min={5} max={80} step={1} onChange={setHours} />
        </Panel>
        <ResultHero
          eyebrow="Share of your life so far"
          value={`${workShare.toFixed(1)}%`}
          insight={`${Math.round(workH).toLocaleString()} paid hours. Care work is not in this unless you added those hours.`}
        />
      </div>
    );
  }
  if (kind === "lifePhoneTime") {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="The daily habit">
          <DateFields label="Born" y={y} m={m} d={d} setY={setY} setM={setM} setD={setD} />
          <Field label="Hours on a phone per day" value={phone} min={0} max={12} step={0.25} onChange={setPhone} />
          <Chips
            value={phone}
            onPick={setPhone}
            options={[
              { label: "1h light", value: 1 },
              { label: "3h typical", value: 3 },
              { label: "5h heavy", value: 5 },
            ]}
          />
          <Field label="Life expectancy you want to use" value={expect} min={50} max={110} step={1} onChange={setExpect} />
        </Panel>
        <ResultHero
          eyebrow="Lifetime hours if the habit holds"
          value={Math.round(phonePast + phoneFuture).toLocaleString()}
          insight={`${Math.round(phonePast).toLocaleString()} hours already. About ${(phonePast / 24 / 365.25).toFixed(1)} years so far.`}
        />
      </div>
    );
  }
  if (kind === "lifeCommuteDays") {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="The trip">
          <Field label="Years on this commute" value={commuteYears} min={0} max={50} step={1} onChange={setCommuteYears} />
          <Field label="Workdays per week" value={workdays} min={0} max={7} step={1} onChange={setWorkdays} />
          <Field label="Weeks per year" value={weeks} min={20} max={52} step={1} onChange={setWeeks} />
          <Field label="Minutes one way" value={minutes} min={0} max={180} step={5} onChange={setMinutes} />
        </Panel>
        <ResultHero
          eyebrow="Commute days"
          value={Math.round(cDays).toLocaleString()}
          insight={`${Math.round(cHours).toLocaleString()} hours in transit. Remote days belong in a lower workday count.`}
        />
      </div>
    );
  }
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Panel title="Career bookends">
        <Field label="Age you started getting paid" value={startAge} min={14} max={50} step={1} onChange={setStartAge} />
        <Field label="Age you plan to stop" value={endAge} min={30} max={85} step={1} onChange={setEndAge} />
      </Panel>
      <ResultHero
        eyebrow="Years on a badge"
        value={`${career}`}
        insight="Elapsed years, not promotions. Gaps come out if you raise the start age."
      />
    </div>
  );
}

function LifeLeftBlock({ kind }: { kind: "lifeYearsLeft" | "lifePercentLived" }) {
  const [age, setAge] = useState(39);
  const [expect, setExpect] = useState(82);
  const left = Math.max(0, expect - age);
  const pct = expect > 0 ? Math.min(100, (age / expect) * 100) : 0;
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Panel title="Age and the average you are using">
        <Field label="Your age" value={age} min={1} max={120} step={1} onChange={setAge} />
        <Field label="Life expectancy" value={expect} min={40} max={120} step={1} onChange={setExpect} />
      </Panel>
      <ResultHero
        eyebrow={kind === "lifeYearsLeft" ? "Years left in this sketch" : "Share already lived"}
        value={kind === "lifeYearsLeft" ? `${left.toFixed(0)} yr` : `${pct.toFixed(1)}%`}
        insight={
          kind === "lifeYearsLeft"
            ? `About ${Math.round(left * 365.25).toLocaleString()} days if that expectancy holds. It is a table average, not a booking.`
            : `${left.toFixed(0)} years would remain if ${expect} is the right denominator.`
        }
      />
    </div>
  );
}

function TogetherBlock({ kind }: { kind: string }) {
  const [by, setBy] = useState(1994);
  const [bm, setBm] = useState(5);
  const [bd, setBd] = useState(9);
  const [sy, setSy] = useState(2019);
  const [sm, setSm] = useState(10);
  const [sd, setSd] = useState(18);
  const [events, setEvents] = useState(4);
  const birth = clampDate(by, bm, bd);
  const start = clampDate(sy, sm, sd);
  const today = new Date();
  const alive = Math.max(1, daysBetween(birth, today));
  const together = daysBetween(start, today);
  const pct = together > 0 ? (together / alive) * 100 : 0;
  const until1000 = 1000 - together;
  const memories = Math.max(0, together) * (events / 7);

  const known = kind === "lifeKnownPartner";
  const title = known ? "Day you met" : "Day it became a relationship";
  const days = together;

  let eyebrow = "Days";
  let value = Math.max(0, days).toLocaleString();
  let insight = `${(Math.max(0, days) / 365.25).toFixed(1)} years and ${Math.max(0, days) % 365} leftover days, give or take a leap.`;

  if (kind === "lifePercentTogether") {
    eyebrow = "Share of your life";
    value = `${Math.max(0, pct).toFixed(1)}%`;
    insight = `${Math.max(0, together).toLocaleString()} days together out of ${alive.toLocaleString()} days you have been alive.`;
  } else if (kind === "lifeThousandthDay") {
    eyebrow = until1000 >= 0 ? "Days until day 1,000" : "Days past day 1,000";
    value = Math.abs(until1000).toLocaleString();
    insight =
      until1000 >= 0
        ? "About 2 years 9 months from the start date."
        : "You already passed it. Pick a dinner anyway.";
  } else if (kind === "lifeMemoriesGuess") {
    eyebrow = "A guessed pile of shared moments";
    value = Math.round(memories).toLocaleString();
    insight = "Not photos. Just weekly “we would still mention this” events times time together.";
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Panel title="Dates">
        {kind === "lifePercentTogether" ? (
          <DateFields label="Your birthday" y={by} m={bm} d={bd} setY={setBy} setM={setBm} setD={setBd} />
        ) : null}
        <DateFields label={title} y={sy} m={sm} d={sd} setY={setSy} setM={setSm} setD={setSd} />
        {kind === "lifeMemoriesGuess" ? (
          <Field
            label="Shared events you would still mention, per week"
            value={events}
            min={0}
            max={20}
            step={1}
            onChange={setEvents}
          />
        ) : null}
      </Panel>
      <ResultHero eyebrow={eyebrow} value={value} insight={insight} />
    </div>
  );
}
