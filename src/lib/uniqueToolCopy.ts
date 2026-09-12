import type {
  Calculator,
  CalculatorFaq,
  CalculatorInput,
  ToolExplanationContent,
} from "@/lib/types";

export type CopyDomain =
  | "health"
  | "trade"
  | "tech"
  | "craft"
  | "money"
  | "life"
  | "ops";

export function domainForCategory(category: string): CopyDomain {
  const c = category.toLowerCase();
  if (c.includes("health") || c.includes("fitness") || c.includes("wellness")) {
    return "health";
  }
  if (
    c.includes("hvac") ||
    c.includes("plumb") ||
    c.includes("electric") ||
    c.includes("roof") ||
    c.includes("construction") ||
    c.includes("landscape") ||
    c.includes("mason") ||
    c.includes("trade")
  ) {
    return "trade";
  }
  if (
    c.includes("network") ||
    c.includes("software") ||
    c.includes("cloud") ||
    c.includes("electronic") ||
    c.includes("seo") ||
    c.includes("digital tech")
  ) {
    return "tech";
  }
  if (
    c.includes("crafter") ||
    c.includes("homestead") ||
    c.includes("pet") ||
    c.includes("event") ||
    c.includes("gig")
  ) {
    return "craft";
  }
  if (
    c.includes("life") ||
    c.includes("calendar") ||
    c.includes("relationship") ||
    c.includes("curiosity")
  ) {
    return "life";
  }
  if (
    c.includes("invest") ||
    c.includes("loan") ||
    c.includes("money") ||
    c.includes("retir") ||
    c.includes("tax") ||
    c.includes("freelance")
  ) {
    return "money";
  }
  return "ops";
}

function leaveOut(domain: CopyDomain, formula: string): string {
  switch (domain) {
    case "health":
      return `The formula (${formula}) does not see labs, medications, sleep, or injury history. A clinician does.`;
    case "trade":
      return `The takeoff (${formula}) ignores waste, code, and what you find when you open the wall. Measure twice on site.`;
    case "tech":
      return `Closed-form math (${formula}) misses idle time, egress, packet loss, and reserved capacity on the real bill.`;
    case "craft":
      return `Volume math (${formula}) does not include your waste, test pour, or the batch that cures wrong. Add a buffer.`;
    case "money":
      return `Compounding here (${formula}) assumes the deposit and the return you typed. Jobs, taxes, and a bad decade are not in the slider.`;
    case "life":
      return `The count (${formula}) is calendar arithmetic. Health, luck, and whether you keep the habit are not fields.`;
    default:
      return `The estimate (${formula}) is for a meeting, not a signed forecast. Check the invoice or the contract.`;
  }
}

function lastStep(domain: CopyDomain): string {
  switch (domain) {
    case "health":
      return "If this number would change a drug, a diet, or a return-to-play call, take it to a clinician. The page never examined you.";
    case "trade":
      return "Buy materials after you walk the job. This is a first-pass quantity, not a purchase order.";
    case "tech":
      return "Compare the result to last month’s invoice or a vendor calculator before you commit capacity.";
    case "craft":
      return "Order a little extra. Resin, fabric, and clay do not read a spreadsheet.";
    case "money":
      return "Use it to compare habits, not to book a retirement party. Change one assumption and see which year moves.";
    case "life":
      return "Read it once, then decide what a Saturday or a deposit is worth. The number will not decide for you.";
    default:
      return "Change one input and see what actually moves the answer before you act on it.";
  }
}

export function uniqueHowToUse(spec: {
  inputLabels: string[];
  formulaSummary: string;
  example: string;
  domain: CopyDomain;
}): string[] {
  const labels = spec.inputLabels.filter(
    (label) =>
      !/use the fields|workspace controls|placeholder|focus/i.test(label)
  );
  const enter =
    labels.length > 0
      ? `Enter ${labels.slice(0, 3).join(", ")}${
          labels.length > 3 ? ", then the remaining fields" : ""
        }. Use the values you have, not a catalog average, unless that is all you know.`
      : "Fill the fields with your own numbers. Sample defaults are only there so the page is not blank.";
  return [
    enter,
    spec.formulaSummary,
    `Worked case: ${spec.example}`,
    lastStep(spec.domain),
  ];
}

export function uniqueFaqs(spec: {
  title: string;
  formulaSummary: string;
  example: string;
  domain: CopyDomain;
}): CalculatorFaq[] {
  const short = spec.title.replace(/\s+calculator$/i, "").toLowerCase();
  return [
    {
      question: `How is ${short} calculated on this page?`,
      answer: spec.formulaSummary,
    },
    {
      question: `What is a realistic example for ${short}?`,
      answer: spec.example,
    },
    {
      question: `What does this ${short} leave out?`,
      answer: leaveOut(spec.domain, spec.formulaSummary),
    },
  ];
}

/** Context under the widget — formula + example only, no “free instant” stamp. */
export const UNIQUE_SEO_CONTEXT =
  "{{formulaSummary}} Worked numbers: {{example}}";

export function explanationFromCalculator(
  calculator: Calculator
): ToolExplanationContent {
  const formula =
    calculator.formulaSummary?.trim() ||
    `${calculator.title} is computed from the fields on this page.`;
  const summary =
    calculator.realWorldExample?.trim() ||
    calculator.description.trim() ||
    "Results update as you change inputs.";
  const variables = calculator.inputs
    .filter((input) => !/placeholder|focus|workspace/i.test(input.id))
    .slice(0, 8)
    .map((input) => ({
      symbol: input.id,
      name: input.label,
      description: `The “${input.label}” field. Default ${input.defaultValue}; typical range ${input.min}–${input.max}.`,
    }));
  if (variables.length === 0) {
    variables.push({
      symbol: "inputs",
      name: "Your numbers",
      description:
        calculator.description ||
        "Values you type in the workspace. Each change recalculates immediately.",
    });
  }
  const domain = domainForCategory(calculator.category);
  return {
    formula,
    summary,
    variables,
    notes: [
      leaveOut(domain, formula),
      "Nothing here is uploaded for the calculation itself.",
    ],
  };
}

export function uniqueKeywordUseCases(calculator: Calculator): string[] {
  const example = calculator.realWorldExample?.trim();
  const formula = calculator.formulaSummary?.trim();
  const labels = calculator.inputs
    .map((input) => input.label.toLowerCase())
    .filter((label) => !/placeholder|focus|workspace/i.test(label))
    .slice(0, 2);
  const cases = [
    calculator.description.replace(/\s+/g, " ").trim(),
    example
      ? `Sanity-check with this case: ${example}`
      : `Change ${labels[0] || "one input"} and watch the result move.`,
    formula
      ? `The relationship is: ${formula}`
      : `Compare two ${calculator.category.toLowerCase()} scenarios before you commit.`,
  ];
  return cases.filter(Boolean);
}

export function uniqueKeywordFeatures(calculator: Calculator): string[] {
  const labels = calculator.inputs
    .filter((input) => !/placeholder|focus|workspace/i.test(input.id))
    .slice(0, 4)
    .map((input) => input.label);
  return [
    labels.length
      ? `Fields: ${labels.join(", ")}`
      : "Workspace controls for this exact question",
    calculator.formulaSummary || calculator.description,
    calculator.realWorldExample
      ? `Example on the page: ${calculator.realWorldExample}`
      : "Live estimate you can check against the formula",
  ];
}

export function uniqueKeywordRegions(calculator: Calculator): string[] {
  return [
    `${calculator.category}: the example on this page uses the same formula as the widget.`,
  ];
}

export function inputLabelsOf(inputs: CalculatorInput[]): string[] {
  return inputs.map((input) => input.label);
}
