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
import { updateUserPassword } from '../actions'
import { User } from '@/generated/prisma'
import { PasswordFormSchema, type PasswordFormValues } from '../schemas'

interface ChangePasswordFormProps {
  user: User
}

export function ChangePasswordForm({ user }: ChangePasswordFormProps) {
  const [isPending, startTransition] = useTransition()
  const { showSuccess, showError } = useNotifications()

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(PasswordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const onSubmit = (data: PasswordFormValues) => {
    startTransition(async () => {
      const result = await updateUserPassword(user.id, data)
      if (result.success) {
        showSuccess(result.message ?? '¡Contraseña actualizada!')
        form.reset()
      } else {
        showError('Error al actualizar contraseña', result.message ?? 'Ocurrió un error.')
      }
    })
  }

  return (
    <Card>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle>Cambiar Contraseña</CardTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Para tu seguridad, te recomendamos usar una contraseña segura.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            id="currentPassword"
            label="Contraseña Actual"
            type="password"
            {...form.register('currentPassword')}
            disabled={isPending}
            error={form.formState.errors.currentPassword?.message}
          />
          <Input
            id="newPassword"
            label="Nueva Contraseña"
            type="password"
            {...form.register('newPassword')}
            disabled={isPending}
            error={form.formState.errors.newPassword?.message}
          />
          <Input
            id="confirmPassword"
            label="Confirmar Nueva Contraseña"
            type="password"
            {...form.register('confirmPassword')}
            disabled={isPending}
            error={form.formState.errors.confirmPassword?.message}
          />
        </CardContent>
        <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Actualizando...' : 'Actualizar Contraseña'}
          </Button>
        </div>
      </form>
    </Card>
  )
}
