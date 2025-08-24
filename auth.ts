import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './src/lib/prisma';
import Resend from 'next-auth/providers/resend';
import { PUBLIC_ROUTES } from './src/lib/constants/routes';
import { UserRole } from './src/generated/prisma';

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
      const dbUser = user as {
        id: string;
        email: string;
        name?: string | null;
        role: UserRole;
        spaId?: string | null;
        branchId?: string | null;
        isSuperAdmin: boolean;
        isActive: boolean;
      };

      const sessionUser = session.user as typeof session.user & {
        id: string;
        role: UserRole;
        spaId?: string | null;
        branchId?: string | null;
        isSuperAdmin: boolean;
        isActive: boolean;
      };

      // Assign all user properties to session
      sessionUser.id = dbUser.id;
      sessionUser.role = dbUser.role;
      sessionUser.spaId = dbUser.spaId ?? null;
      sessionUser.branchId = dbUser.branchId ?? null;
      sessionUser.isSuperAdmin = dbUser.isSuperAdmin ?? false;
      sessionUser.isActive = dbUser.isActive ?? true;

      return session;
    },
    async jwt({ token, user }) {
      // Add user data to JWT token
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.spaId = user.spaId;
        token.branchId = user.branchId;
        token.isSuperAdmin = user.isSuperAdmin;
        token.isActive = user.isActive;
      }
      return token;
    },
  },
  session: {
    strategy: 'jwt',
  },
});
