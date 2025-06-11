'use client'

import { useState, useMemo } from 'react'
import { STATIC_SERVICES } from './data'
import { ServiceFilters } from './types'
import { filterServices, calculateStats, getUniqueManicurists } from './utils'
import {
  ServiceStatsCards,
  ServiceFiltersPanel,
  ServiceItem,
  EmptyState
} from './components'

export default function ServicesPage() {
  const [services] = useState(STATIC_SERVICES)
  const [filters, setFilters] = useState<ServiceFilters>({
    serviceType: '',
    manicurist: '',
    dateFrom: '',
    dateTo: ''
  })

  // Memoized calculations for performance
  const filteredServices = useMemo(() =>
    filterServices(services, filters),
    [services, filters]
  )

  const stats = useMemo(() =>
    calculateStats(filteredServices),
    [filteredServices]
  )

  const uniqueManicurists = useMemo(() =>
    getUniqueManicurists(services),
    [services]
  )

  const clearFilters = () => {
    setFilters({ serviceType: '', manicurist: '', dateFrom: '', dateTo: '' })
  }

  return (
    <div className="flex flex-col h-full">
      {/* Fixed Top Section */}
      <div className="flex-shrink-0 space-y-4 sm:space-y-6">
        {/* Stats Summary */}
        <ServiceStatsCards stats={stats} />

        {/* Filters */}
        <ServiceFiltersPanel
          filters={filters}
          onFiltersChange={setFilters}
          uniqueManicurists={uniqueManicurists}
          resultsCount={filteredServices.length}
        />
      </div>

      {/* Scrollable Services List */}
      <div className="flex-1 mt-4 sm:mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="h-full overflow-y-auto">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredServices.length > 0 ? (
              filteredServices.map((service) => (
                <ServiceItem key={service.id} service={service} />
              ))
            ) : (
              <EmptyState onClearFilters={clearFilters} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
