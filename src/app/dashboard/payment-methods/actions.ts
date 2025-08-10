'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getCurrentSpaId } from '@/lib/utils/spa-utils';
import {
  paymentMethodExtendedSchema,
  type PaymentMethodExtendedFormData,
} from './schemas';

async function getSpaId() {
  return await getCurrentSpaId();
}

export async function getPaymentMethods() {
  try {
    const spaId = await getSpaId();
    const methods = await prisma.paymentMethod.findMany({
      where: { spaId },
      orderBy: [{ createdAt: 'desc' }],
    });
    return { success: true, data: methods };
  } catch (error) {
    console.error('Error al obtener métodos de pago:', error);
    return {
      success: false,
      message: 'No se pudieron cargar los métodos de pago. Inténtalo de nuevo.',
    };
  }
}

export async function createPaymentMethod(data: PaymentMethodExtendedFormData) {
  try {
    const spaId = await getSpaId();
    const validated = paymentMethodExtendedSchema.parse(data);
    const method = await prisma.paymentMethod.create({
      data: { ...validated, spaId },
    });
    revalidatePath('/dashboard/payment-methods');
    return { success: true, data: method };
  } catch (error) {
    console.error('Error al crear método de pago:', error);
    return {
      success: false,
      message: 'No se pudo crear el método de pago. Inténtalo de nuevo.',
    };
  }
}

export async function updatePaymentMethod(
  id: string,
  data: PaymentMethodExtendedFormData
) {
  try {
    const spaId = await getSpaId();
    const validated = paymentMethodExtendedSchema.parse(data);
    const existing = await prisma.paymentMethod.findFirst({
      where: { id, spaId },
    });
    if (!existing) {
      return { success: false, message: 'Método de pago no encontrado.' };
    }
    const method = await prisma.paymentMethod.update({
      where: { id },
      data: validated,
    });
    revalidatePath('/dashboard/payment-methods');
    return { success: true, data: method };
  } catch (error) {
    console.error('Error al actualizar método de pago:', error);
    return {
      success: false,
      message: 'No se pudo actualizar el método de pago. Inténtalo de nuevo.',
    };
  }
}

export async function deletePaymentMethod(id: string) {
  try {
    const spaId = await getSpaId();
    const existing = await prisma.paymentMethod.findFirst({
      where: { id, spaId },
      include: { payments: true },
    });
    if (!existing) {
      return { success: false, message: 'Método de pago no encontrado.' };
    }
    if (existing.payments.length > 0) {
      return {
        success: false,
        message:
          'No se puede eliminar el método de pago porque tiene pagos asociados.',
      };
    }
    await prisma.paymentMethod.delete({ where: { id } });
    revalidatePath('/dashboard/payment-methods');
    return { success: true };
  } catch (error) {
    console.error('Error al eliminar método de pago:', error);
    return {
      success: false,
      message: 'No se pudo eliminar el método de pago. Inténtalo de nuevo.',
    };
  }
}
