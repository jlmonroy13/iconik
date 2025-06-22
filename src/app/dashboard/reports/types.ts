import { ServiceType, PaymentMethod } from '@/generated/prisma'

export interface Service {
  id: string
  type: ServiceType
  price: number
  duration: number
  rating: number | null
  paymentMethod: PaymentMethod
  createdAt: Date
  client: {
    id: string
    name: string
  }
  manicurist: {
    id: string
    name: string
  } | null
}

export interface Appointment {
  id: string
  serviceType: ServiceType
  price: number
  status: string
  scheduledAt: Date
  client: {
    id: string
    name: string
  }
  manicurist: {
    id: string
    name: string
  } | null
}

export interface Client {
  id: string
  name: string
  email: string | null
  phone: string | null
  createdAt: Date
  services: Array<{
    id: string
    type: ServiceType
    price: number
    duration: number
    rating: number | null
    paymentMethod: PaymentMethod
    createdAt: Date
  }>
  appointments: Array<{
    id: string
    serviceType: ServiceType
    price: number
    status: string
    scheduledAt: Date
  }>
}

export interface Manicurist {
  id: string
  name: string
  email: string | null
  specialty: string | null
  commission: number
  isActive: boolean
  services: Array<{
    id: string
    type: ServiceType
    price: number
    duration: number
    rating: number | null
    paymentMethod: PaymentMethod
    createdAt: Date
  }>
  appointments: Array<{
    id: string
    serviceType: ServiceType
    price: number
    status: string
    scheduledAt: Date
  }>
}

export interface RevenueStats {
  totalRevenue: number
  totalServices: number
  totalClients: number
  averageRating: number
  monthlyGrowth: number
}

export interface ServiceTypeStats {
  type: ServiceType
  count: number
  revenue: number
  percentage: number
}

export interface ManicuristStats {
  id: string
  name: string
  totalServices: number
  totalRevenue: number
  averageRating: number
  commission: number
  efficiency: number // services per month
}

export interface ClientStats {
  id: string
  name: string
  totalSpent: number
  visitCount: number
  lastVisit: Date | null
  averageSpending: number
  loyalty: 'VIP' | 'Regular' | 'New'
}

export interface DateRange {
  from: Date
  to: Date
}

export interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string[]
    borderColor?: string
    borderWidth?: number
  }[]
}
