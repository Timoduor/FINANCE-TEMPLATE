import { NextResponse } from 'next/server';

export function middleware(req) {
 const url = req.nextUrl.clone(); // Clone the URL for modifications
 const token = req.cookies.get('next-auth.session-token'); // Check the session token

 // Log the incoming request for debugging
 console.log('Middleware triggered for:', req.nextUrl.pathname);

 // Allow public routes without processing
 if (['/login', '/register', '/public'].includes(url.pathname)) {
  console.log('Public route, skipping middleware.');
  return NextResponse.next();
 }

 // Allow API routes and static assets
 if (url.pathname.startsWith('/api') || url.pathname.startsWith('/_next/static') || url.pathname.startsWith('/_next/image')) {
  return NextResponse.next();
 }

 // Protect private routes (example: `/dashboard`)
 if (url.pathname.startsWith('/dashboard')) {
  if (!token) {
   console.log('Unauthorized access to dashboard. Redirecting to login.');
   url.pathname = '/login'; // Redirect unauthorized users to login
   return NextResponse.redirect(url);
  }
  console.log('Authorized access to dashboard.');
 }

 // Default behavior: proceed as normal
 return NextResponse.next();
}

// Middleware configuration
export const config = {
 matcher: [
  '/((?!api|auth|_next/static|_next/image|favicon.ico|.*\\.png$).*)', // Exclude API, static files, images, etc.
 ],
};
