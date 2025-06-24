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
