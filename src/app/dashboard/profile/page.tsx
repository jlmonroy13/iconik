import { prisma } from '@/lib/prisma'
import { Avatar } from '@/components/ui/Avatar'
import { EditProfileForm } from './components/EditProfileForm'
import { ChangePasswordForm } from './components/ChangePasswordForm'
import { PageTransition, FadeIn, EmptyState } from '@/components/ui'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Perfil - Iconik',
  description: 'Gestiona tu información personal y configuración de cuenta en Iconik.',
}

async function getUserData() {
  // TEMP: Get the first user for now.
  // Later, this will come from the user's session.
  const user = await prisma.user.findFirst({
    // You might want to select a specific user, e.g., an admin
    where: { role: 'ADMIN' },
  })
  return user
}

export default async function ProfilePage() {
  const user = await getUserData()

  if (!user) {
    return (
      <PageTransition>
        <div className="space-y-6">
          <FadeIn>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Perfil</h1>
          </FadeIn>
          <FadeIn delay={200}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <EmptyState
                title="Error al cargar el perfil"
                description="No se pudo cargar la información del usuario. Por favor, inténtalo de nuevo más tarde."
                icon={
                  <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                }
              />
            </div>
          </FadeIn>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="space-y-8">
        {/* Profile Header */}
        <FadeIn>
          <div className="flex items-center space-x-4">
            <Avatar fallback={user.name?.[0] ?? 'U'} size="lg" />
            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
            </div>
          </div>
        </FadeIn>

        {/* Edit Profile Form */}
        <FadeIn delay={200}>
          <EditProfileForm user={user} />
        </FadeIn>

        {/* Change Password */}
        <FadeIn delay={400}>
          <ChangePasswordForm user={user} />
        </FadeIn>
      </div>
    </PageTransition>
  )
}
