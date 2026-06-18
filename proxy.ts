import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback_secret"
);

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log(`[PROXY] Request: ${pathname}`);
  const session = request.cookies.get("session")?.value;

  // Public API routes
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Protected routes
  const protectedPaths = ["/dashboard", "/subjects", "/data-entry", "/predictions", "/recommendations", "/api/performance", "/api/predictions", "/api/recommendations", "/api/subjects"];
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (isProtected) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      await jwtVerify(session, JWT_SECRET);
      console.log(`[PROXY] Authorized: ${pathname}`);
      return NextResponse.next();
    } catch (error) {
      console.log(`[PROXY] Unauthorized, redirecting: ${pathname}`);
      if (pathname.startsWith("/api")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Auth routes (redirect to dashboard if already logged in)
  const authPaths = ["/login", "/register"];
  if (authPaths.includes(pathname) && session) {
    try {
      await jwtVerify(session, JWT_SECRET);
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } catch (error) {
      // Invalid session, allow access to login/register
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/subjects/:path*",
    "/data-entry/:path*",
    "/predictions/:path*",
    "/recommendations/:path*",
    "/login",
    "/register",
    "/api/:path*",
  ],
};