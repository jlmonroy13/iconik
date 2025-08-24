import { requireRoleForPage } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { SpaWithStats } from '@/types/prisma';

export default async function SuperAdminDashboardPage() {
  // Require SUPER_ADMIN role with redirect
  const _user = await requireRoleForPage('SUPER_ADMIN');

  // Get all spas with stats
  const spas: SpaWithStats[] = await prisma.spa.findMany({
    include: {
      branches: {
        include: {
          _count: {
            select: {
              clients: true,
              manicurists: true,
              appointments: true,
            },
          },
        },
      },
      _count: {
        select: {
          clients: true,
          manicurists: true,
          services: true,
          appointments: true,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  });

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Panel de Super Administrador
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Gestión global de todos los spas del sistema
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
            <CardTitle className="text-sm font-medium">Total Sedes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {spas.reduce((total, spa) => total + spa.branches.length, 0)}
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

      {/* Spas List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {spas.map(spa => (
          <Card key={spa.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{spa.name}</span>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    spa.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {spa.isActive ? 'Activo' : 'Inactivo'}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sedes:</span>
                  <span className="font-medium">{spa.branches.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Clientes:</span>
                  <span className="font-medium">{spa._count.clients}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Manicuristas:</span>
                  <span className="font-medium">{spa._count.manicurists}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Servicios:</span>
                  <span className="font-medium">{spa._count.services}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Citas:</span>
                  <span className="font-medium">{spa._count.appointments}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {spas.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">
              No hay spas registrados en el sistema.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
