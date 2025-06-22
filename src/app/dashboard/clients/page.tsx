'use client'

import { useState } from 'react'
import { ClientStats } from './components/ClientStats'
import { ClientFilters } from './components/ClientFilters'
import { ClientList } from './components/ClientList'
import { mockClients } from './types'
import type { ClientFilters as ClientFiltersType } from './types'

export default function ClientsPage() {
  const [filters, setFilters] = useState<ClientFiltersType>({})

  return (
    <div className="space-y-6">
      <ClientStats clients={mockClients} />

      <ClientFilters
        filters={filters}
        onFiltersChange={setFilters}
      />

      <ClientList
        clients={mockClients}
        filters={filters}
      />
    </div>
  )
}


