/** Safe internal redirect — blocks open redirects. */
export function safeRedirectPath(next: string | null | undefined): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/vaultline";
  }
  if (!next.startsWith("/vaultline")) {
    return "/vaultline";
  }
  return next;
}

export function parseFiniteNumber(
  value: unknown,
  field: string
): { ok: true; value: number } | { ok: false; error: string } {
  const n = Number(value);
  if (!Number.isFinite(n)) {
    return { ok: false, error: `Valid ${field} is required.` };
  }
  return { ok: true, value: n };
}

export function parsePositiveInt(
  value: unknown,
  field: string,
  max = 3650
): { ok: true; value: number } | { ok: false; error: string } {
  const parsed = parseFiniteNumber(value, field);
  if (!parsed.ok) return parsed;
  const n = Math.round(parsed.value);
  if (n < 0 || n > max) {
    return { ok: false, error: `${field} must be between 0 and ${max}.` };
  }
  return { ok: true, value: n };
}

export function parseDate(
  value: unknown,
  field: string
): { ok: true; value: Date } | { ok: false; error: string } {
  if (value === undefined || value === null || value === "") {
    return { ok: false, error: `${field} is required.` };
  }
  const d = new Date(String(value));
  if (Number.isNaN(d.getTime())) {
    return { ok: false, error: `Valid ${field} is required.` };
  }
  return { ok: true, value: d };
}

export function parseOptionalDate(
  value: unknown
): { ok: true; value: Date | null } | { ok: false; error: string } {
  if (value === undefined || value === null || value === "") {
    return { ok: true, value: null };
  }
  const d = new Date(String(value));
  if (Number.isNaN(d.getTime())) {
    return { ok: false, error: "Invalid date." };
  }
  return { ok: true, value: d };
}

export function isUnauthorizedError(e: unknown): boolean {
  return e instanceof Error && e.message === "UNAUTHORIZED";
}
