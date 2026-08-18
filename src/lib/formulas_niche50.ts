/**
 * Hyper-niche maker / pet / gig / homestead / hobby calculators (50 tools).
 * Planning estimates only — verify critical measurements independently.
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

export const NICHE50_FORMULA_TYPES = [
  "nicheEpoxyRiverTable",
  "nicheCandleFragrance",
  "nicheColdProcessSoapLye",
  "nicheYarnSubstitution",
  "nicheQuiltBackingBinding",
  "nicheCrochetStartingChain",
  "nicheHtvVinylProjectCost",
  "nicheEpoxyCoasterCost",
  "nicheLeatherHideYield",
  "nicheSourdoughHydration",
  "nicheBeardedDragonGradient",
  "nichePlantedTankCo2",
  "nicheRawDogFoodRatio",
  "nicheHorseHayWinter",
  "nicheChickenCoopNesting",
  "nicheAxolotlChiller",
  "nicheKoiPondPumpGph",
  "nicheGuineaPigVitaminC",
  "nicheDubiaRoachRoi",
  "nicheMonthlyCatLitterCost",
  "nicheTattooArtistProfit",
  "nicheTwitchSubRevenue",
  "nicheEtsyDimensionalWeight",
  "nicheFoodTruckPropane",
  "nicheDjiDroneBatteryCost",
  "nicheMobileDetailingWater",
  "nicheVendingMachineRoi",
  "nicheCreatorPlatformFee",
  "nicheVideo4kUpload",
  "nicheHouseSittingRate",
  "nicheHydroponicPpmEc",
  "nicheMelsMixVolume",
  "nicheMicrogreensSeedDensity",
  "nicheVanlifeSolarBattery",
  "nicheFirewoodCordBtu",
  "nichePoultryFence",
  "nicheGrowTentCfm",
  "nicheRainwaterHarvesting",
  "nicheCompostCnRatio",
  "nicheBulkMulch",
  "nicheWeddingCakeTiers",
  "nicheOpenBarAlcohol",
  "nicheCharcuteriePerPerson",
  "nicheDndXpBudget",
  "nicheTtrpgPrepTime",
  "nicheHomebrewPrimingSugar",
  "nicheTelescopeFov",
  "nicheRcGearRatio",
  "nicheAcidDyeYarn",
  "nicheCoffeeRoastWeightLoss",
] as const;

export type Niche50FormulaType = (typeof NICHE50_FORMULA_TYPES)[number];

const NICHE50_SET = new Set<string>(NICHE50_FORMULA_TYPES);

export function isNiche50FormulaType(formulaType: string): boolean {
  return NICHE50_SET.has(formulaType);
}

export function runNiche50Calculation(
  formulaType: string,
  inputs: Inputs
): CalcResult | null {
  if (!isNiche50FormulaType(formulaType)) return null;

  switch (formulaType) {
    case "nicheEpoxyRiverTable": {
      const cuIn =
        inputs.lengthIn *
        inputs.widthIn *
        inputs.depthIn *
        clamp(inputs.coats, 1, 5);
      const liters = cuIn * 0.0163871;
      const gallons = liters / 3.78541;
      return result("Epoxy needed", `${number(liters, 2)} L`, [
        { label: "Gallons", value: number(gallons, 2) },
        { label: "Cubic inches", value: number(cuIn, 0) },
        { label: "Coats", value: number(inputs.coats, 0) },
      ], "Add 5–10% waste for river pours with dams and overflow.");
    }

    case "nicheCandleFragrance": {
      const waxOz = Math.max(0, inputs.waxOz);
      const pct = clamp(inputs.fragrancePct, 0, 12);
      const fragOz = (waxOz * pct) / 100;
      return result("Fragrance oil", `${number(fragOz, 2)} oz`, [
        { label: "Load %", value: `${number(pct, 1)}%` },
        { label: "Wax weight", value: `${number(waxOz, 1)} oz` },
        { label: "Grams (approx.)", value: number(fragOz * 28.35, 1) },
      ]);
    }

    case "nicheColdProcessSoapLye": {
      const oilOz = Math.max(0, inputs.oilOz);
      const sap = clamp(inputs.avgSapValue, 0.12, 0.2);
      const superfat = clamp(inputs.superfatPct, 0, 15);
      const oilG = oilOz * 28.3495;
      const lyeG = oilG * sap * (1 - superfat / 100);
      const waterG = lyeG * clamp(inputs.waterToLyeRatio, 2, 3.5);
      return result("NaOH (lye)", `${number(lyeG, 1)} g`, [
        { label: "Water", value: `${number(waterG, 0)} g` },
        { label: "Oil", value: `${number(oilOz, 1)} oz` },
        { label: "Superfat", value: `${number(superfat, 0)}%` },
      ]);
    }

    case "nicheYarnSubstitution": {
      const yards = Math.max(0, inputs.originalYards);
      const oldGauge = Math.max(1, inputs.originalGauge);
      const newGauge = Math.max(1, inputs.newGauge);
      const needed = yards * (newGauge / oldGauge);
      return result("Yardage needed", `${number(needed, 0)} yd`, [
        { label: "Original yards", value: number(yards, 0) },
        { label: "Gauge ratio", value: number(newGauge / oldGauge, 2) },
      ]);
    }

    case "nicheQuiltBackingBinding": {
      const w = inputs.quiltWidthIn + 8;
      const l = inputs.quiltLengthIn + 8;
      const backingYd = ((w * l) / 1296) * 1.05;
      const perimeter = 2 * (inputs.quiltWidthIn + inputs.quiltLengthIn);
      const bindingIn = perimeter * clamp(inputs.bindingWidthIn, 2, 4);
      const bindingYd = bindingIn / 36;
      return result("Backing fabric", `${number(backingYd, 2)} yd`, [
        { label: "Binding", value: `${number(bindingYd, 2)} yd` },
        { label: "Quilt size", value: `${number(inputs.quiltWidthIn, 0)}×${number(inputs.quiltLengthIn, 0)} in` },
      ]);
    }

    case "nicheCrochetStartingChain": {
      const stitches = Math.ceil(
        inputs.blanketWidthIn / Math.max(0.1, inputs.stitchWidthIn)
      );
      return result("Starting chains", number(stitches, 0), [
        { label: "Target width", value: `${number(inputs.blanketWidthIn, 0)} in` },
        { label: "Stitch width", value: `${number(inputs.stitchWidthIn, 2)} in` },
      ]);
    }

    case "nicheHtvVinylProjectCost": {
      const material = inputs.vinylSqFt * inputs.vinylCostPerSqFt;
      const labor = (inputs.laborMin / 60) * inputs.hourlyRate;
      const total = material + labor + inputs.otherCost;
      const profit = inputs.sellPrice - total;
      const margin = inputs.sellPrice > 0 ? (profit / inputs.sellPrice) * 100 : 0;
      return result("Total cost", currency(total), [
        { label: "Material", value: currency(material) },
        { label: "Labor", value: currency(labor) },
        { label: "Profit at price", value: currency(profit) },
        { label: "Margin", value: `${number(margin, 0)}%` },
      ]);
    }

    case "nicheEpoxyCoasterCost": {
      const resinCost = inputs.resinGrams * inputs.costPerGram;
      const perCoaster = resinCost / Math.max(1, inputs.moldCount);
      return result("Batch resin cost", currency(resinCost), [
        { label: "Per coaster", value: currency(perCoaster) },
        { label: "Resin used", value: `${number(inputs.resinGrams, 0)} g` },
      ]);
    }

    case "nicheLeatherHideYield": {
      const usable = inputs.hideSqFt * (1 - clamp(inputs.wastePct, 5, 40) / 100);
      const bags = Math.floor(usable / Math.max(0.5, inputs.patternSqFtPerBag));
      return result("Usable hide area", `${number(usable, 1)} sq ft`, [
        { label: "Bags possible (approx.)", value: number(bags, 0) },
        { label: "Pattern need", value: `${number(inputs.patternSqFtPerBag, 1)} sq ft/bag` },
      ]);
    }

    case "nicheSourdoughHydration": {
      const flour = Math.max(0, inputs.flourGrams);
      const hydration = clamp(inputs.hydrationPct, 50, 120);
      const water = flour * (hydration / 100);
      const starter = flour * (clamp(inputs.starterPct, 5, 50) / 100);
      const discard = starter * (clamp(inputs.discardPct, 0, 100) / 100);
      return result("Water", `${number(water, 0)} g`, [
        { label: "Hydration", value: `${number(hydration, 0)}%` },
        { label: "Starter (at 100% hydration)", value: `${number(starter, 0)} g` },
        { label: "Discard amount", value: `${number(discard, 0)} g` },
      ]);
    }

    case "nicheBeardedDragonGradient": {
      const tankLen = Math.max(20, inputs.tankLengthIn);
      const bask = clamp(inputs.baskingTempF, 95, 110);
      const cool = clamp(inputs.coolTempF, 70, 85);
      const hotZone = tankLen * 0.33;
      return result("Basking zone length", `${number(hotZone, 0)} in`, [
        { label: "Basking target", value: `${number(bask, 0)} °F` },
        { label: "Cool side target", value: `${number(cool, 0)} °F` },
        { label: "Gradient span", value: `${number(bask - cool, 0)} °F` },
      ]);
    }

    case "nichePlantedTankCo2": {
      const gal = Math.max(1, inputs.tankGallons);
      const load = clamp(inputs.plantLoad, 1, 3);
      const bps = 0.5 + gal * 0.04 * load;
      return result("Suggested CO₂ BPS", number(bps, 1), [
        { label: "Tank volume", value: `${number(gal, 0)} gal` },
        { label: "Plant load", value: load === 3 ? "Heavy" : load === 2 ? "Medium" : "Light" },
      ], "Tune with drop checker and fish behavior — start low.");
    }

    case "nicheRawDogFoodRatio": {
      const lbs = Math.max(1, inputs.dogWeightLbs);
      const dailyOz = lbs * 2;
      const meat = dailyOz * 0.8;
      const bone = dailyOz * 0.1;
      const organ = dailyOz * 0.05;
      const veg = dailyOz * 0.05;
      return result("Daily feed (approx.)", `${number(dailyOz, 1)} oz`, [
        { label: "Muscle meat (80%)", value: `${number(meat, 1)} oz` },
        { label: "Bone (10%)", value: `${number(bone, 1)} oz` },
        { label: "Organ (5%)", value: `${number(organ, 1)} oz` },
        { label: "Plants/veg (5%)", value: `${number(veg, 1)} oz` },
      ]);
    }

    case "nicheHorseHayWinter": {
      const lbsPerDay = clamp(inputs.lbsPerHorsePerDay, 15, 35);
      const totalLbs =
        inputs.horseCount * lbsPerDay * clamp(inputs.winterDays, 30, 200);
      const bales = totalLbs / Math.max(1, inputs.baleWeightLbs);
      return result("Bales needed", number(bales, 0), [
        { label: "Total hay", value: `${number(totalLbs, 0)} lb` },
        { label: "Horses", value: number(inputs.horseCount, 0) },
        { label: "Days", value: number(inputs.winterDays, 0) },
      ]);
    }

    case "nicheChickenCoopNesting": {
      const hens = Math.max(1, inputs.henCount);
      const boxes = Math.ceil(hens / clamp(inputs.hensPerBox, 3, 5));
      const sqFt = hens * clamp(inputs.sqFtPerHen, 2, 5);
      return result("Nesting boxes", number(boxes, 0), [
        { label: "Coop floor space", value: `${number(sqFt, 0)} sq ft` },
        { label: "Hens", value: number(hens, 0) },
      ]);
    }

    case "nicheAxolotlChiller": {
      const gal = Math.max(10, inputs.tankGallons);
      const delta = Math.max(0, inputs.ambientTempF - inputs.targetTempF);
      const btu = gal * 8 * delta * 0.15;
      const hp = btu / 12000;
      return result("Cooling load (approx.)", `${number(btu, 0)} BTU/hr`, [
        { label: "Chiller size hint", value: `${number(hp, 2)} HP class` },
        { label: "Temp drop needed", value: `${number(delta, 0)} °F` },
      ]);
    }

    case "nicheKoiPondPumpGph": {
      const gal = Math.max(100, inputs.pondGallons);
      const hours = clamp(inputs.turnoverHours, 1, 6);
      const gph = gal / hours;
      return result("Pump flow rate", `${number(gph, 0)} GPH`, [
        { label: "Turnover time", value: `${number(hours, 1)} hr` },
        { label: "Pond volume", value: `${number(gal, 0)} gal` },
      ]);
    }

    case "nicheGuineaPigVitaminC": {
      const kg = Math.max(0.2, inputs.weightGrams / 1000);
      const mgPerKg = clamp(inputs.mgPerKg, 10, 50);
      const mg = kg * mgPerKg;
      return result("Daily vitamin C", `${number(mg, 0)} mg`, [
        { label: "Weight", value: `${number(inputs.weightGrams, 0)} g` },
        { label: "Dose used", value: `${number(mgPerKg, 0)} mg/kg` },
      ]);
    }

    case "nicheDubiaRoachRoi": {
      const monthlyProfit =
        inputs.roachesSoldPerMonth * inputs.pricePerRoach - inputs.monthlyCost;
      const monthsToBreakeven =
        monthlyProfit > 0 ? inputs.startupCost / monthlyProfit : Infinity;
      return result("Monthly profit", currency(monthlyProfit), [
        { label: "Startup cost", value: currency(inputs.startupCost) },
        {
          label: "Break-even",
          value: monthsToBreakeven === Infinity ? "—" : `${number(monthsToBreakeven, 1)} mo`,
        },
      ]);
    }

    case "nicheMonthlyCatLitterCost": {
      const monthly = inputs.cats * inputs.bagsPerMonth * inputs.bagPrice;
      return result("Monthly litter cost", currency(monthly), [
        { label: "Per cat", value: currency(monthly / Math.max(1, inputs.cats)) },
        { label: "Annual", value: currency(monthly * 12) },
      ]);
    }

    case "nicheTattooArtistProfit": {
      const hourlyFromPiece = inputs.piecePrice / Math.max(0.5, inputs.hours);
      const profit = inputs.piecePrice - inputs.suppliesCost;
      const vsTarget = hourlyFromPiece - inputs.hourlyTarget;
      return result("Piece profit", currency(profit), [
        { label: "Effective $/hr", value: currency(hourlyFromPiece) },
        { label: "vs hourly target", value: currency(vsTarget) },
      ]);
    }

    case "nicheTwitchSubRevenue": {
      const t1 = inputs.tier1Count * 4.99 * (inputs.partnerSplitPct / 100);
      const t2 = inputs.tier2Count * 9.99 * (inputs.partnerSplitPct / 100);
      const t3 = inputs.tier3Count * 24.99 * (inputs.partnerSplitPct / 100);
      const total = t1 + t2 + t3;
      return result("Monthly sub revenue (est.)", currency(total), [
        { label: "Tier 1 share", value: currency(t1) },
        { label: "Tier 2 share", value: currency(t2) },
        { label: "Tier 3 share", value: currency(t3) },
      ], "Excludes bits, ads, and taxes — planning estimate only.");
    }

    case "nicheEtsyDimensionalWeight": {
      const dimWeight =
        (inputs.lengthIn * inputs.widthIn * inputs.heightIn) / 139;
      const billable = Math.max(inputs.actualWeightLb, dimWeight);
      const cost = billable * inputs.ratePerLb;
      return result("Billable weight", `${number(billable, 1)} lb`, [
        { label: "Dim weight", value: `${number(dimWeight, 1)} lb` },
        { label: "Shipping cost (est.)", value: currency(cost) },
      ]);
    }

    case "nicheFoodTruckPropane": {
      const btuUsed = inputs.generatorBtuh * inputs.eventHours;
      const gallons = btuUsed / 91000;
      return result("Propane used", `${number(gallons, 1)} gal`, [
        { label: "Event hours", value: number(inputs.eventHours, 1) },
        { label: "Generator BTU/hr", value: number(inputs.generatorBtuh, 0) },
      ]);
    }

    case "nicheDjiDroneBatteryCost": {
      const perFlight = inputs.batteryCost / Math.max(1, inputs.cycleLife);
      return result("Cost per flight", currency(perFlight), [
        { label: "Battery cost", value: currency(inputs.batteryCost) },
        { label: "Rated cycles", value: number(inputs.cycleLife, 0) },
      ]);
    }

    case "nicheMobileDetailingWater": {
      const daily = inputs.carsPerDay * inputs.gallonsPerCar;
      const tank = daily * (1 + clamp(inputs.bufferPct, 0, 50) / 100);
      return result("Tank size needed", `${number(tank, 0)} gal`, [
        { label: "Daily use", value: `${number(daily, 0)} gal` },
        { label: "Cars/day", value: number(inputs.carsPerDay, 0) },
      ]);
    }

    case "nicheVendingMachineRoi": {
      const monthlyProfit =
        inputs.monthlySales - inputs.restockCost - inputs.locationFee;
      const months =
        monthlyProfit > 0 ? inputs.machineCost / monthlyProfit : Infinity;
      return result("Monthly profit", currency(monthlyProfit), [
        { label: "Machine cost", value: currency(inputs.machineCost) },
        {
          label: "Payback",
          value: months === Infinity ? "—" : `${number(months, 1)} mo`,
        },
      ]);
    }

    case "nicheCreatorPlatformFee": {
      const gross = Math.max(0, inputs.grossRevenue);
      const feePct = clamp(inputs.platformFeePct, 0, 30);
      const net = gross * (1 - feePct / 100);
      return result("Creator net (est.)", currency(net), [
        { label: "Platform fee", value: currency(gross - net) },
        { label: "Fee rate", value: `${number(feePct, 1)}%` },
      ]);
    }

    case "nicheVideo4kUpload": {
      const mb = (inputs.durationMin * 60 * inputs.bitrateMbps) / 8;
      const gb = mb / 1024;
      const uploadMin =
        inputs.uploadSpeedMbps > 0 ? (mb * 8) / inputs.uploadSpeedMbps / 60 : 0;
      return result("File size", `${number(gb, 2)} GB`, [
        { label: "Megabytes", value: number(mb, 0) },
        { label: "Upload time (est.)", value: `${number(uploadMin, 1)} min` },
      ]);
    }

    case "nicheHouseSittingRate": {
      const total =
        inputs.nights * inputs.nightlyRate +
        inputs.petFee +
        inputs.extras;
      return result("Trip total", currency(total), [
        { label: "Nights", value: number(inputs.nights, 0) },
        { label: "Per night", value: currency(inputs.nightlyRate) },
      ]);
    }

    case "nicheHydroponicPpmEc": {
      const gal = Math.max(1, inputs.reservoirGal);
      const delta = Math.max(0, inputs.targetPpm - inputs.currentPpm);
      const ml = (delta * gal) / Math.max(1, inputs.concentratePpmPerMl);
      const ec = inputs.targetPpm / 500;
      return result("Nutrient to add", `${number(ml, 0)} mL`, [
        { label: "Target EC (approx.)", value: number(ec, 2) },
        { label: "Reservoir", value: `${number(gal, 0)} gal` },
      ]);
    }

    case "nicheMelsMixVolume": {
      const cuFt =
        (inputs.bedLengthFt * inputs.bedWidthFt * (inputs.depthIn / 12));
      const each = cuFt / 3;
      return result("Total mix volume", `${number(cuFt, 2)} cu ft`, [
        { label: "Compost third", value: `${number(each, 2)} cu ft` },
        { label: "Peat third", value: `${number(each, 2)} cu ft` },
        { label: "Vermiculite third", value: `${number(each, 2)} cu ft` },
      ]);
    }

    case "nicheMicrogreensSeedDensity": {
      const grams = clamp(inputs.gramsPerTray, 10, 80);
      const trays = Math.max(1, inputs.trayCount);
      return result("Seed per tray", `${number(grams, 0)} g`, [
        { label: "Total seed", value: `${number(grams * trays, 0)} g` },
        { label: "Trays", value: number(trays, 0) },
      ]);
    }

    case "nicheVanlifeSolarBattery": {
      const wh = Math.max(0, inputs.dailyWh);
      const panelW = Math.ceil(wh / Math.max(1, inputs.peakSunHours));
      const ah = Math.ceil(wh / (12 * 0.85));
      return result("Solar array (approx.)", `${number(panelW, 0)} W`, [
        { label: "Battery bank", value: `${number(ah, 0)} Ah @ 12V` },
        { label: "Daily load", value: `${number(wh, 0)} Wh` },
      ]);
    }

    case "nicheFirewoodCordBtu": {
      const btuPerCord =
        inputs.woodType === 3 ? 15_000_000 : inputs.woodType === 2 ? 20_000_000 : 25_000_000;
      const total = btuPerCord * inputs.cords;
      return result("Heat output", `${number(total / 1_000_000, 1)}M BTU`, [
        {
          label: "Wood type",
          value: inputs.woodType === 3 ? "Softwood" : inputs.woodType === 2 ? "Mixed hardwood" : "Oak/hickory",
        },
        { label: "Cords", value: number(inputs.cords, 1) },
      ]);
    }

    case "nichePoultryFence": {
      const posts = Math.ceil(inputs.perimeterFt / Math.max(4, inputs.postSpacingFt)) + 1;
      const rolls = Math.ceil(inputs.perimeterFt / (inputs.rollWidthFt * 50));
      return result("T-posts needed", number(posts, 0), [
        { label: "Netting rolls (est.)", value: number(rolls, 0) },
        { label: "Perimeter", value: `${number(inputs.perimeterFt, 0)} ft` },
      ]);
    }

    case "nicheGrowTentCfm": {
      const cuFt =
        inputs.tentLengthFt * inputs.tentWidthFt * inputs.tentHeightFt;
      const cfm = cuFt * clamp(inputs.airChangesPerMin, 0.5, 2);
      return result("Inline fan CFM", `${number(cfm, 0)} CFM`, [
        { label: "Tent volume", value: `${number(cuFt, 0)} cu ft` },
      ]);
    }

    case "nicheRainwaterHarvesting": {
      const gal = inputs.roofSqFt * inputs.rainfallIn * 0.623 * (inputs.efficiencyPct / 100);
      return result("Harvested water", `${number(gal, 0)} gal`, [
        { label: "Roof area", value: `${number(inputs.roofSqFt, 0)} sq ft` },
        { label: "Rainfall", value: `${number(inputs.rainfallIn, 1)} in` },
      ]);
    }

    case "nicheCompostCnRatio": {
      const browns = inputs.brownParts * clamp(inputs.brownC, 100, 600);
      const greens = inputs.greenParts * clamp(inputs.greenN, 10, 40);
      const cn = greens > 0 ? browns / greens : 0;
      let status = "Balanced";
      if (cn > 35) status = "Too carbon-heavy — add greens";
      if (cn < 20) status = "Too nitrogen-heavy — add browns";
      return result("C:N ratio", number(cn, 0), [
        { label: "Status", value: status },
        { label: "Brown parts", value: number(inputs.brownParts, 0) },
        { label: "Green parts", value: number(inputs.greenParts, 0) },
      ]);
    }

    case "nicheBulkMulch": {
      const cuYd =
        (inputs.areaSqFt * (inputs.depthIn / 12)) / 27;
      const cost = cuYd * inputs.costPerCuYd;
      return result("Mulch volume", `${number(cuYd, 2)} cu yd`, [
        { label: "Estimated cost", value: currency(cost) },
        { label: "Coverage depth", value: `${number(inputs.depthIn, 0)} in` },
      ]);
    }

    case "nicheWeddingCakeTiers": {
      const servings =
        inputs.tier6In * 12 +
        inputs.tier8In * 24 +
        inputs.tier10In * 38 +
        inputs.tier12In * 56;
      return result("Total servings (Wilton est.)", number(servings, 0), [
        { label: "6\" tier servings", value: number(inputs.tier6In * 12, 0) },
        { label: "8\" tier servings", value: number(inputs.tier8In * 24, 0) },
        { label: "10\" tier servings", value: number(inputs.tier10In * 38, 0) },
      ]);
    }

    case "nicheOpenBarAlcohol": {
      const drinks =
        inputs.guests * inputs.hours * inputs.drinksPerGuestHour;
      const bottles = drinks / 5;
      return result("Total drinks", number(drinks, 0), [
        { label: "750 mL bottles (est.)", value: number(bottles, 0) },
        { label: "Guests", value: number(inputs.guests, 0) },
      ]);
    }

    case "nicheCharcuteriePerPerson": {
      const meat = inputs.guests * inputs.meatOzPerGuest;
      const cheese = inputs.guests * inputs.cheeseOzPerGuest;
      return result("Total meat", `${number(meat, 0)} oz`, [
        { label: "Total cheese", value: `${number(cheese, 0)} oz` },
        { label: "Combined", value: `${number((meat + cheese) / 16, 1)} lb` },
      ]);
    }

    case "nicheDndXpBudget": {
      const level = clamp(inputs.partyLevel, 1, 20);
      const size = clamp(inputs.partySize, 1, 8);
      const mult = [0, 1, 1.5, 2, 4][clamp(inputs.difficulty, 1, 4)] ?? 1;
      const thresholds = [
        0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000, 85000,
        100000, 120000, 140000, 165000, 195000, 225000, 265000, 305000, 355000,
      ];
      const xpPerChar = thresholds[level] ?? 0;
      const budget = xpPerChar * mult * size;
      return result("XP budget", number(budget, 0), [
        { label: "Party level", value: number(level, 0) },
        { label: "Party size", value: number(size, 0) },
        {
          label: "Difficulty",
          value: ["", "Easy", "Medium", "Hard", "Deadly"][clamp(inputs.difficulty, 1, 4)],
        },
      ]);
    }

    case "nicheTtrpgPrepTime": {
      const base = inputs.sessionHours * 30;
      const complexity = clamp(inputs.complexity, 1, 3);
      const players = clamp(inputs.playerCount, 1, 8);
      const prep = base * complexity * (1 + players * 0.05);
      return result("Prep time (est.)", `${number(prep / 60, 1)} hr`, [
        { label: "Minutes", value: number(prep, 0) },
        { label: "Session length", value: `${number(inputs.sessionHours, 1)} hr` },
      ]);
    }

    case "nicheHomebrewPrimingSugar": {
      const vol = inputs.beerVolumeGal;
      const co2 = clamp(inputs.co2Volumes, 1.5, 3.5);
      const temp = inputs.beerTempF;
      const residual = 0.85 + (temp - 32) * 0.005;
      const sugarOz = (vol * (co2 - residual) * 14.7) / 2.5;
      return result("Priming sugar", `${number(sugarOz, 1)} oz`, [
        { label: "Target CO₂ vol", value: number(co2, 1) },
        { label: "Beer volume", value: `${number(vol, 1)} gal` },
      ]);
    }

    case "nicheTelescopeFov": {
      const fovArcmin =
        (3438 * inputs.sensorWidthMm) / Math.max(1, inputs.focalLengthMm);
      const pixelScale =
        (inputs.pixelSizeUm * inputs.focalLengthMm) / 206.265;
      return result("Field of view", `${number(fovArcmin, 1)} arcmin`, [
        { label: "Pixel scale", value: `${number(pixelScale, 2)} arcsec/px` },
      ]);
    }

    case "nicheRcGearRatio": {
      const ratio = inputs.spurTeeth / Math.max(1, inputs.pinionTeeth);
      const rpm = inputs.motorKv * inputs.batteryVoltage / ratio;
      const circumference = Math.PI * inputs.tireDiameterIn;
      const mph = (rpm * circumference * 60) / 63360;
      return result("Gear ratio", number(ratio, 2), [
        { label: "Est. top speed", value: `${number(mph, 1)} mph` },
        { label: "Motor RPM (est.)", value: number(rpm, 0) },
      ]);
    }

    case "nicheAcidDyeYarn": {
      const dyeG =
        inputs.yarnWeightGrams * (clamp(inputs.dosPct, 0.5, 4) / 100);
      return result("Dye powder", `${number(dyeG, 1)} g`, [
        { label: "Yarn weight", value: `${number(inputs.yarnWeightGrams, 0)} g` },
        { label: "Depth of shade", value: `${number(inputs.dosPct, 1)}%` },
      ]);
    }

    case "nicheCoffeeRoastWeightLoss": {
      const loss = clamp(inputs.roastLossPct, 10, 25);
      const roasted = inputs.greenWeightGrams * (1 - loss / 100);
      return result("Roasted weight", `${number(roasted, 0)} g`, [
        { label: "Weight loss", value: `${number(loss, 1)}%` },
        { label: "Green weight", value: `${number(inputs.greenWeightGrams, 0)} g` },
      ]);
    }

    default:
      return null;
  }
}
