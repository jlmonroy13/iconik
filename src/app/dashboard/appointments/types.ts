import { ServiceType, AppointmentStatus } from '@/generated/prisma'

export interface Appointment {
  id: string
  clientId: string
  manicuristId: string | null
  serviceType: ServiceType
  scheduledAt: Date
  duration: number
  price: number
  status: AppointmentStatus
  notes: string | null
  spaId: string
  createdAt: Date
  updatedAt: Date
  client: {
    id: string
    name: string
    phone: string | null
    email: string | null
  }
  manicurist: {
    id: string
    name: string
    phone: string | null
    email: string | null
  } | null
}

export interface Client {
  id: string
  name: string
  phone: string | null
  email: string | null
  birthday: Date | null
  notes: string | null
}

export interface Manicurist {
  id: string
  name: string
  phone: string | null
  email: string | null
  specialty: string | null
  commission: number
  isActive: boolean
}

export interface AppointmentStats {
  total: number
  scheduled: number
  confirmed: number
  completed: number
  cancelled: number
}

export interface AppointmentFilters {
  status: string
  serviceType: string
  manicurist: string
  dateFrom: string
  dateTo: string
}

export interface CalendarDay {
  date: Date
  appointments: Appointment[]
  isToday: boolean
  isPast: boolean
}

export interface TimeSlot {
  time: string
  appointments: Appointment[]
  isAvailable: boolean
}
