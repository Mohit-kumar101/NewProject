/**
 * Curated multi-tool journeys — ordered steps that deep-link into existing tools.
 */

export type WorkflowStep = {
  toolSlug: string;
  label: string;
  /** One-line decision framing (not calculator jargon). */
  verdict: string;
  /** Optional starting inputs encoded into ?scenario= */
  preset?: Record<string, number>;
};

export type Workflow = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  eyebrow: string;
  steps: WorkflowStep[];
};

export const WORKFLOWS: Workflow[] = [
  {
    slug: "buy-a-home",
    shortTitle: "Buy a home",
    title: "Buy a home — from budget to closing",
    eyebrow: "Housing workflow",
    description:
      "Know your payment ceiling before you tour, then model the mortgage, closing costs, rent vs buy, and how long the down payment takes.",
    steps: [
      {
        toolSlug: "home-affordability-calculator",
        label: "Home affordability",
        verdict: "Set a hard ceiling before you fall in love with a listing.",
        preset: { annualIncome: 95000, monthlyDebts: 450, downPayment: 60000 },
      },
      {
        toolSlug: "monthly-mortgage-payment-calculator",
        label: "Monthly mortgage",
        verdict: "See principal & interest — then stress-test the payment.",
        preset: { homePrice: 425000, downPayment: 85000, annualRate: 6.5, termYears: 30 },
      },
      {
        toolSlug: "land-transfer-closing-cost-calculator",
        label: "Closing costs",
        verdict: "Cash at closing is often the surprise that kills a deal.",
      },
      {
        toolSlug: "rent-vs-buy-long-term-calculator",
        label: "Rent vs buy",
        verdict: "Check whether ownership still wins over a longer horizon.",
      },
      {
        toolSlug: "down-payment-savings-timeline-calculator",
        label: "Down payment timeline",
        verdict: "Turn the gap into months of saving — not a vague hope.",
      },
    ],
  },
  {
    slug: "kill-debt",
    shortTitle: "Kill debt",
    title: "Kill debt — first win to payoff",
    eyebrow: "Debt workflow",
    description:
      "Compare snowball vs avalanche, then check refinance and personal loan offers so every extra dollar has a job.",
    steps: [
      {
        toolSlug: "debt-snowball-strategy-calculator",
        label: "Debt snowball",
        verdict: "Clear the smallest balances first for momentum.",
      },
      {
        toolSlug: "debt-avalanche-strategy-calculator",
        label: "Debt avalanche",
        verdict: "Or attack the highest rates to minimize interest.",
      },
      {
        toolSlug: "loan-refinance-savings-calculator",
        label: "Refinance check",
        verdict: "A lower rate can beat hustling extra payments alone.",
      },
      {
        toolSlug: "personal-loan-calculator",
        label: "Personal loan compare",
        verdict: "Compare offers side-by-side before you consolidate.",
      },
    ],
  },
  {
    slug: "go-freelance",
    shortTitle: "Go freelance",
    title: "Go freelance — rate, fees, and taxes",
    eyebrow: "Freelance workflow",
    description:
      "Price after marketplace fees, set a sustainable hourly rate, then estimate self-employment tax so quotes still hit take-home.",
    steps: [
      {
        toolSlug: "freelance-rate-after-platform-fees-calculator",
        label: "Rate after platform fees",
        verdict: "Marketplace cut first — then decide if the gig is worth it.",
        preset: { grossRate: 75, feePercent: 20, hours: 10 },
      },
      {
        toolSlug: "freelance-hourly-rate-calculator",
        label: "Freelance hourly rate",
        verdict: "Back into a rate that covers non-billable time and profit.",
      },
      {
        toolSlug: "self-employment-tax-estimator",
        label: "Self-employment tax",
        verdict: "Set aside tax before you spend the deposit.",
      },
      {
        toolSlug: "side-hustle-net-profit-calculator",
        label: "Side hustle net profit",
        verdict: "See true profit after costs — not just revenue.",
      },
    ],
  },
  {
    slug: "convert-safely",
    shortTitle: "Convert safely",
    title: "Convert safely — private, in-browser",
    eyebrow: "Privacy workflow",
    description:
      "Convert photos, PDFs, and audio on your device. No CalculioHub upload of your files — pick the format, convert, then share.",
    steps: [
      {
        toolSlug: "heic-jpg-converter",
        label: "HEIC → JPG",
        verdict: "Unlock iPhone photos for email, web, and Windows.",
      },
      {
        toolSlug: "pdf-merge-split",
        label: "PDF merge & split",
        verdict: "Combine or extract pages without a cloud account.",
      },
      {
        toolSlug: "mp4-mp3-converter",
        label: "MP4 ↔ MP3",
        verdict: "Pull audio from video privately in the browser.",
      },
      {
        toolSlug: "png-jpg-converter",
        label: "PNG ↔ JPG",
        verdict: "Shrink images for email with quality presets.",
      },
    ],
  },
];

export function getWorkflowBySlug(slug: string): Workflow | undefined {
  return WORKFLOWS.find((w) => w.slug === slug);
}

export function getWorkflowHref(slug: string): string {
  return `/workflows/${slug}`;
}
