import React from 'react';
import {
  Hand,
  Footprints,
  Brush,
  Sparkles,
  Gem,
  Wrench,
  SprayCan,
  Bath,
  Wand2,
} from 'lucide-react';

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(amount);
}

const statusConfig = {
  SCHEDULED: {
    label: 'Programada',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
  },
  CONFIRMED: {
    label: 'Confirmada',
    color:
      'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
  },
  IN_PROGRESS: {
    label: 'En Progreso',
    color:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
  },
  COMPLETED: {
    label: 'Completada',
    color:
      'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
  },
  CANCELLED: {
    label: 'Cancelada',
    color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
  },
  NO_SHOW: {
    label: 'No Asistió',
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300',
  },
};

export function getStatusBadge(status: string) {
  const config =
    statusConfig[status as keyof typeof statusConfig] || statusConfig.SCHEDULED;
  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
    >
      {config.label}
    </span>
  );
}

export function getServiceTypeIcon(serviceType: string, className = 'w-6 h-6') {
  const iconProps = {
    className: `${className} text-pink-600 dark:text-pink-400`,
  };

  switch (serviceType) {
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
      return <Wrench {...iconProps} />;
    case 'HAND_SPA':
      return <SprayCan {...iconProps} />;
    case 'FOOT_SPA':
      return <Bath {...iconProps} />;
    default:
      return <Wand2 {...iconProps} />;
  }
}
