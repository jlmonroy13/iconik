'use client'

import { useState, useMemo, useEffect } from 'react'
import { STATIC_SERVICES } from './data'
import { ServiceFilters } from './types'
import { filterServices, calculateStats, getUniqueManicurists } from './utils'
import {
  ServiceStatsCards,
  ServiceFiltersPanel,
  ServiceItem,
  EmptyState
} from './components'
import { PageTransition, FadeIn, EmptyServices, StatsSkeleton, Skeleton } from '@/components/ui'

export default function ServicesPage() {
  const [services] = useState(STATIC_SERVICES)
  const [filters, setFilters] = useState<ServiceFilters>({
    serviceType: '',
    manicurist: '',
    dateFrom: '',
    dateTo: ''
  })
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

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

  if (isLoading) {
    return (
      <PageTransition>
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton variant="text" width="40%" height="32px" />
            <Skeleton variant="text" width="50%" />
          </div>
          <StatsSkeleton />
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} height="76px" />
            ))}
          </div>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition className="h-full">
      <div className="flex h-full flex-col">
        {/* Fixed Header, Stats, and Filters */}
        <div className="flex-shrink-0">
          <FadeIn>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  Historial de Servicios
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Consulta y filtra todos los servicios registrados en tu spa.
                </p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={200}>
            <ServiceStatsCards stats={stats} />
          </FadeIn>

          {(services.length > 0 || isLoading) && (
            <FadeIn delay={400}>
              <ServiceFiltersPanel
                filters={filters}
                onFiltersChange={setFilters}
                uniqueManicurists={uniqueManicurists}
                resultsCount={filteredServices.length}
              />
            </FadeIn>
          )}
        </div>

        {/* Scrollable List */}
        <div className="mt-6 flex-grow overflow-y-auto pr-2 min-h-0">
          <FadeIn delay={600}>
            {services.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm h-full">
                <EmptyServices />
              </div>
            ) : filteredServices.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {filteredServices.map((service, index) => (
                  <FadeIn key={service.id} delay={index * 100}>
                    <ServiceItem service={service} />
                  </FadeIn>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm h-full">
                <EmptyState onClearFilters={clearFilters} />
              </div>
            )}
          </FadeIn>
        </div>
      </div>
    </PageTransition>
  )
}
