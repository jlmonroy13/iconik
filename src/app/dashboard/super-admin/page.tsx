import { requireRoleForPage } from '@/lib/auth-utils';
import { SuperAdminDashboardClient } from './components/SuperAdminDashboardClient';
import { DashboardHeader } from '@/components/ui';
import { getAllSpasWithStats, getAdmins } from '@/lib/dashboard';

export default async function SuperAdminDashboardPage() {
  // Require SUPER_ADMIN role with redirect
  const user = await requireRoleForPage('SUPER_ADMIN');

  // Get all spas with stats using reusable function
  const spas = await getAllSpasWithStats();

  // Get all admin users using reusable function
  const allUsers = await getAdmins();

  // Filter to ensure only admin roles and cast to Admin type
  const admins = allUsers.filter(
    user => user.role === 'SPA_ADMIN' || user.role === 'SUPER_ADMIN'
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader
        user={user}
        title="Dashboard Super Admin"
        subtitle="Gestión de todos los spas del sistema"
      />
      <SuperAdminDashboardClient spas={spas} admins={admins} />
    </div>
  );
}
