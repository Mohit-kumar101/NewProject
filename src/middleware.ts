import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Vaultline is paused — redirect all legacy Vaultline / SaveWise URLs home
 * so they leave the crawl surface. Re-enable the dashboard later by restoring
 * auth middleware and the /vaultline app routes.
 */
export function middleware(request: NextRequest) {
  const home = new URL("/", request.url);
  return NextResponse.redirect(home, 308);
}

export const config = {
  matcher: [
    "/vaultline",
    "/vaultline/:path*",
    "/api/vaultline/:path*",
    "/savewise",
    "/savewise/:path*",
    "/api/savewise/:path*",
  ],
};
