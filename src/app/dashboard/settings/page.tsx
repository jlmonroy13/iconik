import { SpaSettingsForm } from './components/SpaSettingsForm'
import { prisma } from '@/lib/prisma'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'

async function getSpaData() {
  // Get the first spa for now (later we'll get from session)
  const spa = await prisma.spa.findFirst()
  return spa
}

export default async function SettingsPage() {
  const spaData = await getSpaData()

  if (!spaData) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Configuración</h1>
        <p className="text-gray-500 dark:text-gray-400">
            No se pudo cargar la información del spa. Por favor, inténtalo de nuevo más tarde.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Perfil del Spa</CardTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Actualiza el nombre, la dirección y la información de contacto de tu spa.
          </p>
        </CardHeader>
        <CardContent>
          <SpaSettingsForm spa={spaData} />
        </CardContent>
      </Card>
    </div>
  )
}
