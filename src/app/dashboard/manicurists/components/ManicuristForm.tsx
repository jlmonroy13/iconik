'use client'

import { useForm, FormProvider, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input, Select, useNotifications, MultiSelect } from '@/components/ui'
import { manicuristFormSchema, type ManicuristFormData, ManicuristScheduleData, ManicuristAvailabilityData } from '../schemas'
import { Manicurist } from '../types'
import type { Service } from '@/types'
import { ManicuristScheduleForm } from './ManicuristScheduleForm'
import { ManicuristAvailabilityForm } from './ManicuristAvailabilityForm'

// Extend ManicuristFormData to include selectedServices
type ExtendedManicuristFormData = ManicuristFormData & {
  selectedServices?: string[]
}

interface ManicuristFormProps {
  manicurist?: Manicurist & {
    schedules?: ManicuristScheduleData[];
    availability?: ManicuristAvailabilityData[];
  }
  onSubmit: (data: ExtendedManicuristFormData) => Promise<void>
  services: Service[]
  selectedServices: string[]
  setSelectedServices: (ids: string[]) => void
  formId: string
}

export function ManicuristForm({ manicurist, onSubmit, services, selectedServices, setSelectedServices, formId }: ManicuristFormProps) {
  const methods = useForm<ExtendedManicuristFormData>({
    resolver: zodResolver(manicuristFormSchema),
    defaultValues: manicurist ? {
      name: manicurist.name,
      email: manicurist.email || '',
      phone: manicurist.phone || '',
      commission: typeof manicurist.commission === 'number' ? manicurist.commission * 100 : 50,
      isActive: manicurist.isActive,
      schedules: manicurist.schedules || [],
      availability: (manicurist.availability || []).map(a => ({
        ...a,
        startTime: a.isAvailable ? a.startTime : undefined,
        endTime: a.isAvailable ? a.endTime : undefined,
      })),
    } : {
      name: '',
      email: '',
      phone: '',
      commission: 50,
      isActive: true,
      schedules: [],
      availability: [],
    }
  })

  const { register, handleSubmit, control, formState: { errors } } = methods
  const { showSuccess, showError } = useNotifications()

  const onSubmitForm = async (data: ExtendedManicuristFormData) => {
    try {
      const formData = {
        ...data,
        commission: (data.commission || 0) / 100,
        selectedServices,
        availability: data.availability?.map(a => ({
          ...a,
          date: typeof a.date === 'string' ? new Date(a.date) : a.date,
          startTime: a.isAvailable ? a.startTime : undefined,
          endTime: a.isAvailable ? a.endTime : undefined,
        })),
      }
      console.log("formData", formData)
      await onSubmit(formData)
      showSuccess(
        manicurist ? 'Manicurista actualizada' : 'Manicurista creada',
        manicurist
          ? 'Los datos de la manicurista han sido actualizados exitosamente.'
          : 'La manicurista ha sido creada exitosamente.'
      )
    } catch {
      showError(
        'Error',
        'Hubo un error al procesar tu solicitud. Por favor intenta de nuevo.'
      )
    }
  }

  return (
    <FormProvider {...methods}>
      <form id={formId} onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
        {/* Información básica */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b pb-2">
            Información básica
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nombre completo"
              placeholder="Ingresa el nombre completo"
              {...register("name")}
              error={errors.name?.message}
            />
            <Input
              label="Email"
              type="email"
              placeholder="ejemplo@email.com"
              {...register("email")}
              error={errors.email?.message}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 justify-items-center items-start">
            <Input
              label="Teléfono"
              placeholder="+52 55 1234 5678"
              {...register("phone")}
              error={errors.phone?.message}
            />
            <Controller
              name="commission"
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-1 w-full relative">
                  <Input
                    label="Comisión (%)"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={3}
                    placeholder="50"
                    value={field.value === 0 ? "" : field.value}
                    onChange={(e) => {
                      const val = e.target.value.replace(/^0+(?=\d)/, "");
                      if (val === "") {
                        field.onChange("");
                      } else {
                        const num = Math.max(0, Math.min(100, Number(val)));
                        field.onChange(isNaN(num) ? "" : num);
                      }
                    }}
                    error={errors.commission?.message}
                  />
                  <span className="text-gray-400 -ml-5 select-none pointer-events-none absolute right-2 bottom-2">
                    %
                  </span>
                </div>
              )}
            />
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <Select
                  label="Estado"
                  value={field.value ? "true" : "false"}
                  onChange={(e) => field.onChange(e.target.value === "true")}
                  error={errors.isActive?.message}
                >
                  <option value="true">✅ Activo</option>
                  <option value="false">❌ Inactivo</option>
                </Select>
              )}
            />
          </div>
          {/* MultiSelect de servicios */}
          <div className="w-full">
            <MultiSelect
              label="Servicios que realiza"
              placeholder="Seleccionar servicios..."
              options={services.map((service) => ({
                value: service.id,
                label: service.name,
              }))}
              value={selectedServices}
              onChange={setSelectedServices}
            />
          </div>
        </div>
        {/* Horarios de trabajo */}
        <div className="space-y-4">
          <ManicuristScheduleForm />
        </div>
        {/* Disponibilidad especial */}
        <div className="space-y-4">
          <ManicuristAvailabilityForm />
        </div>
      </form>
    </FormProvider>
  );
}
