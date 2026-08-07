"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  evaluateExpression,
  formatDisplayValue,
  type AngleMode,
} from "@/lib/scientificEngine";

type HistoryItem = {
  id: string;
  expression: string;
  result: string;
};

type KeyTone = "num" | "op" | "fn" | "mem" | "eq" | "danger";

type KeyDef = {
  label: ReactNode;
  ariaLabel: string;
  action: () => void;
  tone?: KeyTone;
  span?: 2;
  className?: string;
};

const MAX_HISTORY = 40;

function toneClass(tone: KeyTone = "num") {
  switch (tone) {
    case "op":
      return "border-[var(--border)] bg-[color-mix(in_srgb,var(--accent)_12%,var(--surface))] text-[var(--accent-strong)] hover:bg-[color-mix(in_srgb,var(--accent)_20%,var(--surface))]";
    case "fn":
      return "border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]";
    case "mem":
      return "border-[var(--border)] bg-[color-mix(in_srgb,#2979FF_10%,var(--surface))] text-[var(--muted)] hover:text-[var(--foreground)]";
    case "eq":
      return "border-transparent bg-gradient-to-br from-[#00E5FF] to-[#2979FF] text-white shadow-[0_10px_28px_-14px_rgba(0,229,255,0.8)] hover:brightness-105";
    case "danger":
      return "border-[var(--border)] bg-[color-mix(in_srgb,#ff5a5a_12%,var(--surface))] text-[#d64545] hover:bg-[color-mix(in_srgb,#ff5a5a_20%,var(--surface))] dark:text-[#ff8a8a]";
    default:
      return "border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] hover:border-[var(--accent)]";
  }
}

export function ScientificCalculator() {
  const liveId = useId();
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("0");
  const [error, setError] = useState("");
  const [angleMode, setAngleMode] = useState<AngleMode>("deg");
  const [inv, setInv] = useState(false);
  const [memory, setMemory] = useState(0);
  const [hasMemory, setHasMemory] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyOpen, setHistoryOpen] = useState(true);
  const [justEvaluated, setJustEvaluated] = useState(false);

  const memoryLabel = hasMemory ? formatDisplayValue(memory) : "Empty";

  const preview = useMemo(() => {
    if (!expression.trim()) return null;
    return evaluateExpression(expression, angleMode);
  }, [expression, angleMode]);

  const append = useCallback(
    (chunk: string) => {
      setError("");
      setExpression((prev) => {
        if (justEvaluated && /^[0-9.]/.test(chunk)) {
          setJustEvaluated(false);
          return chunk;
        }
        if (justEvaluated && chunk === "(") {
          setJustEvaluated(false);
          return chunk;
        }
        setJustEvaluated(false);
        return `${prev}${chunk}`;
      });
    },
    [justEvaluated]
  );

  const clearAll = useCallback(() => {
    setExpression("");
    setResult("0");
    setError("");
    setJustEvaluated(false);
  }, []);

  const backspace = useCallback(() => {
    setError("");
    setJustEvaluated(false);
    setExpression((prev) => prev.slice(0, -1));
  }, []);

  const evaluate = useCallback(() => {
    const source = expression.trim() || result;
    const outcome = evaluateExpression(source, angleMode);
    if (!outcome.ok) {
      setError(outcome.error);
      setResult("Error");
      return;
    }

    setError("");
    setResult(outcome.formatted);
    setJustEvaluated(true);
    setExpression(outcome.formatted);
    setHistory((prev) => {
      const next: HistoryItem = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        expression: source,
        result: outcome.formatted,
      };
      return [next, ...prev].slice(0, MAX_HISTORY);
    });
  }, [angleMode, expression, result]);

  const currentValue = useCallback(() => {
    const source = expression.trim() || result;
    const outcome = evaluateExpression(source, angleMode);
    if (outcome.ok) return outcome.value;
    const asNumber = Number(result);
    return Number.isFinite(asNumber) ? asNumber : 0;
  }, [angleMode, expression, result]);

  const toggleSign = useCallback(() => {
    setError("");
    setJustEvaluated(false);
    setExpression((prev) => {
      if (!prev) return "-";
      const match = prev.match(/(-?\d*\.?\d+)(?!.*\d)/);
      if (!match || match.index === undefined) {
        return prev.startsWith("-") ? prev.slice(1) : `-(${prev})`;
      }
      const start = match.index;
      const token = match[0];
      const negated = token.startsWith("-") ? token.slice(1) : `-${token}`;
      return `${prev.slice(0, start)}${negated}`;
    });
  }, []);

  const wrapFn = useCallback(
    (name: string) => {
      setError("");
      if (justEvaluated && expression) {
        setExpression(`${name}(${expression})`);
        setJustEvaluated(false);
        return;
      }
      append(`${name}(`);
    },
    [append, expression, justEvaluated]
  );

  const applyUnary = useCallback(
    (builder: (value: string) => string) => {
      setError("");
      const base = expression.trim() || result;
      setExpression(builder(base.includes(" ") ? `(${base})` : base));
      setJustEvaluated(false);
    },
    [expression, result]
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      const { key } = event;
      if (/^[0-9]$/.test(key)) {
        event.preventDefault();
        append(key);
        return;
      }

      const opMap: Record<string, string> = {
        "+": "+",
        "-": "−",
        "*": "×",
        "/": "÷",
        "^": "^",
        "%": "%",
        ".": ".",
        "(": "(",
        ")": ")",
      };

      if (key in opMap) {
        event.preventDefault();
        append(opMap[key]);
        return;
      }

      if (key === "Enter" || key === "=") {
        event.preventDefault();
        evaluate();
        return;
      }

      if (key === "Backspace") {
        event.preventDefault();
        backspace();
        return;
      }

      if (key === "Escape") {
        event.preventDefault();
        clearAll();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [append, backspace, clearAll, evaluate]);

  const keys: KeyDef[] = [
    {
      label: "MC",
      ariaLabel: "Memory clear",
      tone: "mem",
      action: () => {
        setMemory(0);
        setHasMemory(false);
      },
    },
    {
      label: "MR",
      ariaLabel: "Memory recall",
      tone: "mem",
      action: () => {
        if (!hasMemory) return;
        append(formatDisplayValue(memory));
      },
    },
    {
      label: "M+",
      ariaLabel: "Memory add",
      tone: "mem",
      action: () => {
        const value = currentValue();
        setMemory((prev) => prev + value);
        setHasMemory(true);
      },
    },
    {
      label: "M−",
      ariaLabel: "Memory subtract",
      tone: "mem",
      action: () => {
        const value = currentValue();
        setMemory((prev) => prev - value);
        setHasMemory(true);
      },
    },
    {
      label: "MS",
      ariaLabel: "Memory store",
      tone: "mem",
      action: () => {
        setMemory(currentValue());
        setHasMemory(true);
      },
    },
    {
      label: inv ? "sin⁻¹" : "sin",
      ariaLabel: inv ? "Arcsine" : "Sine",
      tone: "fn",
      action: () => wrapFn(inv ? "asin" : "sin"),
    },
    {
      label: inv ? "cos⁻¹" : "cos",
      ariaLabel: inv ? "Arccosine" : "Cosine",
      tone: "fn",
      action: () => wrapFn(inv ? "acos" : "cos"),
    },
    {
      label: inv ? "tan⁻¹" : "tan",
      ariaLabel: inv ? "Arctangent" : "Tangent",
      tone: "fn",
      action: () => wrapFn(inv ? "atan" : "tan"),
    },
    {
      label: "ln",
      ariaLabel: "Natural log",
      tone: "fn",
      action: () => wrapFn("log"),
    },
    {
      label: "log",
      ariaLabel: "Log base 10",
      tone: "fn",
      action: () => wrapFn("log10"),
    },
    {
      label: "x²",
      ariaLabel: "Square",
      tone: "fn",
      action: () => applyUnary((v) => `(${v})^2`),
    },
    {
      label: "x³",
      ariaLabel: "Cube",
      tone: "fn",
      action: () => applyUnary((v) => `(${v})^3`),
    },
    {
      label: "xʸ",
      ariaLabel: "Power",
      tone: "fn",
      action: () => append("^"),
    },
    {
      label: "√",
      ariaLabel: "Square root",
      tone: "fn",
      action: () => wrapFn("sqrt"),
    },
    {
      label: "∛",
      ariaLabel: "Cube root",
      tone: "fn",
      action: () => wrapFn("cbrt"),
    },
    {
      label: "ʸ√x",
      ariaLabel: "Nth root",
      tone: "fn",
      action: () => append("nthRoot("),
    },
    {
      label: "eˣ",
      ariaLabel: "e to the x",
      tone: "fn",
      action: () => wrapFn("exp"),
    },
    {
      label: "10ˣ",
      ariaLabel: "Ten to the x",
      tone: "fn",
      action: () => applyUnary((v) => `10^(${v})`),
    },
    {
      label: "n!",
      ariaLabel: "Factorial",
      tone: "fn",
      action: () => applyUnary((v) => `factorial(${v})`),
    },
    {
      label: "π",
      ariaLabel: "Pi",
      tone: "fn",
      action: () => append("π"),
    },
    {
      label: "e",
      ariaLabel: "Euler number",
      tone: "fn",
      action: () => append("e"),
    },
    {
      label: "(",
      ariaLabel: "Open parenthesis",
      tone: "op",
      action: () => append("("),
    },
    {
      label: ")",
      ariaLabel: "Close parenthesis",
      tone: "op",
      action: () => append(")"),
    },
    {
      label: "%",
      ariaLabel: "Percent",
      tone: "op",
      action: () => append("%"),
    },
    {
      label: "mod",
      ariaLabel: "Modulo",
      tone: "op",
      action: () => append(" % "),
    },
    {
      label: "AC",
      ariaLabel: "All clear",
      tone: "danger",
      action: clearAll,
    },
    {
      label: "⌫",
      ariaLabel: "Backspace",
      tone: "danger",
      action: backspace,
    },
    {
      label: "±",
      ariaLabel: "Toggle sign",
      tone: "op",
      action: toggleSign,
    },
    {
      label: "÷",
      ariaLabel: "Divide",
      tone: "op",
      action: () => append("÷"),
    },
    {
      label: "7",
      ariaLabel: "Seven",
      action: () => append("7"),
    },
    {
      label: "8",
      ariaLabel: "Eight",
      action: () => append("8"),
    },
    {
      label: "9",
      ariaLabel: "Nine",
      action: () => append("9"),
    },
    {
      label: "×",
      ariaLabel: "Multiply",
      tone: "op",
      action: () => append("×"),
    },
    {
      label: "4",
      ariaLabel: "Four",
      action: () => append("4"),
    },
    {
      label: "5",
      ariaLabel: "Five",
      action: () => append("5"),
    },
    {
      label: "6",
      ariaLabel: "Six",
      action: () => append("6"),
    },
    {
      label: "−",
      ariaLabel: "Subtract",
      tone: "op",
      action: () => append("−"),
    },
    {
      label: "1",
      ariaLabel: "One",
      action: () => append("1"),
    },
    {
      label: "2",
      ariaLabel: "Two",
      action: () => append("2"),
    },
    {
      label: "3",
      ariaLabel: "Three",
      action: () => append("3"),
    },
    {
      label: "+",
      ariaLabel: "Add",
      tone: "op",
      action: () => append("+"),
    },
    {
      label: "0",
      ariaLabel: "Zero",
      span: 2,
      action: () => append("0"),
    },
    {
      label: ".",
      ariaLabel: "Decimal",
      action: () => append("."),
    },
    {
      label: "=",
      ariaLabel: "Equals",
      tone: "eq",
      action: evaluate,
    },
  ];

  const displayResult = error
    ? "Error"
    : justEvaluated
      ? result
      : preview?.ok
        ? preview.formatted
        : result;

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(260px,0.85fr)] lg:items-start">
      <section className="results-card overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <div className="border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--background)_70%,transparent)] px-4 py-3 sm:px-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.16em] text-[var(--accent)] uppercase">
                Advanced Scientific
              </p>
              <p className="mt-1 text-xs text-[var(--muted)]">
                Keyboard ready · PEMDAS · session history
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex rounded-full border border-[var(--border)] bg-[var(--surface)] p-1">
                {(["deg", "rad"] as AngleMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setAngleMode(mode)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                      angleMode === mode
                        ? "bg-gradient-to-r from-[#00E5FF] to-[#2979FF] text-white"
                        : "text-[var(--muted)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    {mode === "deg" ? "Degrees °" : "Radians"}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setInv((v) => !v)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  inv
                    ? "border-transparent bg-gradient-to-r from-[#00E5FF] to-[#2979FF] text-white"
                    : "border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                Inv
              </button>
              <button
                type="button"
                onClick={() => setHistoryOpen((v) => !v)}
                className="rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--muted)] transition hover:text-[var(--foreground)] lg:hidden"
              >
                {historyOpen ? "Hide history" : "History"}
              </button>
            </div>
          </div>
        </div>

        <div className="px-4 py-5 sm:px-6">
          <div
            className="rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-4 sm:px-5"
            aria-live="polite"
            aria-atomic="true"
            id={liveId}
          >
            <div className="flex items-start justify-between gap-3">
              <p className="min-h-[1.5rem] flex-1 break-all text-right font-mono text-sm text-[var(--muted)] sm:text-base">
                {expression || "0"}
              </p>
              {hasMemory && (
                <span className="shrink-0 rounded-md bg-[color-mix(in_srgb,#2979FF_16%,transparent)] px-2 py-0.5 text-[10px] font-bold tracking-wide text-[var(--accent-strong)]">
                  M
                </span>
              )}
            </div>
            <p
              className={`mt-2 break-all text-right font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight sm:text-5xl ${
                error ? "text-[#d64545] dark:text-[#ff8a8a]" : "result-glow"
              }`}
            >
              {displayResult}
            </p>
            <p className="mt-2 text-right text-xs text-[var(--muted)]">
              {error
                ? error
                : hasMemory
                  ? `Memory: ${memoryLabel}`
                  : angleMode === "deg"
                    ? "Trig functions use degrees"
                    : "Trig functions use radians"}
            </p>
          </div>

          <div className="mt-5 grid grid-cols-4 gap-2 sm:gap-2.5">
            {keys.map((key) => (
              <button
                key={key.ariaLabel}
                type="button"
                aria-label={key.ariaLabel}
                onClick={key.action}
                className={`min-h-12 rounded-xl border text-sm font-semibold transition active:scale-[0.98] sm:min-h-[3.25rem] sm:text-[15px] ${toneClass(
                  key.tone
                )} ${key.span === 2 ? "col-span-2" : ""} ${key.className || ""}`}
              >
                {key.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <aside
        className={`rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5 ${
          historyOpen ? "block" : "hidden lg:block"
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold tracking-[0.14em] text-[var(--accent)] uppercase">
              History
            </h2>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Tap a result to reuse it
            </p>
          </div>
          <button
            type="button"
            disabled={history.length === 0}
            onClick={() => setHistory([])}
            className="rounded-lg border border-[var(--border)] px-2.5 py-1 text-xs font-medium text-[var(--muted)] transition hover:text-[var(--foreground)] disabled:opacity-40"
          >
            Clear
          </button>
        </div>

        <ul className="mt-4 max-h-[34rem] space-y-2 overflow-y-auto pr-1">
          {history.length === 0 ? (
            <li className="rounded-xl border border-dashed border-[var(--border)] px-3 py-8 text-center text-sm text-[var(--muted)]">
              Your calculations will appear here for this session.
            </li>
          ) : (
            history.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => {
                    setExpression(item.result);
                    setResult(item.result);
                    setError("");
                    setJustEvaluated(true);
                  }}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-3 text-left transition hover:border-[var(--accent)]"
                >
                  <p className="truncate font-mono text-xs text-[var(--muted)]">
                    {item.expression}
                  </p>
                  <p className="mt-1 font-[family-name:var(--font-display)] text-lg font-bold tracking-tight text-[var(--foreground)]">
                    = {item.result}
                  </p>
                </button>
              </li>
            ))
          )}
        </ul>
      </aside>
    </div>
  );
}
