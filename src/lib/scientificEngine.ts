import { all, create, type MathJsInstance } from "mathjs";

export type AngleMode = "deg" | "rad";

export type EvalSuccess = {
  ok: true;
  value: number;
  formatted: string;
};

export type EvalFailure = {
  ok: false;
  error: string;
};

export type EvalResult = EvalSuccess | EvalFailure;

const baseConfig = {
  number: "number" as const,
  precision: 64,
};

function buildMath(mode: AngleMode): MathJsInstance {
  const math = create(all, baseConfig);

  if (mode === "deg") {
    math.import(
      {
        sin: (x: number) => Math.sin((x * Math.PI) / 180),
        cos: (x: number) => Math.cos((x * Math.PI) / 180),
        tan: (x: number) => Math.tan((x * Math.PI) / 180),
        asin: (x: number) => (Math.asin(x) * 180) / Math.PI,
        acos: (x: number) => (Math.acos(x) * 180) / Math.PI,
        atan: (x: number) => (Math.atan(x) * 180) / Math.PI,
      },
      { override: true }
    );
  }

  return math;
}

const mathByMode: Record<AngleMode, MathJsInstance> = {
  deg: buildMath("deg"),
  rad: buildMath("rad"),
};

/** Convert display expression into a mathjs-evaluable string. */
export function normalizeExpression(raw: string): string {
  let expr = raw.trim();
  if (!expr) return "";

  expr = expr
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/π/g, "pi")
    .replace(/√/g, "sqrt")
    .replace(/∛/g, "cbrt")
    .replace(/−/g, "-")
    // Postfix percent only (e.g. 25%), not binary modulo (e.g. 10 % 3)
    .replace(/(\d+(?:\.\d+)?)%(?!\s*\d)/g, "($1/100)");

  // Allow trailing operators to be stripped for live preview attempts
  expr = expr.replace(/[+\-*/^]+$/g, "");

  return expr;
}

function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return "Error";
  if (Object.is(value, -0)) return "0";

  const abs = Math.abs(value);
  if (abs !== 0 && (abs >= 1e12 || abs < 1e-9)) {
    return value.toExponential(8).replace(/\.?0+e/, "e");
  }

  const fixed = Number(value.toPrecision(12));
  return String(fixed);
}

function extractNumeric(value: unknown): number | null {
  if (typeof value === "number") return value;
  if (typeof value === "bigint") return Number(value);
  if (value && typeof value === "object" && "toNumber" in value) {
    try {
      return (value as { toNumber: () => number }).toNumber();
    } catch {
      return null;
    }
  }
  const asNumber = Number(value);
  return Number.isFinite(asNumber) ? asNumber : null;
}

export function evaluateExpression(
  raw: string,
  mode: AngleMode
): EvalResult {
  const prepared = normalizeExpression(raw);
  if (!prepared) {
    return { ok: false, error: "Enter an expression" };
  }

  try {
    const math = mathByMode[mode];
    const result = math.evaluate(prepared);
    const numeric = extractNumeric(result);

    if (numeric === null) {
      return { ok: false, error: "Unsupported result" };
    }
    if (!Number.isFinite(numeric)) {
      return { ok: false, error: "Math error (e.g. division by zero)" };
    }

    return {
      ok: true,
      value: numeric,
      formatted: formatNumber(numeric),
    };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Invalid expression";
    if (/divide by zero|infinity|undefined/i.test(message)) {
      return { ok: false, error: "Cannot divide by zero" };
    }
    return { ok: false, error: "Invalid expression" };
  }
}

export function formatDisplayValue(value: number): string {
  return formatNumber(value);
}
