'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { SpaSettingsSchema, type SpaSettingsFormValues } from './schemas'

export async function updateSpaSettings(
  spaId: string,
  data: SpaSettingsFormValues
) {
  try {
    const validatedData = SpaSettingsSchema.parse(data)

    const updatedSpa = await prisma.spa.update({
      where: { id: spaId },
      data: validatedData,
    })

    revalidatePath('/dashboard/settings')

    return {
      success: true,
      data: updatedSpa,
    }
  } catch (error) {
    console.error('Error updating spa settings:', error)
    // Return a structured error
    return {
      success: false,
      message: 'No se pudo actualizar la configuración del spa. Inténtalo de nuevo.',
    }
  }
}
