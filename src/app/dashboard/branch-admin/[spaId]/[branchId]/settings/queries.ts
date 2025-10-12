import { prisma } from '@/lib/prisma';

/**
 * Get branch configuration including settings
 */
export async function getBranchSettings(branchId: string) {
  const branch = await prisma.branch.findUnique({
    where: { id: branchId },
    include: {
      settings: true,
      spa: {
        select: {
          name: true,
          openingTime: true,
          closingTime: true,
        },
      },
    },
  });

  return branch;
}

export type BranchWithSettings = NonNullable<
  Awaited<ReturnType<typeof getBranchSettings>>
>;
