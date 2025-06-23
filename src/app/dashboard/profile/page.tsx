import { prisma } from '@/lib/prisma'
import { Avatar } from '@/components/ui/Avatar'
import { EditProfileForm } from './components/EditProfileForm'
import { ChangePasswordForm } from './components/ChangePasswordForm'

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
      <div className="space-y-6">
        <p>No se pudo cargar el perfil del usuario.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="flex items-center space-x-4">
        <Avatar fallback={user.name?.[0] ?? 'U'} size="lg" />
        <div>
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
        </div>
      </div>

      {/* Edit Profile Form */}
      <EditProfileForm user={user} />

      {/* Change Password */}
      <ChangePasswordForm user={user} />
    </div>
  )
}
