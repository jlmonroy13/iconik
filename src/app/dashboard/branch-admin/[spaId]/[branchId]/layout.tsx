import { notFound } from 'next/navigation';
import { requireBranchAccessForPage } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import { BranchAdminLayout } from './components/BranchAdminLayout';

interface BranchAdminLayoutProps {
  params: {
    spaId: string;
    branchId: string;
  };
  children: React.ReactNode;
}

export default async function BranchAdminLayoutWrapper({
  params,
  children,
}: BranchAdminLayoutProps) {
  const { spaId, branchId } = params;

  // Require BRANCH_ADMIN role and branch access with redirect
  const user = await requireBranchAccessForPage(spaId, branchId);

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
    <BranchAdminLayout
      user={user}
      branch={branch}
      spaId={spaId}
      branchId={branchId}
    >
      {children}
    </BranchAdminLayout>
  );
}
