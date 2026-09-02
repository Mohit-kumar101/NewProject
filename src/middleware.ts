import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/vaultline/session";

const AUTH_PATHS = ["/vaultline/login", "/vaultline/signup"];
const PUBLIC_API_PATHS = ["/api/vaultline/login", "/api/vaultline/signup"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/savewise") || pathname.startsWith("/api/savewise")) {
    const redirect = new URL(
      pathname.replace(/^\/savewise/, "/vaultline").replace(/^\/api\/savewise/, "/api/vaultline"),
      request.url
    );
    redirect.search = request.nextUrl.search;
    return NextResponse.redirect(redirect, 308);
  }

  const isVaultlinePage = pathname.startsWith("/vaultline");
  const isVaultlineApi = pathname.startsWith("/api/vaultline");

  if (!isVaultlinePage && !isVaultlineApi) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const userId = await verifySessionToken(token);
  const isAuthPage = AUTH_PATHS.some((p) => pathname === p);
  const isPublicApi = PUBLIC_API_PATHS.some((p) => pathname === p);

  if (isVaultlineApi && !isPublicApi && !userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (isVaultlinePage) {
    if (!userId && !isAuthPage) {
      const login = new URL("/vaultline/login", request.url);
      login.searchParams.set("next", pathname);
      return NextResponse.redirect(login);
    }

    if (userId && isAuthPage) {
      return NextResponse.redirect(new URL("/vaultline", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/vaultline/:path*",
    "/api/vaultline/:path*",
    "/savewise/:path*",
    "/api/savewise/:path*",
  ],
};
