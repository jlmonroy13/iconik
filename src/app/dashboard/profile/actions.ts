'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import {
  type ProfileFormValues,
  type PasswordFormValues,
  ProfileFormSchema,
  PasswordFormSchema,
} from './schemas'

export async function updateUserProfile(
  userId: string,
  data: ProfileFormValues
) {
  try {
    const validatedData = ProfileFormSchema.parse(data)

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: validatedData,
    })

    revalidatePath('/dashboard/profile')

    return {
      success: true,
      data: updatedUser,
    }
  } catch (error) {
    console.error('Error updating user profile:', error)
    return {
      success: false,
      message: 'No se pudo actualizar el perfil.',
    }
  }
}

// NOTE: In a real-world app, you'd add password checking logic here.
export async function updateUserPassword(
  userId: string,
  data: PasswordFormValues
) {
  try {
    const validatedData = PasswordFormSchema.parse(data)

    // In a real app, you would hash the new password before saving it
    // const hashedPassword = await bcrypt.hash(validatedData.newPassword, 10)

    await prisma.user.update({
      where: { id: userId },
      data: {
        password: validatedData.newPassword, // Should be hashedPassword
      },
    })

    return {
      success: true,
      message: 'Contraseña actualizada con éxito.',
    }
  } catch (error) {
    console.error('Error updating user password:', error)
    return {
      success: false,
      message: 'No se pudo actualizar la contraseña.',
    }
  }
}
