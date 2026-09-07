import { runCryptoCalculation } from "@/lib/cryptoFormulas";

export type TokenomicsInputs = {
  totalSupply: number;
  tgeCirculating: number;
  vestedAllocation: number;
  cliffMonths: number;
  vestingMonths: number;
  monthlyEmission: number;
  projectionMonths: number;
};

export type TokenomicsPoint = {
  month: number;
  circulating: number;
  locked: number;
  vestedUnlocked: number;
  emissions: number;
};

function clampNonNeg(n: number): number {
  return Number.isFinite(n) && n > 0 ? n : 0;
}

export function projectTokenomicsSeries(
  inputs: TokenomicsInputs
): TokenomicsPoint[] {
  const totalSupply = clampNonNeg(inputs.totalSupply);
  const tgeCirculating = clampNonNeg(inputs.tgeCirculating);
  const vestedAllocation = clampNonNeg(inputs.vestedAllocation);
  const cliffMonths = Math.max(0, Math.floor(inputs.cliffMonths ?? 0));
  const vestingMonths = Math.max(1, Math.floor(inputs.vestingMonths ?? 1));
  const monthlyEmission = Math.max(0, inputs.monthlyEmission ?? 0);
  const months = Math.max(0, Math.floor(inputs.projectionMonths ?? 0));

  const points: TokenomicsPoint[] = [];
  for (let m = 0; m <= months; m++) {
    let vestedUnlocked = 0;
    if (m > cliffMonths) {
      const elapsed = Math.min(vestingMonths, m - cliffMonths);
      vestedUnlocked = (vestedAllocation * elapsed) / vestingMonths;
    }
    const emissions = monthlyEmission * m;
    const circulating = Math.min(
      totalSupply,
      tgeCirculating + vestedUnlocked + emissions
    );
    points.push({
      month: m,
      circulating,
      locked: Math.max(0, totalSupply - circulating),
      vestedUnlocked,
      emissions,
    });
  }
  return points;
}

export function scenarioSummary(
  formulaType: string,
  inputs: Record<string, number>
) {
  return runCryptoCalculation(formulaType, inputs);
}

export function inputsToCsv(
  title: string,
  inputs: Record<string, number>,
  results: { label: string; value: string }[]
): string {
  const lines = [
    `"Tool","${title.replace(/"/g, '""')}"`,
    "",
    '"Input","Value"',
    ...Object.entries(inputs).map(
      ([k, v]) => `"${k.replace(/"/g, '""')}",${v}`
    ),
    "",
    '"Result","Value"',
    ...results.map(
      (r) =>
        `"${r.label.replace(/"/g, '""')}","${String(r.value).replace(/"/g, '""')}"`
    ),
  ];
  return lines.join("\n");
}

export function downloadTextFile(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
