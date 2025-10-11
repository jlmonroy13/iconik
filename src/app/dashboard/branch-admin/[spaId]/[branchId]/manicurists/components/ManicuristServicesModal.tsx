'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { fetchServicesGrouped } from '../../services/actions';
import { fetchManicuristById } from '../actions';
import { updateManicuristServices } from '../actions';
import type { ServiceType } from '@/generated/prisma';

interface ManicuristServicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  manicuristId: string;
  manicuristName: string;
  spaId: string;
  branchId: string;
}

const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  MANICURE_PEDICURE: 'Manicure y Pedicure',
  NAIL_ART: 'Nail Art y Diseño',
  NAIL_EXTENSIONS: 'Extensiones y Esculpidas',
  NAIL_MAINTENANCE: 'Mantenimiento y Retiros',
  SPA_TREATMENTS: 'Tratamientos Spa',
};

export function ManicuristServicesModal({
  isOpen,
  onClose,
  manicuristId,
  manicuristName,
  spaId,
  branchId,
}: ManicuristServicesModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [servicesGrouped, setServicesGrouped] = useState<
    Record<ServiceType, Array<{ id: string; name: string; price: number }>>
  >(
    {} as Record<
      ServiceType,
      Array<{ id: string; name: string; price: number }>
    >
  );
  const [selectedServiceIds, setSelectedServiceIds] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, manicuristId]);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [services, manicurist] = await Promise.all([
        fetchServicesGrouped(spaId, branchId),
        fetchManicuristById(manicuristId),
      ]);

      setServicesGrouped(services);

      // Set currently assigned services
      const assignedIds = new Set(
        manicurist?.manicuristServices.map(ms => ms.serviceId) || []
      );
      setSelectedServiceIds(assignedIds);
    } catch (err) {
      setError('Error al cargar servicios');
      console.error('Error loading services:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleService = (serviceId: string) => {
    setSelectedServiceIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(serviceId)) {
        newSet.delete(serviceId);
      } else {
        newSet.add(serviceId);
      }
      return newSet;
    });
  };

  const handleToggleAll = (checked: boolean) => {
    if (checked) {
      const allServiceIds = Object.values(servicesGrouped)
        .flat()
        .map(s => s.id);
      setSelectedServiceIds(new Set(allServiceIds));
    } else {
      setSelectedServiceIds(new Set());
    }
  };

  const handleSave = async () => {
    setSubmitting(true);
    setError(null);

    try {
      const result = await updateManicuristServices(
        manicuristId,
        spaId,
        branchId,
        { serviceIds: Array.from(selectedServiceIds) }
      );

      if (result.success) {
        router.refresh();
        onClose();
      } else {
        setError(result.error || 'Error al actualizar servicios');
      }
    } catch (err) {
      setError('Error inesperado al guardar');
      console.error('Error saving services:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedCount = selectedServiceIds.size;
  const totalCount = Object.values(servicesGrouped).flat().length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Servicios de ${manicuristName}`}
      size="lg"
    >
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded">
          {error}
        </div>
      ) : (
        <div className="space-y-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Selecciona los servicios que esta manicurista puede realizar:
          </p>

          {/* Select All / Deselect All */}
          <div className="flex items-center justify-between border-b pb-4">
            <span className="font-medium">
              Seleccionados: {selectedCount} de {totalCount} servicios
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleToggleAll(selectedCount === 0)}
            >
              {selectedCount === 0
                ? 'Seleccionar Todos'
                : 'Deseleccionar Todos'}
            </Button>
          </div>

          {/* Services by Type */}
          <div className="space-y-6 max-h-[60vh] overflow-y-auto">
            {(
              Object.entries(servicesGrouped) as [
                ServiceType,
                (typeof servicesGrouped)[ServiceType],
              ][]
            ).map(([type, services]) => (
              <div key={type} className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 dark:bg-gray-800 px-4 py-2 font-medium">
                  {SERVICE_TYPE_LABELS[type]}
                </div>
                <div className="p-4 space-y-2">
                  {services.map(service => (
                    <label
                      key={service.id}
                      className="flex items-start gap-3 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedServiceIds.has(service.id)}
                        onChange={() => handleToggleService(service.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{service.name}</div>
                        <div className="text-sm text-gray-500">
                          ${service.price.toLocaleString('es-CO')}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={submitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {submitting ? 'Guardando...' : `Guardar (${selectedCount})`}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
