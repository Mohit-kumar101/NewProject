import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const C = {
  loans: "Loans & Debt Management",
  realEstate: "Real Estate & Housing",
  investing: "Investing & Wealth Building",
  freelance: "Freelance & Self-Employment",
  utilities: "Everyday Utilities & Savings",
};

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

const calculators = [
  // ——— Loans & Debt Management ———
  calc({
    slug: "car-loan-payoff-calculator",
    title: "Car Loan Payoff Calculator",
    category: C.loans,
    description:
      "Estimate monthly payments and total interest for your auto loan. Plan an earlier payoff by adjusting rate, term, and extra payments.",
    formulaType: "carLoanPayoff",
    inputs: [
      i("principal", "Loan Amount ($)", 25000, 1000, 150000, 100),
      i("annualRate", "Annual Interest Rate (%)", 6.5, 0, 30, 0.1),
      i("termMonths", "Loan Term (months)", 60, 12, 96, 1),
      i("extraPayment", "Extra Monthly Payment ($)", 0, 0, 2000, 25),
    ],
    intro:
      "The Car Loan Payoff Calculator helps you understand exactly what your auto financing will cost over time. Enter your loan amount, APR, term, and any extra monthly payments to see your payment schedule and interest savings.",
    howToUse: [
      "Enter your current or planned car loan principal amount.",
      "Input the annual interest rate (APR) listed on your loan agreement.",
      "Set the loan term in months (for example, 36, 48, or 60).",
      "Optionally add an extra monthly payment to model an accelerated payoff.",
      "Review the monthly payment, payoff timeline, and total interest instantly.",
    ],
    faqs: [
      f(
        "How can I pay off my car loan faster?",
        "Making extra principal payments each month reduces the outstanding balance sooner, which lowers total interest and shortens the loan term."
      ),
      f(
        "Does a longer loan term mean lower payments?",
        "Yes, longer terms reduce the monthly payment but usually increase the total interest paid over the life of the loan."
      ),
      f(
        "Should I refinance my car loan?",
        "Refinancing can help if current market rates are meaningfully lower than your existing APR and the remaining balance and fees still make the switch worthwhile."
      ),
    ],
  }),
  calc({
    slug: "personal-loan-calculator",
    title: "Personal Loan Calculator",
    category: C.loans,
    description:
      "Calculate monthly payments and total cost for unsecured personal loans. Compare terms quickly before you borrow.",
    formulaType: "personalLoan",
    inputs: [
      i("principal", "Loan Amount ($)", 10000, 500, 100000, 100),
      i("annualRate", "Annual Interest Rate (%)", 9.9, 1, 36, 0.1),
      i("termMonths", "Loan Term (months)", 36, 6, 84, 1),
    ],
    intro:
      "Use the Personal Loan Calculator to project repayments on consolidation, medical, or major-purchase loans. Instantly see how rate and term choices change your monthly obligation and total interest.",
    howToUse: [
      "Enter the amount you plan to borrow.",
      "Provide the expected annual percentage rate (APR).",
      "Choose a repayment term in months.",
      "Review the estimated monthly payment and total interest cost.",
    ],
    faqs: [
      f(
        "What credit score do I need for a personal loan?",
        "Requirements vary by lender, but higher scores generally unlock lower APRs and better approval odds."
      ),
      f(
        "Is interest on personal loans tax-deductible?",
        "In most cases, personal loan interest is not tax-deductible unless the funds are used for a qualified purpose—consult a tax professional."
      ),
      f(
        "Fixed vs. variable rate: which is better?",
        "Fixed rates offer payment predictability; variable rates may start lower but can rise over time."
      ),
    ],
  }),
  calc({
    slug: "student-loan-payoff-calculator",
    title: "Student Loan Payoff Calculator",
    category: C.loans,
    description:
      "Model student loan repayment timelines with standard or extra payments. See how additional payments cut interest and accelerate freedom from debt.",
    formulaType: "studentLoanPayoff",
    inputs: [
      i("principal", "Loan Balance ($)", 35000, 1000, 300000, 500),
      i("annualRate", "Annual Interest Rate (%)", 5.5, 0, 15, 0.1),
      i("termMonths", "Remaining Term (months)", 120, 12, 360, 1),
      i("extraPayment", "Extra Monthly Payment ($)", 100, 0, 2000, 25),
    ],
    intro:
      "The Student Loan Payoff Calculator shows how long it will take to eliminate education debt and how much interest you will pay. Experiment with extra payments to find a payoff plan that fits your budget.",
    howToUse: [
      "Enter your remaining student loan balance.",
      "Input the weighted average interest rate across your loans.",
      "Set the remaining repayment term in months.",
      "Add any planned extra monthly payment amount.",
      "Compare the standard vs. accelerated payoff results.",
    ],
    faqs: [
      f(
        "Should I pay student loans or invest first?",
        "It depends on your interest rate, employer match opportunities, and risk tolerance—high-interest debt usually takes priority after an emergency fund."
      ),
      f(
        "Do extra payments reduce principal immediately?",
        "Most servicers apply extra amounts to principal after the current interest due is covered—confirm with your lender."
      ),
      f(
        "How does refinancing affect federal benefits?",
        "Private refinancing typically ends federal protections such as income-driven repayment and forgiveness programs."
      ),
    ],
  }),
  calc({
    slug: "credit-card-minimum-payment-calculator",
    title: "Credit Card Minimum Payment Calculator",
    category: C.loans,
    description:
      "See how long minimum payments take to clear a credit card balance. Discover the true interest cost of paying only the minimum.",
    formulaType: "creditCardMinimum",
    inputs: [
      i("balance", "Card Balance ($)", 5000, 100, 50000, 50),
      i("annualRate", "APR (%)", 22.9, 5, 40, 0.1),
      i("minPaymentPercent", "Minimum Payment (%)", 2, 1, 5, 0.1),
      i("minPaymentFloor", "Minimum Payment Floor ($)", 25, 10, 100, 5),
    ],
    intro:
      "Paying only the credit card minimum can stretch a balance for years. This calculator estimates months to payoff and total interest so you can decide how aggressively to attack revolving debt.",
    howToUse: [
      "Enter your current credit card balance.",
      "Input the card APR from your statement.",
      "Set the minimum payment percentage your issuer uses.",
      "Add the issuer floor amount if the percentage falls below it.",
      "Review months to payoff and total interest cost.",
    ],
    faqs: [
      f(
        "Why are minimum payments so costly?",
        "Most of each early payment goes to interest, so principal declines slowly and interest compounds for longer."
      ),
      f(
        "What payment strategy works best?",
        "Pay as much above the minimum as you can afford, targeting the highest-APR card first (avalanche) or smallest balance first (snowball)."
      ),
      f(
        "Does a balance transfer help?",
        "A low or 0% intro APR can save money if you pay the balance before the promotional period ends and fees are reasonable."
      ),
    ],
  }),
  calc({
    slug: "debt-snowball-strategy-calculator",
    title: "Debt Snowball Strategy Calculator",
    category: C.loans,
    description:
      "Simulate the debt snowball method by clearing smallest balances first. Track motivational wins and overall payoff time.",
    formulaType: "debtSnowball",
    inputs: [
      i("debt1", "Smallest Debt ($)", 800, 0, 50000, 50),
      i("debt2", "Medium Debt ($)", 2500, 0, 50000, 50),
      i("debt3", "Largest Debt ($)", 7000, 0, 100000, 100),
      i("avgRate", "Average APR (%)", 18, 0, 40, 0.1),
      i("monthlyBudget", "Monthly Debt Budget ($)", 500, 50, 5000, 25),
    ],
    intro:
      "The debt snowball strategy focuses on paying off the smallest balance first while making minimums on the rest. This calculator estimates how quickly your payment “snowball” can wipe out stacked debts.",
    howToUse: [
      "Enter up to three debt balances from smallest to largest.",
      "Provide an approximate average interest rate across the debts.",
      "Set the total monthly amount you can put toward debt.",
      "Review estimated months to become debt-free and total paid.",
    ],
    faqs: [
      f(
        "Why choose snowball over avalanche?",
        "Snowball prioritizes quick psychological wins from clearing small balances, which can improve consistency."
      ),
      f(
        "Do I still pay interest on other debts?",
        "Yes—keep making at least the minimum payments on every remaining account."
      ),
      f(
        "Can I mix strategies?",
        "Some people start with snowball for momentum, then switch to avalanche for interest savings."
      ),
    ],
  }),
  calc({
    slug: "debt-avalanche-strategy-calculator",
    title: "Debt Avalanche Strategy Calculator",
    category: C.loans,
    description:
      "Model the debt avalanche approach that attacks highest-interest balances first. Minimize total interest while becoming debt-free.",
    formulaType: "debtAvalanche",
    inputs: [
      i("debt1", "Highest-Rate Debt ($)", 4000, 0, 50000, 50),
      i("rate1", "Highest Debt APR (%)", 24, 0, 40, 0.1),
      i("debt2", "Mid-Rate Debt ($)", 3000, 0, 50000, 50),
      i("rate2", "Mid Debt APR (%)", 15, 0, 40, 0.1),
      i("debt3", "Lowest-Rate Debt ($)", 6000, 0, 100000, 100),
      i("rate3", "Lowest Debt APR (%)", 7, 0, 40, 0.1),
      i("monthlyBudget", "Monthly Debt Budget ($)", 600, 50, 5000, 25),
    ],
    intro:
      "The debt avalanche method directs extra payments to the highest APR first, which typically minimizes interest. Use this calculator to estimate payoff time and interest saved versus minimum-only repayment.",
    howToUse: [
      "List three debts with balances and their individual APRs.",
      "Order is optional—the engine prioritizes by rate automatically.",
      "Enter your total monthly debt repayment budget.",
      "Review months to freedom and estimated interest cost.",
    ],
    faqs: [
      f(
        "Is avalanche mathematically optimal?",
        "Generally yes for minimizing interest, assuming you stick with the plan consistently."
      ),
      f(
        "What if rates are nearly identical?",
        "When APRs are similar, snowball or avalanche often produce similar results—pick the approach you will follow."
      ),
      f(
        "Should I include my mortgage?",
        "Most avalanche plans focus on high-interest consumer debt first; mortgages are usually handled separately."
      ),
    ],
  }),
  calc({
    slug: "loan-refinance-savings-calculator",
    title: "Loan Refinance Savings Calculator",
    category: C.loans,
    description:
      "Compare your current loan with a refinance offer. Estimate monthly payment changes and lifetime interest savings.",
    formulaType: "loanRefinance",
    inputs: [
      i("balance", "Remaining Balance ($)", 18000, 1000, 500000, 100),
      i("currentRate", "Current APR (%)", 9.5, 0, 30, 0.1),
      i("currentTerm", "Remaining Term (months)", 48, 6, 360, 1),
      i("newRate", "New APR (%)", 6.5, 0, 30, 0.1),
      i("newTerm", "New Term (months)", 48, 6, 360, 1),
      i("fees", "Refinance Fees ($)", 300, 0, 10000, 50),
    ],
    intro:
      "Refinancing only makes sense when lower rates or better terms outweigh fees. This calculator compares your current loan to a refinance scenario so you can see net savings clearly.",
    howToUse: [
      "Enter remaining balance, current APR, and remaining months.",
      "Input the new APR, new term, and estimated refinance fees.",
      "Compare old vs. new monthly payments and total interest.",
      "Decide whether the break-even timeline fits your plans.",
    ],
    faqs: [
      f(
        "What is a refinance break-even point?",
        "It is how many months of payment savings it takes to recover upfront refinance fees."
      ),
      f(
        "Can a longer new term hurt me?",
        "Yes—stretching the term can lower the payment while increasing total interest paid."
      ),
      f(
        "Are closing costs always required?",
        "Not always; some lenders offer no-fee refinances that embed costs into a slightly higher rate."
      ),
    ],
  }),
  calc({
    slug: "home-equity-loan-calculator",
    title: "Home Equity Loan Calculator",
    category: C.loans,
    description:
      "Estimate payments on a fixed home equity loan using your available equity. Understand monthly cost before tapping home value.",
    formulaType: "homeEquityLoan",
    inputs: [
      i("homeValue", "Home Value ($)", 450000, 50000, 2000000, 5000),
      i("mortgageBalance", "Mortgage Balance ($)", 280000, 0, 1500000, 5000),
      i("ltvLimit", "Max Combined LTV (%)", 80, 50, 90, 1),
      i("loanAmount", "Desired Loan Amount ($)", 40000, 5000, 500000, 1000),
      i("annualRate", "Interest Rate (%)", 8.2, 1, 20, 0.1),
      i("termMonths", "Loan Term (months)", 120, 24, 360, 12),
    ],
    intro:
      "A home equity loan lets you borrow against the value of your home with a fixed rate and payment. This tool estimates available equity and the monthly payment for your desired loan amount.",
    howToUse: [
      "Enter your estimated home value and current mortgage balance.",
      "Set the maximum combined loan-to-value (CLTV) your lender allows.",
      "Choose the equity loan amount you want to borrow.",
      "Input rate and term, then review payment and available equity.",
    ],
    faqs: [
      f(
        "How much equity can I borrow?",
        "Lenders typically cap combined LTV around 80–85%, though limits vary by credit, property, and market."
      ),
      f(
        "Is home equity loan interest deductible?",
        "Interest may be deductible if funds are used to buy, build, or substantially improve the home—verify with a tax advisor."
      ),
      f(
        "Loan vs. HELOC: what is the difference?",
        "A home equity loan is a lump sum with fixed payments; a HELOC is a revolving credit line with variable rates."
      ),
    ],
  }),
  calc({
    slug: "bi-weekly-mortgage-payment-calculator",
    title: "Bi-Weekly Mortgage Payment Calculator",
    category: C.loans,
    description:
      "See how switching to bi-weekly mortgage payments accelerates payoff. Estimate interest savings from 26 half-payments per year.",
    formulaType: "biWeeklyMortgage",
    inputs: [
      i("principal", "Mortgage Balance ($)", 350000, 50000, 2000000, 5000),
      i("annualRate", "Annual Interest Rate (%)", 6.25, 1, 15, 0.05),
      i("termYears", "Remaining Term (years)", 30, 5, 40, 1),
    ],
    intro:
      "Bi-weekly mortgage payments split your monthly amount in half and pay every two weeks—resulting in one extra full payment each year. This calculator shows the potential interest savings and shorter payoff timeline.",
    howToUse: [
      "Enter your outstanding mortgage principal.",
      "Input your mortgage interest rate.",
      "Set the remaining amortization period in years.",
      "Compare standard monthly vs. bi-weekly payoff results.",
    ],
    faqs: [
      f(
        "Why do bi-weekly payments save money?",
        "Twenty-six half-payments equal thirteen full monthly payments per year, applying more to principal annually."
      ),
      f(
        "Will my lender accept bi-weekly payments?",
        "Many do, but confirm processing rules and whether payments are applied immediately to principal."
      ),
      f(
        "Is this the same as making one extra payment?",
        "Effectively yes over a year, though cash-flow timing differs throughout the months."
      ),
    ],
  }),
  calc({
    slug: "balloon-loan-payment-calculator",
    title: "Balloon Loan Payment Calculator",
    category: C.loans,
    description:
      "Calculate amortizing payments and the final balloon balance due at term end. Plan ahead for large lump-sum obligations.",
    formulaType: "balloonLoan",
    inputs: [
      i("principal", "Loan Amount ($)", 200000, 10000, 2000000, 5000),
      i("annualRate", "Interest Rate (%)", 7, 1, 20, 0.1),
      i("amortYears", "Amortization Period (years)", 30, 10, 40, 1),
      i("balloonYears", "Balloon Due In (years)", 5, 1, 15, 1),
    ],
    intro:
      "Balloon loans feature lower interim payments based on a longer amortization, then a large balance due at a shorter maturity. Use this calculator to estimate regular payments and the balloon amount you must refinance or pay off.",
    howToUse: [
      "Enter the full loan principal.",
      "Provide the interest rate and full amortization period.",
      "Set when the balloon payment comes due.",
      "Review the interim payment and remaining balloon balance.",
    ],
    faqs: [
      f(
        "What happens when the balloon comes due?",
        "You typically refinance, sell the asset, or pay the remaining balance in cash."
      ),
      f(
        "Are balloon loans risky?",
        "Yes—if refinancing markets tighten or rates rise, covering the balloon can become difficult."
      ),
      f(
        "Who uses balloon loans?",
        "They appear in commercial real estate, some seller financing, and certain short-horizon purchase scenarios."
      ),
    ],
  }),

  // ——— Real Estate & Housing ———
  calc({
    slug: "monthly-mortgage-payment-calculator",
    title: "Monthly Mortgage Payment Calculator",
    category: C.realEstate,
    description:
      "Calculate principal and interest on a fixed-rate mortgage. Instantly see how price, down payment, rate, and term shape your payment.",
    formulaType: "monthlyMortgage",
    inputs: [
      i("homePrice", "Home Price ($)", 425000, 50000, 3000000, 5000),
      i("downPayment", "Down Payment ($)", 85000, 0, 1000000, 1000),
      i("annualRate", "Interest Rate (%)", 6.5, 1, 15, 0.05),
      i("termYears", "Loan Term (years)", 30, 10, 40, 1),
    ],
    intro:
      "Knowing your monthly mortgage payment is essential before making an offer. This calculator isolates principal and interest so you can compare homes and loan structures with clarity.",
    howToUse: [
      "Enter the purchase price of the home.",
      "Input your planned down payment amount.",
      "Set the expected mortgage interest rate and loan term.",
      "Review the estimated monthly principal and interest payment.",
    ],
    faqs: [
      f(
        "Does this include taxes and insurance?",
        "This estimate covers principal and interest only. Property taxes, insurance, and HOA fees are additional."
      ),
      f(
        "How does down payment size affect payment?",
        "A larger down payment reduces the loan principal, which lowers monthly payments and may help avoid PMI."
      ),
      f(
        "15-year vs 30-year mortgage?",
        "A 15-year loan costs more monthly but usually carries a lower rate and far less total interest."
      ),
    ],
  }),
  calc({
    slug: "rent-vs-buy-long-term-calculator",
    title: "Rent vs. Buy Long-Term Calculator",
    category: C.realEstate,
    description:
      "Compare the long-term cost of renting versus buying a home. Factor appreciation, opportunity cost, and ownership expenses.",
    formulaType: "rentVsBuy",
    inputs: [
      i("homePrice", "Home Price ($)", 400000, 100000, 2000000, 5000),
      i("downPaymentPct", "Down Payment (%)", 20, 5, 50, 1),
      i("mortgageRate", "Mortgage Rate (%)", 6.5, 1, 15, 0.1),
      i("monthlyRent", "Monthly Rent ($)", 2200, 500, 10000, 50),
      i("years", "Comparison Period (years)", 10, 3, 30, 1),
      i("homeAppreciation", "Home Appreciation (%/yr)", 3, 0, 10, 0.1),
      i("investReturn", "Investment Return (%/yr)", 7, 0, 15, 0.1),
    ],
    intro:
      "Renting versus buying is rarely a one-size decision. This long-term calculator weighs housing payments, appreciation, and the investment opportunity of capital you would otherwise keep liquid.",
    howToUse: [
      "Enter home price, down payment percentage, and mortgage rate.",
      "Input your current or expected monthly rent.",
      "Set the comparison horizon and assumed appreciation/return rates.",
      "Compare estimated net wealth outcomes for both paths.",
    ],
    faqs: [
      f(
        "Is buying always better long term?",
        "Not always—high transaction costs, short ownership periods, or strong investment alternatives can favor renting."
      ),
      f(
        "What costs does ownership add?",
        "Maintenance, property taxes, insurance, HOA fees, and closing costs can meaningfully change the comparison."
      ),
      f(
        "How important is the time horizon?",
        "Short stays often favor renting because purchase and sale costs dilute early equity gains."
      ),
    ],
  }),
  calc({
    slug: "home-affordability-calculator",
    title: "Home Affordability Calculator",
    category: C.realEstate,
    description:
      "Estimate how much house you can afford from income, debts, and down payment. Stay within healthy housing-cost guidelines.",
    formulaType: "homeAffordability",
    inputs: [
      i("annualIncome", "Gross Annual Income ($)", 120000, 20000, 500000, 1000),
      i("monthlyDebts", "Other Monthly Debts ($)", 400, 0, 10000, 50),
      i("downPayment", "Down Payment ($)", 60000, 0, 500000, 1000),
      i("annualRate", "Mortgage Rate (%)", 6.5, 1, 15, 0.1),
      i("termYears", "Loan Term (years)", 30, 10, 40, 1),
      i("dtiLimit", "Max DTI (%)", 36, 20, 50, 1),
    ],
    intro:
      "Home affordability hinges on income, existing debt, and lender debt-to-income limits. This calculator estimates a comfortable purchase price range before you tour listings.",
    howToUse: [
      "Enter your gross annual household income.",
      "Add non-housing monthly debt payments.",
      "Input available down payment, rate, term, and preferred DTI cap.",
      "Review the estimated maximum affordable home price.",
    ],
    faqs: [
      f(
        "What DTI do lenders prefer?",
        "Many conventional programs look for total DTI near or below 36–43%, though guidelines vary."
      ),
      f(
        "Should I buy at the maximum I qualify for?",
        "Often no—leaving budget room for maintenance, savings, and lifestyle flexibility is wiser."
      ),
      f(
        "Does this include taxes and insurance?",
        "This estimate focuses on principal and interest capacity; taxes and insurance further reduce affordability."
      ),
    ],
  }),
  calc({
    slug: "property-tax-estimator",
    title: "Property Tax Estimator",
    category: C.realEstate,
    description:
      "Estimate annual and monthly property taxes from assessed value and local millage. Budget ownership costs more accurately.",
    formulaType: "propertyTax",
    inputs: [
      i("assessedValue", "Assessed Home Value ($)", 380000, 50000, 3000000, 5000),
      i("taxRate", "Effective Tax Rate (%)", 1.1, 0.1, 5, 0.05),
      i("exemptions", "Exemptions / Credits ($)", 0, 0, 50000, 100),
    ],
    intro:
      "Property taxes are a major recurring ownership cost that vary widely by location. Use this estimator to translate assessed value and effective rates into annual and monthly tax budgets.",
    howToUse: [
      "Enter the assessed value used by your local tax authority.",
      "Input the effective property tax rate as a percentage.",
      "Subtract any homestead exemptions or credits if applicable.",
      "Review estimated annual and monthly tax amounts.",
    ],
    faqs: [
      f(
        "Is assessed value the same as market value?",
        "Not always—many jurisdictions assess at a fraction of market value or update on a lag."
      ),
      f(
        "Can I appeal my assessment?",
        "Yes, most areas allow appeals with comparable sales evidence within a defined window."
      ),
      f(
        "Do new buyers face tax resets?",
        "In some regions, ownership transfers can reassess value and raise taxes—check local rules."
      ),
    ],
  }),
  calc({
    slug: "rental-property-cash-flow-calculator",
    title: "Rental Property Cash Flow Calculator",
    category: C.realEstate,
    description:
      "Project monthly and annual cash flow for a rental property. Account for rent, vacancy, expenses, and financing.",
    formulaType: "rentalCashFlow",
    inputs: [
      i("monthlyRent", "Gross Monthly Rent ($)", 2400, 500, 15000, 50),
      i("vacancyRate", "Vacancy Rate (%)", 5, 0, 30, 1),
      i("operatingExpenses", "Monthly Operating Expenses ($)", 600, 0, 10000, 25),
      i("mortgagePayment", "Monthly Mortgage ($)", 1450, 0, 15000, 25),
    ],
    intro:
      "Positive cash flow is the lifeblood of rental investing. This calculator estimates net operating income and cash flow after vacancy, expenses, and debt service.",
    howToUse: [
      "Enter expected gross monthly rent.",
      "Set a realistic vacancy percentage.",
      "Add monthly operating expenses (taxes, insurance, maintenance, management).",
      "Include the mortgage payment and review cash flow results.",
    ],
    faqs: [
      f(
        "What vacancy rate should I assume?",
        "Many investors use 5–8% as a baseline, adjusting for local demand and unit type."
      ),
      f(
        "Which expenses are operating costs?",
        "Property taxes, insurance, repairs, utilities you pay, HOA, and property management are common inclusions."
      ),
      f(
        "Is cash flow the same as profit?",
        "Cash flow is money left after expenses and debt service; taxable profit also considers depreciation and other adjustments."
      ),
    ],
  }),
  calc({
    slug: "real-estate-cap-rate-calculator",
    title: "Real Estate Cap Rate Calculator",
    category: C.realEstate,
    description:
      "Compute capitalization rate from NOI and property value. Compare income properties on a standardized yield basis.",
    formulaType: "capRate",
    inputs: [
      i("noi", "Annual Net Operating Income ($)", 28000, 1000, 500000, 500),
      i("propertyValue", "Property Value ($)", 400000, 50000, 5000000, 5000),
    ],
    intro:
      "Cap rate expresses a property’s unlevered yield as NOI divided by value. Investors use it to compare deals across markets without factoring financing.",
    howToUse: [
      "Enter the property’s annual net operating income.",
      "Input the purchase price or current market value.",
      "Review the resulting capitalization rate percentage.",
    ],
    faqs: [
      f(
        "What is a good cap rate?",
        "It depends on market risk, property type, and growth expectations—higher caps often imply higher perceived risk."
      ),
      f(
        "Does cap rate include mortgage payments?",
        "No. Cap rate is based on NOI before debt service."
      ),
      f(
        "How is NOI calculated?",
        "NOI is gross operating income minus operating expenses, excluding financing and capital expenditures."
      ),
    ],
  }),
  calc({
    slug: "gross-rent-multiplier-calculator",
    title: "Gross Rent Multiplier Calculator",
    category: C.realEstate,
    description:
      "Calculate GRM to screen rental properties quickly. Compare price relative to gross rental income.",
    formulaType: "grossRentMultiplier",
    inputs: [
      i("propertyPrice", "Property Price ($)", 350000, 50000, 5000000, 5000),
      i("annualRent", "Annual Gross Rent ($)", 36000, 5000, 500000, 500),
    ],
    intro:
      "Gross Rent Multiplier (GRM) is a fast screening metric equal to price divided by annual gross rent. Lower GRMs can indicate relatively cheaper income properties before deeper underwriting.",
    howToUse: [
      "Enter the asking or purchase price.",
      "Input total annual gross rental income.",
      "Review the GRM and implied rent-based valuation context.",
    ],
    faqs: [
      f(
        "Is a lower GRM always better?",
        "Often it suggests a lower price per dollar of rent, but expenses and condition still matter."
      ),
      f(
        "How does GRM differ from cap rate?",
        "GRM uses gross rent and ignores expenses; cap rate uses NOI and better reflects operating reality."
      ),
      f(
        "When should I use GRM?",
        "Use it for quick comps, then validate with full cash-flow and cap-rate analysis."
      ),
    ],
  }),
  calc({
    slug: "home-improvement-roi-calculator",
    title: "Home Improvement ROI Calculator",
    category: C.realEstate,
    description:
      "Estimate return on investment for renovations and upgrades. Weigh project cost against expected value added.",
    formulaType: "homeImprovementRoi",
    inputs: [
      i("projectCost", "Project Cost ($)", 15000, 500, 200000, 250),
      i("valueAdded", "Expected Value Added ($)", 12000, 0, 250000, 250),
      i("yearsOwned", "Years Until Sale", 5, 1, 30, 1),
    ],
    intro:
      "Not every renovation pays for itself at resale. This ROI calculator compares project cost to expected value added so you can prioritize high-impact improvements.",
    howToUse: [
      "Enter the full project budget including materials and labor.",
      "Estimate how much the improvement may add to home value.",
      "Set how many years you expect to hold the home.",
      "Review ROI percentage and net value impact.",
    ],
    faqs: [
      f(
        "Which projects typically return the most?",
        "Minor kitchen updates, bathroom refreshes, and curb appeal work often recover a high share of cost."
      ),
      f(
        "Should I renovate purely for ROI?",
        "Personal enjoyment and safety matter too—ROI is one input, not the only one."
      ),
      f(
        "Do over-improvements hurt?",
        "Yes—upgrading far beyond neighborhood norms can limit recoverable value."
      ),
    ],
  }),
  calc({
    slug: "down-payment-savings-timeline-calculator",
    title: "Down Payment Savings Timeline Calculator",
    category: C.realEstate,
    description:
      "Project how long it will take to save for a home down payment. Factor current savings, monthly deposits, and interest.",
    formulaType: "downPaymentTimeline",
    inputs: [
      i("targetAmount", "Down Payment Goal ($)", 80000, 5000, 500000, 1000),
      i("currentSavings", "Current Savings ($)", 15000, 0, 500000, 500),
      i("monthlyContribution", "Monthly Contribution ($)", 1200, 50, 20000, 50),
      i("annualReturn", "Expected Annual Return (%)", 4, 0, 12, 0.1),
    ],
    intro:
      "Building a down payment is often the longest step toward homeownership. This calculator estimates months and years to reach your target using contributions and modest growth.",
    howToUse: [
      "Set your target down payment amount.",
      "Enter current savings dedicated to the goal.",
      "Add planned monthly contributions and expected return.",
      "Review the estimated timeline to hit your goal.",
    ],
    faqs: [
      f(
        "Where should I keep down payment savings?",
        "Near-term funds usually belong in high-yield savings or short-duration conservative investments."
      ),
      f(
        "Is 20% always required?",
        "No—many loans allow lower down payments, though PMI or higher rates may apply."
      ),
      f(
        "Should I pause investing to save faster?",
        "Balance depends on timelines, employer matches, and risk—don’t automatically abandon retirement contributions."
      ),
    ],
  }),
  calc({
    slug: "land-transfer-closing-cost-calculator",
    title: "Land Transfer and Closing Cost Calculator",
    category: C.realEstate,
    description:
      "Estimate land transfer taxes and typical closing costs at purchase. Budget cash-to-close beyond the down payment.",
    formulaType: "closingCosts",
    inputs: [
      i("purchasePrice", "Purchase Price ($)", 450000, 50000, 3000000, 5000),
      i("transferTaxRate", "Transfer Tax Rate (%)", 1.5, 0, 5, 0.05),
      i("closingCostPct", "Other Closing Costs (%)", 2, 0.5, 6, 0.1),
      i("credits", "Seller / Lender Credits ($)", 0, 0, 50000, 500),
    ],
    intro:
      "Closing costs and transfer taxes can add thousands beyond your down payment. This estimator helps you prepare a realistic cash-to-close figure before finalizing a purchase.",
    howToUse: [
      "Enter the property purchase price.",
      "Set your region’s land transfer or stamp tax rate.",
      "Estimate other closing costs as a percentage of price.",
      "Subtract any credits and review total cash needed at closing.",
    ],
    faqs: [
      f(
        "What is included in closing costs?",
        "Common items include title fees, lender charges, escrow, appraisals, prepaid taxes, and insurance."
      ),
      f(
        "Do buyers always pay transfer tax?",
        "Responsibility varies by region and negotiation—sometimes costs are split or credited."
      ),
      f(
        "Can closing costs be rolled into the loan?",
        "Sometimes, subject to LTV limits and lender policy; otherwise they are paid at closing."
      ),
    ],
  }),

  // ——— Investing & Wealth Building ———
  calc({
    slug: "compound-interest-calculator",
    title: "Compound Interest Calculator",
    category: C.investing,
    description:
      "Project investment growth with compound interest and regular contributions. Visualize how time and rate multiply wealth.",
    formulaType: "compoundInterest",
    inputs: [
      i("principal", "Starting Principal ($)", 10000, 0, 1000000, 500),
      i("monthlyContribution", "Monthly Contribution ($)", 500, 0, 20000, 50),
      i("annualRate", "Annual Return (%)", 8, 0, 20, 0.1),
      i("years", "Time Horizon (years)", 20, 1, 50, 1),
    ],
    intro:
      "Compound interest turns reinvested earnings into accelerated growth. This calculator projects future value from an initial balance, ongoing contributions, and assumed annual returns.",
    howToUse: [
      "Enter your starting investment balance.",
      "Add the amount you plan to contribute each month.",
      "Set an expected annual return and investment horizon.",
      "Review ending balance, total contributions, and growth.",
    ],
    faqs: [
      f(
        "How often does compounding occur here?",
        "This model compounds monthly, a common approximation for long-term portfolio growth."
      ),
      f(
        "Are returns guaranteed?",
        "No—market returns vary. Use conservative assumptions for planning."
      ),
      f(
        "Should I include inflation?",
        "For purchasing-power planning, adjust results for inflation or use our Inflation Purchasing Power Calculator."
      ),
    ],
  }),
  calc({
    slug: "fire-early-retirement-calculator",
    title: "FIRE Early Retirement Calculator",
    category: C.investing,
    description:
      "Estimate when you can reach financial independence using savings rate and withdrawal assumptions. Plan your FIRE number with clarity.",
    formulaType: "fireRetirement",
    inputs: [
      i("annualExpenses", "Annual Expenses ($)", 50000, 15000, 300000, 1000),
      i("currentSavings", "Current Invested Assets ($)", 120000, 0, 5000000, 5000),
      i("annualSavings", "Annual Savings ($)", 30000, 0, 500000, 1000),
      i("annualReturn", "Expected Return (%)", 7, 1, 15, 0.1),
      i("withdrawalRate", "Safe Withdrawal Rate (%)", 4, 2, 6, 0.1),
    ],
    intro:
      "Financial Independence, Retire Early (FIRE) centers on building a portfolio large enough to cover living costs via a sustainable withdrawal rate. This calculator estimates your FIRE number and years to reach it.",
    howToUse: [
      "Enter your expected annual spending in retirement.",
      "Input current invested assets and yearly savings capacity.",
      "Set assumed portfolio return and withdrawal rate.",
      "Review FIRE target and estimated years to independence.",
    ],
    faqs: [
      f(
        "What is the 4% rule?",
        "It suggests withdrawing about 4% of a diversified portfolio in year one, then adjusting for inflation—useful as a starting heuristic, not a guarantee."
      ),
      f(
        "How do I lower my FIRE number?",
        "Reducing planned annual expenses has the largest impact because the target is expenses divided by withdrawal rate."
      ),
      f(
        "Should returns be real or nominal?",
        "Using real (inflation-adjusted) returns with real expenses keeps the model internally consistent."
      ),
    ],
  }),
  calc({
    slug: "retirement-savings-goal-calculator",
    title: "Retirement Savings Goal Calculator",
    category: C.investing,
    description:
      "Calculate how much you need to retire based on income replacement. Translate lifestyle goals into a portfolio target.",
    formulaType: "retirementGoal",
    inputs: [
      i("desiredAnnualIncome", "Desired Annual Retirement Income ($)", 70000, 20000, 300000, 1000),
      i("otherIncome", "Pension / Other Annual Income ($)", 15000, 0, 150000, 1000),
      i("withdrawalRate", "Withdrawal Rate (%)", 4, 2, 6, 0.1),
      i("currentSavings", "Current Retirement Savings ($)", 150000, 0, 5000000, 5000),
      i("yearsToRetire", "Years Until Retirement", 25, 1, 45, 1),
      i("annualReturn", "Expected Annual Return (%)", 7, 1, 15, 0.1),
    ],
    intro:
      "A retirement goal converts desired spending into the capital required to sustain it. This calculator estimates your target nest egg and the monthly savings pace needed to get there.",
    howToUse: [
      "Enter the annual income you want in retirement.",
      "Subtract expected pensions or other income sources.",
      "Set withdrawal rate, current savings, years remaining, and return assumption.",
      "Review target portfolio size and required monthly savings.",
    ],
    faqs: [
      f(
        "What income replacement rate is common?",
        "Many planners use 70–80% of pre-retirement income as a starting point, then customize."
      ),
      f(
        "How do Social Security benefits factor in?",
        "Treat estimated benefits as other income to reduce the portfolio-funded gap."
      ),
      f(
        "What if markets underperform?",
        "Build margin of safety with higher savings, flexible spending, or a later retirement date."
      ),
    ],
  }),
  calc({
    slug: "rrsp-401k-growth-calculator",
    title: "RRSP and 401k Growth Calculator",
    category: C.investing,
    description:
      "Project tax-advantaged retirement account growth with contributions and employer match. See the long-term power of deferred compounding.",
    formulaType: "rrsp401kGrowth",
    inputs: [
      i("currentBalance", "Current Balance ($)", 45000, 0, 2000000, 1000),
      i("employeeContribution", "Your Annual Contribution ($)", 12000, 0, 100000, 500),
      i("employerMatch", "Employer Match ($/year)", 4000, 0, 50000, 250),
      i("annualReturn", "Expected Return (%)", 7, 1, 15, 0.1),
      i("years", "Years Contributing", 30, 1, 45, 1),
    ],
    intro:
      "RRSP and 401(k) accounts combine tax advantages with long compounding runways. This calculator projects balances when you contribute consistently and capture available employer matching.",
    howToUse: [
      "Enter your current retirement account balance.",
      "Add your planned annual contribution and employer match.",
      "Set expected return and years until withdrawal phase.",
      "Review projected future value and total contributions.",
    ],
    faqs: [
      f(
        "Should I always capture the full match?",
        "Yes—employer match is typically an immediate, high-return component of compensation."
      ),
      f(
        "Traditional vs Roth contributions?",
        "Traditional lowers taxable income now; Roth grows tax-free for qualified withdrawals—tax bracket expectations guide the choice."
      ),
      f(
        "What contribution limits apply?",
        "Limits change yearly and differ by account type—confirm current IRS or CRA maximums."
      ),
    ],
  }),
  calc({
    slug: "dividend-reinvestment-calculator",
    title: "Dividend Reinvestment Calculator",
    category: C.investing,
    description:
      "Model dividend growth with reinvestment (DRIP). Estimate how yield and compounding expand share ownership over time.",
    formulaType: "dividendReinvestment",
    inputs: [
      i("initialInvestment", "Initial Investment ($)", 20000, 500, 1000000, 500),
      i("dividendYield", "Dividend Yield (%)", 3, 0, 12, 0.1),
      i("dividendGrowth", "Dividend Growth (%/yr)", 5, 0, 15, 0.1),
      i("priceGrowth", "Price Appreciation (%/yr)", 4, 0, 15, 0.1),
      i("years", "Holding Period (years)", 20, 1, 40, 1),
    ],
    intro:
      "Dividend reinvestment buys additional shares automatically, compounding income and ownership. This tool estimates ending portfolio value when dividends grow and are reinvested throughout the holding period.",
    howToUse: [
      "Enter your starting investment amount.",
      "Set current dividend yield and expected dividend growth.",
      "Add assumed price appreciation and holding years.",
      "Review projected ending value with reinvestment.",
    ],
    faqs: [
      f(
        "What is a DRIP?",
        "A Dividend Reinvestment Plan automatically uses cash dividends to purchase more shares, often fractionally."
      ),
      f(
        "Are reinvested dividends taxable?",
        "In taxable accounts, dividends are usually taxable even when reinvested; tax-advantaged accounts defer or shelter tax."
      ),
      f(
        "Do high yields always mean better results?",
        "Not necessarily—unsustainably high yields can signal risk or stagnant price growth."
      ),
    ],
  }),
  calc({
    slug: "inflation-purchasing-power-calculator",
    title: "Inflation Purchasing Power Calculator",
    category: C.investing,
    description:
      "See how inflation erodes the real value of money over time. Convert today’s dollars into future purchasing power.",
    formulaType: "inflationPurchasingPower",
    inputs: [
      i("amount", "Current Amount ($)", 10000, 100, 1000000, 100),
      i("inflationRate", "Annual Inflation (%)", 3, 0, 15, 0.1),
      i("years", "Years From Now", 20, 1, 50, 1),
    ],
    intro:
      "Inflation quietly reduces what each dollar can buy. This calculator shows the future purchasing power of a present sum—or equivalently, how much more you would need to maintain today’s lifestyle.",
    howToUse: [
      "Enter the dollar amount you want to evaluate.",
      "Set an assumed average annual inflation rate.",
      "Choose the number of years ahead.",
      "Review remaining purchasing power and equivalent future cost.",
    ],
    faqs: [
      f(
        "What inflation rate should I use?",
        "Long-run averages near 2–3% are common planning anchors, but personal inflation can differ."
      ),
      f(
        "How do I protect purchasing power?",
        "Investing in productive assets historically helps offset inflation better than holding cash long term."
      ),
      f(
        "Is CPI the best measure?",
        "CPI is widely used, though your household basket may inflate faster or slower than the index."
      ),
    ],
  }),
  calc({
    slug: "net-worth-tracker-calculator",
    title: "Net Worth Tracker Calculator",
    category: C.investing,
    description:
      "Calculate net worth by subtracting liabilities from assets. Establish a clear baseline for wealth-building progress.",
    formulaType: "netWorthTracker",
    inputs: [
      i("cash", "Cash & Savings ($)", 15000, 0, 2000000, 500),
      i("investments", "Investments ($)", 120000, 0, 5000000, 1000),
      i("property", "Real Estate Equity Value ($)", 250000, 0, 5000000, 5000),
      i("otherAssets", "Other Assets ($)", 10000, 0, 1000000, 500),
      i("mortgage", "Mortgage Balance ($)", 200000, 0, 3000000, 5000),
      i("otherDebts", "Other Debts ($)", 12000, 0, 500000, 500),
    ],
    intro:
      "Net worth is the clearest single snapshot of financial progress: assets minus liabilities. Use this tracker to baseline where you stand and monitor improvements over time.",
    howToUse: [
      "Add liquid cash, investment, property, and other asset values.",
      "Enter mortgage and remaining debt balances.",
      "Review total assets, total liabilities, and net worth.",
    ],
    faqs: [
      f(
        "Should I use market value for assets?",
        "Yes—use realistic current market values rather than purchase prices for an accurate snapshot."
      ),
      f(
        "How often should I track net worth?",
        "Monthly or quarterly is enough for most people; avoid obsessing over short-term market noise."
      ),
      f(
        "Do I include household items?",
        "Optional. Many people exclude depreciating personal items to keep the metric investment-focused."
      ),
    ],
  }),
  calc({
    slug: "rule-of-72-doubling-time-calculator",
    title: "Rule of 72 Doubling Time Calculator",
    category: C.investing,
    description:
      "Estimate how long an investment takes to double using the Rule of 72. Quickly compare rates of return.",
    formulaType: "ruleOf72",
    inputs: [
      i("annualRate", "Annual Return (%)", 8, 0.5, 30, 0.1),
      i("principal", "Starting Amount ($)", 10000, 100, 1000000, 100),
    ],
    intro:
      "The Rule of 72 is a mental shortcut: divide 72 by the annual return to approximate years to double. This calculator applies the rule and shows the projected doubled value.",
    howToUse: [
      "Enter the expected annual rate of return.",
      "Optionally set a starting principal to see the doubled amount.",
      "Review approximate years required to double your money.",
    ],
    faqs: [
      f(
        "How accurate is the Rule of 72?",
        "It is a close approximation for moderate returns; exact compounding math differs slightly."
      ),
      f(
        "Can I use it for inflation?",
        "Yes—dividing 72 by inflation roughly estimates years for prices to double."
      ),
      f(
        "What about Rule of 69 or 70?",
        "Those variants can be slightly more accurate for continuous compounding, but 72 is easiest mentally."
      ),
    ],
  }),
  calc({
    slug: "dollar-cost-averaging-calculator",
    title: "Dollar-Cost Averaging Calculator",
    category: C.investing,
    description:
      "Simulate dollar-cost averaging with fixed contributions over time. Estimate shares accumulated and average cost basis.",
    formulaType: "dollarCostAveraging",
    inputs: [
      i("monthlyInvestment", "Monthly Investment ($)", 500, 50, 20000, 50),
      i("startingPrice", "Starting Share Price ($)", 50, 1, 2000, 1),
      i("annualGrowth", "Expected Price Growth (%/yr)", 8, -20, 30, 0.5),
      i("months", "Number of Months", 60, 6, 360, 1),
    ],
    intro:
      "Dollar-cost averaging (DCA) invests a fixed amount on a schedule regardless of price swings. This calculator estimates accumulated value and average purchase price under a growth assumption.",
    howToUse: [
      "Enter how much you invest each month.",
      "Set a starting share price and expected annual price growth.",
      "Choose the number of months you will continue investing.",
      "Review total invested, estimated value, and average cost.",
    ],
    faqs: [
      f(
        "Is DCA better than lump-sum investing?",
        "Historically lump-sum often wins if markets rise, but DCA can reduce regret and timing stress."
      ),
      f(
        "Does DCA eliminate risk?",
        "No—it manages entry-timing risk but market risk remains."
      ),
      f(
        "What assets fit DCA well?",
        "Broad index funds and ETFs are popular because they are diversified and easy to buy repeatedly."
      ),
    ],
  }),
  calc({
    slug: "investment-management-fee-impact-calculator",
    title: "Investment Management Fee Impact Calculator",
    category: C.investing,
    description:
      "Quantify how advisory and fund fees erode long-term returns. Compare low-fee versus high-fee portfolio outcomes.",
    formulaType: "feeImpact",
    inputs: [
      i("principal", "Starting Portfolio ($)", 100000, 1000, 5000000, 1000),
      i("annualContribution", "Annual Contribution ($)", 10000, 0, 200000, 500),
      i("grossReturn", "Gross Annual Return (%)", 8, 1, 15, 0.1),
      i("feePercent", "Annual Fee (%)", 1, 0, 3, 0.05),
      i("years", "Investment Horizon (years)", 30, 1, 50, 1),
    ],
    intro:
      "Small annual fees compound into large lifetime costs. This calculator contrasts portfolio growth with and without management fees so you can see the true price of advice and fund expenses.",
    howToUse: [
      "Enter starting balance and annual contributions.",
      "Set expected gross return before fees.",
      "Input the annual fee percentage and time horizon.",
      "Compare ending values and total fee drag.",
    ],
    faqs: [
      f(
        "What fees should I include?",
        "Include expense ratios, advisory fees, and other recurring asset-based charges."
      ),
      f(
        "Is a higher fee ever justified?",
        "Possibly if advice materially improves behavior or planning outcomes—but measure the cost explicitly."
      ),
      f(
        "How do I reduce fees?",
        "Prefer low-cost index funds, negotiate advisory rates, and avoid unnecessary product layers."
      ),
    ],
  }),

  // ——— Freelance & Self-Employment ———
  calc({
    slug: "freelance-hourly-rate-calculator",
    title: "Freelance Hourly Rate Calculator",
    category: C.freelance,
    description:
      "Convert income goals into a sustainable freelance hourly rate. Account for taxes, expenses, and non-billable time.",
    formulaType: "freelanceHourlyRate",
    inputs: [
      i("targetAnnualIncome", "Target Take-Home Income ($)", 80000, 20000, 500000, 1000),
      i("annualExpenses", "Annual Business Expenses ($)", 8000, 0, 100000, 500),
      i("taxRate", "Effective Tax Rate (%)", 25, 0, 50, 1),
      i("billableHoursPerWeek", "Billable Hours / Week", 25, 5, 60, 1),
      i("weeksWorked", "Weeks Worked / Year", 48, 20, 52, 1),
    ],
    intro:
      "Freelancers often underprice by forgetting taxes, expenses, and unpaid admin time. This calculator back-solves the hourly rate required to hit your take-home income goal.",
    howToUse: [
      "Enter your desired annual take-home income.",
      "Add yearly business expenses and an effective tax rate.",
      "Set realistic billable hours per week and working weeks per year.",
      "Review the minimum hourly rate you should charge.",
    ],
    faqs: [
      f(
        "Why not just divide salary by 2,000 hours?",
        "That ignores non-billable work, benefits you self-fund, taxes, and downtime between clients."
      ),
      f(
        "Should I quote hourly or project rates?",
        "Many freelancers derive project fees from an internal hourly floor to protect margins."
      ),
      f(
        "How often should I raise rates?",
        "Review at least annually or when demand, skills, or costs increase."
      ),
    ],
  }),
  calc({
    slug: "take-home-pay-net-income-calculator",
    title: "Take-Home Pay Net Income Calculator",
    category: C.freelance,
    description:
      "Estimate net take-home pay after taxes and deductions. Translate gross salary into spendable monthly income.",
    formulaType: "takeHomePay",
    inputs: [
      i("grossSalary", "Gross Annual Salary ($)", 90000, 15000, 500000, 1000),
      i("taxRate", "Effective Tax Rate (%)", 22, 0, 50, 0.5),
      i("benefitsPercent", "Benefits / Deductions (%)", 5, 0, 20, 0.5),
      i("retirementPercent", "Retirement Contribution (%)", 6, 0, 20, 0.5),
    ],
    intro:
      "Gross pay is not what hits your bank account. This calculator estimates annual and monthly take-home income after taxes, benefits, and retirement contributions.",
    howToUse: [
      "Enter your gross annual salary.",
      "Set an effective tax rate estimate for your situation.",
      "Add benefit deductions and retirement contribution percentages.",
      "Review net annual and monthly take-home pay.",
    ],
    faqs: [
      f(
        "What is an effective tax rate?",
        "It is total tax paid divided by taxable income—often lower than your top marginal bracket."
      ),
      f(
        "Are pre-tax deductions helpful?",
        "Yes—retirement and some benefits reduce taxable income while building future security."
      ),
      f(
        "Does this replace a payroll calculator?",
        "It is an estimate for planning; exact withholding depends on jurisdiction and elections."
      ),
    ],
  }),
  calc({
    slug: "self-employment-tax-estimator",
    title: "Self-Employment Tax Estimator",
    category: C.freelance,
    description:
      "Estimate Social Security and Medicare self-employment taxes. Prepare for quarterly obligations with clearer numbers.",
    formulaType: "selfEmploymentTax",
    inputs: [
      i("netProfit", "Net Self-Employment Profit ($)", 75000, 1000, 500000, 1000),
      i("seTaxRate", "SE Tax Rate (%)", 15.3, 10, 20, 0.1),
    ],
    intro:
      "Self-employed workers pay both the employer and employee portions of Social Security and Medicare taxes. This estimator approximates self-employment tax on net profit so you can set aside funds.",
    howToUse: [
      "Enter your expected net profit from self-employment.",
      "Confirm the SE tax rate (commonly around 15.3% before adjustments).",
      "Review estimated self-employment tax and suggested quarterly set-aside.",
    ],
    faqs: [
      f(
        "Is SE tax the same as income tax?",
        "No—self-employment tax covers social insurance; income tax is separate."
      ),
      f(
        "Why is only 92.35% of profit taxed for SE?",
        "U.S. rules allow an employer-equivalent adjustment; this tool uses a simplified estimate."
      ),
      f(
        "Should I make quarterly payments?",
        "Usually yes if you expect to owe tax above withholding thresholds—penalties can apply otherwise."
      ),
    ],
  }),
  calc({
    slug: "annual-salary-to-hourly-conversion-calculator",
    title: "Annual Salary to Hourly Conversion Calculator",
    category: C.freelance,
    description:
      "Convert annual salary into hourly, daily, and weekly equivalents. Benchmark offers and freelance rates fairly.",
    formulaType: "salaryToHourly",
    inputs: [
      i("annualSalary", "Annual Salary ($)", 85000, 15000, 500000, 1000),
      i("hoursPerWeek", "Hours Per Week", 40, 10, 80, 1),
      i("weeksPerYear", "Paid Weeks Per Year", 52, 40, 52, 1),
    ],
    intro:
      "Comparing salaried and hourly opportunities is easier with equivalent rates. This converter translates annual compensation into hourly, daily, and weekly figures based on your work schedule.",
    howToUse: [
      "Enter the annual salary or target earnings.",
      "Set typical weekly hours and paid weeks per year.",
      "Review hourly, daily, and weekly equivalents.",
    ],
    faqs: [
      f(
        "Should freelancers use 2,080 hours?",
        "Often no—billable hours are usually lower after admin, sales, and time off."
      ),
      f(
        "Do benefits change the comparison?",
        "Yes—salaried roles may include health coverage, paid leave, and retirement matches worth thousands."
      ),
      f(
        "Is overtime included?",
        "This conversion assumes standard schedule hours; overtime would increase effective hourly earnings."
      ),
    ],
  }),
  calc({
    slug: "overtime-pay-calculator",
    title: "Overtime Pay Calculator",
    category: C.freelance,
    description:
      "Calculate overtime earnings from base hourly rate and extra hours. Estimate weekly pay with time-and-a-half premiums.",
    formulaType: "overtimePay",
    inputs: [
      i("hourlyRate", "Base Hourly Rate ($)", 28, 10, 200, 0.5),
      i("regularHours", "Regular Hours", 40, 0, 60, 1),
      i("overtimeHours", "Overtime Hours", 8, 0, 40, 0.5),
      i("overtimeMultiplier", "Overtime Multiplier", 1.5, 1, 3, 0.1),
    ],
    intro:
      "Overtime can significantly boost weekly earnings when paid at a premium. Use this calculator to estimate total pay from regular and overtime hours under your multiplier rules.",
    howToUse: [
      "Enter your base hourly wage.",
      "Set regular hours worked and overtime hours.",
      "Confirm the overtime multiplier (commonly 1.5).",
      "Review regular pay, overtime pay, and weekly total.",
    ],
    faqs: [
      f(
        "What is time-and-a-half?",
        "It means overtime hours are paid at 1.5× your regular hourly rate."
      ),
      f(
        "Who is eligible for overtime?",
        "Eligibility depends on local labor law and exemption status—verify with your jurisdiction."
      ),
      f(
        "Do bonuses affect overtime?",
        "In some cases, non-discretionary bonuses can alter the regular rate used for overtime calculations."
      ),
    ],
  }),
  calc({
    slug: "salary-raise-percentage-increase-calculator",
    title: "Salary Raise Percentage Increase Calculator",
    category: C.freelance,
    description:
      "Compute new salary and raise percentage from current and offered pay. Negotiate with clear before-and-after figures.",
    formulaType: "salaryRaise",
    inputs: [
      i("currentSalary", "Current Salary ($)", 75000, 15000, 500000, 1000),
      i("raisePercent", "Raise Percentage (%)", 5, 0, 50, 0.1),
    ],
    intro:
      "Whether you received an offer or are planning a request, raise math should be instant and clear. This calculator shows your new salary, dollar increase, and monthly impact.",
    howToUse: [
      "Enter your current annual salary.",
      "Input the raise percentage you expect or negotiate.",
      "Review new salary and absolute increase amounts.",
    ],
    faqs: [
      f(
        "What raise is typical?",
        "Cost-of-living adjustments often land around a few percent; promotions or market corrections can be higher."
      ),
      f(
        "Should I negotiate percentage or dollars?",
        "Either works—focus on market data and the absolute lifestyle impact of the increase."
      ),
      f(
        "How do raises relate to inflation?",
        "If your raise lags inflation, real purchasing power declines even when nominal pay rises."
      ),
    ],
  }),
  calc({
    slug: "sales-commission-earnings-calculator",
    title: "Sales Commission Earnings Calculator",
    category: C.freelance,
    description:
      "Estimate total earnings from base pay plus sales commissions. Model quota attainment and variable income.",
    formulaType: "salesCommission",
    inputs: [
      i("baseSalary", "Base Salary ($)", 45000, 0, 300000, 1000),
      i("salesVolume", "Sales Volume ($)", 500000, 0, 5000000, 5000),
      i("commissionRate", "Commission Rate (%)", 8, 0, 40, 0.5),
      i("bonus", "Performance Bonus ($)", 2000, 0, 100000, 500),
    ],
    intro:
      "Commission roles blend stability and upside. This calculator combines base salary, commission on sales volume, and bonuses into an estimated total compensation figure.",
    howToUse: [
      "Enter your base salary (use 0 for pure commission roles).",
      "Input expected sales volume and commission rate.",
      "Add any flat performance bonus.",
      "Review commission earnings and total pay.",
    ],
    faqs: [
      f(
        "Are commissions taxed differently?",
        "They are usually taxed as ordinary income, though withholding methods can differ by paycheck."
      ),
      f(
        "What is a good commission rate?",
        "It depends on deal size, sales cycle, and how much base pay is offered."
      ),
      f(
        "Should I plan on 100% quota?",
        "Build a personal budget around a conservative attainment rate, then treat upside as bonus."
      ),
    ],
  }),
  calc({
    slug: "side-hustle-net-profit-calculator",
    title: "Side Hustle Net Profit Calculator",
    category: C.freelance,
    description:
      "Measure side hustle profitability after expenses and taxes. Know whether extra work is truly worth your time.",
    formulaType: "sideHustleProfit",
    inputs: [
      i("monthlyRevenue", "Monthly Revenue ($)", 2500, 0, 100000, 50),
      i("monthlyExpenses", "Monthly Expenses ($)", 600, 0, 50000, 25),
      i("hoursPerMonth", "Hours Worked / Month", 40, 1, 300, 1),
      i("taxRate", "Effective Tax Rate (%)", 20, 0, 50, 1),
    ],
    intro:
      "Side hustles only create wealth when revenue exceeds true costs—including taxes and your time. This calculator estimates net profit and effective hourly earnings.",
    howToUse: [
      "Enter average monthly revenue from the hustle.",
      "Add monthly expenses required to operate.",
      "Set hours worked and an effective tax rate.",
      "Review net profit and earnings per hour.",
    ],
    faqs: [
      f(
        "Which expenses should I track?",
        "Materials, software, ads, equipment, contractor fees, and transaction costs are common."
      ),
      f(
        "Do I need to pay self-employment tax?",
        "Often yes above de minimis thresholds—confirm with a tax professional."
      ),
      f(
        "When should I quit a side hustle?",
        "If after-tax hourly profit is chronically low versus alternatives, pivot or pause."
      ),
    ],
  }),
  calc({
    slug: "billable-hours-tracker-calculator",
    title: "Billable Hours Tracker Calculator",
    category: C.freelance,
    description:
      "Convert tracked billable hours into revenue at your rate. Monitor utilization and monthly billing projections.",
    formulaType: "billableHours",
    inputs: [
      i("hourlyRate", "Hourly Rate ($)", 95, 20, 500, 5),
      i("billableHours", "Billable Hours", 110, 1, 300, 1),
      i("nonBillableHours", "Non-Billable Hours", 30, 0, 200, 1),
    ],
    intro:
      "Billable hours drive freelance revenue, while non-billable time drives operations. This tracker calculates invoiceable revenue and utilization so you can manage capacity intentionally.",
    howToUse: [
      "Enter your standard hourly billing rate.",
      "Input billable hours logged for the period.",
      "Add non-billable hours spent on admin or sales.",
      "Review revenue and utilization percentage.",
    ],
    faqs: [
      f(
        "What utilization rate is healthy?",
        "Many practices target roughly 50–70% billable utilization depending on role and overhead."
      ),
      f(
        "Should discovery calls be billable?",
        "Policy varies—some include them in project fees rather than hourly billing."
      ),
      f(
        "How do retainers affect tracking?",
        "Convert retainer deliverables into equivalent hours to monitor whether scope stays profitable."
      ),
    ],
  }),
  calc({
    slug: "cost-of-living-salary-adjustment-calculator",
    title: "Cost of Living Salary Adjustment Calculator",
    category: C.freelance,
    description:
      "Adjust salary expectations when relocating between cities. Compare purchasing power across cost-of-living indexes.",
    formulaType: "costOfLivingAdjustment",
    inputs: [
      i("currentSalary", "Current Salary ($)", 90000, 20000, 500000, 1000),
      i("currentIndex", "Current City COL Index", 100, 50, 250, 1),
      i("newIndex", "New City COL Index", 130, 50, 250, 1),
    ],
    intro:
      "A raise that looks good nominally can still leave you poorer after a move. This calculator adjusts your salary using cost-of-living index values so offers remain comparable.",
    howToUse: [
      "Enter your current salary.",
      "Input the cost-of-living index for your current city.",
      "Enter the index for the destination city.",
      "Review the equivalent salary needed to maintain purchasing power.",
    ],
    faqs: [
      f(
        "Where do COL indexes come from?",
        "They are published by various data providers comparing typical goods and housing baskets across cities."
      ),
      f(
        "Is housing weighted heavily?",
        "Usually yes—shelter costs dominate many urban cost-of-living differences."
      ),
      f(
        "Should remote workers negotiate COL?",
        "Policies differ; some employers use location-based bands while others pay a single national rate."
      ),
    ],
  }),

  // ——— Everyday Utilities & Savings ———
  calc({
    slug: "emergency-fund-target-calculator",
    title: "Emergency Fund Target Calculator",
    category: C.utilities,
    description:
      "Calculate how large your emergency fund should be. Base the target on monthly expenses and desired coverage months.",
    formulaType: "emergencyFund",
    inputs: [
      i("monthlyExpenses", "Essential Monthly Expenses ($)", 3500, 500, 30000, 50),
      i("monthsCoverage", "Months of Coverage", 6, 1, 12, 1),
      i("currentSavings", "Current Emergency Savings ($)", 5000, 0, 200000, 100),
    ],
    intro:
      "An emergency fund protects you from job loss, medical bills, and surprise repairs without new debt. This calculator sets a target based on essential expenses and shows your remaining gap.",
    howToUse: [
      "Enter essential monthly living expenses.",
      "Choose how many months of coverage you want (commonly 3–6+).",
      "Add what you have already saved.",
      "Review target amount and remaining savings gap.",
    ],
    faqs: [
      f(
        "How many months should I save?",
        "Three to six months is a common baseline; freelancers or single-income households may prefer more."
      ),
      f(
        "Where should I keep the fund?",
        "High-yield savings accounts balance liquidity and interest better than long-term investments for this purpose."
      ),
      f(
        "What counts as an emergency?",
        "Unexpected necessary expenses or income interruptions—not discretionary purchases."
      ),
    ],
  }),
  calc({
    slug: "savings-goal-target-date-calculator",
    title: "Savings Goal Target Date Calculator",
    category: C.utilities,
    description:
      "Find the monthly savings needed to hit a goal by a deadline. Stay on track for vacations, purchases, or milestones.",
    formulaType: "savingsGoalDate",
    inputs: [
      i("goalAmount", "Savings Goal ($)", 6000, 100, 500000, 100),
      i("currentSavings", "Already Saved ($)", 1000, 0, 500000, 50),
      i("months", "Months Until Target Date", 12, 1, 120, 1),
      i("annualReturn", "Expected Annual Return (%)", 3, 0, 12, 0.1),
    ],
    intro:
      "Deadlines turn vague wishes into actionable savings plans. This calculator determines the monthly contribution required to reach your goal on time with modest growth assumed.",
    howToUse: [
      "Enter the total amount you want to save.",
      "Subtract what you have already set aside.",
      "Set months remaining and any expected return.",
      "Review the required monthly savings amount.",
    ],
    faqs: [
      f(
        "What if I can’t afford the monthly amount?",
        "Extend the timeline, reduce the goal, or find ways to increase income/cut spending."
      ),
      f(
        "Should goal money be invested?",
        "Short-term goals usually stay in cash equivalents; longer horizons can take measured investment risk."
      ),
      f(
        "Can I automate this?",
        "Yes—automatic transfers on payday dramatically improve completion rates."
      ),
    ],
  }),
  calc({
    slug: "daily-habit-expense-latte-factor-calculator",
    title: "Daily Habit Expense Latte Factor Calculator",
    category: C.utilities,
    description:
      "Reveal the long-term cost of small daily purchases. See how tiny habits compound into annual and multi-year spending.",
    formulaType: "latteFactor",
    inputs: [
      i("dailyCost", "Daily Habit Cost ($)", 5.5, 0.5, 50, 0.25),
      i("daysPerWeek", "Days Per Week", 5, 1, 7, 1),
      i("years", "Years of Habit", 10, 1, 40, 1),
      i("annualReturn", "Opportunity Return (%)", 7, 0, 15, 0.1),
    ],
    intro:
      "The “latte factor” highlights how routine micro-spending adds up—and what that cash could become if invested instead. Use this calculator to quantify habit costs without judgment.",
    howToUse: [
      "Enter the typical daily cost of the habit.",
      "Set how many days per week you repeat it.",
      "Choose a time horizon and optional opportunity return.",
      "Review cumulative spending and potential invested value.",
    ],
    faqs: [
      f(
        "Is the latte factor about never spending on coffee?",
        "No—it is a mindfulness tool for aligning small recurring expenses with your priorities."
      ),
      f(
        "What habits matter most?",
        "Any high-frequency purchase: delivery fees, subscriptions add-ons, impulse snacks, or premium upgrades."
      ),
      f(
        "Should every dollar be optimized?",
        "Balance frugality with quality of life; cut low-joy spending first."
      ),
    ],
  }),
  calc({
    slug: "tip-and-bill-split-calculator",
    title: "Tip and Bill Split Calculator",
    category: C.utilities,
    description:
      "Split restaurant bills fairly with custom tip percentages. Get per-person totals in seconds.",
    formulaType: "tipBillSplit",
    inputs: [
      i("billAmount", "Bill Amount ($)", 86, 5, 2000, 1),
      i("tipPercent", "Tip Percentage (%)", 18, 0, 40, 1),
      i("people", "Number of People", 4, 1, 20, 1),
    ],
    intro:
      "Avoid awkward math at the table. This calculator adds your chosen tip and divides the total evenly so everyone knows exactly what to pay.",
    howToUse: [
      "Enter the pre-tip bill amount.",
      "Choose a tip percentage.",
      "Set how many people are splitting.",
      "Review tip amount, grand total, and per-person share.",
    ],
    faqs: [
      f(
        "Should tip be calculated before tax?",
        "Customs vary; many people tip on the pre-tax subtotal, while others use the full bill."
      ),
      f(
        "What if people ordered unevenly?",
        "For fairness, itemize individually; this tool assumes an even split."
      ),
      f(
        "Is 18–20% standard?",
        "In many regions yes for sit-down service, but local norms differ."
      ),
    ],
  }),
  calc({
    slug: "discount-and-sale-price-calculator",
    title: "Discount and Sale Price Calculator",
    category: C.utilities,
    description:
      "Calculate final sale prices after percentage discounts. Instantly see savings before you checkout.",
    formulaType: "discountSale",
    inputs: [
      i("originalPrice", "Original Price ($)", 120, 1, 10000, 1),
      i("discountPercent", "Discount (%)", 25, 0, 90, 1),
      i("taxPercent", "Sales Tax (%)", 8, 0, 20, 0.1),
    ],
    intro:
      "Sale tags can be confusing once stacking discounts and tax enter the picture. This calculator shows markdown savings and the final amount you actually pay.",
    howToUse: [
      "Enter the original listed price.",
      "Input the discount percentage.",
      "Add local sales tax if applicable.",
      "Review sale price, savings, and total with tax.",
    ],
    faqs: [
      f(
        "Do multiple discounts stack multiplicatively?",
        "Usually each discount applies sequentially to the reduced price—not as a simple sum of percentages."
      ),
      f(
        "Is tax applied before or after discounts?",
        "Sales tax is typically calculated on the discounted price."
      ),
      f(
        "Are ‘% off’ and coupon codes combined?",
        "It depends on store policy; some exclude certain brands or already-reduced items."
      ),
    ],
  }),
  calc({
    slug: "unit-price-comparison-calculator",
    title: "Unit Price Comparison Calculator",
    category: C.utilities,
    description:
      "Compare two products by price per unit to find true value. Spot which package size is actually cheaper.",
    formulaType: "unitPriceComparison",
    inputs: [
      i("price1", "Product A Price ($)", 4.5, 0.1, 500, 0.1),
      i("units1", "Product A Units", 16, 0.1, 1000, 0.1),
      i("price2", "Product B Price ($)", 6.5, 0.1, 500, 0.1),
      i("units2", "Product B Units", 24, 0.1, 1000, 0.1),
    ],
    intro:
      "Bigger packages are not always better deals. Compare unit prices to identify which option delivers more value for every ounce, count, or liter.",
    howToUse: [
      "Enter Product A’s price and quantity of units.",
      "Enter Product B’s price and units using the same unit type.",
      "Review price-per-unit for each and see which wins.",
    ],
    faqs: [
      f(
        "What counts as a unit?",
        "Use any consistent measure: ounces, grams, liters, sheets, or item counts."
      ),
      f(
        "Should quality differences matter?",
        "Yes—unit price is only one factor alongside quality, waste, and storage."
      ),
      f(
        "Why do warehouse clubs look cheaper?",
        "Bulk sizes often reduce unit price, but only if you will use the product before it expires."
      ),
    ],
  }),
  calc({
    slug: "fuel-cost-and-trip-mileage-calculator",
    title: "Fuel Cost and Trip Mileage Calculator",
    category: C.utilities,
    description:
      "Estimate fuel cost for a trip from distance, MPG, and gas price. Budget road travel with fewer surprises.",
    formulaType: "fuelCostTrip",
    inputs: [
      i("distance", "Trip Distance (miles)", 320, 1, 5000, 1),
      i("mpg", "Fuel Efficiency (MPG)", 28, 5, 120, 0.5),
      i("fuelPrice", "Fuel Price ($/gallon)", 3.75, 1, 10, 0.05),
    ],
    intro:
      "Trip budgets should include fuel, not just hotels and food. This calculator estimates gallons needed and total fuel cost from distance, efficiency, and pump prices.",
    howToUse: [
      "Enter total trip distance in miles.",
      "Input your vehicle’s expected miles per gallon.",
      "Set the fuel price per gallon.",
      "Review gallons required and total fuel cost.",
    ],
    faqs: [
      f(
        "Should I use city or highway MPG?",
        "Match the estimate to your route; mixed trips may need a blended MPG."
      ),
      f(
        "Does speed affect fuel cost?",
        "Yes—higher speeds and aggressive driving typically reduce efficiency."
      ),
      f(
        "Can I use kilometers and liters?",
        "Convert units first or scale inputs consistently; this version expects miles and gallons."
      ),
    ],
  }),
  calc({
    slug: "monthly-subscription-cost-aggregator",
    title: "Monthly Subscription Cost Aggregator",
    category: C.utilities,
    description:
      "Add up streaming, software, and membership subscriptions. Reveal hidden monthly and yearly recurring spend.",
    formulaType: "subscriptionAggregator",
    inputs: [
      i("sub1", "Subscription 1 ($/mo)", 15.99, 0, 500, 0.5),
      i("sub2", "Subscription 2 ($/mo)", 12.99, 0, 500, 0.5),
      i("sub3", "Subscription 3 ($/mo)", 9.99, 0, 500, 0.5),
      i("sub4", "Subscription 4 ($/mo)", 6.99, 0, 500, 0.5),
      i("sub5", "Subscription 5 ($/mo)", 19.99, 0, 500, 0.5),
    ],
    intro:
      "Subscriptions quietly stack until they rival a major bill. Aggregate your recurring memberships to see monthly and annual totals—and decide what still deserves a spot.",
    howToUse: [
      "Enter up to five monthly subscription prices.",
      "Leave unused slots at zero if you have fewer than five.",
      "Review combined monthly and yearly subscription cost.",
    ],
    faqs: [
      f(
        "How do I find forgotten subscriptions?",
        "Scan bank/card statements and app store billing history for recurring charges."
      ),
      f(
        "Annual plans vs monthly?",
        "Annual plans can be cheaper per month but increase upfront commitment—confirm you will use the service."
      ),
      f(
        "What savings target is realistic?",
        "Many households can cut 10–30% of subscription spend by canceling low-usage services."
      ),
    ],
  }),
  calc({
    slug: "simple-interest-calculator",
    title: "Simple Interest Calculator",
    category: C.utilities,
    description:
      "Compute simple interest on a principal over time. Ideal for basic loans, notes, and classroom finance math.",
    formulaType: "simpleInterest",
    inputs: [
      i("principal", "Principal ($)", 5000, 100, 1000000, 100),
      i("annualRate", "Annual Interest Rate (%)", 5, 0, 40, 0.1),
      i("years", "Time (years)", 3, 0.25, 40, 0.25),
    ],
    intro:
      "Simple interest grows in a straight line: principal × rate × time. Use this calculator for straightforward interest estimates that do not compound.",
    howToUse: [
      "Enter the principal amount.",
      "Set the annual interest rate percentage.",
      "Choose the time period in years.",
      "Review interest earned/paid and total amount.",
    ],
    faqs: [
      f(
        "How is simple interest different from compound?",
        "Simple interest does not earn interest on prior interest; compound interest does."
      ),
      f(
        "Where is simple interest used?",
        "Some short-term loans, auto notes, and educational examples still use simple interest."
      ),
      f(
        "Can time be a fraction of a year?",
        "Yes—use decimals such as 0.5 for six months."
      ),
    ],
  }),
  calc({
    slug: "percentage-increase-decrease-calculator",
    title: "Percentage Increase and Decrease Calculator",
    category: C.utilities,
    description:
      "Calculate percentage change between two values instantly. Useful for prices, metrics, and performance tracking.",
    formulaType: "percentageChange",
    inputs: [
      i("originalValue", "Original Value", 80, -1000000, 1000000, 1),
      i("newValue", "New Value", 100, -1000000, 1000000, 1),
    ],
    intro:
      "Percentage change is one of the most used calculations in business and daily life. This tool tells you the percent increase or decrease from an original value to a new value.",
    howToUse: [
      "Enter the original (starting) value.",
      "Enter the new (ending) value.",
      "Review percentage change and absolute difference.",
    ],
    faqs: [
      f(
        "What does a negative percentage mean?",
        "It indicates a decrease from the original value to the new value."
      ),
      f(
        "Why can percentage change exceed 100%?",
        "If a value more than doubles, the increase exceeds 100%."
      ),
      f(
        "What if the original value is zero?",
        "Percentage change is undefined when starting from zero—use absolute difference instead."
      ),
    ],
  }),
];

if (calculators.length !== 50) {
  console.error(`Expected 50 calculators, got ${calculators.length}`);
  process.exit(1);
}

const outPath = path.join(__dirname, "../data/calculators.json");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(calculators, null, 2));
console.log(`Wrote ${calculators.length} calculators to ${outPath}`);
