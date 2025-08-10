import { prisma } from '@/lib/prisma'
import { auth } from '@/../../auth'
import type { Session } from 'next-auth'

/**
 * Gets the appropriate spaId for the current user
 * If user is super admin (no spaId associated), returns the first available spaId
 * If user has a spaId, returns that spaId
 * @returns Promise<string> - The spaId to use
 */
export async function getCurrentSpaId(): Promise<string> {
  const session = await auth()

  if (!session?.user) {
    throw new Error('No authenticated user found')
  }

  // Type assertion to ensure we have the extended user type
  const user = session.user as Session['user'] & { isSuperAdmin?: boolean; spaId?: string | null }

  // If user has a spaId, use it
  if (user.spaId) {
    return user.spaId
  }

  // If user is super admin and has no spaId, get the first available spa
  if (user.isSuperAdmin) {
    const firstSpa = await prisma.spa.findFirst({
      where: { isActive: true },
      select: { id: true }
    })

    if (!firstSpa) {
      throw new Error('No active spas found in the system')
    }

    return firstSpa.id
  }

  // If user is not super admin and has no spaId, redirect to onboarding
  throw new Error('User has no spaId and is not super admin')
}

/**
 * Gets the spaId with fallback for super admin users
 * Similar to getCurrentSpaId but returns null instead of throwing error for onboarding
 * @returns Promise<string | null> - The spaId to use or null if should redirect to onboarding
 */
export async function getSpaIdWithFallback(): Promise<string | null> {
  const session = await auth()

  if (!session?.user) {
    return null
  }

  // Type assertion to ensure we have the extended user type
  const user = session.user as Session['user'] & { isSuperAdmin?: boolean; spaId?: string | null }

  // If user has a spaId, use it
  if (user.spaId) {
    return user.spaId
  }

  // If user is super admin and has no spaId, get the first available spa
  if (user.isSuperAdmin) {
    const firstSpa = await prisma.spa.findFirst({
      where: { isActive: true },
      select: { id: true }
    })

    return firstSpa?.id || null
  }

  // If user is not super admin and has no spaId, return null for onboarding redirect
  return null
}
