import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/vaultline/session";
import { jsonError, jsonOk } from "@/lib/vaultline/api";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email ?? "")
      .trim()
      .toLowerCase();
    const password = String(body.password ?? "");
    const name = String(body.name ?? "").trim() || null;

    if (!email || !email.includes("@")) {
      return jsonError("Valid email is required.");
    }
    if (password.length < 8) {
      return jsonError("Password must be at least 8 characters.");
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return jsonError("An account with this email already exists.", 409);
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email, name, passwordHash },
      select: { id: true, email: true, name: true, tier: true },
    });

    await createSession(user.id);
    return jsonOk({ user }, 201);
  } catch (e) {
    console.error("signup", e);
    return jsonError("Could not create account. Check server configuration.", 500);
  }
}
