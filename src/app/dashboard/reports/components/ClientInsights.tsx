'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import type { Client } from '../types'
import { Crown, Star, Sparkles, User } from 'lucide-react'

interface ClientInsightsProps {
  clients: Client[]
}

export function ClientInsights({ clients }: ClientInsightsProps) {
  const clientStats = useMemo(() => {
    return clients.map(client => {
      const totalSpent = client.services.reduce((sum, service) => sum + service.price, 0)
      const visitCount = client.services.length
      const lastVisit = client.services.length > 0
        ? new Date(Math.max(...client.services.map(s => new Date(s.createdAt).getTime())))
        : null
      const averageSpending = visitCount > 0 ? totalSpent / visitCount : 0

      // Determine loyalty level
      let loyalty: 'VIP' | 'Regular' | 'New' = 'New'
      if (visitCount >= 10 && totalSpent >= 500000) {
        loyalty = 'VIP'
      } else if (visitCount >= 3 || totalSpent >= 100000) {
        loyalty = 'Regular'
      }

      return {
        id: client.id,
        name: client.name,
        totalSpent,
        visitCount,
        lastVisit,
        averageSpending,
        loyalty
      }
    }).sort((a, b) => b.totalSpent - a.totalSpent)
  }, [clients])

  const loyaltyStats = useMemo(() => {
    const vip = clientStats.filter(c => c.loyalty === 'VIP').length
    const regular = clientStats.filter(c => c.loyalty === 'Regular').length
    const newClients = clientStats.filter(c => c.loyalty === 'New').length

    return { vip, regular, newClients }
  }, [clientStats])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date)
  }

  const getLoyaltyColor = (loyalty: string) => {
    switch (loyalty) {
      case 'VIP':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300'
      case 'Regular':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
      case 'New':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
    }
  }

  const getLoyaltyIcon = (loyalty: string) => {
    const iconProps = { className: "w-4 h-4" }
    switch (loyalty) {
      case 'VIP':
        return <Crown {...iconProps} />
      case 'Regular':
        return <Star {...iconProps} />
      case 'New':
        return <Sparkles {...iconProps} />
      default:
        return <User {...iconProps} />
    }
  }

  return (
    <div className="space-y-6">
      {/* Loyalty Distribution */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm sm:text-base flex items-center gap-2 text-purple-600 dark:text-purple-400">
              <Crown className="w-5 h-5" />
              <span>Clientes VIP</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400">
              {loyaltyStats.vip}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {clients.length > 0 ? ((loyaltyStats.vip / clients.length) * 100).toFixed(1) : 0}% del total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm sm:text-base flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <Star className="w-5 h-5" />
              <span>Regulares</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">
              {loyaltyStats.regular}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {clients.length > 0 ? ((loyaltyStats.regular / clients.length) * 100).toFixed(1) : 0}% del total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm sm:text-base flex items-center gap-2 text-green-600 dark:text-green-400">
              <Sparkles className="w-5 h-5" />
              <span>Nuevos</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">
              {loyaltyStats.newClients}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {clients.length > 0 ? ((loyaltyStats.newClients / clients.length) * 100).toFixed(1) : 0}% del total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Clients */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Mejores Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {clientStats.slice(0, 5).map((client, index) => (
              <div key={client.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {client.name}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>{client.visitCount} visitas</span>
                      <span>•</span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${getLoyaltyColor(client.loyalty)}`}>
                        {getLoyaltyIcon(client.loyalty)}
                        {client.loyalty}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {formatCurrency(client.totalSpent)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Promedio: {formatCurrency(client.averageSpending)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Client Analytics Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Análisis de Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-2 font-medium text-gray-900 dark:text-white">
                    Cliente
                  </th>
                  <th className="text-right py-3 px-2 font-medium text-gray-900 dark:text-white">
                    Visitas
                  </th>
                  <th className="text-right py-3 px-2 font-medium text-gray-900 dark:text-white">
                    Total Gastado
                  </th>
                  <th className="text-right py-3 px-2 font-medium text-gray-900 dark:text-white">
                    Promedio
                  </th>
                  <th className="text-right py-3 px-2 font-medium text-gray-900 dark:text-white">
                    Última Visita
                  </th>
                  <th className="text-right py-3 px-2 font-medium text-gray-900 dark:text-white">
                    Lealtad
                  </th>
                </tr>
              </thead>
              <tbody>
                {clientStats.map((client) => (
                  <tr key={client.id} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-3 px-2">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {client.name}
                      </div>
                    </td>
                    <td className="text-right py-3 px-2 text-gray-900 dark:text-white">
                      {client.visitCount}
                    </td>
                    <td className="text-right py-3 px-2 font-medium text-gray-900 dark:text-white">
                      {formatCurrency(client.totalSpent)}
                    </td>
                    <td className="text-right py-3 px-2 text-gray-900 dark:text-white">
                      {formatCurrency(client.averageSpending)}
                    </td>
                    <td className="text-right py-3 px-2 text-gray-500 dark:text-gray-400">
                      {client.lastVisit ? formatDate(client.lastVisit) : 'Nunca'}
                    </td>
                    <td className="text-right py-3 px-2">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs ${getLoyaltyColor(client.loyalty)}`}>
                        {getLoyaltyIcon(client.loyalty)}
                        <span>{client.loyalty}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Spending Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Distribución de Gastos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {clientStats.slice(0, 8).map((client) => {
                const maxSpent = Math.max(...clientStats.map(c => c.totalSpent))
                const percentage = maxSpent > 0 ? (client.totalSpent / maxSpent) * 100 : 0

                return (
                  <div key={client.id} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[120px]">
                      {client.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 min-w-[60px] text-right">
                        {formatCurrency(client.totalSpent)}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Frecuencia de Visitas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {clientStats
                .filter(c => c.visitCount > 0)
                .sort((a, b) => b.visitCount - a.visitCount)
                .slice(0, 8)
                .map((client) => {
                  const maxVisits = Math.max(...clientStats.map(c => c.visitCount))
                  const percentage = maxVisits > 0 ? (client.visitCount / maxVisits) * 100 : 0

                  return (
                    <div key={client.id} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[120px]">
                        {client.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 min-w-[30px] text-right">
                          {client.visitCount}
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
