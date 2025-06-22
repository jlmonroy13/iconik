'use server'

import { prisma } from '@/lib/prisma'
import type { Spa } from '@/generated/prisma'
import { revalidatePath } from 'next/cache'

export async function updateSpaSettings(
  spaId: string,
  formData: Partial<Spa>
) {
  try {
    const updatedSpa = await prisma.spa.update({
      where: { id: spaId },
      data: {
        name: formData.name,
        address: formData.address,
        phone: formData.phone,
        email: formData.email
      }
    })

    revalidatePath('/dashboard/settings')

    return {
      success: true,
      data: updatedSpa
    }
  } catch (error) {
    console.error('Error updating spa settings:', error)
    return {
      success: false,
      error: 'No se pudo actualizar la configuración del spa.'
    }
  }
}
