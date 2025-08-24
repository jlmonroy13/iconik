import { notFound } from 'next/navigation';
import { requireSpaAccessForPage } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

interface SpaAdminPageProps {
  params: {
    spaId: string;
  };
}

export default async function SpaAdminDashboardPage({
  params,
}: SpaAdminPageProps) {
  const { spaId } = params;

  // Require SPA_ADMIN role and spa access with redirect
  const _user = await requireSpaAccessForPage(spaId);

  // Get spa with branches and stats
  const spa = await prisma.spa.findUnique({
    where: { id: spaId },
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
  });

  if (!spa) {
    notFound();
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Panel de Administrador - {spa.name}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Gestión de sedes y operaciones del spa
        </p>
      </div>

      {/* Spa Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sedes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{spa.branches.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Clientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{spa._count.clients}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Manicuristas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{spa._count.manicurists}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Citas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{spa._count.appointments}</div>
          </CardContent>
        </Card>
      </div>

      {/* Branches List */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Sedes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {spa.branches.map(branch => (
            <Card key={branch.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{branch.name}</span>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      branch.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {branch.isActive ? 'Activa' : 'Inactiva'}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Código:</span>
                    <span className="font-medium">{branch.code}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Clientes:</span>
                    <span className="font-medium">{branch._count.clients}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Manicuristas:</span>
                    <span className="font-medium">
                      {branch._count.manicurists}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Citas:</span>
                    <span className="font-medium">
                      {branch._count.appointments}
                    </span>
                  </div>
                  {branch.address && (
                    <div className="text-sm text-gray-600 mt-2">
                      <span className="font-medium">Dirección:</span>
                      <p className="mt-1">{branch.address}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {spa.branches.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">
                No hay sedes registradas para este spa.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Spa Information */}
      <Card>
        <CardHeader>
          <CardTitle>Información del Spa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-600">Nombre:</span>
              <p className="text-lg">{spa.name}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Estado:</span>
              <p className="text-lg">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    spa.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {spa.isActive ? 'Activo' : 'Inactivo'}
                </span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
