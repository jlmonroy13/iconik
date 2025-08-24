import { notFound } from 'next/navigation';
import { requireBranchAccess } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

interface ManicuristPageProps {
  params: {
    spaId: string;
    branchId: string;
  };
}

export default async function ManicuristDashboardPage({
  params,
}: ManicuristPageProps) {
  const { spaId, branchId } = params;

  // Require MANICURIST role and branch access
  const _user = await requireBranchAccess(spaId, branchId);

  // Get branch info
  const branch = await prisma.branch.findUnique({
    where: { id: branchId },
    select: { name: true },
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

  // Get today's appointments for this manicurist
  const today = new Date();
  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const endOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    23,
    59,
    59
  );

  const todaysAppointments = await prisma.appointment.findMany({
    where: {
      manicuristId: _user.id,
      scheduledAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    include: {
      client: {
        select: { name: true, email: true },
      },
      services: {
        include: {
          service: {
            select: { name: true, price: true },
          },
        },
      },
    },
    orderBy: {
      scheduledAt: 'asc',
    },
  });

  // Get upcoming appointments (next 7 days)
  const upcomingAppointments = await prisma.appointment.findMany({
    where: {
      manicuristId: _user.id,
      scheduledAt: {
        gte: endOfDay,
        lte: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
      },
    },
    include: {
      client: {
        select: { name: true, email: true },
      },
      services: {
        include: {
          service: {
            select: { name: true, price: true },
          },
        },
      },
    },
    orderBy: {
      scheduledAt: 'asc',
    },
    take: 5,
  });

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Panel de Manicurista
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          {spa.name} - {branch.name}
        </p>
      </div>

      {/* Today's Schedule */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Citas de Hoy
        </h2>
        {todaysAppointments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {todaysAppointments.map(appointment => (
              <Card
                key={appointment.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <CardTitle className="text-lg">
                    {appointment.client.name}
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    {new Date(appointment.scheduledAt).toLocaleTimeString(
                      'es-ES',
                      {
                        hour: '2-digit',
                        minute: '2-digit',
                      }
                    )}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {appointment.services.map(appointmentService => (
                      <div
                        key={appointmentService.id}
                        className="flex justify-between items-center"
                      >
                        <span className="text-sm">
                          {appointmentService.service.name}
                        </span>
                        <span className="text-sm font-medium">
                          ${appointmentService.service.price}
                        </span>
                      </div>
                    ))}
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total:</span>
                        <span className="font-bold">
                          $
                          {appointment.services
                            .reduce(
                              (total, service) => total + service.service.price,
                              0
                            )
                            .toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">
                No tienes citas programadas para hoy.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Upcoming Appointments */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Próximas Citas
        </h2>
        {upcomingAppointments.length > 0 ? (
          <div className="space-y-4">
            {upcomingAppointments.map(appointment => (
              <Card
                key={appointment.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">
                        {appointment.client.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {appointment.client.email}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {new Date(appointment.scheduledAt).toLocaleDateString(
                          'es-ES',
                          {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          }
                        )}{' '}
                        a las{' '}
                        {new Date(appointment.scheduledAt).toLocaleTimeString(
                          'es-ES',
                          {
                            hour: '2-digit',
                            minute: '2-digit',
                          }
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">
                        $
                        {appointment.services
                          .reduce(
                            (total, service) => total + service.service.price,
                            0
                          )
                          .toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {appointment.services.length} servicio
                        {appointment.services.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">
                No tienes citas programadas para los próximos días.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Acciones Rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="text-2xl mb-2">📅</div>
              <h3 className="font-semibold">Ver Calendario</h3>
              <p className="text-sm text-gray-600 mt-1">
                Ver todas las citas programadas
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="text-2xl mb-2">👥</div>
              <h3 className="font-semibold">Mis Clientes</h3>
              <p className="text-sm text-gray-600 mt-1">
                Ver historial de clientes
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="text-2xl mb-2">💰</div>
              <h3 className="font-semibold">Mis Ingresos</h3>
              <p className="text-sm text-gray-600 mt-1">
                Ver reportes de ingresos
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
