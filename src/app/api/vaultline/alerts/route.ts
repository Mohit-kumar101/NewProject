import { prisma } from "@/lib/prisma";
import { jsonError, jsonOk, handleRouteError } from "@/lib/vaultline/api";
import { requireUser } from "@/lib/vaultline/session";

export async function GET() {
  try {
    const user = await requireUser();
    const alerts = await prisma.alert.findMany({
      where: { userId: user.id, status: { not: "dismissed" } },
      orderBy: { dueAt: "asc" },
      take: 50,
    });
    return jsonOk({ alerts });
  } catch (e) {
    return handleRouteError(e, "alerts list");
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await requireUser();
    const body = await request.json();
    const alertId = String(body.alertId ?? "");
    const action = String(body.action ?? "");

    if (!alertId) return jsonError("alertId required.");

    const alert = await prisma.alert.findFirst({
      where: { id: alertId, userId: user.id },
    });
    if (!alert) return jsonError("Alert not found.", 404);

    if (action === "dismiss") {
      const updated = await prisma.alert.update({
        where: { id: alertId },
        data: { status: "dismissed", dismissedAt: new Date() },
      });
      return jsonOk({ alert: updated });
    }

    return jsonError("Unknown action.");
  } catch (e) {
    return handleRouteError(e, "alerts patch");
  }
}
