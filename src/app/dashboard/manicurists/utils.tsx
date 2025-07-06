import { ServiceType } from '@/generated/prisma'
import type { Manicurist, ManicuristFilters } from './types'
import { Hand, Footprints, Brush, Sparkles, Gem } from 'lucide-react'
import React from 'react'

export const getServiceTypeIcon = (type: ServiceType): React.ReactElement => {
  const iconProps = { className: "w-3 h-3" }
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
    case 'NAIL_REPAIR':
      return <Hand {...iconProps} />
    case 'HAND_SPA':
      return <Hand {...iconProps} />
    case 'FOOT_SPA':
      return <Footprints {...iconProps} />
    case 'OTHER':
      return <Sparkles {...iconProps} />
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
    case 'NAIL_REPAIR':
      return 'Reparación de Uñas'
    case 'HAND_SPA':
      return 'Spa de Manos'
    case 'FOOT_SPA':
      return 'Spa de Pies'
    case 'OTHER':
      return 'Otro'
    default:
      return String(type).replace('_', ' ')
  }
}

export const getStatusBadgeVariant = (isActive: boolean): 'success' | 'secondary' => {
  return isActive ? 'success' : 'secondary'
}

export const getStatusText = (isActive: boolean): string => {
  return isActive ? 'Activo' : 'Inactivo'
}

export const filterManicurists = (manicurists: Manicurist[], filters: ManicuristFilters): Manicurist[] => {
  return manicurists.filter(manicurist => {
    // Filter by active status
    if (filters.isActive !== undefined && manicurist.isActive !== filters.isActive) {
      return false
    }

    // Filter by search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      return (
        manicurist.name.toLowerCase().includes(searchLower) ||
        manicurist.email?.toLowerCase().includes(searchLower) ||
        manicurist.phone?.includes(searchLower)
      )
    }

    return true
  })
}

// Summary stats for the manicurists page
export interface ManicuristSummaryStats {
  totalManicurists: number
  activeManicurists: number
  totalRevenue: number
  averageRating: number
  thisMonthServices: number
  thisMonthRevenue: number
}

export const calculateSummaryStats = (manicurists: Manicurist[]): ManicuristSummaryStats => {
  const activeManicurists = manicurists.filter(m => m.isActive).length
  const totalManicurists = manicurists.length

  return {
    totalManicurists,
    activeManicurists,
    totalRevenue: 0, // Will be calculated from payments
    averageRating: 0, // Will be calculated from feedback
    thisMonthServices: 0, // Will be calculated from appointment services
    thisMonthRevenue: 0 // Will be calculated from payments
  }
}

// Export calculateStats as an alias for calculateSummaryStats for backward compatibility
export const calculateStats = calculateSummaryStats
