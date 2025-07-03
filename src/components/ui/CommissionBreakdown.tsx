import { formatCurrency } from '@/lib/utils/calculations'
import { calculateCommissionWithKitCostTaxAndFees } from '@/lib/utils/calculations'

interface CommissionBreakdownProps {
  servicePrice: number
  kitCost?: number
  taxRate?: number
  commissionRate: number
  discountAmount?: number
  discountAffectsCommission?: boolean
  transactionFeeRate?: number
  showDetails?: boolean
}

export function CommissionBreakdown({
  servicePrice,
  kitCost = 0,
  taxRate = 0,
  commissionRate,
  discountAmount = 0,
  discountAffectsCommission = false,
  transactionFeeRate = 0,
  showDetails = true
}: CommissionBreakdownProps) {
  const result = calculateCommissionWithKitCostTaxAndFees(
    servicePrice,
    kitCost,
    taxRate,
    commissionRate,
    discountAmount,
    discountAffectsCommission,
    transactionFeeRate
  )

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="text-sm text-blue-600 font-medium">Manicurista</div>
          <div className="text-lg font-bold text-blue-800">
            {formatCurrency(result.manicuristEarnings)}
          </div>
          <div className="text-xs text-blue-600">
            {((result.manicuristEarnings / result.finalTotal) * 100).toFixed(1)}%
          </div>
        </div>

        <div className="bg-green-50 p-3 rounded-lg">
          <div className="text-sm text-green-600 font-medium">Spa (Neto)</div>
          <div className="text-lg font-bold text-green-800">
            {formatCurrency(result.spaNetEarnings)}
          </div>
          <div className="text-xs text-green-600">
            {((result.spaNetEarnings / result.finalTotal) * 100).toFixed(1)}%
          </div>
        </div>

        {result.governmentTax > 0 && (
          <div className="bg-red-50 p-3 rounded-lg">
            <div className="text-sm text-red-600 font-medium">Impuestos</div>
            <div className="text-lg font-bold text-red-800">
              {formatCurrency(result.governmentTax)}
            </div>
            <div className="text-xs text-red-600">
              {((result.governmentTax / result.finalTotal) * 100).toFixed(1)}%
            </div>
          </div>
        )}

        {result.transactionFeeAmount > 0 && (
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="text-sm text-purple-600 font-medium">Comisión TDC</div>
            <div className="text-lg font-bold text-purple-800">
              {formatCurrency(result.transactionFeeAmount)}
            </div>
            <div className="text-xs text-purple-600">
              {((result.transactionFeeAmount / result.finalTotal) * 100).toFixed(1)}%
            </div>
          </div>
        )}

        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-sm text-gray-600 font-medium">Total</div>
          <div className="text-lg font-bold text-gray-800">
            {formatCurrency(result.finalTotal)}
          </div>
          <div className="text-xs text-gray-600">100%</div>
        </div>
      </div>

      {/* Detailed Breakdown */}
      {showDetails && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Desglose detallado</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-100" />
                <span>Precio del servicio</span>
              </div>
              <div className="text-right">
                <div className="font-medium">{formatCurrency(result.servicePrice)}</div>
                <div className="text-xs text-muted-foreground">
                  {((result.servicePrice / result.finalTotal) * 100).toFixed(1)}%
                </div>
              </div>
            </div>

            {result.kitCost > 0 && (
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-100" />
                  <span>Costo del kit</span>
                </div>
                <div className="text-right">
                  <div className="font-medium">{formatCurrency(result.kitCost)}</div>
                  <div className="text-xs text-muted-foreground">
                    {((result.kitCost / result.finalTotal) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            )}

            {result.governmentTax > 0 && (
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-100" />
                  <span>Impuestos</span>
                </div>
                <div className="text-right">
                  <div className="font-medium">{formatCurrency(result.governmentTax)}</div>
                  <div className="text-xs text-muted-foreground">
                    {((result.governmentTax / result.finalTotal) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            )}

            {result.transactionFeeAmount > 0 && (
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-100" />
                  <span>Comisión tarjeta</span>
                </div>
                <div className="text-right">
                  <div className="font-medium">{formatCurrency(result.transactionFeeAmount)}</div>
                  <div className="text-xs text-muted-foreground">
                    {((result.transactionFeeAmount / result.finalTotal) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            )}

            {result.discountAmount > 0 && (
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-100" />
                  <span>Descuento</span>
                </div>
                <div className="text-right">
                  <div className="font-medium">-{formatCurrency(result.discountAmount)}</div>
                  <div className="text-xs text-muted-foreground">
                    -{((result.discountAmount / result.finalTotal) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Commission Rate Info */}
      <div className="bg-amber-50 p-3 rounded-lg">
        <div className="text-sm text-amber-800">
          <strong>Comisión de la manicurista:</strong> {(commissionRate * 100).toFixed(0)}%
          <span className="text-xs ml-2">
            (calculada solo sobre el precio del servicio: {formatCurrency(servicePrice)})
          </span>
        </div>
        {result.transactionFeeAmount > 0 && (
          <div className="text-xs text-amber-700 mt-1">
            <strong>Comisión de tarjeta:</strong> {(transactionFeeRate * 100).toFixed(2)}%
            <span className="ml-2">
              (deducida de las ganancias del spa)
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
