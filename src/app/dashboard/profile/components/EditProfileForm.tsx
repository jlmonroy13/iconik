'use client'

import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  useNotifications,
  Button,
  Input,
} from '@/components/ui'
import { updateUserProfile } from '../actions'
import { User } from '@/generated/prisma'
import { ProfileFormSchema, type ProfileFormValues } from '../schemas'

interface EditProfileFormProps {
  user: User
}

export function EditProfileForm({ user }: EditProfileFormProps) {
  const [isPending, startTransition] = useTransition()
  const { showSuccess, showError } = useNotifications()

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues: {
      name: user.name ?? '',
    },
  })

  const onSubmit = (data: ProfileFormValues) => {
    startTransition(async () => {
      const result = await updateUserProfile(user.id, data)
      if (result.success) {
        showSuccess('¡Perfil actualizado con éxito!')
        form.reset({ name: result.data?.name ?? '' })
      } else {
        showError('Error al actualizar', result.message ?? 'Ocurrió un error.')
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
