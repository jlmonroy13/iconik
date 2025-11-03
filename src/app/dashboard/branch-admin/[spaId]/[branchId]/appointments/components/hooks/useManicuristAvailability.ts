import { useState, useCallback, useRef, useEffect } from 'react';
import { getAvailableManicurists, getManicuristServices } from '../../actions';
import type { UseFormSetValue, UseFormWatch } from 'react-hook-form';
import type { AppointmentFormData } from '../types';
import { format } from 'date-fns';

interface UseManicuristAvailabilityProps {
  spaId: string;
  branchId: string;
  appointmentId?: string;
  watch: UseFormWatch<AppointmentFormData>;
  setValue: UseFormSetValue<AppointmentFormData>;
  formData: {
    services: Array<{
      id: string;
      name: string;
      price: number;
      duration: number;
      type: string;
    }>;
  };
}

export function useManicuristAvailability({
  spaId,
  branchId,
  appointmentId,
  watch,
  setValue,
  formData,
}: UseManicuristAvailabilityProps) {
  const [availableManicurists, setAvailableManicurists] = useState<
    Record<number, Array<{ id: string; name: string }>>
  >({});
  const [loadingManicurists, setLoadingManicurists] = useState<
    Record<number, boolean>
  >({});
  const [filteredServices, setFilteredServices] = useState<
    Array<{
      id: string;
      name: string;
      price: number;
      duration: number;
      type: string;
    }>
  >([]);
  const [loadingManicuristServices, setLoadingManicuristServices] =
    useState(false);

  const debounceTimerRef = useRef<Record<number, NodeJS.Timeout>>({});
  const watchServices = watch('services');
  const watchUseSameManicurist = watch('useSameManicurist');
  const watchPrimaryManicurist = watch('primaryManicuristId');
  const watchScheduledAt = watch('scheduledAt');
  const watchIsScheduled = watch('isScheduled');

  // Fetch available manicurists for a specific service
  const fetchAvailableManicurists = useCallback(
    async (
      index: number,
      serviceId: string,
      scheduledAt: string,
      durationMinutes: number,
      isScheduled: boolean
    ) => {
      if (!serviceId) {
        setAvailableManicurists(prev => {
          const updated = { ...prev };
          delete updated[index];
          return updated;
        });
        setValue(`services.${index}.manicuristId`, '');
        return;
      }

      setLoadingManicurists(prev => ({ ...prev, [index]: true }));

      try {
        const result = await getAvailableManicurists(
          spaId,
          branchId,
          serviceId,
          scheduledAt,
          durationMinutes,
          isScheduled,
          appointmentId
        );

        if (result.success && result.data) {
          setAvailableManicurists(prev => ({
            ...prev,
            [index]: result.data!,
          }));

          // If current manicurist is not in available list, clear it
          const currentManicuristId = watchServices?.[index]?.manicuristId;
          if (
            currentManicuristId &&
            !result.data.some(m => m.id === currentManicuristId)
          ) {
            setValue(`services.${index}.manicuristId`, '');
          }
        } else {
          setAvailableManicurists(prev => {
            const updated = { ...prev };
            delete updated[index];
            return updated;
          });
        }
      } catch (_err) {
        setAvailableManicurists(prev => {
          const updated = { ...prev };
          delete updated[index];
          return updated;
        });
      } finally {
        setLoadingManicurists(prev => ({ ...prev, [index]: false }));
      }
    },
    [spaId, branchId, appointmentId, watchServices, setValue]
  );

  // Fetch services for selected manicurist when using same manicurist
  useEffect(() => {
    const fetchManicuristServices = async () => {
      if (watchUseSameManicurist && watchPrimaryManicurist) {
        setLoadingManicuristServices(true);
        try {
          const result = await getManicuristServices(
            watchPrimaryManicurist,
            spaId,
            branchId
          );
          if (result.success && result.data) {
            setFilteredServices(result.data);
            // Clear services that are not available for this manicurist
            watchServices?.forEach((service, index) => {
              if (
                service.serviceId &&
                !result.data!.some(s => s.id === service.serviceId)
              ) {
                setValue(`services.${index}.serviceId`, '');
                setValue(`services.${index}.price`, 0);
                setValue(`services.${index}.estimatedDuration`, 0);
              }
            });
          } else {
            setFilteredServices([]);
          }
        } catch (_err) {
          setFilteredServices([]);
        } finally {
          setLoadingManicuristServices(false);
        }
      } else {
        setFilteredServices([]);
      }
    };

    fetchManicuristServices();
  }, [
    watchUseSameManicurist,
    watchPrimaryManicurist,
    spaId,
    branchId,
    watchServices,
    setValue,
  ]);

  // Effect to update available manicurists when date/time or walk-in status changes
  useEffect(() => {
    watchServices?.forEach((service, index) => {
      if (service.serviceId && service.estimatedDuration) {
        const scheduledAt =
          watchScheduledAt || format(new Date(), "yyyy-MM-dd'T'HH:mm");
        const isScheduled = watchIsScheduled;

        // Clear existing debounce timer
        if (debounceTimerRef.current[index]) {
          clearTimeout(debounceTimerRef.current[index]);
        }

        // Debounce the fetch call
        const timer = setTimeout(() => {
          fetchAvailableManicurists(
            index,
            service.serviceId,
            scheduledAt,
            service.estimatedDuration,
            isScheduled ?? true
          );
        }, 300);

        debounceTimerRef.current[index] = timer;
      }
    });

    // Cleanup timers on unmount
    return () => {
      const timers = { ...debounceTimerRef.current };
      Object.values(timers).forEach(timer => {
        if (timer) clearTimeout(timer);
      });
    };
  }, [
    watchScheduledAt,
    watchIsScheduled,
    watchServices,
    fetchAvailableManicurists,
  ]);

  // Handle service selection (auto-fill price and duration)
  const handleServiceSelect = useCallback(
    (index: number, serviceId: string) => {
      // Use filtered services if using same manicurist, otherwise use all services
      const availableServices =
        watchUseSameManicurist && filteredServices.length > 0
          ? filteredServices
          : formData.services;

      const service = availableServices.find(s => s.id === serviceId);
      if (service) {
        // Update price and duration, trigger all flags to force re-render and watch update
        setValue(`services.${index}.price`, service.price, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
        setValue(`services.${index}.estimatedDuration`, service.duration, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });

        // Fetch available manicurists for this service
        const scheduledAt =
          watchScheduledAt || format(new Date(), "yyyy-MM-dd'T'HH:mm");
        const isScheduled = watchIsScheduled ?? true;

        // Clear existing debounce timer for this index
        if (debounceTimerRef.current[index]) {
          clearTimeout(debounceTimerRef.current[index]);
        }

        // Debounce the fetch call
        const timer = setTimeout(() => {
          fetchAvailableManicurists(
            index,
            serviceId,
            scheduledAt,
            service.duration,
            isScheduled
          );
        }, 300);

        debounceTimerRef.current[index] = timer;
      } else {
        // Clear manicurists if service is cleared
        setAvailableManicurists(prev => {
          const updated = { ...prev };
          delete updated[index];
          return updated;
        });
        setValue(`services.${index}.manicuristId`, '');
      }
    },
    [
      watchUseSameManicurist,
      filteredServices,
      formData.services,
      watchScheduledAt,
      watchIsScheduled,
      setValue,
      fetchAvailableManicurists,
    ]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      const timers = { ...debounceTimerRef.current };
      Object.values(timers).forEach(timer => {
        if (timer) clearTimeout(timer);
      });
    };
  }, []);

  return {
    availableManicurists,
    loadingManicurists,
    filteredServices,
    loadingManicuristServices,
    handleServiceSelect,
    fetchAvailableManicurists,
  };
}
