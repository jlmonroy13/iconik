'use client'

import { useForm } from 'react-hook-form'
import { useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Spa } from '@/generated/prisma'
import { updateSpaSettings } from '../actions'
import { SpaSettingsSchema, type SpaSettingsFormValues } from '../schemas'
import {
  Button,
  Input,
  useNotifications,
} from '@/components/ui'

interface SpaSettingsFormProps {
  spa: Spa
}

export function SpaSettingsForm({ spa }: SpaSettingsFormProps) {
  const [isPending, startTransition] = useTransition()
  const { showSuccess, showError } = useNotifications()

  const form = useForm<SpaSettingsFormValues>({
    resolver: zodResolver(SpaSettingsSchema),
    defaultValues: {
      name: spa.name || '',
      address: spa.address || '',
      phone: spa.phone || '',
      email: spa.email || '',
      logoUrl: spa.logoUrl || '',
    },
  })

  const onSubmit = (data: SpaSettingsFormValues) => {
    startTransition(async () => {
      const result = await updateSpaSettings(data)
      if (result.success) {
        showSuccess('Configuración guardada', 'La información de tu spa ha sido actualizada.')
        form.reset(data)
      } else {
        showError('Error al guardar', result.message)
      }
    })
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Input
            label="Nombre del Spa"
            {...form.register('name')}
            error={form.formState.errors.name?.message}
            disabled={isPending}
          />
        </div>
        <div className="space-y-2">
          <Input
            label="Email de Contacto"
            type="email"
            {...form.register('email')}
            error={form.formState.errors.email?.message}
            disabled={isPending}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Input
          label="Dirección"
          {...form.register('address')}
          error={form.formState.errors.address?.message}
          disabled={isPending}
        />
      </div>

      <div className="space-y-2">
        <Input
          label="Teléfono"
          {...form.register('phone')}
          error={form.formState.errors.phone?.message}
          disabled={isPending}
        />
      </div>

      <div className="space-y-2">
        <Input
          label="URL del Logo"
          type="url"
          placeholder="https://ejemplo.com/logo.png"
          {...form.register('logoUrl')}
          error={form.formState.errors.logoUrl?.message}
          disabled={isPending}
        />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          URL de la imagen del logo de tu spa (opcional)
        </p>
      </div>

      <div className="flex justify-end gap-3 mt-8">
        <Button
          type="button"
          variant="secondary"
          onClick={() => form.reset(form.formState.defaultValues)}
          disabled={!form.formState.isDirty || isPending}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={!form.formState.isDirty || isPending}>
          {isPending ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </div>
    </form>
  )
}
