'use client'

import { useState, useEffect } from 'react'
import { ClientStats } from './components/ClientStats'
import { ClientFilters } from './components/ClientFilters'
import { ClientList } from './components/ClientList'
import { StatsSkeleton, EmptyClients, EmptyState, PageTransition, FadeIn, Skeleton } from '@/components/ui'
import { mockClients } from './types'
import type { ClientFilters as ClientFiltersType } from './types'
import { SearchX } from 'lucide-react'

export default function ClientsPage() {
  const [filters, setFilters] = useState<ClientFiltersType>({})
  const [isLoading, setIsLoading] = useState(true)
  const [clients] = useState(mockClients)

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Filter clients based on filters
  const filteredClients = clients.filter(client => {
    if (filters.search && !client.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false
    }
    if (filters.status && client.status !== filters.status) {
      return false
    }
    return true
  })

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
            <Skeleton height="68px" /> {/* Filters skeleton */}
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} height="60px" />
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
                  Clientes
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Administra la base de datos de tus clientes y su historial.
                </p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={200}>
            <ClientStats clients={clients} />
          </FadeIn>

          {clients.length > 0 && (
            <FadeIn delay={400}>
              <ClientFilters
                filters={filters}
                onFiltersChange={setFilters}
                resultsCount={filteredClients.length}
              />
            </FadeIn>
          )}
        </div>

        {/* Scrollable List */}
        <div className="mt-6 flex-grow overflow-y-auto pr-2 min-h-0">
          <FadeIn delay={600}>
            {clients.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 h-full">
                <EmptyClients />
              </div>
            ) : filteredClients.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 h-full">
                <EmptyState
                  title="No se encontraron clientes"
                  description="Intenta ajustar los filtros de búsqueda para encontrar lo que buscas."
                  icon={<SearchX className="w-12 h-12 mx-auto text-gray-400" />}
                />
              </div>
            ) : (
              <ClientList clients={filteredClients} filters={filters} />
            )}
          </FadeIn>
        </div>
      </div>
    </PageTransition>
  )
}


