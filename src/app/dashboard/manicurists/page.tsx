'use client'

import { useState } from 'react'
import { ManicuristStatsCards } from './components/ManicuristStats'
import { ManicuristCard } from './components/ManicuristCard'
import { ManicuristFilters } from './components/ManicuristFilters'
import { ManicuristFilters as ManicuristFiltersType, sampleManicurists } from './types'
import { calculateStats, filterManicurists } from './utils'

export default function ManicuristsPage() {
  const [filters, setFilters] = useState<ManicuristFiltersType>({})

  const filteredManicurists = filterManicurists(sampleManicurists, filters)
  const stats = calculateStats(sampleManicurists)

  return (
    <div className="space-y-6">
      <ManicuristStatsCards stats={stats} />
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <ManicuristFilters filters={filters} onFiltersChange={setFilters} />
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredManicurists.map(manicurist => (
            <ManicuristCard key={manicurist.id} manicurist={manicurist} />
          ))}
        </div>
      </div>
    </div>
  )
}
