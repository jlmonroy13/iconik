import { auth } from './auth';
import { NextResponse } from 'next/server';
import { PUBLIC_ROUTES } from './src/lib/constants/routes';

export default auth(req => {
  const { pathname } = req.nextUrl;

  // Always allow these public routes
  if (pathname === PUBLIC_ROUTES.HOME || pathname === PUBLIC_ROUTES.LOGIN) {
    return NextResponse.next();
  }
  // For all other routes, allow access
  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
