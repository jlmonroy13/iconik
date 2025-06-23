'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import type { Manicurist } from '../types'
import { Medal, Star } from 'lucide-react'

interface ManicuristPerformanceProps {
  manicurists: Manicurist[]
}

export function ManicuristPerformance({ manicurists }: ManicuristPerformanceProps) {
  const manicuristStats = useMemo(() => {
    return manicurists
      .filter(m => m.isActive)
      .map(manicurist => {
        const totalServices = manicurist.services.length
        const totalRevenue = manicurist.services.reduce((sum, service) => sum + service.price, 0)
        const ratings = manicurist.services.filter(s => s.rating).map(s => s.rating!)
        const averageRating = ratings.length > 0
          ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
          : 0

        // Calculate efficiency (services per month)
        const now = new Date()
        const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1)
        const recentServices = manicurist.services.filter(s =>
          new Date(s.createdAt) >= threeMonthsAgo
        )
        const efficiency = recentServices.length / 3 // services per month

        return {
          id: manicurist.id,
          name: manicurist.name,
          totalServices,
          totalRevenue,
          averageRating: Math.round(averageRating * 10) / 10,
          commission: manicurist.commission,
          efficiency: Math.round(efficiency * 10) / 10,
          specialty: manicurist.specialty
        }
      })
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
  }, [manicurists])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getRatingStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => <Star key={`full-${i}`} className="w-4 h-4 text-yellow-400 fill-current" />)}
        {halfStar && <Star key="half" className="w-4 h-4 text-yellow-400" />}
        {[...Array(emptyStars)].map((_, i) => <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />)}
      </div>
    )
  }

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 20) return 'text-green-600 dark:text-green-400'
    if (efficiency >= 10) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getMedalIcon = (index: number) => {
    const props = { className: "w-6 h-6" }
    if (index === 0) return <Medal {...props} color="#FFD700" />
    if (index === 1) return <Medal {...props} color="#C0C0C0" />
    if (index === 2) return <Medal {...props} color="#CD7F32" />
    return null
  }

  return (
    <div className="space-y-6">
      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {manicuristStats.slice(0, 3).map((manicurist, index) => (
          <Card key={manicurist.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base sm:text-lg">
                  #{index + 1} {manicurist.name}
                </CardTitle>
                {getMedalIcon(index)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Ingresos:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatCurrency(manicurist.totalRevenue)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Servicios:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {manicurist.totalServices}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Rating:</span>
                  {getRatingStars(manicurist.averageRating)}
                </div>
                {manicurist.specialty && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Especialidad:</span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {manicurist.specialty}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Rendimiento Detallado</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-2 font-medium text-gray-900 dark:text-white">
                    Manicurista
                  </th>
                  <th className="text-right py-3 px-2 font-medium text-gray-900 dark:text-white">
                    Servicios
                  </th>
                  <th className="text-right py-3 px-2 font-medium text-gray-900 dark:text-white">
                    Ingresos
                  </th>
                  <th className="text-right py-3 px-2 font-medium text-gray-900 dark:text-white">
                    Rating
                  </th>
                  <th className="text-right py-3 px-2 font-medium text-gray-900 dark:text-white">
                    Eficiencia
                  </th>
                  <th className="text-right py-3 px-2 font-medium text-gray-900 dark:text-white">
                    Comisión
                  </th>
                </tr>
              </thead>
              <tbody>
                {manicuristStats.map((manicurist) => (
                  <tr key={manicurist.id} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-3 px-2">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {manicurist.name}
                        </div>
                        {manicurist.specialty && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {manicurist.specialty}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="text-right py-3 px-2 text-gray-900 dark:text-white">
                      {manicurist.totalServices}
                    </td>
                    <td className="text-right py-3 px-2 font-medium text-gray-900 dark:text-white">
                      {formatCurrency(manicurist.totalRevenue)}
                    </td>
                    <td className="text-right py-3 px-2">
                      <div className="flex items-center justify-end gap-1">
                        {getRatingStars(manicurist.averageRating)}
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          ({manicurist.averageRating})
                        </span>
                      </div>
                    </td>
                    <td className="text-right py-3 px-2">
                      <span className={`font-medium ${getEfficiencyColor(manicurist.efficiency)}`}>
                        {manicurist.efficiency}/mes
                      </span>
                    </td>
                    <td className="text-right py-3 px-2 text-gray-900 dark:text-white">
                      {(manicurist.commission * 100).toFixed(0)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Métricas de Eficiencia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {manicuristStats.slice(0, 5).map((manicurist) => (
                <div key={manicurist.id} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {manicurist.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${Math.min((manicurist.efficiency / 30) * 100, 100)}%`
                        }}
                      />
                    </div>
                    <span className={`text-xs font-medium ${getEfficiencyColor(manicurist.efficiency)}`}>
                      {manicurist.efficiency}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Distribución de Ingresos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {manicuristStats.slice(0, 5).map((manicurist) => {
                const totalRevenue = manicuristStats.reduce((sum, m) => sum + m.totalRevenue, 0)
                const percentage = totalRevenue > 0 ? (manicurist.totalRevenue / totalRevenue) * 100 : 0

                return (
                  <div key={manicurist.id} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {manicurist.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
