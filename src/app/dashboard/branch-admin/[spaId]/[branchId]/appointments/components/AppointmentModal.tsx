'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import {
  Modal,
  Button,
  Input,
  SearchSelect,
  Textarea,
  Switch,
} from '@/components/ui';
import { createAppointmentSchema, type CreateClientData } from '@/types/forms';
import type {
  AppointmentWithDetails,
  AppointmentFormDropdownData,
} from '@/types';
import { createAppointment, updateAppointment } from '../actions';
import { createClient } from '../../clients/actions';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment?: AppointmentWithDetails;
  formData: AppointmentFormDropdownData;
  spaId: string;
  branchId: string;
}

interface InlineClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClientCreated: (client: {
    id: string;
    name: string;
    phone: string;
  }) => void;
  spaId: string;
  branchId: string;
}

// Inline client creation modal specifically for appointment flow
function InlineClientModal({
  isOpen,
  onClose,
  onClientCreated,
  spaId,
  branchId,
}: InlineClientModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      name: '',
      documentType: 'CC' as const,
      documentNumber: '',
      phone: '',
      email: '',
      birthday: '',
      notes: '',
    },
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: '',
        documentType: 'CC',
        documentNumber: '',
        phone: '',
        email: '',
        birthday: '',
        notes: '',
      });
      setError(null);
    }
  }, [isOpen, form]);

  const onSubmit = async (data: CreateClientData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await createClient(spaId, branchId, data);

      if (result.success && result.data) {
        // Call the callback with the new client data
        onClientCreated({
          id: result.data.id,
          name: result.data.name,
          phone: result.data.phone || '',
        });
        onClose();
      } else {
        setError(result.error || 'Error al crear el cliente');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Crear Cliente Rápido"
      size="lg"
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Required fields only for quick creation */}
        <Input
          label="Nombre Completo *"
          {...form.register('name', { required: 'El nombre es requerido' })}
          placeholder="Nombre completo del cliente"
          error={form.formState.errors.name?.message}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Documento *"
            {...form.register('documentNumber', {
              required: 'El documento es requerido',
            })}
            placeholder="Número de documento"
            error={form.formState.errors.documentNumber?.message}
          />

          <Input
            label="Teléfono *"
            {...form.register('phone', {
              required: 'El teléfono es requerido',
            })}
            placeholder="Ej: 3001234567"
            error={form.formState.errors.phone?.message}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting} variant="primary">
            {isSubmitting ? 'Creando...' : 'Crear y Seleccionar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

type AppointmentFormData = {
  clientId: string;
  scheduledAt: string;
  isScheduled: boolean;
  notes: string;
  useSameManicurist: boolean;
  primaryManicuristId: string;
  services: Array<{
    serviceId: string;
    manicuristId: string;
    price: number;
    estimatedDuration: number;
  }>;
};

export function AppointmentModal({
  isOpen,
  onClose,
  appointment,
  formData,
  spaId,
  branchId,
}: AppointmentModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [clientsList, setClientsList] = useState(formData.clients);

  const isEditing = !!appointment;

  // Initialize form
  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(createAppointmentSchema),
    defaultValues: {
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
    },
  });

  // Field array for services
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'services',
  });

  // Watch form values
  const watchServices = watch('services');
  const watchUseSameManicurist = watch('useSameManicurist');
  const watchPrimaryManicurist = watch('primaryManicuristId');
  const watchIsScheduled = watch('isScheduled');

  // Calculate totals
  const totalPrice =
    watchServices?.reduce((sum, s) => sum + (s.price || 0), 0) || 0;
  const totalDuration =
    watchServices?.reduce((sum, s) => sum + (s.estimatedDuration || 0), 0) || 0;

  // Handle adding a service
  const handleAddService = () => {
    append({
      serviceId: '',
      manicuristId: watchUseSameManicurist ? watchPrimaryManicurist : '',
      price: 0,
      estimatedDuration: 0,
    });
  };

  // Handle service selection (auto-fill price and duration)
  const handleServiceSelect = (index: number, serviceId: string) => {
    const service = formData.services.find(s => s.id === serviceId);
    if (service) {
      setValue(`services.${index}.price`, service.price);
      setValue(`services.${index}.estimatedDuration`, service.duration);
    }
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
    setError(null);

    try {
      // Validate at least one service
      if (data.services.length === 0) {
        setError('Debe agregar al menos un servicio');
        setIsSubmitting(false);
        return;
      }

      // Validate all services have manicurist
      const missingManicurist = data.services.some(s => !s.manicuristId);
      if (missingManicurist) {
        setError('Todos los servicios deben tener una manicurista asignada');
        setIsSubmitting(false);
        return;
      }

      let result;

      if (isEditing) {
        result = await updateAppointment(appointment.id, spaId, branchId, data);
      } else {
        result = await createAppointment(spaId, branchId, data);
      }

      if (result.success) {
        reset();
        onClose();
      } else {
        setError(result.error || 'Error al guardar la cita');
      }
    } catch {
      // Error submitting appointment
      setError('Error inesperado al guardar la cita');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update clients list when formData changes
  useEffect(() => {
    setClientsList(formData.clients);
  }, [formData.clients]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      reset();
      setError(null);
    }
  }, [isOpen, reset]);

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
        size="xl"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Error message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Información Básica
            </h3>

            {/* Client Selection */}
            <div className="space-y-2">
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Controller
                    name="clientId"
                    control={control}
                    render={({ field }) => (
                      <SearchSelect
                        label="Cliente"
                        placeholder="Buscar cliente..."
                        options={clientsList.map(c => ({
                          value: c.id,
                          label: `${c.name} - ${c.phone}`,
                          searchText: `${c.name} ${c.phone} ${c.email || ''}`,
                        }))}
                        value={field.value}
                        onChange={field.onChange}
                        error={errors.clientId?.message}
                        required
                      />
                    )}
                  />
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsClientModalOpen(true)}
                  className="whitespace-nowrap"
                >
                  + Crear Cliente
                </Button>
              </div>
            </div>

            {/* Walk-in Toggle */}
            <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Controller
                  name="isScheduled"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Cita agendada{' '}
                  {watchIsScheduled ? '(activado)' : '(desactivado - walk-in)'}
                </label>
              </div>
              {!watchIsScheduled && (
                <p className="text-sm text-amber-600 dark:text-amber-400 mt-3 flex items-start gap-2">
                  <span>ℹ️</span>
                  <span>
                    <strong>Walk-in:</strong> La cita comenzará inmediatamente
                    sin necesidad de agendar una hora específica.
                  </span>
                </p>
              )}
            </div>

            {/* Date and Time */}
            {watchIsScheduled && (
              <Input
                label="Fecha y Hora"
                type="datetime-local"
                {...register('scheduledAt')}
                error={errors.scheduledAt?.message}
                required
              />
            )}

            {/* Notes */}
            <Textarea
              label="Notas"
              placeholder="Notas adicionales sobre la cita..."
              {...register('notes')}
              error={errors.notes?.message}
              rows={3}
            />
          </div>

          {/* Services Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Servicios
              </h3>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleAddService}
              >
                + Agregar Servicio
              </Button>
            </div>

            {/* Same Manicurist Toggle */}
            {fields.length > 1 && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Controller
                    name="useSameManicurist"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Usar la misma manicurista para todos los servicios
                  </label>
                </div>

                {watchUseSameManicurist && (
                  <div className="mt-4">
                    <Controller
                      name="primaryManicuristId"
                      control={control}
                      render={({ field }) => (
                        <SearchSelect
                          label="Manicurista para todos los servicios"
                          placeholder="Seleccionar manicurista..."
                          options={formData.manicurists.map(m => ({
                            value: m.id,
                            label: m.name,
                          }))}
                          value={field.value}
                          onChange={field.onChange}
                          required={watchUseSameManicurist}
                        />
                      )}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Services List */}
            {fields.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  No hay servicios agregados a esta cita
                </p>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={handleAddService}
                >
                  Agregar Primer Servicio
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Servicio {index + 1}
                      </h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                      >
                        Eliminar
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Service Selection */}
                      <Controller
                        name={`services.${index}.serviceId`}
                        control={control}
                        render={({ field: selectField }) => (
                          <SearchSelect
                            label="Servicio"
                            placeholder="Seleccionar servicio..."
                            options={formData.services.map(s => ({
                              value: s.id,
                              label: `${s.name} - $${s.price.toLocaleString()}`,
                              searchText: `${s.name} ${s.type}`,
                            }))}
                            value={selectField.value}
                            onChange={value => {
                              selectField.onChange(value);
                              handleServiceSelect(index, value);
                            }}
                            error={errors.services?.[index]?.serviceId?.message}
                            required
                          />
                        )}
                      />

                      {/* Manicurist Selection (if not using same for all) */}
                      {!watchUseSameManicurist && (
                        <Controller
                          name={`services.${index}.manicuristId`}
                          control={control}
                          render={({ field: selectField }) => (
                            <SearchSelect
                              label="Manicurista"
                              placeholder="Seleccionar manicurista..."
                              options={formData.manicurists.map(m => ({
                                value: m.id,
                                label: m.name,
                              }))}
                              value={selectField.value}
                              onChange={selectField.onChange}
                              error={
                                errors.services?.[index]?.manicuristId?.message
                              }
                              required
                            />
                          )}
                        />
                      )}

                      {/* Price */}
                      <Input
                        label="Precio"
                        type="number"
                        step="0.01"
                        {...register(`services.${index}.price`, {
                          valueAsNumber: true,
                        })}
                        error={errors.services?.[index]?.price?.message}
                        required
                      />

                      {/* Duration */}
                      <Input
                        label="Duración (minutos)"
                        type="number"
                        {...register(`services.${index}.estimatedDuration`, {
                          valueAsNumber: true,
                        })}
                        error={
                          errors.services?.[index]?.estimatedDuration?.message
                        }
                        required
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Totals */}
            {fields.length > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Total de Servicios
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {fields.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Precio Total
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${totalPrice.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Duración Total
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {totalDuration} min
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Hora Estimada de Fin
                    </p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {watchIsScheduled && watchServices.length > 0
                        ? format(
                            new Date(
                              new Date(watch('scheduledAt')).getTime() +
                                totalDuration * 60000
                            ),
                            'HH:mm'
                          )
                        : '--:--'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
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
