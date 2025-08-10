import { auth } from '@/../../auth'
import { redirect } from 'next/navigation'
import { PROTECTED_ROUTES } from '@/lib/constants/routes'

export default async function OnboardingPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  const user = session.user as { isSuperAdmin?: boolean; spaId?: string | null }

  // If user is super admin, redirect to super admin dashboard
  if (user.isSuperAdmin) {
    redirect(PROTECTED_ROUTES.SUPER_ADMIN_DASHBOARD)
  }

  // If user has spaId, redirect to dashboard
  if (user.spaId) {
    redirect(PROTECTED_ROUTES.DASHBOARD)
  }

  // For now, redirect super admin users to their dashboard
  // This page will be used for spa setup in the future
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Configuración Inicial
        </h1>
        <p className="text-gray-600 mb-8">
          Esta página está en desarrollo. Los super administradores serán redirigidos automáticamente.
        </p>
        <a
          href={PROTECTED_ROUTES.SUPER_ADMIN_DASHBOARD}
          className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Ir al Dashboard de Super Admin
        </a>
      </div>
    </div>
  )
}
