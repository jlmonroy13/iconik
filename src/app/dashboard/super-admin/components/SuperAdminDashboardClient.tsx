'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { SpaModal } from './SpaModal';
import { AdminModal } from './AdminModal';
import { SpaWithStats } from '@/types/prisma';
import {
  StatsCards,
  SectionHeader,
  DataTable,
  TableColumn,
} from '@/components/dashboard';
import { calculateSuperAdminStats } from '@/lib/dashboard';
import Link from 'next/link';

// Use the actual Prisma types instead of custom ones
type UserWithSpa = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  spaId: string | null;
  isActive: boolean;
  spa: {
    name: string;
  } | null;
};

interface SuperAdminDashboardClientProps {
  spas: SpaWithStats[];
  admins: UserWithSpa[];
}

export function SuperAdminDashboardClient({
  spas,
  admins,
}: SuperAdminDashboardClientProps) {
  const [isSpaModalOpen, setIsSpaModalOpen] = useState(false);
  const [selectedSpa, setSelectedSpa] = useState<SpaWithStats | null>(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<UserWithSpa | null>(null);

  const handleCreateSpa = () => {
    setSelectedSpa(null);
    setIsSpaModalOpen(true);
  };

  const handleEditSpa = (spa: SpaWithStats) => {
    setSelectedSpa(spa);
    setIsSpaModalOpen(true);
  };

  const handleCloseSpaModal = () => {
    setIsSpaModalOpen(false);
    setSelectedSpa(null);
  };

  const handleCreateAdmin = () => {
    setSelectedAdmin(null);
    setIsAdminModalOpen(true);
  };

  const handleEditAdmin = (user: UserWithSpa) => {
    setSelectedAdmin(user);
    setIsAdminModalOpen(true);
  };

  const handleCloseAdminModal = () => {
    setIsAdminModalOpen(false);
    setSelectedAdmin(null);
  };

  // Define table columns for spas
  const spaColumns: TableColumn<SpaWithStats>[] = [
    {
      key: 'name',
      header: 'Spa',
      render: spa => (
        <div>
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {spa.name}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {spa.slug}
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Estado',
      render: spa => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            spa.isActive
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}
        >
          {spa.isActive ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
    {
      key: 'branches',
      header: 'Sedes',
      render: spa => (
        <div className="text-sm text-gray-900 dark:text-white">
          {spa.branches.length}
        </div>
      ),
    },
    {
      key: 'users',
      header: 'Usuarios',
      render: spa => (
        <div className="text-sm text-gray-900 dark:text-white">
          {spa._count.users}
        </div>
      ),
    },
    {
      key: 'clients',
      header: 'Clientes',
      render: spa => (
        <div className="text-sm text-gray-900 dark:text-white">
          {spa._count.clients}
        </div>
      ),
    },
    {
      key: 'appointments',
      header: 'Citas',
      render: spa => (
        <div className="text-sm text-gray-900 dark:text-white">
          {spa._count.appointments}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Acciones',
      className: 'text-right',
      render: spa => (
        <div className="flex justify-end space-x-2">
          <Link href={`/dashboard/super-admin/spa/${spa.id}`}>
            <Button variant="outline" size="sm">
              Ver Detalle
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEditSpa(spa)}
          >
            Editar
          </Button>
        </div>
      ),
    },
  ];

  // Define table columns for admins
  const adminColumns: TableColumn<UserWithSpa>[] = [
    {
      key: 'name',
      header: 'Administrador',
      render: admin => (
        <div className="text-sm font-medium text-gray-900 dark:text-white">
          {admin.name || 'Sin nombre'}
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      render: admin => (
        <div className="text-sm text-gray-900 dark:text-white">
          {admin.email}
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Rol',
      render: admin => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            admin.role === 'SUPER_ADMIN'
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
          }`}
        >
          {admin.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Spa Admin'}
        </span>
      ),
    },
    {
      key: 'spa',
      header: 'Spa Asignado',
      render: admin => (
        <div className="text-sm text-gray-900 dark:text-white">
          {admin.role === 'SPA_ADMIN'
            ? admin.spa?.name || 'Sin asignar'
            : 'N/A'}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Estado',
      render: admin => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            admin.isActive
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}
        >
          {admin.isActive ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Acciones',
      className: 'text-right',
      render: admin => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleEditAdmin(admin)}
        >
          Editar
        </Button>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-6">
      {/* Stats Cards */}
      <StatsCards stats={calculateSuperAdminStats(spas)} />

      {/* Spas Table */}
      <div className="mb-12">
        <SectionHeader
          title="Gestión de Spas"
          description="Administra todos los spas registrados"
          action={<Button onClick={handleCreateSpa}>Crear Spa</Button>}
        />

        <DataTable
          data={spas}
          columns={spaColumns}
          emptyStateTitle="No hay spas registrados en el sistema."
          emptyStateAction={
            <Button onClick={handleCreateSpa}>Crear Primer Spa</Button>
          }
        />
      </div>

      {/* Admins Table */}
      <div className="mb-12">
        <SectionHeader
          title="Administradores"
          description="Gestiona los administradores del sistema"
          action={
            <Button onClick={handleCreateAdmin}>Crear Administrador</Button>
          }
        />

        <DataTable
          data={admins}
          columns={adminColumns}
          emptyStateTitle="No hay administradores registrados."
          emptyStateAction={
            <Button onClick={handleCreateAdmin}>
              Crear Primer Administrador
            </Button>
          }
        />
      </div>

      {/* Spa Modal */}
      <SpaModal
        isOpen={isSpaModalOpen}
        onClose={handleCloseSpaModal}
        spa={selectedSpa || undefined}
      />

      {/* Admin Modal */}
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={handleCloseAdminModal}
        spas={spas.map(spa => ({ id: spa.id, name: spa.name, slug: spa.slug }))}
        user={
          selectedAdmin
            ? {
                id: selectedAdmin.id,
                name: selectedAdmin.name,
                email: selectedAdmin.email,
                role: selectedAdmin.role as 'SPA_ADMIN' | 'SUPER_ADMIN',
                spaId: selectedAdmin.spaId,
                isActive: selectedAdmin.isActive,
              }
            : undefined
        }
      />
    </div>
  );
}
