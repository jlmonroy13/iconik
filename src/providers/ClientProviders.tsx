'use client';
import { NotificationProvider } from '@/components/ui';
import { SessionProvider } from 'next-auth/react';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <NotificationProvider>{children}</NotificationProvider>
    </SessionProvider>
  );
}
