'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Badge } from '@/components/ui/Badge';
import { ClientStats } from './ClientStats';
import { ClientAppointmentHistory } from './ClientAppointmentHistory';
import { ClientNotesSection } from './ClientNotesSection';
import type { ClientDetailWithRelations } from '@/types/clients';
import { fetchClientDetails } from '../actions';

interface ClientDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string | null;
  spaId: string;
  branchId: string;
  currentUserId: string;
  onEdit: () => void;
  onCreateAppointment?: () => void;
}

type TabType = 'info' | 'stats' | 'history' | 'notes';

export function ClientDetailModal({
  isOpen,
  onClose,
  clientId,
  spaId,
  branchId,
  currentUserId,
  onEdit,
  onCreateAppointment,
}: ClientDetailModalProps) {
  const [client, setClient] = useState<ClientDetailWithRelations | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('info');

  useEffect(() => {
    if (isOpen && clientId) {
      loadClientDetails();
    } else {
      // Reset state when modal closes
      setClient(null);
      setActiveTab('info');
      setError(null);
    }
  }, [isOpen, clientId]);

  const loadClientDetails = async () => {
    if (!clientId) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchClientDetails(clientId);

      if (result.success && result.data) {
        setClient(result.data);
      } else {
        setError(result.error || 'Error al cargar los detalles del cliente');
      }
    } catch (err) {
      console.error('Error loading client details:', err);
      setError('Error inesperado al cargar los detalles del cliente');
    } finally {
      setIsLoading(false);
    }
  };

  // Format document type
  const getDocumentTypeLabel = (type: string) => {
    const documentTypes: Record<string, string> = {
      CC: 'Cédula de Ciudadanía',
      TI: 'Tarjeta de Identidad',
      CE: 'Cédula de Extranjería',
      PA: 'Pasaporte',
      NIT: 'NIT',
    };
    return documentTypes[type] || type;
  };

  // Format date
  const formatDate = (date: Date | null) => {
    if (!date) return 'No registrado';
    return new Date(date).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        client ? `Detalle del Cliente: ${client.name}` : 'Detalle del Cliente'
      }
      size="xl"
    >
      <div className="space-y-6">
        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Spinner size="lg" />
            <p className="text-gray-600 dark:text-gray-400 mt-4">
              Cargando información del cliente...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            <Button
              onClick={loadClientDetails}
              variant="outline"
              size="sm"
              className="mt-3"
            >
              Reintentar
            </Button>
          </div>
        )}

        {/* Client Details */}
        {client && !isLoading && (
          <>
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pb-4 border-b">
              <Button onClick={onEdit} variant="outline" size="sm">
                ✏️ Editar Cliente
              </Button>
              {onCreateAppointment && (
                <Button
                  onClick={onCreateAppointment}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  📅 Nueva Cita
                </Button>
              )}
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex space-x-8" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab('info')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'info'
                      ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  📋 Información
                </button>
                <button
                  onClick={() => setActiveTab('stats')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'stats'
                      ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  📊 Estadísticas
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'history'
                      ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  📅 Historial de Citas
                  {client.appointments.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {client.appointments.length}
                    </Badge>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'notes'
                      ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  📝 Notas
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="py-4">
              {/* Info Tab */}
              {activeTab === 'info' && (
                <div className="space-y-6">
                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        Información Personal
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm text-gray-600 dark:text-gray-400">
                            Nombre Completo
                          </label>
                          <p className="font-medium mt-1">{client.name}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600 dark:text-gray-400">
                            Tipo de Documento
                          </label>
                          <p className="font-medium mt-1">
                            {getDocumentTypeLabel(client.documentType)}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600 dark:text-gray-400">
                            Número de Documento
                          </label>
                          <p className="font-medium font-mono mt-1">
                            {client.documentNumber}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600 dark:text-gray-400">
                            Fecha de Nacimiento
                          </label>
                          <p className="font-medium mt-1">
                            {formatDate(client.birthday)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">Contacto</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm text-gray-600 dark:text-gray-400">
                            Teléfono
                          </label>
                          <p className="font-medium mt-1">
                            {client.phone || 'No registrado'}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600 dark:text-gray-400">
                            Email
                          </label>
                          <p className="font-medium mt-1">
                            {client.email || 'No registrado'}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600 dark:text-gray-400">
                            Registrado
                          </label>
                          <p className="font-medium mt-1">
                            {formatDate(client.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {client.notes && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Notas</h3>
                      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                          {client.notes}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Stats Tab */}
              {activeTab === 'stats' && <ClientStats client={client} />}

              {/* History Tab */}
              {activeTab === 'history' && (
                <ClientAppointmentHistory appointments={client.appointments} />
              )}

              {/* Notes Tab */}
              {activeTab === 'notes' && (
                <ClientNotesSection
                  clientId={client.id}
                  spaId={spaId}
                  branchId={branchId}
                  currentUserId={currentUserId}
                />
              )}
            </div>
          </>
        )}

        {/* Footer */}
        <div className="flex justify-end pt-4 border-t">
          <Button onClick={onClose} variant="outline">
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
