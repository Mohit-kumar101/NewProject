export type ExpenseType = "income" | "expense";

export type ExpenseCategory =
  | "Food"
  | "Transport"
  | "Housing"
  | "Utilities"
  | "Salary"
  | "Freelance"
  | "Shopping"
  | "Health"
  | "Entertainment"
  | "Other";

export type ExpenseTransaction = {
  id: string;
  title: string;
  amount: number;
  type: ExpenseType;
  category: ExpenseCategory;
  date: string; // YYYY-MM-DD
  createdAt: string;
};

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  "Food",
  "Transport",
  "Housing",
  "Utilities",
  "Salary",
  "Freelance",
  "Shopping",
  "Health",
  "Entertainment",
  "Other",
];

export const INCOME_CATEGORIES: ExpenseCategory[] = [
  "Salary",
  "Freelance",
  "Other",
];

export const EXPENSE_ONLY_CATEGORIES: ExpenseCategory[] = [
  "Food",
  "Transport",
  "Housing",
  "Utilities",
  "Shopping",
  "Health",
  "Entertainment",
  "Other",
];

export const EXPENSE_STORAGE_KEY = "calculiohub-expense-tracker-v1";

export function createTransactionId(): string {
  return `txn_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function todayISODate(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function loadExpenseTransactions(): ExpenseTransaction[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(EXPENSE_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (row): row is ExpenseTransaction =>
          !!row &&
          typeof row === "object" &&
          typeof (row as ExpenseTransaction).id === "string" &&
          typeof (row as ExpenseTransaction).title === "string" &&
          typeof (row as ExpenseTransaction).amount === "number" &&
          ((row as ExpenseTransaction).type === "income" ||
            (row as ExpenseTransaction).type === "expense") &&
          typeof (row as ExpenseTransaction).category === "string" &&
          typeof (row as ExpenseTransaction).date === "string"
      )
      .map((row) => ({
        ...row,
        amount: Math.abs(row.amount),
        createdAt: row.createdAt || row.date,
      }));
  } catch {
    return [];
  }
}

export function saveExpenseTransactions(rows: ExpenseTransaction[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(EXPENSE_STORAGE_KEY, JSON.stringify(rows));
  } catch {
    // Ignore quota / privacy-mode write failures.
  }
}

export function summarizeExpenses(rows: ExpenseTransaction[]) {
  let income = 0;
  let expenses = 0;
  for (const row of rows) {
    if (row.type === "income") income += row.amount;
    else expenses += row.amount;
  }
  return {
    income,
    expenses,
    balance: income - expenses,
  };
}

export function formatMoney(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(n);
}
