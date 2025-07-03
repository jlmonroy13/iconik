import { SpaSettingsForm } from './components/SpaSettingsForm'
import { ScheduleList } from './components/ScheduleList'
import { SalesGoalsList } from './components/SalesGoalsList'
import { getSpaSettings, getSalesGoals } from './actions'
import { Card, CardHeader, CardTitle, CardContent, PageTransition, FadeIn, EmptyState } from '@/components/ui'
import { Settings, Clock, Bell, Globe, Target } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Configuración - Iconik',
  description: 'Configura los ajustes de tu spa de uñas, incluyendo información del negocio y preferencias.',
}

export default async function SettingsPage() {
  const result = await getSpaSettings()
  const salesGoalsResult = await getSalesGoals()

  if (!result.success) {
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
                description={result.message}
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

  const spaData = result.data
  const salesGoals = salesGoalsResult.success ? (salesGoalsResult.data || []) : []

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
                description="No se encontró la información del spa."
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

  const normalizedSchedules = (spaData.spaSchedules ?? []).map(sch => ({
    id: sch.id,
    dayOfWeek: sch.dayOfWeek ?? 0,
    isHoliday: sch.isHoliday,
    isOpen: sch.isOpen,
    startTime: sch.startTime,
    endTime: sch.endTime,
    description: sch.description ?? undefined,
  }))

  const normalizedSalesGoals = salesGoals.map(goal => ({
    id: goal.id,
    name: goal.name,
    type: goal.type,
    period: goal.period,
    targetAmount: goal.targetAmount,
    currentAmount: goal.currentAmount,
    startDate: goal.startDate,
    endDate: goal.endDate,
    isActive: goal.isActive,
    manicurist: goal.manicurist,
    service: goal.service,
  }))

  return (
    <PageTransition className="h-full">
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex-shrink-0">
          <FadeIn>
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Settings className="w-8 h-8 text-blue-600" />
                Configuración
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Gestiona la configuración de tu spa de uñas
              </p>
            </div>
          </FadeIn>
        </div>

        {/* Scrollable Content */}
        <div className="flex-grow overflow-y-auto min-h-0">
          <div className="space-y-6">
            {/* Información del Spa */}
            <FadeIn delay={200}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Información del Spa
                  </CardTitle>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Actualiza el nombre, la dirección y la información de contacto de tu spa.
                  </p>
                </CardHeader>
                <CardContent>
                  <SpaSettingsForm spa={spaData} />
                </CardContent>
              </Card>
            </FadeIn>

            {/* Horarios de Operación */}
            <FadeIn delay={300}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Horarios de Operación
                  </CardTitle>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Configura los horarios de apertura y cierre de tu spa para cada día de la semana y festivos.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="border-t pt-6">
                    <ScheduleList schedules={normalizedSchedules} />
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            {/* Metas de Ventas */}
            <FadeIn delay={400}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Metas de Ventas
                  </CardTitle>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Configura metas de ingresos, servicios, clientes y citas para tu spa.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="border-t pt-6">
                    <SalesGoalsList goals={normalizedSalesGoals} />
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            {/* Configuración de Notificaciones */}
            <FadeIn delay={500}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notificaciones
                  </CardTitle>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Configura cómo recibir notificaciones y recordatorios.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-blue-800 dark:text-blue-200 text-sm">
                      🚧 Configuración de notificaciones en desarrollo
                    </p>
                    <p className="text-blue-600 dark:text-blue-300 text-xs mt-1">
                      Próximamente podrás configurar notificaciones por email, SMS y push.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            {/* Preferencias Generales */}
            <FadeIn delay={600}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Preferencias Generales
                  </CardTitle>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Configura preferencias de zona horaria, moneda y formato de fechas.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-blue-800 dark:text-blue-200 text-sm">
                      🚧 Preferencias generales en desarrollo
                    </p>
                    <p className="text-blue-600 dark:text-blue-300 text-xs mt-1">
                      Próximamente podrás configurar zona horaria, moneda y otros ajustes.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
