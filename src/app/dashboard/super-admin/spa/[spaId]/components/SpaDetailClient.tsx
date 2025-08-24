'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableBadge,
  TableEmptyState,
} from '@/components/ui';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { UserModal } from './UserModal';
import { BranchModal } from './BranchModal';
import { UserRole } from '@/generated/prisma';
import Link from 'next/link';

interface SpaDetailClientProps {
  spa: {
    id: string;
    name: string;
    address: string | null;
    phone: string | null;
    email: string | null;
    openingTime: string | null;
    closingTime: string | null;
    isActive: boolean;
    branches: Array<{
      id: string;
      name: string;
      code: string;
      address: string;
      isMain: boolean;
      _count: {
        clients: number;
        manicurists: number;
        appointments: number;
      };
    }>;
    users: Array<{
      id: string;
      name: string | null;
      email: string;
      role: UserRole;
      branchId: string | null;
      isActive: boolean;
      createdAt: Date;
      branch: {
        name: string;
      } | null;
    }>;
    _count: {
      clients: number;
      manicurists: number;
      services: number;
      appointments: number;
      users: number;
    };
  };
}

const roleLabels: Record<UserRole, string> = {
  SUPER_ADMIN: 'Super Admin',
  SPA_ADMIN: 'Admin de Spa',
  BRANCH_ADMIN: 'Admin de Sede',
  MANICURIST: 'Manicurista',
  CLIENT: 'Cliente',
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
};

export function SpaDetailClient({ spa }: SpaDetailClientProps) {
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<
    (typeof spa.users)[0] | null
  >(null);
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<
    (typeof spa.branches)[0] | null
  >(null);

  const handleCreateUser = () => {
    setSelectedUser(null);
    setIsUserModalOpen(true);
  };

  const handleEditUser = (user: (typeof spa.users)[0]) => {
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  const handleCloseUserModal = () => {
    setIsUserModalOpen(false);
    setSelectedUser(null);
  };

  const handleCreateBranch = () => {
    setSelectedBranch(null);
    setIsBranchModalOpen(true);
  };

  const handleEditBranch = (branch: (typeof spa.branches)[0]) => {
    setSelectedBranch(branch);
    setIsBranchModalOpen(true);
  };

  const handleCloseBranchModal = () => {
    setIsBranchModalOpen(false);
    setSelectedBranch(null);
  };

  return (
    <div className="container mx-auto p-6">
      {/* Navigation and Status */}
      <div className="flex items-center justify-between mb-6">
        <Link href="/dashboard/super-admin">
          <Button variant="outline" size="sm">
            ← Volver al Dashboard
          </Button>
        </Link>
        <Badge
          variant={spa.isActive ? 'success' : 'destructive'}
          className="text-sm"
        >
          {spa.isActive ? 'Activo' : 'Inactivo'}
        </Badge>
      </div>

      {/* Spa Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Información del Spa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Dirección</p>
                <p className="font-medium">
                  {spa.address || 'No especificada'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Teléfono</p>
                <p className="font-medium">{spa.phone || 'No especificado'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{spa.email || 'No especificado'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Horario</p>
                <p className="font-medium">
                  {spa.openingTime && spa.closingTime
                    ? `${spa.openingTime} - ${spa.closingTime}`
                    : 'No especificado'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Estadísticas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Sedes</span>
                <span className="font-bold">{spa.branches.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Usuarios</span>
                <span className="font-bold">{spa._count.users}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Clientes</span>
                <span className="font-bold">{spa._count.clients}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Manicuristas</span>
                <span className="font-bold">{spa._count.manicurists}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Servicios</span>
                <span className="font-bold">{spa._count.services}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Citas</span>
                <span className="font-bold">{spa._count.appointments}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Branches Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Sedes ({spa.branches.length})
          </h2>
          <Button onClick={handleCreateBranch}>Crear Sede</Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <tr>
                  <TableHead>Sede</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Dirección</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Clientes</TableHead>
                  <TableHead>Manicuristas</TableHead>
                  <TableHead>Citas</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </tr>
              </TableHeader>
              <TableBody>
                {spa.branches.map((branch, index) => (
                  <TableRow key={branch.id} isAlternate={index % 2 !== 0}>
                    <TableCell>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {branch.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-900 dark:text-white">
                        {branch.code}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-900 dark:text-white">
                        {branch.address || 'No especificada'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <TableBadge variant={branch.isMain ? 'info' : 'default'}>
                        {branch.isMain ? 'Principal' : 'Secundaria'}
                      </TableBadge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-900 dark:text-white">
                      {branch._count.clients}
                    </TableCell>
                    <TableCell className="text-sm text-gray-900 dark:text-white">
                      {branch._count.manicurists}
                    </TableCell>
                    <TableCell className="text-sm text-gray-900 dark:text-white">
                      {branch._count.appointments}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditBranch(branch)}
                      >
                        Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {spa.branches.length === 0 && (
              <TableEmptyState
                title="No hay sedes registradas en este spa."
                action={
                  <Button onClick={handleCreateBranch}>
                    Crear Primera Sede
                  </Button>
                }
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Users Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Usuarios ({spa.users.length})
          </h2>
          <Button onClick={handleCreateUser}>Crear Usuario</Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <tr>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Sede</TableHead>
                  <TableHead>Registrado</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </tr>
              </TableHeader>
              <TableBody>
                {spa.users.map((user, index) => (
                  <TableRow key={user.id} isAlternate={index % 2 !== 0}>
                    <TableCell>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.name || 'Sin nombre'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-900 dark:text-white">
                        {user.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <TableBadge
                        variant={
                          user.role === 'SUPER_ADMIN'
                            ? 'info'
                            : user.role === 'SPA_ADMIN'
                              ? 'default'
                              : user.role === 'BRANCH_ADMIN'
                                ? 'success'
                                : user.role === 'MANICURIST'
                                  ? 'warning'
                                  : 'default'
                        }
                      >
                        {roleLabels[user.role]}
                      </TableBadge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-900 dark:text-white">
                      {user.branch?.name || 'Sin asignar'}
                    </TableCell>
                    <TableCell className="text-sm text-gray-900 dark:text-white">
                      {formatDate(user.createdAt)}
                    </TableCell>
                    <TableCell>
                      <TableBadge
                        variant={user.isActive ? 'success' : 'destructive'}
                      >
                        {user.isActive ? 'Activo' : 'Inactivo'}
                      </TableBadge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditUser(user)}
                      >
                        Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {spa.users.length === 0 && (
              <TableEmptyState
                title="No hay usuarios registrados en este spa."
                action={
                  <Button onClick={handleCreateUser}>
                    Crear Primer Usuario
                  </Button>
                }
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* User Modal */}
      <UserModal
        isOpen={isUserModalOpen}
        onClose={handleCloseUserModal}
        spaId={spa.id}
        branches={spa.branches}
        user={selectedUser || undefined}
      />

      {/* Branch Modal */}
      <BranchModal
        isOpen={isBranchModalOpen}
        onClose={handleCloseBranchModal}
        spaId={spa.id}
        branch={selectedBranch || undefined}
      />
    </div>
  );
}
