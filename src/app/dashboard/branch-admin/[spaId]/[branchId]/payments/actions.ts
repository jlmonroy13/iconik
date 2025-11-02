'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/../../auth';
import { prisma } from '@/lib/prisma';
import type { ServerActionResult } from '@/types/api';
import type { PaymentWithDetails } from '@/types/payments';
import { getPaymentById } from './queries';

// ============================================
// PAYMENT QUERY OPERATIONS
// ============================================

/**
 * Fetch payment by ID (for payment detail modal)
 */
export async function fetchPaymentById(
  paymentId: string
): Promise<ServerActionResult<PaymentWithDetails>> {
  try {
    const payment = await getPaymentById(paymentId);

    if (!payment) {
      return { success: false, error: 'Pago no encontrado' };
    }

    return { success: true, data: payment };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al cargar pago',
    };
  }
}

// ============================================
// COMMISSION OPERATIONS
// ============================================

/**
 * Mark a commission as paid
 */
export async function markCommissionAsPaid(
  commissionId: string,
  spaId: string,
  branchId: string
): Promise<ServerActionResult<void>> {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'BRANCH_ADMIN') {
      return { success: false, error: 'No autorizado' };
    }

    // Verify access
    if (session.user.branchId !== branchId) {
      return { success: false, error: 'No tienes acceso a esta sede' };
    }

    // Verify commission exists and belongs to this spa/branch
    const existingCommission = await prisma.commission.findUnique({
      where: { id: commissionId },
      include: {
        payment: {
          select: {
            spaId: true,
            branchId: true,
          },
        },
      },
    });

    if (!existingCommission) {
      return { success: false, error: 'Comisión no encontrada' };
    }

    if (existingCommission.payment.spaId !== spaId) {
      return { success: false, error: 'Comisión no pertenece a este spa' };
    }

    if (existingCommission.payment.branchId !== branchId) {
      return { success: false, error: 'Comisión no pertenece a esta sede' };
    }

    if (existingCommission.status === 'PAID') {
      return {
        success: false,
        error: 'Esta comisión ya ha sido marcada como pagada',
      };
    }

    // Update commission status
    await prisma.commission.update({
      where: { id: commissionId },
      data: { status: 'PAID' },
    });

    revalidatePath(`/dashboard/branch-admin/${spaId}/${branchId}/payments`);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Error al marcar comisión como pagada',
    };
  }
}

/**
 * Mark multiple commissions as paid
 */
export async function markCommissionsAsPaid(
  commissionIds: string[],
  spaId: string,
  branchId: string
): Promise<ServerActionResult<void>> {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'BRANCH_ADMIN') {
      return { success: false, error: 'No autorizado' };
    }

    // Verify access
    if (session.user.branchId !== branchId) {
      return { success: false, error: 'No tienes acceso a esta sede' };
    }

    // Verify all commissions exist and belong to this spa/branch
    const existingCommissions = await prisma.commission.findMany({
      where: {
        id: { in: commissionIds },
      },
      include: {
        payment: {
          select: {
            spaId: true,
            branchId: true,
          },
        },
      },
    });

    if (existingCommissions.length !== commissionIds.length) {
      return {
        success: false,
        error: 'Algunas comisiones no fueron encontradas',
      };
    }

    const invalidCommissions = existingCommissions.filter(
      c => c.payment.spaId !== spaId || c.payment.branchId !== branchId
    );

    if (invalidCommissions.length > 0) {
      return {
        success: false,
        error: 'Algunas comisiones no pertenecen a esta sede',
      };
    }

    // Update all commissions
    await prisma.commission.updateMany({
      where: {
        id: { in: commissionIds },
        status: 'PENDING',
      },
      data: { status: 'PAID' },
    });

    revalidatePath(`/dashboard/branch-admin/${spaId}/${branchId}/payments`);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Error al marcar comisiones como pagadas',
    };
  }
}

// ============================================
// PAYMENT METHOD OPERATIONS
// ============================================

/**
 * Create a new payment method
 */
export async function createPaymentMethod(
  spaId: string,
  data: {
    name: string;
    type?: string;
    icon?: string;
    transactionFee: number;
    isActive: boolean;
  }
): Promise<ServerActionResult<{ id: string; name: string }>> {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'BRANCH_ADMIN') {
      return { success: false, error: 'No autorizado' };
    }

    // Verify user has access to this spa
    if (session.user.spaId !== spaId) {
      return { success: false, error: 'No tienes acceso a este spa' };
    }

    // Check if a payment method with the same name already exists for this spa
    const existingMethod = await prisma.paymentMethod.findFirst({
      where: {
        spaId,
        name: data.name,
      },
    });

    if (existingMethod) {
      return {
        success: false,
        error: 'Ya existe un método de pago con este nombre',
      };
    }

    // Create payment method
    const paymentMethod = await prisma.paymentMethod.create({
      data: {
        spaId,
        name: data.name,
        type: data.type || null,
        icon: data.icon || null,
        transactionFee: data.transactionFee,
        isActive: data.isActive,
      },
      select: {
        id: true,
        name: true,
      },
    });

    revalidatePath(`/dashboard/branch-admin/${spaId}/*/payments`);

    return { success: true, data: paymentMethod };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Error al crear método de pago',
    };
  }
}

/**
 * Update an existing payment method
 */
export async function updatePaymentMethod(
  paymentMethodId: string,
  spaId: string,
  data: {
    name?: string;
    type?: string;
    icon?: string;
    transactionFee?: number;
    isActive?: boolean;
  }
): Promise<ServerActionResult<{ id: string; name: string }>> {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'BRANCH_ADMIN') {
      return { success: false, error: 'No autorizado' };
    }

    // Verify user has access to this spa
    if (session.user.spaId !== spaId) {
      return { success: false, error: 'No tienes acceso a este spa' };
    }

    // Verify payment method exists and belongs to this spa
    const existingMethod = await prisma.paymentMethod.findUnique({
      where: { id: paymentMethodId },
      select: { spaId: true },
    });

    if (!existingMethod) {
      return { success: false, error: 'Método de pago no encontrado' };
    }

    if (existingMethod.spaId !== spaId) {
      return {
        success: false,
        error: 'Método de pago no pertenece a este spa',
      };
    }

    // If name is being changed, check if another method with the same name exists
    if (data.name) {
      const duplicateMethod = await prisma.paymentMethod.findFirst({
        where: {
          spaId,
          name: data.name,
          id: { not: paymentMethodId },
        },
      });

      if (duplicateMethod) {
        return {
          success: false,
          error: 'Ya existe otro método de pago con este nombre',
        };
      }
    }

    // Update payment method
    const paymentMethod = await prisma.paymentMethod.update({
      where: { id: paymentMethodId },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.type !== undefined && { type: data.type || null }),
        ...(data.icon !== undefined && { icon: data.icon || null }),
        ...(data.transactionFee !== undefined && {
          transactionFee: data.transactionFee,
        }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
      select: {
        id: true,
        name: true,
      },
    });

    revalidatePath(`/dashboard/branch-admin/${spaId}/*/payments`);

    return { success: true, data: paymentMethod };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Error al actualizar método de pago',
    };
  }
}

/**
 * Delete a payment method
 */
export async function deletePaymentMethod(
  paymentMethodId: string,
  spaId: string
): Promise<ServerActionResult<void>> {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'BRANCH_ADMIN') {
      return { success: false, error: 'No autorizado' };
    }

    // Verify user has access to this spa
    if (session.user.spaId !== spaId) {
      return { success: false, error: 'No tienes acceso a este spa' };
    }

    // Verify payment method exists and belongs to this spa
    const existingMethod = await prisma.paymentMethod.findUnique({
      where: { id: paymentMethodId },
      select: {
        spaId: true,
        _count: {
          select: {
            payments: true,
          },
        },
      },
    });

    if (!existingMethod) {
      return { success: false, error: 'Método de pago no encontrado' };
    }

    if (existingMethod.spaId !== spaId) {
      return {
        success: false,
        error: 'Método de pago no pertenece a este spa',
      };
    }

    // Check if payment method has been used
    if (existingMethod._count.payments > 0) {
      return {
        success: false,
        error:
          'No se puede eliminar un método de pago que ha sido usado. Considere desactivarlo en su lugar.',
      };
    }

    // Delete payment method
    await prisma.paymentMethod.delete({
      where: { id: paymentMethodId },
    });

    revalidatePath(`/dashboard/branch-admin/${spaId}/*/payments`);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Error al eliminar método de pago',
    };
  }
}

/**
 * Toggle payment method active status
 */
export async function togglePaymentMethodStatus(
  paymentMethodId: string,
  spaId: string
): Promise<ServerActionResult<{ id: string; isActive: boolean }>> {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'BRANCH_ADMIN') {
      return { success: false, error: 'No autorizado' };
    }

    // Verify user has access to this spa
    if (session.user.spaId !== spaId) {
      return { success: false, error: 'No tienes acceso a este spa' };
    }

    // Verify payment method exists and belongs to this spa
    const existingMethod = await prisma.paymentMethod.findUnique({
      where: { id: paymentMethodId },
      select: {
        spaId: true,
        isActive: true,
      },
    });

    if (!existingMethod) {
      return { success: false, error: 'Método de pago no encontrado' };
    }

    if (existingMethod.spaId !== spaId) {
      return {
        success: false,
        error: 'Método de pago no pertenece a este spa',
      };
    }

    // Toggle active status
    const paymentMethod = await prisma.paymentMethod.update({
      where: { id: paymentMethodId },
      data: {
        isActive: !existingMethod.isActive,
      },
      select: {
        id: true,
        isActive: true,
      },
    });

    revalidatePath(`/dashboard/branch-admin/${spaId}/*/payments`);

    return { success: true, data: paymentMethod };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Error al cambiar estado del método de pago',
    };
  }
}

// ============================================
// SPA ACCOUNT OPERATIONS
// ============================================

/**
 * Create a new spa account
 */
export async function createSpaAccount(
  spaId: string,
  data: {
    name: string;
    description?: string;
    type: 'BANK_ACCOUNT' | 'CASH' | 'DIGITAL_WALLET' | 'CREDIT_CARD';
    bank?: string;
    accountNumber?: string;
    balance: number;
    currency?: string;
    isActive: boolean;
    branchId?: string;
  }
): Promise<ServerActionResult<{ id: string; name: string }>> {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'BRANCH_ADMIN') {
      return { success: false, error: 'No autorizado' };
    }

    // Verify user has access to this spa
    if (session.user.spaId !== spaId) {
      return { success: false, error: 'No tienes acceso a este spa' };
    }

    // Check if an account with the same name already exists for this spa
    const existingAccount = await prisma.spaAccount.findFirst({
      where: {
        spaId,
        name: data.name,
      },
    });

    if (existingAccount) {
      return {
        success: false,
        error: 'Ya existe una cuenta con este nombre',
      };
    }

    // Create spa account
    const spaAccount = await prisma.spaAccount.create({
      data: {
        spaId,
        name: data.name,
        description: data.description || null,
        type: data.type,
        bank: data.bank || null,
        accountNumber: data.accountNumber || null,
        balance: data.balance,
        currency: data.currency || 'COP',
        isActive: data.isActive,
        branchId: data.branchId || null,
      },
      select: {
        id: true,
        name: true,
      },
    });

    revalidatePath(`/dashboard/branch-admin/${spaId}/*/payments`);

    return { success: true, data: spaAccount };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Error al crear cuenta del spa',
    };
  }
}

/**
 * Update an existing spa account
 */
export async function updateSpaAccount(
  accountId: string,
  spaId: string,
  data: {
    name?: string;
    description?: string;
    type?: 'BANK_ACCOUNT' | 'CASH' | 'DIGITAL_WALLET' | 'CREDIT_CARD';
    bank?: string;
    accountNumber?: string;
    balance?: number;
    currency?: string;
    isActive?: boolean;
    branchId?: string;
  }
): Promise<ServerActionResult<{ id: string; name: string }>> {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'BRANCH_ADMIN') {
      return { success: false, error: 'No autorizado' };
    }

    // Verify user has access to this spa
    if (session.user.spaId !== spaId) {
      return { success: false, error: 'No tienes acceso a este spa' };
    }

    // Verify account exists and belongs to this spa
    const existingAccount = await prisma.spaAccount.findUnique({
      where: { id: accountId },
      select: { spaId: true },
    });

    if (!existingAccount) {
      return { success: false, error: 'Cuenta no encontrada' };
    }

    if (existingAccount.spaId !== spaId) {
      return {
        success: false,
        error: 'Cuenta no pertenece a este spa',
      };
    }

    // If name is being changed, check if another account with the same name exists
    if (data.name) {
      const duplicateAccount = await prisma.spaAccount.findFirst({
        where: {
          spaId,
          name: data.name,
          id: { not: accountId },
        },
      });

      if (duplicateAccount) {
        return {
          success: false,
          error: 'Ya existe otra cuenta con este nombre',
        };
      }
    }

    // Update spa account
    const spaAccount = await prisma.spaAccount.update({
      where: { id: accountId },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.description !== undefined && {
          description: data.description || null,
        }),
        ...(data.type !== undefined && { type: data.type }),
        ...(data.bank !== undefined && { bank: data.bank || null }),
        ...(data.accountNumber !== undefined && {
          accountNumber: data.accountNumber || null,
        }),
        ...(data.balance !== undefined && { balance: data.balance }),
        ...(data.currency !== undefined && { currency: data.currency }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        ...(data.branchId !== undefined && { branchId: data.branchId || null }),
      },
      select: {
        id: true,
        name: true,
      },
    });

    revalidatePath(`/dashboard/branch-admin/${spaId}/*/payments`);

    return { success: true, data: spaAccount };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Error al actualizar cuenta del spa',
    };
  }
}

/**
 * Delete a spa account
 */
export async function deleteSpaAccount(
  accountId: string,
  spaId: string
): Promise<ServerActionResult<void>> {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'BRANCH_ADMIN') {
      return { success: false, error: 'No autorizado' };
    }

    // Verify user has access to this spa
    if (session.user.spaId !== spaId) {
      return { success: false, error: 'No tienes acceso a este spa' };
    }

    // Verify account exists and belongs to this spa
    const existingAccount = await prisma.spaAccount.findUnique({
      where: { id: accountId },
      select: {
        spaId: true,
        _count: {
          select: {
            paymentsReceived: true,
            expensePayments: true,
          },
        },
      },
    });

    if (!existingAccount) {
      return { success: false, error: 'Cuenta no encontrada' };
    }

    if (existingAccount.spaId !== spaId) {
      return {
        success: false,
        error: 'Cuenta no pertenece a este spa',
      };
    }

    // Check if account has been used
    if (
      existingAccount._count.paymentsReceived > 0 ||
      existingAccount._count.expensePayments > 0
    ) {
      return {
        success: false,
        error:
          'No se puede eliminar una cuenta que ha sido usada. Considere desactivarla en su lugar.',
      };
    }

    // Delete spa account
    await prisma.spaAccount.delete({
      where: { id: accountId },
    });

    revalidatePath(`/dashboard/branch-admin/${spaId}/*/payments`);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Error al eliminar cuenta del spa',
    };
  }
}

/**
 * Toggle spa account active status
 */
export async function toggleSpaAccountStatus(
  accountId: string,
  spaId: string
): Promise<ServerActionResult<{ id: string; isActive: boolean }>> {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'BRANCH_ADMIN') {
      return { success: false, error: 'No autorizado' };
    }

    // Verify user has access to this spa
    if (session.user.spaId !== spaId) {
      return { success: false, error: 'No tienes acceso a este spa' };
    }

    // Verify account exists and belongs to this spa
    const existingAccount = await prisma.spaAccount.findUnique({
      where: { id: accountId },
      select: {
        spaId: true,
        isActive: true,
      },
    });

    if (!existingAccount) {
      return { success: false, error: 'Cuenta no encontrada' };
    }

    if (existingAccount.spaId !== spaId) {
      return {
        success: false,
        error: 'Cuenta no pertenece a este spa',
      };
    }

    // Toggle active status
    const spaAccount = await prisma.spaAccount.update({
      where: { id: accountId },
      data: {
        isActive: !existingAccount.isActive,
      },
      select: {
        id: true,
        isActive: true,
      },
    });

    revalidatePath(`/dashboard/branch-admin/${spaId}/*/payments`);

    return { success: true, data: spaAccount };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Error al cambiar estado de la cuenta',
    };
  }
}
