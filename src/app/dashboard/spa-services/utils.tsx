import { ServiceType } from '@/generated/prisma';
import type { Service, ServiceFilters, ServiceStats } from './types';
import { Hand, Footprints, Brush, Sparkles, Gem } from 'lucide-react';
import React from 'react';

export const getServiceTypeIcon = (type: ServiceType): React.ReactElement => {
  const iconProps = { className: 'w-4 h-4 text-pink-600 dark:text-pink-400' };
  switch (type) {
    case 'MANICURE':
      return <Hand {...iconProps} />;
    case 'PEDICURE':
      return <Footprints {...iconProps} />;
    case 'NAIL_ART':
      return <Brush {...iconProps} />;
    case 'GEL_POLISH':
      return <Sparkles {...iconProps} />;
    case 'ACRYLIC_NAILS':
      return <Gem {...iconProps} />;
    case 'NAIL_REPAIR':
      return <Hand {...iconProps} />;
    case 'HAND_SPA':
      return <Hand {...iconProps} />;
    case 'FOOT_SPA':
      return <Footprints {...iconProps} />;
    case 'OTHER':
      return <Sparkles {...iconProps} />;
    default:
      return <Hand {...iconProps} />;
  }
};

export const getServiceTypeName = (type: ServiceType): string => {
  switch (type) {
    case 'MANICURE':
      return 'Manicure';
    case 'PEDICURE':
      return 'Pedicure';
    case 'NAIL_ART':
      return 'Nail Art';
    case 'GEL_POLISH':
      return 'Esmalte en Gel';
    case 'ACRYLIC_NAILS':
      return 'Uñas Acrílicas';
    case 'NAIL_REPAIR':
      return 'Reparación de Uñas';
    case 'HAND_SPA':
      return 'Spa de Manos';
    case 'FOOT_SPA':
      return 'Spa de Pies';
    case 'OTHER':
      return 'Otro';
    default:
      return String(type).replace('_', ' ');
  }
};

export const getRatingStars = (rating: number): string => {
  return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
};

export const getFilterInputStyle = (hasValue: boolean): string => {
  const baseStyle =
    'w-full px-3 py-2 text-sm border rounded-md transition-colors placeholder:text-white/60 dark:placeholder:text-white/50 [&::-webkit-calendar-picker-indicator]:opacity-60 [&::-webkit-calendar-picker-indicator]:dark:invert';
  if (hasValue) {
    return `${baseStyle} border-pink-300 dark:border-pink-600 bg-pink-50 dark:bg-pink-900/10 text-gray-900 dark:text-white ring-1 ring-pink-200 dark:ring-pink-800`;
  }
  return `${baseStyle} border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-400`;
};

export const filterServices = (
  services: Service[],
  filters: ServiceFilters
): Service[] => {
  return services.filter(service => {
    // Filter by type
    if (filters.type && service.type !== filters.type) {
      return false;
    }
    // Filter by active status
    if (
      filters.isActive !== undefined &&
      service.isActive !== filters.isActive
    ) {
      return false;
    }
    // Filter by search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        service.name.toLowerCase().includes(searchLower) ||
        service.description?.toLowerCase().includes(searchLower) ||
        getServiceTypeName(service.type).toLowerCase().includes(searchLower)
      );
    }
    return true;
  });
};

export const calculateStats = (services: Service[]): ServiceStats => {
  const total = services.length;
  const active = services.filter(s => s.isActive).length;
  const inactive = services.filter(s => !s.isActive).length;
  const totalRevenue = services.reduce((sum, s) => sum + s.price, 0);

  // Find most requested service (for now, just return the first active service)
  const mostRequestedServiceName =
    services.find(s => s.isActive)?.name || 'N/A';

  return {
    total,
    active,
    inactive,
    mostRequestedServiceName,
    totalRevenue,
  };
};
