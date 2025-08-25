import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

interface AppointmentsPageProps {
  params: {
    spaId: string;
    branchId: string;
  };
}

export default async function AppointmentsPage({}: AppointmentsPageProps) {
  // const { spaId, branchId } = params;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Gestión de Citas
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Programa y administra las citas de esta sede
        </p>
      </div>

      {/* Placeholder content */}
      <Card>
        <CardHeader>
          <CardTitle>Calendario de Citas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Gestión de Citas
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Aquí podrás programar y gestionar todas las citas de esta sede.
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              Funcionalidad en desarrollo...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
