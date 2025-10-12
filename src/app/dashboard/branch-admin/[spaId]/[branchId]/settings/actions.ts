'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireBranchAccess } from '@/lib/auth-utils';
import {
  updateBranchInfoSchema,
  updateBranchSettingsSchema,
  type UpdateBranchInfoData,
  type UpdateBranchSettingsData,
} from '@/types/forms';
import type { ServerActionResult } from '@/types/api';

/**
 * Update branch basic information
 */
export async function updateBranchInfo(
  branchId: string,
  spaId: string,
  data: UpdateBranchInfoData
): ServerActionResult<void> {
  try {
    // Verify user has access to this branch
    await requireBranchAccess(spaId, branchId);

    // Validate data
    const validatedData = updateBranchInfoSchema.parse(data);

    // Update branch
    await prisma.branch.update({
      where: { id: branchId },
      data: {
        ...(validatedData.name && { name: validatedData.name }),
        ...(validatedData.description !== undefined && {
          description: validatedData.description || null,
        }),
        ...(validatedData.address && { address: validatedData.address }),
        ...(validatedData.phone !== undefined && {
          phone: validatedData.phone || null,
        }),
        ...(validatedData.email !== undefined && {
          email: validatedData.email || null,
        }),
        ...(validatedData.openingTime !== undefined && {
          openingTime: validatedData.openingTime || null,
        }),
        ...(validatedData.closingTime !== undefined && {
          closingTime: validatedData.closingTime || null,
        }),
        ...(validatedData.isActive !== undefined && {
          isActive: validatedData.isActive,
        }),
        ...(validatedData.invoicePrefix !== undefined && {
          invoicePrefix: validatedData.invoicePrefix || null,
        }),
      },
    });

    revalidatePath(`/dashboard/branch-admin/${spaId}/${branchId}/settings`);
    revalidatePath(`/dashboard/branch-admin/${spaId}/${branchId}`);

    return { success: true };
  } catch (error) {
    // Error updating branch info
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Error al actualizar la información de la sede',
    };
  }
}

/**
 * Update branch advanced settings
 */
export async function updateBranchAdvancedSettings(
  branchId: string,
  spaId: string,
  data: UpdateBranchSettingsData
): ServerActionResult<void> {
  try {
    // Verify user has access to this branch
    await requireBranchAccess(spaId, branchId);

    // Validate data
    const validatedData = updateBranchSettingsSchema.parse(data);

    // Check if settings already exist
    const existingSettings = await prisma.branchSettings.findUnique({
      where: { branchId },
    });

    if (existingSettings) {
      // Update existing settings
      await prisma.branchSettings.update({
        where: { branchId },
        data: {
          ...(validatedData.customTaxRate !== undefined && {
            customTaxRate: validatedData.customTaxRate,
          }),
          ...(validatedData.customOperatingHours !== undefined && {
            customOperatingHours: validatedData.customOperatingHours,
          }),
          ...(validatedData.enableAllServices !== undefined && {
            enableAllServices: validatedData.enableAllServices,
          }),
          ...(validatedData.enableAllManicurists !== undefined && {
            enableAllManicurists: validatedData.enableAllManicurists,
          }),
          ...(validatedData.allowNewClients !== undefined && {
            allowNewClients: validatedData.allowNewClients,
          }),
          ...(validatedData.allowWalkIns !== undefined && {
            allowWalkIns: validatedData.allowWalkIns,
          }),
          ...(validatedData.useSpaDianSettings !== undefined && {
            useSpaDianSettings: validatedData.useSpaDianSettings,
          }),
        },
      });
    } else {
      // Create new settings
      await prisma.branchSettings.create({
        data: {
          branchId,
          customTaxRate: validatedData.customTaxRate,
          customOperatingHours: validatedData.customOperatingHours ?? false,
          enableAllServices: validatedData.enableAllServices ?? true,
          enableAllManicurists: validatedData.enableAllManicurists ?? true,
          allowNewClients: validatedData.allowNewClients ?? true,
          allowWalkIns: validatedData.allowWalkIns ?? true,
          useSpaDianSettings: validatedData.useSpaDianSettings ?? true,
        },
      });
    }

    revalidatePath(`/dashboard/branch-admin/${spaId}/${branchId}/settings`);
    revalidatePath(`/dashboard/branch-admin/${spaId}/${branchId}`);

    return { success: true };
  } catch (error) {
    // Error updating branch settings
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Error al actualizar la configuración avanzada',
    };
  }
}
