'use client';
import { useState, useCallback, useEffect } from 'react';
import { ManicuristFilters } from './ManicuristFilters';
import { ManicuristCard } from './ManicuristCard';
import { ManicuristModal } from './ManicuristModal';
import { PageTransition } from '@/components/ui/PageTransition';
import type {
  Manicurist,
  ManicuristFilters as ManicuristFiltersType,
} from '../types';
import type { ManicuristFormData } from '../schemas';
import {
  createManicurist,
  updateManicurist,
  deleteManicurist,
  getServicesForManicuristForm,
  getManicuristServices,
} from '../actions';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import type { Service } from '@/types';

// Extend ManicuristFormData to include selectedServices
type ExtendedManicuristFormData = ManicuristFormData & {
  selectedServices?: string[];
};

interface ManicuristClientWrapperProps {
  manicurists: Manicurist[];
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  selectedManicurist: Manicurist | undefined;
  setSelectedManicurist: (manicurist: Manicurist | undefined) => void;
}

export function ManicuristClientWrapper({
  manicurists,
  isModalOpen,
  setIsModalOpen,
  selectedManicurist,
  setSelectedManicurist,
}: ManicuristClientWrapperProps) {
  const [filters, setFilters] = useState<ManicuristFiltersType>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [manicuristToDelete, setManicuristToDelete] =
    useState<Manicurist | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  // Cargar servicios al abrir el modal
  useEffect(() => {
    if (isModalOpen) {
      getServicesForManicuristForm().then(res => {
        if (res.success && res.data) setServices(res.data);
        else setServices([]);
      });
      if (selectedManicurist) {
        getManicuristServices(selectedManicurist.id).then(res => {
          if (res.success && res.data) setSelectedServices(res.data);
          else setSelectedServices([]);
        });
      } else {
        setSelectedServices([]);
      }
    }
  }, [isModalOpen, selectedManicurist]);

  const handleEdit = useCallback(
    (manicurist: Manicurist) => {
      setSelectedManicurist(manicurist);
      setIsModalOpen(true);
    },
    [setSelectedManicurist, setIsModalOpen]
  );

  const handleDelete = useCallback((manicurist: Manicurist) => {
    setManicuristToDelete(manicurist);
  }, []);

  const handleCreateOrUpdate = async (data: ExtendedManicuristFormData) => {
    setIsSubmitting(true);
    try {
      if (selectedManicurist) {
        const result = await updateManicurist(selectedManicurist.id, data);
        if (!result.success) {
          throw new Error(result.message);
        }
      } else {
        const result = await createManicurist(data);
        if (!result.success) {
          throw new Error(result.message);
        }
      }
      setIsModalOpen(false);
      setSelectedManicurist(undefined);
    } catch (error) {
      console.error('Error creating/updating manicurist:', error);
      // TODO: Add proper error handling/toast notification
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!manicuristToDelete) return;
    setIsDeleteLoading(true);
    try {
      const result = await deleteManicurist(manicuristToDelete.id);
      if (!result.success) {
        throw new Error(result.message);
      }
      setManicuristToDelete(null);
    } catch (error) {
      console.error('Error deleting manicurist:', error);
      // TODO: Add proper error handling/toast notification
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const cancelDelete = () => {
    setManicuristToDelete(null);
  };

  // Aquí podrías agregar lógica de filtrado si lo deseas
  const filteredManicurists = manicurists.filter(manicurist => {
    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const nameMatch = manicurist.name.toLowerCase().includes(searchTerm);
      const emailMatch =
        manicurist.email?.toLowerCase().includes(searchTerm) || false;
      const phoneMatch =
        manicurist.phone?.toLowerCase().includes(searchTerm) || false;

      if (!nameMatch && !emailMatch && !phoneMatch) {
        return false;
      }
    }

    // Filter by active status
    if (filters.isActive !== undefined) {
      if (manicurist.isActive !== filters.isActive) {
        return false;
      }
    }

    return true;
  });

  return (
    <PageTransition className='h-full'>
      <ManicuristFilters
        filters={filters}
        onFiltersChange={setFilters}
        resultsCount={filteredManicurists.length}
      />
      <div className='mt-6'>
        {filteredManicurists.length === 0 ? (
          <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center'>
            <p className='text-gray-500 dark:text-gray-400'>
              No hay manicuristas registradas.
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-1 gap-4'>
            {filteredManicurists.map(manicurist => (
              <ManicuristCard
                key={manicurist.id}
                manicurist={manicurist}
                onEdit={() => handleEdit(manicurist)}
                onDelete={() => handleDelete(manicurist)}
              />
            ))}
          </div>
        )}
      </div>
      <ManicuristModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedManicurist(undefined);
        }}
        onSubmit={handleCreateOrUpdate}
        manicurist={selectedManicurist}
        isSubmitting={isSubmitting}
        services={services}
        selectedServices={selectedServices}
        setSelectedServices={setSelectedServices}
      />
      <ConfirmDialog
        open={!!manicuristToDelete}
        title='Eliminar manicurista'
        description={
          manicuristToDelete
            ? `¿Estás seguro de que deseas eliminar a ${manicuristToDelete.name}? Esta acción no se puede deshacer.`
            : ''
        }
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
        isLoading={isDeleteLoading}
        confirmText='Eliminar'
        cancelText='Cancelar'
      />
    </PageTransition>
  );
}
