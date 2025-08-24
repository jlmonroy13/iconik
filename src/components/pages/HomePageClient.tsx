'use client';
import { useRouter } from 'next/navigation';
import { Button, Card, CardContent } from '@/components/ui';

export default function HomePageClient() {
  const router = useRouter();

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
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => router.push('/login')}
            >
              Iniciar sesión
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
