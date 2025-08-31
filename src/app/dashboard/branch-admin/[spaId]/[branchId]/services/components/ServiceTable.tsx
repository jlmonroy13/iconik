'use client';

import { format } from 'date-fns';
import { Pencil, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { IconButton } from '@/components/ui/IconButton';
import type { ServiceWithBranch } from '@/types/services';
import { SERVICE_TYPES } from '@/types/services';

interface ServiceTableProps {
  services: ServiceWithBranch[];
  onEdit: (service: ServiceWithBranch) => void;
  onDelete: (service: ServiceWithBranch) => void;
}

export function ServiceTable({
  services,
  onEdit,
  onDelete,
}: ServiceTableProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}min` : ''}`.trim();
    }
    return `${mins}min`;
  };

  const getServiceTypeLabel = (type: string) => {
    const serviceType = SERVICE_TYPES.find(t => t.value === type);
    return serviceType?.label || type;
  };

  const getServiceTypeColor = (type: string) => {
    const colors = {
      MANICURE: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      PEDICURE:
        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      GEL_POLISH:
        'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      ACRYLIC_NAILS:
        'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
      NAIL_REPAIR:
        'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      NAIL_ART:
        'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
      HAND_SPA: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300',
      FOOT_SPA: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
      OTHER: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    };
    return colors[type as keyof typeof colors] || colors.OTHER;
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Servicio</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead>Duración</TableHead>
            <TableHead>Retorno</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Registrado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map(service => (
            <TableRow key={service.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{service.name}</div>
                  {service.description && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                      {service.description}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getServiceTypeColor(service.type)}>
                  {getServiceTypeLabel(service.type)}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium">
                    {formatCurrency(service.price)}
                  </div>
                  {service.kitCost && service.kitCost > 0 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Kit: {formatCurrency(service.kitCost)}
                    </div>
                  )}
                  {service.taxRate && service.taxRate > 0 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      IVA: {service.taxRate}%
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm">
                  {formatDuration(service.duration)}
                </span>
              </TableCell>
              <TableCell>
                {service.recommendedReturnDays ? (
                  <span className="text-sm">
                    {service.recommendedReturnDays} días
                  </span>
                ) : (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    -
                  </span>
                )}
              </TableCell>
              <TableCell>
                <Badge variant={service.isActive ? 'default' : 'secondary'}>
                  {service.isActive ? 'Activo' : 'Inactivo'}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="text-sm">
                  {format(new Date(service.createdAt), 'dd/MM/yyyy')}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <IconButton
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(service)}
                    icon={<Pencil className="w-4 h-4" />}
                    title="Editar servicio"
                  />
                  <IconButton
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(service)}
                    icon={<Trash2 className="w-4 h-4" />}
                    title="Eliminar servicio"
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {services.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🛠️</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No hay servicios
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Comienza creando tu primer servicio para esta sede.
          </p>
        </div>
      )}
    </div>
  );
}
