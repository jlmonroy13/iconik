import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './src/lib/prisma';
import Resend from 'next-auth/providers/resend';
import { PUBLIC_ROUTES } from './src/lib/constants/routes';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Resend({
      from: process.env.AUTH_RESEND_FROM_EMAIL as string,
    }),
  ],
  pages: {
    signIn: PUBLIC_ROUTES.LOGIN,
    error: PUBLIC_ROUTES.LOGIN,
  },
  callbacks: {
    async session({ session, user }) {
      // Safely assign custom fields to session.user
      const dbUser = user as { isSuperAdmin?: boolean; spaId?: string | null };
      const sessionUser = session.user as typeof session.user & {
        isSuperAdmin?: boolean;
        spaId?: string | null;
      };
      sessionUser.isSuperAdmin = dbUser.isSuperAdmin ?? false;
      sessionUser.spaId = dbUser.spaId ?? null;
      return session;
    },
  },
});
