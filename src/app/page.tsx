import Link from 'next/link'
import { Button } from '@/components/ui'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-800 dark:text-white mb-4">
            💅 Iconik
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            SaaS para Gestión de Spas de Uñas
          </p>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              🚧 En Desarrollo
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Plataforma multi-tenant para gestionar operaciones de spas de uñas:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✅</span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">Next.js 15 + React 19</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✅</span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">Tailwind CSS 4</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✅</span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">TypeScript</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✅</span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">Neon PostgreSQL</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✅</span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">Prisma ORM</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✅</span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">Multi-tenancy</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✅</span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">Dashboard UI</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-500">⏳</span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">Auth.js</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-500">⏳</span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">API Routes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-500">⏳</span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">UploadThing</span>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center space-x-4">
            <Button asChild variant="primary" size="lg">
              <Link href="/dashboard">
              🚀 Ver Dashboard
            </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
            <a
              href="http://localhost:5555"
              target="_blank"
              rel="noopener noreferrer"
            >
              🗄️ Prisma Studio
            </a>
            </Button>
          </div>

          <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
            <p>Base de datos poblada con datos de prueba • Listo para desarrollo</p>
          </div>
        </div>
      </div>
    </div>
  )
}
