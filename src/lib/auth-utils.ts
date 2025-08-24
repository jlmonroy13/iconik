import { auth } from '@/../../auth';
import { redirect } from 'next/navigation';
import {
  AuthenticatedUser,
  isSuperAdmin,
  isSpaAdmin,
  isBranchAdmin,
  isManicurist,
} from '@/types/auth';

/**
 * Get the current authenticated user from the session
 */
export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    role: session.user.role,
    spaId: session.user.spaId,
    branchId: session.user.branchId,
    isSuperAdmin: session.user.isSuperAdmin,
  };
}

/**
 * Check if the current user can access a specific spa
 */
export async function canAccessSpa(spaId: string): Promise<boolean> {
  const user = await getCurrentUser();

  if (!user) {
    return false;
  }

  if (isSuperAdmin(user)) {
    return true;
  }

  return user.spaId === spaId;
}

/**
 * Check if the current user can access a specific branch
 */
export async function canAccessBranch(
  spaId: string,
  branchId: string
): Promise<boolean> {
  const user = await getCurrentUser();

  if (!user) {
    return false;
  }

  if (isSuperAdmin(user)) {
    return true;
  }

  if (isSpaAdmin(user)) {
    return user.spaId === spaId;
  }

  return user.spaId === spaId && user.branchId === branchId;
}

/**
 * Check if the current user can manage users
 */
export async function canManageUsers(): Promise<boolean> {
  const user = await getCurrentUser();

  if (!user) {
    return false;
  }

  return isSuperAdmin(user) || isSpaAdmin(user);
}

/**
 * Check if the current user can manage branches
 */
export async function canManageBranches(): Promise<boolean> {
  const user = await getCurrentUser();

  if (!user) {
    return false;
  }

  return isSuperAdmin(user) || isSpaAdmin(user);
}

/**
 * Check if the current user can manage appointments
 */
export async function canManageAppointments(
  spaId: string,
  branchId?: string
): Promise<boolean> {
  const user = await getCurrentUser();

  if (!user) {
    return false;
  }

  if (isSuperAdmin(user)) {
    return true;
  }

  if (isSpaAdmin(user)) {
    return user.spaId === spaId;
  }

  if (isBranchAdmin(user) || isManicurist(user)) {
    return user.spaId === spaId && (!branchId || user.branchId === branchId);
  }

  return false;
}

/**
 * Get the current user's spa ID with fallback for super admin
 */
export async function getCurrentSpaId(): Promise<string | null> {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  if (isSuperAdmin(user)) {
    // For super admin, we'll need to get spaId from URL or context
    return null;
  }

  return user.spaId ?? null;
}

/**
 * Get the current user's branch ID
 */
export async function getCurrentBranchId(): Promise<string | null> {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  return user.branchId ?? null;
}

// ===== FUNCIONES PARA PÁGINAS PROTEGIDAS (con errores) =====

/**
 * Require authentication - throws error if user is not authenticated
 */
export async function requireAuth(): Promise<AuthenticatedUser> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('Authentication required');
  }

  return user;
}

/**
 * Require specific role - throws error if user doesn't have the role
 */
export async function requireRole(
  role: AuthenticatedUser['role']
): Promise<AuthenticatedUser> {
  const user = await requireAuth();

  if (user.role !== role) {
    throw new Error(`Role ${role} required`);
  }

  return user;
}

/**
 * Require spa access - throws error if user can't access the spa
 */
export async function requireSpaAccess(
  spaId: string
): Promise<AuthenticatedUser> {
  const user = await requireAuth();

  if (!canAccessSpa(spaId)) {
    throw new Error(`Access to spa ${spaId} denied`);
  }

  return user;
}

/**
 * Require branch access - throws error if user can't access the branch
 */
export async function requireBranchAccess(
  spaId: string,
  branchId: string
): Promise<AuthenticatedUser> {
  const user = await requireAuth();

  if (!canAccessBranch(spaId, branchId)) {
    throw new Error(`Access to branch ${branchId} denied`);
  }

  return user;
}

// ===== FUNCIONES PARA PÁGINAS (con redirecciones) =====

/**
 * Require authentication for pages - redirects to login if not authenticated
 */
export async function requireAuthForPage(): Promise<AuthenticatedUser> {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return user;
}

/**
 * Require specific role for pages - redirects to dashboard if wrong role
 */
export async function requireRoleForPage(
  role: AuthenticatedUser['role']
): Promise<AuthenticatedUser> {
  const user = await requireAuthForPage();

  if (user.role !== role) {
    redirect('/dashboard');
  }

  return user;
}

/**
 * Require spa access for pages - redirects to dashboard if no access
 */
export async function requireSpaAccessForPage(
  spaId: string
): Promise<AuthenticatedUser> {
  const user = await requireAuthForPage();

  if (!canAccessSpa(spaId)) {
    redirect('/dashboard');
  }

  return user;
}

/**
 * Require branch access for pages - redirects to dashboard if no access
 */
export async function requireBranchAccessForPage(
  spaId: string,
  branchId: string
): Promise<AuthenticatedUser> {
  const user = await requireAuthForPage();

  if (!canAccessBranch(spaId, branchId)) {
    redirect('/dashboard');
  }

  return user;
}

// ===== FUNCIONES PARA REDIRECCIÓN AUTOMÁTICA =====

/**
 * Get the appropriate dashboard URL for an authenticated user
 */
export function getDashboardUrl(user: AuthenticatedUser): string {
  if (isSuperAdmin(user)) {
    return '/dashboard/super-admin';
  }

  if (isSpaAdmin(user)) {
    return `/dashboard/spa-admin/${user.spaId}`;
  }

  if (isBranchAdmin(user)) {
    return `/dashboard/branch-admin/${user.spaId}/${user.branchId}`;
  }

  if (isManicurist(user)) {
    return `/dashboard/manicurist/${user.spaId}/${user.branchId}`;
  }

  // Fallback - should not reach here
  return '/dashboard';
}

/**
 * Redirect authenticated users to their appropriate dashboard
 */
export async function redirectIfAuthenticated(): Promise<void> {
  const user = await getCurrentUser();

  if (user) {
    const dashboardUrl = getDashboardUrl(user);
    redirect(dashboardUrl);
  }
}
