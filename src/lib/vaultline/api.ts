import { NextResponse } from "next/server";
import { isUnauthorizedError } from "@/lib/vaultline/validation";

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

/** Map route handler errors to correct HTTP status codes. */
export function handleRouteError(e: unknown, logLabel: string) {
  if (isUnauthorizedError(e)) {
    return jsonError("Unauthorized", 401);
  }
  console.error(logLabel, e);
  return jsonError("Internal server error.", 500);
}
