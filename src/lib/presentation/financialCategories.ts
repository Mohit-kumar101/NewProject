/** Categories that get the chart presentation / PDF deck. */
const FINANCIAL_PRESENTATION_CATEGORIES = new Set([
  "Loans & Debt Management",
  "Real Estate & Housing",
  "Short-term Rental & Housing",
  "Rent & Roommate Splits",
  "Investing & Wealth Building",
  "Crypto & Digital Assets",
  "Freelance & Self-Employment",
  "Freelance & Micro-Business",
  "Shift Work & Payroll",
  "Payroll & Shift Work",
  "Everyday Utilities & Savings",
  "Living Expenses",
  "Legal, HR & Payroll Management",
  "HR & Ops",
  "Canadian Taxes",
  "BC Local Taxes",
  "E-commerce Fees",
  "E-Commerce, Logistics & Storage",
  "Specialized Business",
  "Affordability",
  "Money Milestones",
  "Career & Compensation",
  "HR & Ops",
]);

export function supportsFinancialPresentation(category: string): boolean {
  if (FINANCIAL_PRESENTATION_CATEGORIES.has(category)) return true;
  const lower = category.toLowerCase();
  return (
    lower.includes("loan") ||
    lower.includes("debt") ||
    lower.includes("invest") ||
    lower.includes("tax") ||
    lower.includes("payroll") ||
    lower.includes("finance") ||
    lower.includes("money") ||
    lower.includes("mortgage") ||
    lower.includes("salary") ||
    lower.includes("freelance") ||
    lower.includes("afford") ||
    lower.includes("career") ||
    lower.includes("compensation") ||
    lower.includes("ops")
  );
}
