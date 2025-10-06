import { Service } from '@/generated/prisma';

// Service with branch info for list view
export type ServiceWithBranch = Pick<
  Service,
  | 'id'
  | 'name'
  | 'description'
  | 'price'
  | 'taxRate'
  | 'duration'
  | 'recommendedReturnDays'
  | 'type'
  | 'image'
  | 'isActive'
  | 'spaId'
  | 'branchId'
  | 'createdAt'
  | 'updatedAt'
> & {
  branch: {
    id: string;
    name: string;
    code: string;
  } | null;
};

// Service type options for forms
export const SERVICE_TYPES = [
  { value: 'MANICURE_PEDICURE', label: 'Manicure y Pedicure' },
  { value: 'NAIL_ART', label: 'Arte en Uñas' },
  { value: 'NAIL_EXTENSIONS', label: 'Extensiones de Uñas' },
  { value: 'NAIL_MAINTENANCE', label: 'Mantenimiento' },
  { value: 'SPA_TREATMENTS', label: 'Tratamientos Spa' },
] as const;

export type ServiceType = (typeof SERVICE_TYPES)[number]['value'];

// Search params for service filtering
export type ServiceSearchParams = {
  search?: string;
  type?: string;
  page?: string;
  limit?: string;
};

// Pagination info for services
export type ServicePaginationInfo = {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
};
