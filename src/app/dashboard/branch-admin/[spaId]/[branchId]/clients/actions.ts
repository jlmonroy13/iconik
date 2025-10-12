'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/../../auth';
import { prisma } from '@/lib/prisma';
import {
  createClientSchema,
  type CreateClientData,
  createClientNoteSchema,
  updateClientNoteSchema,
  type CreateClientNoteFormData,
  type UpdateClientNoteFormData,
} from '@/types/forms';
import type { Client, ClientNote } from '@/generated/prisma';
import type { ServerActionResult } from '@/types/api';
import type {
  ClientDetailWithRelations,
  ClientNoteWithCreator,
} from '@/types/clients';
import {
  checkClientDocumentExists,
  getClientById,
  getClientWithDetails,
  getClientNotes,
} from './queries';

// ============================================
// CLIENT CRUD OPERATIONS
// ============================================

/**
 * Fetch client by ID (for client components)
 */
export async function fetchClientById(
  clientId: string
): Promise<ServerActionResult<Client>> {
  try {
    const client = await getClientById(clientId);

    if (!client) {
      return { success: false, error: 'Cliente no encontrado' };
    }

    return { success: true, data: client as unknown as Client };
  } catch (error) {
    console.error('Error fetching client:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al cargar cliente',
    };
  }
}

/**
 * Fetch client details with full relations (for client detail modal)
 */
export async function fetchClientDetails(
  clientId: string
): Promise<ServerActionResult<ClientDetailWithRelations>> {
  try {
    const client = await getClientWithDetails(clientId);

    if (!client) {
      return { success: false, error: 'Cliente no encontrado' };
    }

    return { success: true, data: client };
  } catch (error) {
    console.error('Error fetching client details:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Error al cargar detalles del cliente',
    };
  }
}

/**
 * Create a new client
 */
export async function createClient(
  spaId: string,
  branchId: string,
  data: CreateClientData
): Promise<ServerActionResult<Client>> {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'BRANCH_ADMIN') {
      return { success: false, error: 'No autorizado' };
    }

    // Verify access
    if (session.user.branchId !== branchId) {
      return { success: false, error: 'No tienes acceso a esta sede' };
    }

    // Validate data
    const validatedData = createClientSchema.parse(data);

    // Check if client with same document already exists
    const documentExists = await checkClientDocumentExists(
      spaId,
      validatedData.documentType,
      validatedData.documentNumber
    );

    if (documentExists) {
      return {
        success: false,
        error: 'Ya existe un cliente con este documento',
      };
    }

    // Convert birthday string to Date if provided
    const birthdayDate = validatedData.birthday
      ? new Date(validatedData.birthday)
      : null;

    // Create client
    const client = await prisma.client.create({
      data: {
        spaId,
        branchId,
        name: validatedData.name,
        documentType: validatedData.documentType,
        documentNumber: validatedData.documentNumber,
        phone: validatedData.phone || null,
        email: validatedData.email || null,
        birthday: birthdayDate,
        notes: validatedData.notes || null,
      },
    });

    revalidatePath(`/dashboard/branch-admin/${spaId}/${branchId}/clients`);

    return { success: true, data: client };
  } catch (error) {
    console.error('Error creating client:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al crear cliente',
    };
  }
}

/**
 * Update an existing client
 */
export async function updateClient(
  clientId: string,
  spaId: string,
  branchId: string,
  data: CreateClientData
): Promise<ServerActionResult<Client>> {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'BRANCH_ADMIN') {
      return { success: false, error: 'No autorizado' };
    }

    // Verify access
    if (session.user.branchId !== branchId) {
      return { success: false, error: 'No tienes acceso a esta sede' };
    }

    // Verify client exists and belongs to this spa/branch
    const existingClient = await prisma.client.findUnique({
      where: { id: clientId },
      select: { spaId: true, branchId: true },
    });

    if (!existingClient) {
      return { success: false, error: 'Cliente no encontrado' };
    }

    if (existingClient.spaId !== spaId) {
      return { success: false, error: 'Cliente no pertenece a este spa' };
    }

    // Validate data
    const validatedData = createClientSchema.partial().parse(data);

    // If document is being changed, check if it already exists
    if (
      validatedData.documentType &&
      validatedData.documentNumber &&
      validatedData.documentType !== undefined &&
      validatedData.documentNumber !== undefined
    ) {
      const documentExists = await checkClientDocumentExists(
        spaId,
        validatedData.documentType,
        validatedData.documentNumber,
        clientId
      );

      if (documentExists) {
        return {
          success: false,
          error: 'Ya existe otro cliente con este documento',
        };
      }
    }

    // Convert birthday string to Date if provided
    const birthdayDate =
      validatedData.birthday !== undefined
        ? validatedData.birthday
          ? new Date(validatedData.birthday)
          : null
        : undefined;

    // Update client
    const client = await prisma.client.update({
      where: { id: clientId },
      data: {
        ...(validatedData.name !== undefined && { name: validatedData.name }),
        ...(validatedData.documentType !== undefined && {
          documentType: validatedData.documentType,
        }),
        ...(validatedData.documentNumber !== undefined && {
          documentNumber: validatedData.documentNumber,
        }),
        ...(validatedData.phone !== undefined && {
          phone: validatedData.phone || null,
        }),
        ...(validatedData.email !== undefined && {
          email: validatedData.email || null,
        }),
        ...(birthdayDate !== undefined && { birthday: birthdayDate }),
        ...(validatedData.notes !== undefined && {
          notes: validatedData.notes || null,
        }),
      },
    });

    revalidatePath(`/dashboard/branch-admin/${spaId}/${branchId}/clients`);

    return { success: true, data: client };
  } catch (error) {
    console.error('Error updating client:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Error al actualizar cliente',
    };
  }
}

/**
 * Delete a client
 */
export async function deleteClient(
  clientId: string,
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

    // Verify client exists and belongs to this spa/branch
    const existingClient = await prisma.client.findUnique({
      where: { id: clientId },
      select: {
        spaId: true,
        branchId: true,
        _count: {
          select: {
            appointments: true,
          },
        },
      },
    });

    if (!existingClient) {
      return { success: false, error: 'Cliente no encontrado' };
    }

    if (existingClient.spaId !== spaId) {
      return { success: false, error: 'Cliente no pertenece a este spa' };
    }

    // Check if client has appointments
    if (existingClient._count.appointments > 0) {
      return {
        success: false,
        error:
          'No se puede eliminar un cliente con citas. Considera desactivarlo en su lugar.',
      };
    }

    // Delete client
    await prisma.client.delete({
      where: { id: clientId },
    });

    revalidatePath(`/dashboard/branch-admin/${spaId}/${branchId}/clients`);

    return { success: true };
  } catch (error) {
    console.error('Error deleting client:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Error al eliminar cliente',
    };
  }
}

// ============================================
// CLIENT NOTES OPERATIONS
// ============================================

/**
 * Fetch all notes for a client
 */
export async function fetchClientNotes(
  clientId: string
): Promise<ServerActionResult<ClientNoteWithCreator[]>> {
  try {
    const notes = await getClientNotes(clientId);
    return { success: true, data: notes };
  } catch (error) {
    console.error('Error fetching client notes:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Error al cargar las notas',
    };
  }
}

/**
 * Create a new client note
 */
export async function createClientNote(
  clientId: string,
  spaId: string,
  branchId: string,
  data: CreateClientNoteFormData
): Promise<ServerActionResult<ClientNote>> {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'BRANCH_ADMIN') {
      return { success: false, error: 'No autorizado' };
    }

    // Verify access
    if (session.user.branchId !== branchId) {
      return { success: false, error: 'No tienes acceso a esta sede' };
    }

    // Validate data
    const validatedData = createClientNoteSchema.parse(data);

    // Verify client exists and belongs to this spa/branch
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      select: { spaId: true, branchId: true },
    });

    if (!client) {
      return { success: false, error: 'Cliente no encontrado' };
    }

    if (client.spaId !== spaId || client.branchId !== branchId) {
      return { success: false, error: 'Cliente no pertenece a esta sede' };
    }

    // Create note
    const note = await prisma.clientNote.create({
      data: {
        clientId,
        content: validatedData.content,
        isImportant: validatedData.isImportant || false,
        createdBy: session.user.id,
      },
    });

    revalidatePath(`/dashboard/branch-admin/${spaId}/${branchId}/clients`);

    return { success: true, data: note };
  } catch (error) {
    console.error('Error creating client note:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al crear la nota',
    };
  }
}

/**
 * Update an existing client note
 */
export async function updateClientNote(
  noteId: string,
  spaId: string,
  branchId: string,
  data: UpdateClientNoteFormData
): Promise<ServerActionResult<ClientNote>> {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'BRANCH_ADMIN') {
      return { success: false, error: 'No autorizado' };
    }

    // Verify access
    if (session.user.branchId !== branchId) {
      return { success: false, error: 'No tienes acceso a esta sede' };
    }

    // Verify note exists and user has permission to edit
    const existingNote = await prisma.clientNote.findUnique({
      where: { id: noteId },
      include: { client: { select: { spaId: true, branchId: true } } },
    });

    if (!existingNote) {
      return { success: false, error: 'Nota no encontrada' };
    }

    // Only the creator can edit their own note
    if (existingNote.createdBy !== session.user.id) {
      return {
        success: false,
        error: 'Solo puedes editar tus propias notas',
      };
    }

    if (existingNote.client.spaId !== spaId) {
      return { success: false, error: 'Nota no pertenece a este spa' };
    }

    // Validate data
    const validatedData = updateClientNoteSchema.parse(data);

    // Update note
    const note = await prisma.clientNote.update({
      where: { id: noteId },
      data: {
        ...(validatedData.content !== undefined && {
          content: validatedData.content,
        }),
        ...(validatedData.isImportant !== undefined && {
          isImportant: validatedData.isImportant,
        }),
      },
    });

    revalidatePath(`/dashboard/branch-admin/${spaId}/${branchId}/clients`);

    return { success: true, data: note };
  } catch (error) {
    console.error('Error updating client note:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Error al actualizar la nota',
    };
  }
}

/**
 * Delete a client note
 */
export async function deleteClientNote(
  noteId: string,
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

    // Verify note exists and user has permission to delete
    const existingNote = await prisma.clientNote.findUnique({
      where: { id: noteId },
      include: { client: { select: { spaId: true, branchId: true } } },
    });

    if (!existingNote) {
      return { success: false, error: 'Nota no encontrada' };
    }

    // Only the creator can delete their own note
    if (existingNote.createdBy !== session.user.id) {
      return {
        success: false,
        error: 'Solo puedes eliminar tus propias notas',
      };
    }

    if (existingNote.client.spaId !== spaId) {
      return { success: false, error: 'Nota no pertenece a este spa' };
    }

    // Delete note
    await prisma.clientNote.delete({
      where: { id: noteId },
    });

    revalidatePath(`/dashboard/branch-admin/${spaId}/${branchId}/clients`);

    return { success: true };
  } catch (error) {
    console.error('Error deleting client note:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Error al eliminar la nota',
    };
  }
}
