'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { ServiceModal } from './ServiceModal';
import { ServiceTable } from './ServiceTable';
import { Pagination } from '@/components/ui';
import { SectionHeader } from '@/components/dashboard/SectionHeader';
import type {
  ServiceWithBranch,
  ServicePaginationInfo,
} from '@/types/services';
import { SERVICE_TYPES } from '@/types/services';
import type { CreateServiceData } from '@/types/forms';

interface ServicesClientProps {
  services: ServiceWithBranch[];
  pagination: ServicePaginationInfo;
  spaId: string;
  branchId: string;
}

export function ServicesClient({
  services,
  pagination,
  spaId,
  branchId,
}: ServicesClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] =
    useState<ServiceWithBranch | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] =
    useState<ServiceWithBranch | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get current search params
  const currentSearch = searchParams.get('search') || '';
  const currentType = searchParams.get('type') || '';
  const _currentPage = searchParams.get('page') || '1';

  // Check if we need to open modal in edit mode from URL params
  useEffect(() => {
    const editServiceId = searchParams.get('edit');
    if (editServiceId && services.length > 0) {
      const serviceToEdit = services.find(s => s.id === editServiceId);
      if (serviceToEdit) {
        setSelectedService(serviceToEdit);
        setIsModalOpen(true);
        // Clean up URL
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('edit');
        window.history.replaceState({}, '', newUrl.toString());
      }
    }
  }, [services, searchParams]);

  const handleSearch = (search: string) => {
    const params = new URLSearchParams(searchParams);
    if (search) {
      params.set('search', search);
    } else {
      params.delete('search');
    }
    params.set('page', '1'); // Reset to first page
    router.push(`?${params.toString()}`);
  };

  const handleTypeFilter = (type: string) => {
    const params = new URLSearchParams(searchParams);
    if (type) {
      params.set('type', type);
    } else {
      params.delete('type');
    }
    params.set('page', '1'); // Reset to first page
    router.push(`?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    router.push(`?${params.toString()}`);
  };

  const handleCreateService = () => {
    setSelectedService(null);
    setIsModalOpen(true);
  };

  const handleEditService = (service: ServiceWithBranch) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleDeleteService = (service: ServiceWithBranch) => {
    setServiceToDelete(service);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmitService = async (data: CreateServiceData) => {
    try {
      setIsLoading(true);

      const url = selectedService
        ? `/api/spas/${spaId}/branches/${branchId}/services/${selectedService.id}`
        : `/api/spas/${spaId}/branches/${branchId}/services`;

      const method = selectedService ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al guardar el servicio');
      }

      await response.json();

      // Refresh the page to show updated data
      router.refresh();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error saving service:', error);
      alert(
        error instanceof Error ? error.message : 'Error al guardar el servicio'
      );
      throw error; // Re-throw to prevent modal from closing
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!serviceToDelete) return;

    try {
      setIsLoading(true);

      const response = await fetch(
        `/api/spas/${spaId}/branches/${branchId}/services/${serviceToDelete.id}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar el servicio');
      }

      // Refresh the page to show updated data
      router.refresh();
      setIsDeleteDialogOpen(false);
      setServiceToDelete(null);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error deleting service:', error);
      alert(
        error instanceof Error ? error.message : 'Error al eliminar el servicio'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Calculate total value of services
  const totalValue = services.reduce((sum, service) => sum + service.price, 0);
  const activeServices = services.filter(service => service.isActive).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <SectionHeader
        title="Gestión de Servicios"
        description="Administra los servicios disponibles en esta sede"
        action={
          <Button onClick={handleCreateService} disabled={isLoading}>
            Crear Servicio
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Servicios
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {services.length}
                </p>
              </div>
              <div className="text-3xl">🛠️</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Servicios Activos
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {activeServices}
                </p>
              </div>
              <div className="text-3xl">✅</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Valor Total
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(totalValue)}
                </p>
              </div>
              <div className="text-3xl">💰</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Buscar
              </label>
              <Input
                placeholder="Buscar por nombre o descripción..."
                value={currentSearch}
                onChange={e => handleSearch(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tipo de Servicio
              </label>
              <Select
                value={currentType}
                onChange={e => handleTypeFilter(e.target.value)}
              >
                <option value="">Todos los tipos</option>
                {SERVICE_TYPES.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services Table */}
      <Card>
        <CardHeader>
          <CardTitle>Servicios</CardTitle>
        </CardHeader>
        <CardContent>
          <ServiceTable
            services={services}
            onEdit={handleEditService}
            onDelete={handleDeleteService}
            spaId={spaId}
            branchId={branchId}
          />
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            pagination={pagination}
            onPageChange={handlePageChange}
            itemName="servicios"
          />
        </div>
      )}

      {/* Service Modal */}
      <ServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitService}
        service={selectedService}
        isLoading={isLoading}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onCancel={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Eliminar Servicio"
        description={`¿Estás seguro de que quieres eliminar el servicio "${serviceToDelete?.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        isLoading={isLoading}
      />
    </div>
  );
}
