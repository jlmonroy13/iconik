import { prisma } from '@/lib/prisma'
import { RevenueStats } from './components/RevenueStats'
import { ServiceAnalytics } from './components/ServiceAnalytics'
import { ManicuristPerformance } from './components/ManicuristPerformance'
import { ClientInsights } from './components/ClientInsights'
import { DateRangePicker } from './components/DateRangePicker'
import { ExportOptions } from './components/ExportOptions'

async function getReportsData() {
  // Get the first spa for now (later we'll get from session)
  const spa = await prisma.spa.findFirst()

  if (!spa) {
    return {
      services: [],
      clients: [],
      manicurists: [],
      stats: {
        totalRevenue: 0,
        totalServices: 0,
        totalClients: 0,
        averageRating: 0,
        monthlyGrowth: 0
      }
    }
  }

  const [services, clients, manicurists] = await Promise.all([
    // Get all services with related data
    prisma.service.findMany({
      where: { spaId: spa.id },
      include: {
        client: true,
        manicurist: true
      },
      orderBy: { createdAt: 'desc' }
    }),

    // Get all clients
    prisma.client.findMany({
      where: { spaId: spa.id },
      include: {
        services: true,
        appointments: true
      }
    }),

    // Get all manicurists
    prisma.manicurist.findMany({
      where: { spaId: spa.id },
      include: {
        services: true,
        appointments: true
      }
    })
  ])

  // Calculate comprehensive stats
  const totalRevenue = services.reduce((sum, service) => sum + service.price, 0)
  const totalServices = services.length
  const totalClients = clients.length
  const averageRating = services.filter(s => s.rating).length > 0
    ? services.filter(s => s.rating).reduce((sum, service) => sum + (service.rating || 0), 0) / services.filter(s => s.rating).length
    : 0

  // Calculate monthly growth (simplified)
  const currentMonth = new Date().getMonth()
  const lastMonth = new Date().getMonth() - 1
  const currentMonthRevenue = services
    .filter(s => new Date(s.createdAt).getMonth() === currentMonth)
    .reduce((sum, s) => sum + s.price, 0)
  const lastMonthRevenue = services
    .filter(s => new Date(s.createdAt).getMonth() === lastMonth)
    .reduce((sum, s) => sum + s.price, 0)
  const monthlyGrowth = lastMonthRevenue > 0
    ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
    : 0

  const stats = {
    totalRevenue,
    totalServices,
    totalClients,
    averageRating: Math.round(averageRating * 10) / 10,
    monthlyGrowth: Math.round(monthlyGrowth * 10) / 10
  }

  return {
    services,
    clients,
    manicurists,
    stats
  }
}

export default async function ReportsPage() {
  const { services, clients, manicurists, stats } = await getReportsData()

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header with Date Range and Export */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <DateRangePicker />
          <ExportOptions />
        </div>
      </div>

      {/* Revenue Stats */}
      <RevenueStats stats={stats} />

      {/* Service Analytics */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
            Análisis de Servicios
          </h2>
        </div>
        <div className="p-3 sm:p-4 lg:p-6">
          <ServiceAnalytics services={services} />
        </div>
      </div>

      {/* Manicurist Performance */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              Rendimiento de Manicuristas
            </h2>
          </div>
        </div>
        <div className="p-3 sm:p-4 lg:p-6">
          <ManicuristPerformance manicurists={manicurists} />
        </div>
      </div>

      {/* Client Insights */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
            Insights de Clientes
          </h2>
        </div>
        <div className="p-3 sm:p-4 lg:p-6">
          <ClientInsights clients={clients} />
        </div>
      </div>
    </div>
  )
}
