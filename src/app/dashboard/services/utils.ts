import { ServiceType, PaymentMethod, Service, ServiceFilters, ServiceStats } from './types'

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(amount)
}

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date)
}

export const getServiceTypeIcon = (type: ServiceType): string => {
  switch (type) {
    case 'MANICURE':
      return '💅'
    case 'PEDICURE':
      return '🦶'
    case 'NAIL_ART':
      return '🎨'
    case 'GEL_POLISH':
      return '✨'
    case 'ACRYLIC_NAILS':
      return '💎'
    default:
      return '💅'
  }
}

export const getServiceTypeName = (type: ServiceType): string => {
  switch (type) {
    case 'MANICURE':
      return 'Manicure'
    case 'PEDICURE':
      return 'Pedicure'
    case 'NAIL_ART':
      return 'Nail Art'
    case 'GEL_POLISH':
      return 'Esmalte en Gel'
    case 'ACRYLIC_NAILS':
      return 'Uñas Acrílicas'
    default:
      return String(type).replace('_', ' ')
  }
}

export const getPaymentMethodName = (method: PaymentMethod): string => {
  switch (method) {
    case 'CASH':
      return 'Efectivo'
    case 'CARD':
      return 'Tarjeta'
    case 'TRANSFER':
      return 'Transferencia'
    default:
      return method
  }
}

export const getRatingStars = (rating: number): string => {
  return '⭐'.repeat(rating) + '☆'.repeat(5 - rating)
}

export const getFilterInputStyle = (hasValue: boolean): string => {
  const baseStyle = "w-full px-3 py-2 text-sm border rounded-md transition-colors placeholder:text-white/60 dark:placeholder:text-white/50 [&::-webkit-calendar-picker-indicator]:opacity-60 [&::-webkit-calendar-picker-indicator]:dark:invert"
  if (hasValue) {
    return `${baseStyle} border-pink-300 dark:border-pink-600 bg-pink-50 dark:bg-pink-900/10 text-gray-900 dark:text-white ring-1 ring-pink-200 dark:ring-pink-800`
  }
  return `${baseStyle} border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-400`
}

export const filterServices = (services: Service[], filters: ServiceFilters): Service[] => {
  return services.filter(service => {
    // Filter by service type
    if (filters.serviceType && service.type !== filters.serviceType) {
      return false
    }

    // Filter by manicurist
    if (filters.manicurist && service.manicurist?.name !== filters.manicurist) {
      return false
    }

    // Filter by date range
    const serviceDate = new Date(service.createdAt)
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom)
      if (serviceDate < fromDate) return false
    }
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo)
      toDate.setHours(23, 59, 59) // End of day
      if (serviceDate > toDate) return false
    }

    return true
  })
}

export const calculateStats = (services: Service[]): ServiceStats => {
  const totalRevenue = services.reduce((sum, s) => sum + s.price, 0)
  const averageRating = services.length > 0
    ? services.reduce((sum, s) => sum + (s.rating || 0), 0) / services.length
    : 0

  const thisMonthServices = services.filter(s => {
    const serviceDate = new Date(s.createdAt)
    const now = new Date()
    return serviceDate.getMonth() === now.getMonth() &&
           serviceDate.getFullYear() === now.getFullYear()
  }).length

  return {
    totalServices: services.length,
    totalRevenue,
    averageRating,
    thisMonthServices
  }
}

export const getUniqueManicurists = (services: Service[]): string[] => {
  return Array.from(
    new Set(services.map(s => s.manicurist?.name).filter(Boolean))
  ) as string[]
}
