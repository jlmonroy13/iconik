import { getServices, getServiceStats } from './actions'
import { DashboardSectionLayout } from '../components/DashboardSectionLayout'
import { Package } from 'lucide-react'
import ServicesClientPage from './components/ServicesClientPage'

export default async function ServicesPage() {
  const servicesResult = await getServices()
  const statsResult = await getServiceStats()

  if (!servicesResult.success) {
    return (
      <DashboardSectionLayout
        icon={<Package className="w-8 h-8 text-blue-600" />}
        title="Catálogo de Servicios"
        description="Administra los servicios que ofrece tu spa. Agrega, edita o elimina servicios del catálogo."
        stats={null}
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
          <h2 className="text-lg font-bold mb-2">Error al cargar los servicios</h2>
          <p className="text-gray-500 dark:text-gray-400">{servicesResult.message}</p>
        </div>
      </DashboardSectionLayout>
    )
  }

  const services = servicesResult.data || []
  const stats = statsResult.success
    ? { totalRevenue: 0, ...statsResult.data }
    : {
        total: 0,
        active: 0,
        inactive: 0,
        mostRequestedServiceName: "N/A",
        totalRevenue: 0,
      };

  return (
    <ServicesClientPage
      services={services}
      stats={stats}
    />
  )
}
