import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // If already logged in, redirect away from /admin/login to /admin
    if (req.nextUrl.pathname === '/admin/login') {
      if (req.nextauth?.token) {
        return NextResponse.redirect(new URL('/admin', req.url));
      }
      return NextResponse.next();
    }
    return NextResponse.next();
  },
  {
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
      signIn: '/admin/login',
    },
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow /admin/login without authentication
        if (req.nextUrl.pathname === '/admin/login') {
          return true;
        }
        return !!token;
      },
    },
  }
);

// Protect all /admin/* routes
export const config = {
  matcher: ['/admin/:path*'],
};
