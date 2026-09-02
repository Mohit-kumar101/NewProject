import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/vaultline/session";
import { jsonError, jsonOk, handleRouteError } from "@/lib/vaultline/api";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const existing = await prisma.purchase.findFirst({
      where: { id, userId: user.id },
    });
    if (!existing) return jsonError("Not found", 404);
    await prisma.purchase.delete({ where: { id } });
    return jsonOk({ ok: true });
  } catch (e) {
    return handleRouteError(e, "purchase delete");
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const existing = await prisma.purchase.findFirst({
      where: { id, userId: user.id },
    });
    if (!existing) return jsonError("Not found", 404);

    const body = await request.json();
    const purchase = await prisma.purchase.update({
      where: { id },
      data: {
        status: body.status ? String(body.status) : undefined,
        itemName: body.itemName ? String(body.itemName).trim() : undefined,
      },
    });
    return jsonOk({ purchase });
  } catch (e) {
    return handleRouteError(e, "purchase update");
  }
}
