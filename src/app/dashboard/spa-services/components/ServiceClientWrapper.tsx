'use client';

import { useState, useMemo } from 'react';
import { ServiceFilters } from '../types';
import { filterServices } from '../utils';
import { ServiceFiltersPanel, ServiceItem, EmptyState, ServiceModal } from './';
import { FadeIn } from '@/components/ui';
import type { ServiceFormData } from '../schemas';
import type { Service } from '../types';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { createService, updateService, deleteService } from '../actions';

interface ServiceClientWrapperProps {
  services: Service[];
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  selectedService: Service | undefined;
  setSelectedService: (service: Service | undefined) => void;
}

export function ServiceClientWrapper({
  services,
  isModalOpen,
  setIsModalOpen,
  selectedService,
  setSelectedService,
}: ServiceClientWrapperProps) {
  const [filters, setFilters] = useState<ServiceFilters>({
    type: undefined,
    isActive: undefined,
    search: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  // Memoized calculations for performance
  const filteredServices = useMemo(
    () => filterServices(services, filters),
    [services, filters]
  );

  const clearFilters = () => {
    setFilters({ type: undefined, isActive: undefined, search: '' });
  };

  const handleEdit = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleCreateOrUpdate = async (data: ServiceFormData) => {
    setIsSubmitting(true);
    try {
      if (selectedService) {
        const result = await updateService(selectedService.id, data);
        if (result.success) {
          // Success - modal will be closed
          setIsModalOpen(false);
          setSelectedService(undefined);
        } else {
          // Error handling would go here
          console.error(result.message);
        }
      } else {
        const result = await createService(data);
        if (result.success) {
          // Success - modal will be closed
          setIsModalOpen(false);
        } else {
          // Error handling would go here
          console.error(result.message);
        }
      }
    } catch {
      // Error handling would go here
      console.error('Error processing service');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (service: Service) => {
    setServiceToDelete(service);
  };

  const confirmDelete = async () => {
    if (!serviceToDelete) return;
    setIsDeleteLoading(true);
    try {
      const result = await deleteService(serviceToDelete.id);
      if (result.success) {
        setServiceToDelete(null);
      } else {
        console.error(result.message);
      }
    } catch {
      console.error('Error deleting service');
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const cancelDelete = () => {
    setServiceToDelete(null);
  };

  return (
    <>
      {/* Filters */}
      {services.length > 0 && (
        <FadeIn delay={200}>
          <ServiceFiltersPanel
            filters={filters}
            onFiltersChange={setFilters}
            resultsCount={filteredServices.length}
          />
        </FadeIn>
      )}

      {/* Services List */}
      <div className='mt-6'>
        <FadeIn delay={300}>
          {services.length === 0 ? (
            <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm'>
              <EmptyState onClearFilters={clearFilters} />
            </div>
          ) : filteredServices.length > 0 ? (
            <div className='grid grid-cols-1 gap-4'>
              {filteredServices.map((service, index) => (
                <FadeIn key={service.id} delay={index * 100}>
                  <ServiceItem
                    service={service}
                    onEdit={() => handleEdit(service)}
                    onDelete={() => handleDelete(service)}
                  />
                </FadeIn>
              ))}
            </div>
          ) : (
            <EmptyState onClearFilters={clearFilters} />
          )}
        </FadeIn>
      </div>

      {/* Modal */}
      <ServiceModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedService(undefined);
        }}
        onSubmit={handleCreateOrUpdate}
        service={selectedService}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!serviceToDelete}
        title='Eliminar servicio'
        description={
          serviceToDelete
            ? `¿Estás seguro de que deseas eliminar el servicio "${serviceToDelete.name}"? Esta acción no se puede deshacer.`
            : ''
        }
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
        isLoading={isDeleteLoading}
        confirmText='Eliminar'
        cancelText='Cancelar'
      />
    </>
  );
}
