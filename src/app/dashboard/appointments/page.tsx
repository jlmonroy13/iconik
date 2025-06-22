import { prisma } from '@/lib/prisma'
import {
  AppointmentStats,
  AppointmentCalendar,
  AppointmentList,
  AppointmentFilters,
  FloatingActionButton
} from './components'

async function getAppointmentsData() {
  // Get the first spa for now (later we'll get from session)
  const spa = await prisma.spa.findFirst()

  if (!spa) {
    return {
      appointments: [],
      stats: {
        total: 0,
        scheduled: 0,
        confirmed: 0,
        completed: 0,
        cancelled: 0
      }
    }
  }

  const appointments = await prisma.appointment.findMany({
    where: { spaId: spa.id },
    include: {
      client: true,
      manicurist: true
    },
    orderBy: { scheduledAt: 'asc' }
  })

  // Calculate stats
  const stats = {
    total: appointments.length,
    scheduled: appointments.filter(a => a.status === 'SCHEDULED').length,
    confirmed: appointments.filter(a => a.status === 'CONFIRMED').length,
    completed: appointments.filter(a => a.status === 'COMPLETED').length,
    cancelled: appointments.filter(a => a.status === 'CANCELLED').length
  }

  return {
    appointments,
    stats
  }
}

export default async function AppointmentsPage() {
  const { appointments, stats } = await getAppointmentsData()

  return (
    <>
      <div className="space-y-4 sm:space-y-6">
        {/* Stats Cards */}
        <AppointmentStats stats={stats} />

        {/* Calendar View */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              Calendario de Citas
            </h2>
          </div>
          <div className="p-3 sm:p-4 lg:p-6">
            <AppointmentCalendar appointments={appointments} />
          </div>
        </div>

        {/* List View with Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                Lista de Citas
              </h2>
              <AppointmentFilters />
            </div>
          </div>
          <div className="p-3 sm:p-4 lg:p-6">
            <AppointmentList appointments={appointments} />
          </div>
        </div>
      </div>

      {/* Floating Action Button for Mobile */}
      <FloatingActionButton />
    </>
  )
}
