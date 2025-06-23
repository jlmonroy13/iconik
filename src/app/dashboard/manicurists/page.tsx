'use client'

import { useState, useEffect } from 'react'
import { ManicuristStatsCards } from './components/ManicuristStats'
import { ManicuristCard } from './components/ManicuristCard'
import { ManicuristFilters } from './components/ManicuristFilters'
import { ManicuristFilters as ManicuristFiltersType, sampleManicurists } from './types'
import { calculateStats, filterManicurists } from './utils'
import { PageTransition, FadeIn, EmptyManicurists, StatsSkeleton, EmptyState } from '@/components/ui'
import { SearchX } from 'lucide-react'

export default function ManicuristsPage() {
  const [filters, setFilters] = useState<ManicuristFiltersType>({})
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1200)

    return () => clearTimeout(timer)
  }, [])

  const filteredManicurists = filterManicurists(sampleManicurists, filters)
  const stats = calculateStats(sampleManicurists)

  if (isLoading) {
    return (
      <PageTransition>
        <div className="space-y-6">
          <StatsSkeleton />
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse" />
                <div className="flex gap-4">
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-40 animate-pulse" />
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-40 animate-pulse" />
                </div>
              </div>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-4 sm:p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse" />
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        <FadeIn>
          <ManicuristStatsCards stats={stats} />
        </FadeIn>

        <FadeIn delay={200}>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
              {sampleManicurists.length > 0 && (
                <ManicuristFilters filters={filters} onFiltersChange={setFilters} />
              )}
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {sampleManicurists.length === 0 ? (
                <EmptyManicurists />
              ) : filteredManicurists.length > 0 ? (
                filteredManicurists.map((manicurist, index) => (
                  <FadeIn key={manicurist.id} delay={400 + index * 100}>
                    <ManicuristCard manicurist={manicurist} />
                  </FadeIn>
                ))
              ) : (
                <div className="p-8 text-center">
                  <EmptyState
                    title="No se encontraron manicuristas"
                    description="Intenta ajustar los filtros de búsqueda."
                    icon={<SearchX className="w-12 h-12 mx-auto text-gray-400" />}
                  />
                </div>
              )}
            </div>
          </div>
        </FadeIn>
      </div>
    </PageTransition>
  )
}
