import { prisma } from '@/lib/prisma'
import { StatCard, Card, CardHeader, CardTitle, CardContent } from '@/components/ui'

async function getDashboardStats() {
  // Get the first spa for now (later we'll get from session)
  const spa = await prisma.spa.findFirst()

  if (!spa) {
    return {
      totalServices: 0,
      totalRevenue: 0,
      totalClients: 0,
      totalAppointments: 0,
      recentServices: [],
      upcomingAppointments: []
    }
  }

  const [
    totalServices,
    totalRevenue,
    totalClients,
    totalAppointments,
    recentServices,
    upcomingAppointments
  ] = await Promise.all([
    // Total services count
    prisma.service.count({
      where: { spaId: spa.id }
    }),

    // Total revenue from services
    prisma.service.aggregate({
      where: { spaId: spa.id },
      _sum: { price: true }
    }),

    // Total clients
    prisma.client.count({
      where: { spaId: spa.id }
    }),

    // Total appointments
    prisma.appointment.count({
      where: { spaId: spa.id }
    }),

    // Recent services (last 5)
    prisma.service.findMany({
      where: { spaId: spa.id },
      include: {
        client: true,
        manicurist: true
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    }),

    // Upcoming appointments
    prisma.appointment.findMany({
      where: {
        spaId: spa.id,
        scheduledAt: { gte: new Date() }
      },
      include: {
        client: true,
        manicurist: true
      },
      orderBy: { scheduledAt: 'asc' },
      take: 3
    })
  ])

  return {
    totalServices,
    totalRevenue: totalRevenue._sum.price || 0,
    totalClients,
    totalAppointments,
    recentServices,
    upcomingAppointments
  }
}

export default async function DashboardPage() {
  const stats = await getDashboardStats()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          ¡Bienvenida a tu Dashboard! 💅
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">
          Aquí tienes un resumen de tu spa de uñas
        </p>
      </div>

      {/* Stats Grid - Responsive */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <StatCard
          title="Servicios"
          value={stats.totalServices}
          icon="💅"
        />
        <StatCard
          title="Ingresos"
          value={
            <div>
                <span className="hidden sm:inline">{formatCurrency(stats.totalRevenue)}</span>
                <span className="sm:hidden">${(stats.totalRevenue / 1000).toFixed(0)}K</span>
            </div>
          }
          icon="💰"
        />
        <StatCard
          title="Clientes"
          value={stats.totalClients}
          icon="👥"
        />
        <StatCard
          title="Citas"
          value={stats.totalAppointments}
          icon="📅"
        />
      </div>

      {/* Two Column Layout - Stacks on mobile */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Services */}
        <Card>
          <CardHeader>
            <CardTitle>Servicios Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {stats.recentServices.map((service) => (
                <div key={service.id} className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-pink-100 dark:bg-pink-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-xs sm:text-sm">💅</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">
                      {service.type.replace('_', ' ')} - {service.client.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      <span className="hidden sm:inline">{service.manicurist?.name} • </span>
                      {formatDate(service.createdAt)}
                    </p>
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white flex-shrink-0">
                    <span className="hidden sm:inline">{formatCurrency(service.price)}</span>
                    <span className="sm:hidden">${(service.price / 1000).toFixed(0)}K</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Próximas Citas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {stats.upcomingAppointments.length > 0 ? (
                stats.upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center space-x-3 sm:space-x-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-xs sm:text-sm">📅</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">
                        {appointment.serviceType.replace('_', ' ')} - {appointment.client.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        <span className="hidden sm:inline">{appointment.manicurist?.name} • </span>
                        {formatDate(appointment.scheduledAt)}
                      </p>
                    </div>
                    <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white flex-shrink-0">
                      <span className="hidden sm:inline">{formatCurrency(appointment.price)}</span>
                      <span className="sm:hidden">${(appointment.price / 1000).toFixed(0)}K</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-6 sm:py-8 text-sm">
                  No hay citas programadas
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
