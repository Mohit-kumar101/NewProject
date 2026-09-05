export type GuideSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type GuideArticle = {
  slug: string;
  title: string;
  description: string;
  published: string;
  updated: string;
  category: "Money" | "Fitness" | "Converters" | "Work";
  relatedToolHrefs: { href: string; label: string }[];
  intro: string;
  sections: GuideSection[];
  takeaways: string[];
};

export const GUIDE_ARTICLES: GuideArticle[] = [
  {
    slug: "emergency-fund-how-many-months",
    title: "How many months should your emergency fund cover?",
    description:
      "A practical framework for 3–12 months of runway: fixed costs vs lifestyle spend, income volatility, and when to stop stacking cash.",
    published: "2026-08-12",
    updated: "2026-09-05",
    category: "Money",
    relatedToolHrefs: [
      {
        href: "/tools/emergency-fund-runway-planner",
        label: "Emergency fund runway planner",
      },
      {
        href: "/tools/multi-goal-savings-planner",
        label: "Multi-goal savings planner",
      },
    ],
    intro:
      "An emergency fund is not a vibes-based number. It is a months-of-survival estimate based on your real bills, how replaceable your income is, and what other buffers you already have. This guide walks through a simple way to choose a target—and how to know when cash has become too expensive sitting idle.",
    sections: [
      {
        heading: "Start with essential monthly burn—not take-home pay",
        paragraphs: [
          "Use the cash you would still need if you lost your job tomorrow: rent or mortgage, utilities, groceries, insurance, minimum debt payments, transport, and childcare. Skip restaurants, discretionary shopping, and optional subscriptions for the baseline target.",
          "People often size funds off gross income and overshoot. Essentials-only burn usually lands 20–40% below lifestyle spend. That difference matters when you are choosing between three months and nine.",
        ],
      },
      {
        heading: "Match months to income risk",
        paragraphs: [
          "Stable dual-income households with in-demand skills can often start at three months of essentials. Single-income homes, commission roles, contractors, and industries with long hiring cycles usually need six to twelve.",
        ],
        bullets: [
          "3 months: dual income, strong job market, low fixed costs",
          "6 months: single income or moderate job-search risk",
          "9–12 months: freelancing, caregiving gaps, health uncertainty, or high housing costs",
        ],
      },
      {
        heading: "Count other buffers—but carefully",
        paragraphs: [
          "Accessible credit, a partner’s income, severance norms, or a taxable brokerage account can reduce how much pure cash you hold. They should not replace a true cash floor if using them would create high-interest debt or force panic selling.",
          "A workable rule: keep at least three months in cash-equivalents (high-yield savings or similar), then decide whether months four through twelve live in cash or a mix of cash plus intentional investments.",
        ],
      },
      {
        heading: "When to stop stacking the fund",
        paragraphs: [
          "Once you hit your target months, extra dollars usually earn more toward high-interest debt payoff, retirement matches, or specific goals. An oversized emergency fund that sits for years while you carry 20%+ credit cards is rarely optimal.",
        ],
      },
    ],
    takeaways: [
      "Size the fund from essential burn, not lifestyle spending.",
      "Raise months of coverage when income is lumpy or hard to replace.",
      "Keep a cash floor; invest only the surplus beyond that floor.",
      "Revisit the target after a move, new baby, or job change.",
    ],
  },
  {
    slug: "contractor-vs-employee-true-cost",
    title: "Contractor vs employee: the true cost most teams miss",
    description:
      "Why a $90/hour contractor is not the same as a $90k salary—burden rates, benefits, downtime, and a walkthrough with numbers.",
    published: "2026-08-18",
    updated: "2026-09-05",
    category: "Work",
    relatedToolHrefs: [
      {
        href: "/tools/contractor-vs-w2-employee-calculator",
        label: "Contractor vs W2 employee calculator",
      },
      {
        href: "/tools/freelance-true-rate-planner",
        label: "Freelance true rate planner",
      },
    ],
    intro:
      "Hiring debates often compare a contractor’s hourly rate to an employee’s salary line item. That comparison is incomplete. Employers pay payroll taxes, benefits, equipment, management time, and paid non-billable hours for employees—while contractors price risk, downtime, and self-employment tax into their rate.",
    sections: [
      {
        heading: "Build a fully loaded employee cost",
        paragraphs: [
          "Start with base salary, then add employer payroll taxes, health insurance contribution, retirement match, paid time off, equipment, software licenses, and recruiting amortization. For many US knowledge roles, fully loaded cost lands roughly 1.25×–1.45× salary.",
          "Example: a $100,000 salary at 1.35× burden is about $135,000 per year. Divided by ~1,800 productive hours (after PTO, meetings, and admin), the internal hourly cost is closer to $75—not $48.",
        ],
      },
      {
        heading: "Translate contractor rates fairly",
        paragraphs: [
          "A contractor at $95/hour for 20 hours/week is $98,800/year in fees—but you are not paying benefits, and you can stop the engagement. You also absorb less idle time if the work is project-shaped.",
          "If the role needs full-time presence, culture ownership, and long-term product context, employment often wins even when the sticker rate looks higher. If the work is bursty or specialized, contracting often wins.",
        ],
      },
      {
        heading: "Decision checklist",
        paragraphs: ["Use both cost and control:"],
        bullets: [
          "Need IP ownership and daily collaboration? Lean employee.",
          "Need a specialist for 6–12 weeks? Lean contractor.",
          "Unsure of scope? Time-box a contractor pilot before opening a req.",
          "Always compare annualized fully loaded cost for the same output hours.",
        ],
      },
    ],
    takeaways: [
      "Never compare salary to contractor rate without burden and productive hours.",
      "Contracting buys flexibility; employment buys continuity and ownership.",
      "Run the numbers for your actual hours of needed coverage.",
    ],
  },
  {
    slug: "bulk-cut-macros-without-guessing",
    title: "Bulk and cut macros without guessing your calories",
    description:
      "How to set surplus and deficit sizes, protein targets, and weekly check-ins so bulk/cut phases do not stall or spiral.",
    published: "2026-08-20",
    updated: "2026-09-05",
    category: "Fitness",
    relatedToolHrefs: [
      {
        href: "/tools/health-fitness-and-wellness/bulk-cut-macro-planner",
        label: "Bulk & cut macro planner",
      },
      {
        href: "/hubs/fitness-planners",
        label: "Fitness planners hub",
      },
    ],
    intro:
      "Most bulk/cut plans fail because the calorie gap is too aggressive or protein is treated as optional. A workable phase starts from maintenance calories, applies a modest surplus or deficit, anchors protein to body weight, then adjusts from scale and training feedback—not from social media templates.",
    sections: [
      {
        heading: "Find a realistic maintenance first",
        paragraphs: [
          "If your weight has been stable for two weeks, your average daily intake is a practical maintenance estimate. If not, use a TDEE estimate and treat the first 10–14 days as calibration—not judgment day.",
          "Large jumps (+500 for bulk, −750 for cut) create unnecessary fat gain or muscle loss for most lifters outside contest prep.",
        ],
      },
      {
        heading: "Phase targets that usually work",
        paragraphs: [],
        bullets: [
          "Bulk: +200 to +300 kcal/day; expect ~0.25–0.5% body weight gain per week",
          "Cut: −300 to −500 kcal/day; expect ~0.5–1% body weight loss per week",
          "Protein: roughly 1.6–2.2 g/kg body weight (or ~0.7–1.0 g/lb)",
          "Fill remaining calories with carbs and fats based on training preference",
        ],
      },
      {
        heading: "Weekly review beats daily panic",
        paragraphs: [
          "Weigh under similar conditions 3–4 mornings per week and use the average. Strength trends and waist measurements matter as much as the scale. If progress stalls for 2+ weeks, change one variable: calories by ~100–150, steps, or sleep—not all three at once.",
        ],
      },
    ],
    takeaways: [
      "Calibrate maintenance before you chase big surpluses or deficits.",
      "Protein is the non-negotiable macro for most physique goals.",
      "Adjust from weekly averages, not single weigh-ins.",
    ],
  },
  {
    slug: "heic-to-jpg-when-and-why",
    title: "HEIC to JPG: when you should convert (and when you should not)",
    description:
      "Why iPhone photos use HEIC, what you lose in JPG conversion, and a safe workflow for sharing, printing, and archiving.",
    published: "2026-08-22",
    updated: "2026-09-05",
    category: "Converters",
    relatedToolHrefs: [
      { href: "/tools/heic-jpg-converter", label: "HEIC to JPG converter" },
      { href: "/tools/png-jpg-converter", label: "PNG ↔ JPG converter" },
    ],
    intro:
      "HEIC is efficient and high quality on Apple devices, but many websites, Windows tools, and print labs still expect JPG. Converting is often necessary for compatibility—yet doing it carelessly can throw away detail you cannot get back.",
    sections: [
      {
        heading: "Convert when the destination cannot read HEIC",
        paragraphs: [
          "Email attachments for mixed-device teams, CMS uploads, older design tools, and many print services still choke on HEIC. In those cases JPG (or PNG for graphics with sharp edges) is the pragmatic choice.",
          "Keep the original HEIC in your library. Treat JPG as a delivery format, not your only archive.",
        ],
      },
      {
        heading: "Quality settings that matter",
        paragraphs: [
          "If your converter exposes quality, start high (around 90–95) for photos you care about. Dropping to 70–80 is fine for web thumbnails where file size dominates.",
          "Repeated open-edit-save cycles on JPG introduce generation loss. Prefer editing from HEIC/PNG masters when possible.",
        ],
      },
      {
        heading: "Privacy note for browser converters",
        paragraphs: [
          "Prefer tools that process files locally in the browser so images are not uploaded to a server. That matters for ID photos, invoices, and personal documents.",
        ],
      },
    ],
    takeaways: [
      "Convert for compatibility; archive originals in HEIC when you can.",
      "Use high JPG quality for keepers; lower only for disposable web use.",
      "Avoid re-saving JPG repeatedly during edits.",
    ],
  },
  {
    slug: "mortgage-affordability-beyond-the-payment",
    title: "Mortgage affordability beyond the monthly payment",
    description:
      "Payment calculators are necessary but incomplete—stress-test rates, maintenance, closing cash, and lifestyle residual income.",
    published: "2026-08-25",
    updated: "2026-09-05",
    category: "Money",
    relatedToolHrefs: [
      {
        href: "/tools/home-affordability-calculator",
        label: "Home affordability calculator",
      },
      {
        href: "/workflows/buy-a-home",
        label: "Buy a home workflow",
      },
    ],
    intro:
      "A mortgage payment that “fits” on paper can still wreck cashflow once taxes, insurance, maintenance, and rate shocks show up. Affordability is residual income after a realistic housing stack—not the lender’s maximum approval.",
    sections: [
      {
        heading: "Use lender max as a ceiling—not a target",
        paragraphs: [
          "Lenders optimize for repayment risk under their rules. You optimize for sleep, savings rate, and flexibility. Many households are safer targeting 28–35% of take-home for principal, interest, taxes, and insurance—not the absolute maximum DTI allowed.",
        ],
      },
      {
        heading: "Add the costs payment calculators omit",
        paragraphs: [],
        bullets: [
          "Property tax and homeowners insurance changes",
          "HOA dues and special assessments",
          "Maintenance reserve (often 1% of home value per year as a planning heuristic)",
          "Closing costs and moving cash beyond the down payment",
        ],
      },
      {
        heading: "Stress-test the rate",
        paragraphs: [
          "Model the payment at +1% and +2% even if you expect to refinance later. If only the optimistic rate works, the budget is fragile. Bi-weekly payment tools and extra-principal scenarios help once you own—not before you buy.",
        ],
      },
    ],
    takeaways: [
      "Approval amount ≠ comfortable affordability.",
      "Include tax, insurance, HOA, and maintenance in the stack.",
      "If a +1% rate breaks the plan, renegotiate price or wait.",
    ],
  },
  {
    slug: "freelance-rate-that-covers-reality",
    title: "Set a freelance rate that covers unpaid reality",
    description:
      "Billable hours are not 40. Build a true rate from salary target, taxes, benefits replacement, and non-billable time.",
    published: "2026-08-28",
    updated: "2026-09-05",
    category: "Work",
    relatedToolHrefs: [
      {
        href: "/tools/freelance-true-rate-planner",
        label: "Freelance true rate planner",
      },
      {
        href: "/workflows/go-freelance",
        label: "Go freelance workflow",
      },
    ],
    intro:
      "New freelancers often divide a desired salary by 2,000 hours and call it a rate. That ignores unpaid marketing, admin, sick days, software, health insurance, and self-employment tax. A true rate starts from net income goals and works backward through utilization.",
    sections: [
      {
        heading: "The utilization trap",
        paragraphs: [
          "If you can realistically bill 20–25 hours per week after sales and delivery overhead, your rate must support the year on those hours—not on a fantasy 40. At 1,000 billable hours/year, a $80,000 take-home-style target needs a much higher sticker rate than an employee mindset expects.",
        ],
      },
      {
        heading: "Stack the missing employee benefits",
        paragraphs: [
          "Add health premiums, retirement contributions, equipment refresh, accounting, and a profit buffer. Then apply a tax estimate for your jurisdiction. Only after that divide by expected billable hours.",
        ],
      },
      {
        heading: "Package the rate",
        paragraphs: [
          "Hourly is fine for unclear scopes. Fixed project fees with clear change-order rules often protect both sides better. Either way, know your floor rate so discounts stay intentional.",
        ],
      },
    ],
    takeaways: [
      "Billable hours drive the math—not calendar hours.",
      "Replace benefits and taxes before you compare to salary peers.",
      "Protect a floor rate; discount with eyes open.",
    ],
  },
  {
    slug: "pdf-tools-without-uploading-sensitive-files",
    title: "PDF tools without uploading sensitive files",
    description:
      "How to merge, extract text, and convert PDFs while keeping invoices and IDs on your device.",
    published: "2026-09-01",
    updated: "2026-09-05",
    category: "Converters",
    relatedToolHrefs: [
      { href: "/tools/pdf-text-converter", label: "PDF ↔ text converter" },
      { href: "/tools/pdf-merge-split", label: "PDF merge & split" },
      { href: "/workflows/convert-safely", label: "Convert safely workflow" },
    ],
    intro:
      "Many “free” PDF sites upload your document to a server. That is a poor default for tax returns, contracts, and IDs. Prefer browser-local tools, verify what leaves your machine, and keep a clear before/after naming habit so you never overwrite the only copy.",
    sections: [
      {
        heading: "Choose local processing when content is sensitive",
        paragraphs: [
          "If a tool can run in the browser with WebAssembly or client-side libraries, your file often never needs to hit someone else’s disk. That is the right default for personal documents.",
        ],
      },
      {
        heading: "A safe conversion checklist",
        paragraphs: [],
        bullets: [
          "Duplicate the original before merge/split experiments",
          "Check page order and OCR quality before deleting sources",
          "Strip unnecessary metadata when sharing externally if your workflow requires it",
          "Prefer downloadable results you can open offline",
        ],
      },
      {
        heading: "When server tools are acceptable",
        paragraphs: [
          "Large batch jobs, advanced OCR languages, or collaboration features may require a trusted service. Use those for non-sensitive material, or redacted copies, and read retention policies first.",
        ],
      },
    ],
    takeaways: [
      "Sensitive PDFs belong in local-first tools.",
      "Never experiment on your only copy.",
      "Match the tool’s privacy model to the document’s risk.",
    ],
  },
  {
    slug: "debt-snowball-vs-avalanche",
    title: "Debt snowball vs avalanche: pick the method you will finish",
    description:
      "Interest math favors avalanche; behavior often favors snowball. How to choose—and when to hybridize.",
    published: "2026-09-02",
    updated: "2026-09-05",
    category: "Money",
    relatedToolHrefs: [
      {
        href: "/tools/debt-snowball-strategy-calculator",
        label: "Debt snowball calculator",
      },
      {
        href: "/tools/debt-avalanche-strategy-calculator",
        label: "Debt avalanche calculator",
      },
      { href: "/workflows/kill-debt", label: "Kill debt workflow" },
    ],
    intro:
      "Avalanche ordering (highest APR first) usually minimizes interest. Snowball ordering (smallest balance first) often maximizes follow-through. The better method is the one you will still be running in month seven—not the one that wins a spreadsheet screenshot.",
    sections: [
      {
        heading: "Run both with the same extra payment",
        paragraphs: [
          "Put identical debts and the same monthly surplus into both calculators. Look at months to debt-free and total interest. If the interest gap is small, prefer the plan that creates early wins.",
        ],
      },
      {
        heading: "A practical hybrid",
        paragraphs: [
          "Clear one tiny balance for momentum, then switch to APR order. Or avalanche everything except a stressful collector account you want gone for peace of mind. Document the rule so you do not reshuffle weekly.",
        ],
      },
      {
        heading: "Do not ignore refinance opportunities",
        paragraphs: [
          "If a lower-rate consolidation loan is available without predatory fees, it can beat both methods. Compare fee-adjusted APR and whether you will keep spending on the cleared cards.",
        ],
      },
    ],
    takeaways: [
      "Avalanche wins on interest; snowball often wins on behavior.",
      "Compare both with the same surplus dollars.",
      "Hybrids and refinancing are valid when intentional.",
    ],
  },
  {
    slug: "saas-runway-for-founders",
    title: "SaaS runway: the founder numbers that actually matter",
    description:
      "Cash runway vs default alive, how burn definition changes decisions, and a simple monthly review ritual.",
    published: "2026-09-03",
    updated: "2026-09-05",
    category: "Work",
    relatedToolHrefs: [
      {
        href: "/tools/bootstrapped-saas-monthly-net-burn-rate-and-runway-calculator",
        label: "SaaS net burn & runway calculator",
      },
      {
        href: "/hubs/money-milestones",
        label: "Money milestones hub",
      },
    ],
    intro:
      "Runway is not a vanity chart. It is months until you must raise, cut, or become default alive. Founders get into trouble when they mix gross cash with restricted funds, forget tax payments, or assume last month’s growth continues forever.",
    sections: [
      {
        heading: "Define burn honestly",
        paragraphs: [
          "Net burn = cash out − cash in over a period. Include payroll taxes, contractors, infrastructure, and one-time tools you pretend are temporary. Exclude “maybe” revenue until it clears.",
        ],
      },
      {
        heading: "Two runways, two decisions",
        paragraphs: [
          "Cash runway answers ‘how long until zero.’ Default-alive thinking asks whether growth and margins can cover burn without a raise. You need both views: one for survival, one for strategy.",
        ],
      },
      {
        heading: "Monthly ritual",
        paragraphs: [],
        bullets: [
          "Update cash, burn, and runway every month on the same day",
          "Write one sentence on what changed and why",
          "Pre-commit cut actions at 9, 6, and 3 months of runway",
        ],
      },
    ],
    takeaways: [
      "Honest burn beats optimistic dashboards.",
      "Track cash runway and path to default alive separately.",
      "Decide cuts before the crisis, not during it.",
    ],
  },
  {
    slug: "fire-number-reality-check",
    title: "FIRE number reality check: beyond 25× expenses",
    description:
      "Why the 4% rule is a starting heuristic, what breaks it, and how to stress-test your independence number.",
    published: "2026-09-04",
    updated: "2026-09-05",
    category: "Money",
    relatedToolHrefs: [
      {
        href: "/tools/fire-early-retirement-calculator",
        label: "FIRE early retirement calculator",
      },
      {
        href: "/tools/compound-interest-calculator",
        label: "Compound interest calculator",
      },
    ],
    intro:
      "The popular FIRE shortcut—annual spending × 25—comes from safe withdrawal research, not a guarantee. Sequence-of-returns risk, healthcare, housing shocks, and long retirements can break a thin plan. Treat 25× as a conversation starter, then stress-test.",
    sections: [
      {
        heading: "Know what spending you are multiplying",
        paragraphs: [
          "Use sustainable retirement spending, not your current grind-year expenses. Include healthcare premiums, housing maintenance, and family support you currently hide inside a paycheck lifestyle.",
        ],
      },
      {
        heading: "Stress tests worth running",
        paragraphs: [],
        bullets: [
          "What if returns are weak in the first 10 years?",
          "What if healthcare costs double for five years?",
          "What if you need a part-time bridge income anyway?",
        ],
      },
      {
        heading: "Flexibility is a asset class",
        paragraphs: [
          "Geographic flexibility, optional part-time work, and a paid-off home can matter as much as an extra 2× on the spreadsheet. Calculators quantify money; they cannot score optionality—you still should name it.",
        ],
      },
    ],
    takeaways: [
      "25× is a heuristic, not a promise.",
      "Multiply the right spending base.",
      "Build flexibility alongside the portfolio number.",
    ],
  },
  {
    slug: "subscription-audit-that-sticks",
    title: "A subscription audit that actually sticks",
    description:
      "Find hidden recurring charges, rank them by cost-per-use, and set a quarterly review so cuts do not creep back.",
    published: "2026-09-05",
    updated: "2026-09-05",
    category: "Money",
    relatedToolHrefs: [
      {
        href: "/tools/subscription-runway-audit",
        label: "Subscription runway audit",
      },
      {
        href: "/tools/emergency-fund-runway-planner",
        label: "Emergency fund runway planner",
      },
    ],
    intro:
      "Subscriptions feel small monthly and large yearly. A durable audit is less about shame and more about cost-per-use: keep tools you touch weekly, downgrade seasonal ones, and cancel zombies. Then calendar the review so new trials do not silently renew.",
    sections: [
      {
        heading: "Pull a complete list",
        paragraphs: [
          "Export card statements for 90 days and highlight every recurring merchant. Add app-store renewals and “free trials” that converted. Missing even two $15 charges can erase a careful grocery budget.",
        ],
      },
      {
        heading: "Score cost per use",
        paragraphs: [
          "Divide monthly price by honest uses per month. A $30 tool used twice may lose to a $12 tool used daily. Shared family plans change the math—allocate cost across real users.",
        ],
      },
      {
        heading: "Make the cut permanent",
        paragraphs: [
          "Cancel, download your data, and remove the payment method when possible. Set a quarterly 20-minute calendar block titled ‘subscriptions’ so the system does not rely on memory.",
        ],
      },
    ],
    takeaways: [
      "List every recurring charge from statements—not memory.",
      "Keep high cost-per-use winners; cut zombies.",
      "Schedule a quarterly review.",
    ],
  },
  {
    slug: "how-calculiohub-tools-are-built",
    title: "How CalculioHub tools are built (and what that means for you)",
    description:
      "Our approach to formulas, privacy, estimates vs advice, and how editorial guides relate to each calculator.",
    published: "2026-09-05",
    updated: "2026-09-05",
    category: "Converters",
    relatedToolHrefs: [
      { href: "/about", label: "About CalculioHub" },
      { href: "/tools", label: "All tools" },
      { href: "/contact", label: "Contact" },
    ],
    intro:
      "CalculioHub is an independent project: practical planners and converters with visible formulas, private-by-default file handling where the architecture allows, and written guides that explain limitations. This page is the editorial mission behind the tools—not marketing filler.",
    sections: [
      {
        heading: "Transparent math over black boxes",
        paragraphs: [
          "Where a tool computes a number, we aim to show the relationship in plain language and keep inputs editable so you can sensitivity-test assumptions. If a jurisdiction rule is simplified, the page should say so.",
        ],
      },
      {
        heading: "Privacy-minded converters",
        paragraphs: [
          "File tools prefer in-browser processing so invoices and photos are not a product for someone else’s training set. When a format or library requires tradeoffs, we still encourage keeping originals and verifying output.",
        ],
      },
      {
        heading: "Guides + tools together",
        paragraphs: [
          "A calculator answers ‘what if.’ A guide answers ‘what should I watch for.’ We publish both: working utilities and original explanations with a named operator you can contact.",
        ],
      },
    ],
    takeaways: [
      "Tools are for estimates; guides explain judgment calls.",
      "Prefer local file processing for sensitive documents.",
      "Feedback via Contact helps us fix edge cases.",
    ],
  },
];

export function getGuideBySlug(slug: string): GuideArticle | undefined {
  return GUIDE_ARTICLES.find((article) => article.slug === slug);
}

export function getAllGuideSlugs(): string[] {
  return GUIDE_ARTICLES.map((article) => article.slug);
}

export function getGuidesByCategory(
  category: GuideArticle["category"]
): GuideArticle[] {
  return GUIDE_ARTICLES.filter((article) => article.category === category);
}
