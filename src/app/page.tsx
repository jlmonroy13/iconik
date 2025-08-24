import type { Metadata } from 'next';
import { Button, Card, CardContent } from '@/components/ui';
import Link from 'next/link';
import { redirectIfAuthenticated } from '@/lib/auth-utils';

export const metadata: Metadata = {
  title: 'Iconik - SaaS para Gestión de Spas de Uñas',
  description:
    'Plataforma multi-tenant para gestionar operaciones de spas de uñas: agendamiento, ventas, inventario y más.',
};

export default async function HomePage() {
  // Redirect authenticated users to their dashboard
  await redirectIfAuthenticated();
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Card className="max-w-md mx-auto text-center">
        <CardContent className="p-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Bienvenido a Iconik
          </h1>
          <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">
            Gestión moderna para spas de uñas.
          </p>
          <div className="space-y-4">
            <Button variant="primary" size="lg" className="w-full" asChild>
              <Link href="/login">Iniciar sesión</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
