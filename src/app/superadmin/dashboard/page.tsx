import { auth } from '../../../../auth';
import { redirect } from 'next/navigation';
import SuperAdminDashboardClient from './SuperAdminDashboardClient';

export default async function SuperAdminDashboardPage() {
  const session = await auth();
  console.log(session);
  if (!session || !session.user?.isSuperAdmin) {
    redirect('/superadmin/login');
  }
  return <SuperAdminDashboardClient />;
}
