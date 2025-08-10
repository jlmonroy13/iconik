'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import type { Service } from '../types';
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

interface ServiceAnalyticsProps {
  services: Service[];
}

export function ServiceAnalytics({ services }: ServiceAnalyticsProps) {
  const serviceTypeStats = useMemo(() => {
    const stats = services.reduce(
      (acc, service) => {
        const type = service.type;
        if (!acc[type]) {
          acc[type] = { count: 0, revenue: 0 };
        }
        acc[type].count++;
        acc[type].revenue += service.price;
        return acc;
      },
      {} as Record<string, { count: number; revenue: number }>
    );

    const totalRevenue = services.reduce(
      (sum, service) => sum + service.price,
      0
    );

    return Object.entries(stats)
      .map(([type, data]) => ({
        type: type as Service['type'],
        count: data.count,
        revenue: data.revenue,
        percentage: totalRevenue > 0 ? (data.revenue / totalRevenue) * 100 : 0,
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [services]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getServiceTypeIcon = (serviceType: string) => {
    const iconProps = { className: 'w-5 h-5 text-gray-500' };
    const icons = {
      MANICURE: <Hand {...iconProps} />,
      PEDICURE: <Footprints {...iconProps} />,
      NAIL_ART: <Brush {...iconProps} />,
      GEL_POLISH: <Sparkles {...iconProps} />,
      ACRYLIC_NAILS: <Gem {...iconProps} />,
      NAIL_REPAIR: <Wrench {...iconProps} />,
      HAND_SPA: <SprayCan {...iconProps} />,
      FOOT_SPA: <Bath {...iconProps} />,
      OTHER: <Wand2 {...iconProps} />,
    };
    return icons[serviceType as keyof typeof icons] || <Wand2 {...iconProps} />;
  };

  const getServiceTypeName = (serviceType: string) => {
    return serviceType.replace('_', ' ');
  };

  const getServiceTypeColor = (serviceType: string) => {
    const colors = {
      MANICURE:
        'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-300',
      PEDICURE:
        'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      NAIL_ART:
        'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
      GEL_POLISH:
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
      ACRYLIC_NAILS:
        'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      NAIL_REPAIR:
        'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
      HAND_SPA:
        'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300',
      FOOT_SPA:
        'bg-teal-100 text-teal-800 dark:bg-teal-900/20 dark:text-teal-300',
      OTHER: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300',
    };
    return colors[serviceType as keyof typeof colors] || colors.OTHER;
  };

  return (
    <div className='space-y-6'>
      {/* Service Type Breakdown */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Service Type Chart */}
        <Card>
          <CardHeader>
            <CardTitle className='text-base sm:text-lg'>
              Distribución por Tipo de Servicio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {serviceTypeStats.map(stat => (
                <div
                  key={stat.type}
                  className='flex items-center justify-between'
                >
                  <div className='flex items-center gap-3'>
                    <div className='w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700'>
                      {getServiceTypeIcon(stat.type)}
                    </div>
                    <div>
                      <div className='font-medium text-sm text-gray-900 dark:text-white'>
                        {getServiceTypeName(stat.type)}
                      </div>
                      <div className='text-xs text-gray-500 dark:text-gray-400'>
                        {stat.count} servicios
                      </div>
                    </div>
                  </div>
                  <div className='text-right'>
                    <div className='font-medium text-sm text-gray-900 dark:text-white'>
                      {formatCurrency(stat.revenue)}
                    </div>
                    <div className='text-xs text-gray-500 dark:text-gray-400'>
                      {stat.percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Service Type Performance */}
        <Card>
          <CardHeader>
            <CardTitle className='text-base sm:text-lg'>
              Rendimiento por Servicio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {serviceTypeStats.slice(0, 5).map((stat, index) => (
                <div key={stat.type} className='flex items-center gap-3'>
                  <div className='flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 text-sm font-medium'>
                    {index + 1}
                  </div>
                  <div className='flex-1'>
                    <div className='flex items-center justify-between mb-1'>
                      <span className='text-sm font-medium text-gray-900 dark:text-white'>
                        {getServiceTypeName(stat.type)}
                      </span>
                      <span className='text-sm text-gray-500 dark:text-gray-400'>
                        {formatCurrency(stat.revenue)}
                      </span>
                    </div>
                    <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
                      <div
                        className={`h-2 rounded-full ${getServiceTypeColor(stat.type).split(' ')[0]}`}
                        style={{ width: `${stat.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Type Table */}
      <Card>
        <CardHeader>
          <CardTitle className='text-base sm:text-lg'>
            Detalle Completo de Servicios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b border-gray-200 dark:border-gray-700'>
                  <th className='text-left py-3 px-2 font-medium text-gray-900 dark:text-white'>
                    Tipo de Servicio
                  </th>
                  <th className='text-right py-3 px-2 font-medium text-gray-900 dark:text-white'>
                    Cantidad
                  </th>
                  <th className='text-right py-3 px-2 font-medium text-gray-900 dark:text-white'>
                    Ingresos
                  </th>
                  <th className='text-right py-3 px-2 font-medium text-gray-900 dark:text-white'>
                    Porcentaje
                  </th>
                </tr>
              </thead>
              <tbody>
                {serviceTypeStats.map(stat => (
                  <tr
                    key={stat.type}
                    className='border-b border-gray-100 dark:border-gray-800'
                  >
                    <td className='py-3 px-2'>
                      <div className='flex items-center gap-2'>
                        {getServiceTypeIcon(stat.type)}
                        <span className='text-gray-900 dark:text-white'>
                          {getServiceTypeName(stat.type)}
                        </span>
                      </div>
                    </td>
                    <td className='text-right py-3 px-2 text-gray-900 dark:text-white'>
                      {stat.count}
                    </td>
                    <td className='text-right py-3 px-2 font-medium text-gray-900 dark:text-white'>
                      {formatCurrency(stat.revenue)}
                    </td>
                    <td className='text-right py-3 px-2 text-gray-500 dark:text-gray-400'>
                      {stat.percentage.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
