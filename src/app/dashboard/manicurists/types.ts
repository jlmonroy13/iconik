export interface Manicurist {
  id: string
  name: string
  email: string
  phone: string
  avatar?: string
  status: 'ACTIVE' | 'INACTIVE'
  specialties: ServiceType[]
  joinedAt: string
  rating: number
  totalServices: number
  totalRevenue: number
  thisMonthServices: number
  thisMonthRevenue: number
}

export type ServiceType = 'MANICURE' | 'PEDICURE' | 'NAIL_ART' | 'GEL_POLISH' | 'ACRYLIC_NAILS'

export interface ManicuristFilters {
  status?: 'ACTIVE' | 'INACTIVE'
  specialty?: ServiceType
  search?: string
}

export interface ManicuristStats {
  totalManicurists: number
  activeManicurists: number
  totalRevenue: number
  averageRating: number
  thisMonthServices: number
  thisMonthRevenue: number
}
