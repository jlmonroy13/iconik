import { notFound } from 'next/navigation';
import { requireBranchAccessForPage } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { BranchWithStats } from '@/types/prisma';

interface BranchAdminPageProps {
  params: {
    spaId: string;
    branchId: string;
  };
}

export default async function BranchAdminDashboardPage({
  params,
}: BranchAdminPageProps) {
  const { spaId, branchId } = params;

  // Require BRANCH_ADMIN role and branch access with redirect
  const _user = await requireBranchAccessForPage(spaId, branchId);

  // Get branch with stats
  const branch: BranchWithStats | null = await prisma.branch.findUnique({
    where: { id: branchId },
    include: {
      _count: {
        select: {
          clients: true,
          manicurists: true,
          services: true,
          appointments: true,
        },
      },
    },
  });

  if (!branch) {
    notFound();
  }

  // Get spa info
  const spa = await prisma.spa.findUnique({
    where: { id: spaId },
    select: { name: true },
  });

  if (!spa) {
    notFound();
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Panel de Administrador de Sede
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          {spa.name} - {branch.name}
        </p>
      </div>

      {/* Branch Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Clientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{branch._count.clients}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Manicuristas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {branch._count.manicurists}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Servicios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{branch._count.services}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Citas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {branch._count.appointments}
            </div>
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
                <span className="text-sm font-medium text-gray-600">
                  Nombre:
                </span>
                <p className="text-lg">{branch.name}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">
                  Código:
                </span>
                <p className="text-lg">{branch.code}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">
                  Estado:
                </span>
                <p className="text-lg">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      branch.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {branch.isActive ? 'Activa' : 'Inactiva'}
                  </span>
                </p>
              </div>
              {branch.address && (
                <div>
                  <span className="text-sm font-medium text-gray-600">
                    Dirección:
                  </span>
                  <p className="text-lg">{branch.address}</p>
                </div>
              )}
              {branch.description && (
                <div>
                  <span className="text-sm font-medium text-gray-600">
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
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">
                  Clientes Registrados
                </span>
                <span className="text-lg font-bold">
                  {branch._count.clients}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">
                  Manicuristas Activas
                </span>
                <span className="text-lg font-bold">
                  {branch._count.manicurists}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">
                  Servicios Disponibles
                </span>
                <span className="text-lg font-bold">
                  {branch._count.services}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
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
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Acciones Rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="text-2xl mb-2">👥</div>
              <h3 className="font-semibold">Gestionar Clientes</h3>
              <p className="text-sm text-gray-600 mt-1">
                Ver y administrar clientes
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="text-2xl mb-2">💅</div>
              <h3 className="font-semibold">Gestionar Manicuristas</h3>
              <p className="text-sm text-gray-600 mt-1">
                Ver y administrar manicuristas
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="text-2xl mb-2">📅</div>
              <h3 className="font-semibold">Gestionar Citas</h3>
              <p className="text-sm text-gray-600 mt-1">
                Ver y programar citas
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="text-2xl mb-2">💰</div>
              <h3 className="font-semibold">Gestionar Servicios</h3>
              <p className="text-sm text-gray-600 mt-1">
                Ver y configurar servicios
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
