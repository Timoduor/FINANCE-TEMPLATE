import { NextResponse } from 'next/server';

export function middleware(req) {
  const url = req.nextUrl.clone();

  // Get the session token from cookies
  const token = req.cookies.get('next-auth.session-token');

  console.log('Middleware triggered for:', req.nextUrl.pathname);

  // Allow public routes to bypass the middleware
  if (['/login', '/register', '/public'].includes(url.pathname)) {
    return NextResponse.next();
  }

  // Allow API routes and static assets to bypass the middleware
  if (
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/_next/static') ||
    url.pathname.startsWith('/_next/image') ||
    /\.(png|jpg|jpeg|svg|ico|json)$/.test(url.pathname)
  ) {
    return NextResponse.next();
  }

  // Redirect to login if accessing protected routes without a valid session token
  if (url.pathname.startsWith('/dashboard') && !token) {
    console.log('Unauthorized access to dashboard. Redirecting to login.');
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Allow the request to proceed for other routes
  return NextResponse.next();
}

// Export matcher for middleware configuration
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|.*\\.(png|jpg|jpeg|svg|ico|json)$).*)', // Exclude static assets and API routes
  ],
};
