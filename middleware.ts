import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get('auth');
  const { pathname } = request.nextUrl;

  // Public routes (no auth required)
  const publicPaths = ['/login'];
  
  // Protected routes (require auth)
  const protectedPaths = [
    '/dashboard',
    '/conversations',
    '/memory',
    '/analytics',
    '/knowledge',
    '/team',
    '/settings'
  ];

  // Check if the current path is protected
  const isProtectedPath = protectedPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  );

  // Check if the current path is public
  const isPublicPath = publicPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  );

  // Redirect to login if accessing protected route without auth
  if (isProtectedPath && !authCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect to dashboard if accessing public routes while authenticated
  if (isPublicPath && authCookie) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect root to login if not authenticated, dashboard if authenticated
  if (pathname === '/') {
    return NextResponse.redirect(new URL(authCookie ? '/dashboard' : '/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next|_static|_vercel|[\\w-]+\\.\\w+).*)',
  ],
};