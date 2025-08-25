'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

type BranchWithSpaAndStats = {
  id: string;
  name: string;
  code: string;
  description: string | null;
  address: string;
  phone: string | null;
  email: string | null;
  openingTime: string | null;
  closingTime: string | null;
  isActive: boolean;
  isMain: boolean;
  invoicePrefix: string | null;
  spaId: string;
  createdAt: Date;
  updatedAt: Date;
  spa: {
    name: string;
    logoUrl: string | null;
  };
  _count: {
    clients: number;
    manicurists: number;
    services: number;
    appointments: number;
  };
};

interface DashboardOverviewProps {
  branch: BranchWithSpaAndStats;
  spaId: string;
  branchId: string;
}

export function DashboardOverview({
  branch,
  spaId,
  branchId,
}: DashboardOverviewProps) {
  const quickActions = [
    {
      title: 'Gestionar Clientes',
      description: 'Ver y administrar clientes',
      icon: '👥',
      href: `/dashboard/branch-admin/${spaId}/${branchId}/clients`,
      color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300',
    },
    {
      title: 'Gestionar Citas',
      description: 'Ver y programar citas',
      icon: '📅',
      href: `/dashboard/branch-admin/${spaId}/${branchId}/appointments`,
      color:
        'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300',
    },
    {
      title: 'Gestionar Manicuristas',
      description: 'Ver y administrar manicuristas',
      icon: '💅',
      href: `/dashboard/branch-admin/${spaId}/${branchId}/manicurists`,
      color:
        'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300',
    },
    {
      title: 'Gestionar Servicios',
      description: 'Ver y configurar servicios',
      icon: '🛠️',
      href: `/dashboard/branch-admin/${spaId}/${branchId}/services`,
      color:
        'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300',
    },
    {
      title: 'Gestionar Pagos',
      description: 'Ver historial de pagos',
      icon: '💰',
      href: `/dashboard/branch-admin/${spaId}/${branchId}/payments`,
      color:
        'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300',
    },
    {
      title: 'Configuración',
      description: 'Configuración de la sede',
      icon: '⚙️',
      href: `/dashboard/branch-admin/${spaId}/${branchId}/settings`,
      color: 'bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Panel de Administrador de Sede
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          {branch.spa.name} - {branch.name}
        </p>
      </div>

      {/* Branch Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Clientes
            </CardTitle>
            <span className="text-2xl">👥</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{branch._count.clients}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Clientes registrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Manicuristas
            </CardTitle>
            <span className="text-2xl">💅</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {branch._count.manicurists}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Manicuristas activas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Servicios
            </CardTitle>
            <span className="text-2xl">🛠️</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{branch._count.services}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Servicios disponibles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Citas</CardTitle>
            <span className="text-2xl">📅</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {branch._count.appointments}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Citas programadas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Branch Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Información de la Sede</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Nombre:
                </span>
                <p className="text-lg font-medium">{branch.name}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Código:
                </span>
                <p className="text-lg font-medium">{branch.code}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Estado:
                </span>
                <p className="text-lg">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      branch.isActive
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}
                  >
                    {branch.isActive ? 'Activa' : 'Inactiva'}
                  </span>
                </p>
              </div>
              {branch.address && (
                <div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Dirección:
                  </span>
                  <p className="text-lg">{branch.address}</p>
                </div>
              )}
              {branch.description && (
                <div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Descripción:
                  </span>
                  <p className="text-lg">{branch.description}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumen de Actividad</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="text-sm font-medium">
                  Clientes Registrados
                </span>
                <span className="text-lg font-bold">
                  {branch._count.clients}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="text-sm font-medium">
                  Manicuristas Activas
                </span>
                <span className="text-lg font-bold">
                  {branch._count.manicurists}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="text-sm font-medium">
                  Servicios Disponibles
                </span>
                <span className="text-lg font-bold">
                  {branch._count.services}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="text-sm font-medium">Citas Programadas</span>
                <span className="text-lg font-bold">
                  {branch._count.appointments}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          Acciones Rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map(action => (
            <Link key={action.title} href={action.href}>
              <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div
                    className={`text-3xl mb-3 ${action.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform`}
                  >
                    {action.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{action.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {action.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
