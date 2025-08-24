import { auth } from '@/../../auth';
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
