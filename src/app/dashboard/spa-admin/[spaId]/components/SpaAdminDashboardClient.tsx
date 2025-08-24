'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { BranchModal } from '../components/BranchModal';
import { UserModal } from '../components/UserModal';
import { SpaWithStats } from '@/types/prisma';
import {
  StatsCards,
  SectionHeader,
  DataTable,
  TableColumn,
} from '@/components/dashboard';
import { calculateSpaStats } from '@/lib/dashboard';
import Link from 'next/link';

// Use the actual Prisma types instead of custom ones
type UserWithBranch = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  branchId: string | null;
  isActive: boolean;
  branch: {
    name: string;
    code: string;
  } | null;
};

type BranchWithCounts = {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  address: string;
  phone?: string | null;
  email?: string | null;
  openingTime?: string | null;
  closingTime?: string | null;
  isActive: boolean;
  isMain: boolean;
  invoicePrefix?: string | null;
  _count: {
    clients: number;
    manicurists: number;
    appointments: number;
  };
};

interface SpaAdminDashboardClientProps {
  spa: SpaWithStats;
  branchAdmins: UserWithBranch[];
  manicurists: UserWithBranch[];
}

export function SpaAdminDashboardClient({
  spa,
  branchAdmins,
  manicurists,
}: SpaAdminDashboardClientProps) {
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<{
    id: string;
    name: string;
    code: string;
    description?: string | null;
    address: string;
    phone?: string | null;
    email?: string | null;
    openingTime?: string | null;
    closingTime?: string | null;
    isActive: boolean;
    isMain: boolean;
    invoicePrefix?: string | null;
  } | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithBranch | null>(null);
  const [userType, setUserType] = useState<'BRANCH_ADMIN' | 'MANICURIST'>(
    'BRANCH_ADMIN'
  );

  const handleCreateBranch = () => {
    setSelectedBranch(null);
    setIsBranchModalOpen(true);
  };

  const handleEditBranch = (branch: {
    id: string;
    name: string;
    code: string;
    description?: string | null;
    address: string;
    phone?: string | null;
    email?: string | null;
    openingTime?: string | null;
    closingTime?: string | null;
    isActive: boolean;
    isMain: boolean;
    invoicePrefix?: string | null;
  }) => {
    setSelectedBranch(branch);
    setIsBranchModalOpen(true);
  };

  const handleCloseBranchModal = () => {
    setIsBranchModalOpen(false);
    setSelectedBranch(null);
  };

  const handleCreateUser = (type: 'BRANCH_ADMIN' | 'MANICURIST') => {
    setSelectedUser(null);
    setUserType(type);
    setIsUserModalOpen(true);
  };

  const handleEditUser = (user: UserWithBranch) => {
    setSelectedUser(user);
    setUserType(user.role as 'BRANCH_ADMIN' | 'MANICURIST');
    setIsUserModalOpen(true);
  };

  const handleCloseUserModal = () => {
    setIsUserModalOpen(false);
    setSelectedUser(null);
  };

  // Define table columns for branches
  const branchColumns: TableColumn<BranchWithCounts>[] = [
    {
      key: 'name',
      header: 'Sede',
      render: branch => (
        <div>
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {branch.name}
          </div>
          {branch.address && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {branch.address}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'code',
      header: 'Código',
      render: branch => (
        <div className="text-sm text-gray-900 dark:text-white">
          {branch.code}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Estado',
      render: branch => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            branch.isActive
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}
        >
          {branch.isActive ? 'Activa' : 'Inactiva'}
        </span>
      ),
    },
    {
      key: 'clients',
      header: 'Clientes',
      render: branch => (
        <div className="text-sm text-gray-900 dark:text-white">
          {branch._count.clients}
        </div>
      ),
    },
    {
      key: 'manicurists',
      header: 'Manicuristas',
      render: branch => (
        <div className="text-sm text-gray-900 dark:text-white">
          {branch._count.manicurists}
        </div>
      ),
    },
    {
      key: 'appointments',
      header: 'Citas',
      render: branch => (
        <div className="text-sm text-gray-900 dark:text-white">
          {branch._count.appointments}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Acciones',
      className: 'text-right',
      render: branch => (
        <div className="flex justify-end space-x-2">
          <Link href={`/dashboard/branch-admin/${spa.id}/${branch.id}`}>
            <Button variant="outline" size="sm">
              Ver Detalle
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEditBranch(branch)}
          >
            Editar
          </Button>
        </div>
      ),
    },
  ];

  // Define table columns for users
  const userColumns: TableColumn<UserWithBranch>[] = [
    {
      key: 'name',
      header: 'Nombre',
      render: user => (
        <div className="text-sm font-medium text-gray-900 dark:text-white">
          {user.name || 'Sin nombre'}
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      render: user => (
        <div className="text-sm text-gray-900 dark:text-white">
          {user.email}
        </div>
      ),
    },
    {
      key: 'branch',
      header: 'Sede Asignada',
      render: user => (
        <div className="text-sm text-gray-900 dark:text-white">
          {user.branch?.name || 'Sin asignar'}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Estado',
      render: user => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            user.isActive
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}
        >
          {user.isActive ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Acciones',
      className: 'text-right',
      render: user => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleEditUser(user)}
        >
          Editar
        </Button>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-6">
      {/* Stats Cards */}
      <StatsCards stats={calculateSpaStats(spa)} />

      {/* Branches Table */}
      <div className="mb-12">
        <SectionHeader
          title="Gestión de Sedes"
          description="Administra las sedes del spa"
          action={<Button onClick={handleCreateBranch}>Crear Sede</Button>}
        />

        <DataTable
          data={spa.branches}
          columns={branchColumns}
          emptyStateTitle="No hay sedes registradas para este spa."
          emptyStateAction={
            <Button onClick={handleCreateBranch}>Crear Primera Sede</Button>
          }
        />
      </div>

      {/* Branch Admins Table */}
      <div className="mb-12">
        <SectionHeader
          title="Administradores de Sede"
          description="Gestiona los administradores de cada sede"
          action={
            <Button onClick={() => handleCreateUser('BRANCH_ADMIN')}>
              Crear Administrador
            </Button>
          }
        />

        <DataTable
          data={branchAdmins}
          columns={userColumns}
          emptyStateTitle="No hay administradores de sede registrados."
          emptyStateAction={
            <Button onClick={() => handleCreateUser('BRANCH_ADMIN')}>
              Crear Primer Administrador
            </Button>
          }
        />
      </div>

      {/* Manicurists Table */}
      <div className="mb-12">
        <SectionHeader
          title="Manicuristas"
          description="Gestiona los manicuristas del spa"
          action={
            <Button onClick={() => handleCreateUser('MANICURIST')}>
              Crear Manicurista
            </Button>
          }
        />

        <DataTable
          data={manicurists}
          columns={userColumns}
          emptyStateTitle="No hay manicuristas registrados."
          emptyStateAction={
            <Button onClick={() => handleCreateUser('MANICURIST')}>
              Crear Primer Manicurista
            </Button>
          }
        />
      </div>

      {/* Branch Modal */}
      <BranchModal
        isOpen={isBranchModalOpen}
        onClose={handleCloseBranchModal}
        spaId={spa.id}
        branch={selectedBranch || undefined}
      />

      {/* User Modal */}
      <UserModal
        isOpen={isUserModalOpen}
        onClose={handleCloseUserModal}
        spaId={spa.id}
        branches={spa.branches.map(branch => ({
          id: branch.id,
          name: branch.name,
          code: branch.code,
        }))}
        user={
          selectedUser
            ? {
                id: selectedUser.id,
                name: selectedUser.name,
                email: selectedUser.email,
                role: selectedUser.role as 'BRANCH_ADMIN' | 'MANICURIST',
                branchId: selectedUser.branchId,
                isActive: selectedUser.isActive,
              }
            : undefined
        }
        userType={userType}
      />
    </div>
  );
}
