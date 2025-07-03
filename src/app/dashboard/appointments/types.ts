import type {
  Appointment,
  AppointmentWithDetails,
  AppointmentService,
  AppointmentServiceWithDetails,
  Client,
  Manicurist,
  AppointmentFormData,
  AppointmentFilters,
  AppointmentStats
} from '@/types'

// Re-export the main types from shared types
export type {
  Appointment,
  AppointmentWithDetails,
  AppointmentService,
  AppointmentServiceWithDetails,
  Client,
  Manicurist,
  AppointmentFormData,
  AppointmentFilters,
  AppointmentStats
}

// Calendar and time slot types
export interface CalendarDay {
  date: Date
  appointments: AppointmentWithDetails[]
  isToday: boolean
  isPast: boolean
}

export interface TimeSlot {
  time: string
  appointments: AppointmentWithDetails[]
  isAvailable: boolean
}
