import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

/**
 * Middleware to protect admin routes
 * Checks if user is authenticated and has admin role
 */
export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes
  if (pathname.startsWith('/admin')) {
    try {
      // Get the session token
      const token = await getToken({ 
        req: request,
        secret: process.env.NEXTAUTH_SECRET 
      });

      // If no token, redirect to auth page
      if (!token) {
        const url = new URL('/auth', request.url);
        url.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(url);
      }

      // Check if user has admin role
      if (token.role !== 'admin') {
        // User is authenticated but not admin, redirect to home
        return NextResponse.redirect(new URL('/', request.url));
      }

      // User is admin, allow access
      return NextResponse.next();
    } catch (error) {
      console.error('Middleware error:', error);
      // On error, redirect to auth page
      const url = new URL('/auth', request.url);
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }
  }

  // Allow all other routes
  return NextResponse.next();
}

// Configure which routes this middleware runs on
export const config = {
  matcher: [
    '/admin/:path*',
  ],
};

