// Generic API response types
export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export type ApiError = {
  success: false;
  error: string;
  code?: string;
  details?: Record<string, unknown>;
};

export type ApiSuccess<T> = {
  success: true;
  data: T;
  message?: string;
};

// Pagination types
export type PaginationParams = {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};

// List response types
export type ListResponse<T> = ApiSuccess<PaginatedResponse<T>>;

// CRUD operation types
export type CreateResponse<T> = ApiSuccess<T>;
export type UpdateResponse<T> = ApiSuccess<T>;
export type DeleteResponse = ApiSuccess<{ id: string }>;

// Server action result types
export type ServerActionResult<T = unknown> = Promise<ApiResponse<T>>;

// Common query parameters
export type SpaQueryParams = {
  spaId: string;
};

export type BranchQueryParams = SpaQueryParams & {
  branchId?: string;
};

// Filter types
export type DateRangeFilter = {
  startDate?: Date;
  endDate?: Date;
};

export type StatusFilter = {
  status?: string;
  isActive?: boolean;
};

export type SearchFilter = {
  search?: string;
  query?: string;
};

// Combined filter types
export type CommonFilters = DateRangeFilter & StatusFilter & SearchFilter;
