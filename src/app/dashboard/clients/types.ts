import type { Client, ClientWithDetails, ClientFilters } from '@/types'

// Re-export the main types from shared types
export type { Client, ClientWithDetails, ClientFilters }

// Client stats interface
export interface ClientStats {
  id: string
  name: string
  totalSpent: number
  visitCount: number
  lastVisit: Date | null
  averageSpending: number
  loyalty: 'VIP' | 'Regular' | 'New'
  averageRating: number
  totalFeedback: number
}
