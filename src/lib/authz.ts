import { User } from '@/generated/prisma';

// =====================================================
// UTILIDADES DE AUTORIZACIÓN PARA SISTEMA MULTI-TENANT
// =====================================================

/**
 * Verifica si un usuario puede acceder a un spa específico
 */
export function canAccessSpa(user: User, spaId: string): boolean {
  if (user.role === 'SUPER_ADMIN') return true;
  if (user.role === 'SPA_ADMIN' && user.spaId === spaId) return true;
  if (user.role === 'BRANCH_ADMIN' && user.spaId === spaId) return true;
  return false;
}

/**
 * Verifica si un usuario puede acceder a una sede específica
 */
export function canAccessBranch(user: User, branchId: string): boolean {
  if (user.role === 'SUPER_ADMIN') return true;
  if (user.role === 'SPA_ADMIN' && user.spaId) return true; // SPA_ADMIN puede acceder a todas las sedes de su spa
  if (user.role === 'BRANCH_ADMIN' && user.branchId === branchId) return true;
  return false;
}

/**
 * Verifica si un usuario puede gestionar un spa
 */
export function canManageSpa(user: User, spaId: string): boolean {
  if (user.role === 'SUPER_ADMIN') return true;
  if (user.role === 'SPA_ADMIN' && user.spaId === spaId) return true;
  return false;
}

/**
 * Verifica si un usuario puede gestionar una sede
 */
export function canManageBranch(user: User, branchId: string): boolean {
  if (user.role === 'SUPER_ADMIN') return true;
  if (user.role === 'SPA_ADMIN' && user.spaId) return true; // SPA_ADMIN puede gestionar todas las sedes de su spa
  if (user.role === 'BRANCH_ADMIN' && user.branchId === branchId) return true;
  return false;
}

/**
 * Verifica si un usuario puede gestionar citas
 */
export function canManageAppointments(
  user: User,
  spaId: string,
  branchId?: string
): boolean {
  if (user.role === 'SUPER_ADMIN') return true;
  if (user.role === 'SPA_ADMIN' && user.spaId === spaId) return true;
  if (
    user.role === 'BRANCH_ADMIN' &&
    user.spaId === spaId &&
    (!branchId || user.branchId === branchId)
  )
    return true;
  return false;
}

/**
 * Verifica si un usuario puede ver reportes
 */
export function canViewReports(
  user: User,
  spaId: string,
  branchId?: string
): boolean {
  if (user.role === 'SUPER_ADMIN') return true;
  if (user.role === 'SPA_ADMIN' && user.spaId === spaId) return true;
  if (
    user.role === 'BRANCH_ADMIN' &&
    user.spaId === spaId &&
    (!branchId || user.branchId === branchId)
  )
    return true;
  return false;
}

/**
 * Verifica si un usuario puede gestionar la configuración DIAN
 */
export function canManageDianSettings(user: User, spaId: string): boolean {
  if (user.role === 'SUPER_ADMIN') return true;
  if (user.role === 'SPA_ADMIN' && user.spaId === spaId) return true;
  return false;
}

/**
 * Verifica si un usuario puede gestionar usuarios
 */
export function canManageUsers(user: User, targetSpaId?: string): boolean {
  if (user.role === 'SUPER_ADMIN') return true;
  if (user.role === 'SPA_ADMIN' && (!targetSpaId || user.spaId === targetSpaId))
    return true;
  return false;
}

/**
 * Obtiene el spaId que un usuario puede acceder
 */
export function getUserSpaId(user: User): string | null {
  if (user.role === 'SUPER_ADMIN') return null; // SUPER_ADMIN puede acceder a todos los spas
  return user.spaId;
}

/**
 * Obtiene el branchId que un usuario puede acceder
 */
export function getUserBranchId(user: User): string | null {
  if (user.role === 'SUPER_ADMIN' || user.role === 'SPA_ADMIN') return null; // Pueden acceder a todas las sedes
  return user.branchId;
}

/**
 * Verifica si un usuario es super admin
 */
export function isSuperAdmin(user: User): boolean {
  return user.role === 'SUPER_ADMIN';
}

/**
 * Verifica si un usuario es spa admin
 */
export function isSpaAdmin(user: User): boolean {
  return user.role === 'SPA_ADMIN';
}

/**
 * Verifica si un usuario es branch admin
 */
export function isBranchAdmin(user: User): boolean {
  return user.role === 'BRANCH_ADMIN';
}

/**
 * Verifica si un usuario es manicurista
 */
export function isManicurist(user: User): boolean {
  return user.role === 'MANICURIST';
}

/**
 * Verifica si un usuario es cliente
 */
export function isClient(user: User): boolean {
  return user.role === 'CLIENT';
}

/**
 * Obtiene el nivel de acceso del usuario
 */
export function getUserAccessLevel(
  user: User
): 'system' | 'spa' | 'branch' | 'individual' {
  switch (user.role) {
    case 'SUPER_ADMIN':
      return 'system';
    case 'SPA_ADMIN':
      return 'spa';
    case 'BRANCH_ADMIN':
      return 'branch';
    case 'MANICURIST':
    case 'CLIENT':
      return 'individual';
    default:
      return 'individual';
  }
}

/**
 * Verifica si un usuario puede acceder a una funcionalidad específica
 */
export function canAccessFeature(
  user: User,
  feature: string,
  spaId?: string,
  branchId?: string
): boolean {
  switch (feature) {
    case 'spa-management':
      return canManageSpa(user, spaId || '');
    case 'branch-management':
      return canManageBranch(user, branchId || '');
    case 'appointment-management':
      return canManageAppointments(user, spaId || '', branchId);
    case 'reports':
      return canViewReports(user, spaId || '', branchId);
    case 'dian-settings':
      return canManageDianSettings(user, spaId || '');
    case 'user-management':
      return canManageUsers(user, spaId);
    default:
      return false;
  }
}
