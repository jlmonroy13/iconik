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
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
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
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-500">⏳</span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">Auth.js + Prisma</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-500">⏳</span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">Multi-tenancy</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-500">⏳</span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">Gestión de Servicios</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
