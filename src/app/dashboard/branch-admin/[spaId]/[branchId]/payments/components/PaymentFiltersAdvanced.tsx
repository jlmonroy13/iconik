'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface PaymentFiltersAdvancedProps {
  minAmount: string;
  maxAmount: string;
  onMinAmountChange: (value: string) => void;
  onMaxAmountChange: (value: string) => void;
  onApply: () => void;
  onClear: () => void;
}

export function PaymentFiltersAdvanced({
  minAmount,
  maxAmount,
  onMinAmountChange,
  onMaxAmountChange,
  onApply,
  onClear,
}: PaymentFiltersAdvancedProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border-t pt-4 mt-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
      >
        <span>{isExpanded ? '▼' : '▶'}</span>
        Filtros Avanzados
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          {/* Amount Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rango de Montos
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Monto Mínimo
                </label>
                <Input
                  type="number"
                  placeholder="Ej: 50000"
                  value={minAmount}
                  onChange={e => onMinAmountChange(e.target.value)}
                  min="0"
                  step="1000"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Monto Máximo
                </label>
                <Input
                  type="number"
                  placeholder="Ej: 200000"
                  value={maxAmount}
                  onChange={e => onMaxAmountChange(e.target.value)}
                  min="0"
                  step="1000"
                />
              </div>
            </div>
          </div>

          {/* Quick Amount Filters */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Filtros Rápidos
            </label>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => {
                  onMinAmountChange('0');
                  onMaxAmountChange('50000');
                  onApply();
                }}
                className="text-xs bg-gray-500 hover:bg-gray-600"
              >
                Menos de $50k
              </Button>
              <Button
                onClick={() => {
                  onMinAmountChange('50000');
                  onMaxAmountChange('100000');
                  onApply();
                }}
                className="text-xs bg-gray-500 hover:bg-gray-600"
              >
                $50k - $100k
              </Button>
              <Button
                onClick={() => {
                  onMinAmountChange('100000');
                  onMaxAmountChange('200000');
                  onApply();
                }}
                className="text-xs bg-gray-500 hover:bg-gray-600"
              >
                $100k - $200k
              </Button>
              <Button
                onClick={() => {
                  onMinAmountChange('200000');
                  onMaxAmountChange('');
                  onApply();
                }}
                className="text-xs bg-gray-500 hover:bg-gray-600"
              >
                Más de $200k
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              onClick={onApply}
              className="bg-blue-600 hover:bg-blue-700 text-sm"
            >
              Aplicar Filtros
            </Button>
            <Button
              onClick={() => {
                onMinAmountChange('');
                onMaxAmountChange('');
                onClear();
              }}
              className="bg-gray-600 hover:bg-gray-700 text-sm"
            >
              Limpiar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
