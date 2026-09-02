import { getCurrentUser } from "@/lib/vaultline/session";
import { jsonError, jsonOk } from "@/lib/vaultline/api";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);
  return jsonOk({ user });
}
