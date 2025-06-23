'use client'

import { useState, useCallback, useEffect } from 'react'
import { PageTransition, FadeIn, Button, Skeleton, StatsSkeleton } from '@/components/ui'
import { Plus } from 'lucide-react'
import { ManicuristFilters } from './components/ManicuristFilters'
import { ManicuristCard } from './components/ManicuristCard'
import { ManicuristStatsCards } from './components/ManicuristStats'
import { ManicuristModal } from './components/ManicuristModal'
import { sampleManicurists } from './types'
import { filterManicurists, calculateStats } from './utils'
import type { ManicuristFormData } from './schemas'

export default function ManicuristsPage() {
  const [manicurists, setManicurists] = useState(sampleManicurists)
  const [filters, setFilters] = useState({})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedManicurist, setSelectedManicurist] = useState<typeof manicurists[0] | undefined>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const openCreateModal = useCallback(() => {
    setSelectedManicurist(undefined)
    setIsModalOpen(true)
  }, [])

  const filteredManicurists = filterManicurists(manicurists, filters)
  const stats = calculateStats(filteredManicurists)

  const handleCreateOrUpdate = async (data: ManicuristFormData) => {
    setIsSubmitting(true)
    try {
      if (selectedManicurist) {
        setManicurists(prev =>
          prev.map(m =>
            m.id === selectedManicurist.id
              ? { ...m, ...data, updatedAt: new Date().toISOString() }
              : m
          )
        )
      } else {
        const newManicurist = {
          id: Math.random().toString(36).substring(2, 9),
          ...data,
          joinedAt: new Date().toISOString(),
          rating: 0,
          totalServices: 0,
          totalRevenue: 0,
          thisMonthServices: 0,
          thisMonthRevenue: 0,
        }
        setManicurists(prev => [...prev, newManicurist])
      }
      setIsModalOpen(false)
      setSelectedManicurist(undefined)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (manicurist: typeof manicurists[0]) => {
    setSelectedManicurist(manicurist)
    setIsModalOpen(true)
  }

  if (isLoading) {
    return (
      <PageTransition>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <Skeleton variant="text" width="250px" height="32px" />
              <Skeleton variant="text" width="350px" />
            </div>
            <Skeleton width="180px" height="40px" />
          </div>
          <StatsSkeleton />
          <Skeleton height="68px" /> {/* Filters skeleton */}
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} height="135px" />
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Manicuristas
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Gestiona el equipo de profesionales de tu spa.
              </p>
            </div>
            <Button onClick={openCreateModal} variant="primary" className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Manicurista
            </Button>
          </div>

          <FadeIn>
            <ManicuristStatsCards stats={stats} />
          </FadeIn>

          <FadeIn delay={200}>
            <ManicuristFilters
              filters={filters}
              onFiltersChange={setFilters}
              resultsCount={filteredManicurists.length}
            />
          </FadeIn>
        </div>

        {/* Scrollable List - Added min-h-0 to allow flex-grow to work correctly */}
        <div className="mt-6 flex-grow overflow-y-auto pr-2 min-h-0">
          <FadeIn delay={400}>
            <div className="grid grid-cols-1 gap-4">
              {filteredManicurists.map((manicurist, index) => (
                <FadeIn key={manicurist.id} delay={index * 100}>
                  <ManicuristCard
                    manicurist={manicurist}
                    onEdit={() => handleEdit(manicurist)}
                  />
                </FadeIn>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>

      <ManicuristModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedManicurist(undefined)
        }}
        onSubmit={handleCreateOrUpdate}
        manicurist={selectedManicurist}
        isSubmitting={isSubmitting}
      />
    </PageTransition>
  )
}
