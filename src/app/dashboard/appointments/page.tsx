import { prisma } from '@/lib/prisma'
import {
  AppointmentStats,
  AppointmentCalendar,
  AppointmentList,
  AppointmentFilters,
  FloatingActionButton,
  AppointmentsClient,
  AppointmentsHeader
} from './components'
import { PageTransition, FadeIn, EmptyAppointments } from '@/components/ui'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Citas - Iconik',
  description: 'Gestiona el calendario de citas de tu spa de uñas. Programa, confirma y organiza las citas de tus clientes.',
}

async function getAppointmentsData() {
  // Get the first spa for now (later we'll get from session)
  const spa = await prisma.spa.findFirst()

  if (!spa) {
    return {
      appointments: [],
      clients: [],
      manicurists: [],
      services: [],
      stats: {
        total: 0,
        scheduled: 0,
        confirmed: 0,
        completed: 0,
        cancelled: 0
      }
    }
  }

  const [appointments, clients, manicurists, services] = await Promise.all([
    prisma.appointment.findMany({
      where: { spaId: spa.id },
      include: {
        client: true,
        manicurist: true
      },
      orderBy: { scheduledAt: 'asc' }
    }),
    prisma.client.findMany({
      where: { spaId: spa.id },
      select: { id: true, name: true },
      orderBy: { name: 'asc' }
    }),
    prisma.manicurist.findMany({
      where: { spaId: spa.id, isActive: true },
      select: { id: true, name: true },
      orderBy: { name: 'asc' }
    }),
    prisma.service.findMany({
      where: { spaId: spa.id },
      select: { id: true, type: true },
      orderBy: { type: 'asc' }
    })
  ])

  // Calculate stats
  const stats = {
    total: appointments.length,
    scheduled: appointments.filter(a => a.status === 'SCHEDULED').length,
    confirmed: appointments.filter(a => a.status === 'CONFIRMED').length,
    completed: appointments.filter(a => a.status === 'COMPLETED').length,
    cancelled: appointments.filter(a => a.status === 'CANCELLED').length
  }

  // Transform services to have name property
  const servicesWithNames = services.map(service => ({
    id: service.type,
    name: service.type.replace(/_/g, ' ')
  }))

  return {
    appointments,
    clients,
    manicurists,
    services: servicesWithNames,
    stats
  }
}

export default async function AppointmentsPage() {
  const { appointments, clients, manicurists, services, stats } = await getAppointmentsData()

  return (
    <AppointmentsClient
      clients={clients}
      manicurists={manicurists}
      services={services}
    >
      <PageTransition className="h-full">
        <div className="flex h-full flex-col">
          {/* Fixed Header and Stats */}
          <div className="flex-shrink-0">
            <FadeIn>
              <AppointmentsHeader />
            </FadeIn>

            <FadeIn delay={200}>
              <AppointmentStats stats={stats} />
            </FadeIn>
          </div>

          {/* Scrollable Content */}
          <div className="mt-6 flex-grow overflow-y-auto pr-2 min-h-0 space-y-6">
            <FadeIn delay={400}>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                    Calendario de Citas
                  </h2>
                </div>
                <div className="p-3 sm:p-4 lg:p-6">
                  {appointments.length > 0 ? (
                    <AppointmentCalendar appointments={appointments} />
                  ) : (
                    <EmptyAppointments />
                  )}
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={600}>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                      Lista de Citas
                    </h2>
                    {appointments.length > 0 && <AppointmentFilters />}
                  </div>
                </div>
                <div className="p-3 sm:p-4 lg:p-6">
                  {appointments.length > 0 ? (
                    <AppointmentList appointments={appointments} />
                  ) : (
                    <EmptyAppointments />
                  )}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
        <FloatingActionButton />
      </PageTransition>
    </AppointmentsClient>
  )
}
