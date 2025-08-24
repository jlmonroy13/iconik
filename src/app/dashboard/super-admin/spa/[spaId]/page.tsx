import { requireRoleForPage } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { UserRole } from '@/generated/prisma';

export default async function SpaDetailPage({
  params,
}: {
  params: { spaId: string };
}) {
  // Require SUPER_ADMIN role with redirect
  const _user = await requireRoleForPage('SUPER_ADMIN');

  // Get spa with all related data
  const spa = await prisma.spa.findUnique({
    where: { id: params.spaId },
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
        orderBy: {
          name: 'asc',
        },
      },
      users: {
        include: {
          branch: {
            select: {
              name: true,
            },
          },
        },
        orderBy: [{ role: 'asc' }, { name: 'asc' }],
      },
      _count: {
        select: {
          clients: true,
          manicurists: true,
          services: true,
          appointments: true,
          users: true,
        },
      },
    },
  });

  if (!spa) {
    notFound();
  }

  const roleLabels: Record<UserRole, string> = {
    SUPER_ADMIN: 'Super Admin',
    SPA_ADMIN: 'Admin de Spa',
    BRANCH_ADMIN: 'Admin de Sede',
    MANICURIST: 'Manicurista',
    CLIENT: 'Cliente',
  };

  const roleColors: Record<UserRole, string> = {
    SUPER_ADMIN: 'bg-purple-100 text-purple-800',
    SPA_ADMIN: 'bg-blue-100 text-blue-800',
    BRANCH_ADMIN: 'bg-green-100 text-green-800',
    MANICURIST: 'bg-orange-100 text-orange-800',
    CLIENT: 'bg-gray-100 text-gray-800',
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date));
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/dashboard/super-admin">
            <Button variant="outline" size="sm">
              ← Volver al Dashboard
            </Button>
          </Link>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {spa.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Detalle completo del spa y gestión de recursos
            </p>
          </div>
          <Badge
            className={
              spa.isActive
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }
          >
            {spa.isActive ? 'Activo' : 'Inactivo'}
          </Badge>
        </div>
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
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Sedes ({spa.branches.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {spa.branches.map(branch => (
            <Card key={branch.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{branch.name}</span>
                  <Badge
                    className={
                      branch.isMain
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }
                  >
                    {branch.isMain ? 'Principal' : 'Secundaria'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Código</p>
                    <p className="font-medium">{branch.code}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Dirección</p>
                    <p className="font-medium">
                      {branch.address || 'No especificada'}
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Clientes:</span>
                      <span className="font-medium ml-1">
                        {branch._count.clients}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Manicuristas:</span>
                      <span className="font-medium ml-1">
                        {branch._count.manicurists}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Citas:</span>
                      <span className="font-medium ml-1">
                        {branch._count.appointments}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Users Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Usuarios ({spa.users.length})
        </h2>

        <div className="grid gap-4">
          {spa.users.map(user => (
            <Card key={user.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">
                        {user.name || 'Sin nombre'}
                      </h3>
                      <Badge className={roleColors[user.role]}>
                        {roleLabels[user.role]}
                      </Badge>
                      <Badge
                        className={
                          user.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }
                      >
                        {user.isActive ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </div>

                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        <strong>Email:</strong> {user.email}
                      </p>
                      <p>
                        <strong>Registrado:</strong>{' '}
                        {formatDate(user.createdAt)}
                      </p>
                      {user.branch && (
                        <p>
                          <strong>Sede:</strong> {user.branch.name}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Ver detalles
                    </Button>
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {spa.users.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">
                No hay usuarios registrados en este spa.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
