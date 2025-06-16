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

// Sample data for development
export const sampleManicurists: Manicurist[] = [
  {
    id: '1',
    name: 'Valentina Morales',
    email: 'valentina@example.com',
    phone: '+57 300 123 4567',
    avatar: '/avatars/valentina.jpg',
    status: 'ACTIVE',
    specialties: ['MANICURE', 'GEL_POLISH', 'NAIL_ART'],
    joinedAt: '2024-01-15T10:00:00Z',
    rating: 4.8,
    totalServices: 156,
    totalRevenue: 7800000,
    thisMonthServices: 23,
    thisMonthRevenue: 1150000
  },
  {
    id: '2',
    name: 'Camila Rodríguez',
    email: 'camila@example.com',
    phone: '+57 300 234 5678',
    avatar: '/avatars/camila.jpg',
    status: 'ACTIVE',
    specialties: ['PEDICURE', 'ACRYLIC_NAILS'],
    joinedAt: '2024-02-01T09:30:00Z',
    rating: 4.9,
    totalServices: 98,
    totalRevenue: 4900000,
    thisMonthServices: 18,
    thisMonthRevenue: 900000
  },
  {
    id: '3',
    name: 'Laura Martínez',
    email: 'laura@example.com',
    phone: '+57 300 345 6789',
    avatar: '/avatars/laura.jpg',
    status: 'INACTIVE',
    specialties: ['MANICURE', 'PEDICURE', 'GEL_POLISH'],
    joinedAt: '2024-03-10T14:00:00Z',
    rating: 4.7,
    totalServices: 45,
    totalRevenue: 2250000,
    thisMonthServices: 0,
    thisMonthRevenue: 0
  }
]
