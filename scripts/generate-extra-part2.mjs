import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const i = (id, label, defaultValue, min, max, step) => ({
  id,
  label,
  defaultValue,
  min,
  max,
  step,
});
const f = (question, answer) => ({ question, answer });

function calc({
  slug,
  title,
  category,
  description,
  formulaType,
  inputs,
  intro,
  howToUse,
  faqs,
}) {
  return {
    slug,
    title,
    category,
    description,
    inputs,
    formulaType,
    seoContent: { intro, howToUse, faqs },
  };
}

const LEGAL = "Legal, HR & Payroll Management";
const AUTO = "Automotive, Travel & Transit";
const LIFE = "Media, Photography, Cooking & Lifestyle";

const extra = [
  // ——— Legal / HR (20) ———
  calc({
    slug: "severance-pay-calculator",
    title: "Severance Pay Calculator",
    category: LEGAL,
    description:
      "Estimate severance packages from salary and weeks offered. Plan finances during a job transition.",
    formulaType: "severancePay",
    inputs: [
      i("annualSalary", "Annual Salary ($)", 90000, 20000, 500000, 1000),
      i("weeks", "Severance Weeks", 8, 1, 52, 1),
      i("bonus", "Additional Lump Sum ($)", 0, 0, 100000, 500),
    ],
    intro:
      "Severance pay cushions income after a separation. Estimate total package value from weekly pay equivalents plus any lump-sum additions.",
    howToUse: [
      "Enter your annual salary.",
      "Set offered severance weeks.",
      "Add any lump-sum bonus and review total severance.",
    ],
    faqs: [
      f("Is severance legally required?", "In many jurisdictions it is not automatic—terms depend on contracts and local law."),
      f("Are benefits included?", "This estimate covers cash pay only, not COBRA or equity treatment."),
      f("Is severance taxable?", "Usually yes as ordinary income—confirm with a tax advisor."),
    ],
  }),
  calc({
    slug: "pto-accrual-calculator",
    title: "PTO Accrual Calculator",
    category: LEGAL,
    description:
      "Calculate paid time off accrued from hours worked and accrual rates. Track leave balances accurately.",
    formulaType: "ptoAccrual",
    inputs: [
      i("hoursWorked", "Hours Worked", 80, 1, 300, 1),
      i("accrualRate", "PTO Hours per Hour Worked", 0.05, 0.01, 0.5, 0.005),
      i("currentBalance", "Current PTO Balance (hours)", 20, 0, 500, 1),
    ],
    intro:
      "PTO policies often accrue leave as a fraction of hours worked. Estimate newly earned PTO and updated balances for a pay period.",
    howToUse: [
      "Enter hours worked in the period.",
      "Input your accrual rate.",
      "Add current balance and review new totals.",
    ],
    faqs: [
      f("What is a typical accrual rate?", "It varies widely—annual PTO hours divided by yearly work hours is a common derivation."),
      f("Do overtime hours accrue PTO?", "Policy-specific—check your handbook."),
      f("What about caps?", "Many plans stop accruing at a maximum balance."),
    ],
  }),
  calc({
    slug: "fmla-leave-duration-calculator",
    title: "FMLA Leave Duration Calculator",
    category: LEGAL,
    description:
      "Estimate remaining FMLA leave from entitlement and days already used. Track protected leave availability.",
    formulaType: "fmlaLeave",
    inputs: [
      i("entitlementWeeks", "Entitlement Weeks", 12, 1, 26, 1),
      i("usedDays", "Days Already Used", 10, 0, 130, 1),
      i("workweekDays", "Days in Workweek", 5, 1, 7, 1),
    ],
    intro:
      "FMLA leave is typically measured in weeks of protected time. Convert used days into remaining entitlement so employees and HR can plan coverage.",
    howToUse: [
      "Enter total entitlement weeks.",
      "Add days already used.",
      "Confirm workweek length and review remaining leave.",
    ],
    faqs: [
      f("Is FMLA always 12 weeks?", "Twelve weeks is common for many qualifying reasons; some military-related leave differs."),
      f("Does intermittent leave count?", "Yes—used increments reduce remaining entitlement."),
      f("Is this legal advice?", "No—it is an estimate; HR/legal counsel should confirm eligibility."),
    ],
  }),
  calc({
    slug: "workers-compensation-calculator",
    title: "Workers Compensation Calculator",
    category: LEGAL,
    description:
      "Estimate temporary disability weekly benefits from wage replacement percentage. Rough-plan injury income support.",
    formulaType: "workersComp",
    inputs: [
      i("avgWeeklyWage", "Average Weekly Wage ($)", 1200, 100, 10000, 25),
      i("replacementRate", "Replacement Rate (%)", 66.67, 40, 100, 0.01),
      i("weeks", "Benefit Weeks", 12, 1, 520, 1),
    ],
    intro:
      "Workers’ compensation temporary disability benefits often replace a portion of average weekly wages. Estimate weekly and total benefits for planning conversations.",
    howToUse: [
      "Enter average weekly wage.",
      "Set the wage replacement percentage used in your jurisdiction.",
      "Add benefit duration and review totals.",
    ],
    faqs: [
      f("Are caps applied?", "Many states cap weekly benefits—this tool does not apply local maximums."),
      f("Is this an official claim amount?", "No—claims administrators determine final benefits."),
      f("Do medical costs count here?", "This estimate covers indemnity wage benefits only."),
    ],
  }),
  calc({
    slug: "employee-turnover-rate-calculator",
    title: "Employee Turnover Rate Calculator",
    category: LEGAL,
    description:
      "Calculate employee turnover rate for a period from separations and average headcount. Monitor retention health.",
    formulaType: "employeeTurnover",
    inputs: [
      i("separations", "Separations", 18, 0, 5000, 1),
      i("avgHeadcount", "Average Headcount", 200, 1, 100000, 1),
    ],
    intro:
      "Turnover rate is a core HR health metric. Divide separations by average headcount to express attrition as a percentage for the period.",
    howToUse: [
      "Enter number of employees who left.",
      "Enter average headcount for the same period.",
      "Review turnover rate percentage.",
    ],
    faqs: [
      f("Should I include involuntary exits?", "Usually yes for overall turnover; track voluntary separately for deeper insight."),
      f("Monthly vs annual?", "Be consistent—annualize carefully if comparing periods."),
      f("What is a good rate?", "Benchmarks vary by industry and role type."),
    ],
  }),
  calc({
    slug: "payroll-tax-estimator-calculator",
    title: "Payroll Tax Estimator Calculator",
    category: LEGAL,
    description:
      "Estimate employer payroll tax burden from wages and combined tax rates. Budget fully loaded labor costs.",
    formulaType: "payrollTax",
    inputs: [
      i("grossWages", "Gross Wages ($)", 5000, 100, 100000, 50),
      i("employerTaxRate", "Employer Tax Rate (%)", 7.65, 0, 20, 0.01),
      i("otherTaxes", "Other Employer Taxes ($)", 50, 0, 5000, 5),
    ],
    intro:
      "Employer-side payroll taxes add meaningful cost beyond wages. Estimate tax load for a pay period to understand true employment expense.",
    howToUse: [
      "Enter gross wages for the period.",
      "Set combined employer tax rate percentage.",
      "Add other fixed employer taxes and review totals.",
    ],
    faqs: [
      f("What is commonly in 7.65%?", "It often references employer Social Security and Medicare portions in the U.S."),
      f("Are unemployment taxes included?", "Add them under other taxes or increase the rate."),
      f("Does this include employee withholding?", "No—this focuses on employer cost."),
    ],
  }),
  calc({
    slug: "contractor-vs-w2-employee-calculator",
    title: "Contractor vs W2 Employee Calculator",
    category: LEGAL,
    description:
      "Compare total cost of a W2 hire versus a contractor rate. Make staffing model decisions with clearer math.",
    formulaType: "contractorVsW2",
    inputs: [
      i("w2Salary", "W2 Annual Salary ($)", 90000, 20000, 400000, 1000),
      i("burdenRate", "Employer Burden (%)", 25, 5, 60, 1),
      i("contractorHourly", "Contractor Hourly Rate ($)", 75, 10, 500, 1),
      i("hours", "Annual Hours", 1800, 200, 3000, 10),
    ],
    intro:
      "Contractors quote higher hourly rates, while W2 employees add benefits and tax burden. Compare annualized cost under both staffing models.",
    howToUse: [
      "Enter W2 salary and employer burden percentage.",
      "Enter contractor hourly rate and expected annual hours.",
      "Compare total annual cost for each option.",
    ],
    faqs: [
      f("What is burden rate?", "Extra employer cost such as taxes, benefits, and insurance as a percent of wages."),
      f("Is classification only about cost?", "No—legal classification tests matter more than price."),
      f("Which is cheaper?", "It depends on hours, benefits, and rate—compare scenarios."),
    ],
  }),
  calc({
    slug: "non-compete-settlement-calculator",
    title: "Non-Compete Settlement Calculator",
    category: LEGAL,
    description:
      "Estimate settlement value from remaining restricted months and monthly pay. Frame negotiation ranges for covenants.",
    formulaType: "nonCompeteSettlement",
    inputs: [
      i("monthlyPay", "Monthly Pay ($)", 7000, 1000, 50000, 100),
      i("remainingMonths", "Remaining Restriction Months", 6, 1, 36, 1),
      i("multiplier", "Settlement Multiplier", 0.5, 0.1, 2, 0.05),
    ],
    intro:
      "Non-compete negotiations sometimes reference pay over the remaining restricted period. Estimate a settlement range using monthly pay and a negotiation multiplier.",
    howToUse: [
      "Enter monthly compensation.",
      "Set remaining restricted months.",
      "Adjust multiplier and review estimated settlement.",
    ],
    faqs: [
      f("Is this legally binding guidance?", "No—it is a planning heuristic, not legal advice."),
      f("Are non-competes enforceable?", "Rules vary widely by jurisdiction and are changing in many places."),
      f("What does the multiplier represent?", "A negotiated fraction or premium relative to remaining pay value."),
    ],
  }),
  calc({
    slug: "wrongful-termination-calculator",
    title: "Wrongful Termination Damages Calculator",
    category: LEGAL,
    description:
      "Estimate wage-loss damages from lost pay over a claim period. Support early case valuation discussions.",
    formulaType: "wrongfulTermination",
    inputs: [
      i("weeklyPay", "Weekly Pay ($)", 1500, 100, 20000, 25),
      i("weeksLost", "Weeks of Lost Work", 26, 1, 260, 1),
      i("mitigation", "Mitigation Income ($)", 5000, 0, 500000, 500),
    ],
    intro:
      "Back-pay estimates often start with lost wages minus mitigation income. Use this calculator for a simplified damages baseline during early evaluation.",
    howToUse: [
      "Enter weekly pay at termination.",
      "Set weeks of claimed lost work.",
      "Subtract mitigation earnings and review net wage loss.",
    ],
    faqs: [
      f("What is mitigation?", "Income earned after termination that may reduce recoverable wage loss."),
      f("Are emotional damages included?", "Not in this wage-focused estimate."),
      f("Is this legal advice?", "No—attorneys and courts determine actual damages."),
    ],
  }),
  calc({
    slug: "overtime-exemption-calculator",
    title: "Overtime Exemption Salary Threshold Calculator",
    category: LEGAL,
    description:
      "Check how a salary compares with an overtime exemption threshold. Flag potential nonexempt risk quickly.",
    formulaType: "overtimeExemption",
    inputs: [
      i("annualSalary", "Annual Salary ($)", 45000, 15000, 300000, 500),
      i("threshold", "Exemption Threshold ($)", 5844 * 12, 20000, 200000, 100),
      i("weeklyHours", "Typical Weekly Hours", 45, 30, 80, 1),
    ],
    intro:
      "Salary level is one factor in overtime exemption analysis. Compare compensation with a threshold and estimate potential overtime exposure if nonexempt.",
    howToUse: [
      "Enter the employee’s annual salary.",
      "Set the applicable exemption salary threshold.",
      "Add typical weekly hours to estimate OT exposure if nonexempt.",
    ],
    faqs: [
      f("Is salary alone enough for exemption?", "No—duties tests and local laws also matter."),
      f("Do thresholds change?", "Yes—update the threshold input when regulations change."),
      f("Is this a compliance determination?", "No—consult employment counsel/HR compliance experts."),
    ],
  }),
  calc({
    slug: "osha-recordable-rate-calculator",
    title: "OSHA Recordable Rate Calculator",
    category: LEGAL,
    description:
      "Compute OSHA incidence rates from recordable cases and hours worked. Benchmark workplace safety performance.",
    formulaType: "oshaRecordable",
    inputs: [
      i("cases", "Recordable Cases", 4, 0, 1000, 1),
      i("hoursWorked", "Total Hours Worked", 200000, 1000, 1e8, 1000),
    ],
    intro:
      "OSHA incidence rates normalize injuries by hours worked using a 200,000-hour base. Calculate your recordable rate for safety reporting and benchmarking.",
    howToUse: [
      "Enter number of recordable cases.",
      "Enter total employee hours worked in the period.",
      "Review the incidence rate.",
    ],
    faqs: [
      f("Why 200,000 hours?", "It represents 100 employees working 40 hours/week for 50 weeks."),
      f("What counts as recordable?", "OSHA defines specific injury/illness criteria—follow official guidance."),
      f("Can rates be compared across industries?", "Yes, but industry baselines differ substantially."),
    ],
  }),
  calc({
    slug: "job-applicant-scorecard-calculator",
    title: "Job Applicant Scorecard Calculator",
    category: LEGAL,
    description:
      "Score candidates with weighted hiring criteria. Standardize interview evaluations across a hiring panel.",
    formulaType: "applicantScorecard",
    inputs: [
      i("skillScore", "Skills Score (1-10)", 8, 1, 10, 0.5),
      i("skillWeight", "Skills Weight (%)", 40, 0, 100, 1),
      i("cultureScore", "Culture Score (1-10)", 7, 1, 10, 0.5),
      i("cultureWeight", "Culture Weight (%)", 30, 0, 100, 1),
      i("potentialScore", "Potential Score (1-10)", 9, 1, 10, 0.5),
      i("potentialWeight", "Potential Weight (%)", 30, 0, 100, 1),
    ],
    intro:
      "Structured scorecards reduce inconsistent hiring judgments. Weight skills, culture fit, and potential to produce a single comparable candidate score.",
    howToUse: [
      "Score each criterion on a 1–10 scale.",
      "Assign percentage weights that reflect role priorities.",
      "Review the weighted total score.",
    ],
    faqs: [
      f("Should weights always total 100%?", "Yes for easiest interpretation; otherwise results normalize by weight sum."),
      f("Can I add more criteria?", "Extend the model or run multiple scorecards for specialty roles."),
      f("Does scoring remove bias?", "It helps, but interviewer training and diverse panels still matter."),
    ],
  }),
  calc({
    slug: "enps-calculator",
    title: "eNPS Calculator",
    category: LEGAL,
    description:
      "Calculate employee Net Promoter Score from promoters, passives, and detractors. Measure workplace advocacy.",
    formulaType: "enps",
    inputs: [
      i("promoters", "Promoters", 45, 0, 10000, 1),
      i("passives", "Passives", 30, 0, 10000, 1),
      i("detractors", "Detractors", 25, 0, 10000, 1),
    ],
    intro:
      "Employee NPS summarizes how likely staff are to recommend their workplace. Compute eNPS from promoter, passive, and detractor counts.",
    howToUse: [
      "Enter promoter count (usually 9–10 ratings).",
      "Enter passive and detractor counts.",
      "Review eNPS and response totals.",
    ],
    faqs: [
      f("What is a good eNPS?", "Benchmarks vary; trends over time often matter more than a single number."),
      f("How is eNPS calculated?", "% promoters minus % detractors."),
      f("Should surveys be anonymous?", "Anonymity usually improves honesty and participation."),
    ],
  }),
  calc({
    slug: "cost-per-hire-calculator",
    title: "Cost per Hire Calculator",
    category: LEGAL,
    description:
      "Measure recruiting cost per hire from internal and external spend. Optimize hiring budget efficiency.",
    formulaType: "costPerHire",
    inputs: [
      i("internalCost", "Internal Recruiting Cost ($)", 20000, 0, 5000000, 500),
      i("externalCost", "External Recruiting Cost ($)", 35000, 0, 5000000, 500),
      i("hires", "Number of Hires", 10, 1, 1000, 1),
    ],
    intro:
      "Cost per hire tells you how efficiently recruiting spend converts into accepted roles. Divide total internal and external costs by hire count.",
    howToUse: [
      "Enter internal recruiting costs (salaries, tools).",
      "Enter external costs (agencies, ads, events).",
      "Divide by hires to review cost per hire.",
    ],
    faqs: [
      f("What belongs in internal cost?", "Recruiter time, ATS software, and interview panel time estimates."),
      f("Should relocation be included?", "Some companies include it; stay consistent across periods."),
      f("How often to measure?", "Monthly and quarterly reviews help spot process drift."),
    ],
  }),
  calc({
    slug: "time-to-fill-calculator",
    title: "Time to Fill Calculator",
    category: LEGAL,
    description:
      "Calculate average days to fill open roles from total days open and hire count. Track recruiting speed.",
    formulaType: "timeToFill",
    inputs: [
      i("totalDaysOpen", "Total Job-Days Open", 420, 1, 100000, 1),
      i("hires", "Roles Filled", 12, 1, 1000, 1),
    ],
    intro:
      "Time to fill measures recruiting velocity. Average the total days requisitions remained open across filled roles to monitor pipeline health.",
    howToUse: [
      "Sum days each filled requisition stayed open.",
      "Enter number of roles filled.",
      "Review average time to fill.",
    ],
    faqs: [
      f("Time to fill vs time to hire?", "Time to fill usually starts at job approval; time to hire often starts at application.",),
      f("Do withdrawn roles count?", "Typically no—measure completed fills unless tracking separately."),
      f("Why does it matter?", "Long fill times increase overtime, contractor spend, and team burnout."),
    ],
  }),
  calc({
    slug: "training-roi-calculator",
    title: "Training ROI Calculator",
    category: LEGAL,
    description:
      "Estimate return on training investment from program cost and performance gains. Justify L&D spend with numbers.",
    formulaType: "trainingRoi",
    inputs: [
      i("trainingCost", "Training Cost ($)", 15000, 100, 5000000, 100),
      i("benefit", "Measured Benefit ($)", 42000, 0, 10000000, 100),
    ],
    intro:
      "Training ROI compares measurable benefits with program cost. Use productivity gains, error reduction, or revenue lift to quantify learning impact.",
    howToUse: [
      "Enter total training program cost.",
      "Enter estimated financial benefit.",
      "Review ROI percentage and net benefit.",
    ],
    faqs: [
      f("How do I quantify benefits?", "Use before/after KPIs converted into dollar impact."),
      f("Over what period?", "Match benefit window to a defined post-training period."),
      f("What if ROI is negative?", "Revisit content, audience targeting, or measurement quality."),
    ],
  }),
  calc({
    slug: "performance-bonus-calculator",
    title: "Performance Bonus Calculator",
    category: LEGAL,
    description:
      "Calculate performance bonuses from target bonus and attainment percentage. Communicate variable pay clearly.",
    formulaType: "performanceBonus",
    inputs: [
      i("baseSalary", "Base Salary ($)", 80000, 20000, 500000, 1000),
      i("targetBonusPct", "Target Bonus (%)", 15, 0, 100, 0.5),
      i("attainment", "Attainment (%)", 110, 0, 200, 1),
    ],
    intro:
      "Performance bonuses usually scale a target opportunity by attainment. Compute payout from salary, target bonus percent, and achievement level.",
    howToUse: [
      "Enter base salary.",
      "Set target bonus as a percent of salary.",
      "Enter attainment percentage and review payout.",
    ],
    faqs: [
      f("What does 100% attainment mean?", "Performance met the goal exactly, typically paying target bonus."),
      f("Are there payout caps?", "Many plans cap upside—adjust attainment if capped."),
      f("Is bonus guaranteed?", "Usually discretionary or formula-based per plan rules."),
    ],
  }),
  calc({
    slug: "relocation-reimbursement-calculator",
    title: "Relocation Reimbursement Calculator",
    category: LEGAL,
    description:
      "Total relocation reimbursement from moving, housing, and travel allowances. Clarify package value before a move.",
    formulaType: "relocationReimbursement",
    inputs: [
      i("moving", "Moving Costs ($)", 3500, 0, 50000, 100),
      i("tempHousing", "Temporary Housing ($)", 2000, 0, 50000, 100),
      i("travel", "Travel Costs ($)", 800, 0, 20000, 50),
      i("misc", "Misc Allowance ($)", 500, 0, 20000, 50),
    ],
    intro:
      "Relocation packages bundle several cost categories. Sum moving, temporary housing, travel, and miscellaneous allowances to see total reimbursement.",
    howToUse: [
      "Enter approved moving costs.",
      "Add temporary housing and travel amounts.",
      "Include miscellaneous stipend and review total package.",
    ],
    faqs: [
      f("Are relocation benefits taxable?", "Often partly taxable—check payroll treatment."),
      f("What receipts are needed?", "Most employers require itemized documentation for reimbursement."),
      f("Can unused allowance be kept?", "Depends on whether the benefit is a lump sum or expense reimbursement."),
    ],
  }),
  calc({
    slug: "per-diem-allowance-calculator",
    title: "Per Diem Allowance Calculator",
    category: LEGAL,
    description:
      "Calculate trip per diem totals from daily rates and travel days. Simplify business travel allowances.",
    formulaType: "perDiemAllowance",
    inputs: [
      i("dailyRate", "Daily Per Diem ($)", 79, 10, 500, 1),
      i("fullDays", "Full Days", 4, 0, 60, 1),
      i("travelDays", "Travel Days", 2, 0, 20, 1),
      i("travelDayRate", "Travel Day Rate (%)", 75, 0, 100, 5),
    ],
    intro:
      "Per diem policies often pay full rates for on-site days and partial rates for travel days. Estimate total trip allowance before submission.",
    howToUse: [
      "Enter the full daily per diem rate.",
      "Set full days and travel days.",
      "Adjust travel-day percentage and review total allowance.",
    ],
    faqs: [
      f("Why are travel days partial?", "Many policies pay a reduced rate when less than a full day is spent on business travel."),
      f("Does this replace receipts?", "Per diem often replaces meal/incidentals receipts under policy."),
      f("Are lodging rates separate?", "Frequently yes—lodging may use a different daily cap."),
    ],
  }),
  calc({
    slug: "pension-vesting-calculator",
    title: "Pension Vesting Calculator",
    category: LEGAL,
    description:
      "Estimate vested pension value from account balance and vesting percentage. Understand retirement benefit ownership.",
    formulaType: "pensionVesting",
    inputs: [
      i("balance", "Plan Balance ($)", 120000, 0, 5000000, 1000),
      i("vestedPct", "Vested (%)", 80, 0, 100, 1),
      i("yearsService", "Years of Service", 4, 0, 45, 1),
    ],
    intro:
      "Vesting determines how much of an employer retirement benefit you own. Apply vested percentage to plan balance for a current vested value estimate.",
    howToUse: [
      "Enter current plan balance.",
      "Input your vested percentage.",
      "Optionally note years of service and review vested value.",
    ],
    faqs: [
      f("What is cliff vesting?", "A schedule where benefits vest all at once after a required service period."),
      f("What is graded vesting?", "Ownership increases gradually each year until fully vested."),
      f("Does employee contribution vest?", "Employee deferrals are typically immediately vested."),
    ],
  }),

  // ——— Automotive / Travel (20) ———
  calc({
    slug: "road-trip-gas-cost-calculator",
    title: "Road Trip Gas Cost Calculator",
    category: AUTO,
    description:
      "Estimate total fuel cost for a road trip from miles, MPG, and gas price. Budget driving vacations accurately.",
    formulaType: "roadTripGas",
    inputs: [
      i("miles", "Round-Trip Miles", 800, 10, 10000, 10),
      i("mpg", "Vehicle MPG", 27, 5, 120, 0.5),
      i("gasPrice", "Gas Price ($/gal)", 3.69, 1, 10, 0.01),
    ],
    intro:
      "Fuel is one of the largest variable costs on a road trip. Estimate gallons required and total gas spend before you leave.",
    howToUse: [
      "Enter total trip miles.",
      "Set your vehicle’s expected MPG.",
      "Add fuel price and review total cost.",
    ],
    faqs: [
      f("Should I use round-trip miles?", "Yes if you are returning by the same mode of travel."),
      f("Do mountains change MPG?", "Yes—terrain, speed, and cargo can lower efficiency."),
      f("Can I split costs among passengers?", "Divide the total by riders for a per-person share."),
    ],
  }),
  calc({
    slug: "ev-charging-cost-calculator",
    title: "EV Charging Cost Calculator",
    category: AUTO,
    description:
      "Calculate EV charging cost from battery size, charge amount, and electricity rates. Compare home vs public charging.",
    formulaType: "evChargingCost",
    inputs: [
      i("batteryKwh", "Battery Capacity (kWh)", 75, 10, 200, 1),
      i("chargePercent", "Charge Needed (%)", 60, 1, 100, 1),
      i("rate", "Electricity Rate ($/kWh)", 0.16, 0.05, 1.5, 0.01),
    ],
    intro:
      "EV charging cost depends on energy delivered and price per kWh. Estimate session cost for home or public charging scenarios.",
    howToUse: [
      "Enter usable battery capacity.",
      "Set percentage of battery you need to add.",
      "Input electricity rate and review session cost.",
    ],
    faqs: [
      f("Are public DC fast chargers more expensive?", "Often yes—rates can exceed residential electricity."),
      f("Does this include idle fees?", "No—add idle or session fees separately if applicable."),
      f("What about charging losses?", "Real-world energy from the wall can exceed battery kWh added; pad estimates if needed."),
    ],
  }),
  calc({
    slug: "car-lease-vs-buy-calculator",
    title: "Car Lease vs Buy Calculator",
    category: AUTO,
    description:
      "Compare multi-year lease payments against buying and ownership costs. Decide with clearer long-term math.",
    formulaType: "carLeaseVsBuy",
    inputs: [
      i("leasePayment", "Monthly Lease ($)", 429, 100, 2000, 10),
      i("leaseMonths", "Lease Months", 36, 12, 48, 1),
      i("dueAtSigning", "Lease Due at Signing ($)", 3000, 0, 20000, 100),
      i("loanPayment", "Monthly Loan ($)", 555, 100, 2000, 10),
      i("loanMonths", "Loan Months", 60, 12, 84, 1),
      i("downPayment", "Buy Down Payment ($)", 4000, 0, 50000, 100),
    ],
    intro:
      "Leasing and buying create different cash-flow profiles. Compare total lease outlay with purchase payments over your time horizon.",
    howToUse: [
      "Enter lease payment, term, and due-at-signing costs.",
      "Enter loan payment, term, and down payment.",
      "Compare total cash out for both paths.",
    ],
    faqs: [
      f("Does buying include residual value?", "This cash-out comparison ignores resale equity—adjust mentally for ownership value."),
      f("Are mileage penalties included?", "No—add expected lease overage fees if relevant."),
      f("Which is better?", "Depends on horizon, mileage, and desire for equity."),
    ],
  }),
  calc({
    slug: "vehicle-depreciation-calculator",
    title: "Vehicle Depreciation Calculator",
    category: AUTO,
    description:
      "Estimate vehicle value after years of depreciation. Forecast ownership equity and replacement timing.",
    formulaType: "vehicleDepreciation",
    inputs: [
      i("purchasePrice", "Purchase Price ($)", 32000, 5000, 200000, 500),
      i("annualDepreciation", "Annual Depreciation (%)", 15, 1, 40, 0.5),
      i("years", "Years Owned", 5, 1, 20, 1),
    ],
    intro:
      "Cars typically lose value fastest in early years. Project estimated market value after several years of compounded depreciation.",
    howToUse: [
      "Enter purchase price.",
      "Set assumed annual depreciation rate.",
      "Choose years owned and review estimated value.",
    ],
    faqs: [
      f("Is depreciation linear?", "In practice it is front-loaded; compounded annual rates are a simplification."),
      f("Do EVs depreciate differently?", "Market conditions and battery health can change curves."),
      f("How do I use this for selling?", "Treat it as a starting estimate and validate with comps."),
    ],
  }),
  calc({
    slug: "toll-road-commute-calculator",
    title: "Toll Road Commute Calculator",
    category: AUTO,
    description:
      "Calculate monthly and annual toll spend for a commute. Weigh express-lane costs against time savings.",
    formulaType: "tollCommute",
    inputs: [
      i("tollOneWay", "One-Way Toll ($)", 4.5, 0, 50, 0.25),
      i("daysPerWeek", "Commute Days / Week", 5, 1, 7, 1),
      i("weeks", "Weeks / Year", 48, 1, 52, 1),
    ],
    intro:
      "Daily tolls add up quietly across a year of commuting. Estimate monthly and annual toll budgets from one-way rates and work cadence.",
    howToUse: [
      "Enter one-way toll cost.",
      "Set commute days per week.",
      "Choose working weeks per year and review totals.",
    ],
    faqs: [
      f("Round trip or one way?", "Enter one-way and the calculator doubles for round trips."),
      f("Do rates vary by time?", "Yes—use an average peak rate for budgeting."),
      f("Are transponder discounts included?", "Enter the discounted rate you actually pay."),
    ],
  }),
  calc({
    slug: "car-insurance-comparison-calculator",
    title: "Car Insurance Comparison Calculator",
    category: AUTO,
    description:
      "Compare two auto insurance quotes by premium and deductible tradeoffs. Identify the lower expected annual cost.",
    formulaType: "carInsuranceCompare",
    inputs: [
      i("premiumA", "Quote A Annual Premium ($)", 1400, 100, 10000, 50),
      i("deductibleA", "Quote A Deductible ($)", 500, 0, 5000, 50),
      i("premiumB", "Quote B Annual Premium ($)", 1200, 100, 10000, 50),
      i("deductibleB", "Quote B Deductible ($)", 1000, 0, 5000, 50),
      i("claimChance", "Chance of Claim (%)", 10, 0, 100, 1),
    ],
    intro:
      "Lower premiums often pair with higher deductibles. Compare expected annual cost of two quotes using premium plus probability-weighted deductible exposure.",
    howToUse: [
      "Enter premiums and deductibles for quotes A and B.",
      "Estimate annual claim probability.",
      "Review expected cost and the better value.",
    ],
    faqs: [
      f("Is claim chance accurate?", "Use a personal estimate; it is a planning assumption."),
      f("Do discounts matter?", "Apply discounted premiums before comparing."),
      f("Should coverage limits match?", "Yes—compare equivalent liability and protection levels."),
    ],
  }),
  calc({
    slug: "flight-carbon-footprint-calculator",
    title: "Flight Carbon Footprint Calculator",
    category: AUTO,
    description:
      "Estimate flight CO₂ emissions from distance and passengers. Understand travel climate impact roughly.",
    formulaType: "flightCarbon",
    inputs: [
      i("miles", "Flight Distance (miles)", 2500, 50, 20000, 50),
      i("passengers", "Passengers in Party", 1, 1, 10, 1),
      i("kgPerMile", "kg CO₂ per Passenger-Mile", 0.24, 0.05, 1, 0.01),
    ],
    intro:
      "Aviation emissions depend on distance and load factors. Estimate carbon dioxide for a trip using distance and an emissions factor per passenger-mile.",
    howToUse: [
      "Enter flight distance in miles.",
      "Set number of passengers in your party.",
      "Adjust emissions factor if desired and review total CO₂.",
    ],
    faqs: [
      f("Is this airline-specific?", "No—it is a simplified factor-based estimate."),
      f("Do layovers count?", "Sum each segment’s distance for better accuracy."),
      f("What about radiative forcing?", "Some methods uplift aviation CO₂; this uses a direct factor."),
    ],
  }),
  calc({
    slug: "hotel-stay-budget-calculator",
    title: "Hotel Stay Budget Calculator",
    category: AUTO,
    description:
      "Budget hotel stays including nightly rate, taxes, and fees. Avoid surprise lodging totals at checkout.",
    formulaType: "hotelStayBudget",
    inputs: [
      i("nightlyRate", "Nightly Rate ($)", 189, 30, 2000, 1),
      i("nights", "Nights", 4, 1, 60, 1),
      i("taxRate", "Tax / Fee Rate (%)", 15, 0, 40, 0.5),
      i("resortFee", "Resort Fee per Night ($)", 0, 0, 100, 1),
    ],
    intro:
      "Quoted hotel rates rarely equal the final bill. Add taxes, fees, and resort charges to estimate your full lodging budget.",
    howToUse: [
      "Enter nightly room rate and nights stayed.",
      "Set tax/fee percentage.",
      "Add resort fees if any and review total stay cost.",
    ],
    faqs: [
      f("Are resort fees mandatory?", "At many hotels yes, even if you do not use amenities."),
      f("Does parking count?", "Add parking separately if not included."),
      f("Prepaid vs pay later?", "Totals should match; prepay may change cancellation flexibility."),
    ],
  }),
  calc({
    slug: "vacation-currency-planner-calculator",
    title: "Vacation Currency Planner Calculator",
    category: AUTO,
    description:
      "Convert vacation budgets between home and destination currencies. Plan spending before you travel abroad.",
    formulaType: "vacationCurrency",
    inputs: [
      i("homeBudget", "Home Currency Budget", 2500, 50, 100000, 50),
      i("exchangeRate", "Destination per Home Unit", 0.92, 0.001, 1000, 0.001),
      i("days", "Trip Days", 8, 1, 90, 1),
    ],
    intro:
      "Foreign trip budgeting is easier once exchange rates are applied. Convert your home-currency budget and see daily spending power abroad.",
    howToUse: [
      "Enter your budget in home currency.",
      "Input destination units per 1 home currency unit.",
      "Set trip days and review converted totals.",
    ],
    faqs: [
      f("Where do I get exchange rates?", "Use a current mid-market or card rate estimate."),
      f("Do ATM fees matter?", "Yes—pad your budget for fees and poorer cash rates."),
      f("Should I convert everything at once?", "Cards often convert per transaction at live rates."),
    ],
  }),
  calc({
    slug: "baggage-fee-calculator",
    title: "Baggage Fee Calculator",
    category: AUTO,
    description:
      "Estimate airline baggage fees for checked bags across travelers. Prevent packing surprises at the counter.",
    formulaType: "baggageFee",
    inputs: [
      i("travelers", "Travelers", 2, 1, 10, 1),
      i("bagsPerTraveler", "Checked Bags per Traveler", 1, 0, 3, 1),
      i("feeFirst", "First Bag Fee ($)", 35, 0, 200, 5),
      i("feeSecond", "Second+ Bag Fee ($)", 45, 0, 200, 5),
    ],
    intro:
      "Airline bag fees escalate with additional checked luggage. Estimate total baggage cost for your party before you pack.",
    howToUse: [
      "Enter traveler count and bags per person.",
      "Set first-bag and additional-bag fees.",
      "Review total baggage fees.",
    ],
    faqs: [
      f("Do credit cards waive fees?", "Some airline cards waive a bag for the cardholder and companions—adjust fees to zero if so."),
      f("Are carry-ons included?", "This tool focuses on checked-bag fees."),
      f("Do overweight fees apply?", "Yes separately—keep bags under weight limits."),
    ],
  }),
  calc({
    slug: "speeding-ticket-fine-calculator",
    title: "Speeding Ticket Fine Calculator",
    category: AUTO,
    description:
      "Estimate speeding fines from base penalty plus per-mph overage. Understand potential ticket costs.",
    formulaType: "speedingTicket",
    inputs: [
      i("baseFine", "Base Fine ($)", 100, 0, 1000, 5),
      i("overLimit", "MPH Over Limit", 12, 0, 50, 1),
      i("perMph", "Extra $ per MPH", 10, 0, 50, 1),
      i("fees", "Court / Admin Fees ($)", 50, 0, 500, 5),
    ],
    intro:
      "Speeding penalties often combine a base fine with over-limit surcharges and fees. Estimate a potential total before court or payment.",
    howToUse: [
      "Enter base fine amount.",
      "Set mph over the limit and per-mph surcharge.",
      "Add fees and review estimated total.",
    ],
    faqs: [
      f("Are fines the same everywhere?", "No—local statutes and zones (school/construction) change amounts."),
      f("Does this include insurance impact?", "No—premium increases can exceed the ticket itself."),
      f("Is this legal advice?", "No—verify with official citations and counsel if needed."),
    ],
  }),
  calc({
    slug: "driving-distance-matrix-calculator",
    title: "Driving Distance Matrix Calculator",
    category: AUTO,
    description:
      "Estimate drive time and fuel use between distance and average speed. Plan multi-stop driving days.",
    formulaType: "drivingDistanceMatrix",
    inputs: [
      i("distance", "Distance (miles)", 180, 1, 3000, 1),
      i("avgSpeed", "Average Speed (mph)", 55, 10, 85, 1),
      i("mpg", "MPG", 28, 5, 120, 0.5),
      i("gasPrice", "Gas Price ($/gal)", 3.5, 1, 10, 0.05),
    ],
    intro:
      "Trip planning needs both time and fuel estimates. Convert distance and average speed into drive time, gallons, and fuel cost.",
    howToUse: [
      "Enter route distance.",
      "Set expected average speed.",
      "Add MPG and fuel price for cost estimates.",
    ],
    faqs: [
      f("Does average speed include stops?", "Use a blended speed that accounts for traffic and breaks."),
      f("Is this turn-by-turn accurate?", "It is a planning estimate, not a navigation engine."),
      f("Can I chain multiple legs?", "Sum distances or run the calculator per leg."),
    ],
  }),
  calc({
    slug: "parking-garage-cost-calculator",
    title: "Parking Garage Cost Calculator",
    category: AUTO,
    description:
      "Estimate parking garage totals from hourly rates, daily caps, and duration. Budget urban parking accurately.",
    formulaType: "parkingGarage",
    inputs: [
      i("hourlyRate", "Hourly Rate ($)", 6, 1, 40, 0.5),
      i("hours", "Hours Parked", 5, 0.5, 24, 0.5),
      i("dailyCap", "Daily Maximum ($)", 35, 5, 100, 1),
      i("days", "Days", 1, 1, 14, 1),
    ],
    intro:
      "Garage pricing often uses hourly rates with daily maximums. Estimate total parking cost across hours and multi-day stays.",
    howToUse: [
      "Enter hourly rate and hours parked per day.",
      "Set the daily maximum cap.",
      "Add number of days and review total cost.",
    ],
    faqs: [
      f("Do nights count separately?", "Some garages re-start the day rate at a cutoff time."),
      f("Are validation discounts included?", "Enter discounted effective rates if validated."),
      f("Is monthly parking better?", "Compare monthly permits when days add up."),
    ],
  }),
  calc({
    slug: "rv-towing-weight-calculator",
    title: "RV Towing Weight Calculator",
    category: AUTO,
    description:
      "Check tow capacity headroom from vehicle rating and trailer weight. Tow more safely with clearer margins.",
    formulaType: "rvTowingWeight",
    inputs: [
      i("towCapacity", "Max Tow Capacity (lbs)", 7500, 1000, 35000, 100),
      i("trailerWeight", "Trailer Weight (lbs)", 5200, 500, 30000, 50),
      i("cargo", "Cargo / Passengers (lbs)", 800, 0, 5000, 50),
    ],
    intro:
      "Overloading a tow vehicle is unsafe and can void warranties. Compare trailer and cargo weight against rated tow capacity to see remaining margin.",
    howToUse: [
      "Enter your vehicle’s max tow rating.",
      "Add trailer weight and cargo/passenger load.",
      "Review remaining capacity and utilization.",
    ],
    faqs: [
      f("Is tongue weight included?", "Ensure trailer weight figures match how your rating is defined."),
      f("What margin should I keep?", "Many towers avoid loading to 100% capacity."),
      f("Do hills change capacity?", "Ratings assume specified conditions—terrain still affects performance."),
    ],
  }),
  calc({
    slug: "motorcycle-loan-calculator",
    title: "Motorcycle Loan Calculator",
    category: AUTO,
    description:
      "Estimate motorcycle loan payments from price, rate, and term. Plan financing before you buy.",
    formulaType: "motorcycleLoan",
    inputs: [
      i("price", "Bike Price ($)", 12000, 1000, 80000, 100),
      i("downPayment", "Down Payment ($)", 2000, 0, 40000, 100),
      i("annualRate", "APR (%)", 7.5, 0, 25, 0.1),
      i("termMonths", "Term (months)", 48, 12, 84, 1),
    ],
    intro:
      "Motorcycle financing follows standard amortizing loan math. Calculate monthly payments and total interest after down payment.",
    howToUse: [
      "Enter bike price and down payment.",
      "Set APR and loan term.",
      "Review monthly payment and interest.",
    ],
    faqs: [
      f("Are rates higher than car loans?", "Often yes due to asset and risk differences."),
      i && f("Should I include gear costs?", "Gear is usually separate from the financed bike price."),
      f("Is gap insurance useful?", "It can help if the bike depreciates faster than the loan balance."),
    ].filter(Boolean),
  }),
  calc({
    slug: "boat-maintenance-calculator",
    title: "Boat Maintenance Calculator",
    category: AUTO,
    description:
      "Estimate annual boat maintenance from value-based percentages and slip fees. Budget ownership beyond the purchase.",
    formulaType: "boatMaintenance",
    inputs: [
      i("boatValue", "Boat Value ($)", 45000, 2000, 2000000, 1000),
      i("maintPercent", "Maintenance (% of value)", 8, 1, 20, 0.5),
      i("slipFees", "Annual Slip / Storage ($)", 3600, 0, 50000, 100),
      i("insurance", "Annual Insurance ($)", 900, 0, 20000, 50),
    ],
    intro:
      "Boat ownership costs extend far beyond the hull price. Estimate annual maintenance, slip, and insurance to see true yearly carry cost.",
    howToUse: [
      "Enter current boat value.",
      "Set maintenance percentage assumption.",
      "Add slip/storage and insurance, then review annual total.",
    ],
    faqs: [
      f("Is 10% of value a common rule?", "Some owners use ~10% as a rough annual cost heuristic."),
      f("Do usage hours matter?", "Higher use generally increases maintenance."),
      f("Are haul-outs included?", "Include them in maintenance or add as a separate line."),
    ],
  }),
  calc({
    slug: "rideshare-driver-earnings-calculator",
    title: "Rideshare Driver Earnings Calculator",
    category: AUTO,
    description:
      "Estimate rideshare net earnings after platform fees, fuel, and expenses. Know your true hourly take-home.",
    formulaType: "rideshareEarnings",
    inputs: [
      i("grossFares", "Gross Fares ($)", 900, 50, 20000, 25),
      i("platformFeePct", "Platform Fee (%)", 25, 0, 50, 1),
      i("fuelCost", "Fuel / Energy Cost ($)", 120, 0, 2000, 5),
      i("otherExpenses", "Other Expenses ($)", 80, 0, 2000, 5),
      i("hours", "Hours Online", 35, 1, 100, 1),
    ],
    intro:
      "Gross fares overstate rideshare income. Subtract platform fees, fuel, and expenses to estimate net profit and effective hourly earnings.",
    howToUse: [
      "Enter gross fares for the period.",
      "Set platform fee percentage and expense totals.",
      "Add hours online and review net hourly earnings.",
    ],
    faqs: [
      f("Are tips included in gross?", "Include tips if you want all-in earnings."),
      f("Should depreciation count?", "Yes for true profit—add it under other expenses."),
      f("Is this before taxes?", "Yes—set aside money for self-employment taxes."),
    ],
  }),
  calc({
    slug: "transit-pass-savings-calculator",
    title: "Transit Pass Savings Calculator",
    category: AUTO,
    description:
      "Compare monthly transit passes against pay-per-ride costs. See whether a pass actually saves money.",
    formulaType: "transitPassSavings",
    inputs: [
      i("passPrice", "Monthly Pass ($)", 99, 10, 400, 1),
      i("rideFare", "Single Ride Fare ($)", 2.75, 0.5, 20, 0.05),
      i("ridesPerMonth", "Rides per Month", 42, 1, 200, 1),
    ],
    intro:
      "Transit passes win when ride frequency is high enough. Compare unlimited-pass pricing with equivalent pay-per-ride spending.",
    howToUse: [
      "Enter monthly pass price.",
      "Set single-ride fare and expected monthly rides.",
      "Review savings or loss versus buying a pass.",
    ],
    faqs: [
      f("Do transfers count as extra rides?", "Follow local fare rules—count each charged ride."),
      f("What about employer pre-tax benefits?", "Pre-tax transit benefits can improve pass value further."),
      f("Are weekly passes different?", "Run the same comparison using weekly totals."),
    ],
  }),
  calc({
    slug: "car-rental-total-calculator",
    title: "Car Rental Total Calculator",
    category: AUTO,
    description:
      "Estimate total car rental cost including daily rate, taxes, and extras. Budget rental cars without fee surprises.",
    formulaType: "carRentalTotal",
    inputs: [
      i("dailyRate", "Daily Rate ($)", 52, 10, 400, 1),
      i("days", "Rental Days", 5, 1, 60, 1),
      i("taxRate", "Taxes / Fees (%)", 18, 0, 50, 0.5),
      i("extras", "Extras Total ($)", 60, 0, 1000, 5),
    ],
    intro:
      "Car rental bills grow with taxes, airport fees, and add-ons. Estimate an all-in total before you reserve.",
    howToUse: [
      "Enter daily rate and rental days.",
      "Set combined tax/fee percentage.",
      "Add extras like GPS or insurance and review total.",
    ],
    faqs: [
      f("Are airport surcharges large?", "They can be—include them in the tax/fee percentage."),
      f("Do I need rental insurance?", "It depends on personal coverage and credit-card benefits."),
      f("Is mileage unlimited?", "Confirm; overage fees can change totals."),
    ],
  }),
  calc({
    slug: "jet-lag-planner-calculator",
    title: "Jet Lag Planner Calculator",
    category: AUTO,
    description:
      "Estimate jet lag recovery days from time zones crossed. Plan arrival buffers for important trips.",
    formulaType: "jetLagPlanner",
    inputs: [
      i("timeZones", "Time Zones Crossed", 7, 1, 14, 1),
      i("direction", "Direction (1=east, 2=west)", 1, 1, 2, 1),
      i("recoveryFactor", "Days per Time Zone", 0.75, 0.25, 1.5, 0.05),
    ],
    intro:
      "Jet lag severity generally increases with time zones crossed, and eastward travel is often harder. Estimate recovery days to plan buffers around meetings and events.",
    howToUse: [
      "Enter number of time zones crossed.",
      "Choose east (1) or west (2).",
      "Adjust recovery factor and review estimated recovery days.",
    ],
    faqs: [
      f("Why is eastward harder?", "Advancing your body clock is typically more difficult than delaying it."),
      f("Do light and melatonin help?", "Behavioral strategies can help—this tool only estimates duration."),
      f("Is recovery the same for everyone?", "No—age, sleep debt, and flexibility vary widely."),
    ],
  }),
];

// Fix motorcycle loan faqs - I accidentally mixed filter with bad expression
const moto = extra.find((c) => c.slug === "motorcycle-loan-calculator");
if (moto) {
  moto.seoContent.faqs = [
    f("Are rates higher than car loans?", "Often yes due to asset and risk differences."),
    f("Should I include gear costs?", "Gear is usually separate from the financed bike price."),
    f("Is gap insurance useful?", "It can help if the bike depreciates faster than the loan balance."),
  ];
}

console.log("Part2 count:", extra.length);
fs.writeFileSync("/tmp/extra_part2.json", JSON.stringify(extra));
