import { Client } from '@/generated/prisma';

// Client with appointment count for list view
export type ClientWithAppointmentCount = Pick<
  Client,
  | 'id'
  | 'name'
  | 'documentType'
  | 'documentNumber'
  | 'phone'
  | 'email'
  | 'birthday'
  | 'notes'
  | 'createdAt'
  | 'updatedAt'
> & {
  _count: {
    appointments: number;
  };
};

// Branch info for client management
export type BranchInfo = {
  id: string;
  name: string;
  spa: {
    name: string;
  };
};

// Pagination info
export type PaginationInfo = {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
};

// Search params for client filtering
export type ClientSearchParams = {
  search?: string;
  page?: string;
  limit?: string;
};

// Document types available in Colombia
export const DOCUMENT_TYPES = [
  { value: 'CC', label: 'Cédula de Ciudadanía' },
  { value: 'TI', label: 'Tarjeta de Identidad' },
  { value: 'CE', label: 'Cédula de Extranjería' },
  { value: 'PA', label: 'Pasaporte' },
  { value: 'NIT', label: 'NIT (Empresa)' },
] as const;

export type DocumentType = (typeof DOCUMENT_TYPES)[number]['value'];

// ============================================
// EXTENDED CLIENT TYPES FOR DETAIL VIEW
// ============================================

// Service count for favorite services analysis
export type ServiceCount = {
  serviceId: string;
  serviceName: string;
  count: number;
};

// Appointment with full service details for history
export type AppointmentWithDetails = {
  id: string;
  scheduledAt: Date;
  status: string;
  notes: string | null;
  totalAmount: number;
  appointmentServices: {
    id: string;
    price: number;
    service: {
      id: string;
      name: string;
      type: string;
    };
    manicurist: {
      id: string;
      name: string;
    };
  }[];
};

// Client with full details including statistics and relationships
export type ClientDetailWithRelations = ClientWithAppointmentCount & {
  appointments: AppointmentWithDetails[];
  totalSpent: number;
  lastVisit: Date | null;
  favoriteServices: ServiceCount[];
  averageMonthlyVisits: number;
};

// Client statistics for dashboard
export type ClientStats = {
  totalClients: number;
  activeClients: number; // With appointments in last 3 months
  newClientsThisMonth: number;
  returningClientsRate: number;
  averageClientsPerDay: number;
};

// ============================================
// CLIENT NOTES TYPES
// ============================================

// Client note with creator information
export type ClientNoteWithCreator = {
  id: string;
  clientId: string;
  content: string;
  isImportant: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  creator: {
    id: string;
    name: string | null;
    email: string;
  };
};

// Client note for creation (without generated fields)
export type CreateClientNoteData = {
  content: string;
  isImportant?: boolean;
};

// Client note for update (partial)
export type UpdateClientNoteData = {
  content?: string;
  isImportant?: boolean;
};
