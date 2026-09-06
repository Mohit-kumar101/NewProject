export type EditorialSection = {
  heading: string;
  body: string;
};

export type ToolEditorialGuide = {
  slug: string;
  /** Optional guide article to cross-link */
  relatedGuideSlug?: string;
  whoItsFor: string;
  workedExample: string;
  pitfalls: string[];
  sections: EditorialSection[];
};

/**
 * Deep, original copy for core tool pages (AdSense substance on high-traffic utilities).
 * Only attach to canonical tool URLs—not thin long-tail variants.
 */
export const TOOL_EDITORIAL_GUIDES: ToolEditorialGuide[] = [
  {
    slug: "emergency-fund-runway-planner",
    relatedGuideSlug: "emergency-fund-how-many-months",
    whoItsFor:
      "Households sizing a cash buffer after a job change, move, or new dependent—anyone who needs months of runway, not a generic “save more” slogan.",
    workedExample:
      "Liquid savings $12,000 and essential expenses $3,200 → about 3.8 months of runway. A job-loss shock that zeros income shows how fast that buffer burns if spending stays fixed.",
    pitfalls: [
      "Sizing the fund from lifestyle spend instead of essentials",
      "Counting illiquid investments as emergency cash",
      "Stopping debt payoff forever while oversaving in low-yield cash",
    ],
    sections: [
      {
        heading: "How to read the runway number",
        body: "Runway months = liquid savings ÷ monthly essentials. Treat it as a planning range. If your income is commission-based or freelance, aim higher than a dual-income W-2 household with the same expenses.",
      },
      {
        heading: "Use shocks as decision tools",
        body: "The life-shock controls exist so you can rehearse bad months before they happen. If a medical bill or rent hike collapses runway below three months, that is a signal to cut fixed costs or pause aggressive investing—not a moral failure.",
      },
    ],
  },
  {
    slug: "multi-goal-savings-planner",
    whoItsFor:
      "People juggling a vacation, emergency fund, and down payment who keep guessing which goal to fund first.",
    workedExample:
      "With $800/month to save across three deadlines, sequential funding often finishes the nearest deadline earlier, while split funding keeps every goal moving—compare both before you commit.",
    pitfalls: [
      "Funding a low-priority want before a zero emergency floor",
      "Ignoring deadline order when interest or fees are attached",
    ],
    sections: [
      {
        heading: "Sequential vs split in plain language",
        body: "Sequential puts the full surplus on one goal until done, then rolls to the next. Split divides the surplus every month. Sequential can hit the first deadline sooner; split reduces the chance any goal is starved.",
      },
    ],
  },
  {
    slug: "freelance-true-rate-planner",
    relatedGuideSlug: "freelance-rate-that-covers-reality",
    whoItsFor:
      "Freelancers and consultants setting a floor rate after leaving a salaried role—or realizing their current rate does not cover unpaid admin time.",
    workedExample:
      "If you need $72,000 after expenses and can only bill 1,100 hours/year, your required rate is far above “salary ÷ 2,000.” The planner forces that utilization math into the open.",
    pitfalls: [
      "Assuming 40 billable hours every week",
      "Forgetting health insurance and tax set-asides",
      "Discounting below floor rate without a strategic reason",
    ],
    sections: [
      {
        heading: "Utilization is the hidden input",
        body: "Marketing, proposals, bookkeeping, and revisions are real work that clients do not pay hourly. A true rate prices those hours into the billable ones.",
      },
    ],
  },
  {
    slug: "subscription-runway-audit",
    relatedGuideSlug: "subscription-audit-that-sticks",
    whoItsFor:
      "Anyone whose bank feed is full of $8–$40 charges that never get reviewed.",
    workedExample:
      "Listing twelve subscriptions at $187/month is $2,244/year. Cutting three unused tools at $41/month frees almost $500/year without touching groceries.",
    pitfalls: [
      "Auditing from memory instead of statements",
      "Cancelling a tool you need weekly because the monthly price feels high in isolation",
    ],
    sections: [
      {
        heading: "Cost per use beats sticker shame",
        body: "A $30/month tool used twenty times can be cheaper per outcome than a $9 tool you never open. Rank by use, then cancel zombies.",
      },
    ],
  },
  {
    slug: "bulk-cut-macro-planner",
    relatedGuideSlug: "bulk-cut-macros-without-guessing",
    whoItsFor:
      "Lifters planning a bulk or cut who want calorie and macro targets tied to a phase—not a random internet spreadsheet.",
    workedExample:
      "Maintenance near 2,600 kcal with a −400 cut lands around 2,200 kcal. At 80 kg, protein near 160 g leaves carbs and fats to fill training preference.",
    pitfalls: [
      "Jumping straight to extreme deficits",
      "Ignoring weekly average weight in favor of daily noise",
      "Changing calories, steps, and sleep all at once",
    ],
    sections: [
      {
        heading: "Phases need feedback loops",
        body: "The planner gives a starting target. Your weekly average weight and training performance tell you whether to nudge calories up or down by small amounts.",
      },
    ],
  },
  {
    slug: "reverse-diet-planner",
    whoItsFor:
      "People exiting a cut who want to raise calories without uncontrolled rebound.",
    workedExample:
      "Starting 300 kcal below maintenance and adding planned weekly bumps—while shrinking bumps if weight is still dropping fast—creates a controlled walk-up instead of an all-you-can-eat rebound week.",
    pitfalls: [
      "Jumping to estimated maintenance overnight after a long deficit",
      "Ignoring steps and sleep while only watching the scale",
    ],
    sections: [
      {
        heading: "Why adaptive bumps help",
        body: "If the scale is still falling hard, a full planned bump may be too much metabolic recovery at once. Halving the next increase is a conservative way to find maintenance.",
      },
    ],
  },
  {
    slug: "fire-early-retirement-calculator",
    relatedGuideSlug: "fire-number-reality-check",
    whoItsFor:
      "Savers estimating an independence number who want a transparent multiple of spending—not influencer mythology.",
    workedExample:
      "Spending $48,000/year × 25 = $1.2M as a classic 4%-rule starting point. Stress-test higher spending or a lower withdrawal rate if your timeline is long or healthcare is uncertain.",
    pitfalls: [
      "Using peak-career spending as the retirement base",
      "Ignoring sequence-of-returns risk in early retirement",
    ],
    sections: [
      {
        heading: "Treat 25× as a draft",
        body: "The calculator shows the arithmetic. Your plan still needs healthcare assumptions, housing flexibility, and a willingness to earn bridge income if markets are rough early on.",
      },
    ],
  },
  {
    slug: "compound-interest-calculator",
    relatedGuideSlug: "compound-interest-patience-not-magic",
    whoItsFor:
      "Anyone comparing lump-sum vs recurring contributions, or illustrating why time in market dominates small rate differences.",
    workedExample:
      "$5,000 starting balance, $300/month, 7% annualized for 20 years grows far beyond the sum of contributions—the gap is compounded return, not magic.",
    pitfalls: [
      "Assuming a constant return every calendar year",
      "Ignoring fees and taxes in long projections",
    ],
    sections: [
      {
        heading: "Sensitivity beats single forecasts",
        body: "Run the same contributions at 5%, 7%, and 9%. The spread teaches uncertainty better than one heroic number.",
      },
    ],
  },
  {
    slug: "home-affordability-calculator",
    relatedGuideSlug: "mortgage-affordability-beyond-the-payment",
    whoItsFor:
      "Buyers who want a payment ceiling before touring—not after falling in love with a listing.",
    workedExample:
      "With solid income and moderate debts, a comfortable PITI target may be well below the bank’s maximum approval. Use the lower number as your shopping ceiling.",
    pitfalls: [
      "Treating lender max as a goal",
      "Forgetting taxes, insurance, and HOA in the monthly stack",
    ],
    sections: [
      {
        heading: "Affordability is residual income",
        body: "After housing, you still need savings rate, maintenance reserves, and life. If the spreadsheet only works at the dream rate, renegotiate scope.",
      },
    ],
  },
  {
    slug: "monthly-mortgage-payment-calculator",
    relatedGuideSlug: "mortgage-payment-what-youre-really-buying",
    whoItsFor:
      "Shoppers converting price, down payment, rate, and term into principal & interest before adding tax/insurance.",
    workedExample:
      "A $425,000 price with $85,000 down at 6.5% for 30 years produces a P&I payment you can stress-test at +1% rate before making an offer strategy.",
    pitfalls: [
      "Comparing P&I alone across properties with very different tax rates",
      "Ignoring PMI when down payment is under 20% (where applicable)",
    ],
    sections: [
      {
        heading: "Payment is the starting line",
        body: "Use this tool for P&I clarity, then layer taxes, insurance, and HOA from local data before you call the payment “affordable.”",
      },
    ],
  },
  {
    slug: "debt-snowball-strategy-calculator",
    relatedGuideSlug: "debt-snowball-vs-avalanche",
    whoItsFor:
      "Borrowers who stay motivated by clearing small balances first.",
    workedExample:
      "Three cards with balances $400, $2,200, and $6,000—snowball attacks the $400 first while paying minimums elsewhere, then rolls the freed payment upward.",
    pitfalls: [
      "Ignoring a crushing high-APR balance when the interest gap is huge",
      "Stopping the plan after the first win",
    ],
    sections: [
      {
        heading: "Behavior is part of the math",
        body: "If avalanche looks better on interest but you abandon plans, snowball’s early wins can be the rational choice. Compare both with the same surplus.",
      },
    ],
  },
  {
    slug: "debt-avalanche-strategy-calculator",
    relatedGuideSlug: "debt-snowball-vs-avalanche",
    whoItsFor:
      "Borrowers focused on minimizing interest dollars paid.",
    workedExample:
      "Same debts as a snowball plan, but extra payments hit the highest APR first. Total interest usually drops; months to done may be similar or slightly different depending on balances.",
    pitfalls: [
      "Underfunding minimums on other accounts",
      "Chasing 0% promos without a payoff calendar",
    ],
    sections: [
      {
        heading: "When avalanche clearly wins",
        body: "Large balance gaps plus big APR spreads favor avalanche. If the interest savings are tiny, pick the method you will finish.",
      },
    ],
  },
  {
    slug: "rent-vs-buy-long-term-calculator",
    relatedGuideSlug: "rent-vs-buy-when-spreadsheet-lies",
    whoItsFor:
      "Households deciding whether ownership still wins after opportunity cost of the down payment.",
    workedExample:
      "Compare total cost of renting versus buying over 7–10 years including maintenance, HOA, and investment returns on money not used as a down payment.",
    pitfalls: [
      "Assuming endless home appreciation",
      "Ignoring selling costs if you may move in a few years",
    ],
    sections: [
      {
        heading: "Horizon changes the winner",
        body: "Short stays often favor renting once transaction costs are included. Longer horizons can favor buying if you can hold through maintenance and rate cycles.",
      },
    ],
  },
  {
    slug: "heic-jpg-converter",
    relatedGuideSlug: "heic-to-jpg-when-and-why",
    whoItsFor:
      "Anyone sending iPhone photos to Windows users, websites, or print labs that still expect JPG.",
    workedExample:
      "Convert a HEIC vacation set to high-quality JPG for a shared album upload, while keeping HEIC originals in your library as the archive.",
    pitfalls: [
      "Deleting HEIC originals after a low-quality conversion",
      "Re-saving JPG many times during edits",
    ],
    sections: [
      {
        heading: "Compatibility vs archive",
        body: "JPG is a delivery format. HEIC (or another master) should remain your keep file when the device supports it.",
      },
    ],
  },
  {
    slug: "pdf-text-converter",
    relatedGuideSlug: "pdf-tools-without-uploading-sensitive-files",
    whoItsFor:
      "People extracting or rebuilding text from PDFs without uploading tax returns to a random server.",
    workedExample:
      "Pull text from a statement PDF to paste into a spreadsheet, then verify figures against the original pages before you trust the extract.",
    pitfalls: [
      "Assuming OCR is perfect on scans",
      "Uploading sensitive PDFs to unknown third-party sites",
    ],
    sections: [
      {
        heading: "Verify before you destroy the source",
        body: "Always spot-check extracted amounts and keep the original PDF until the workflow is done.",
      },
    ],
  },
  {
    slug: "pdf-merge-split",
    relatedGuideSlug: "pdf-tools-without-uploading-sensitive-files",
    whoItsFor:
      "Anyone assembling application packets or splitting large scans into shareable chunks.",
    workedExample:
      "Merge a cover letter, resume, and portfolio PDF into one packet—or split a 40-page scan into sections before emailing.",
    pitfalls: [
      "Overwriting the only copy while experimenting with page order",
      "Merging without checking rotation and blank pages",
    ],
    sections: [
      {
        heading: "Duplicate first",
        body: "Work on a copy. Confirm page order on a second device if the packet matters for an application or filing.",
      },
    ],
  },
  {
    slug: "mp4-mp3-converter",
    whoItsFor:
      "Creators pulling audio from video for podcasts, practice, or transcripts.",
    workedExample:
      "Extract audio from an MP4 interview to MP3 for a smaller file you can scrub in an audio editor.",
    pitfalls: [
      "Expecting studio quality from a compressed video soundtrack",
      "Violating copyright when redistributing extracted audio",
    ],
    sections: [
      {
        heading: "Quality follows the source",
        body: "Conversion cannot invent fidelity that was never in the video. Use the highest practical source bitrate when quality matters.",
      },
    ],
  },
  {
    slug: "png-jpg-converter",
    whoItsFor:
      "Designers and marketers choosing between sharp graphics (PNG) and smaller photos (JPG).",
    workedExample:
      "Convert a photograph PNG to JPG for web weight savings; keep logos and UI screenshots as PNG to avoid fuzzy edges.",
    pitfalls: [
      "JPG-compressing screenshots with text",
      "Using PNG for huge photo galleries without need",
    ],
    sections: [
      {
        heading: "Match format to content",
        body: "Photos tolerate JPG. Hard edges, transparency, and UI chrome usually want PNG (or modern alternatives like WebP when the destination supports them).",
      },
    ],
  },
  {
    slug: "contractor-vs-w2-employee-calculator",
    relatedGuideSlug: "contractor-vs-employee-true-cost",
    whoItsFor:
      "Founders and hiring managers comparing a contractor quote to a salaried seat on equal output hours.",
    workedExample:
      "A $100k salary at ~1.35× burden is not comparable to a raw $55/hour contractor quote until you normalize hours, benefits, and downtime.",
    pitfalls: [
      "Comparing salary to hourly rate without burden",
      "Ignoring management overhead for either path",
    ],
    sections: [
      {
        heading: "Normalize to annualized output",
        body: "Put both options on the same hours-of-coverage basis. Flexibility and IP ownership still matter—but start with honest cost.",
      },
    ],
  },
  {
    slug: "bootstrapped-saas-monthly-net-burn-rate-and-runway-calculator",
    relatedGuideSlug: "saas-runway-for-founders",
    whoItsFor:
      "Bootstrapped SaaS founders tracking months of oxygen from cash, revenue, and opex.",
    workedExample:
      "$180k cash, $22k revenue, $31k opex → $9k net burn → 20 months runway. If revenue covers opex, runway stops being the binding constraint.",
    pitfalls: [
      "Counting unsettled receivables as cash",
      "Excluding owner draws or annual tax payments from burn",
    ],
    sections: [
      {
        heading: "Update on a fixed cadence",
        body: "Recalculate monthly on the same day. Pre-commit cut actions at runway milestones so decisions are not improvised in panic.",
      },
    ],
  },
  {
    slug: "credit-card-minimum-payment-calculator",
    relatedGuideSlug: "credit-card-minimums-why-they-hurt",
    whoItsFor:
      "Cardholders who want to see how long minimum payments actually take—and what extra payments change.",
    workedExample:
      "A balance with only minimum payments can stretch for years. Adding a fixed extra amount often cuts both time and interest dramatically.",
    pitfalls: [
      "Making minimums while adding new purchases",
      "Ignoring APR differences across cards",
    ],
    sections: [
      {
        heading: "Minimums are a survival mode",
        body: "Use the calculator to make the cost of minimum-only visible, then pick a snowball or avalanche plan for the surplus.",
      },
    ],
  },
  {
    slug: "personal-loan-calculator",
    relatedGuideSlug: "personal-loan-when-it-actually-helps",
    whoItsFor:
      "Borrowers estimating payment and total interest before signing a personal loan offer.",
    workedExample:
      "Compare a $12,000 loan at two APRs and terms to see how a lower rate or shorter term changes monthly payment versus total interest.",
    pitfalls: [
      "Focusing only on monthly payment while stretching term",
      "Missing origination fees in APR comparisons",
    ],
    sections: [
      {
        heading: "Payment comfort vs total cost",
        body: "Longer terms lower the payment and usually raise total interest. Decide which constraint binds: cashflow or lifetime cost.",
      },
    ],
  },
  {
    slug: "student-loan-payoff-calculator",
    relatedGuideSlug: "student-loans-payoff-without-panic",
    whoItsFor:
      "Graduates modeling extra payments toward student debt payoff dates.",
    workedExample:
      "Adding $100/month above the scheduled payment can pull the payoff date forward by years depending on balance and rate.",
    pitfalls: [
      "Ignoring whether loans are subsidized, IDR, or forgiveness-eligible",
      "Refinancing federal loans without understanding benefit tradeoffs",
    ],
    sections: [
      {
        heading: "Know your program rules",
        body: "The calculator shows amortization math. Federal repayment plans and forgiveness rules can change the optimal strategy—verify against your servicer.",
      },
    ],
  },
  {
    slug: "calorie-deficit-calculator",
    relatedGuideSlug: "calorie-deficit-you-can-live-with",
    whoItsFor:
      "People estimating a daily deficit for fat loss without jumping to crash targets.",
    workedExample:
      "A 400–500 kcal daily deficit is a common sustainable starting band for many adults—then adjust from weekly average weight change.",
    pitfalls: [
      "Stacking huge deficits with high training volume immediately",
      "Not recalculating as weight changes",
    ],
    sections: [
      {
        heading: "Small deficits compound",
        body: "Consistency beats heroic short deficits that collapse adherence. Recalibrate every few weeks as body weight and activity shift.",
      },
    ],
  },
  {
    slug: "protein-intake-calculator",
    relatedGuideSlug: "protein-targets-without-obsession",
    whoItsFor:
      "Lifters and dieters setting a daily protein target from body weight and goal.",
    workedExample:
      "At 75 kg with a hypertrophy focus, targets often land near 120–165 g/day depending on the guideline you follow—then distribute across meals you can actually eat.",
    pitfalls: [
      "Setting a target you cannot hit with your food preferences",
      "Ignoring total calories while only tracking protein",
    ],
    sections: [
      {
        heading: "Hit the target with food you like",
        body: "The best protein number is one you can repeat. Use the calculator for a range, then build meals you will not abandon in week two.",
      },
    ],
  },
];

const bySlug = new Map(
  TOOL_EDITORIAL_GUIDES.map((guide) => [guide.slug, guide])
);

export function getToolEditorialGuide(
  slug: string
): ToolEditorialGuide | undefined {
  return bySlug.get(slug);
}
