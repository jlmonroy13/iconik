import type { Manicurist, ManicuristWithDetails, ManicuristFilters } from '@/types'

// Re-export the main types from shared types
export type { Manicurist, ManicuristWithDetails, ManicuristFilters }

// Manicurist stats interface
export interface ManicuristStats {
  id: string
  name: string
  totalServices: number
  totalRevenue: number
  averageRating: number
  commission: number
  efficiency: number // services per month
  averageServiceTime: number // minutes
  totalFeedback: number
  averageWorkQualityRating: number
  averageAttentionRating: number
}
