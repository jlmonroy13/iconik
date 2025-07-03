import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { Clock, AlertCircle, Eye } from 'lucide-react'

interface AlertsSectionProps {
  pendingApprovals: number
  pendingPreConfirmations: number
  overdueFollowUps: number
}

export function AlertsSection({
  pendingApprovals,
  pendingPreConfirmations,
  overdueFollowUps
}: AlertsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Alertas y Pendientes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div>
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Aprobaciones Pendientes
              </p>
              <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                {pendingApprovals}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>

          <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div>
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Pre-confirmaciones
              </p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {pendingPreConfirmations}
              </p>
            </div>
            <Eye className="w-8 h-8 text-blue-600" />
          </div>

          <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div>
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                Seguimientos Vencidos
              </p>
              <p className="text-2xl font-bold text-red-900 dark:text-red-100">
                {overdueFollowUps}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
