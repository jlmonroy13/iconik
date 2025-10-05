import { notFound } from 'next/navigation';
import { requireBranchAccessForPage } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import { ServiceDetailClient } from './components/ServiceDetailClient';
import { DashboardHeader } from '@/components/ui';

interface ServiceDetailPageProps {
  params: Promise<{
    spaId: string;
    branchId: string;
    serviceId: string;
  }>;
}

export default async function ServiceDetailPage({
  params,
}: ServiceDetailPageProps) {
  const { spaId, branchId, serviceId } = await params;

  // Require BRANCH_ADMIN role and branch access
  const user = await requireBranchAccessForPage(spaId, branchId);

  // Get service with branch info
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    include: {
      branch: {
        select: {
          id: true,
          name: true,
          code: true,
        },
      },
    },
  });

  if (!service) {
    notFound();
  }

  // Verify service belongs to this branch/spa
  if (service.spaId !== spaId || service.branchId !== branchId) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader
        user={user}
        title={service.name}
        subtitle={`Detalle del servicio - ${service.branch?.name || 'Sede'}`}
      />
      <ServiceDetailClient service={service} />
    </div>
  );
}
