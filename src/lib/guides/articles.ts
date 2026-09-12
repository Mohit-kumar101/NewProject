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
    slug: "retirement-year-is-a-spreadsheet",
    title: "Your retirement year is a spreadsheet, not a date",
    description:
      "How to read a “when can I retire” answer without treating 4% as a contract, and what to change when the year looks too far away.",
    published: "2026-09-08",
    updated: "2026-09-08",
    category: "Money",
    relatedToolHrefs: [
      {
        href: "/tools/life-and-future/when-can-i-retire",
        label: "When can I retire?",
      },
      {
        href: "/tools/life-and-future/how-much-money-do-i-need-to-retire",
        label: "How much money do I need to retire?",
      },
      {
        href: "/tools/life-and-future/how-long-will-my-money-last",
        label: "How long will my money last?",
      },
    ],
    intro:
      "The first time I typed my numbers into a retirement calculator I wanted a birthday. Age 57. Age 61. Something I could tell a friend. What I got was a pile of assumptions wearing a year like a costume. That is still useful. You just have to know which lever you are holding.",
    sections: [
      {
        heading: "The year is only as honest as the spending number",
        paragraphs: [
          "Most “when can I stop” tools divide the income you want by a withdrawal rate. Four percent is the usual shortcut: $40,000 a year wants about $1 million sitting there on day one. If you type the lifestyle you have now—including the car payment you swear will be gone—you will get a later year than if you type the quieter budget you actually plan to live on.",
          "I keep two spending numbers. One is “if nothing changes.” The other is “if we drop the second car and cook more.” The gap between those years is often bigger than the gap you get from arguing about 6% versus 7% returns.",
        ],
      },
      {
        heading: "Returns do most of the work. That is the uncomfortable part.",
        paragraphs: [
          "A $900 monthly deposit looks serious until you notice that, over 25 years, most of the pile is compound growth, not your deposits. That is why a one-point change in the return field slides the retirement age by years. It is also why a calculator that assumes 10% forever is doing you no favors.",
          "I use something boring: 6–7% if the money is in a broad stock/bond mix, lower if a lot of it will sit in cash. If the year only works at 11%, the year does not work.",
        ],
      },
      {
        heading: "Social Security, pensions, and the part-time lie",
        paragraphs: [
          "If you will have a pension or a benefit you trust, subtract it from the income you type. If you might not, leave the income high and treat any check as a bonus. Same with “I’ll just consult a little.” Part-time work can buy years. It is not a plan until you know who will hire you at 64.",
        ],
        bullets: [
          "Lower later spending moves the date more reliably than hoping for a hotter market.",
          "A higher monthly deposit is the one lever you control this year.",
          "A bad first decade in retirement can wreck a 4% plan. Keep a cash sleeve.",
        ],
      },
      {
        heading: "If the year looks impossible",
        paragraphs: [
          "That is information. Either the lifestyle you typed needs a cheaper version, the deposit needs to go up, or the stop-work age needs to move. Sometimes all three. The calculator will not choose for you. It will show you how expensive each choice is in years.",
          "Run the same numbers in “how long will this pile last” if you already have a lump sum and a burn rate. That page answers a different question: not “when,” but “how many years if I start drawing now.”",
        ],
      },
    ],
    takeaways: [
      "Treat the retirement age as a range under your own spending and return assumptions.",
      "Write the lifestyle you will actually fund, not the one you have this month.",
      "Raise deposits or cut later spend before you raise the hoped-for return.",
      "A withdrawal rate is a planning mark. Markets do not sign it.",
    ],
  },
  {
    slug: "days-alive-and-weekends-left",
    title: "How many days you have been alive—and what to do with that number",
    description:
      "A plain way to count days, weekends until 80, and the share of a life already used, without turning it into a panic poster.",
    published: "2026-09-08",
    updated: "2026-09-08",
    category: "Work",
    relatedToolHrefs: [
      {
        href: "/tools/life-calendar/how-many-days-have-i-been-alive",
        label: "How many days have I been alive?",
      },
      {
        href: "/tools/life-calendar/weekends-left-until-80",
        label: "Weekends left until 80",
      },
      {
        href: "/tools/life-calendar/percentage-of-life-lived",
        label: "Percentage of life lived",
      },
    ],
    intro:
      "I can tell you I am 33. I cannot feel 12,000 days. The first time I counted them I expected a sermon. What I got was a calendar fact: a lot of Tuesdays already happened, and a finite number of Saturday mornings are left if I live to the age I typed. That is all. It is still enough to change how I spend a weekend.",
    sections: [
      {
        heading: "Days alive is arithmetic. The rest is a story you add.",
        paragraphs: [
          "Birthday to today, in whole days. No personality test. No “best years.” If you were born on a leap day the page still lands on a real calendar date. Today is not a finished day, so the count sits one shy of midnight.",
          "People use this when a round age is coming, when a parent dies, or when they are just tired of measuring life in job titles. The number does not care why you asked.",
        ],
      },
      {
        heading: "Weekends until 80 is the one that stings",
        paragraphs: [
          "I count a weekend as one Saturday–Sunday pair. From today to your 80th birthday, divide the days by seven. If you are 40, you do not get “40 years of weekends.” You get the weekends that are still ahead, and some of those will be funerals, night shifts, or a kid’s tournament in a gym that smells like rubber.",
          "The point is not to panic. The point is that “we should take a trip sometime” has a smaller pile of slots than it feels like on a Sunday night.",
        ],
      },
      {
        heading: "Percent lived needs an expectancy you chose on purpose",
        paragraphs: [
          "Age divided by the life expectancy you type. If you pick 90 because it feels hopeful, you look younger on the bar. If you pick the table average for your country and sex, you look older. Neither is a booking. Family history, smoking, and luck do not live in that field.",
          "I treat it as a denominator I am willing to say out loud, not a diagnosis.",
        ],
        bullets: [
          "Days alive: finished midnights since birth.",
          "Weekends left: Saturday–Sunday pairs until the 80th birthday you set.",
          "Percent lived: your age over the expectancy you picked.",
        ],
      },
      {
        heading: "Work, commute, sleep, phone",
        paragraphs: [
          "Those pages multiply a habit by time. They will overcount if you type the worst week of the year as a lifetime average. They will undercount care work if you only enter paid hours. Use them to see the shape, then decide whether a habit is worth the years it is buying.",
        ],
      },
    ],
    takeaways: [
      "Count days first. Add meaning after, if you want it.",
      "Weekends left is a budget of Saturday mornings, not a threat.",
      "Life expectancy in these tools is a number you typed, not a medical forecast.",
      "Habit totals are only as honest as the average week you used.",
    ],
  },
  {
    slug: "hundred-a-month-and-ten-a-day",
    title: "What $100 a month and $10 a day actually turn into",
    description:
      "A grounded look at small deposits, coffee, inflation, and the first $100k—without pretending a latte is the reason you are not rich.",
    published: "2026-09-08",
    updated: "2026-09-08",
    category: "Money",
    relatedToolHrefs: [
      {
        href: "/tools/money-curiosity/if-i-invested-100-every-month",
        label: "If I invested $100 every month",
      },
      {
        href: "/tools/money-curiosity/if-i-stop-spending-10-a-day",
        label: "If I stop spending $10 a day",
      },
      {
        href: "/tools/money-curiosity/how-long-to-save-first-100k",
        label: "How long to the first $100k",
      },
    ],
    intro:
      "The internet loves two stories. One says a daily coffee ruined your retirement. The other says $100 a month is a joke. Both are lazy. $100 a month for 20 years at a mid-single-digit return is a real pile. A $10 daily leak is also a real pile if you actually invest the difference. Rent, interest, and a car payment still dwarf both. Hold those facts in the same hand.",
    sections: [
      {
        heading: "$100 a month is not cute if you keep it up",
        paragraphs: [
          "Skip the “what if you had bought Apple in 1997” version. Use a return you would accept from a boring index fund, and a monthly amount you can still send after a bad month. Twenty or thirty years later the deposits are the smaller share. That is the whole trick, and it only works if the money stays invested when the account looks red.",
          "If $100 is what you have, start there. If you can do $400 after the 401(k) match, do that. The calculator does not give you a medal for the smaller number.",
        ],
      },
      {
        heading: "Stopping $10 a day is only magic if the $10 leaves the checking account",
        paragraphs: [
          "I have “cut coffee” years that produced nothing because the money became takeout on Thursday. The page that asks what happens if you stop spending $10 a day assumes you invest about $304 a month instead. If you just spend less and feel virtuous, you get a lighter month, not a future value.",
          "Coffee over a lifetime is the same idea with a longer clock. Homebrew changes the price. Quitting changes the count. Either field moves the total more than arguing about oat milk.",
        ],
      },
      {
        heading: "Inflation is the quiet tax on cash you never touch",
        paragraphs: [
          "A number that sits in a checking account still prints the same digits. It buys less. Three percent for ten years is not a headline. It is still a fifth of the purchasing power gone. If you need that cash for a year of bills, keep it. If it is “someday” money earning nothing, the inflation page is the honest one.",
        ],
        bullets: [
          "First $100k is mostly deposits. After that, growth does more of the lifting.",
          "A car’s real cost is payment plus insurance, fuel, parking, repairs, and the value it loses.",
          "Lifestyle extras (the monthly fun number plus trips) are the budget people undercount.",
        ],
      },
      {
        heading: "The “if I had started ten years ago” trap",
        paragraphs: [
          "That page is useful once: it shows what a decade of deposits would have been. Then close it. You cannot invest in 2016 from 2026. You can start the same habit on the next payday. Shame is not a contribution.",
        ],
      },
    ],
    takeaways: [
      "Small monthly investing works when it is automatic and left alone.",
      "A cut habit only compounds if the money is invested, not vaguely saved.",
      "Cash that sits still loses buying power; that is inflation, not a mystery fee.",
      "The first $100k is a deposit problem more than a stock-picking problem.",
    ],
  },
  {
    slug: "how-long-you-have-been-together",
    title: "How long you have been together, without the greeting-card math",
    description:
      "Days since you met, days as a couple, the 1,000th day, and why a percentage of a life is a better anniversary prompt than a restaurant default.",
    published: "2026-09-08",
    updated: "2026-09-08",
    category: "Work",
    relatedToolHrefs: [
      {
        href: "/tools/relationship-curiosity/days-we-have-been-together",
        label: "Days we have been together",
      },
      {
        href: "/tools/relationship-curiosity/percentage-of-life-together",
        label: "Percentage of life together",
      },
      {
        href: "/tools/relationship-curiosity/days-until-1000th-day-together",
        label: "Days until the 1,000th day",
      },
    ],
    intro:
      "I know the year we started dating. I did not know it was 2,400 days until I counted. That is not more romantic than an anniversary. It is just harder to shrug off. A thousand days is a little under three years. If you have already passed it, you can still pick a dinner. The calendar does not collect a late fee.",
    sections: [
      {
        heading: "Pick the date you actually mean",
        paragraphs: [
          "“How long have I known you” and “how long have we been together” are different clocks. One starts the night you met. The other starts the day it was a relationship, or the day you moved in, or the wedding—your call. Use the same start if you want one number. Use both if you like the gap.",
          "Long-distance stretches feel longer than the day count. The page will not add extra for that. You can.",
        ],
      },
      {
        heading: "A percentage of a life is the unnerving one",
        paragraphs: [
          "Days together divided by days you have been alive. If you met at 28 and you are 36, a large slice of your adult life is this person. If you met at 19, an even larger slice of the whole life. That is not a reason to stay. It is a reason the breakup, or the next decade, is not a small edit.",
        ],
      },
      {
        heading: "The 1,000th day is a better party than a made-up “monthiversary”",
        paragraphs: [
          "It is a round number with no greeting-card company behind it. About two years and nine months from the start date. If you like rituals and hate the pressure of a yearly anniversary, this is a decent stand-in. If you already passed it, the page shows how far past. Throw the dinner anyway.",
        ],
        bullets: [
          "Known-since and together-since can be different dates. Say which one you used.",
          "On-off years: pick the start you both still tell, or the latest restart.",
          "Memory guesses are not science. They are “events we would still mention” times time.",
        ],
      },
      {
        heading: "About “memories”",
        paragraphs: [
          "That calculator multiplies days by a weekly guess—meals that were not leftovers, trips, fights you still tell. It will never match a camera roll. I use it when I want a number that is not days. Then I stop, because counting memories is a good way to ruin one.",
        ],
      },
    ],
    takeaways: [
      "Decide whether you are counting from the day you met or the day it was a relationship.",
      "A thousand days is a real milestone with no industry attached.",
      "Share-of-life is a conversation starter, not a loyalty score.",
      "Guessed memories are a sketch. Days are the part you can defend.",
    ],
  },
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
    slug: "compound-interest-patience-not-magic",
    title: "Compound interest is patience, not a magic trick",
    description:
      "What compounding actually does over 10–30 years, why early contributions matter more than chasing returns, and how to read a compound calculator without fooling yourself.",
    published: "2026-09-05",
    updated: "2026-09-05",
    category: "Money",
    relatedToolHrefs: [
      {
        href: "/tools/compound-interest-calculator",
        label: "Compound interest calculator",
      },
      {
        href: "/tools/fire-early-retirement-calculator",
        label: "FIRE / early retirement calculator",
      },
    ],
    intro:
      "People talk about compound interest like it is a cheat code. It is not. It is math that rewards time more than cleverness. If you leave money invested long enough, earnings start earning their own earnings. That sounds obvious until you watch someone obsess over a 0.3% fee difference while skipping contributions for six months. This guide is about reading the curve honestly—and not mistaking a projection for a promise.",
    sections: [
      {
        heading: "What the calculator is really showing you",
        paragraphs: [
          "A compound interest tool assumes a steady rate of return. Markets do not do that. They zigzag. The smooth line on the chart is a teaching model, not a forecast of next year’s brokerage balance. Use it to compare habits: ‘What if I contribute $400 a month for 20 years?’ versus ‘What if I wait five years and then try to catch up?’ The gap between those two stories is the point.",
          "When I run my own scenarios, I care less about the final dollar than about when most of the growth appears. Early years look boring. Later years look dramatic. That shape is why starting late hurts more than people expect—and why a ‘temporary pause’ can quietly cost a decade of runway.",
        ],
      },
      {
        heading: "A walkthrough with ordinary numbers",
        paragraphs: [
          "Say you invest $300 a month for 25 years at an assumed 7% average annual return. You contribute $90,000 of your own money. The projected balance is much larger than $90,000 because the early contributions had more years to compound. Now delay the same plan by five years and keep the same monthly amount: you contribute less total cash and give each dollar fewer years. The ending balance usually drops more than the five years of skipped deposits alone would suggest.",
          "That is the human lesson: catching up is harder than starting small. If cash is tight this year, a smaller automatic contribution still beats waiting for a perfect month that never arrives.",
        ],
      },
      {
        heading: "Return assumptions people quietly inflate",
        paragraphs: [
          "It feels good to type 12% because a recent bull market made that number familiar. Long-term diversified stock returns have historically been lower than peak years, and your personal result depends on fees, taxes, and when you buy and sell. If a plan only ‘works’ at an aggressive rate, it is fragile.",
        ],
        bullets: [
          "Try a base case (for example 6–7%) and a cautious case a couple points lower.",
          "Separate pre-tax retirement accounts from taxable accounts in your head—taxes change spendable outcomes.",
          "Ignore day-trading fantasies inside a compounding planner. The tool is for steady contribution math.",
        ],
      },
      {
        heading: "When compounding advice is the wrong priority",
        paragraphs: [
          "If you carry 22% credit card debt, maximizing brokerage contributions while minimum-paying the card is usually backwards. Compound interest works against you on high-APR balances just as hard as it works for you in an index fund. Pay the expensive debt down first, keep any employer match if you have one, then widen investing.",
          "Also: an emergency fund that prevents a panicked sale during a job loss protects compounding better than an extra $50 of market exposure you cannot hold through a rough quarter.",
        ],
      },
    ],
    takeaways: [
      "Treat compound charts as habit comparisons, not guarantees.",
      "Starting earlier usually beats waiting for a bigger contribution later.",
      "Stress-test with a modest return assumption, not a highlight-reel rate.",
      "High-interest debt can compound against you faster than markets compound for you.",
    ],
  },
  {
    slug: "rent-vs-buy-when-spreadsheet-lies",
    title: "Rent vs buy: when the spreadsheet quietly lies",
    description:
      "How to compare renting and buying without ignoring maintenance, moving plans, opportunity cost, or the emotional pressure to ‘stop throwing money away.’",
    published: "2026-09-05",
    updated: "2026-09-05",
    category: "Money",
    relatedToolHrefs: [
      {
        href: "/tools/rent-vs-buy-long-term-calculator",
        label: "Rent vs buy long-term calculator",
      },
      {
        href: "/tools/home-affordability-calculator",
        label: "Home affordability calculator",
      },
      {
        href: "/tools/monthly-mortgage-payment-calculator",
        label: "Monthly mortgage payment calculator",
      },
    ],
    intro:
      "Someone always says renting is ‘throwing money away.’ That line skips property tax, insurance, repairs, closing costs, and the cash you lock into a down payment. Buying can be the right call—I have recommended it for friends who planned to stay put—but the honest comparison is messier than a mortgage payment versus last month’s rent. This is how I walk through it when someone asks for a straight answer.",
    sections: [
      {
        heading: "Match the time horizon first",
        paragraphs: [
          "If you might move cities in two or three years, buying often loses on transaction costs alone. Closing fees, realtor commissions, and the hassle of selling can erase early principal paydown. A five-to-seven-year stay starts to make the math more competitive in many markets; longer stays generally favor ownership if you can afford the house without stretching every paycheck.",
          "The calculator needs your real horizon. Optimism (‘we’ll stay forever’) is fine as a values statement. It is a bad input if your industry relocates people every few years.",
        ],
      },
      {
        heading: "Total housing cost beats ‘the payment’",
        paragraphs: [
          "Your mortgage payment is principal and interest—sometimes escrowed taxes and insurance. Ownership also means maintenance (roofs do not care about your budget), HOA dues, higher utilities in larger spaces, and the occasional special assessment. Renters pay some of those indirectly through rent, but the surprise bills land on owners.",
          "On the rent side, include renter’s insurance and expected rent increases. A lease that looks cheaper in year one can catch up if local rents rise faster than your fixed mortgage rate.",
        ],
      },
      {
        heading: "Opportunity cost of the down payment",
        paragraphs: [
          "Twenty percent down is not free just because it becomes home equity. That cash could have sat in a boring index fund. A fair rent-vs-buy model asks what that money might have earned elsewhere, then credits the buyer with equity buildup and any appreciation you are willing to assume cautiously.",
          "I treat aggressive appreciation assumptions the same way I treat aggressive stock returns: interesting for a sensitivity case, dangerous as the only case.",
        ],
      },
      {
        heading: "Lifestyle is allowed to matter—just name it",
        paragraphs: [
          "Wanting a yard, a workshop, or the freedom to paint walls is legitimate. So is wanting mobility and a landlord who fixes the water heater at 11 p.m. Put those preferences next to the spreadsheet instead of pretending the spreadsheet includes them. The tool answers ‘which path looks cheaper under these assumptions.’ You still decide what you are optimizing for.",
        ],
      },
    ],
    takeaways: [
      "Short time horizons often favor renting once transaction costs are honest.",
      "Compare total ownership costs, not payment vs rent alone.",
      "Count the opportunity cost of the down payment.",
      "Let lifestyle preferences be explicit—not smuggled into fake appreciation rates.",
    ],
  },
  {
    slug: "credit-card-minimums-why-they-hurt",
    title: "Why credit card minimums feel safe and still hurt",
    description:
      "What minimum payments are designed to do, how long balances can linger, and a calmer way to choose an extra payment you can sustain.",
    published: "2026-09-05",
    updated: "2026-09-05",
    category: "Money",
    relatedToolHrefs: [
      {
        href: "/tools/credit-card-minimum-payment-calculator",
        label: "Credit card minimum payment calculator",
      },
      {
        href: "/tools/debt-avalanche-strategy-calculator",
        label: "Debt avalanche strategy calculator",
      },
      {
        href: "/tools/debt-snowball-strategy-calculator",
        label: "Debt snowball strategy calculator",
      },
    ],
    intro:
      "Minimum payments exist so the bank keeps the account current while interest keeps working. They are not a payoff plan. If you have ever looked at a statement, paid the minimum, and felt briefly responsible, you already know the trap: the emotional relief is immediate and the math is slow. Here is how to see the timeline clearly without turning money into a guilt spiral.",
    sections: [
      {
        heading: "What ‘minimum due’ usually means",
        paragraphs: [
          "Issuers commonly ask for a percentage of the balance (often around 1–3%) or a flat floor, whichever is higher, plus any fees or past-due amounts. On a large balance, that percentage can look manageable month to month while barely touching principal after interest posts.",
          "Run your actual APR and balance through a minimum-payment calculator. The payoff date is usually the moment people stop arguing with themselves. Decades for a five-figure balance at typical card rates is not rare if you never pay more than the minimum.",
        ],
      },
      {
        heading: "A concrete example",
        paragraphs: [
          "Imagine $6,500 at 22% APR with a minimum near 2% of the balance. Paying only the minimum can stretch far longer than it feels like it should, and the total interest can rival a chunk of the original balance. Add $75 or $100 above the minimum whenever you can, and the timeline compresses in a way that is hard to appreciate until you see both schedules side by side.",
          "You do not need a perfect budget overhaul on day one. You need a payment that clears interest with room left for principal—and that you can repeat on stressful months, not only on ideal ones.",
        ],
      },
      {
        heading: "Where extra dollars should go first",
        paragraphs: [
          "If you have multiple cards, two common approaches show up: avalanche (highest APR first) and snowball (smallest balance first). Avalanche usually saves more interest. Snowball sometimes wins on motivation because accounts disappear sooner. Either beats rotating minimums forever while lifestyle spending stays untouched.",
          "Also pause new charges on the card you are attacking. Paying down a balance while still dining on the same plastic is like bailing a boat with the tap open.",
        ],
      },
      {
        heading: "When a different product is worth considering",
        paragraphs: [
          "A 0% balance transfer or a personal loan can help if the fee is clear, the rate is truly lower, and you will not refill the old card. Those products fail when the transfer is treated as free capacity for new spending. The calculator on this site will not underwrite you; it will only show whether the payment plan is plausible on paper.",
        ],
      },
    ],
    takeaways: [
      "Minimums protect the issuer’s timeline more than yours.",
      "Even a modest recurring extra payment can cut years off payoff.",
      "Pick avalanche or snowball—then stop adding new charges to the target card.",
      "Refinancing only helps if behavior changes with the rate.",
    ],
  },
  {
    slug: "personal-loan-when-it-actually-helps",
    title: "When a personal loan actually helps (and when it just reshuffles stress)",
    description:
      "How to judge loan offers by APR, fees, and payoff timeline—plus the situations where consolidating debt is smart versus cosmetic.",
    published: "2026-09-05",
    updated: "2026-09-05",
    category: "Money",
    relatedToolHrefs: [
      {
        href: "/tools/personal-loan-calculator",
        label: "Personal loan calculator",
      },
      {
        href: "/tools/credit-card-minimum-payment-calculator",
        label: "Credit card minimum payment calculator",
      },
    ],
    intro:
      "A personal loan is a tool, not a personality upgrade. Used well, it can replace messy high-interest balances with one predictable payment. Used poorly, it adds a second debt while the old habits stay intact. I care about three questions: Is the all-in rate actually lower? Can you afford the payment without starving essentials? And what happens if income dips mid-loan?",
    sections: [
      {
        heading: "Read the offer like a skeptic",
        paragraphs: [
          "APR matters more than the advertised monthly payment. A longer term can make a payment feel painless while you pay more interest overall. Origination fees shrink the cash you receive, so compare the amount that lands in your account against the amount you repay.",
          "Plug the principal, rate, and term into a loan calculator and look at total interest, not just month one. If two offers have similar payments but different terms, the longer one is often the more expensive friendship.",
        ],
      },
      {
        heading: "Consolidation that works",
        paragraphs: [
          "Consolidating credit cards into a lower-APR installment loan can be rational when you close the behavioral loop: freeze or cut up the cards, automate the new payment, and keep a small emergency buffer so the next surprise does not go back on plastic.",
          "If the loan rate is only marginally better after fees, or if approval requires a co-signer you are not comfortable involving, pause. A mediocre refinance is not mandatory just because an ad followed you around the internet.",
        ],
      },
      {
        heading: "Consolidation that fails quietly",
        paragraphs: [
          "The classic failure mode is paying off cards with a loan, then running the cards back up because the available credit feels like found money. Six months later you have a loan payment and new card balances. The spreadsheet looked fine on signing day; the household cash flow did not change.",
        ],
        bullets: [
          "Do not count on future raises to rescue an oversized payment.",
          "Keep rent, groceries, and minimums covered before stretching for a shorter term.",
          "If you need the loan for a one-time expense, price the expense itself—do not borrow the lifestyle around it.",
        ],
      },
      {
        heading: "How I use the calculator with someone",
        paragraphs: [
          "We run the payment at the offered term, then again one term shorter and one longer. We ask which payment still leaves room for an emergency fund contribution. If only the longest term ‘fits,’ the loan may be too large for the current income, not ‘perfectly optimized.’",
        ],
      },
    ],
    takeaways: [
      "Compare APR, fees, and total interest—not payment comfort alone.",
      "Consolidation helps when rates drop and spending behavior changes.",
      "Longer terms can hide a loan that is simply too big.",
      "Stress-test the payment against a leaner month before you sign.",
    ],
  },
  {
    slug: "student-loans-payoff-without-panic",
    title: "Student loans: build a payoff plan without panic math",
    description:
      "How to think about extra payments, interest rates, and cash-flow tradeoffs—without treating every online rule of thumb as law.",
    published: "2026-09-05",
    updated: "2026-09-05",
    category: "Money",
    relatedToolHrefs: [
      {
        href: "/tools/student-loan-payoff-calculator",
        label: "Student loan payoff calculator",
      },
      {
        href: "/tools/debt-avalanche-strategy-calculator",
        label: "Debt avalanche strategy calculator",
      },
      {
        href: "/tools/emergency-fund-runway-planner",
        label: "Emergency fund runway planner",
      },
    ],
    intro:
      "Student debt sits in a weird emotional category: it funded something valuable, it lasts for years, and advice online swings between ‘ignore it forever’ and ‘austerity until it is gone.’ Neither extreme is a plan. A workable approach starts with your loan rate, your cash buffer, and whether extra payments beat other uses of the same dollar.",
    sections: [
      {
        heading: "Know what you actually owe",
        paragraphs: [
          "List each loan’s balance, rate, and minimum. Federal and private loans can behave differently on repayment options, but the cash-flow question is shared: what happens if you send an extra $100 or $200 a month to the highest rate first?",
          "A payoff calculator will show a shorter timeline and less total interest. That output is useful. It is not a moral score. If the aggressive plan deletes your ability to handle a car repair, it is too aggressive.",
        ],
      },
      {
        heading: "Order of operations I trust more than slogans",
        paragraphs: [
          "Cover essentials and required minimums. Build a small cash floor so you are not forced to put emergencies on a credit card. Capture any employer retirement match if available—that is a hard-to-beat return. Then decide whether extra dollars go to high-APR student loans, other debt, or investing based on rates and risk tolerance.",
          "People argue endlessly about investing versus loan payoff when rates are mid-single digits. Reasonable adults can disagree. What is not reasonable is skipping the emergency floor or the match while debating philosophy on a podcast.",
        ],
      },
      {
        heading: "A simple extra-payment experiment",
        paragraphs: [
          "Take your current minimum and add an amount you have already demonstrated you can spare for three months—not an aspirational gym-membership number. Run that through the student loan payoff calculator. If the interest saved feels meaningful and the payment still leaves breathing room, automate it. If it only works on paper during your best pay cycle, scale down until it is boringly sustainable.",
        ],
      },
      {
        heading: "Programs and caveats",
        paragraphs: [
          "Income-driven plans, forgiveness pathways, and refinancing into private loans each change the rules. Calculators on CalculioHub estimate payoff math from the inputs you enter; they do not replace reading your servicer’s terms or talking with a qualified advisor for edge cases. If forgiveness is central to your strategy, confirm eligibility before you accelerate payments in a way that cannot be undone.",
        ],
      },
    ],
    takeaways: [
      "Map every loan’s rate and minimum before you invent a strategy.",
      "Protect a cash floor and any employer match before over-optimizing payoff speed.",
      "Automate an extra payment you can survive in a normal month.",
      "Treat specialized repayment programs as rules to verify—not vibes.",
    ],
  },
  {
    slug: "mortgage-payment-what-youre-really-buying",
    title: "Your mortgage payment is not the full story",
    description:
      "How principal, interest, taxes, and insurance fit together—and why a payment you can ‘technically afford’ can still crowd out the rest of life.",
    published: "2026-09-05",
    updated: "2026-09-05",
    category: "Money",
    relatedToolHrefs: [
      {
        href: "/tools/monthly-mortgage-payment-calculator",
        label: "Monthly mortgage payment calculator",
      },
      {
        href: "/tools/home-affordability-calculator",
        label: "Home affordability calculator",
      },
      {
        href: "/tools/rent-vs-buy-long-term-calculator",
        label: "Rent vs buy long-term calculator",
      },
    ],
    intro:
      "Lender pre-approval answers a narrow question: will we get paid back under our rules? Your life asks a wider one: after this payment, can we still save, travel occasionally, and handle a broken HVAC without panic? A mortgage calculator helps translate price, rate, and term into a monthly number. Reading that number wisely is the human part.",
    sections: [
      {
        heading: "Principal and interest are only the start",
        paragraphs: [
          "The classic amortization payment covers principal and interest. In many places you also escrow property taxes and homeowners insurance, so the amount leaving your account each month is higher than the P&I quote that looked manageable in a text message.",
          "Ask for the estimated total housing payment early—taxes and insurance vary wildly by location. A house that ‘wins’ on sticker price can lose on escrow.",
        ],
      },
      {
        heading: "Term length changes the story",
        paragraphs: [
          "A 15-year loan usually means a higher payment and less total interest. A 30-year loan lowers the payment and raises lifetime interest. Neither is morally superior. If the 15-year payment forces you to skip retirement contributions, it may be the wrong flex. If the 30-year payment is comfortable, you can still send extra principal when life is calm—flexibility you do not get if you are barely surviving a shorter term.",
        ],
      },
      {
        heading: "Rate shopping without theater",
        paragraphs: [
          "A half-point difference on a large loan is real money over time. It is also easy to over-weight rate while under-weighting points, lender fees, and whether you can refinance later. Run two or three realistic rate scenarios in the calculator instead of anchoring on the single best teaser you saw in an ad.",
        ],
      },
      {
        heading: "Affordability is cash flow plus margin",
        paragraphs: [
          "I like a boring test: after the full housing payment, do you still fund a basic emergency buffer and retirement contribution without relying on a bonus? If the plan only works when everything goes right, the house is buying your stress for you.",
        ],
      },
    ],
    takeaways: [
      "Model taxes and insurance with principal and interest.",
      "Choose term length for cash-flow resilience, not ego.",
      "Compare a few rate scenarios, including fees in the real world.",
      "Leave margin for saving—not only for the mortgage clearing.",
    ],
  },
  {
    slug: "calorie-deficit-you-can-live-with",
    title: "A calorie deficit you can actually live with",
    description:
      "How to set a moderate deficit, why aggressive cuts backfire, and how to use a calculator without turning dinner into a spreadsheet fight.",
    published: "2026-09-05",
    updated: "2026-09-05",
    category: "Fitness",
    relatedToolHrefs: [
      {
        href: "/tools/calorie-deficit-calculator",
        label: "Calorie deficit calculator",
      },
      {
        href: "/tools/bulk-cut-macro-planner",
        label: "Bulk / cut macro planner",
      },
      {
        href: "/tools/protein-intake-calculator",
        label: "Protein intake calculator",
      },
    ],
    intro:
      "Weight change is mostly about energy balance over weeks, not virtue at a single meal. A deficit calculator estimates how much to eat relative to maintenance. The number is a starting line. If it leaves you exhausted, sleepless, or bargaining with yourself at 9 p.m., it is too aggressive—no matter how tidy the math looked.",
    sections: [
      {
        heading: "Maintenance first, ego second",
        paragraphs: [
          "You need a rough maintenance calorie level before a cut means anything. Online formulas use age, weight, height, and activity. They are estimates. If your weight has been stable for a month, your average intake over that month is better evidence than any formula.",
          "From maintenance, a modest deficit—often a few hundred calories—tends to beat crash cuts. Faster loss looks exciting for two weeks and then collides with hunger, training quality, and rebound.",
        ],
      },
      {
        heading: "What ‘moderate’ looks like in practice",
        paragraphs: [
          "Many people do well targeting roughly 0.5–1% of body weight per week as a pace, adjusting if energy or gym performance falls apart. Pair the calorie target with enough protein and some lifting so more of the loss comes from fat than from muscle you wanted to keep.",
          "Track weekly averages, not daily drama. Sodium, stress, and menstrual cycle timing can move the scale without meaning your plan failed overnight.",
        ],
      },
      {
        heading: "When the calculator is wrong for you",
        paragraphs: [
          "Athletes in heavy training blocks, people with a history of disordered eating, and anyone under medical care need individualized guidance beyond a webpage. A free tool cannot see your labs, your sleep, or your relationship with food. If cutting makes your life smaller in unhealthy ways, stop and talk to a qualified professional.",
        ],
      },
      {
        heading: "Make the plan boring enough to keep",
        paragraphs: [
          "The deficit that works is the one that still allows meals you recognize. Keep high-volume foods you like, schedule flexibility for social dinners, and decide in advance how you will handle weekends. Perfect adherence for nine days followed by a blowout is not a strategy—it is a cycle.",
        ],
      },
    ],
    takeaways: [
      "Estimate maintenance before you invent a deficit.",
      "Prefer a moderate cut you can sustain over a dramatic short sprint.",
      "Judge progress on weekly trends and how you feel training.",
      "Step away from DIY cutting if it harms your relationship with food.",
    ],
  },
  {
    slug: "protein-targets-without-obsession",
    title: "Protein targets without turning every meal into a project",
    description:
      "How to pick a daily protein range from body weight and goals—and how to hit it with normal food instead of living on shakes alone.",
    published: "2026-09-05",
    updated: "2026-09-05",
    category: "Fitness",
    relatedToolHrefs: [
      {
        href: "/tools/protein-intake-calculator",
        label: "Protein intake calculator",
      },
      {
        href: "/tools/calorie-deficit-calculator",
        label: "Calorie deficit calculator",
      },
      {
        href: "/tools/bulk-cut-macro-planner",
        label: "Bulk / cut macro planner",
      },
    ],
    intro:
      "Protein advice online splits into two camps: ‘eat like a bodybuilder or fail’ and ‘it does not matter at all.’ Most people training a few times a week land in the middle. A protein calculator gives a gram target from your weight and goal. Your job is to hit a sensible range most days without building a personality around chicken breast.",
    sections: [
      {
        heading: "Why protein shows up in every decent plan",
        paragraphs: [
          "Protein helps preserve muscle when you are in a calorie deficit and supports recovery when you lift. It is also filling, which makes adherence easier. That does not mean infinite protein is infinite progress. Past a point, extras mostly displace carbs and fats you may want for training energy.",
          "I treat the calculator output as a daily neighborhood—not a courtroom exhibit. Landing within a reasonable band beats missing entirely because the target felt impossible.",
        ],
      },
      {
        heading: "A practical way to hit the number",
        paragraphs: [
          "Anchor each meal with a protein source you already eat: eggs, dairy, fish, tofu, legumes, meat, or a shake when food is inconvenient. Spread intake across the day if that helps; total daily intake matters more than perfect timing for most non-elite lifters.",
          "If appetite is low while cutting, a shake earns its keep. If you enjoy cooking, whole food first keeps you sane and usually cheaper.",
        ],
      },
      {
        heading: "Common overcorrections",
        paragraphs: [
          "Chasing protein while ignoring total calories can stall fat loss. Ignoring protein while slashing calories can leave you softer than the scale suggests. And copying a 200-plus-gram target from a 100 kg competitor when you weigh 65 kg is how people burn out on meal prep.",
        ],
        bullets: [
          "Use body-weight-based ranges as a start, then adjust to adherence.",
          "Raise protein preference during cuts; keep it adequate during easy maintenance.",
          "Do not let supplements replace learning how to build a normal plate.",
        ],
      },
      {
        heading: "Reassess when life changes",
        paragraphs: [
          "New training blocks, aging, vegetarian shifts, or a medical diet all change what ‘enough’ looks like. Recalculate when weight moves meaningfully. And remember: calculators estimate. Persistent fatigue, injury, or clinical concerns belong with a professional, not another internet macro tweak.",
        ],
      },
    ],
    takeaways: [
      "Treat protein as a helpful daily range, not a purity test.",
      "Build meals around foods you will repeat.",
      "Keep calories and protein in the same conversation.",
      "Recalculate when weight, training, or diet pattern changes.",
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
