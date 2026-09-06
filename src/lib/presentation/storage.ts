import type {
  PresentationCompare,
  PresentationDeckInput,
} from "@/lib/presentation/buildDeck";

const STORAGE_KEY = "calculiohub.presentation.payload.v1";
const BRAND_KEY = "calculiohub.presentation.brand.v1";
const EDITS_KEY = "calculiohub.presentation.edits.v1";
const COMPARE_KEY = "calculiohub.presentation.compare.v1";

export type PresentationPayload = PresentationDeckInput & {
  slug: string;
  toolHref?: string;
  savedAt: string;
};

export type PresentationBrand = {
  preparedFor: string;
  accentColor: string;
};

export type SlideEdits = Record<
  string,
  { title?: string; speakerNotes?: string }
>;

export function savePresentationPayload(payload: PresentationPayload): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    sessionStorage.setItem(
      `${STORAGE_KEY}:${payload.slug}`,
      JSON.stringify(payload)
    );
  } catch {
    // ignore
  }
}

export function loadPresentationPayload(
  slug?: string
): PresentationPayload | null {
  if (typeof window === "undefined") return null;
  try {
    if (slug) {
      const scoped = sessionStorage.getItem(`${STORAGE_KEY}:${slug}`);
      if (scoped) {
        const parsed = JSON.parse(scoped) as PresentationPayload;
        if (parsed?.slug === slug) return parsed;
      }
    }
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PresentationPayload;
    if (slug && parsed.slug !== slug) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function savePresentationBrand(brand: PresentationBrand): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(BRAND_KEY, JSON.stringify(brand));
  } catch {
    // ignore
  }
}

export function loadPresentationBrand(): PresentationBrand {
  if (typeof window === "undefined") {
    return { preparedFor: "", accentColor: "#00B8D4" };
  }
  try {
    const raw = localStorage.getItem(BRAND_KEY);
    if (!raw) return { preparedFor: "", accentColor: "#00B8D4" };
    const parsed = JSON.parse(raw) as PresentationBrand;
    return {
      preparedFor: parsed.preparedFor ?? "",
      accentColor: parsed.accentColor || "#00B8D4",
    };
  } catch {
    return { preparedFor: "", accentColor: "#00B8D4" };
  }
}

export function saveSlideEdits(slug: string, edits: SlideEdits): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${EDITS_KEY}:${slug}`, JSON.stringify(edits));
  } catch {
    // ignore
  }
}

export function loadSlideEdits(slug: string): SlideEdits {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(`${EDITS_KEY}:${slug}`);
    if (!raw) return {};
    return JSON.parse(raw) as SlideEdits;
  } catch {
    return {};
  }
}

export function presentationHref(
  slug: string,
  scenario?: string,
  template?: string
): string {
  const base = `/presentation/${encodeURIComponent(slug)}`;
  const params = new URLSearchParams();
  if (scenario) params.set("scenario", scenario);
  if (template) params.set("template", template);
  const q = params.toString();
  return q ? `${base}?${q}` : base;
}

export function savePresentationCompare(
  slug: string,
  compare: PresentationCompare | null
): void {
  if (typeof window === "undefined") return;
  try {
    if (!compare) {
      sessionStorage.removeItem(`${COMPARE_KEY}:${slug}`);
      return;
    }
    sessionStorage.setItem(
      `${COMPARE_KEY}:${slug}`,
      JSON.stringify(compare)
    );
  } catch {
    // ignore
  }
}

export function loadPresentationCompare(
  slug: string
): PresentationCompare | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(`${COMPARE_KEY}:${slug}`);
    if (!raw) return null;
    return JSON.parse(raw) as PresentationCompare;
  } catch {
    return null;
  }
}
