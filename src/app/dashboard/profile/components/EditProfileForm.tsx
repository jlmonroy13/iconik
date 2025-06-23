'use client'

import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { toast } from 'react-hot-toast'
import { updateUserProfile } from '../actions'
import { User } from '@/generated/prisma'

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: 'El nombre debe tener al menos 2 caracteres.',
  }),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

interface EditProfileFormProps {
  user: User
}

export function EditProfileForm({ user }: EditProfileFormProps) {
  const [isPending, startTransition] = useTransition()

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user.name ?? '',
    },
  })

  const onSubmit = (data: ProfileFormValues) => {
    startTransition(async () => {
      const result = await updateUserProfile(user.id, data)
      if (result.success) {
        toast.success('¡Perfil actualizado con éxito!')
        // Optionally reset form if needed
        // form.reset(result.data)
      } else {
        toast.error(result.error ?? 'Ocurrió un error al actualizar.')
      }
    })
  }

  return (
    <Card>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle>Editar Perfil</CardTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Actualiza tu nombre y correo electrónico.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            id="name"
            label="Nombre"
            {...form.register('name')}
            disabled={isPending}
            error={form.formState.errors.name?.message}
          />
          <Input
            id="email"
            label="Correo Electrónico"
            type="email"
            defaultValue={user.email}
            disabled
          />
        </CardContent>
        <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </form>
    </Card>
  )
}
