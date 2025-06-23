'use client'

import { useState, useEffect } from 'react'
import { ClientStats } from './components/ClientStats'
import { ClientFilters } from './components/ClientFilters'
import { ClientList } from './components/ClientList'
import { StatsSkeleton, EmptyClients, EmptyState, PageTransition, FadeIn } from '@/components/ui'
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
          <StatsSkeleton />
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse" />
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse" />
            </div>
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
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
          <ClientStats clients={clients} />
        </FadeIn>

        {clients.length > 0 && (
          <FadeIn delay={200}>
            <ClientFilters
              filters={filters}
              onFiltersChange={setFilters}
            />
          </FadeIn>
        )}

        <FadeIn delay={400}>
          {clients.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <EmptyClients />
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <EmptyState
                title="No se encontraron clientes"
                description="Intenta ajustar los filtros de búsqueda para encontrar lo que buscas."
                icon={<SearchX className="w-12 h-12 mx-auto text-gray-400" />}
              />
            </div>
          ) : (
            <ClientList
              clients={filteredClients}
              filters={filters}
            />
          )}
        </FadeIn>
      </div>
    </PageTransition>
  )
}


