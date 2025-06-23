import { prisma } from '@/lib/prisma'
import { StatCard, Card, CardHeader, CardTitle, CardContent, PageTransition, FadeIn, EmptyState } from '@/components/ui'
import { Sparkles, DollarSign, Users, Calendar, PartyPopper } from 'lucide-react'

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
    <PageTransition>
      <div className="space-y-4 sm:space-y-6">
        {/* Welcome Header */}
        <FadeIn>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              ¡Bienvenida a tu Dashboard! <PartyPopper className="text-yellow-500" />
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">
              Aquí tienes un resumen de tu spa de uñas
            </p>
          </div>
        </FadeIn>

        {/* Stats Grid - Responsive */}
        <FadeIn delay={200}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <StatCard
              title="Servicios"
              value={stats.totalServices}
              icon={<Sparkles className="text-pink-600 dark:text-pink-400" />}
              iconBgColor="bg-pink-100 dark:bg-pink-900/20"
            />
            <StatCard
              title="Ingresos"
              value={
                <div>
                    <span className="hidden sm:inline">{formatCurrency(stats.totalRevenue)}</span>
                    <span className="sm:hidden">${(stats.totalRevenue / 1000).toFixed(0)}K</span>
                </div>
              }
              icon={<DollarSign className="text-green-600 dark:text-green-400" />}
              iconBgColor="bg-green-100 dark:bg-green-900/20"
            />
            <StatCard
              title="Clientes"
              value={stats.totalClients}
              icon={<Users className="text-blue-600 dark:text-blue-400" />}
              iconBgColor="bg-blue-100 dark:bg-blue-900/20"
            />
            <StatCard
              title="Citas"
              value={stats.totalAppointments}
              icon={<Calendar className="text-purple-600 dark:text-purple-400" />}
              iconBgColor="bg-purple-100 dark:bg-purple-900/20"
            />
          </div>
        </FadeIn>

        {/* Two Column Layout - Stacks on mobile */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          {/* Recent Services */}
          <FadeIn delay={400}>
            <Card>
              <CardHeader>
                <CardTitle>Servicios Recientes</CardTitle>
              </CardHeader>
              <CardContent>
                {stats.recentServices.length > 0 ? (
                  <div className="space-y-3 sm:space-y-4">
                    {stats.recentServices.map((service) => (
                      <div key={service.id} className="flex items-center space-x-3 sm:space-x-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-pink-100 dark:bg-pink-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-pink-600 dark:text-pink-400" />
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
                ) : (
                  <EmptyState
                    title="No hay servicios recientes"
                    description="Los servicios que realices aparecerán aquí."
                    icon={
                      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    }
                  />
                )}
              </CardContent>
            </Card>
          </FadeIn>

          {/* Upcoming Appointments */}
          <FadeIn delay={600}>
            <Card>
              <CardHeader>
                <CardTitle>Próximas Citas</CardTitle>
              </CardHeader>
              <CardContent>
                {stats.upcomingAppointments.length > 0 ? (
                  <div className="space-y-3 sm:space-y-4">
                    {stats.upcomingAppointments.map((appointment) => (
                      <div key={appointment.id} className="flex items-center space-x-3 sm:space-x-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
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
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="No hay citas próximas"
                    description="Las citas programadas aparecerán aquí."
                    icon={
                      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    }
                  />
                )}
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </div>
    </PageTransition>
  )
}
