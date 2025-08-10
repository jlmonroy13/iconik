'use client';

import { useSession } from 'next-auth/react';

export function useSpaId() {
  const { data: session } = useSession();
  const user = session?.user as
    | { isSuperAdmin?: boolean; spaId?: string | null }
    | undefined;

  if (!user) {
    return null;
  }

  return user.spaId;
}
