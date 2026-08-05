import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE, ROLE_COOKIE, ROLE_HOME, ROLE_ROUTES } from "@/lib/constants";
import type { Role } from "@/types/auth";

/**
 * Edge middleware — coarse-grained route guards.
 *
 * The Laravel API remains the authority for authorization; this layer only
 * prevents unauthenticated/role-mismatched users from rendering protected
 * shells and bounces authenticated users away from auth pages.
 */

const PUBLIC_PATHS = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthed = request.cookies.get(AUTH_COOKIE)?.value === "1";
  const role = request.cookies.get(ROLE_COOKIE)?.value;

  const isPublicPath = PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  // Authenticated user on an auth page → their role home.
  if (isAuthed && isPublicPath && role && role in ROLE_HOME) {
    return NextResponse.redirect(new URL(ROLE_HOME[role as Role], request.url));
  }

  // Settings — any authenticated role.
  if (pathname === "/settings" || pathname.startsWith("/settings/")) {
    if (!isAuthed || !role) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Protected role areas → must be signed in with the matching role.
  for (const [requiredRole, prefixes] of Object.entries(ROLE_ROUTES)) {
    const isProtected = prefixes.some(
      (p) => pathname === p || pathname.startsWith(`${p}/`)
    );
    if (!isProtected) continue;

    if (!isAuthed || role !== requiredRole) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/instructor/:path*",
    "/learner/:path*",
    "/settings/:path*",
    "/logout",
    "/login/:path*",
    "/register/:path*",
    "/forgot-password/:path*",
    "/reset-password/:path*",
    "/verify-email/:path*",
  ],
};
