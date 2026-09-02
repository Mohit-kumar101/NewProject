/**
 * Skilled-trades calculators — HVAC, plumbing, electrical, roofing, construction,
 * landscaping, masonry. Planning estimates only — verify codes on site.
 */

import type { CalcResult } from "./types";

type Inputs = Record<string, number>;

const number = (n: number, digits = 1): string => {
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: digits,
    minimumFractionDigits: Math.min(digits, 2),
  }).format(n);
};

const currency = (n: number, digits = 2): string => {
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(n);
};

function result(
  primaryLabel: string,
  primaryValue: string,
  secondary: { label: string; value: string }[],
  insight?: string
): CalcResult {
  return {
    primary: { label: primaryLabel, value: primaryValue, highlight: true },
    secondary,
    insight,
  };
}

function clamp(n: number, min: number, max: number): number {
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, n));
}

function marginPrice(cost: number, marginPct: number): number {
  const m = clamp(marginPct, 0, 99);
  return cost / (1 - m / 100);
}

function suggestWireGauge(amps: number): string {
  const table: [number, string][] = [
    [15, "14 AWG"],
    [20, "12 AWG"],
    [30, "10 AWG"],
    [40, "8 AWG"],
    [55, "6 AWG"],
    [70, "4 AWG"],
    [85, "3 AWG"],
    [100, "2 AWG"],
  ];
  for (const [limit, gauge] of table) {
    if (amps <= limit) return gauge;
  }
  return "1 AWG or larger";
}

function awgResistance(awg: number): number {
  const map: Record<number, number> = {
    14: 2.525,
    12: 1.588,
    10: 0.999,
    8: 0.628,
    6: 0.395,
    4: 0.249,
    2: 0.156,
  };
  return map[awg] ?? 1;
}

export const TRADES_FORMULA_TYPES = [
  "tradeHvacSeerSavings",
  "tradeHvacBtuTonnage",
  "tradeDuctworkCfm",
  "tradeHeatPumpCopSavings",
  "tradeHvacServiceCallPrice",
  "tradeMiniSplitHeadCount",
  "tradeFurnaceAfueSavings",
  "tradeRefrigerantCharge",
  "tradeHvacInstallQuote",
  "tradeWaterHeaterSizing",
  "tradePipeLengthFittings",
  "tradeDrainSlope",
  "tradeFixtureUnitLoad",
  "tradePlumbingJobBid",
  "tradeTanklessWaterHeaterGpm",
  "tradeSumpPumpSizing",
  "tradeSepticTankSize",
  "tradePexVsCopperCost",
  "tradeWaterPressureLoss",
  "tradeBathroomRoughInCost",
  "tradeWireGaugeAmpacity",
  "tradeVoltageDrop",
  "tradeConduitFill",
  "tradeEvChargerCircuit",
  "tradeElectricalJobBid",
  "tradeGeneratorSizing",
  "tradeSolarPanelArray",
  "tradeLedRetrofitPayback",
  "tradeSubpanelLoad",
  "tradeCommercialLightingLoad",
  "tradeBaseboardHeatSizing",
  "tradeRoofingSquares",
  "tradeShingleBundleCount",
  "tradeGutterCapacity",
  "tradeSidingSquareFootage",
  "tradeFenceMaterials",
  "tradeRoofPitchAngle",
  "tradeDeckJoistSpan",
  "tradeShingleWeightLoad",
  "tradeExteriorPaintCoverage",
  "tradeJobBidProfit",
  "tradeChangeOrderImpact",
  "tradeConcreteVolume",
  "tradeRemodelCostBallpark",
  "tradeSubcontractorBidCompare",
  "tradeDrywallSheetMud",
  "tradeInteriorPaintRoom",
  "tradeCrewDayRateVsPieceRate",
  "tradePermitOverheadRecovery",
  "tradeEquipmentRentalVsBuy",
  "tradeJobContingency",
  "tradeMulchCubicYards",
  "tradeSodSquareFootage",
  "tradeGravelDrivewayDepth",
  "tradeIrrigationZoneGpm",
  "tradeRetainingWallBlocks",
  "tradePaverPatioMaterial",
  "tradeBrickWallMortar",
  "tradeCmuBlockCount",
  "tradeRebarSpacingWeight",
  "tradePostHoleConcrete",
] as const;

export type TradesFormulaType = (typeof TRADES_FORMULA_TYPES)[number];

const TRADES_SET = new Set<string>(TRADES_FORMULA_TYPES);

export function isTradesFormulaType(formulaType: string): boolean {
  return TRADES_SET.has(formulaType);
}

export function runTradesCalculation(
  formulaType: string,
  inputs: Inputs
): CalcResult | null {
  if (!isTradesFormulaType(formulaType)) return null;

  switch (formulaType) {
    case "tradeHvacSeerSavings": {
      const oldSeer = clamp(inputs.oldSeer, 6, 20);
      const newSeer = clamp(inputs.newSeer, 13, 30);
      const annualKwh = Math.max(0, inputs.annualCoolingKwh);
      const rate = Math.max(0, inputs.kwhRate);
      const upgradeCost = Math.max(0, inputs.upgradeCost ?? 0);
      const newKwh = annualKwh * (oldSeer / newSeer);
      const savedKwh = annualKwh - newKwh;
      const annualSavings = savedKwh * rate;
      const paybackYears =
        upgradeCost > 0 && annualSavings > 0 ? upgradeCost / annualSavings : 0;
      return result("Annual savings", currency(annualSavings), [
        { label: "kWh saved / year", value: number(savedKwh, 0) },
        { label: "New annual kWh", value: number(newKwh, 0) },
        { label: "SEER change", value: `${number(oldSeer, 0)} → ${number(newSeer, 0)}` },
        {
          label: "Payback",
          value: paybackYears > 0 ? `${number(paybackYears, 1)} years` : "—",
        },
      ]);
    }

    case "tradeHvacBtuTonnage": {
      const sqFt = Math.max(0, inputs.sqFt);
      const climate = clamp(inputs.climateFactor, 0.9, 1.3);
      const insulation = clamp(inputs.insulationFactor, 0.8, 1.2);
      const tons = (sqFt / 500) * climate * insulation;
      const btu = tons * 12000;
      return result("Cooling tons", number(tons, 2), [
        { label: "BTU/hr", value: number(btu, 0) },
        { label: "Sq ft", value: number(sqFt, 0) },
        { label: "Climate × insulation", value: number(climate * insulation, 2) },
      ]);
    }

    case "tradeDuctworkCfm": {
      const dIn = Math.max(1, inputs.ductDiameterIn);
      const velocity = Math.max(100, inputs.velocityFpm);
      const areaSqFt = Math.PI * (dIn / 24) ** 2;
      const cfm = areaSqFt * velocity;
      return result("Airflow CFM", number(cfm, 0), [
        { label: "Duct area", value: `${number(areaSqFt, 4)} sq ft` },
        { label: "Velocity", value: `${number(velocity, 0)} FPM` },
        { label: "Diameter", value: `${number(dIn, 1)} in` },
      ]);
    }

    case "tradeHeatPumpCopSavings": {
      const therms = Math.max(0, inputs.annualTherms);
      const afue = clamp(inputs.furnaceAfue, 60, 98) / 100;
      const cop = clamp(inputs.heatPumpCop, 2, 5);
      const elec = Math.max(0, inputs.electricRate);
      const gas = Math.max(0, inputs.gasRate);
      const heatBtu = therms * 100000 * afue;
      const furnaceCost = therms * gas;
      const hpKwh = heatBtu / (cop * 3412);
      const hpCost = hpKwh * elec;
      const savings = furnaceCost - hpCost;
      return result("Annual savings vs furnace", currency(savings), [
        { label: "Furnace cost", value: currency(furnaceCost) },
        { label: "Heat pump cost", value: currency(hpCost) },
        { label: "Heat pump kWh", value: number(hpKwh, 0) },
      ]);
    }

    case "tradeHvacServiceCallPrice": {
      const labor = inputs.hours * inputs.hourlyRate;
      const cost = labor + inputs.travel + inputs.parts;
      const price = marginPrice(cost, inputs.marginPercent);
      return result("Service call price", currency(price), [
        { label: "Labor", value: currency(labor) },
        { label: "Travel + parts", value: currency(inputs.travel + inputs.parts) },
        { label: "Cost", value: currency(cost) },
      ]);
    }

    case "tradeMiniSplitHeadCount": {
      const load = Math.max(0, inputs.totalBtuLoad);
      const cap = Math.max(9000, inputs.headCapacityBtu);
      const heads = Math.ceil(load / cap);
      return result("Mini-split heads", number(heads, 0), [
        { label: "Total load", value: `${number(load, 0)} BTU` },
        { label: "Per head", value: `${number(cap, 0)} BTU` },
      ]);
    }

    case "tradeFurnaceAfueSavings": {
      const oldAfue = clamp(inputs.oldAfue, 60, 95) / 100;
      const newAfue = clamp(inputs.newAfue, 80, 98) / 100;
      const therms = Math.max(0, inputs.annualTherms);
      const gasRate = Math.max(0, inputs.gasRate);
      const upgradeCost = Math.max(0, inputs.upgradeCost ?? 0);
      const newTherms = therms * (oldAfue / newAfue);
      const savedTherms = therms - newTherms;
      const savings = savedTherms * gasRate;
      const payback =
        upgradeCost > 0 && savings > 0 ? upgradeCost / savings : 0;
      return result("Annual gas savings", currency(savings), [
        { label: "Therms saved", value: number(savedTherms, 1) },
        { label: "New therms", value: number(newTherms, 1) },
        {
          label: "Payback",
          value: payback > 0 ? `${number(payback, 1)} years` : "—",
        },
      ]);
    }

    case "tradeRefrigerantCharge": {
      const len = Math.max(0, inputs.lineLengthFt);
      const oz = len * Math.max(0.05, inputs.ozPerFoot);
      const lbs = oz / 16;
      return result("Additional charge", `${number(oz, 1)} oz`, [
        { label: "Pounds", value: number(lbs, 2) },
        { label: "Line length", value: `${number(len, 0)} ft` },
      ]);
    }

    case "tradeHvacInstallQuote": {
      const labor = inputs.laborHours * inputs.laborRate;
      const base = inputs.equipmentCost + labor + inputs.permits;
      const price = base * (1 + clamp(inputs.markupPercent, 0, 100) / 100);
      return result("Install quote", currency(price), [
        { label: "Equipment", value: currency(inputs.equipmentCost) },
        { label: "Labor", value: currency(labor) },
        { label: "Permits", value: currency(inputs.permits) },
      ]);
    }

    case "tradeWaterHeaterSizing": {
      const occupants = clamp(inputs.occupants, 1, 10);
      const peakMinutes = clamp(inputs.peakDemandMinutes, 10, 60);
      const tempRise = clamp(inputs.tempRiseF, 40, 90);
      const baseGal =
        occupants <= 2 ? 40 : occupants <= 4 ? 50 : occupants <= 6 ? 75 : 80;
      const recommended = baseGal + (peakMinutes > 30 ? 10 : 0);
      return result("Recommended tank", `${number(recommended, 0)} gal`, [
        { label: "Occupants", value: number(occupants, 0) },
        { label: "Temp rise", value: `${number(tempRise, 0)} °F` },
      ]);
    }

    case "tradePipeLengthFittings": {
      const total =
        inputs.straightRunFt +
        inputs.fittingsCount * inputs.allowancePerFittingFt;
      return result("Total pipe length", `${number(total, 1)} ft`, [
        { label: "Straight run", value: `${number(inputs.straightRunFt, 0)} ft` },
        { label: "Fittings allowance", value: `${number(inputs.fittingsCount * inputs.allowancePerFittingFt, 1)} ft` },
      ]);
    }

    case "tradeDrainSlope": {
      const run = Math.max(0.1, inputs.runLengthFt);
      const drop = Math.max(0, inputs.dropIn);
      const fallPerFt = drop / run;
      const slopePct = (drop / (run * 12)) * 100;
      return result("Slope", `${number(slopePct, 2)}%`, [
        { label: "Fall per foot", value: `${number(fallPerFt, 2)} in/ft` },
        { label: "Total drop", value: `${number(drop, 2)} in` },
      ]);
    }

    case "tradeFixtureUnitLoad": {
      const fu =
        inputs.toilets * 4 +
        inputs.lavs * 1 +
        inputs.tubs * 2 +
        inputs.kitchen * 2;
      return result("Fixture units", number(fu, 0), [
        { label: "Toilets", value: number(inputs.toilets, 0) },
        { label: "Lavs + tubs + kitchen", value: number(inputs.lavs + inputs.tubs + inputs.kitchen, 0) },
      ]);
    }

    case "tradePlumbingJobBid": {
      const labor = inputs.laborHours * inputs.laborRate;
      const cost = inputs.materials + labor + inputs.overhead;
      const price = marginPrice(cost, inputs.marginPercent);
      return result("Plumbing bid", currency(price), [
        { label: "Direct cost", value: currency(cost) },
        { label: "Labor", value: currency(labor) },
      ]);
    }

    case "tradeTanklessWaterHeaterGpm": {
      const gpm = inputs.showerGpm + inputs.kitchenGpm + inputs.otherGpm;
      return result("Required GPM", number(gpm, 1), [
        { label: "Temp rise", value: `${number(inputs.tempRiseF, 0)} °F` },
        { label: "Peak simultaneous", value: "Sum of fixture flows" },
      ]);
    }

    case "tradeSumpPumpSizing": {
      const gph =
        inputs.basementSqFt * inputs.rainfallInPerHr * 0.623 *
        (1 + inputs.headHeightFt / 20);
      return result("Pump class GPH", number(gph, 0), [
        { label: "Basement", value: `${number(inputs.basementSqFt, 0)} sq ft` },
        { label: "Head", value: `${number(inputs.headHeightFt, 0)} ft` },
      ]);
    }

    case "tradeSepticTankSize": {
      const bedroomMin = inputs.bedrooms <= 2 ? 750 : inputs.bedrooms <= 4 ? 1000 : 1250;
      const flow = inputs.occupants * inputs.gallonsPerPerson;
      const recommended = Math.max(bedroomMin, flow * 1.5);
      return result("Tank size", `${number(recommended, 0)} gal`, [
        { label: "Daily flow est.", value: `${number(flow, 0)} gal` },
        { label: "Bedroom minimum", value: `${number(bedroomMin, 0)} gal` },
      ]);
    }

    case "tradePexVsCopperCost": {
      const pex = inputs.linearFt * inputs.pexCostPerFt + inputs.fittingsCost / 2;
      const copper =
        inputs.linearFt * inputs.copperCostPerFt + inputs.fittingsCost / 2;
      const delta = copper - pex;
      return result("PEX total", currency(pex), [
        { label: "Copper total", value: currency(copper) },
        { label: "Copper − PEX", value: currency(delta) },
      ]);
    }

    case "tradeWaterPressureLoss": {
      const d = Math.max(0.25, inputs.pipeDiameterIn);
      const loss =
        (0.2083 * inputs.lengthFt * inputs.flowGpm ** 1.85) /
        (d ** 4.865);
      return result("Pressure loss", `${number(loss, 2)} PSI`, [
        { label: "Flow", value: `${number(inputs.flowGpm, 1)} GPM` },
        { label: "Length", value: `${number(inputs.lengthFt, 0)} ft` },
      ]);
    }

    case "tradeBathroomRoughInCost": {
      const labor = inputs.fixtures * inputs.hoursPerFixture * inputs.laborRate;
      const total = labor + inputs.materialsAllowance;
      return result("Rough-in estimate", currency(total), [
        { label: "Labor", value: currency(labor) },
        { label: "Materials", value: currency(inputs.materialsAllowance) },
      ]);
    }

    case "tradeWireGaugeAmpacity": {
      const amps = clamp(inputs.loadAmps, 1, 200);
      const lengthFt = Math.max(1, inputs.circuitLengthFt);
      const voltage = clamp(inputs.voltage, 110, 480);
      const gauge = suggestWireGauge(amps);
      const r = awgResistance(12) * (12 / Math.max(10, amps * 0.55));
      const dropV = 2 * amps * (r / 1000) * lengthFt;
      const dropPct = voltage > 0 ? (dropV / voltage) * 100 : 0;
      return result("Suggested wire", gauge, [
        { label: "Voltage drop", value: `${number(dropV, 2)} V (${number(dropPct, 1)}%)` },
        { label: "Load", value: `${number(amps, 0)} A` },
      ]);
    }

    case "tradeVoltageDrop": {
      const amps = inputs.loadAmps;
      const len = inputs.lengthFt;
      const v = inputs.voltage;
      const awg = clamp(inputs.wireGaugeAwG, 2, 14);
      const r = awgResistance(awg) / 1000;
      const dropV = 2 * amps * r * len;
      const dropPct = v > 0 ? (dropV / v) * 100 : 0;
      return result("Voltage drop", `${number(dropV, 2)} V`, [
        { label: "Percent", value: `${number(dropPct, 2)}%` },
        { label: "AWG", value: number(awg, 0) },
      ]);
    }

    case "tradeConduitFill": {
      const conduitR = inputs.conduitDiameterIn / 2;
      const wireR = inputs.wireDiameterIn / 2;
      const conduitArea = Math.PI * conduitR ** 2;
      const wireArea = Math.PI * wireR ** 2 * inputs.wireCount;
      const fillPct = conduitArea > 0 ? (wireArea / conduitArea) * 100 : 0;
      const maxWires = Math.floor((conduitArea * 0.4) / (Math.PI * wireR ** 2));
      return result("Fill percent", `${number(fillPct, 1)}%`, [
        { label: "Max wires (40% fill)", value: number(maxWires, 0) },
        { label: "Wire count", value: number(inputs.wireCount, 0) },
      ]);
    }

    case "tradeEvChargerCircuit": {
      const amps = inputs.chargerAmps;
      const breaker = Math.ceil(amps * 1.25);
      const wire = suggestWireGauge(breaker);
      const len = inputs.lengthFt;
      const dropV = 2 * amps * (awgResistance(6) / 1000) * len;
      const dropPct = inputs.voltage > 0 ? (dropV / inputs.voltage) * 100 : 0;
      return result("Breaker size", `${number(breaker, 0)} A`, [
        { label: "Wire", value: wire },
        { label: "Voltage drop est.", value: `${number(dropPct, 1)}%` },
      ]);
    }

    case "tradeElectricalJobBid": {
      const labor = inputs.laborHours * inputs.laborRate;
      const cost = inputs.materials + labor + inputs.overhead;
      const price = marginPrice(cost, inputs.marginPercent);
      return result("Electrical bid", currency(price), [
        { label: "Direct cost", value: currency(cost) },
      ]);
    }

    case "tradeGeneratorSizing": {
      const kw = (inputs.runningWatts + inputs.surgeWatts) / 1000;
      return result("Generator size", `${number(kw, 1)} kW`, [
        { label: "Running W", value: number(inputs.runningWatts, 0) },
        { label: "Surge W", value: number(inputs.surgeWatts, 0) },
      ]);
    }

    case "tradeSolarPanelArray": {
      const dailyKwh = inputs.monthlyKwh / 30;
      const panelKw = inputs.panelWatts / 1000;
      const dailyProd = panelKw * inputs.sunHoursPerDay;
      const panels =
        dailyProd > 0 ? Math.ceil(dailyKwh / dailyProd) : 0;
      const annualProd = panels * dailyProd * 365;
      const annualSavings = annualProd * inputs.kwhRate;
      const payback =
        annualSavings > 0 ? inputs.systemCost / annualSavings : 0;
      return result("Panels needed", number(panels, 0), [
        { label: "Annual production", value: `${number(annualProd, 0)} kWh` },
        { label: "Annual savings", value: currency(annualSavings) },
        {
          label: "Payback",
          value: payback > 0 ? `${number(payback, 1)} years` : "—",
        },
      ]);
    }

    case "tradeLedRetrofitPayback": {
      const savedW =
        (inputs.oldWatts - inputs.ledWatts) *
        inputs.hoursPerDay *
        inputs.fixtureCount;
      const annualKwh = (savedW * 365) / 1000;
      const annualSavings = annualKwh * inputs.kwhRate;
      const cost = inputs.retrofitCost * inputs.fixtureCount;
      const months =
        annualSavings > 0 ? (cost / annualSavings) * 12 : 0;
      return result("Annual savings", currency(annualSavings), [
        { label: "kWh saved", value: number(annualKwh, 0) },
        { label: "Payback", value: months > 0 ? `${number(months, 1)} months` : "—" },
      ]);
    }

    case "tradeSubpanelLoad": {
      const required =
        inputs.connectedLoadAmps * (1 + clamp(inputs.sparePercent, 0, 50) / 100);
      const standard = [60, 80, 100, 125, 150, 200].find((s) => s >= required) ?? 200;
      return result("Subpanel size", `${standard} A`, [
        { label: "Required amps", value: number(required, 1) },
        { label: "Connected load", value: `${number(inputs.connectedLoadAmps, 0)} A` },
      ]);
    }

    case "tradeCommercialLightingLoad": {
      const totalW = inputs.fixtures * inputs.wattsPerFixture;
      const monthlyKwh =
        (totalW * inputs.hoursPerDay * inputs.daysPerMonth) / 1000;
      const amps = inputs.voltage > 0 ? totalW / inputs.voltage : 0;
      return result("Monthly kWh", number(monthlyKwh, 0), [
        { label: "Connected amps", value: number(amps, 1) },
        { label: "Total watts", value: number(totalW, 0) },
      ]);
    }

    case "tradeBaseboardHeatSizing": {
      const btu = inputs.roomSqFt * inputs.heatLossBtuPerSqFt;
      const linearFt = btu / Math.max(50, inputs.wattsPerLinearFt) * 3.412 / 3.412;
      const watts = linearFt * inputs.wattsPerLinearFt;
      return result("Baseboard length", `${number(linearFt, 1)} ft`, [
        { label: "Heat load", value: `${number(btu, 0)} BTU/hr` },
        { label: "Watts", value: number(watts, 0) },
      ]);
    }

    case "tradeRoofingSquares": {
      const adjustedArea =
        inputs.roofAreaSqFt *
        inputs.pitchFactor *
        (1 + clamp(inputs.wastePercent, 0, 25) / 100);
      const squares = adjustedArea / 100;
      const material = squares * inputs.materialPerSquare;
      const labor = squares * inputs.laborPerSquare;
      return result("Squares", number(squares, 2), [
        { label: "Materials", value: currency(material) },
        { label: "Labor", value: currency(labor) },
        { label: "Total", value: currency(material + labor) },
      ]);
    }

    case "tradeShingleBundleCount": {
      const bundles =
        inputs.squares *
        inputs.bundlesPerSquare *
        (1 + clamp(inputs.wastePercent, 0, 25) / 100);
      return result("Bundles", number(Math.ceil(bundles), 0), [
        { label: "Squares", value: number(inputs.squares, 2) },
      ]);
    }

    case "tradeGutterCapacity": {
      const gpm = inputs.roofAreaSqFt * inputs.rainfallInPerHr * 0.0104;
      const downspouts = Math.max(
        1,
        Math.ceil(gpm / Math.max(1, inputs.downspoutGpm))
      );
      return result("Gutter demand", `${number(gpm, 1)} GPM`, [
        { label: "Downspouts needed", value: number(downspouts, 0) },
      ]);
    }

    case "tradeSidingSquareFootage": {
      const net =
        Math.max(0, inputs.wallAreaSqFt - inputs.openingsSqFt) *
        (1 + clamp(inputs.wastePercent, 0, 25) / 100);
      const cost = net * inputs.costPerSqFt;
      return result("Siding sq ft", number(net, 0), [
        { label: "Material cost", value: currency(cost) },
        { label: "Squares (100 sf)", value: number(net / 100, 2) },
      ]);
    }

    case "tradeFenceMaterials": {
      const posts = Math.ceil(inputs.lengthFt / inputs.postSpacingFt) + 1;
      const pickets = Math.ceil(
        (inputs.lengthFt * 12) / inputs.picketWidthIn
      );
      const rails = posts * 2;
      return result("Posts", number(posts, 0), [
        { label: "Pickets", value: number(pickets, 0) },
        { label: "Rails", value: number(rails, 0) },
        { label: "Height", value: `${number(inputs.fenceHeightFt, 1)} ft` },
      ]);
    }

    case "tradeRoofPitchAngle": {
      const rise = inputs.riseIn;
      const run = Math.max(1, inputs.runIn);
      const pitch = `${number(rise, 1)}/${number(run, 0)}`;
      const angle = (Math.atan(rise / run) * 180) / Math.PI;
      const mult = Math.sqrt(run ** 2 + rise ** 2) / run;
      return result("Pitch", pitch, [
        { label: "Angle", value: `${number(angle, 1)}°` },
        { label: "Area multiplier", value: number(mult, 3) },
      ]);
    }

    case "tradeDeckJoistSpan": {
      const depth = inputs.joistDepthIn;
      const spacing = inputs.spacingIn;
      const load = inputs.loadPsf;
      const baseSpan = (depth / 10) * (16 / spacing) * (50 / load) * 12;
      return result("Max span (est.)", `${number(baseSpan, 1)} ft`, [
        { label: "Joist depth", value: `${number(depth, 0)} in` },
        { label: "Spacing", value: `${number(spacing, 0)} in OC` },
      ], "Verify against local span tables and code.");
    }

    case "tradeShingleWeightLoad": {
      const weight = inputs.squares * inputs.lbsPerSquare;
      return result("Total weight", `${number(weight, 0)} lbs`, [
        { label: "Per square", value: `${number(inputs.lbsPerSquare, 0)} lbs` },
      ]);
    }

    case "tradeExteriorPaintCoverage": {
      const gal =
        (inputs.surfaceSqFt *
          inputs.coats *
          (1 + clamp(inputs.wastePercent, 0, 25) / 100)) /
        Math.max(100, inputs.coveragePerGal);
      return result("Gallons", number(gal, 1), [
        { label: "Coats", value: number(inputs.coats, 0) },
      ]);
    }

    case "tradeJobBidProfit": {
      const labor = inputs.laborHours * inputs.laborRate;
      const direct = inputs.materials + labor + inputs.overhead;
      const bid = direct * (1 + clamp(inputs.markupPercent, 0, 100) / 100);
      const profit = bid - direct;
      const margin = bid > 0 ? (profit / bid) * 100 : 0;
      return result("Bid price", currency(bid), [
        { label: "Direct cost", value: currency(direct) },
        { label: "Profit", value: currency(profit) },
        { label: "Margin", value: `${number(margin, 1)}%` },
      ]);
    }

    case "tradeChangeOrderImpact": {
      const newPrice = inputs.originalPrice + inputs.addedPrice;
      const newCost = inputs.originalCost + inputs.addedCost;
      const oldProfit = inputs.originalPrice - inputs.originalCost;
      const newProfit = newPrice - newCost;
      const oldMargin =
        inputs.originalPrice > 0
          ? (oldProfit / inputs.originalPrice) * 100
          : 0;
      const newMargin = newPrice > 0 ? (newProfit / newPrice) * 100 : 0;
      return result("Revised bid", currency(newPrice), [
        { label: "New margin", value: `${number(newMargin, 1)}%` },
        { label: "Old margin", value: `${number(oldMargin, 1)}%` },
        { label: "Profit delta", value: currency(newProfit - oldProfit) },
      ]);
    }

    case "tradeConcreteVolume": {
      const cuFt =
        inputs.lengthFt *
        inputs.widthFt *
        (inputs.depthIn / 12);
      const cuYd = cuFt / 27;
      const bags = Math.ceil(cuFt / Math.max(0.1, inputs.bagYieldCuFt));
      const mat = bags * inputs.bagCost;
      const total = mat + inputs.laborCost;
      return result("Cubic yards", number(cuYd, 2), [
        { label: "Bags", value: number(bags, 0) },
        { label: "Material", value: currency(mat) },
        { label: "Total w/ labor", value: currency(total) },
      ]);
    }

    case "tradeRemodelCostBallpark": {
      const low = inputs.sqFt * inputs.costPerSqFtLow;
      const high = inputs.sqFt * inputs.costPerSqFtHigh;
      return result("Cost range", `${currency(low)} – ${currency(high)}`, [
        { label: "Sq ft", value: number(inputs.sqFt, 0) },
      ]);
    }

    case "tradeSubcontractorBidCompare": {
      const bids = [inputs.bid1, inputs.bid2, inputs.bid3].filter((b) => b > 0);
      const low = Math.min(...bids);
      const high = Math.max(...bids);
      const avg = bids.reduce((a, b) => a + b, 0) / bids.length;
      return result("Low bid", currency(low), [
        { label: "High bid", value: currency(high) },
        { label: "Spread", value: currency(high - low) },
        { label: "Average", value: currency(avg) },
      ]);
    }

    case "tradeDrywallSheetMud": {
      const wall =
        2 * (inputs.roomLengthFt + inputs.roomWidthFt) * inputs.roomHeightFt;
      const ceiling = inputs.roomLengthFt * inputs.roomWidthFt;
      const sqFt = (wall + ceiling) * (1 + clamp(inputs.wastePercent, 0, 25) / 100);
      const sheets = Math.ceil(sqFt / 32);
      const mudGal = sqFt / 100;
      return result("Drywall sheets", number(sheets, 0), [
        { label: "Surface sq ft", value: number(sqFt, 0) },
        { label: "Joint compound (gal est.)", value: number(mudGal, 1) },
      ]);
    }

    case "tradeInteriorPaintRoom": {
      const wall =
        2 * (inputs.roomLengthFt + inputs.roomWidthFt) * inputs.roomHeightFt;
      const ceiling = inputs.roomLengthFt * inputs.roomWidthFt;
      const paintable = wall + ceiling - inputs.openingsSqFt;
      const gal =
        (paintable * inputs.coats) / Math.max(100, inputs.coveragePerGal);
      return result("Gallons", number(gal, 1), [
        { label: "Paintable sq ft", value: number(paintable, 0) },
      ]);
    }

    case "tradeCrewDayRateVsPieceRate": {
      const dayCost =
        inputs.crewSize * inputs.hours * inputs.dayRatePerPerson;
      const pieceCost = inputs.pieceQuantity * inputs.pieceRate;
      const dayPerHr = inputs.hours > 0 ? dayCost / inputs.hours : 0;
      const piecePerHr =
        inputs.hours > 0 ? pieceCost / inputs.hours : 0;
      const cheaper =
        dayCost <= pieceCost ? "Day-rate crew" : "Piece-rate";
      return result("Day-rate job cost", currency(dayCost), [
        { label: "Piece-rate cost", value: currency(pieceCost) },
        { label: "Day effective $/hr", value: currency(dayPerHr) },
        { label: "Piece effective $/hr", value: currency(piecePerHr) },
        { label: "Lower cost", value: cheaper },
      ]);
    }

    case "tradePermitOverheadRecovery": {
      const daily =
        inputs.monthlyOverhead / Math.max(1, inputs.workingDaysPerMonth);
      const overheadAdd = daily * inputs.jobDays;
      const total = overheadAdd + inputs.permitFees;
      return result("Bid add-on", currency(total), [
        { label: "Overhead portion", value: currency(overheadAdd) },
        { label: "Permits", value: currency(inputs.permitFees) },
        { label: "Daily overhead", value: currency(daily) },
      ]);
    }

    case "tradeEquipmentRentalVsBuy": {
      const rentTotal = inputs.rentalPerDay * inputs.rentalDays;
      const buyTotal =
        inputs.purchaseCost + inputs.annualMaint * inputs.yearsOwned;
      const breakEvenDays =
        inputs.rentalPerDay > 0 ? buyTotal / inputs.rentalPerDay : 0;
      const winner = rentTotal <= buyTotal ? "Rent" : "Buy";
      return result("Rent total", currency(rentTotal), [
        { label: "Buy total", value: currency(buyTotal) },
        { label: "Break-even rental days", value: number(breakEvenDays, 0) },
        { label: "Lower for this job", value: winner },
      ]);
    }

    case "tradeJobContingency": {
      const contingency =
        inputs.jobValue * (clamp(inputs.riskPercent, 0, 30) / 100);
      return result("Contingency", currency(contingency), [
        { label: "Risk %", value: `${number(inputs.riskPercent, 0)}%` },
        { label: "Job value", value: currency(inputs.jobValue) },
      ]);
    }

    case "tradeMulchCubicYards": {
      const cuYd =
        (inputs.areaSqFt * (inputs.depthIn / 12)) / 27;
      const cost = cuYd * inputs.costPerCuYd;
      const bags = Math.ceil(cuYd * 27 / 2);
      return result("Cubic yards", number(cuYd, 2), [
        { label: "Est. cost", value: currency(cost) },
        { label: "2 cu ft bags (est.)", value: number(bags, 0) },
      ]);
    }

    case "tradeSodSquareFootage": {
      const order =
        inputs.lawnSqFt * (1 + clamp(inputs.wastePercent, 0, 20) / 100);
      const cost = order * inputs.costPerSqFt;
      const pallets = Math.ceil(order / 450);
      return result("Order sq ft", number(order, 0), [
        { label: "Cost", value: currency(cost) },
        { label: "Pallets (est.)", value: number(pallets, 0) },
      ]);
    }

    case "tradeGravelDrivewayDepth": {
      const cuYd =
        (inputs.lengthFt * inputs.widthFt * (inputs.depthIn / 12)) / 27;
      const tons = cuYd * 1.4;
      const cost = tons * inputs.costPerTon;
      return result("Tons", number(tons, 2), [
        { label: "Cubic yards", value: number(cuYd, 2) },
        { label: "Cost", value: currency(cost) },
      ]);
    }

    case "tradeIrrigationZoneGpm": {
      const zoneGpm = inputs.headCount * inputs.gpmPerHead;
      const ok = zoneGpm <= inputs.supplyGpm;
      return result("Zone GPM", number(zoneGpm, 1), [
        { label: "Supply GPM", value: number(inputs.supplyGpm, 1) },
        { label: "Within supply", value: ok ? "Yes" : "Over capacity" },
      ]);
    }

    case "tradeRetainingWallBlocks": {
      const face = inputs.wallLengthFt * inputs.wallHeightFt;
      const blocks = Math.ceil(
        (face / Math.max(0.05, inputs.blockFaceSqFt)) *
          (1 + clamp(inputs.wastePercent, 0, 25) / 100)
      );
      const gravelCuYd = (inputs.wallLengthFt * 2 * (inputs.wallHeightFt / 3)) / 27;
      return result("Blocks", number(blocks, 0), [
        { label: "Wall face sq ft", value: number(face, 0) },
        { label: "Backfill gravel (cu yd est.)", value: number(gravelCuYd, 2) },
      ]);
    }

    case "tradePaverPatioMaterial": {
      const pavers = Math.ceil(
        (inputs.patioSqFt / Math.max(0.1, inputs.paverSqFt)) *
          (1 + clamp(inputs.wastePercent, 0, 25) / 100)
      );
      const baseCuYd =
        (inputs.patioSqFt * (inputs.baseDepthIn / 12)) / 27;
      return result("Pavers", number(pavers, 0), [
        { label: "Base gravel (cu yd)", value: number(baseCuYd, 2) },
        { label: "Patio sq ft", value: number(inputs.patioSqFt, 0) },
      ]);
    }

    case "tradeBrickWallMortar": {
      const bricks = Math.ceil(inputs.wallSqFt * inputs.bricksPerSqFt);
      const mortarBags = Math.ceil(inputs.wallSqFt * inputs.mortarBagsPerSqFt);
      return result("Bricks", number(bricks, 0), [
        { label: "Mortar bags", value: number(mortarBags, 0) },
      ]);
    }

    case "tradeCmuBlockCount": {
      const blocks = Math.ceil(
        (inputs.wallSqFt / Math.max(0.1, inputs.blockFaceSqFt)) *
          (1 + clamp(inputs.wastePercent, 0, 20) / 100)
      );
      return result("CMU blocks", number(blocks, 0), [
        { label: "Wall sq ft", value: number(inputs.wallSqFt, 0) },
      ]);
    }

    case "tradeRebarSpacingWeight": {
      const pieces =
        Math.floor((inputs.runLengthFt * 12) / inputs.spacingIn) + 1;
      const totalFt = pieces * inputs.runLengthFt;
      const weight = totalFt * inputs.barWeightLbPerFt;
      return result("Rebar weight", `${number(weight, 1)} lbs`, [
        { label: "Pieces", value: number(pieces, 0) },
        { label: "Total bar length", value: `${number(totalFt, 0)} ft` },
      ]);
    }

    case "tradePostHoleConcrete": {
      const r = inputs.diameterIn / 2;
      const cuFtPerHole =
        Math.PI * (r / 12) ** 2 * (inputs.depthIn / 12);
      const totalCuFt = cuFtPerHole * inputs.holeCount;
      const bags = Math.ceil(totalCuFt / Math.max(0.1, inputs.bagYieldCuFt));
      const cost = bags * inputs.bagCost;
      return result("Concrete bags", number(bags, 0), [
        { label: "Total cu ft", value: number(totalCuFt, 2) },
        { label: "Material cost", value: currency(cost) },
      ]);
    }

    default:
      return null;
  }
}
