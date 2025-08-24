import { UserRole } from '../generated/prisma';

// Base user type from Prisma
export type User = {
  id: string;
  email: string;
  name?: string | null;
  role: UserRole;
  spaId?: string | null;
  branchId?: string | null;
  isSuperAdmin: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

// Authenticated user for client-side
export type AuthenticatedUser = Pick<
  User,
  'id' | 'email' | 'name' | 'role' | 'spaId' | 'branchId' | 'isSuperAdmin'
>;

// User roles for type safety
export type SuperAdminUser = AuthenticatedUser & { role: 'SUPER_ADMIN' };
export type SpaAdminUser = AuthenticatedUser & {
  role: 'SPA_ADMIN';
  spaId: string;
};
export type BranchAdminUser = AuthenticatedUser & {
  role: 'BRANCH_ADMIN';
  spaId: string;
  branchId: string;
};
export type ManicuristUser = AuthenticatedUser & {
  role: 'MANICURIST';
  spaId: string;
  branchId?: string;
};
export type ClientUser = AuthenticatedUser & { role: 'CLIENT'; spaId: string };

// Type guards for role checking
export const isSuperAdmin = (user: AuthenticatedUser): user is SuperAdminUser =>
  user.role === 'SUPER_ADMIN';

export const isSpaAdmin = (user: AuthenticatedUser): user is SpaAdminUser =>
  user.role === 'SPA_ADMIN';

export const isBranchAdmin = (
  user: AuthenticatedUser
): user is BranchAdminUser => user.role === 'BRANCH_ADMIN';

export const isManicurist = (user: AuthenticatedUser): user is ManicuristUser =>
  user.role === 'MANICURIST';

export const isClient = (user: AuthenticatedUser): user is ClientUser =>
  user.role === 'CLIENT';

// Permission checking helpers
export const canAccessSpa = (
  user: AuthenticatedUser,
  spaId: string
): boolean => {
  if (isSuperAdmin(user)) return true;
  return user.spaId === spaId;
};

export const canAccessBranch = (
  user: AuthenticatedUser,
  spaId: string,
  branchId: string
): boolean => {
  if (isSuperAdmin(user)) return true;
  if (isSpaAdmin(user)) return user.spaId === spaId;
  return user.spaId === spaId && user.branchId === branchId;
};

export const canManageUsers = (user: AuthenticatedUser): boolean => {
  return isSuperAdmin(user) || isSpaAdmin(user);
};

export const canManageBranches = (user: AuthenticatedUser): boolean => {
  return isSuperAdmin(user) || isSpaAdmin(user);
};
