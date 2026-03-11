import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, decodeSession } from "@/lib/session";

const PUBLIC_PATHS = ["/login"];
const AUTH_API_PREFIX = "/api/auth";

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/")))
    return true;
  if (pathname.startsWith(AUTH_API_PREFIX)) return true;
  if (pathname.startsWith("/_next")) return true;
  if (pathname.includes(".")) return true; // static assets
  return false;
}

export async function middleware(request: NextRequest) {
  if (isPublicPath(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const cookieValue = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!cookieValue) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const session = await decodeSession(cookieValue);
  if (!session?.isLoggedIn) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
