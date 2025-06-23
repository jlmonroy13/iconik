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
  useNotificationsContext
} from '@/components/ui'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { updateUserPassword } from '../actions'
import { User } from '@/generated/prisma'

const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(1, {
      message: 'Debes ingresar tu contraseña actual.',
    }),
    newPassword: z.string().min(8, {
      message: 'La nueva contraseña debe tener al menos 8 caracteres.',
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Las contraseñas no coinciden.',
    path: ['confirmPassword'], // Path of error
  })

type PasswordFormValues = z.infer<typeof passwordFormSchema>

interface ChangePasswordFormProps {
  user: User
}

export function ChangePasswordForm({ user }: ChangePasswordFormProps) {
  const [isPending, startTransition] = useTransition()
  const { showSuccess, showError } = useNotificationsContext()

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const onSubmit = (data: PasswordFormValues) => {
    startTransition(async () => {
      const result = await updateUserPassword(user.id, { newPassword: data.newPassword })
      if (result.success) {
        showSuccess(result.message ?? '¡Contraseña actualizada!')
        form.reset()
      } else {
        showError('Error al actualizar contraseña', result.error ?? 'Ocurrió un error.')
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
