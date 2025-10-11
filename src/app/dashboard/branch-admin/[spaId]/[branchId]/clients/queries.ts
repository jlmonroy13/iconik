import { prisma } from '@/lib/prisma';
import type { ClientWithAppointmentCount } from '@/types/clients';

/**
 * Search and pagination parameters for clients
 */
export interface ClientQueryParams {
  spaId: string;
  branchId: string;
  search?: string;
  page?: number;
  limit?: number;
}

/**
 * Result type for paginated client queries
 */
export interface ClientQueryResult {
  clients: ClientWithAppointmentCount[];
  totalCount: number;
}

/**
 * Get clients with pagination and search
 */
export async function getClients({
  spaId,
  branchId,
  search,
  page = 1,
  limit = 10,
}: ClientQueryParams): Promise<ClientQueryResult> {
  // Build where clause for filtering
  const where = {
    spaId,
    branchId,
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' as const } },
        { email: { contains: search, mode: 'insensitive' as const } },
        { phone: { contains: search, mode: 'insensitive' as const } },
        { documentNumber: { contains: search, mode: 'insensitive' as const } },
      ],
    }),
  };

  // Calculate pagination
  const skip = (page - 1) * limit;

  // Fetch clients with pagination
  const [clientsData, totalCount] = await Promise.all([
    prisma.client.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        documentType: true,
        documentNumber: true,
        phone: true,
        email: true,
        birthday: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            appointments: true,
          },
        },
      },
    }),
    prisma.client.count({ where }),
  ]);

  // Transform to match the expected type
  const clients: ClientWithAppointmentCount[] = clientsData.map(client => ({
    ...client,
    _count: {
      appointments: client._count.appointments,
    },
  }));

  return {
    clients,
    totalCount,
  };
}

/**
 * Get a single client by ID with full details
 */
export async function getClientById(
  clientId: string
): Promise<ClientWithAppointmentCount | null> {
  const client = await prisma.client.findUnique({
    where: { id: clientId },
    select: {
      id: true,
      name: true,
      documentType: true,
      documentNumber: true,
      phone: true,
      email: true,
      birthday: true,
      notes: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          appointments: true,
        },
      },
    },
  });

  if (!client) return null;

  return {
    ...client,
    _count: {
      appointments: client._count.appointments,
    },
  };
}

/**
 * Check if a client with the same document exists in the spa
 */
export async function checkClientDocumentExists(
  spaId: string,
  documentType: string,
  documentNumber: string,
  excludeClientId?: string
): Promise<boolean> {
  const existingClient = await prisma.client.findFirst({
    where: {
      spaId,
      documentType,
      documentNumber,
      ...(excludeClientId && {
        id: { not: excludeClientId },
      }),
    },
    select: { id: true },
  });

  return !!existingClient;
}
