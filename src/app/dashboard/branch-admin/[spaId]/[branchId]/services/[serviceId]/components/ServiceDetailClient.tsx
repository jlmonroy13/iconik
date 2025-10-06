'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { ServiceImagePlaceholder } from '@/components/ui/ServiceImagePlaceholder';
import { SERVICE_TYPES } from '@/types/services';
import type { ServiceWithBranch } from '@/types/services';

interface ServiceDetailClientProps {
  service: ServiceWithBranch;
}

export function ServiceDetailClient({ service }: ServiceDetailClientProps) {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
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
      MANICURE_PEDICURE:
        'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      NAIL_ART:
        'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      NAIL_EXTENSIONS:
        'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
      NAIL_MAINTENANCE:
        'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      SPA_TREATMENTS:
        'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300',
    };
    return (
      colors[type as keyof typeof colors] ||
      'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    );
  };

  const handleEdit = () => {
    // Navigate to edit page or open modal
    router.push(
      `/dashboard/branch-admin/${service.spaId}/${service.branchId}/services?edit=${service.id}`
    );
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      const response = await fetch(
        `/api/spas/${service.spaId}/branches/${service.branchId}/services/${service.id}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar el servicio');
      }

      // Navigate back to services list
      router.push(
        `/dashboard/branch-admin/${service.spaId}/${service.branchId}/services`
      );
    } catch (error) {
      alert(
        error instanceof Error ? error.message : 'Error al eliminar el servicio'
      );
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center space-x-2"
          >
            <ArrowLeft size={16} />
            <span>Volver</span>
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {service.name}
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleEdit}
            className="flex items-center space-x-2"
          >
            <Edit size={16} />
            <span>Editar</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsDeleteDialogOpen(true)}
            className="flex items-center space-x-2 text-red-600 border-red-300 hover:bg-red-50"
          >
            <Trash2 size={16} />
            <span>Eliminar</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Service Image */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Imagen del Servicio</CardTitle>
            </CardHeader>
            <CardContent>
              {service.image ? (
                <div className="relative w-full h-64 rounded-lg overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              ) : (
                <ServiceImagePlaceholder size="lg" className="w-full h-64" />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Service Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Información Básica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tipo de Servicio
                  </label>
                  <Badge className={getServiceTypeColor(service.type)}>
                    {getServiceTypeLabel(service.type)}
                  </Badge>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Estado
                  </label>
                  <Badge
                    className={
                      service.isActive
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                    }
                  >
                    {service.isActive ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
              </div>

              {service.description && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Descripción
                  </label>
                  <p className="text-gray-600 dark:text-gray-400">
                    {service.description}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pricing Information */}
          <Card>
            <CardHeader>
              <CardTitle>Información de Precios</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Precio Base
                  </label>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(service.price)}
                  </p>
                </div>
              </div>

              {service.taxRate && service.taxRate > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Impuesto (IVA)
                  </label>
                  <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    {service.taxRate}%
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Service Details */}
          <Card>
            <CardHeader>
              <CardTitle>Detalles del Servicio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Duración
                  </label>
                  <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    {formatDuration(service.duration)}
                  </p>
                </div>
                {service.recommendedReturnDays && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Días de Retorno Recomendados
                    </label>
                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                      {service.recommendedReturnDays} días
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Información del Sistema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Sede
                  </label>
                  <p className="text-gray-600 dark:text-gray-400">
                    {service.branch?.name || 'No especificada'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Código de Sede
                  </label>
                  <p className="text-gray-600 dark:text-gray-400">
                    {service.branch?.code || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Fecha de Creación
                  </label>
                  <p className="text-gray-600 dark:text-gray-400">
                    {format(new Date(service.createdAt), 'PPP')}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Última Actualización
                  </label>
                  <p className="text-gray-600 dark:text-gray-400">
                    {format(new Date(service.updatedAt), 'PPP')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onCancel={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Eliminar Servicio"
        description={`¿Estás seguro de que quieres eliminar el servicio "${service.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        isLoading={isDeleting}
      />
    </div>
  );
}
