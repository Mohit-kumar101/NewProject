/** Client-side persistence for calculator inputs & lightweight snapshots. */

const ROOT_KEY = "calculiohub.toolState.v1";
const SNAPSHOTS_KEY = "calculiohub.snapshots.v1";
const RATE_CARDS_KEY = "calculiohub.freelanceRateCards.v1";
const SUB_TRACKER_KEY = "calculiohub.subscriptionTracker.v1";
const CONVERTER_RECENT_KEY = "calculiohub.converterRecent.v1";
const HOME_SCENARIOS_KEY = "calculiohub.homeScenarios.v1";

function canUseStorage(): boolean {
  return typeof window !== "undefined";
}

function readJson<T>(key: string, fallback: T): T {
  if (!canUseStorage()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore quota / private mode.
  }
}

export function loadToolValues(
  slug: string
): Record<string, number> | null {
  const all = readJson<Record<string, Record<string, number>>>(ROOT_KEY, {});
  const bag = all[slug];
  if (!bag || typeof bag !== "object") return null;
  return bag;
}

export function saveToolValues(
  slug: string,
  values: Record<string, number>
): void {
  const all = readJson<Record<string, Record<string, number>>>(ROOT_KEY, {});
  all[slug] = values;
  writeJson(ROOT_KEY, all);
}

export type ProgressSnapshot = {
  at: string;
  label: string;
  primary: string;
  meta?: Record<string, number>;
};

export function loadSnapshots(slug: string): ProgressSnapshot[] {
  const all = readJson<Record<string, ProgressSnapshot[]>>(SNAPSHOTS_KEY, {});
  return all[slug] ?? [];
}

export function pushSnapshot(
  slug: string,
  snapshot: Omit<ProgressSnapshot, "at">,
  limit = 8
): ProgressSnapshot[] {
  const all = readJson<Record<string, ProgressSnapshot[]>>(SNAPSHOTS_KEY, {});
  const next: ProgressSnapshot = {
    ...snapshot,
    at: new Date().toISOString(),
  };
  const list = [next, ...(all[slug] ?? [])].slice(0, limit);
  all[slug] = list;
  writeJson(SNAPSHOTS_KEY, all);
  return list;
}

export type FreelanceRateCard = {
  id: string;
  name: string;
  hourlyRate: number;
  taxBufferPct: number;
  hoursPerWeek: number;
};

export function loadRateCards(): FreelanceRateCard[] {
  return readJson<FreelanceRateCard[]>(RATE_CARDS_KEY, []);
}

export function saveRateCards(cards: FreelanceRateCard[]): void {
  writeJson(RATE_CARDS_KEY, cards);
}

export type NamedSubscription = {
  id: string;
  name: string;
  amount: number;
  paused?: boolean;
};

export function loadNamedSubscriptions(): NamedSubscription[] {
  return readJson<NamedSubscription[]>(SUB_TRACKER_KEY, []);
}

export function saveNamedSubscriptions(items: NamedSubscription[]): void {
  writeJson(SUB_TRACKER_KEY, items);
}

export type ConverterRecentJob = {
  id: string;
  toolSlug: string;
  label: string;
  direction?: string;
  at: string;
};

export function loadConverterRecent(toolSlug: string): ConverterRecentJob[] {
  const all = readJson<Record<string, ConverterRecentJob[]>>(
    CONVERTER_RECENT_KEY,
    {}
  );
  return all[toolSlug] ?? [];
}

export function pushConverterRecent(
  toolSlug: string,
  job: Omit<ConverterRecentJob, "id" | "at" | "toolSlug">,
  limit = 6
): ConverterRecentJob[] {
  const all = readJson<Record<string, ConverterRecentJob[]>>(
    CONVERTER_RECENT_KEY,
    {}
  );
  const entry: ConverterRecentJob = {
    id: `${Date.now()}`,
    toolSlug,
    at: new Date().toISOString(),
    ...job,
  };
  const list = [entry, ...(all[toolSlug] ?? [])].slice(0, limit);
  all[toolSlug] = list;
  writeJson(CONVERTER_RECENT_KEY, all);
  return list;
}

export type HomeScenario = {
  id: string;
  name: string;
  toolSlug: string;
  values: Record<string, number>;
  primary: string;
  at: string;
};

export function loadHomeScenarios(): HomeScenario[] {
  return readJson<HomeScenario[]>(HOME_SCENARIOS_KEY, []);
}

export function saveHomeScenario(
  scenario: Omit<HomeScenario, "id" | "at">,
  limit = 10
): HomeScenario[] {
  const list = loadHomeScenarios();
  const next: HomeScenario = {
    ...scenario,
    id: `${Date.now()}`,
    at: new Date().toISOString(),
  };
  const merged = [next, ...list.filter((s) => s.name !== scenario.name)].slice(
    0,
    limit
  );
  writeJson(HOME_SCENARIOS_KEY, merged);
  return merged;
}

export type TaxEstimateSave = {
  year: number;
  values: Record<string, number>;
  primaryLabel: string;
  primaryValue: string;
  at: string;
};

const TAX_ESTIMATE_KEY = "calculiohub.taxEstimates.v1";

export function loadTaxEstimate(slug: string): TaxEstimateSave | null {
  const all = readJson<Record<string, TaxEstimateSave>>(TAX_ESTIMATE_KEY, {});
  return all[slug] ?? null;
}

export function saveTaxEstimate(slug: string, estimate: TaxEstimateSave): void {
  const all = readJson<Record<string, TaxEstimateSave>>(TAX_ESTIMATE_KEY, {});
  all[slug] = estimate;
  writeJson(TAX_ESTIMATE_KEY, all);
}
