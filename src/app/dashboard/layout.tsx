'use client'

import { ReactNode, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { DashboardHeader, Sidebar } from './components';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    const user = session?.user as { isSuperAdmin?: boolean; spaId?: string | null };
    if (!user) {
      router.replace('/login');
    } else if (!user.isSuperAdmin && !user.spaId) {
      router.replace('/onboarding');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-gray-500 text-lg">Cargando...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar isOpen={false} onClose={() => {}} />
        {/* Main Content */}
        <div className="flex-1 flex flex-col h-full overflow-hidden lg:ml-0">
          {/* Header */}
          <DashboardHeader onMenuToggle={() => {}} />
          {/* Page Content */}
          <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
