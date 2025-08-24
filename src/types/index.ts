// Re-export all types from their respective modules
export * from './auth';
export * from './forms';
export * from './api';
export * from './ui';
export type {
  Spa,
  Branch,
  Service,
  Manicurist,
  Client,
  Appointment,
  Payment,
  SpaWithBranches,
  SpaWithStats,
  BranchWithStats,
  ServiceWithBranch,
  ManicuristWithBranch,
  ClientWithBranch,
  AppointmentWithDetails,
  SpaCreateInput,
  SpaUpdateInput,
  BranchCreateInput,
  BranchUpdateInput,
  ServiceCreateInput,
  ServiceUpdateInput,
  ManicuristCreateInput,
  ManicuristUpdateInput,
  ClientCreateInput,
  ClientUpdateInput,
  UserCreateInput,
  UserUpdateInput,
  SpaWhereInput,
  BranchWhereInput,
  ServiceWhereInput,
  ManicuristWhereInput,
  ClientWhereInput,
  AppointmentWhereInput,
  SpaSelect,
  BranchSelect,
  ServiceSelect,
  ManicuristSelect,
  ClientSelect,
  AppointmentSelect,
  SpaInclude,
  BranchInclude,
  ServiceInclude,
  ManicuristInclude,
  ClientInclude,
  AppointmentInclude,
} from './prisma';

// Common type utilities
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type NonNullable<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};

// Utility types for common patterns
export type WithId<T> = T & { id: string };

export type WithTimestamps<T> = T & {
  createdAt: Date;
  updatedAt: Date;
};

export type WithSpaId<T> = T & { spaId: string };

export type WithBranchId<T> = T & { branchId: string };

export type WithSpaAndBranchId<T> = T & { spaId: string; branchId: string };

// Status types
export type EntityStatus = 'active' | 'inactive' | 'pending' | 'deleted';

export type WithStatus<T> = T & { status: EntityStatus };

// Pagination utilities
export type PageInfo = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PaginatedData<T> = {
  data: T[];
  pagination: PageInfo;
};

// Form utilities
export type FormState<T> = {
  data: T;
  errors: Partial<Record<keyof T, string>>;
  isSubmitting: boolean;
  isValid: boolean;
};

// API utilities
export type ApiState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

// Route parameters
export type SpaRouteParams = {
  spaId: string;
};

export type BranchRouteParams = SpaRouteParams & {
  branchId: string;
};

export type IdRouteParams = {
  id: string;
};

// Search and filter utilities
export type SearchParams = {
  q?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};

export type FilterParams = {
  status?: string;
  isActive?: boolean;
  dateFrom?: string;
  dateTo?: string;
  branchId?: string;
};

export type CombinedSearchParams = SearchParams & FilterParams;
