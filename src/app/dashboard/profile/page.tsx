import { prisma } from '@/lib/prisma'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'

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
      <Card>
        <CardHeader>
          <CardTitle>Editar Perfil</CardTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Actualiza tu nombre y correo electrónico.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" defaultValue={user.name ?? ''} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input id="email" type="email" defaultValue={user.email} disabled />
          </div>
        </CardContent>
        <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end">
            <Button>Guardar Cambios</Button>
        </div>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle>Cambiar Contraseña</CardTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Para tu seguridad, te recomendamos usar una contraseña segura.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Contraseña Actual</Label>
            <Input id="current-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">Nueva Contraseña</Label>
            <Input id="new-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirmar Nueva Contraseña</Label>
            <Input id="confirm-password" type="password" />
          </div>
        </CardContent>
        <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end">
            <Button>Actualizar Contraseña</Button>
        </div>
      </Card>
    </div>
  )
}
