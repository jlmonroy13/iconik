import { ReactNode } from 'react';

// Common UI prop types
export type BaseComponentProps = {
  className?: string;
  children?: ReactNode;
};

export type ButtonVariant =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link';
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

export type InputVariant = 'default' | 'error' | 'success';
export type InputSize = 'default' | 'sm' | 'lg';

// Table types
export type TableColumn<T> = {
  key: keyof T | string;
  header: string;
  cell?: (item: T) => ReactNode;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
};

export type TableProps<T> = {
  data: T[];
  columns: TableColumn<T>[];
  onRowClick?: (item: T) => void;
  loading?: boolean;
  emptyMessage?: string;
  pagination?: {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
};

// Form types
export type FormFieldProps = {
  label?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  helperText?: string;
};

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

// Modal types
export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
};

// Card types
export type CardProps = BaseComponentProps & {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
};

// Badge types
export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';
export type BadgeSize = 'default' | 'sm' | 'lg';

// Status types
export type StatusVariant =
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'default';

// Loading states
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Navigation types
export type NavigationItem = {
  href: string;
  label: string;
  icon?: ReactNode;
  badge?: string | number;
  children?: NavigationItem[];
  disabled?: boolean;
  external?: boolean;
};

// Breadcrumb types
export type BreadcrumbItem = {
  label: string;
  href?: string;
  current?: boolean;
};

// Filter types
export type FilterOption = {
  value: string;
  label: string;
  count?: number;
};

export type FilterGroup = {
  key: string;
  label: string;
  options: FilterOption[];
  multiple?: boolean;
};

// Search types
export type SearchProps = {
  placeholder?: string;
  onSearch: (query: string) => void;
  debounceMs?: number;
  minLength?: number;
  suggestions?: string[];
};

// Pagination types
export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  showItemsPerPage?: boolean;
  itemsPerPageOptions?: number[];
};

// Notification types
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export type NotificationProps = {
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  onClose?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
};

// Tooltip types
export type TooltipProps = {
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  disabled?: boolean;
};

// Dropdown types
export type DropdownItem = {
  label: string;
  value?: string;
  icon?: ReactNode;
  disabled?: boolean;
  divider?: boolean;
  onClick?: () => void;
};

// Tabs types
export type TabItem = {
  id: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
  icon?: ReactNode;
};

// Accordion types
export type AccordionItem = {
  id: string;
  title: string;
  content: ReactNode;
  disabled?: boolean;
};

// File upload types
export type FileUploadProps = {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  onUpload: (files: File[]) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
  dragAndDrop?: boolean;
};

// Date picker types
export type DatePickerProps = {
  value?: Date;
  onChange: (date: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  placeholder?: string;
  format?: string;
};

// Time picker types
export type TimePickerProps = {
  value?: string;
  onChange: (time: string) => void;
  minTime?: string;
  maxTime?: string;
  step?: number;
  disabled?: boolean;
  placeholder?: string;
  format?: '12h' | '24h';
};
