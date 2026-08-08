import explanationsData from "../../data/tool-explanations.json";
import type { Calculator, ToolExplanationContent } from "./types";

const explanations = explanationsData as Record<string, ToolExplanationContent>;

const FALLBACK: ToolExplanationContent = {
  formula: "Result = f(inputs)",
  summary:
    "This calculator maps your inputs through a domain-specific model and updates results live in the browser.",
  variables: [
    {
      symbol: "inputs",
      name: "Your inputs",
      description: "Values you adjust in the Inputs panel.",
    },
  ],
  notes: ["Estimates are for planning guidance only—not professional advice."],
};

/**
 * Educational formula + variable definitions for a calculator.
 * Content is keyed by formulaType with curated coverage for most tools.
 */
export function getToolExplanation(
  calculator: Calculator
): ToolExplanationContent {
  return explanations[calculator.formulaType] ?? FALLBACK;
}
