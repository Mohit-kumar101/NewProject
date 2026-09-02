import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/vaultline/session";
import { jsonError, jsonOk } from "@/lib/vaultline/api";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const existing = await prisma.savedCalculation.findFirst({
      where: { id, userId: user.id },
    });
    if (!existing) return jsonError("Not found", 404);
    await prisma.savedCalculation.delete({ where: { id } });
    return jsonOk({ ok: true });
  } catch {
    return jsonError("Unauthorized", 401);
  }
}
