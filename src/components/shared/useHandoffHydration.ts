"use client";

import { useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import { readScenarioFromLocation } from "@/lib/scenarioLinks";

/** Merge ?scenario= into a Record workspace. Call once on mount, before local saves. */
export function takeScenarioBag(): Record<string, number> | null {
  return readScenarioFromLocation();
}

export function useApplyScenarioBag(
  apply: (bag: Record<string, number>) => void
): void {
  useEffect(() => {
    const bag = readScenarioFromLocation();
    if (!bag) return;
    apply(bag);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- first paint only
  }, []);
}

export function mergeKnown(
  bag: Record<string, number>,
  keys: string[]
): Record<string, number> {
  const out: Record<string, number> = {};
  for (const key of keys) {
    const n = bag[key];
    if (typeof n === "number" && Number.isFinite(n)) out[key] = n;
  }
  return out;
}

export function applyBagToSetters(
  bag: Record<string, number>,
  setters: Record<string, (n: number) => void>
): void {
  for (const [key, set] of Object.entries(setters)) {
    const n = bag[key];
    if (typeof n === "number" && Number.isFinite(n)) set(n);
  }
}

export function useRecordScenario(
  setValues: Dispatch<SetStateAction<Record<string, number>>>,
  onAfterSaved?: (saved: Record<string, number> | null) => void,
  loadSaved?: () => Record<string, number> | null
): void {
  useEffect(() => {
    const bag = readScenarioFromLocation();
    if (bag) {
      setValues((prev) => ({ ...prev, ...bag }));
      onAfterSaved?.(null);
      return;
    }
    const saved = loadSaved?.() ?? null;
    if (saved) {
      setValues((prev) => ({ ...prev, ...saved }));
    }
    onAfterSaved?.(saved);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- hydrate once
  }, []);
}
