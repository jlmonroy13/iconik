import { useSession } from 'next-auth/react'
import {
  canAccessSpa,
  canAccessBranch,
  canManageSpa,
  canManageBranch,
  canManageAppointments,
  canViewReports,
  canManageDianSettings,
  canManageUsers,
  isSuperAdmin,
  isSpaAdmin,
  isBranchAdmin,
  isManicurist,
  isClient,
  getUserSpaId,
  getUserBranchId,
  getUserAccessLevel,
  canAccessFeature
} from '@/lib/authz'
import { User } from '@/generated/prisma'

// =====================================================
// HOOKS DE AUTORIZACIÓN PARA EL FRONTEND
// =====================================================

/**
 * Hook para obtener el usuario actual de la sesión
 */
export function useUser(): User | null {
  const { data: session } = useSession()
  return session?.user as User | null
}

/**
 * Hook para verificar si el usuario puede acceder a un spa
 */
export function useCanAccessSpa(spaId: string): boolean {
  const user = useUser()
  if (!user) return false
  return canAccessSpa(user, spaId)
}

/**
 * Hook para verificar si el usuario puede acceder a una sede
 */
export function useCanAccessBranch(branchId: string): boolean {
  const user = useUser()
  if (!user) return false
  return canAccessBranch(user, branchId)
}

/**
 * Hook para verificar si el usuario puede gestionar un spa
 */
export function useCanManageSpa(spaId: string): boolean {
  const user = useUser()
  if (!user) return false
  return canManageSpa(user, spaId)
}

/**
 * Hook para verificar si el usuario puede gestionar una sede
 */
export function useCanManageBranch(branchId: string): boolean {
  const user = useUser()
  if (!user) return false
  return canManageBranch(user, branchId)
}

/**
 * Hook para verificar si el usuario puede gestionar citas
 */
export function useCanManageAppointments(spaId: string, branchId?: string): boolean {
  const user = useUser()
  if (!user) return false
  return canManageAppointments(user, spaId, branchId)
}

/**
 * Hook para verificar si el usuario puede ver reportes
 */
export function useCanViewReports(spaId: string, branchId?: string): boolean {
  const user = useUser()
  if (!user) return false
  return canViewReports(user, spaId, branchId)
}

/**
 * Hook para verificar si el usuario puede gestionar configuración DIAN
 */
export function useCanManageDianSettings(spaId: string): boolean {
  const user = useUser()
  if (!user) return false
  return canManageDianSettings(user, spaId)
}

/**
 * Hook para verificar si el usuario puede gestionar usuarios
 */
export function useCanManageUsers(targetSpaId?: string): boolean {
  const user = useUser()
  if (!user) return false
  return canManageUsers(user, targetSpaId)
}

/**
 * Hook para verificar si el usuario es super admin
 */
export function useIsSuperAdmin(): boolean {
  const user = useUser()
  if (!user) return false
  return isSuperAdmin(user)
}

/**
 * Hook para verificar si el usuario es spa admin
 */
export function useIsSpaAdmin(): boolean {
  const user = useUser()
  if (!user) return false
  return isSpaAdmin(user)
}

/**
 * Hook para verificar si el usuario es branch admin
 */
export function useIsBranchAdmin(): boolean {
  const user = useUser()
  if (!user) return false
  return isBranchAdmin(user)
}

/**
 * Hook para verificar si el usuario es manicurista
 */
export function useIsManicurist(): boolean {
  const user = useUser()
  if (!user) return false
  return isManicurist(user)
}

/**
 * Hook para verificar si el usuario es cliente
 */
export function useIsClient(): boolean {
  const user = useUser()
  if (!user) return false
  return isClient(user)
}

/**
 * Hook para obtener el spaId del usuario
 */
export function useUserSpaId(): string | null {
  const user = useUser()
  if (!user) return null
  return getUserSpaId(user)
}

/**
 * Hook para obtener el branchId del usuario
 */
export function useUserBranchId(): string | null {
  const user = useUser()
  if (!user) return null
  return getUserBranchId(user)
}

/**
 * Hook para obtener el nivel de acceso del usuario
 */
export function useUserAccessLevel(): 'system' | 'spa' | 'branch' | 'individual' | null {
  const user = useUser()
  if (!user) return null
  return getUserAccessLevel(user)
}

/**
 * Hook para verificar si el usuario puede acceder a una funcionalidad específica
 */
export function useCanAccessFeature(feature: string, spaId?: string, branchId?: string): boolean {
  const user = useUser()
  if (!user) return false
  return canAccessFeature(user, feature, spaId, branchId)
}

/**
 * Hook para obtener información completa de autorización del usuario
 */
export function useAuthorization() {
  const user = useUser()

  if (!user) {
    return {
      user: null,
      isAuthenticated: false,
      isSuperAdmin: false,
      isSpaAdmin: false,
      isBranchAdmin: false,
      isManicurist: false,
      isClient: false,
      spaId: null,
      branchId: null,
      accessLevel: null,
      canAccessSpa: () => false,
      canAccessBranch: () => false,
      canManageSpa: () => false,
      canManageBranch: () => false,
      canManageAppointments: () => false,
      canViewReports: () => false,
      canManageDianSettings: () => false,
      canManageUsers: () => false,
      canAccessFeature: () => false,
    }
  }

  return {
    user,
    isAuthenticated: true,
    isSuperAdmin: isSuperAdmin(user),
    isSpaAdmin: isSpaAdmin(user),
    isBranchAdmin: isBranchAdmin(user),
    isManicurist: isManicurist(user),
    isClient: isClient(user),
    spaId: getUserSpaId(user),
    branchId: getUserBranchId(user),
    accessLevel: getUserAccessLevel(user),
    canAccessSpa: (spaId: string) => canAccessSpa(user, spaId),
    canAccessBranch: (branchId: string) => canAccessBranch(user, branchId),
    canManageSpa: (spaId: string) => canManageSpa(user, spaId),
    canManageBranch: (branchId: string) => canManageBranch(user, branchId),
    canManageAppointments: (spaId: string, branchId?: string) => canManageAppointments(user, spaId, branchId),
    canViewReports: (spaId: string, branchId?: string) => canViewReports(user, spaId, branchId),
    canManageDianSettings: (spaId: string) => canManageDianSettings(user, spaId),
    canManageUsers: (targetSpaId?: string) => canManageUsers(user, targetSpaId),
    canAccessFeature: (feature: string, spaId?: string, branchId?: string) => canAccessFeature(user, feature, spaId, branchId),
  }
}
