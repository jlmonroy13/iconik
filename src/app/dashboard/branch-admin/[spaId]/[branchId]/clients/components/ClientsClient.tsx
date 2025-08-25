'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { ClientModal } from '@/app/dashboard/branch-admin/[spaId]/[branchId]/clients/components/ClientModal';
import { ClientTable } from '@/app/dashboard/branch-admin/[spaId]/[branchId]/clients/components/ClientTable';
import { Pagination } from '@/app/dashboard/branch-admin/[spaId]/[branchId]/clients/components/Pagination';
import type {
  ClientWithAppointmentCount,
  BranchInfo,
  PaginationInfo,
  ClientSearchParams,
} from '@/types/clients';

interface ClientsClientProps {
  clients: ClientWithAppointmentCount[];
  branch: BranchInfo;
  spaId: string;
  branchId: string;
  pagination: PaginationInfo;
  searchParams: ClientSearchParams;
}

export function ClientsClient({
  clients,
  branch,
  spaId,
  branchId,
  pagination,
  searchParams,
}: ClientsClientProps) {
  const router = useRouter();
  const searchParamsHook = useSearchParams();

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] =
    useState<ClientWithAppointmentCount | null>(null);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState(searchParams.search || '');
  const [documentTypeFilter, setDocumentTypeFilter] = useState<string>('all');

  // Handle search
  const handleSearch = () => {
    const params = new URLSearchParams(searchParamsHook);
    if (searchTerm.trim()) {
      params.set('search', searchTerm.trim());
    } else {
      params.delete('search');
    }
    params.set('page', '1'); // Reset to first page when searching
    router.push(`?${params.toString()}`);
  };

  // Handle search on Enter key
  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Handle filter change
  const handleFilterChange = (value: string) => {
    setDocumentTypeFilter(value);
    // In a real implementation, you might want to add this to URL params
    // For now, we'll filter client-side
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParamsHook);
    params.set('page', page.toString());
    router.push(`?${params.toString()}`);
  };

  // Handle client actions
  const handleEditClient = (client: ClientWithAppointmentCount) => {
    setSelectedClient(client);
    setIsEditModalOpen(true);
  };

  const handleDeleteClient = (client: ClientWithAppointmentCount) => {
    setSelectedClient(client);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedClient) return;

    try {
      const response = await fetch(
        `/api/spas/${spaId}/branches/${branchId}/clients/${selectedClient.id}`,
        {
          method: 'DELETE',
        }
      );

      if (response.ok) {
        // Refresh the page to show updated data
        router.refresh();
        setIsDeleteDialogOpen(false);
        setSelectedClient(null);
      } else {
        // eslint-disable-next-line no-console
        console.error('Error deleting client');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error deleting client:', error);
    }
  };

  // Filter clients by document type (client-side filtering)
  const filteredClients =
    documentTypeFilter === 'all'
      ? clients
      : clients.filter(client => client.documentType === documentTypeFilter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Gestión de Clientes
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          {branch.spa.name} - {branch.name}
        </p>
      </div>

      {/* Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Clientes
                </p>
                <p className="text-2xl font-bold">{pagination.totalCount}</p>
              </div>
              <span className="text-2xl">👥</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Con Citas
                </p>
                <p className="text-2xl font-bold">
                  {clients.filter(c => c._count.appointments > 0).length}
                </p>
              </div>
              <span className="text-2xl">📅</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Con Email
                </p>
                <p className="text-2xl font-bold">
                  {clients.filter(c => c.email).length}
                </p>
              </div>
              <span className="text-2xl">📧</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Con Teléfono
                </p>
                <p className="text-2xl font-bold">
                  {clients.filter(c => c.phone).length}
                </p>
              </div>
              <span className="text-2xl">📞</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Buscar y Filtrar Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar por nombre, email, teléfono o documento..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                className="w-full"
              />
            </div>
            <div className="w-full sm:w-48">
              <Select
                value={documentTypeFilter}
                onChange={e => handleFilterChange(e.target.value)}
              >
                <option value="all">Todos los documentos</option>
                <option value="CC">Cédula de Ciudadanía</option>
                <option value="TI">Tarjeta de Identidad</option>
                <option value="CE">Cédula de Extranjería</option>
                <option value="PA">Pasaporte</option>
                <option value="NIT">NIT</option>
              </Select>
            </div>
            <Button onClick={handleSearch} className="w-full sm:w-auto">
              Buscar
            </Button>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
            >
              Nuevo Cliente
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Clients Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredClients.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👥</div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No se encontraron clientes
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm || documentTypeFilter !== 'all'
                  ? 'Intenta ajustar los filtros de búsqueda.'
                  : 'Aún no hay clientes registrados en esta sede.'}
              </p>
              {!searchTerm && documentTypeFilter === 'all' && (
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="mt-4 bg-green-600 hover:bg-green-700"
                >
                  Registrar Primer Cliente
                </Button>
              )}
            </div>
          ) : (
            <>
              <ClientTable
                clients={filteredClients}
                onEdit={handleEditClient}
                onDelete={handleDeleteClient}
              />

              {/* Pagination */}
              <Pagination
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <ClientModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        spaId={spaId}
        branchId={branchId}
        mode="create"
      />

      <ClientModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedClient(null);
        }}
        spaId={spaId}
        branchId={branchId}
        mode="edit"
        client={selectedClient}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onCancel={() => {
          setIsDeleteDialogOpen(false);
          setSelectedClient(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Eliminar Cliente"
        description={`¿Estás seguro de que quieres eliminar al cliente "${selectedClient?.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
    </div>
  );
}
