import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth-utils';
import {
  isSuperAdmin,
  isSpaAdmin,
  isBranchAdmin,
  isManicurist,
} from '@/types/auth';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  // Redirect based on user role
  if (isSuperAdmin(user)) {
    redirect('/dashboard/super-admin');
  }

  if (isSpaAdmin(user)) {
    redirect(`/dashboard/spa-admin/${user.spaId}`);
  }

  if (isBranchAdmin(user)) {
    redirect(`/dashboard/branch-admin/${user.spaId}/${user.branchId}`);
  }

  if (isManicurist(user)) {
    redirect(`/dashboard/manicurist/${user.spaId}/${user.branchId}`);
  }

  // Fallback - should not reach here
  redirect('/login');
}
