'use client';

import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui';
import { Home, LogOut } from 'lucide-react';

export default function NotFoundPage() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/dashboard');
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl text-center">
        {/* Icon and Error Code */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mb-6 shadow-xl">
            <span className="text-5xl">😕</span>
          </div>
          <h1 className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 mb-4">
            404
          </h1>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Página no encontrada
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Lo sentimos, la página que estás buscando no existe o ha sido
            movida.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={handleGoHome}
            variant="primary"
            size="lg"
            className="w-full sm:w-auto min-w-[200px]"
          >
            <Home className="w-5 h-5 mr-2" />
            Volver al inicio
          </Button>

          <Button
            onClick={handleSignOut}
            variant="outline"
            size="lg"
            className="w-full sm:w-auto min-w-[200px]"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Cerrar sesión
          </Button>
        </div>

        {/* Additional Help Text */}
        <div className="mt-12 text-sm text-gray-500 dark:text-gray-400">
          <p>Si crees que esto es un error, por favor contacta al soporte.</p>
        </div>
      </div>
    </div>
  );
}
