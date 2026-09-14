// Next.js 16 renamed "Middleware" to "Proxy" (same mechanism, new name/file).
// This runs on every request before rendering. It only does the cheap,
// optimistic check (is there a validly-signed session cookie?) -- the real
// authorization check against the database happens in the Data Access Layer
// (src/lib/auth/dal.ts) for any page or action that touches real data.
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decryptSession, SESSION_COOKIE_NAME } from "@/lib/auth/session";

const PUBLIC_ADMIN_PATHS = ["/login"];

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin") && !PUBLIC_ADMIN_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await decryptSession(token);

  if (pathname.startsWith("/admin") && !session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === "/login" && session) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
