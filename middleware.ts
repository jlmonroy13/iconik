import { auth } from './auth';
import { NextResponse } from 'next/server';
import { PUBLIC_ROUTES, PROTECTED_ROUTES } from './src/lib/constants/routes';

export default auth(req => {
  const { pathname } = req.nextUrl;
  const { auth: session } = req;

  // Always allow public routes
  if (pathname === PUBLIC_ROUTES.HOME || pathname === PUBLIC_ROUTES.LOGIN) {
    return NextResponse.next();
  }

  // Check if user is authenticated
  if (!session?.user) {
    return NextResponse.redirect(new URL(PUBLIC_ROUTES.LOGIN, req.url));
  }

  // Check if user is active
  if (!session.user.isActive) {
    return NextResponse.redirect(new URL(PUBLIC_ROUTES.LOGIN, req.url));
  }

  // Extract spaId and branchId from URL for multi-tenant access
  const pathSegments = pathname.split('/').filter(Boolean);
  const urlSpaId =
    pathSegments[1] === 'dashboard' && pathSegments[2] ? pathSegments[2] : null;
  const urlBranchId = pathSegments[3] ? pathSegments[3] : null;

  // Super Admin can access everything
  if (session.user.isSuperAdmin) {
    return NextResponse.next();
  }

  // Check spa access for non-super admins
  if (urlSpaId && session.user.spaId !== urlSpaId) {
    return NextResponse.redirect(new URL(PROTECTED_ROUTES.DASHBOARD, req.url));
  }

  // Check branch access for branch-specific routes
  if (urlBranchId && session.user.branchId !== urlBranchId) {
    // SPA_ADMIN can access all branches of their spa
    if (session.user.role === 'SPA_ADMIN') {
      return NextResponse.next();
    }
    // BRANCH_ADMIN and MANICURIST can only access their specific branch
    if (session.user.branchId !== urlBranchId) {
      return NextResponse.redirect(
        new URL(PROTECTED_ROUTES.DASHBOARD, req.url)
      );
    }
  }

  // Role-based route access
  const userRole = session.user.role;

  // Super Admin routes
  if (
    pathname.startsWith('/dashboard/super-admin') &&
    userRole !== 'SUPER_ADMIN'
  ) {
    return NextResponse.redirect(new URL(PROTECTED_ROUTES.DASHBOARD, req.url));
  }

  // SPA Admin routes
  if (pathname.startsWith('/dashboard/spa-admin') && userRole !== 'SPA_ADMIN') {
    return NextResponse.redirect(new URL(PROTECTED_ROUTES.DASHBOARD, req.url));
  }

  // Branch Admin routes
  if (
    pathname.startsWith('/dashboard/branch-admin') &&
    userRole !== 'BRANCH_ADMIN'
  ) {
    return NextResponse.redirect(new URL(PROTECTED_ROUTES.DASHBOARD, req.url));
  }

  // Manicurist routes
  if (
    pathname.startsWith('/dashboard/manicurist') &&
    userRole !== 'MANICURIST'
  ) {
    return NextResponse.redirect(new URL(PROTECTED_ROUTES.DASHBOARD, req.url));
  }

  // Allow access to all other routes
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
