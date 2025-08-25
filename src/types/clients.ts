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
