import { SpaWithStats } from '@/types/prisma';
import { DashboardStatCard } from '@/components/dashboard';

export function calculateSpaStats(spa: SpaWithStats): DashboardStatCard[] {
  return [
    {
      title: 'Total Sedes',
      value: spa.branches.length,
    },
    {
      title: 'Total Clientes',
      value: spa._count.clients || 0,
    },
    {
      title: 'Total Manicuristas',
      value: spa._count.manicurists || 0,
    },
    {
      title: 'Total Citas',
      value: spa._count.appointments || 0,
    },
  ];
}

export function calculateSuperAdminStats(
  spas: SpaWithStats[]
): DashboardStatCard[] {
  const totalUsers = spas.reduce(
    (total, spa) => total + (spa._count.users || 0),
    0
  );
  const totalClients = spas.reduce(
    (total, spa) => total + (spa._count.clients || 0),
    0
  );
  const totalAppointments = spas.reduce(
    (total, spa) => total + (spa._count.appointments || 0),
    0
  );

  return [
    {
      title: 'Total Spas',
      value: spas.length,
    },
    {
      title: 'Total Usuarios',
      value: totalUsers,
    },
    {
      title: 'Total Clientes',
      value: totalClients,
    },
    {
      title: 'Total Citas',
      value: totalAppointments,
    },
  ];
}
