import { prisma } from '@/lib/prisma';
import type {
  ClientWithAppointmentCount,
  ClientDetailWithRelations,
  ServiceCount,
  ClientNoteWithCreator,
} from '@/types/clients';

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

// ============================================
// CLIENT DETAIL WITH FULL RELATIONSHIPS
// ============================================

/**
 * Calculate average monthly visits for a client
 */
function calculateAverageMonthlyVisits(
  firstVisit: Date,
  lastVisit: Date,
  totalVisits: number
): number {
  const monthsDiff = Math.max(
    1,
    (lastVisit.getTime() - firstVisit.getTime()) / (1000 * 60 * 60 * 24 * 30)
  );
  return parseFloat((totalVisits / monthsDiff).toFixed(2));
}

/**
 * Get client with full details including appointment history and statistics
 * Used by: Client detail modal
 */
export async function getClientWithDetails(
  clientId: string
): Promise<ClientDetailWithRelations | null> {
  const client = await prisma.client.findUnique({
    where: { id: clientId },
    include: {
      appointments: {
        include: {
          services: {
            include: {
              service: {
                select: {
                  id: true,
                  name: true,
                  type: true,
                },
              },
              manicurist: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        orderBy: { scheduledAt: 'desc' },
        take: 50, // Last 50 appointments
      },
      _count: {
        select: {
          appointments: true,
        },
      },
    },
  });

  if (!client) return null;

  // Calculate total spent across all appointments
  const totalSpent = client.appointments.reduce((sum, appointment) => {
    const appointmentTotal = appointment.services.reduce(
      (serviceSum, service) => serviceSum + service.price,
      0
    );
    return sum + appointmentTotal;
  }, 0);

  // Calculate favorite services (top 5 most used)
  const serviceMap = new Map<string, ServiceCount>();

  client.appointments.forEach(appointment => {
    appointment.services.forEach(appointmentService => {
      const serviceId = appointmentService.service.id;
      const serviceName = appointmentService.service.name;

      const current = serviceMap.get(serviceId);
      if (current) {
        current.count++;
      } else {
        serviceMap.set(serviceId, {
          serviceId,
          serviceName,
          count: 1,
        });
      }
    });
  });

  const favoriteServices = Array.from(serviceMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Get last visit date
  const lastVisit =
    client.appointments.length > 0 ? client.appointments[0].scheduledAt : null;

  // Calculate average monthly visits
  let averageMonthlyVisits = 0;
  if (client.appointments.length > 0) {
    const firstAppointment =
      client.appointments[client.appointments.length - 1];
    const now = new Date();
    averageMonthlyVisits = calculateAverageMonthlyVisits(
      firstAppointment.scheduledAt,
      now,
      client.appointments.length
    );
  }

  // Transform appointments to match type
  const transformedAppointments = client.appointments.map(appointment => ({
    id: appointment.id,
    scheduledAt: appointment.scheduledAt,
    status: appointment.status,
    notes: appointment.notes,
    totalAmount: appointment.services.reduce(
      (sum, service) => sum + service.price,
      0
    ),
    appointmentServices: appointment.services.map(service => ({
      id: service.id,
      price: service.price,
      service: {
        id: service.service.id,
        name: service.service.name,
        type: service.service.type,
      },
      manicurist: {
        id: service.manicurist.id,
        name: service.manicurist.name,
      },
    })),
  }));

  return {
    id: client.id,
    name: client.name,
    documentType: client.documentType,
    documentNumber: client.documentNumber,
    phone: client.phone,
    email: client.email,
    birthday: client.birthday,
    notes: client.notes,
    createdAt: client.createdAt,
    updatedAt: client.updatedAt,
    _count: {
      appointments: client._count.appointments,
    },
    appointments: transformedAppointments,
    totalSpent,
    lastVisit,
    favoriteServices,
    averageMonthlyVisits,
  };
}

// ============================================
// CLIENT NOTES QUERIES
// ============================================

/**
 * Get all notes for a specific client
 * Used by: Client detail modal
 */
export async function getClientNotes(
  clientId: string
): Promise<ClientNoteWithCreator[]> {
  const notes = await prisma.clientNote.findMany({
    where: { clientId },
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: [
      { isImportant: 'desc' }, // Important notes first
      { createdAt: 'desc' }, // Then by most recent
    ],
  });

  return notes;
}
