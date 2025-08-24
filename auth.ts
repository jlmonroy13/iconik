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
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async session({ session, token }) {
      // Add user data from token to session
      const sessionUser = session.user as typeof session.user & {
        id: string;
        role: UserRole;
        spaId?: string | null;
        branchId?: string | null;
        isSuperAdmin: boolean;
        isActive: boolean;
      };

      // Assign token data to session
      sessionUser.id = token.id as string;
      sessionUser.role = token.role as UserRole;
      sessionUser.spaId = token.spaId as string | null;
      sessionUser.branchId = token.branchId as string | null;
      sessionUser.isSuperAdmin = token.isSuperAdmin as boolean;
      sessionUser.isActive = token.isActive as boolean;

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
});
