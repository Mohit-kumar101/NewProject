import type { CalcResult } from "./types";

type Inputs = Record<string, number>;

const currency = (n: number, digits = 2): string => {
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: digits,
    minimumFractionDigits: Math.min(2, digits),
  }).format(n);
};

const number = (n: number, digits = 2): string => {
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: digits,
    minimumFractionDigits: Math.min(2, digits),
  }).format(n);
};

const percent = (n: number, digits = 2): string => {
  if (!Number.isFinite(n)) return "—";
  return `${number(n, digits)}%`;
};

const compact = (n: number): string => {
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(n);
};

function result(
  primaryLabel: string,
  primaryValue: string,
  secondary: { label: string; value: string }[]
): CalcResult {
  return {
    primary: { label: primaryLabel, value: primaryValue, highlight: true },
    secondary,
  };
}

function clampNonNeg(n: number): number {
  return Number.isFinite(n) && n > 0 ? n : 0;
}

/** Net profit/loss and ROI after buy + sell trading fees. */
export function cryptoProfit(inputs: Inputs): CalcResult {
  const buyPrice = clampNonNeg(inputs.buyPrice);
  const sellPrice = clampNonNeg(inputs.sellPrice);
  const amount = clampNonNeg(inputs.amount);
  const buyFeePct = Math.max(0, inputs.buyFeePercent ?? 0);
  const sellFeePct = Math.max(0, inputs.sellFeePercent ?? 0);

  const grossBuy = buyPrice * amount;
  const buyFee = (grossBuy * buyFeePct) / 100;
  const totalCost = grossBuy + buyFee;

  const grossSell = sellPrice * amount;
  const sellFee = (grossSell * sellFeePct) / 100;
  const netProceeds = grossSell - sellFee;

  const netProfit = netProceeds - totalCost;
  const roi = totalCost > 0 ? (netProfit / totalCost) * 100 : 0;
  const breakEven = amount > 0 ? (totalCost + sellFee) / amount : 0;

  return result(
    "Net Profit / Loss",
    currency(netProfit, netProfit !== 0 && Math.abs(netProfit) < 1 ? 6 : 2),
    [
      { label: "ROI (after fees)", value: percent(roi) },
      { label: "Total Cost Basis", value: currency(totalCost) },
      { label: "Net Sale Proceeds", value: currency(netProceeds) },
      { label: "Fees Paid", value: currency(buyFee + sellFee) },
      {
        label: "Break-even Sell Price",
        value: currency(breakEven, breakEven < 1 ? 6 : 4),
      },
    ]
  );
}

/** Projected DCA accumulation with assumed constant growth. */
export function cryptoDca(inputs: Inputs): CalcResult {
  const monthly = clampNonNeg(inputs.monthlyInvestment);
  const months = Math.max(0, Math.floor(inputs.months ?? 0));
  const startingPrice = Math.max(1e-12, clampNonNeg(inputs.startingPrice) || 1);
  const annualGrowth = inputs.annualGrowth ?? 0;
  const monthlyGrowth = Math.pow(1 + annualGrowth / 100, 1 / 12) - 1;

  let price = startingPrice;
  let tokens = 0;
  let invested = 0;

  for (let m = 0; m < months; m++) {
    if (price > 0) tokens += monthly / price;
    invested += monthly;
    price *= 1 + monthlyGrowth;
  }

  const value = tokens * price;
  const avgCost = tokens > 0 ? invested / tokens : 0;
  const gain = value - invested;
  const roi = invested > 0 ? (gain / invested) * 100 : 0;

  return result("Portfolio Value", currency(value), [
    { label: "Total Invested", value: currency(invested) },
    { label: "Tokens Accumulated", value: number(tokens, 6) },
    {
      label: "Average Cost / Token",
      value: currency(avgCost, avgCost < 1 ? 6 : 4),
    },
    { label: "Ending Token Price", value: currency(price, price < 1 ? 6 : 4) },
    { label: "Gain / Loss", value: currency(gain) },
    { label: "ROI", value: percent(roi) },
  ]);
}

/** Circulating market capitalization. */
export function cryptoMarketCap(inputs: Inputs): CalcResult {
  const supply = clampNonNeg(inputs.circulatingSupply);
  const price = clampNonNeg(inputs.tokenPrice);
  const marketCap = supply * price;
  const dominanceShare = Math.min(100, Math.max(0, inputs.btcDominanceShare ?? 0));
  const impliedBtcCap =
    dominanceShare > 0 ? marketCap / (dominanceShare / 100) : NaN;

  return result("Market Cap", currency(marketCap, 0), [
    { label: "Compact", value: compact(marketCap) },
    { label: "Circulating Supply", value: number(supply, 0) },
    {
      label: "Price / Token",
      value: currency(price, price < 1 ? 6 : 4),
    },
    {
      label: "Implied Total Crypto Cap (if dominance % set)",
      value: Number.isFinite(impliedBtcCap) ? currency(impliedBtcCap, 0) : "—",
    },
  ]);
}

/** Fully diluted valuation from max supply. */
export function cryptoFdv(inputs: Inputs): CalcResult {
  const maxSupply = clampNonNeg(inputs.maxSupply);
  const circulating = clampNonNeg(inputs.circulatingSupply);
  const price = clampNonNeg(inputs.tokenPrice);
  const fdv = maxSupply * price;
  const circCap = circulating * price;
  const dilutionGap = fdv - circCap;
  const unlockedPct = maxSupply > 0 ? (circulating / maxSupply) * 100 : 0;

  return result("Fully Diluted Valuation", currency(fdv, 0), [
    { label: "Compact FDV", value: compact(fdv) },
    { label: "Circulating Market Cap", value: currency(circCap, 0) },
    { label: "Dilution Gap (FDV − Cap)", value: currency(dilutionGap, 0) },
    { label: "Supply Unlocked", value: percent(unlockedPct, 1) },
    {
      label: "FDV / Circ Cap Multiple",
      value: circCap > 0 ? `${number(fdv / circCap, 2)}×` : "—",
    },
  ]);
}

/** Reverse-engineer token price from target market cap or FDV. */
export function cryptoTokenPrice(inputs: Inputs): CalcResult {
  const targetValuation = clampNonNeg(inputs.targetValuation);
  const supply = Math.max(1e-12, clampNonNeg(inputs.supplyBase) || 1);
  const price = targetValuation / supply;
  const mode = inputs.valuationMode >= 0.5 ? "FDV" : "Market Cap";

  return result(
    "Implied Token Price",
    currency(price, price < 0.01 ? 8 : price < 1 ? 6 : 4),
    [
      { label: "Valuation Basis", value: mode },
      { label: "Target Valuation", value: currency(targetValuation, 0) },
      { label: "Supply Used", value: number(supply, 0) },
      {
        label: "Price @ 2× Valuation",
        value: currency(price * 2, price < 0.01 ? 8 : 4),
      },
      {
        label: "Price @ 0.5× Valuation",
        value: currency(price * 0.5, price < 0.01 ? 8 : 4),
      },
    ]
  );
}

/** Projects circulating supply with cliff + linear vesting + emissions. */
export function cryptoTokenomics(inputs: Inputs): CalcResult {
  const totalSupply = clampNonNeg(inputs.totalSupply);
  const tgeCirculating = clampNonNeg(inputs.tgeCirculating);
  const vestedAllocation = clampNonNeg(inputs.vestedAllocation);
  const cliffMonths = Math.max(0, Math.floor(inputs.cliffMonths ?? 0));
  const vestingMonths = Math.max(1, Math.floor(inputs.vestingMonths ?? 1));
  const monthlyEmission = Math.max(0, inputs.monthlyEmission ?? 0);
  const months = Math.max(0, Math.floor(inputs.projectionMonths ?? 0));

  let vestedUnlocked = 0;
  if (months > cliffMonths) {
    const elapsed = Math.min(vestingMonths, months - cliffMonths);
    vestedUnlocked = (vestedAllocation * elapsed) / vestingMonths;
  }

  const emissions = monthlyEmission * months;
  const circulating = Math.min(
    totalSupply,
    tgeCirculating + vestedUnlocked + emissions
  );
  const locked = Math.max(0, totalSupply - circulating);
  const inflationFromTge =
    tgeCirculating > 0
      ? ((circulating - tgeCirculating) / tgeCirculating) * 100
      : 0;

  return result("Projected Circulating Supply", number(circulating, 0), [
    { label: "Locked / Uncirculating", value: number(locked, 0) },
    {
      label: "% of Max Supply Circulating",
      value: percent(totalSupply > 0 ? (circulating / totalSupply) * 100 : 0, 1),
    },
    { label: "Vested Unlocked", value: number(vestedUnlocked, 0) },
    { label: "Emissions Released", value: number(emissions, 0) },
    {
      label: "Supply Expansion vs TGE",
      value: percent(inflationFromTge, 1),
    },
  ]);
}

/** Constant-product AMM pool share and swap impact (x·y=k). */
export function cryptoLiquidity(inputs: Inputs): CalcResult {
  const reserveToken = Math.max(1e-12, clampNonNeg(inputs.reserveToken) || 1);
  const reserveQuote = Math.max(1e-12, clampNonNeg(inputs.reserveQuote) || 1);
  const lpDepositToken = clampNonNeg(inputs.lpDepositToken);
  const swapTokenIn = clampNonNeg(inputs.swapTokenIn);
  const feeBps = Math.max(0, inputs.poolFeeBps ?? 30);

  const k = reserveToken * reserveQuote;
  const spotPrice = reserveQuote / reserveToken;

  // LP share assuming proportional deposit matched at spot
  const matchedQuote = lpDepositToken * spotPrice;
  const newToken = reserveToken + lpDepositToken;
  const newQuote = reserveQuote + matchedQuote;
  const poolShare =
    newToken > 0 ? (lpDepositToken / newToken) * 100 : 0;

  // Sell tokenIn for quote with fee
  const feeMult = 1 - feeBps / 10_000;
  const effectiveIn = swapTokenIn * feeMult;
  let quoteOut = 0;
  let priceImpact = 0;
  let execPrice = spotPrice;

  if (effectiveIn > 0) {
    const tokenAfter = reserveToken + effectiveIn;
    const quoteAfter = k / tokenAfter;
    quoteOut = Math.max(0, reserveQuote - quoteAfter);
    execPrice = quoteOut / swapTokenIn;
    priceImpact = spotPrice > 0 ? ((spotPrice - execPrice) / spotPrice) * 100 : 0;
  }

  return result("Spot Price (Quote / Token)", currency(spotPrice, spotPrice < 1 ? 6 : 4), [
    { label: "Constant Product (k)", value: compact(k) },
    { label: "Your LP Pool Share", value: percent(poolShare, 4) },
    {
      label: "Matched Quote Deposit",
      value: currency(matchedQuote),
    },
    {
      label: "Swap Output (Quote)",
      value: currency(quoteOut, quoteOut < 1 ? 6 : 2),
    },
    { label: "Execution Price", value: currency(execPrice, execPrice < 1 ? 6 : 4) },
    { label: "Price Impact", value: percent(priceImpact, 3) },
  ]);
}

/** Compounding staking rewards across common intervals. */
export function cryptoStaking(inputs: Inputs): CalcResult {
  const principal = clampNonNeg(inputs.principal);
  const apr = Math.max(0, inputs.aprPercent ?? 0);
  const years = Math.max(0, inputs.years ?? 0);
  // Slider 1–4: Yearly / Monthly / Weekly / Daily
  const freqLevel = Math.min(4, Math.max(1, Math.round(inputs.compoundFrequency ?? 4)));
  const freqMap: Record<number, { n: number; label: string }> = {
    1: { n: 1, label: "Yearly" },
    2: { n: 12, label: "Monthly" },
    3: { n: 52, label: "Weekly" },
    4: { n: 365, label: "Daily" },
  };
  const { n, label: freqLabel } = freqMap[freqLevel];

  const r = apr / 100;
  const finalBalance =
    n > 0 && years > 0
      ? principal * Math.pow(1 + r / n, n * years)
      : principal;
  const earnings = finalBalance - principal;
  const simple = principal * r * years;

  const periods: { label: string; n: number }[] = [
    { label: "Daily", n: 365 },
    { label: "Weekly", n: 52 },
    { label: "Monthly", n: 12 },
    { label: "Yearly", n: 1 },
  ];

  const comparisons = periods.map((p) => {
    const bal = principal * Math.pow(1 + r / p.n, p.n * years);
    return { label: `${p.label} Compound Balance`, value: currency(bal) };
  });

  return result("Ending Balance", currency(finalBalance), [
    { label: "Total Rewards", value: currency(earnings) },
    { label: "Selected Compounding", value: freqLabel },
    { label: "Simple Interest (no compound)", value: currency(simple) },
    { label: "Effective Multiple", value: `${number(principal > 0 ? finalBalance / principal : 0, 3)}×` },
    ...comparisons,
  ]);
}

/** General ROI and annualized (CAGR) performance. */
export function cryptoRoi(inputs: Inputs): CalcResult {
  const initial = clampNonNeg(inputs.initialValue);
  const final = clampNonNeg(inputs.finalValue);
  const years = Math.max(0, inputs.holdingYears ?? 0);
  const days = Math.max(0, inputs.holdingDays ?? 0);
  const totalYears = years + days / 365;

  const profit = final - initial;
  const roi = initial > 0 ? (profit / initial) * 100 : 0;
  const cagr =
    initial > 0 && final > 0 && totalYears > 0
      ? (Math.pow(final / initial, 1 / totalYears) - 1) * 100
      : totalYears === 0
        ? roi
        : NaN;

  return result("Total ROI", percent(roi), [
    { label: "Profit / Loss", value: currency(profit) },
    {
      label: "Annualized ROI (CAGR)",
      value: Number.isFinite(cagr) ? percent(cagr) : "—",
    },
    {
      label: "Holding Period",
      value:
        totalYears >= 1
          ? `${number(totalYears, 2)} years`
          : `${number(totalYears * 365, 0)} days`,
    },
    { label: "Initial Value", value: currency(initial) },
    { label: "Final Value", value: currency(final) },
  ]);
}

/**
 * Rough token-launch budget: chain deploy + contract + liquidity + audit + go-to-market.
 * blockchainTier: 1=L2/cheap, 2=Solana/alt, 3=Ethereum mainnet-ish defaults for deploy line.
 */
export function cryptoTokenLaunchCost(inputs: Inputs): CalcResult {
  const tier = Math.min(3, Math.max(1, Math.round(inputs.blockchainTier ?? 2)));
  const deployBase = tier === 1 ? 50 : tier === 2 ? 500 : 2500;
  const deployOverride = inputs.deployCost;
  const deploy =
    deployOverride !== undefined && deployOverride > 0
      ? deployOverride
      : deployBase;

  const contractDev = clampNonNeg(inputs.contractDevCost);
  const liquidity = clampNonNeg(inputs.liquidityBudget);
  const audit = clampNonNeg(inputs.auditCost);
  const marketing = clampNonNeg(inputs.marketingBudget);
  const legalMisc = clampNonNeg(inputs.legalMiscCost);
  const contingencyPct = Math.max(0, inputs.contingencyPercent ?? 10);

  const subtotal =
    deploy + contractDev + liquidity + audit + marketing + legalMisc;
  const contingency = (subtotal * contingencyPct) / 100;
  const total = subtotal + contingency;

  const tierLabel =
    tier === 1
      ? "Low-cost L2 / sidechain"
      : tier === 2
        ? "Mid-cost (e.g. Solana / alt L1)"
        : "High-cost (e.g. Ethereum mainnet)";

  return result("Estimated Launch Budget", currency(total, 0), [
    { label: "Blockchain Profile", value: tierLabel },
    { label: "Deploy / Gas Estimate", value: currency(deploy, 0) },
    { label: "Smart Contract Development", value: currency(contractDev, 0) },
    { label: "Initial Liquidity", value: currency(liquidity, 0) },
    { label: "Security Audit", value: currency(audit, 0) },
    { label: "Marketing / Launch Ops", value: currency(marketing, 0) },
    { label: "Legal & Misc", value: currency(legalMisc, 0) },
    {
      label: `Contingency (${number(contingencyPct, 0)}%)`,
      value: currency(contingency, 0),
    },
    { label: "Subtotal (before contingency)", value: currency(subtotal, 0) },
  ]);
}

export const CRYPTO_FORMULA_TYPES = [
  "cryptoProfit",
  "cryptoDca",
  "cryptoMarketCap",
  "cryptoFdv",
  "cryptoTokenPrice",
  "cryptoTokenomics",
  "cryptoLiquidity",
  "cryptoStaking",
  "cryptoRoi",
  "cryptoTokenLaunchCost",
] as const;

export type CryptoFormulaType = (typeof CRYPTO_FORMULA_TYPES)[number];

export function runCryptoCalculation(
  formulaType: string,
  inputs: Inputs
): CalcResult | null {
  switch (formulaType) {
    case "cryptoProfit":
      return cryptoProfit(inputs);
    case "cryptoDca":
      return cryptoDca(inputs);
    case "cryptoMarketCap":
      return cryptoMarketCap(inputs);
    case "cryptoFdv":
      return cryptoFdv(inputs);
    case "cryptoTokenPrice":
      return cryptoTokenPrice(inputs);
    case "cryptoTokenomics":
      return cryptoTokenomics(inputs);
    case "cryptoLiquidity":
      return cryptoLiquidity(inputs);
    case "cryptoStaking":
      return cryptoStaking(inputs);
    case "cryptoRoi":
      return cryptoRoi(inputs);
    case "cryptoTokenLaunchCost":
      return cryptoTokenLaunchCost(inputs);
    default:
      return null;
  }
}

/** Short public path segment → full tools slug (for /crypto/* redirects). */
export const CRYPTO_SHORT_SLUGS: Record<string, string> = {
  "profit-calculator": "crypto-profit-calculator",
  "dca-calculator": "crypto-dca-calculator",
  "market-cap-calculator": "crypto-market-cap-calculator",
  "fdv-calculator": "crypto-fdv-calculator",
  "token-price-calculator": "crypto-token-price-calculator",
  "tokenomics-calculator": "crypto-tokenomics-calculator",
  "liquidity-calculator": "crypto-liquidity-calculator",
  "staking-calculator": "crypto-staking-calculator",
  "roi-calculator": "crypto-roi-calculator",
  "token-launch-cost-calculator": "crypto-token-launch-cost-calculator",
};

export const CRYPTO_CATEGORY = "Crypto & Digital Assets";

/** Public path for a calculator (crypto short URLs when available). */
export function getToolHref(slug: string): string {
  const short = Object.entries(CRYPTO_SHORT_SLUGS).find(
    ([, full]) => full === slug
  )?.[0];
  return short ? `/crypto/${short}` : `/tools/${slug}`;
}
