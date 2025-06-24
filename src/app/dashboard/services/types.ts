export interface Service {
  id: string
  name: string
  description?: string
  price: number
  duration: number
  category: 'MANOS' | 'PIES' | 'DEPILACION' | 'OTRO'
  status: 'ACTIVE' | 'INACTIVE'
}

export interface ServiceRecord {
  id: string
  type: ServiceType
  client: { name: string }
  manicurist: { name: string } | null
  price: number
  paymentMethod: PaymentMethod
  rating?: number
  notes?: string
  createdAt: Date
}

export type ServiceType =
  | 'MANICURE'
  | 'PEDICURE'
  | 'NAIL_ART'
  | 'GEL_POLISH'
  | 'ACRYLIC_NAILS'

export type PaymentMethod =
  | 'CASH'
  | 'CARD'
  | 'TRANSFER'

export interface ServiceFilters {
  serviceType: string
  manicurist: string
  dateFrom: string
  dateTo: string
  status?: 'ACTIVE' | 'INACTIVE'
}

export interface ServiceStats {
  totalServices: number
  totalRevenue: number
  averageRating: number
  thisMonthServices: number
}
