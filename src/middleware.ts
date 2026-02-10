import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Redirect /admin to /admin/dashboard (skip login completely)
  if (request.nextUrl.pathname === '/admin') {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  // Allow all admin routes without authentication
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};