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

// Mock de catálogo de servicios
export const mockServices: Service[] = [
  {
    id: '1',
    name: 'Manicure Tradicional',
    description: 'Cuidado y esmaltado de uñas de manos.',
    price: 25000,
    duration: 45,
    category: 'MANOS',
    status: 'ACTIVE',
  },
  {
    id: '2',
    name: 'Pedicure Spa',
    description: 'Pedicure completo con exfoliación.',
    price: 35000,
    duration: 60,
    category: 'PIES',
    status: 'ACTIVE',
  },
  {
    id: '3',
    name: 'Depilación Cejas',
    description: 'Depilación y diseño de cejas.',
    price: 15000,
    duration: 20,
    category: 'DEPILACION',
    status: 'INACTIVE',
  },
  {
    id: '4',
    name: 'Uñas Acrílicas',
    description: 'Aplicación de uñas acrílicas con diseño.',
    price: 45000,
    duration: 90,
    category: 'MANOS',
    status: 'ACTIVE',
  },
  {
    id: '5',
    name: 'Spa de Pies',
    description: 'Tratamiento relajante y exfoliante para pies.',
    price: 30000,
    duration: 50,
    category: 'PIES',
    status: 'INACTIVE',
  },
]
