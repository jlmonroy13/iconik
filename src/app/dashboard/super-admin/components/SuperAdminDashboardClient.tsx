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
import { Button } from '@/components/ui/Button';
import { SpaModal } from './SpaModal';
import { AdminModal } from './AdminModal';
import { SpaWithStats } from '@/types/prisma';
import Link from 'next/link';

type Admin = {
  id: string;
  name: string | null;
  email: string;
  role: 'SPA_ADMIN' | 'SUPER_ADMIN';
  spaId: string | null;
  isActive: boolean;
  spa: {
    name: string;
  } | null;
};

interface SuperAdminDashboardClientProps {
  spas: SpaWithStats[];
  admins: Admin[];
}

export function SuperAdminDashboardClient({
  spas,
  admins,
}: SuperAdminDashboardClientProps) {
  const [isSpaModalOpen, setIsSpaModalOpen] = useState(false);
  const [selectedSpa, setSelectedSpa] = useState<SpaWithStats | null>(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);

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

  const handleEditAdmin = (user: Admin) => {
    setSelectedAdmin(user);
    setIsAdminModalOpen(true);
  };

  const handleCloseAdminModal = () => {
    setIsAdminModalOpen(false);
    setSelectedAdmin(null);
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard Super Admin
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Gestión de todos los spas del sistema
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{spas.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Usuarios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {spas.reduce((total, spa) => total + spa._count.users, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Clientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {spas.reduce((total, spa) => total + spa._count.clients, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Citas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {spas.reduce((total, spa) => total + spa._count.appointments, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Spas Table */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Gestión de Spas
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Administra todos los spas registrados
            </p>
          </div>
          <Button onClick={handleCreateSpa}>Crear Spa</Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <tr>
                  <TableHead>Spa</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Sedes</TableHead>
                  <TableHead>Usuarios</TableHead>
                  <TableHead>Clientes</TableHead>
                  <TableHead>Citas</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </tr>
              </TableHeader>
              <TableBody>
                {spas.map((spa, index) => (
                  <TableRow key={spa.id} isAlternate={index % 2 !== 0}>
                    <TableCell>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {spa.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {spa.slug}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <TableBadge
                        variant={spa.isActive ? 'success' : 'destructive'}
                      >
                        {spa.isActive ? 'Activo' : 'Inactivo'}
                      </TableBadge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-900 dark:text-white">
                      {spa.branches.length}
                    </TableCell>
                    <TableCell className="text-sm text-gray-900 dark:text-white">
                      {spa._count.users}
                    </TableCell>
                    <TableCell className="text-sm text-gray-900 dark:text-white">
                      {spa._count.clients}
                    </TableCell>
                    <TableCell className="text-sm text-gray-900 dark:text-white">
                      {spa._count.appointments}
                    </TableCell>
                    <TableCell className="text-right">
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {spas.length === 0 && (
              <TableEmptyState
                title="No hay spas registrados en el sistema."
                action={
                  <Button onClick={handleCreateSpa}>Crear Primer Spa</Button>
                }
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Admins Table */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Administradores
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Gestiona los administradores del sistema
            </p>
          </div>
          <Button onClick={handleCreateAdmin}>Crear Administrador</Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <tr>
                  <TableHead>Administrador</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Spa Asignado</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </tr>
              </TableHeader>
              <TableBody>
                {admins.map((user, index) => (
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
                          user.role === 'SUPER_ADMIN' ? 'info' : 'default'
                        }
                      >
                        {user.role === 'SUPER_ADMIN'
                          ? 'Super Admin'
                          : 'Spa Admin'}
                      </TableBadge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-900 dark:text-white">
                      {user.role === 'SPA_ADMIN'
                        ? user.spa?.name || 'Sin asignar'
                        : 'N/A'}
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
                        onClick={() => handleEditAdmin(user)}
                      >
                        Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {admins.length === 0 && (
              <TableEmptyState
                title="No hay administradores registrados."
                action={
                  <Button onClick={handleCreateAdmin}>
                    Crear Primer Administrador
                  </Button>
                }
              />
            )}
          </CardContent>
        </Card>
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
        user={selectedAdmin || undefined}
      />
    </div>
  );
}
