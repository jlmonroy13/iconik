import type { Metadata } from 'next';
import { auth } from '../../auth';
import { redirect } from 'next/navigation';
import { PROTECTED_ROUTES } from '@/lib/constants/routes';
import HomePageClient from '../components/pages/HomePageClient';

export const metadata: Metadata = {
  title: 'Iconik - SaaS para Gestión de Spas de Uñas',
  description:
    'Plataforma multi-tenant para gestionar operaciones de spas de uñas: agendamiento, ventas, inventario y más.',
};

export default async function HomePage() {
  const session = await auth();

  // If user is logged in, redirect based on their role
  if (session?.user) {
    const user = session.user as {
      isSuperAdmin?: boolean;
      spaId?: string | null;
    };

    if (user.isSuperAdmin) {
      redirect(PROTECTED_ROUTES.SUPER_ADMIN_DASHBOARD);
    } else if (user.spaId) {
      redirect(PROTECTED_ROUTES.DASHBOARD);
    } else {
      redirect(PROTECTED_ROUTES.ONBOARDING);
    }
  }

  // If no session, show the landing page
  return <HomePageClient />;
}
