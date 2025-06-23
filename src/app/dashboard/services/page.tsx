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
import { PageTransition, FadeIn, EmptyServices, StatsSkeleton } from '@/components/ui'

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
          <StatsSkeleton />
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="flex flex-col h-full">
        {/* Fixed Top Section */}
        <div className="flex-shrink-0 space-y-4 sm:space-y-6">
          <div className="min-h-[180px] sm:min-h-[112px]">
            {/* Stats Summary */}
            <FadeIn>
              <ServiceStatsCards stats={stats} />
            </FadeIn>

            {/* Filters */}
            {(services.length > 0 || isLoading) && (
              <FadeIn delay={200}>
                <div className="mt-4 sm:mt-6">
                  <ServiceFiltersPanel
                    filters={filters}
                    onFiltersChange={setFilters}
                    uniqueManicurists={uniqueManicurists}
                    resultsCount={filteredServices.length}
                  />
                </div>
              </FadeIn>
            )}
          </div>
        </div>

        {/* Scrollable Services List */}
        <FadeIn delay={400}>
          <div className="flex-1 mt-4 sm:mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
            <div className="h-full overflow-y-auto">
              {services.length === 0 ? (
                <EmptyServices />
              ) : filteredServices.length > 0 ? (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredServices.map((service, index) => (
                    <FadeIn key={service.id} delay={index * 100}>
                      <ServiceItem service={service} />
                    </FadeIn>
                  ))}
                </div>
              ) : (
                <EmptyState onClearFilters={clearFilters} />
              )}
            </div>
          </div>
        </FadeIn>
      </div>
    </PageTransition>
  )
}
