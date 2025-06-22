export interface Client {
  id: string
  name: string
  email: string
  phone: string
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
    registeredAt: '2022-11-20',
    status: 'INACTIVE',
    totalSpent: 400000,
    visits: 3
  }
]
