import type {
  Service,
  Appointment,
  Client,
  Manicurist,
  Payment,
  PaymentMethod,
  Feedback,
  PaymentStats,
  FeedbackStats,
  DateRange,
  ChartData
} from '@/types'

// Re-export the main types from shared types
export type {
  Service,
  Appointment,
  Client,
  Manicurist,
  Payment,
  PaymentMethod,
  Feedback,
  PaymentStats,
  FeedbackStats,
  DateRange,
  ChartData
}

// Revenue stats interface
export interface RevenueStats {
  totalRevenue: number
  totalServices: number
  totalClients: number
  averageRating: number
  monthlyGrowth: number
  totalPayments: number
  averagePaymentAmount: number
}

// Service type stats interface
export interface ServiceTypeStats {
  type: string
  count: number
  revenue: number
  percentage: number
  averageRating: number
}

// Manicurist stats interface
export interface ManicuristStats {
  id: string
  name: string
  totalServices: number
  totalRevenue: number
  averageRating: number
  commission: number
  efficiency: number // services per month
  averageServiceTime: number
  totalFeedback: number
  averageWorkQualityRating: number
  averageAttentionRating: number
}

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
