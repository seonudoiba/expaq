import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/register') ||
    request.nextUrl.pathname.startsWith('/forgot-password');

  // Authentication check
  if (!token && !isAuthPage) {
    // Store intended URL to redirect back after login
    const url = new URL('/login', request.url);
    url.searchParams.set('redirectTo', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Authorization for admin pages is handled by the RequireAdmin component
  // This middleware just ensures the user is authenticated

  // Prevent authenticated users from accessing login pages
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/activities/:path*',
    '/profile/:path*',
    '/admin/:path*',
    '/login',
    '/register',
    '/forgot-password',
  ],
};