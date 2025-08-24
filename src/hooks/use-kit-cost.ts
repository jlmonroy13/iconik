import { useState, useEffect } from 'react';
import { ServiceType } from '@/generated/prisma';
import { shouldHaveKitCost, getDefaultKitCost } from '@/lib/utils/calculations';

interface UseKitCostProps {
  serviceType: ServiceType;
  initialKitCost?: number;
  autoSetDefault?: boolean;
}

export function useKitCost({
  serviceType,
  initialKitCost,
  autoSetDefault = true,
}: UseKitCostProps) {
  const [kitCost, setKitCost] = useState<number | undefined>(initialKitCost);
  const [hasKitCost, setHasKitCost] = useState(false);

  // Auto-set default kit cost for nail services if not provided
  useEffect(() => {
    if (autoSetDefault && shouldHaveKitCost(serviceType) && !kitCost) {
      const defaultCost = getDefaultKitCost(serviceType);
      if (defaultCost > 0) {
        setKitCost(defaultCost);
        setHasKitCost(true);
      }
    }
  }, [serviceType, autoSetDefault, kitCost]);

  // Update hasKitCost when kitCost changes
  useEffect(() => {
    setHasKitCost(Boolean(kitCost && kitCost > 0));
  }, [kitCost]);

  const addKitCost = () => {
    const defaultCost = getDefaultKitCost(serviceType);
    setKitCost(defaultCost);
    setHasKitCost(true);
  };

  const removeKitCost = () => {
    setKitCost(0);
    setHasKitCost(false);
  };

  const updateKitCost = (value: number) => {
    setKitCost(value);
    setHasKitCost(value > 0);
  };

  const canHaveKitCost = shouldHaveKitCost(serviceType);
  const defaultKitCost = getDefaultKitCost(serviceType);

  return {
    kitCost,
    hasKitCost,
    canHaveKitCost,
    defaultKitCost,
    addKitCost,
    removeKitCost,
    updateKitCost,
    setKitCost,
  };
}
