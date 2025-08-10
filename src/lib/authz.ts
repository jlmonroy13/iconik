import { prisma } from '@/lib/prisma';

export async function assertUserSpaAccess(userId: string, spaId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.spaId !== spaId) {
    throw new Error('FORBIDDEN');
  }
}
