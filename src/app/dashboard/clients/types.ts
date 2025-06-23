export interface Client {
  id: string
  name: string
  email: string
  phone: string
  identificationType: 'CC' | 'CE' | 'PAS' | 'NIT' | 'OTRO'
  identification: string
  registeredAt: string // ISO date
  status: 'ACTIVE' | 'INACTIVE'
  totalSpent: number
  visits: number
}

export interface ClientFilters {
  search?: string
  status?: 'ACTIVE' | 'INACTIVE'
  dateFrom?: string
  dateTo?: string
}

// Mock de clientes para desarrollo
export const mockClients: Client[] = [
  {
    id: '1',
    name: 'Ana López',
    email: 'ana.lopez@example.com',
    phone: '+57 300 111 2233',
    identificationType: 'CC',
    identification: '123456789',
    registeredAt: '2023-01-15',
    status: 'ACTIVE',
    totalSpent: 1200000,
    visits: 12
  },
  {
    id: '2',
    name: 'María García',
    email: 'maria.garcia@example.com',
    phone: '+57 300 222 3344',
    identificationType: 'CE',
    identification: '987654321',
    registeredAt: '2023-03-10',
    status: 'ACTIVE',
    totalSpent: 950000,
    visits: 8
  },
  {
    id: '3',
    name: 'Laura Torres',
    email: 'laura.torres@example.com',
    phone: '+57 300 333 4455',
    identificationType: 'PAS',
    identification: 'A1234567',
    registeredAt: '2022-11-20',
    status: 'INACTIVE',
    totalSpent: 400000,
    visits: 3
  },
  {
    id: '4',
    name: 'Ana López',
    email: 'ana.lopez@example.com',
    phone: '+57 300 111 2233',
    identificationType: 'CC',
    identification: '123456789',
    registeredAt: '2023-01-15',
    status: 'ACTIVE',
    totalSpent: 1200000,
    visits: 12
  },
  {
    id: '5',
    name: 'María García',
    email: 'maria.garcia@example.com',
    phone: '+57 300 222 3344',
    identificationType: 'CE',
    identification: '987654321',
    registeredAt: '2023-03-10',
    status: 'ACTIVE',
    totalSpent: 950000,
    visits: 8
  },
  {
    id: '6',
    name: 'Laura Torres',
    email: 'laura.torres@example.com',
    phone: '+57 300 333 4455',
    identificationType: 'PAS',
    identification: 'A1234567',
    registeredAt: '2022-11-20',
    status: 'INACTIVE',
    totalSpent: 400000,
    visits: 9
  },
  {
    id: '7',
    name: 'Ana López',
    email: 'ana.lopez@example.com',
    phone: '+57 300 111 2233',
    identificationType: 'CC',
    identification: '123456789',
    registeredAt: '2023-01-15',
    status: 'ACTIVE',
    totalSpent: 1200000,
    visits: 12
  },
  {
    id: '8',
    name: 'María García',
    email: 'maria.garcia@example.com',
    phone: '+57 300 222 3344',
    identificationType: 'CE',
    identification: '987654321',
    registeredAt: '2023-03-10',
    status: 'ACTIVE',
    totalSpent: 950000,
    visits: 8
  },
  {
    id: '9',
    name: 'Laura Torres',
    email: 'laura.torres@example.com',
    phone: '+57 300 333 4455',
    identificationType: 'PAS',
    identification: 'A1234567',
    registeredAt: '2022-11-20',
    status: 'INACTIVE',
    totalSpent: 400000,
    visits: 3
  }
]
