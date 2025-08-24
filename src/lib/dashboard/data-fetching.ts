import { prisma } from '@/lib/prisma';

export async function getSpaWithStats(spaId: string) {
  return await prisma.spa.findUnique({
    where: { id: spaId },
    include: {
      branches: {
        include: {
          _count: {
            select: {
              appointments: true,
            },
          },
        },
      },
      _count: {
        select: {
          services: true,
          appointments: true,
          users: true,
        },
      },
    },
  });
}

export async function getAllSpasWithStats() {
  return await prisma.spa.findMany({
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
}

export async function getUsersByRole(
  spaId: string,
  role: 'BRANCH_ADMIN' | 'MANICURIST'
) {
  return await prisma.user.findMany({
    where: {
      spaId: spaId,
      role: role,
    },
    include: {
      branch: {
        select: {
          name: true,
          code: true,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  });
}

export async function getAdmins() {
  return await prisma.user.findMany({
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
}

export async function getSpaCounts(spaId: string) {
  const [clientCount, manicuristCount, appointmentCount] = await Promise.all([
    prisma.user.count({
      where: {
        spaId: spaId,
        role: 'CLIENT',
      },
    }),
    prisma.user.count({
      where: {
        spaId: spaId,
        role: 'MANICURIST',
      },
    }),
    prisma.appointment.count({
      where: {
        spaId: spaId,
      },
    }),
  ]);

  return { clientCount, manicuristCount, appointmentCount };
}

export async function getBranchCounts<
  T extends { id: string; _count: { appointments: number } },
>(spaId: string, branches: T[]) {
  return await Promise.all(
    branches.map(async branch => {
      const [branchClientCount, branchManicuristCount] = await Promise.all([
        prisma.user.count({
          where: {
            spaId: spaId,
            role: 'CLIENT',
            branchId: branch.id,
          },
        }),
        prisma.user.count({
          where: {
            spaId: spaId,
            role: 'MANICURIST',
            branchId: branch.id,
          },
        }),
      ]);

      return {
        ...branch,
        _count: {
          ...branch._count,
          clients: branchClientCount,
          manicurists: branchManicuristCount,
        },
      };
    })
  );
}
