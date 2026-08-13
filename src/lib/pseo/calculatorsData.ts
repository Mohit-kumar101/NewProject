import type { Calculator } from "@/lib/types";
import type { PseoCategory, PseoFaq, PseoSchemaData, PseoTool } from "./types";
import { PSEO_CATEGORIES } from "./types";

function slugFromKeyword(keyword: string): string {
  return keyword
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/\//g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function clampMeta(text: string, max = 150): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  const last = cut.lastIndexOf(" ");
  return `${(last > 90 ? cut.slice(0, last) : cut).replace(/[.,;: ]+$/, "")}…`;
}

function definePseoTool(opts: {
  id: string;
  targetKeyword: string;
  category: PseoCategory;
  metaDescription: string;
  applicationCategory: PseoSchemaData["applicationCategory"];
  faqs: PseoFaq[];
  whatIsIt: string;
  formula: string;
  realWorldExample: string;
  whyItMatters: string;
  ready?: boolean;
}): PseoTool {
  const targetKeyword = opts.targetKeyword;
  return {
    id: opts.id,
    slug: slugFromKeyword(targetKeyword),
    targetKeyword,
    seoTitle: `${targetKeyword} (Free Online Calculator & Formula)`,
    metaDescription: clampMeta(opts.metaDescription),
    h1: targetKeyword,
    category: opts.category,
    schemaData: {
      applicationCategory: opts.applicationCategory,
      faqs: opts.faqs,
    },
    whatIsIt: opts.whatIsIt,
    formula: opts.formula,
    realWorldExample: opts.realWorldExample,
    whyItMatters: opts.whyItMatters,
    ready: opts.ready ?? true,
  };
}

export const PSEO_TOOLS: PseoTool[] = [
  definePseoTool({
    id: "saas-net-burn-runway",
    targetKeyword:
      "bootstrapped saas monthly net burn rate and runway calculator",
    category: "HR & Ops",
    applicationCategory: "BusinessApplication",
    ready: true,
    metaDescription:
      "Calculate bootstrapped SaaS net burn and runway from cash, revenue, and opex. Instant, free, no sign up.",
    whatIsIt:
      "A planning calculator for bootstrapped SaaS founders. It turns cash in the bank, monthly recurring (or total) revenue, and monthly operating expenses into net burn and months of runway—without a spreadsheet.",
    formula:
      "Net burn = monthly opex − monthly revenue. If net burn > 0, runway months = cash ÷ net burn. If revenue ≥ opex you are not burning (default-alive).",
    realWorldExample:
      "You have $180,000 cash, $22,000 monthly revenue, and $31,000 opex. Net burn is $9,000/month. Runway is 180,000 ÷ 9,000 = 20 months.",
    whyItMatters:
      "Headcount, contractor mix, and meeting load only make sense if you know how many months of oxygen remain. Runway is the constraint every other HR & ops decision sits on.",
    faqs: [
      {
        question: "What is monthly net burn rate for a bootstrapped SaaS?",
        answer:
          "Net burn is monthly operating expenses minus monthly revenue. Gross burn is opex alone. Investors and founders use net burn to estimate runway.",
      },
      {
        question: "How do you calculate SaaS runway from net burn?",
        answer:
          "Divide cash on hand by monthly net burn. Example: $180k cash and $9k net burn is 20 months of runway.",
      },
      {
        question: "What if the SaaS is profitable?",
        answer:
          "If revenue is greater than or equal to opex, net burn is zero or negative. Runway is not the binding constraint—you are default-alive.",
      },
    ],
  }),
  definePseoTool({
    id: "engineering-meeting-cost",
    targetKeyword:
      "how much does a 1 hour engineering team meeting cost calculator",
    category: "HR & Ops",
    applicationCategory: "BusinessApplication",
    ready: true,
    metaDescription:
      "Price a 1-hour engineering meeting from loaded salaries and headcount. Free online tool, instant, no email.",
    whatIsIt:
      "Estimates the fully loaded cost of a one-hour engineering meeting so standups, planning, and design reviews have a dollar figure—not just a calendar block.",
    formula:
      "Meeting cost = Σ (loaded hourly rate × hours) for each attendee. Loaded hourly ≈ annual loaded cost ÷ 2,080 hours.",
    realWorldExample:
      "Six engineers at $180k loaded ($86.54/hour) in a 1-hour sync costs about $519. A daily standup is ~$2,600/week.",
    whyItMatters:
      "Engineering time is usually the most expensive calendar on the team. Seeing the cost makes it easier to cut attendees, shorten the meeting, or replace it with async.",
    faqs: [
      {
        question: "How much does a 1 hour engineering team meeting cost?",
        answer:
          "Multiply each attendee’s fully loaded hourly rate by one hour and sum. A six-person team at ~$180k loaded is often $400–$600 per hour.",
      },
      {
        question: "What is a loaded hourly rate?",
        answer:
          "Annual salary plus benefits, taxes, equipment, and overhead, divided by working hours (commonly 2,080).",
      },
    ],
  }),
  definePseoTool({
    id: "ai-support-roi",
    targetKeyword: "ai customer support agent cost savings roi formula",
    category: "HR & Ops",
    applicationCategory: "BusinessApplication",
    ready: true,
    metaDescription:
      "Compare AI support agent cost vs human tickets deflected. Instant ROI formula, free, no sign up.",
    whatIsIt:
      "Compares the cost of an AI customer-support agent (software + review labor) with the human handle cost of tickets it deflects, then reports savings and ROI.",
    formula:
      "Monthly savings = tickets deflected × human cost per ticket − AI stack cost. ROI % = savings ÷ AI stack cost × 100.",
    realWorldExample:
      "4,000 tickets/month, 35% deflection, $4.50 human cost/ticket, $1,200 AI cost → 1,400 × $4.50 − $1,200 = $5,100 saved (425% ROI).",
    whyItMatters:
      "Support headcount is a large opex line. A clear ROI formula stops both hype (“AI replaces the team”) and underinvestment (“chatbots never work”).",
    faqs: [
      {
        question: "What is the AI customer support agent cost savings ROI formula?",
        answer:
          "Savings equal deflected tickets times human cost per ticket, minus AI software and review cost. ROI is savings divided by that AI cost.",
      },
      {
        question: "Should I count only fully resolved tickets?",
        answer:
          "Yes for conservative ROI. Partial deflection still needs human time—use a lower deflection rate or a residual handle-time cost.",
      },
    ],
  }),
  definePseoTool({
    id: "1099-vs-w2-true-cost",
    targetKeyword:
      "1099 contractor vs W2 employee true cost difference calculator",
    category: "HR & Ops",
    applicationCategory: "BusinessApplication",
    ready: true,
    metaDescription:
      "Compare 1099 contractor rate vs W2 loaded cost (taxes, benefits, PTO). Free, instant, no sign up.",
    whatIsIt:
      "Shows the true cost gap between a 1099 contractor’s bill rate and a W2 employee’s fully loaded cost—payroll taxes, benefits, PTO, equipment, and employer overhead.",
    formula:
      "W2 loaded = salary × (1 + tax% + benefits% + overhead%) + fixed costs. Contractor cost = bill rate × hours. Difference = W2 loaded − contractor (same hours).",
    realWorldExample:
      "W2 at $140k + 30% load ≈ $182k. A 1099 at $95/hour × 1,880 hours ≈ $178,600. The “cheaper contractor” may not be cheaper.",
    whyItMatters:
      "Hiring mix is a cash decision for bootstrapped teams. Mis-pricing 1099 vs W2 distorts burn, equity, and compliance risk.",
    faqs: [
      {
        question: "Is a 1099 contractor always cheaper than a W2 employee?",
        answer:
          "Not always. W2 loaded cost includes taxes and benefits; contractors bill a higher hourly rate and you still pay management time. Compare equal productive hours.",
      },
      {
        question: "What load factor should I use on W2 salary?",
        answer:
          "Many US software teams use 25–40% on top of salary for taxes, benefits, and overhead, plus laptop and tools as fixed costs.",
      },
    ],
  }),
  definePseoTool({
    id: "cost-to-hire-developer",
    targetKeyword:
      "average cost to hire a software developer breakdown calculator",
    category: "HR & Ops",
    applicationCategory: "BusinessApplication",
    ready: true,
    metaDescription:
      "Break down recruiter fees, ads, interview time, and tools to hire a developer. Free online calculator.",
    whatIsIt:
      "Itemizes what it actually costs to hire one software developer: job ads, recruiter or agency fees, internal interview hours, take-home reviews, and tools.",
    formula:
      "Cost to hire = ads + agency/recruiter + (interview hours × loaded rate) + assessment tools + signing extras.",
    realWorldExample:
      "$1,200 ads + 20% of $160k agency ($32k) + 40 interview hours × $90 ($3,600) + $400 tools ≈ $37,200 before the first paycheck.",
    whyItMatters:
      "Replacing or adding an engineer is not “just salary.” A breakdown keeps recruiting spend honest next to runway and product roadmap.",
    faqs: [
      {
        question: "What is the average cost to hire a software developer?",
        answer:
          "Internal-only searches can land in the low thousands; agency-led senior hires often add 15–25% of first-year salary plus interview time.",
      },
      {
        question: "Should I include founder interview time?",
        answer:
          "Yes. Founder and senior-engineer hours are usually the largest hidden line after agency fees.",
      },
    ],
  }),
  definePseoTool({
    id: "engineer-turnover-replacement",
    targetKeyword:
      "true cost to replace a software engineer turnover calculator",
    category: "HR & Ops",
    applicationCategory: "BusinessApplication",
    metaDescription:
      "Estimate turnover cost to replace a software engineer: hiring, ramp, and lost output. Free, instant.",
    whatIsIt:
      "Estimates the fully loaded cost of losing a software engineer: recruiting, vacancy drag, onboarding ramp, and knowledge lost—not just a job-board invoice.",
    formula:
      "Replacement cost = cost to hire + (vacancy months × role output value) + ramp months × (1 − productivity%) × loaded pay + knowledge/severance extras.",
    realWorldExample:
      "Hire cost $28k + 2 months vacancy at $12k/month impact + 3 months at 50% of $15k loaded pay ≈ $28k + $24k + $22.5k = $74.5k.",
    whyItMatters:
      "Retention is often cheaper than a “we’ll just backfill.” This number is what you compare against a raise, equity refresh, or manager time.",
    faqs: [
      {
        question: "How much does it cost to replace a software engineer?",
        answer:
          "Studies and internal models often land between 50–150% of annual loaded cost once hiring, vacancy, and ramp are included. Use your own rates in this formula.",
      },
      {
        question: "Does this include product delay?",
        answer:
          "Only if you assign a dollar value to vacancy or delayed shipping. The formula leaves that as an explicit input so you do not invent revenue.",
      },
    ],
  }),
  definePseoTool({
    id: "prorated-pto-accrual",
    targetKeyword: "prorated pto accrual per pay period calculator",
    category: "HR & Ops",
    applicationCategory: "BusinessApplication",
    metaDescription:
      "Prorate annual PTO into each pay period for mid-year hires. Free online tool, instant, no sign up.",
    whatIsIt:
      "Converts an annual PTO grant into the hours or days earned each pay period, including mid-year start dates and remaining periods in the year.",
    formula:
      "Accrual per period = (annual PTO × remaining work year fraction) ÷ remaining pay periods. Or annual PTO ÷ pay periods per year for a full year.",
    realWorldExample:
      "15 days/year, 24 pay periods, hired July 1 (12 periods left): 15 × 0.5 = 7.5 days; 7.5 ÷ 12 = 0.625 days per paycheck.",
    whyItMatters:
      "Ops and payroll need a number that matches the handbook. Proration mistakes create disputes in the first 90 days of a hire.",
    faqs: [
      {
        question: "How do you prorate PTO accrual per pay period?",
        answer:
          "Take the annual grant, scale it by the fraction of the year remaining, then divide by the number of remaining pay periods.",
      },
      {
        question: "Do US states require a specific proration method?",
        answer:
          "Policies vary. This tool is a planning formula—follow your handbook and local wage rules, not this estimate alone.",
      },
    ],
  }),
  definePseoTool({
    id: "time-and-half-overtime",
    targetKeyword: "time and a half weekly overtime pay calculator",
    category: "HR & Ops",
    applicationCategory: "BusinessApplication",
    metaDescription:
      "Calculate time-and-a-half overtime from hourly rate and weekly hours over 40. Free, instant, no email.",
    whatIsIt:
      "Computes weekly overtime pay at time-and-a-half for hours above a 40-hour threshold, plus regular pay and total weekly earnings.",
    formula:
      "OT hours = max(0, weekly hours − 40). OT pay = OT hours × hourly rate × 1.5. Regular pay = min(hours, 40) × rate. Total = regular + OT.",
    realWorldExample:
      "$32/hour and 48 hours: 40 × $32 = $1,280 regular; 8 × $48 = $384 OT; total $1,664.",
    whyItMatters:
      "Shift-based teams blow payroll when OT is guessed. A weekly time-and-a-half figure is what restaurant, warehouse, and support managers actually need.",
    faqs: [
      {
        question: "How does time and a half weekly overtime pay work?",
        answer:
          "Under the common US FLSA weekly rule, hours over 40 in a workweek are paid at 1.5× the regular hourly rate unless an exemption applies.",
      },
      {
        question: "Does this cover daily overtime states?",
        answer:
          "No. Some jurisdictions (for example California) also use daily OT. This calculator models the weekly 40-hour time-and-a-half rule only.",
      },
    ],
  }),
  definePseoTool({
    id: "restaurant-shift-labor",
    targetKeyword: "restaurant weekly shift schedule labor cost estimator",
    category: "HR & Ops",
    applicationCategory: "BusinessApplication",
    metaDescription:
      "Estimate restaurant weekly labor from shifts, wage, and headcount. Free online estimator, no sign up.",
    whatIsIt:
      "Rolls a week of restaurant shifts into labor cost: roles, hours, wage rates, and a simple labor-to-sales check if you enter weekly sales.",
    formula:
      "Weekly labor = Σ (shifts × hours per shift × wage × people). Labor % = weekly labor ÷ weekly sales.",
    realWorldExample:
      "FOH: 40 shifts × 6h × $18 = $4,320. BOH: 28 × 8h × $22 = $4,928. Weekly labor $9,248. On $32k sales that is 28.9%.",
    whyItMatters:
      "Labor % is the ops lever restaurants watch weekly. Estimating it from the actual shift grid beats last month’s P&L.",
    faqs: [
      {
        question: "What is a healthy restaurant weekly labor cost percentage?",
        answer:
          "Many full-service rooms target roughly 25–35% of sales all-in; quick service can run lower. Use your concept, not a universal rule.",
      },
      {
        question: "Should overtime be included?",
        answer:
          "Yes if anyone exceeds 40 hours. Pair this estimator with the time-and-a-half weekly overtime calculator for those people.",
      },
    ],
  }),
  definePseoTool({
    id: "solo-dev-minimum-rate",
    targetKeyword: "minimum hourly rate formula for solo software developer",
    category: "HR & Ops",
    applicationCategory: "BusinessApplication",
    metaDescription:
      "Set a solo developer minimum hourly rate from salary target, utilization, and costs. Free formula tool.",
    whatIsIt:
      "Backs into the minimum billable hourly rate a solo software developer needs to hit a take-home target after utilization, taxes, tools, and unpaid time.",
    formula:
      "Minimum rate = (target take-home + annual costs + tax buffer) ÷ (billable hours). Billable hours = 52 × weekly hours × utilization%.",
    realWorldExample:
      "Want $140k net-equivalent, $12k costs, 70% utilization, 30 hours/week → 52×30×0.7 = 1,092 hours. ($140k+$12k) ÷ 1,092 ≈ $139/hour before profit margin.",
    whyItMatters:
      "Underpricing is the default for solo developers. A floor rate protects runway better than matching the last Upwork bid.",
    faqs: [
      {
        question: "What is the minimum hourly rate formula for a solo developer?",
        answer:
          "Add the income you need plus annual business costs, then divide by realistic billable hours after utilization—not 2,080 desk hours.",
      },
      {
        question: "What utilization should I assume?",
        answer:
          "50–70% is common once sales, admin, and unpaid revisions are included. 100% utilization is a planning error.",
      },
    ],
  }),
  definePseoTool({
    id: "bc-used-car-pst-black-book",
    targetKeyword: "bc used car private sale pst calculator black book value",
    category: "BC Local Taxes",
    applicationCategory: "FinanceApplication",
    metaDescription:
      "Estimate BC private-sale used-car PST from price vs Black Book. 2026 luxury tiers, free, instant.",
    whatIsIt:
      "Estimates British Columbia PST on a private-sale used vehicle using the greater of purchase price or Canadian Black Book wholesale value, including 2026 luxury tiers and the zero-emission exemption.",
    formula:
      "Taxable value = max(purchase price, Black Book wholesale). PST = 0% if ZEV; else 12% under $125k, 15% from $125k–$149,999, 20% at $150k+.",
    realWorldExample:
      "Sale $14,000 but Black Book wholesale $18,500, not a ZEV: taxable $18,500 × 12% = $2,220 PST.",
    whyItMatters:
      "A handshake price below market does not cut ICBC tax if wholesale value is higher. Buyers who skip this math get a surprise at transfer.",
    faqs: [
      {
        question:
          "Does ICBC use purchase price or Black Book for private sale PST?",
        answer:
          "Generally the greater of the two. Enter both numbers; this tool taxes the higher figure.",
      },
      {
        question: "What are the 2026 BC used-vehicle PST luxury tiers?",
        answer:
          "ZEVs 0%; under $125,000 at 12%; $125,000–$149,999 at 15%; $150,000+ at 20%. Confirm with ICBC at transfer.",
      },
    ],
  }),
  definePseoTool({
    id: "bc-ptt-first-time-buyer-2026",
    targetKeyword:
      "bc property transfer tax first time home buyer exemption calculator 2026",
    category: "BC Local Taxes",
    applicationCategory: "FinanceApplication",
    metaDescription:
      "Estimate 2026 BC property transfer tax with first-time home buyer exemption. Free, instant, no sign up.",
    whatIsIt:
      "Estimates British Columbia property transfer tax (PTT) on a home purchase and applies the first-time home buyer exemption thresholds used for 2026 planning.",
    formula:
      "PTT is tiered on fair market value (commonly 1% on the first $200k, 2% on the next $1.8M, then higher bands). FTHB exemption reduces or eliminates PTT up to published value caps.",
    realWorldExample:
      "A qualifying first-time buyer on a $500,000 principal residence may see PTT reduced or waived within current exemption limits—run both “full PTT” and “FTHB” to compare.",
    whyItMatters:
      "Closing-cost surprises kill deals. First-time buyers in B.C. need the exemption math next to lawyer and inspection fees—not after the offer is firm.",
    faqs: [
      {
        question: "How does the BC first-time home buyer PTT exemption work?",
        answer:
          "Qualifying buyers of a qualifying principal residence can reduce or eliminate PTT up to a fair-market-value threshold. Eligibility and caps change—verify on the current B.C. government tables.",
      },
      {
        question: "Is this official 2026 government tax software?",
        answer:
          "No. It is a free planning calculator. Use the latest Ministry of Finance / gov.bc.ca figures for filing.",
      },
    ],
  }),
  definePseoTool({
    id: "bc-stat-holiday-pay",
    targetKeyword: "bc stat holiday pay calculator average days pay formula",
    category: "BC Local Taxes",
    applicationCategory: "FinanceApplication",
    metaDescription:
      "Calculate BC statutory holiday pay from average day’s pay. Free online formula, instant, no email.",
    whatIsIt:
      "Applies the British Columbia average day’s pay formula for statutory holiday pay when an employee qualifies and either works or does not work the holiday.",
    formula:
      "Average day’s pay ≈ total wages in the 30 calendar days before the stat ÷ days worked in that window (B.C. ESA method). Holiday pay is typically an average day’s pay; if they work the stat, premium pay stacks on top.",
    realWorldExample:
      "Wages $2,400 over 18 days worked in the prior 30 days → average day = $133.33. That is the stat holiday amount if they have the day off and qualify.",
    whyItMatters:
      "Restaurants, retail, and warehouses in B.C. mis-pay stats more than regular OT. Average day’s pay is the rule, not “just 8 hours at base.”",
    faqs: [
      {
        question: "What is the BC stat holiday average day’s pay formula?",
        answer:
          "Generally, total wages (including some commissions) in the 30 days before the holiday, divided by days worked in that period. Confirm current ESA wording.",
      },
      {
        question: "Do part-time staff get BC stat pay?",
        answer:
          "If they meet the Employment Standards Act qualifying tests (including days worked in the 30-day window), they can still receive average day’s pay.",
      },
    ],
  }),
  definePseoTool({
    id: "mt4-usd-jpy-lot-risk",
    targetKeyword: "mt4 usd/jpy precise lot size risk calculator",
    category: "Specialized Business",
    applicationCategory: "FinanceApplication",
    metaDescription:
      "Size MT4 USD/JPY lots from account risk %, stop pips, and balance. Free, instant, no sign up.",
    whatIsIt:
      "Computes a precise MetaTrader 4 lot size for USD/JPY from account balance, risk percent, stop-loss in pips, and pip value so the cash risk matches the plan.",
    formula:
      "Cash risk = balance × risk%. Pip value per lot on USD/JPY ≈ (0.01 / USDJPY) × lot currency factor. Lots = cash risk ÷ (stop pips × pip value per 1.00 lot).",
    realWorldExample:
      "$10,000 account, 0.5% risk ($50), 25-pip stop on USDJPY. If a 1.00 lot risks ~$6.60/pip, lots ≈ 50 ÷ (25 × 6.60) ≈ 0.30 lots.",
    whyItMatters:
      "USD/JPY pip value is not $10 the way EURUSD often is. Guessing lot size is how small accounts blow up on a “normal” stop.",
    faqs: [
      {
        question: "How do you calculate MT4 USD/JPY lot size from risk?",
        answer:
          "Convert risk % to cash, then divide by (stop pips × pip value of 1.00 lot). USD/JPY pip value depends on the quote and account currency.",
      },
      {
        question: "Is this financial advice?",
        answer:
          "No. It is a position-sizing formula for education. Leverage can wipe the account regardless of lot math.",
      },
    ],
  }),
  definePseoTool({
    id: "warehouse-picker-lph",
    targetKeyword: "warehouse picker lines per hour labor cost calculator",
    category: "Specialized Business",
    applicationCategory: "BusinessApplication",
    metaDescription:
      "Turn picker lines per hour into labor cost per line and per shift. Free online calculator, no sign up.",
    whatIsIt:
      "Converts warehouse picker productivity (lines per hour) and loaded wage into labor cost per line, per order, and per shift so ops can staff a wave.",
    formula:
      "Cost per line = loaded hourly wage ÷ lines per hour. Shift cost = wage × hours × pickers. Lines per shift = LPH × hours × pickers.",
    realWorldExample:
      "$24 loaded wage, 85 lines/hour → $0.28/line. Four pickers × 8 hours = 2,720 lines and $768 labor.",
    whyItMatters:
      "Fulfillment quotes and overtime both fail when you do not know cost per line. LPH is the ops unit; dollars per line is the decision unit.",
    faqs: [
      {
        question: "How do you calculate warehouse picker labor cost from LPH?",
        answer:
          "Divide loaded hourly cost by lines picked per hour to get cost per line. Multiply by expected lines to budget the shift.",
      },
      {
        question: "What is a typical picker lines-per-hour rate?",
        answer:
          "It varies wildly by SKU mix, slotting, and WMS. Use your own engineered or trailing LPH—not a blog average.",
      },
    ],
  }),
  definePseoTool({
    id: "faceless-youtube-rpm-breakeven",
    targetKeyword:
      "faceless youtube channel automation break even rpm calculator",
    category: "Specialized Business",
    applicationCategory: "BusinessApplication",
    metaDescription:
      "Find faceless YouTube automation break-even views from RPM and monthly costs. Free, instant.",
    whatIsIt:
      "Finds how many views a faceless/automated YouTube channel needs to break even given RPM (or CPM after share), outsourcing costs, tools, and ads.",
    formula:
      "Monthly net from ads ≈ views × (RPM / 1000). Break-even views = monthly costs ÷ (RPM / 1000). Profit = ad revenue − costs.",
    realWorldExample:
      "$1,800/month editors+tools, $8 RPM → break-even views = 1,800 ÷ 0.008 = 225,000 views/month.",
    whyItMatters:
      "Faceless automation channels die on cost, not on “the niche.” Break-even RPM math tells you whether outsourcing is a business or a hobby.",
    faqs: [
      {
        question: "How do you calculate faceless YouTube break-even from RPM?",
        answer:
          "Divide monthly production and tool costs by RPM/1000 to get the views required to cover those costs before tax.",
      },
      {
        question: "Is RPM the same as CPM?",
        answer:
          "No. RPM is revenue per 1,000 views after YouTube’s share and eligible views. Use your YouTube Studio RPM, not sold CPM.",
      },
    ],
  }),
  definePseoTool({
    id: "dropshipping-breakeven-roas",
    targetKeyword:
      "dropshipping true break even roas and profit margin calculator",
    category: "Specialized Business",
    applicationCategory: "BusinessApplication",
    metaDescription:
      "Get true dropshipping break-even ROAS after COGS, ads, and fees. Free margin calculator, no sign up.",
    whatIsIt:
      "Calculates the true break-even ROAS and profit margin for a dropshipping SKU after product cost, shipping, transaction fees, returns, and ad spend.",
    formula:
      "Contribution per order = price − COGS − shipping − fees − return reserve. Break-even ROAS = price ÷ contribution. Margin % = contribution ÷ price.",
    realWorldExample:
      "$49 price, $14 COGS, $6 ship, 3% fee ($1.47), $2 return reserve → contribution $25.53. Break-even ROAS ≈ 49 / 25.53 = 1.92.",
    whyItMatters:
      "A 2.0 ROAS target is meaningless if contribution is thin. True break-even ROAS is the number that should gate every ad campaign.",
    faqs: [
      {
        question: "What is true break-even ROAS for dropshipping?",
        answer:
          "It is selling price divided by contribution after COGS, shipping, payment fees, and a return allowance—not price minus product cost only.",
      },
      {
        question: "Should I include my own time?",
        answer:
          "For cash break-even, no. For a real wage, add a monthly owner draw into costs and recompute required ROAS.",
      },
    ],
  }),
  definePseoTool({
    id: "pm-vs-downtime-cost",
    targetKeyword:
      "facility equipment preventative maintenance vs downtime cost calculator",
    category: "Specialized Business",
    applicationCategory: "UtilitiesApplication",
    metaDescription:
      "Compare preventative maintenance cost vs downtime loss on facility equipment. Free, instant, no email.",
    whatIsIt:
      "Compares planned preventative maintenance (PM) spend with the expected cost of unplanned downtime—lost output, overtime, and emergency repair—for a facility asset.",
    formula:
      "PM cost = visits × (labor + parts). Downtime cost = failure probability × hours down × (lost margin/hour + emergency repair). Choose the lower expected cost.",
    realWorldExample:
      "PM $2,400/year vs 15% chance of a 10-hour outage at $1,800/hour + $4,000 emergency = 0.15 × ($18,000+$4,000) = $3,300 expected. PM wins by $900.",
    whyItMatters:
      "Skipping PM looks cheap until a line stops. This is the ops conversation between maintenance and finance in one formula.",
    faqs: [
      {
        question:
          "How do you compare preventative maintenance vs downtime cost?",
        answer:
          "Put an annual dollar figure on PM, then estimate expected failure cost as probability × (downtime hours × loss rate + emergency repair). Compare expected values.",
      },
      {
        question: "Where do I get failure probability?",
        answer:
          "Use CMMS history, OEM MTBF, or a conservative range. The calculator is only as honest as that input.",
      },
    ],
  }),
];

export const PSEO_SLUGS = new Set(PSEO_TOOLS.map((t) => t.slug));

export function getPseoToolBySlug(slug: string): PseoTool | undefined {
  return PSEO_TOOLS.find((t) => t.slug === slug);
}

export function getPseoToolById(id: string): PseoTool | undefined {
  return PSEO_TOOLS.find((t) => t.id === id);
}

export function isPseoSlug(slug: string): boolean {
  return PSEO_SLUGS.has(slug);
}

export function pseoToolsAsCalculators(): Calculator[] {
  return PSEO_TOOLS.map((tool) => ({
    slug: tool.slug,
    title: tool.h1,
    category: tool.category,
    description: tool.metaDescription,
    inputs: [],
    formulaType: tool.id,
    seoContent: {
      intro: tool.whatIsIt,
      howToUse: [
        "Enter the inputs in the calculator above.",
        "Read the live result and compare it to the formula below.",
        "Use the real-world example to sanity-check your numbers.",
      ],
      faqs: tool.schemaData.faqs,
    },
    seoTitle: tool.seoTitle,
    seoDescription: tool.metaDescription,
    seoH1: tool.h1,
    seoKeywords: [
      tool.targetKeyword,
      "free online calculator",
      "no sign up",
      "instant calculation",
      "formula & step-by-step example",
    ],
  }));
}

export { PSEO_CATEGORIES };
