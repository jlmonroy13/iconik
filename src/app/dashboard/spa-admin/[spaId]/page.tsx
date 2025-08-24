import { notFound } from 'next/navigation';
import { requireSpaAccessForPage } from '@/lib/auth-utils';
import { SpaAdminDashboardClient } from './components/SpaAdminDashboardClient';
import { DashboardHeader } from '@/components/ui';
import {
  getSpaWithStats,
  getUsersByRole,
  getSpaCounts,
  getBranchCounts,
} from '@/lib/dashboard';

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
  const user = await requireSpaAccessForPage(spaId);

  // Get spa with branches and stats using reusable function
  const spa = await getSpaWithStats(spaId);

  if (!spa) {
    notFound();
  }

  // Get all branch admins and manicurists using reusable functions
  const [branchAdmins, manicurists] = await Promise.all([
    getUsersByRole(spaId, 'BRANCH_ADMIN'),
    getUsersByRole(spaId, 'MANICURIST'),
  ]);

  // Get counts for statistics using reusable function
  const { clientCount, manicuristCount, appointmentCount } =
    await getSpaCounts(spaId);

  // Get branch-specific counts using reusable function
  const branchesWithCorrectCounts = await getBranchCounts(spaId, spa.branches);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader
        user={user}
        title={`Dashboard ${spa.name}`}
        subtitle="Gestión de sedes y usuarios del spa"
      />
      <SpaAdminDashboardClient
        spa={{
          ...spa,
          branches: branchesWithCorrectCounts,
          _count: {
            ...spa._count,
            clients: clientCount,
            manicurists: manicuristCount,
            appointments: appointmentCount,
          },
        }}
        branchAdmins={branchAdmins}
        manicurists={manicurists}
      />
    </div>
  );
}
