import { notFound } from 'next/navigation';
import { requireBranchAccessForPage } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import { DashboardOverview } from './components/DashboardOverview';

interface BranchAdminPageProps {
  params: Promise<{
    spaId: string;
    branchId: string;
  }>;
}

export default async function BranchAdminDashboardPage({
  params,
}: BranchAdminPageProps) {
  const { spaId, branchId } = await params;

  // Require BRANCH_ADMIN role and branch access with redirect
  const _user = await requireBranchAccessForPage(spaId, branchId);

  // Get branch with stats
  const branch = await prisma.branch.findUnique({
    where: { id: branchId },
    include: {
      spa: {
        select: {
          name: true,
          logoUrl: true,
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

  if (!branch) {
    notFound();
  }

  return (
    <DashboardOverview branch={branch} spaId={spaId} branchId={branchId} />
  );
}
