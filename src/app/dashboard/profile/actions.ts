'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

interface UpdateProfileData {
  name: string
}

export async function updateUserProfile(
  userId: string,
  data: UpdateProfileData
) {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
      },
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
      error: 'No se pudo actualizar el perfil.',
    }
  }
}

// NOTE: In a real-world app, you'd add password checking logic here.
// For example, using bcrypt.compare() to check the current password.
interface UpdatePasswordData {
  newPassword?: string
}

export async function updateUserPassword(
  userId: string,
  data: UpdatePasswordData
) {
  try {
    // In a real app, you would hash the new password before saving it
    // const hashedPassword = await bcrypt.hash(data.newPassword, 10)

    await prisma.user.update({
      where: { id: userId },
      data: {
        password: data.newPassword, // Should be hashedPassword
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
      error: 'No se pudo actualizar la contraseña.',
    }
  }
}
