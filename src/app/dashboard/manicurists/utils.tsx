import { Manicurist, ManicuristFilters, ManicuristStats, ServiceType } from './types'
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

export const getStatusBadgeVariant = (status: 'ACTIVE' | 'INACTIVE'): 'success' | 'secondary' => {
  return status === 'ACTIVE' ? 'success' : 'secondary'
}

export const getStatusText = (status: 'ACTIVE' | 'INACTIVE'): string => {
  return status === 'ACTIVE' ? 'Activo' : 'Inactivo'
}

export const filterManicurists = (manicurists: Manicurist[], filters: ManicuristFilters): Manicurist[] => {
  return manicurists.filter(manicurist => {
    // Filter by status
    if (filters.status && manicurist.status !== filters.status) {
      return false
    }

    // Filter by specialty
    if (filters.specialty && !manicurist.specialties.includes(filters.specialty)) {
      return false
    }

    // Filter by search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      return (
        manicurist.name.toLowerCase().includes(searchLower) ||
        manicurist.email.toLowerCase().includes(searchLower) ||
        manicurist.phone.includes(searchLower)
      )
    }

    return true
  })
}

export const calculateStats = (manicurists: Manicurist[]): ManicuristStats => {
  const activeManicurists = manicurists.filter(m => m.status === 'ACTIVE').length
  const totalRevenue = manicurists.reduce((sum, m) => sum + m.totalRevenue, 0)
  const averageRating = manicurists.length > 0
    ? manicurists.reduce((sum, m) => sum + m.rating, 0) / manicurists.length
    : 0
  const thisMonthServices = manicurists.reduce((sum, m) => sum + m.thisMonthServices, 0)
  const thisMonthRevenue = manicurists.reduce((sum, m) => sum + m.thisMonthRevenue, 0)

  return {
    totalManicurists: manicurists.length,
    activeManicurists,
    totalRevenue,
    averageRating,
    thisMonthServices,
    thisMonthRevenue
  }
}
