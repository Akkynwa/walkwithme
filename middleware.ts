import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 1. Set this to 'true' to enable authentication checks
const AUTH_ENABLED = false; 

const protectedRoutes = [
  '/journal',
  '/prayers',
  '/quiet-time',
  '/community',
  '/settings',
  '/streak',
  '/ai',
  '/downloads',
];

export default withAuth(
  function middleware(_req: NextRequest) {
    // If auth is disabled, let everything through
    if (!AUTH_ENABLED) {
      return NextResponse.next();
    }

    // Use protectedRoutes to determine if this path requires auth
    const { pathname } = _req.nextUrl;
    const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

    // If the route is not protected, allow through without further checks
    if (!isProtected) {
      return NextResponse.next();
    }

    // For protected routes, allow withAuth's authorized callback to handle access
    return NextResponse.next();
  },
  {
    callbacks: {
      // If AUTH_ENABLED is false, always return true to allow access
      // If true, it checks if a token exists in the request
      authorized: ({ token }) => !AUTH_ENABLED || !!token,
    },
    pages: {
      signIn: '/auth/signin',
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for specific exclusions
     * Added 'public' and 'images' explicitly for clarity
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public|auth|manifest.json|icons|images).*)',
  ],
};