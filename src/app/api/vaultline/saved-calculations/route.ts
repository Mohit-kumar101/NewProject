import { prisma } from "@/lib/prisma";
import { getLimits } from "@/lib/vaultline/limits";
import { requireUser } from "@/lib/vaultline/session";
import { jsonError, jsonOk } from "@/lib/vaultline/api";

export async function GET() {
  try {
    const user = await requireUser();
    const saved = await prisma.savedCalculation.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
    return jsonOk({ saved });
  } catch {
    return jsonError("Unauthorized", 401);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const limits = getLimits(user.tier);
    const count = await prisma.savedCalculation.count({
      where: { userId: user.id },
    });
    if (count >= limits.savedCalculations) {
      return jsonError(
        `Free plan limit: ${limits.savedCalculations} saved calculations.`,
        403
      );
    }

    const body = await request.json();
    const toolSlug = String(body.toolSlug ?? "").trim();
    const toolTitle = String(body.toolTitle ?? "").trim();
    if (!toolSlug || !toolTitle) {
      return jsonError("Tool slug and title are required.");
    }

    const saved = await prisma.savedCalculation.create({
      data: {
        userId: user.id,
        toolSlug,
        toolTitle,
        inputsJson: JSON.stringify(body.inputs ?? {}),
        resultJson: JSON.stringify(body.result ?? {}),
        label: body.label ? String(body.label) : null,
      },
    });

    return jsonOk({ saved }, 201);
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return jsonError("Unauthorized", 401);
    }
    console.error("saved calc", e);
    return jsonError("Could not save calculation.", 500);
  }
}
