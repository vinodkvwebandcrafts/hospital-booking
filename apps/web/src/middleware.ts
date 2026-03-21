import { NextRequest, NextResponse } from 'next/server';

const AUTH_TOKEN_KEY = 'hospital_booking_token';

const protectedPaths = ['/dashboard', '/doctors', '/book', '/appointments', '/medical-records', '/profile'];
const authPaths = ['/login', '/register', '/forgot-password'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_TOKEN_KEY)?.value;

  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));
  const isAuthPage = authPaths.some((path) => pathname.startsWith(path));

  if (isProtected && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/doctors/:path*',
    '/book/:path*',
    '/appointments/:path*',
    '/medical-records/:path*',
    '/profile/:path*',
    '/login',
    '/register',
    '/forgot-password',
  ],
};
