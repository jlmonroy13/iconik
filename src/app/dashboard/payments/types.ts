import type { Payment, PaymentWithDetails, PaymentFormData, PaymentFilters, PaymentStats } from '@/types'

// Re-export the main types from shared types
export type { Payment, PaymentWithDetails, PaymentFormData, PaymentFilters, PaymentStats }

// Payment summary for lists
export interface PaymentSummary {
  id: string
  amount: number
  paidAt: Date
  reference?: string
  paymentMethod: {
    id: string
    name: string
    icon?: string
  }
  appointment?: {
    id: string
    client: {
      id: string
      name: string
    }
    scheduledAt: Date
  }
  appointmentService?: {
    id: string
    service: {
      id: string
      name: string
      type: string
    }
    manicurist: {
      id: string
      name: string
    }
  }
}

// Payment form for creating/editing
export interface PaymentFormDataExtended extends PaymentFormData {
  clientName?: string
  serviceName?: string
  manicuristName?: string
}

// Payment filters extended
export interface PaymentFiltersExtended extends PaymentFilters {
  clientId?: string
  manicuristId?: string
  serviceId?: string
  minAmount?: number
  maxAmount?: number
}
