'use client';

import { format } from 'date-fns';

interface AppointmentSummaryProps {
  totalServices: number;
  totalPrice: number;
  totalDuration: number;
  calculatedDiscountAmount: number;
  finalPrice: number;
  isScheduled: boolean;
  scheduledAt: string;
}

export function AppointmentSummary({
  totalServices,
  totalPrice,
  totalDuration,
  calculatedDiscountAmount,
  finalPrice,
  isScheduled,
  scheduledAt,
}: AppointmentSummaryProps) {
  // Format duration: show hours and minutes if >= 60 minutes
  const formatDuration = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) {
      return `${hours}h`;
    }
    return `${hours}h ${mins}min`;
  };

  if (totalServices === 0) {
    return null;
  }

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 sticky top-4 h-fit">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
        Resumen
      </h3>
      <div className="space-y-4">
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Total de Servicios
          </p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {totalServices}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Precio Total
          </p>
          {calculatedDiscountAmount > 0 ? (
            <div className="space-y-1">
              <p className="text-lg font-semibold text-gray-500 dark:text-gray-400 line-through">
                ${totalPrice.toLocaleString()}
              </p>
              <div className="flex items-center gap-2">
                <p className="text-xl font-bold text-green-600 dark:text-green-400">
                  ${finalPrice.toLocaleString()}
                </p>
                <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                  -{calculatedDiscountAmount.toLocaleString()}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              ${totalPrice.toLocaleString()}
            </p>
          )}
        </div>
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Duración Total
          </p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {formatDuration(totalDuration)}
          </p>
        </div>
        {isScheduled && totalServices > 0 && (
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Hora Estimada de Fin
            </p>
            <p className="text-base font-bold text-gray-900 dark:text-white">
              {format(
                new Date(
                  new Date(scheduledAt).getTime() + totalDuration * 60000
                ),
                'h:mm a'
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
