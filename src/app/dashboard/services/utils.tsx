import { ServiceType, PaymentMethod, Service, ServiceFilters, ServiceStats, ServiceRecord } from './types'
import { Hand, Footprints, Brush, Sparkles, Gem } from 'lucide-react'
import React from 'react'

export const getServiceTypeIcon = (type: ServiceType): React.ReactElement => {
  const iconProps = { className: "w-4 h-4 text-pink-600 dark:text-pink-400" }
  switch (type) {
    case 'MANICURE':
      return <Hand {...iconProps} />
    case 'PEDICURE':
      return <Footprints {...iconProps} />
    case 'NAIL_ART':
      return <Brush {...iconProps} />
    case 'GEL_POLISH':
      return <Sparkles {...iconProps} />
    case 'ACRYLIC_NAILS':
      return <Gem {...iconProps} />
    default:
      return <Hand {...iconProps} />
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
  // Solo filtrar por categoría y estado para el catálogo
  return services.filter(service => {
    if (filters.serviceType && service.category !== filters.serviceType) {
      return false
    }
    if (filters.status && service.status !== filters.status) {
      return false
    }
    return true
  })
}

export const calculateStats = (services: Service[]) => {
  const total = services.length
  const active = services.filter(s => s.status === 'ACTIVE').length
  const inactive = services.filter(s => s.status === 'INACTIVE').length
  return { total, active, inactive }
}

export const getUniqueManicurists = (services: Service[]): string[] => {
  return Array.from(
    new Set(services.map(s => s.manicurist?.name).filter(Boolean))
  ) as string[]
}

export function getMostRequestedServiceName(history: ServiceRecord[], catalog: Service[]): string {
  if (!history || history.length === 0) return '-';
  const freq: Record<string, number> = {};
  for (const record of history) {
    freq[record.type] = (freq[record.type] || 0) + 1;
  }
  const mostType = Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0];
  if (!mostType) return '-';
  // Buscar nombre amigable en el catálogo
  const match = catalog.find(s => s.name.toUpperCase().includes(mostType.replace('_', '')) || s.name.toUpperCase().includes(mostType.replace('_', ' ')));
  return match ? match.name : mostType;
}
