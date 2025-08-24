import { requireRoleForPage } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { SpaDetailClient } from './components/SpaDetailClient';
import { DashboardHeader } from '@/components/ui';

export default async function SpaDetailPage({
  params,
}: {
  params: { spaId: string };
}) {
  // Require SUPER_ADMIN role with redirect
  const user = await requireRoleForPage('SUPER_ADMIN');

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader
        user={user}
        title={spa.name}
        subtitle={`Detalle completo del spa y gestión de recursos - ${spa.branches.length} sedes`}
      />
      <SpaDetailClient spa={spa} />
    </div>
  );
}
