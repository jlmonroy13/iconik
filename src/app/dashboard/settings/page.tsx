import { SpaSettingsForm } from './components/SpaSettingsForm'
import { prisma } from '@/lib/prisma'
import { Card, CardHeader, CardTitle, CardContent, PageTransition, FadeIn, EmptyState } from '@/components/ui'

async function getSpaData() {
  // Get the first spa for now (later we'll get from session)
  const spa = await prisma.spa.findFirst()
  return spa
}

export default async function SettingsPage() {
  const spaData = await getSpaData()

  if (!spaData) {
    return (
      <PageTransition>
        <div className="space-y-6">
          <FadeIn>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Configuración</h1>
          </FadeIn>
          <FadeIn delay={200}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <EmptyState
                title="Error al cargar la configuración"
                description="No se pudo cargar la información del spa. Por favor, inténtalo de nuevo más tarde."
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
      <div className="space-y-6">
        <FadeIn>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Configuración</h1>
        </FadeIn>

        <FadeIn delay={200}>
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
        </FadeIn>
      </div>
    </PageTransition>
  )
}
