import { requireRoleForPage } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import { SuperAdminDashboardClient } from './components/SuperAdminDashboardClient';

type Admin = {
  id: string;
  name: string | null;
  email: string;
  role: 'SPA_ADMIN' | 'SUPER_ADMIN';
  spaId: string | null;
  isActive: boolean;
  spa: {
    name: string;
  } | null;
};

export default async function SuperAdminDashboardPage() {
  // Require SUPER_ADMIN role with redirect
  const _user = await requireRoleForPage('SUPER_ADMIN');

  // Get all spas with stats
  const spas = await prisma.spa.findMany({
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
    orderBy: {
      name: 'asc',
    },
  });

  // Get all admin users (SPA_ADMIN and SUPER_ADMIN)
  const allUsers = await prisma.user.findMany({
    where: {
      role: { in: ['SPA_ADMIN', 'SUPER_ADMIN'] },
    },
    include: {
      spa: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  });

  // Filter to ensure only admin roles and cast to Admin type
  const admins = allUsers.filter(
    user => user.role === 'SPA_ADMIN' || user.role === 'SUPER_ADMIN'
  ) as Admin[];

  return <SuperAdminDashboardClient spas={spas} admins={admins} />;
}
