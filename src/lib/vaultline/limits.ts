/** All Vaultline features are free — no usage caps for now. */
export const VAULTLINE_LIMITS = {
  purchases: 999_999,
  subscriptions: 999_999,
  savedCalculations: 999_999,
} as const;

export function getLimits(_tier?: string) {
  return VAULTLINE_LIMITS;
}
