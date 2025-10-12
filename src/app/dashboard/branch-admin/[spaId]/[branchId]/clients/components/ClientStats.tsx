'use client';

import { Card, CardContent } from '@/components/ui';
import { Badge } from '@/components/ui/Badge';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import type { ClientDetailWithRelations } from '@/types/clients';

interface ClientStatsProps {
  client: ClientDetailWithRelations;
}

export function ClientStats({ client }: ClientStatsProps) {
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate days since last visit
  const getDaysSinceLastVisit = () => {
    if (!client.lastVisit) return null;
    const now = new Date();
    const lastVisit = new Date(client.lastVisit);
    const diffTime = Math.abs(now.getTime() - lastVisit.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysSinceLastVisit = getDaysSinceLastVisit();

  // Get client status based on last visit
  const getClientStatus = () => {
    if (!daysSinceLastVisit) return { label: 'Nuevo', color: 'bg-blue-500' };
    if (daysSinceLastVisit <= 30)
      return { label: 'Activo', color: 'bg-green-500' };
    if (daysSinceLastVisit <= 90)
      return { label: 'Regular', color: 'bg-yellow-500' };
    return { label: 'Inactivo', color: 'bg-red-500' };
  };

  const clientStatus = getClientStatus();

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Spent */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Gastado
                </p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                  {formatCurrency(client.totalSpent)}
                </p>
              </div>
              <div className="text-3xl">💰</div>
            </div>
          </CardContent>
        </Card>

        {/* Total Appointments */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Citas Totales
                </p>
                <p className="text-2xl font-bold mt-1">
                  {client._count.appointments}
                </p>
              </div>
              <div className="text-3xl">📅</div>
            </div>
          </CardContent>
        </Card>

        {/* Average Monthly Visits */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Visitas/Mes
                </p>
                <p className="text-2xl font-bold mt-1">
                  {client.averageMonthlyVisits.toFixed(1)}
                </p>
              </div>
              <div className="text-3xl">📊</div>
            </div>
          </CardContent>
        </Card>

        {/* Client Status */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Estado
                </p>
                <div className="mt-2">
                  <Badge
                    variant={
                      clientStatus.label === 'Activo'
                        ? 'success'
                        : clientStatus.label === 'Regular'
                          ? 'warning'
                          : clientStatus.label === 'Nuevo'
                            ? 'default'
                            : 'destructive'
                    }
                  >
                    {clientStatus.label}
                  </Badge>
                </div>
              </div>
              <div className="text-3xl">
                {clientStatus.label === 'Activo'
                  ? '✅'
                  : clientStatus.label === 'Regular'
                    ? '⚠️'
                    : clientStatus.label === 'Nuevo'
                      ? '🆕'
                      : '⏸️'}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Last Visit Info */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Última Visita</h3>
          {client.lastVisit ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Fecha:
                </span>
                <span className="font-medium">
                  {new Date(client.lastVisit).toLocaleDateString('es-CO', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Hace:
                </span>
                <span className="font-medium">
                  {formatDistanceToNow(new Date(client.lastVisit), {
                    locale: es,
                    addSuffix: true,
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Días:
                </span>
                <span className="font-medium">{daysSinceLastVisit} días</span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              Este cliente aún no tiene citas registradas
            </p>
          )}
        </CardContent>
      </Card>

      {/* Favorite Services */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Servicios Favoritos</h3>
          {client.favoriteServices.length > 0 ? (
            <div className="space-y-3">
              {client.favoriteServices.map((service, index) => (
                <div
                  key={service.serviceId}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 font-bold">
                      {index + 1}
                    </div>
                    <span className="font-medium">{service.serviceName}</span>
                  </div>
                  <Badge variant="secondary">
                    {service.count} {service.count === 1 ? 'vez' : 'veces'}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              Sin servicios registrados aún
            </p>
          )}
        </CardContent>
      </Card>

      {/* Average Ticket */}
      {client._count.appointments > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              Ticket Promedio por Cita
            </h3>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {formatCurrency(client.totalSpent / client._count.appointments)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Basado en {client._count.appointments}{' '}
                {client._count.appointments === 1 ? 'cita' : 'citas'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
