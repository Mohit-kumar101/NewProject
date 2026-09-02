import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/vaultline/session";
import { jsonError, jsonOk, handleRouteError } from "@/lib/vaultline/api";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const existing = await prisma.subscription.findFirst({
      where: { id, userId: user.id },
    });
    if (!existing) return jsonError("Not found", 404);
    await prisma.subscription.delete({ where: { id } });
    return jsonOk({ ok: true });
  } catch (e) {
    return handleRouteError(e, "subscription delete");
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const existing = await prisma.subscription.findFirst({
      where: { id, userId: user.id },
    });
    if (!existing) return jsonError("Not found", 404);

    const body = await request.json();
    const subscription = await prisma.subscription.update({
      where: { id },
      data: {
        status: body.status ? String(body.status) : undefined,
        name: body.name ? String(body.name).trim() : undefined,
      },
    });
    return jsonOk({ subscription });
  } catch (e) {
    return handleRouteError(e, "subscription update");
  }
}
