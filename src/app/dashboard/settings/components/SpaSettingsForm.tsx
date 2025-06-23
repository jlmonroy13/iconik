'use client'

import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Spa } from '@/generated/prisma'
import { updateSpaSettings } from '../actions'
import { Button, Input } from '@/components/ui'
import { toast } from 'react-hot-toast'

const spaSettingsSchema = z.object({
  name: z.string().min(1, 'El nombre del spa es requerido'),
  address: z.string().min(1, 'La dirección es requerida'),
  phone: z.string().min(1, 'El teléfono es requerido'),
  email: z.string().min(1, 'El email es requerido').email('Email inválido')
})

type SpaSettingsFormValues = z.infer<typeof spaSettingsSchema>

interface SpaSettingsFormProps {
  spa: Spa
}

export function SpaSettingsForm({ spa }: SpaSettingsFormProps) {
  const [isPending, startTransition] = useTransition()

  const form = useForm<SpaSettingsFormValues>({
    resolver: zodResolver(spaSettingsSchema),
    defaultValues: {
      name: spa.name || '',
      address: spa.address || '',
      phone: spa.phone || '',
      email: spa.email || ''
    }
  })

  const onSubmit = async (data: SpaSettingsFormValues) => {
    startTransition(async () => {
      const result = await updateSpaSettings(spa.id, data)
      if (result.success) {
        toast.success('¡Configuración guardada con éxito!')
      } else {
        toast.error(result.error || 'Ocurrió un error al guardar.')
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

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </div>
    </form>
  )
}
