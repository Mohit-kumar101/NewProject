import { destroySession } from "@/lib/vaultline/session";
import { jsonOk } from "@/lib/vaultline/api";

export async function POST() {
  await destroySession();
  return jsonOk({ ok: true });
}
