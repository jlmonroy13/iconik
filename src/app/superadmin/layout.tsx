"use client"

import { SessionProvider } from "next-auth/react"

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  // Wrap all superadmin pages with SessionProvider for next-auth
  return <SessionProvider>{children}</SessionProvider>
}
