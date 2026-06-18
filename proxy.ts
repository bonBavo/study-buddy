import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback_secret'
);

export async function proxy(request: NextRequest) {
  const session = request.cookies.get('session')?.value;

  const { pathname } = request.nextUrl;

  // Protected routes
  const protectedRoutes = ['/dashboard', '/subjects', '/data-entry', '/predictions', '/recommendations', '/admin'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      await jwtVerify(session, JWT_SECRET);
      return NextResponse.next();
    } catch (error) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Auth routes (redirect to dashboard if already logged in)
  const authRoutes = ['/login', '/register'];
  const isAuthRoute = authRoutes.includes(pathname);

  if (isAuthRoute && session) {
    try {
      await jwtVerify(session, JWT_SECRET);
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } catch (error) {
      // Invalid session, allow access to login/register
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/subjects/:path*',
    '/data-entry/:path*',
    '/predictions/:path*',
    '/recommendations/:path*',
    '/admin/:path*',
    '/login',
    '/register',
  ],
};