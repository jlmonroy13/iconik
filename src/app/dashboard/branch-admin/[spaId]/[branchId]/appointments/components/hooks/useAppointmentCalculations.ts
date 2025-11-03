import { useMemo } from 'react';

interface UseAppointmentCalculationsProps {
  services: Array<{
    price: number;
    estimatedDuration: number;
  }>;
  applyDiscount: boolean;
  discountType?: 'amount' | 'percentage';
  discountAmount?: number;
  discountPercentage?: number;
}

export function useAppointmentCalculations({
  services,
  applyDiscount,
  discountType,
  discountAmount,
  discountPercentage,
}: UseAppointmentCalculationsProps) {
  const totalPrice = useMemo(() => {
    const sum = services.reduce((sum, s) => sum + (s.price || 0), 0);
    return sum;
  }, [services]);

  const totalDuration = useMemo(() => {
    const sum = services.reduce(
      (sum, s) => sum + (s.estimatedDuration || 0),
      0
    );
    return sum;
  }, [services]);

  const calculatedDiscountAmount = useMemo(() => {
    if (!applyDiscount) return 0;

    if (discountType === 'percentage' && discountPercentage) {
      return (totalPrice * discountPercentage) / 100;
    }

    if (discountType === 'amount' && discountAmount) {
      return Math.min(discountAmount, totalPrice); // Discount can't exceed total
    }

    return 0;
  }, [
    applyDiscount,
    discountType,
    discountAmount,
    discountPercentage,
    totalPrice,
  ]);

  const finalPrice = useMemo(
    () => totalPrice - calculatedDiscountAmount,
    [totalPrice, calculatedDiscountAmount]
  );

  return {
    totalPrice,
    totalDuration,
    calculatedDiscountAmount,
    finalPrice,
  };
}
