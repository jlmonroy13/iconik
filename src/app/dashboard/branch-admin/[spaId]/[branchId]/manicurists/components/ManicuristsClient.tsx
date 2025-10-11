'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { SectionHeader } from '@/components/dashboard/SectionHeader';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { Pagination } from '@/components/ui/Pagination';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { ManicuristTable } from './ManicuristTable';
import { ManicuristModal } from './ManicuristModal';
import { ManicuristServicesModal } from './ManicuristServicesModal';
import { ManicuristScheduleModal } from './ManicuristScheduleModal';
import { ManicuristAvailabilityModal } from './ManicuristAvailabilityModal';
import { deleteManicurist } from '../actions';
import type {
  ManicuristWithCounts,
  ManicuristPaginationInfo,
  ManicuristSearchParams,
} from '@/types/manicurists';

interface ManicuristsClientProps {
  manicurists: ManicuristWithCounts[];
  pagination: ManicuristPaginationInfo;
  searchParams: ManicuristSearchParams;
  spaId: string;
  branchId: string;
  totalServicesCount: number;
  stats: {
    total: number;
    active: number;
    inactive: number;
    withServices: number;
  };
}

type ModalState =
  | { type: 'none' }
  | { type: 'create' }
  | { type: 'edit'; manicurist: ManicuristWithCounts }
  | { type: 'services'; manicurist: ManicuristWithCounts }
  | { type: 'schedule'; manicurist: ManicuristWithCounts }
  | { type: 'availability'; manicurist: ManicuristWithCounts }
  | { type: 'delete'; manicurist: ManicuristWithCounts };

export function ManicuristsClient({
  manicurists,
  pagination,
  searchParams,
  spaId,
  branchId,
  totalServicesCount,
  stats,
}: ManicuristsClientProps) {
  const router = useRouter();
  const [modalState, setModalState] = useState<ModalState>({ type: 'none' });
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Search and filter handlers
  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams as Record<string, string>);
    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }
    params.set('page', '1');
    router.push(`?${params.toString()}`);
  };

  const handleStatusFilter = (value: string) => {
    const params = new URLSearchParams(searchParams as Record<string, string>);
    if (value === 'all') {
      params.delete('status');
    } else {
      params.set('status', value);
    }
    params.set('page', '1');
    router.push(`?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams as Record<string, string>);
    params.set('page', page.toString());
    router.push(`?${params.toString()}`);
  };

  // Delete handler
  const handleDeleteConfirm = async () => {
    if (modalState.type !== 'delete') return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      const result = await deleteManicurist(
        modalState.manicurist.id,
        spaId,
        branchId
      );

      if (result.success) {
        router.refresh();
        setModalState({ type: 'none' });
      } else {
        setDeleteError(result.error || 'Error al eliminar manicurista');
      }
    } catch {
      setDeleteError('Error inesperado al eliminar');
    } finally {
      setIsDeleting(false);
    }
  };

  // Stats cards data
  const statsCards = [
    {
      title: 'Total Manicuristas',
      value: stats.total.toString(),
      description: 'Manicuristas registradas',
      bgColor: 'bg-blue-500',
    },
    {
      title: 'Activas',
      value: stats.active.toString(),
      description: 'Manicuristas activas',
      bgColor: 'bg-green-500',
    },
    {
      title: 'Inactivas',
      value: stats.inactive.toString(),
      description: 'Manicuristas inactivas',
      bgColor: 'bg-gray-500',
    },
    {
      title: 'Con Servicios',
      value: stats.withServices.toString(),
      description: 'Tienen al menos 1 servicio',
      bgColor: 'bg-purple-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <SectionHeader
        title="Manicuristas"
        description="Gestiona las manicuristas de tu sede"
        action={
          <Button
            onClick={() => setModalState({ type: 'create' })}
            className="bg-green-600 hover:bg-green-700"
          >
            + Nueva Manicurista
          </Button>
        }
      />

      {/* Stats */}
      <StatsCards stats={statsCards} />

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
                placeholder="Buscar por nombre, teléfono o email..."
                defaultValue={searchParams.search || ''}
                onChange={e => handleSearch(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Estado
              </label>
              <Select
                value={searchParams.status || 'all'}
                onChange={e => handleStatusFilter(e.target.value)}
              >
                <option value="all">Todas las manicuristas</option>
                <option value="active">Solo activas</option>
                <option value="inactive">Solo inactivas</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table or Empty State */}
      {manicurists.length > 0 ? (
        <>
          <ManicuristTable
            manicurists={manicurists}
            totalServicesCount={totalServicesCount}
            onEdit={manicurist => setModalState({ type: 'edit', manicurist })}
            onDelete={manicurist =>
              setModalState({ type: 'delete', manicurist })
            }
            onManageServices={manicurist =>
              setModalState({ type: 'services', manicurist })
            }
            onManageSchedule={manicurist =>
              setModalState({ type: 'schedule', manicurist })
            }
            onManageAvailability={manicurist =>
              setModalState({ type: 'availability', manicurist })
            }
          />

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <Pagination
              pagination={pagination}
              onPageChange={handlePageChange}
              itemName="manicuristas"
            />
          )}
        </>
      ) : (
        <EmptyState
          title="No hay manicuristas"
          description={
            searchParams.search
              ? 'No se encontraron manicuristas con los criterios de búsqueda.'
              : 'Aún no has agregado ninguna manicurista. Crea una para comenzar.'
          }
          action={
            <Button
              onClick={() => setModalState({ type: 'create' })}
              className="bg-green-600 hover:bg-green-700"
            >
              Nueva Manicurista
            </Button>
          }
        />
      )}

      {/* Modals */}
      <ManicuristModal
        isOpen={modalState.type === 'create' || modalState.type === 'edit'}
        onClose={() => setModalState({ type: 'none' })}
        spaId={spaId}
        branchId={branchId}
        mode={modalState.type === 'create' ? 'create' : 'edit'}
        manicurist={modalState.type === 'edit' ? modalState.manicurist : null}
      />

      {modalState.type === 'services' && (
        <ManicuristServicesModal
          isOpen={true}
          onClose={() => setModalState({ type: 'none' })}
          manicuristId={modalState.manicurist.id}
          manicuristName={modalState.manicurist.name}
          spaId={spaId}
          branchId={branchId}
        />
      )}

      {modalState.type === 'schedule' && (
        <ManicuristScheduleModal
          isOpen={true}
          onClose={() => setModalState({ type: 'none' })}
          manicuristId={modalState.manicurist.id}
          manicuristName={modalState.manicurist.name}
          spaId={spaId}
          branchId={branchId}
        />
      )}

      {modalState.type === 'availability' && (
        <ManicuristAvailabilityModal
          isOpen={true}
          onClose={() => setModalState({ type: 'none' })}
          manicuristId={modalState.manicurist.id}
          manicuristName={modalState.manicurist.name}
          spaId={spaId}
          branchId={branchId}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={modalState.type === 'delete'}
        onCancel={() => setModalState({ type: 'none' })}
        onConfirm={handleDeleteConfirm}
        title="Eliminar Manicurista"
        description={
          modalState.type === 'delete'
            ? `¿Estás seguro de eliminar a ${modalState.manicurist.name}? Esta acción no se puede deshacer y eliminará todos sus horarios y servicios asignados.`
            : ''
        }
        confirmText="Eliminar"
        cancelText="Cancelar"
        isLoading={isDeleting}
      />

      {deleteError && (
        <div className="fixed bottom-4 right-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded shadow-lg">
          {deleteError}
        </div>
      )}
    </div>
  );
}
