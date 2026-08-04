import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_ENABLED = true;

function getSignInUrl(req: NextRequest) {
  const url = new URL('/auth/signin', req.url);
  url.searchParams.set('callbackUrl', req.url);
  return url;
}

const protectedRoutes = [
  '/journal',
  '/prayers',
  '/quiet-time',
  '/community',
  '/settings',
  '/streak',
  '/ai',
  '/downloads',
  '/admin',
];

const adminRoutes = ['/admin'];

export async function middleware(req: NextRequest) {
  if (!AUTH_ENABLED) {
    return NextResponse.next();
  }

  const { pathname } = req.nextUrl;
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

  if (!isProtected) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.redirect(getSignInUrl(req));
  }

  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
  if (isAdminRoute && token.role !== 'ADMIN') {
    const dashboardUrl = new URL('/dashboard', req.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public|auth|manifest.json|icons|images).*)',
  ],
};