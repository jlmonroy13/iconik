import { Card, CardHeader, CardTitle, CardContent, EmptyState } from '@/components/ui'
import { Sparkles } from 'lucide-react'
import { formatCurrency } from '../utils/formatters'
import type { PopularService } from '../types/dashboard'

interface PopularServicesProps {
  services: PopularService[]
}

export function PopularServices({ services }: PopularServicesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Servicios Más Populares</CardTitle>
      </CardHeader>
      <CardContent>
        {services.length > 0 ? (
          <div className="space-y-3">
            {services.map((service, index) => (
              <div key={service.serviceId} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {service.service?.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {service._count.id} veces
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-blue-600 dark:text-blue-400">
                    {formatCurrency(service._sum.price || 0)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No hay datos de servicios"
            description="Los servicios más populares aparecerán aquí."
            icon={<Sparkles className="w-8 h-8" />}
          />
        )}
      </CardContent>
    </Card>
  )
}
