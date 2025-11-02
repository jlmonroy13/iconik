'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/../../auth';
import { prisma } from '@/lib/prisma';
import type { ServerActionResult } from '@/types/api';

// ============================================
// EXPENSE OPERATIONS
// ============================================

/**
 * Create a new expense
 */
export async function createExpense(
  spaId: string,
  data: {
    name: string;
    description?: string;
    amount: number;
    type: 'FIXED' | 'VARIABLE';
    category:
      | 'RENT'
      | 'SALARIES'
      | 'MARKETING'
      | 'SUPPLIES'
      | 'UTILITIES'
      | 'INSURANCE'
      | 'MAINTENANCE'
      | 'EQUIPMENT'
      | 'SOFTWARE'
      | 'PROFESSIONAL'
      | 'TRAINING'
      | 'TRAVEL'
      | 'FOOD'
      | 'CLEANING'
      | 'SECURITY'
      | 'OTHER';
    frequency: 'MONTHLY' | 'WEEKLY' | 'DAILY' | 'ONE_TIME';
    dueDate?: string; // ISO string
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

    // Create expense
    const expense = await prisma.expense.create({
      data: {
        spaId,
        name: data.name,
        description: data.description || null,
        amount: data.amount,
        type: data.type,
        category: data.category,
        frequency: data.frequency,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        isActive: data.isActive,
        isPaid: false,
      },
      select: {
        id: true,
        name: true,
      },
    });

    revalidatePath(`/dashboard/branch-admin/${spaId}/*/expenses`);

    return { success: true, data: expense };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al crear gasto',
    };
  }
}

/**
 * Update an existing expense
 */
export async function updateExpense(
  expenseId: string,
  spaId: string,
  data: {
    name?: string;
    description?: string;
    amount?: number;
    type?: 'FIXED' | 'VARIABLE';
    category?:
      | 'RENT'
      | 'SALARIES'
      | 'MARKETING'
      | 'SUPPLIES'
      | 'UTILITIES'
      | 'INSURANCE'
      | 'MAINTENANCE'
      | 'EQUIPMENT'
      | 'SOFTWARE'
      | 'PROFESSIONAL'
      | 'TRAINING'
      | 'TRAVEL'
      | 'FOOD'
      | 'CLEANING'
      | 'SECURITY'
      | 'OTHER';
    frequency?: 'MONTHLY' | 'WEEKLY' | 'DAILY' | 'ONE_TIME';
    dueDate?: string | null;
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

    // Verify expense exists and belongs to this spa
    const existingExpense = await prisma.expense.findUnique({
      where: { id: expenseId },
      select: { spaId: true },
    });

    if (!existingExpense) {
      return { success: false, error: 'Gasto no encontrado' };
    }

    if (existingExpense.spaId !== spaId) {
      return {
        success: false,
        error: 'Gasto no pertenece a este spa',
      };
    }

    // Update expense
    const expense = await prisma.expense.update({
      where: { id: expenseId },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.description !== undefined && {
          description: data.description || null,
        }),
        ...(data.amount !== undefined && { amount: data.amount }),
        ...(data.type !== undefined && { type: data.type }),
        ...(data.category !== undefined && { category: data.category }),
        ...(data.frequency !== undefined && { frequency: data.frequency }),
        ...(data.dueDate !== undefined && {
          dueDate: data.dueDate ? new Date(data.dueDate) : null,
        }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
      select: {
        id: true,
        name: true,
      },
    });

    revalidatePath(`/dashboard/branch-admin/${spaId}/*/expenses`);

    return { success: true, data: expense };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Error al actualizar gasto',
    };
  }
}

/**
 * Delete an expense
 */
export async function deleteExpense(
  expenseId: string,
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

    // Verify expense exists and belongs to this spa
    const existingExpense = await prisma.expense.findUnique({
      where: { id: expenseId },
      select: {
        spaId: true,
        _count: {
          select: {
            payments: true,
          },
        },
      },
    });

    if (!existingExpense) {
      return { success: false, error: 'Gasto no encontrado' };
    }

    if (existingExpense.spaId !== spaId) {
      return {
        success: false,
        error: 'Gasto no pertenece a este spa',
      };
    }

    // Check if expense has payments
    if (existingExpense._count.payments > 0) {
      return {
        success: false,
        error:
          'No se puede eliminar un gasto que tiene pagos registrados. Considere desactivarlo en su lugar.',
      };
    }

    // Delete expense
    await prisma.expense.delete({
      where: { id: expenseId },
    });

    revalidatePath(`/dashboard/branch-admin/${spaId}/*/expenses`);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al eliminar gasto',
    };
  }
}

/**
 * Toggle expense active status
 */
export async function toggleExpenseStatus(
  expenseId: string,
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

    // Verify expense exists and belongs to this spa
    const existingExpense = await prisma.expense.findUnique({
      where: { id: expenseId },
      select: {
        spaId: true,
        isActive: true,
      },
    });

    if (!existingExpense) {
      return { success: false, error: 'Gasto no encontrado' };
    }

    if (existingExpense.spaId !== spaId) {
      return {
        success: false,
        error: 'Gasto no pertenece a este spa',
      };
    }

    // Toggle active status
    const expense = await prisma.expense.update({
      where: { id: expenseId },
      data: {
        isActive: !existingExpense.isActive,
      },
      select: {
        id: true,
        isActive: true,
      },
    });

    revalidatePath(`/dashboard/branch-admin/${spaId}/*/expenses`);

    return { success: true, data: expense };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al cambiar estado',
    };
  }
}

// ============================================
// EXPENSE PAYMENT OPERATIONS
// ============================================

/**
 * Register a payment for an expense
 */
export async function registerExpensePayment(
  spaId: string,
  data: {
    expenseId: string;
    spaAccountId: string;
    amount: number;
    paidAt?: string; // ISO string
    reference?: string;
    notes?: string;
  }
): Promise<ServerActionResult<{ id: string }>> {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'BRANCH_ADMIN') {
      return { success: false, error: 'No autorizado' };
    }

    // Verify user has access to this spa
    if (session.user.spaId !== spaId) {
      return { success: false, error: 'No tienes acceso a este spa' };
    }

    // Verify expense exists and belongs to this spa
    const expense = await prisma.expense.findUnique({
      where: { id: data.expenseId },
      select: {
        spaId: true,
        amount: true,
        isPaid: true,
        payments: {
          select: {
            amount: true,
          },
        },
      },
    });

    if (!expense) {
      return { success: false, error: 'Gasto no encontrado' };
    }

    if (expense.spaId !== spaId) {
      return { success: false, error: 'Gasto no pertenece a este spa' };
    }

    if (expense.isPaid) {
      return {
        success: false,
        error: 'Este gasto ya está completamente pagado',
      };
    }

    // Calculate remaining amount
    const totalPaid = expense.payments.reduce((sum, p) => sum + p.amount, 0);
    const remainingAmount = expense.amount - totalPaid;

    if (data.amount > remainingAmount) {
      return {
        success: false,
        error: `El monto excede el saldo pendiente de $${remainingAmount.toLocaleString()}`,
      };
    }

    // Verify spa account exists and belongs to this spa
    const spaAccount = await prisma.spaAccount.findUnique({
      where: { id: data.spaAccountId },
      select: {
        spaId: true,
        balance: true,
        isActive: true,
      },
    });

    if (!spaAccount) {
      return { success: false, error: 'Cuenta no encontrada' };
    }

    if (spaAccount.spaId !== spaId) {
      return { success: false, error: 'Cuenta no pertenece a este spa' };
    }

    if (!spaAccount.isActive) {
      return { success: false, error: 'La cuenta no está activa' };
    }

    // Check if account has sufficient balance
    if (spaAccount.balance < data.amount) {
      return {
        success: false,
        error: `Saldo insuficiente en la cuenta. Disponible: $${spaAccount.balance.toLocaleString()}`,
      };
    }

    // Create payment and update balances in a transaction
    const result = await prisma.$transaction(async tx => {
      // Create expense payment
      const payment = await tx.expensePayment.create({
        data: {
          expenseId: data.expenseId,
          spaAccountId: data.spaAccountId,
          amount: data.amount,
          paidAt: data.paidAt ? new Date(data.paidAt) : new Date(),
          reference: data.reference || null,
          notes: data.notes || null,
        },
        select: {
          id: true,
        },
      });

      // Update spa account balance (decrease)
      await tx.spaAccount.update({
        where: { id: data.spaAccountId },
        data: {
          balance: {
            decrement: data.amount,
          },
        },
      });

      // Check if expense is now fully paid
      const newTotalPaid = totalPaid + data.amount;
      const isFullyPaid = newTotalPaid >= expense.amount;

      // Update expense status if fully paid
      if (isFullyPaid) {
        await tx.expense.update({
          where: { id: data.expenseId },
          data: {
            isPaid: true,
            paidAt: new Date(),
          },
        });
      }

      return payment;
    });

    revalidatePath(`/dashboard/branch-admin/${spaId}/*/expenses`);
    revalidatePath(`/dashboard/branch-admin/${spaId}/*/payments`);

    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al registrar pago',
    };
  }
}

/**
 * Delete an expense payment
 */
export async function deleteExpensePayment(
  paymentId: string,
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

    // Get payment details
    const payment = await prisma.expensePayment.findUnique({
      where: { id: paymentId },
      select: {
        amount: true,
        spaAccountId: true,
        expense: {
          select: {
            spaId: true,
            id: true,
          },
        },
      },
    });

    if (!payment) {
      return { success: false, error: 'Pago no encontrado' };
    }

    if (payment.expense.spaId !== spaId) {
      return { success: false, error: 'Pago no pertenece a este spa' };
    }

    // Delete payment and update balances in a transaction
    await prisma.$transaction(async tx => {
      // Delete payment
      await tx.expensePayment.delete({
        where: { id: paymentId },
      });

      // Restore spa account balance
      await tx.spaAccount.update({
        where: { id: payment.spaAccountId },
        data: {
          balance: {
            increment: payment.amount,
          },
        },
      });

      // Update expense paid status
      await tx.expense.update({
        where: { id: payment.expense.id },
        data: {
          isPaid: false,
          paidAt: null,
        },
      });
    });

    revalidatePath(`/dashboard/branch-admin/${spaId}/*/expenses`);
    revalidatePath(`/dashboard/branch-admin/${spaId}/*/payments`);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al eliminar pago',
    };
  }
}
