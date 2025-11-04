'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Modal, Button } from '@/components/ui';
import { appointmentFormSchema } from '@/types/forms';
import type {
  AppointmentWithDetails,
  AppointmentFormDropdownData,
} from '@/types';
import { createAppointment, updateAppointment } from '../actions';
import { InlineClientModal } from './InlineClientModal';
import { BasicInformationSection } from './BasicInformationSection';
import { DiscountSection } from './DiscountSection';
import { ServicesSection } from './ServicesSection';
import { AppointmentSummary } from './AppointmentSummary';
import { useAppointmentCalculations } from './hooks/useAppointmentCalculations';
import { useManicuristAvailability } from './hooks/useManicuristAvailability';
import type { AppointmentFormData } from './types';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment?: AppointmentWithDetails;
  formData: AppointmentFormDropdownData;
  spaId: string;
  branchId: string;
}

export function AppointmentModal({
  isOpen,
  onClose,
  appointment,
  formData,
  spaId,
  branchId,
}: AppointmentModalProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [clientsList, setClientsList] = useState(formData.clients);

  const isEditing = !!appointment;

  // Helper function to get default form values
  const getDefaultFormValues = useCallback(
    (appointment?: AppointmentWithDetails): AppointmentFormData => {
      return {
        clientId: appointment?.client.id || '',
        scheduledAt: appointment
          ? format(new Date(appointment.scheduledAt), "yyyy-MM-dd'T'HH:mm")
          : format(new Date(), "yyyy-MM-dd'T'HH:mm"),
        isScheduled: appointment?.isScheduled ?? true,
        notes: appointment?.notes || '',
        useSameManicurist: false,
        primaryManicuristId: '',
        services:
          appointment?.services.map(s => ({
            serviceId: s.service.id,
            manicuristId: s.manicurist.id,
            price: s.price,
            estimatedDuration: s.estimatedDuration,
          })) || [],
        // Discount fields (UI-only)
        applyDiscount: false,
        discountType: undefined,
        discountAmount: undefined,
        discountPercentage: undefined,
        discountReason: '',
        discountAffectsCommission: false,
      };
    },
    []
  );

  // Initialize form
  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: getDefaultFormValues(appointment),
  });

  // Field array for services
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'services',
  });

  // Watch form values
  // Use useWatch for services to ensure it updates when setValue changes nested fields
  const watchServices = useWatch({
    control,
    name: 'services',
    defaultValue: [],
  });
  const watchUseSameManicurist = watch('useSameManicurist');
  const watchPrimaryManicurist = watch('primaryManicuristId');
  const watchIsScheduled = watch('isScheduled');
  const watchScheduledAt = watch('scheduledAt');
  const watchApplyDiscount = watch('applyDiscount');
  const watchDiscountType = watch('discountType');
  const watchDiscountAmount = watch('discountAmount');
  const watchDiscountPercentage = watch('discountPercentage');

  // Use custom hooks for calculations and availability
  // Ensure we always use the most recent services array
  const servicesForCalculation = useMemo(
    () => watchServices || [],
    [watchServices]
  );

  const { totalPrice, totalDuration, calculatedDiscountAmount, finalPrice } =
    useAppointmentCalculations({
      services: servicesForCalculation,
      applyDiscount: watchApplyDiscount ?? false,
      discountType: watchDiscountType,
      discountAmount: watchDiscountAmount,
      discountPercentage: watchDiscountPercentage,
    });

  const {
    availableManicurists,
    loadingManicurists,
    filteredServices,
    loadingManicuristServices,
    handleServiceSelect,
    fetchAvailableManicurists,
  } = useManicuristAvailability({
    spaId,
    branchId,
    appointmentId: appointment?.id,
    watch,
    setValue,
    formData,
  });

  // Handle adding a service
  const handleAddService = () => {
    append({
      serviceId: '',
      manicuristId: watchUseSameManicurist ? watchPrimaryManicurist || '' : '',
      price: 0,
      estimatedDuration: 0,
    });
  };

  // Handle primary manicurist change (when using same for all)
  useEffect(() => {
    if (watchUseSameManicurist && watchPrimaryManicurist) {
      watchServices?.forEach((_, index) => {
        setValue(`services.${index}.manicuristId`, watchPrimaryManicurist);
      });
    }
  }, [watchUseSameManicurist, watchPrimaryManicurist, watchServices, setValue]);

  // Handle walk-in toggle (set current time)
  useEffect(() => {
    if (!watchIsScheduled && !isEditing) {
      setValue('scheduledAt', format(new Date(), "yyyy-MM-dd'T'HH:mm"));
    }
  }, [watchIsScheduled, isEditing, setValue]);

  // Handle form submission
  const onSubmit = async (data: AppointmentFormData) => {
    setIsSubmitting(true);
    setFormError(null);

    try {
      // Validate date is in the future (only for new appointments)
      if (!isEditing && watchIsScheduled) {
        const selectedDate = new Date(data.scheduledAt);
        const now = new Date();
        if (selectedDate < now) {
          setError('scheduledAt', {
            type: 'manual',
            message:
              'La fecha y hora deben ser posteriores a la fecha y hora actuales',
          });
          setIsSubmitting(false);
          return;
        }
      }

      // Validate at least one service
      if (data.services.length === 0) {
        setFormError('Debe agregar al menos un servicio');
        setIsSubmitting(false);
        return;
      }

      // Validate all services have manicurist
      const missingManicurist = data.services.some(s => !s.manicuristId);
      if (missingManicurist) {
        setFormError(
          'Todos los servicios deben tener una manicurista asignada'
        );
        setIsSubmitting(false);
        return;
      }

      // Extract only fields needed for server action (exclude UI-only fields)
      const {
        useSameManicurist: _useSameManicurist,
        primaryManicuristId: _primaryManicuristId,
        applyDiscount: _applyDiscount,
        discountType: _discountType,
        discountAmount: _discountAmount,
        discountPercentage: _discountPercentage,
        discountReason: _discountReason,
        discountAffectsCommission: _discountAffectsCommission,
        ...appointmentData
      } = data;

      let result;

      if (isEditing) {
        result = await updateAppointment(
          appointment.id,
          spaId,
          branchId,
          appointmentData
        );
      } else {
        result = await createAppointment(spaId, branchId, appointmentData);
      }

      if (result.success) {
        reset();
        onClose();
        // Refresh the page to show the new appointment
        router.refresh();
      } else {
        setFormError(result.error || 'Error al guardar la cita');
      }
    } catch {
      // Error submitting appointment
      setFormError('Error inesperado al guardar la cita');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update clients list when formData changes
  useEffect(() => {
    setClientsList(formData.clients);
  }, [formData.clients]);

  // Load available manicurists when modal opens with existing appointment or services
  useEffect(() => {
    if (isOpen && watchServices && watchServices.length > 0) {
      watchServices.forEach((service, index) => {
        if (service.serviceId && service.estimatedDuration) {
          const scheduledAt =
            watchScheduledAt || format(new Date(), "yyyy-MM-dd'T'HH:mm");
          const isScheduled = watchIsScheduled ?? true;

          // Don't debounce initial load
          fetchAvailableManicurists(
            index,
            service.serviceId,
            scheduledAt,
            service.estimatedDuration,
            isScheduled
          );
        }
      });
    }
  }, [
    isOpen,
    watchServices,
    watchScheduledAt,
    watchIsScheduled,
    fetchAvailableManicurists,
  ]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      reset();
      setFormError(null);
    }
  }, [isOpen, reset]);

  // Reset form with appointment data when opening in edit mode or for new appointment
  useEffect(() => {
    if (isOpen) {
      reset(getDefaultFormValues(appointment));
      setFormError(null);
    }
  }, [isOpen, appointment?.id, reset, getDefaultFormValues]);

  // Add empty service when opening modal for new appointment
  useEffect(() => {
    if (isOpen && !isEditing && fields.length === 0) {
      append({
        serviceId: '',
        manicuristId: '',
        price: 0,
        estimatedDuration: 0,
      });
    }
  }, [isOpen, isEditing, fields.length, append]);

  // Handle successful client creation
  const handleClientCreated = (newClient: {
    id: string;
    name: string;
    phone: string;
  }) => {
    // Add the new client to the list
    const updatedClients = [...clientsList, newClient];
    setClientsList(updatedClients);

    // Select the new client automatically
    setValue('clientId', newClient.id);

    // Close the client modal
    setIsClientModalOpen(false);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={isEditing ? 'Editar Cita' : 'Nueva Cita'}
        size="2xl"
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col h-full"
        >
          {/* Error message */}
          {formError && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg flex-shrink-0 mb-4">
              {formError}
            </div>
          )}

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 flex-1 min-h-0">
            {/* Left Column - Form (4/5 width) with scroll */}
            <div className="lg:col-span-4 flex flex-col min-h-0">
              <div className="space-y-4 overflow-y-auto pr-4 pl-2 pb-4 custom-scrollbar flex-1 min-h-0">
                {/* Basic Information */}
                <BasicInformationSection
                  control={control}
                  register={register}
                  clearErrors={clearErrors}
                  errors={errors}
                  isScheduled={!!watchIsScheduled}
                  clientsList={clientsList}
                  onOpenClientModal={() => setIsClientModalOpen(true)}
                />

                {/* Discount Section */}
                <DiscountSection
                  totalPrice={totalPrice}
                  control={control}
                  setValue={setValue}
                  errors={errors}
                  watchApplyDiscount={watchApplyDiscount ?? false}
                  watchDiscountType={watchDiscountType}
                  watchDiscountPercentage={watchDiscountPercentage}
                  calculatedDiscountAmount={calculatedDiscountAmount}
                />

                {/* Services Section */}
                <ServicesSection
                  control={control}
                  watch={watch}
                  fields={fields}
                  register={register}
                  errors={errors}
                  formData={formData}
                  filteredServices={filteredServices}
                  useSameManicurist={watchUseSameManicurist ?? false}
                  availableManicurists={availableManicurists}
                  loadingManicurists={loadingManicurists}
                  loadingManicuristServices={loadingManicuristServices}
                  onAddService={handleAddService}
                  onRemoveService={remove}
                  onServiceSelect={handleServiceSelect}
                />
              </div>
            </div>

            {/* Right Column - Totals Summary (1/5 width) */}
            <div className="lg:col-span-1">
              <AppointmentSummary
                totalServices={fields.length}
                totalPrice={totalPrice}
                totalDuration={totalDuration}
                calculatedDiscountAmount={calculatedDiscountAmount}
                finalPrice={finalPrice}
                isScheduled={watchIsScheduled ?? true}
                scheduledAt={
                  watchScheduledAt || format(new Date(), "yyyy-MM-dd'T'HH:mm")
                }
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-3 border-t flex-shrink-0 mt-auto">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting
                ? 'Guardando...'
                : isEditing
                  ? 'Actualizar Cita'
                  : 'Crear Cita'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Client Creation Modal */}
      <InlineClientModal
        isOpen={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
        onClientCreated={handleClientCreated}
        spaId={spaId}
        branchId={branchId}
      />
    </>
  );
}
