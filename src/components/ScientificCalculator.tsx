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
  id: string;
  label: ReactNode;
  ariaLabel: string;
  action: () => void;
  tone?: KeyTone;
  span?: 2;
  group?: "sci" | "main";
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
      return "border-transparent bg-gradient-to-br from-[#00E5FF] to-[#2979FF] text-white shadow-[0_8px_22px_-14px_rgba(0,229,255,0.85)] hover:brightness-105";
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
  const [historyOpen, setHistoryOpen] = useState(false);
  const [sciOpen, setSciOpen] = useState(false);
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

  const sciKeys: KeyDef[] = [
    {
      id: "mc",
      label: "MC",
      ariaLabel: "Memory clear",
      tone: "mem",
      group: "sci",
      action: () => {
        setMemory(0);
        setHasMemory(false);
      },
    },
    {
      id: "mr",
      label: "MR",
      ariaLabel: "Memory recall",
      tone: "mem",
      group: "sci",
      action: () => {
        if (!hasMemory) return;
        append(formatDisplayValue(memory));
      },
    },
    {
      id: "mplus",
      label: "M+",
      ariaLabel: "Memory add",
      tone: "mem",
      group: "sci",
      action: () => {
        setMemory((prev) => prev + currentValue());
        setHasMemory(true);
      },
    },
    {
      id: "mminus",
      label: "M−",
      ariaLabel: "Memory subtract",
      tone: "mem",
      group: "sci",
      action: () => {
        setMemory((prev) => prev - currentValue());
        setHasMemory(true);
      },
    },
    {
      id: "ms",
      label: "MS",
      ariaLabel: "Memory store",
      tone: "mem",
      group: "sci",
      action: () => {
        setMemory(currentValue());
        setHasMemory(true);
      },
    },
    {
      id: "sin",
      label: inv ? "sin⁻¹" : "sin",
      ariaLabel: inv ? "Arcsine" : "Sine",
      tone: "fn",
      group: "sci",
      action: () => wrapFn(inv ? "asin" : "sin"),
    },
    {
      id: "cos",
      label: inv ? "cos⁻¹" : "cos",
      ariaLabel: inv ? "Arccosine" : "Cosine",
      tone: "fn",
      group: "sci",
      action: () => wrapFn(inv ? "acos" : "cos"),
    },
    {
      id: "tan",
      label: inv ? "tan⁻¹" : "tan",
      ariaLabel: inv ? "Arctangent" : "Tangent",
      tone: "fn",
      group: "sci",
      action: () => wrapFn(inv ? "atan" : "tan"),
    },
    {
      id: "ln",
      label: "ln",
      ariaLabel: "Natural log",
      tone: "fn",
      group: "sci",
      action: () => wrapFn("log"),
    },
    {
      id: "log",
      label: "log",
      ariaLabel: "Log base 10",
      tone: "fn",
      group: "sci",
      action: () => wrapFn("log10"),
    },
    {
      id: "sq",
      label: "x²",
      ariaLabel: "Square",
      tone: "fn",
      group: "sci",
      action: () => applyUnary((v) => `(${v})^2`),
    },
    {
      id: "cu",
      label: "x³",
      ariaLabel: "Cube",
      tone: "fn",
      group: "sci",
      action: () => applyUnary((v) => `(${v})^3`),
    },
    {
      id: "pow",
      label: "xʸ",
      ariaLabel: "Power",
      tone: "fn",
      group: "sci",
      action: () => append("^"),
    },
    {
      id: "sqrt",
      label: "√",
      ariaLabel: "Square root",
      tone: "fn",
      group: "sci",
      action: () => wrapFn("sqrt"),
    },
    {
      id: "cbrt",
      label: "∛",
      ariaLabel: "Cube root",
      tone: "fn",
      group: "sci",
      action: () => wrapFn("cbrt"),
    },
    {
      id: "nth",
      label: "ʸ√x",
      ariaLabel: "Nth root",
      tone: "fn",
      group: "sci",
      action: () => append("nthRoot("),
    },
    {
      id: "exp",
      label: "eˣ",
      ariaLabel: "e to the x",
      tone: "fn",
      group: "sci",
      action: () => wrapFn("exp"),
    },
    {
      id: "tenx",
      label: "10ˣ",
      ariaLabel: "Ten to the x",
      tone: "fn",
      group: "sci",
      action: () => applyUnary((v) => `10^(${v})`),
    },
    {
      id: "fact",
      label: "n!",
      ariaLabel: "Factorial",
      tone: "fn",
      group: "sci",
      action: () => applyUnary((v) => `factorial(${v})`),
    },
    {
      id: "pi",
      label: "π",
      ariaLabel: "Pi",
      tone: "fn",
      group: "sci",
      action: () => append("π"),
    },
    {
      id: "e",
      label: "e",
      ariaLabel: "Euler number",
      tone: "fn",
      group: "sci",
      action: () => append("e"),
    },
    {
      id: "lparen",
      label: "(",
      ariaLabel: "Open parenthesis",
      tone: "op",
      group: "sci",
      action: () => append("("),
    },
    {
      id: "rparen",
      label: ")",
      ariaLabel: "Close parenthesis",
      tone: "op",
      group: "sci",
      action: () => append(")"),
    },
    {
      id: "pct",
      label: "%",
      ariaLabel: "Percent",
      tone: "op",
      group: "sci",
      action: () => append("%"),
    },
    {
      id: "mod",
      label: "mod",
      ariaLabel: "Modulo",
      tone: "op",
      group: "sci",
      action: () => append(" % "),
    },
  ];

  const mainKeys: KeyDef[] = [
    {
      id: "ac",
      label: "AC",
      ariaLabel: "All clear",
      tone: "danger",
      group: "main",
      action: clearAll,
    },
    {
      id: "bk",
      label: "⌫",
      ariaLabel: "Backspace",
      tone: "danger",
      group: "main",
      action: backspace,
    },
    {
      id: "sign",
      label: "±",
      ariaLabel: "Toggle sign",
      tone: "op",
      group: "main",
      action: toggleSign,
    },
    {
      id: "div",
      label: "÷",
      ariaLabel: "Divide",
      tone: "op",
      group: "main",
      action: () => append("÷"),
    },
    {
      id: "7",
      label: "7",
      ariaLabel: "Seven",
      group: "main",
      action: () => append("7"),
    },
    {
      id: "8",
      label: "8",
      ariaLabel: "Eight",
      group: "main",
      action: () => append("8"),
    },
    {
      id: "9",
      label: "9",
      ariaLabel: "Nine",
      group: "main",
      action: () => append("9"),
    },
    {
      id: "mul",
      label: "×",
      ariaLabel: "Multiply",
      tone: "op",
      group: "main",
      action: () => append("×"),
    },
    {
      id: "4",
      label: "4",
      ariaLabel: "Four",
      group: "main",
      action: () => append("4"),
    },
    {
      id: "5",
      label: "5",
      ariaLabel: "Five",
      group: "main",
      action: () => append("5"),
    },
    {
      id: "6",
      label: "6",
      ariaLabel: "Six",
      group: "main",
      action: () => append("6"),
    },
    {
      id: "sub",
      label: "−",
      ariaLabel: "Subtract",
      tone: "op",
      group: "main",
      action: () => append("−"),
    },
    {
      id: "1",
      label: "1",
      ariaLabel: "One",
      group: "main",
      action: () => append("1"),
    },
    {
      id: "2",
      label: "2",
      ariaLabel: "Two",
      group: "main",
      action: () => append("2"),
    },
    {
      id: "3",
      label: "3",
      ariaLabel: "Three",
      group: "main",
      action: () => append("3"),
    },
    {
      id: "add",
      label: "+",
      ariaLabel: "Add",
      tone: "op",
      group: "main",
      action: () => append("+"),
    },
    {
      id: "0",
      label: "0",
      ariaLabel: "Zero",
      span: 2,
      group: "main",
      action: () => append("0"),
    },
    {
      id: "dot",
      label: ".",
      ariaLabel: "Decimal",
      group: "main",
      action: () => append("."),
    },
    {
      id: "eq",
      label: "=",
      ariaLabel: "Equals",
      tone: "eq",
      group: "main",
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

  const renderKey = (key: KeyDef) => (
    <button
      key={key.id}
      type="button"
      aria-label={key.ariaLabel}
      onClick={key.action}
      className={`flex h-9 items-center justify-center rounded-lg border text-[12px] font-semibold transition active:scale-[0.98] sm:h-10 sm:rounded-xl sm:text-sm ${toneClass(
        key.tone
      )} ${key.span === 2 ? "col-span-2" : ""}`}
    >
      {key.label}
    </button>
  );

  return (
    <div className="grid gap-3 lg:grid-cols-[minmax(0,1.7fr)_minmax(220px,0.75fr)] lg:items-stretch">
      <section
        className="results-card flex h-[calc(100vh-10.5rem)] max-h-[720px] min-h-[480px] flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] sm:h-[calc(100vh-11rem)]"
      >
        {/* Toolbar */}
        <div className="shrink-0 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--background)_70%,transparent)] px-3 py-2 sm:px-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold tracking-[0.16em] text-[var(--accent)] uppercase sm:text-[11px]">
                Advanced Scientific
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <div className="inline-flex rounded-full border border-[var(--border)] bg-[var(--surface)] p-0.5">
                {(["deg", "rad"] as AngleMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setAngleMode(mode)}
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition sm:px-3 ${
                      angleMode === mode
                        ? "bg-gradient-to-r from-[#00E5FF] to-[#2979FF] text-white"
                        : "text-[var(--muted)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    {mode === "deg" ? "Deg °" : "Rad"}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setInv((v) => !v)}
                className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold transition ${
                  inv
                    ? "border-transparent bg-gradient-to-r from-[#00E5FF] to-[#2979FF] text-white"
                    : "border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                Inv
              </button>
              <button
                type="button"
                onClick={() => setSciOpen((v) => !v)}
                className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold transition md:hidden ${
                  sciOpen
                    ? "border-transparent bg-gradient-to-r from-[#00E5FF] to-[#2979FF] text-white"
                    : "border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                Sci
              </button>
              <button
                type="button"
                onClick={() => setHistoryOpen((v) => !v)}
                className="rounded-full border border-[var(--border)] px-2.5 py-1 text-[11px] font-semibold text-[var(--muted)] transition hover:text-[var(--foreground)] lg:hidden"
              >
                Hist
              </button>
            </div>
          </div>
        </div>

        {/* Display */}
        <div className="shrink-0 px-3 pt-3 sm:px-4 sm:pt-3.5">
          <div
            className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 sm:px-4 sm:py-3"
            aria-live="polite"
            aria-atomic="true"
            id={liveId}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="max-h-10 flex-1 overflow-y-auto break-all text-right font-mono text-xs text-[var(--muted)] sm:text-sm">
                {expression || "0"}
              </p>
              {hasMemory && (
                <span className="shrink-0 rounded-md bg-[color-mix(in_srgb,#2979FF_16%,transparent)] px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-[var(--accent-strong)]">
                  M
                </span>
              )}
            </div>
            <p
              className={`mt-1 break-all text-right font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight sm:text-3xl ${
                error ? "text-[#d64545] dark:text-[#ff8a8a]" : "result-glow"
              }`}
            >
              {displayResult}
            </p>
            <p className="mt-1 text-right text-[10px] text-[var(--muted)] sm:text-[11px]">
              {error
                ? error
                : hasMemory
                  ? `Memory: ${memoryLabel}`
                  : angleMode === "deg"
                    ? "Trig in degrees"
                    : "Trig in radians"}
            </p>
          </div>
        </div>

        {/* Keypad fills remaining height */}
        <div className="flex min-h-0 flex-1 flex-col gap-1.5 px-3 pb-3 pt-2.5 sm:gap-2 sm:px-4 sm:pb-4">
          {/* Scientific functions: always on md+, toggle drawer on mobile */}
          <div
            className={`${
              sciOpen ? "block" : "hidden"
            } max-h-[38%] overflow-y-auto md:block md:max-h-none md:overflow-visible`}
          >
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
              {sciKeys.map(renderKey)}
            </div>
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-4 content-stretch gap-1.5 sm:gap-2">
            {mainKeys.map(renderKey)}
          </div>
        </div>
      </section>

      {/* History rail / drawer */}
      <aside
        className={`flex max-h-[220px] flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 sm:p-4 lg:max-h-[720px] lg:h-[calc(100vh-10.5rem)] ${
          historyOpen ? "flex" : "hidden lg:flex"
        }`}
      >
        <div className="flex shrink-0 items-center justify-between gap-3">
          <div>
            <h2 className="text-xs font-semibold tracking-[0.14em] text-[var(--accent)] uppercase sm:text-sm">
              History
            </h2>
            <p className="mt-0.5 text-[11px] text-[var(--muted)]">
              Tap to reuse
            </p>
          </div>
          <button
            type="button"
            disabled={history.length === 0}
            onClick={() => setHistory([])}
            className="rounded-lg border border-[var(--border)] px-2 py-1 text-[11px] font-medium text-[var(--muted)] transition hover:text-[var(--foreground)] disabled:opacity-40"
          >
            Clear
          </button>
        </div>

        <ul className="mt-3 min-h-0 flex-1 space-y-1.5 overflow-y-auto overscroll-contain pr-1">
          {history.length === 0 ? (
            <li className="rounded-xl border border-dashed border-[var(--border)] px-3 py-6 text-center text-xs text-[var(--muted)]">
              Session calculations appear here.
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
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-2 text-left transition hover:border-[var(--accent)]"
                >
                  <p className="truncate font-mono text-[10px] text-[var(--muted)] sm:text-xs">
                    {item.expression}
                  </p>
                  <p className="mt-0.5 font-[family-name:var(--font-display)] text-sm font-bold tracking-tight text-[var(--foreground)] sm:text-base">
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
