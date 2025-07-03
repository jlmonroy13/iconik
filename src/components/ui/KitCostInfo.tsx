import { Info, AlertTriangle, Plus, X } from 'lucide-react'
import { ServiceType } from '@/generated/prisma'
import { shouldHaveKitCost, getDefaultKitCost, validateKitCost } from '@/lib/utils/calculations'
import { formatCurrency } from '@/lib/utils/calculations'
import { Button } from '@/components/ui/Button'

interface KitCostInfoProps {
  serviceType: ServiceType
  kitCost?: number
  showValidation?: boolean
  onAddKitCost?: () => void
  onRemoveKitCost?: () => void
  showActions?: boolean
}

export function KitCostInfo({
  serviceType,
  kitCost,
  showValidation = false,
  onAddKitCost,
  onRemoveKitCost,
  showActions = false
}: KitCostInfoProps) {
  const hasKitCost = shouldHaveKitCost(serviceType)
  const defaultKitCost = getDefaultKitCost(serviceType)
  const validation = showValidation ? validateKitCost(serviceType, kitCost || 0) : null
  const hasKitCostValue = kitCost && kitCost > 0

  if (!hasKitCost) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Info className="h-4 w-4" />
        <span>This service type does not require a kit cost</span>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Info className="h-4 w-4" />
        <span>Kit cost goes directly to the spa and doesn&apos;t affect manicurist commission</span>
      </div>

      {!hasKitCostValue && showActions && (
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onAddKitCost}
            className="h-8"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Kit Cost
          </Button>
          {defaultKitCost > 0 && (
            <span className="text-xs text-muted-foreground">
              Suggested: {formatCurrency(defaultKitCost)}
            </span>
          )}
        </div>
      )}

      {hasKitCostValue && showActions && (
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRemoveKitCost}
            className="h-8"
          >
            <X className="h-3 w-3 mr-1" />
            Remove Kit Cost
          </Button>
          <span className="text-sm font-medium">
            Current: {formatCurrency(kitCost)}
          </span>
        </div>
      )}

      {defaultKitCost > 0 && !hasKitCostValue && (
        <div className="text-sm text-muted-foreground">
          <span>Suggested kit cost: </span>
          <span className="font-medium">{formatCurrency(defaultKitCost)}</span>
        </div>
      )}

      {validation && !validation.isValid && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertTriangle className="h-4 w-4" />
          <span>{validation.message}</span>
        </div>
      )}

      {validation && validation.message?.includes('Warning') && (
        <div className="flex items-center gap-2 text-sm text-amber-600">
          <AlertTriangle className="h-4 w-4" />
          <span>{validation.message}</span>
        </div>
      )}
    </div>
  )
}

export function KitCostSummary({ services }: { services: Array<{ type: ServiceType; kitCost?: number }> }) {
  const servicesWithKitCost = services.filter(service => shouldHaveKitCost(service.type) && service.kitCost && service.kitCost > 0)
  const totalKitCost = servicesWithKitCost.reduce((sum, service) => sum + (service.kitCost || 0), 0)

  if (totalKitCost === 0) return null

  return (
    <div className="rounded-lg bg-muted p-3">
      <div className="text-sm font-medium">Kit Costs Summary</div>
      <div className="mt-1 space-y-1">
        {servicesWithKitCost.map((service, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span className="capitalize">{service.type.toLowerCase().replace('_', ' ')}</span>
            <span className="font-medium">{formatCurrency(service.kitCost || 0)}</span>
          </div>
        ))}
        <div className="border-t pt-1 flex justify-between font-medium">
          <span>Total Kit Cost</span>
          <span>{formatCurrency(totalKitCost)}</span>
        </div>
      </div>
    </div>
  )
}
