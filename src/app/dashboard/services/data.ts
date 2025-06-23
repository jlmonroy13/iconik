import { Service, ServiceRecord } from './types'

export const STATIC_SERVICES: Service[] = [
  {
    id: '1',
    name: 'Esmaltado en Gel',
    description: 'Aplicación de gel polish color rojo.',
    price: 35000,
    duration: 60,
    category: 'MANOS',
    status: 'ACTIVE',
  },
  {
    id: '2',
    name: 'Pedicure Spa',
    description: 'Pedicure spa con exfoliación.',
    price: 30000,
    duration: 50,
    category: 'PIES',
    status: 'ACTIVE',
  },
  {
    id: '3',
    name: 'Nail Art Floral',
    description: 'Diseño floral con colores pasteles.',
    price: 45000,
    duration: 90,
    category: 'MANOS',
    status: 'INACTIVE',
  },
  {
    id: '4',
    name: 'Manicure Clásico',
    description: 'Manicure clásico con esmalte rosa.',
    price: 25000,
    duration: 40,
    category: 'MANOS',
    status: 'ACTIVE',
  },
  {
    id: '5',
    name: 'Uñas Acrílicas',
    description: 'Aplicación de uñas acrílicas con diseño.',
    price: 50000,
    duration: 120,
    category: 'MANOS',
    status: 'INACTIVE',
  }
]

export const SERVICE_HISTORY: ServiceRecord[] = [
  {
    id: 'h1',
    type: 'MANICURE',
    client: { name: 'Camila Herrera' },
    manicurist: { name: 'Valentina Morales' },
    price: 25000,
    paymentMethod: 'CARD',
    rating: 5,
    notes: 'Manicure clásico',
    createdAt: new Date('2024-05-24T19:00:00')
  },
  {
    id: 'h2',
    type: 'PEDICURE',
    client: { name: 'Sofia Martinez' },
    manicurist: { name: 'Andrea Vargas' },
    price: 30000,
    paymentMethod: 'CASH',
    rating: 4,
    notes: 'Pedicure spa',
    createdAt: new Date('2024-05-21T19:00:00')
  },
  {
    id: 'h3',
    type: 'MANICURE',
    client: { name: 'Isabella Torres' },
    manicurist: { name: 'Andrea Vargas' },
    price: 25000,
    paymentMethod: 'CARD',
    rating: 5,
    notes: 'Manicure clásico',
    createdAt: new Date('2024-05-20T19:00:00')
  },
  {
    id: 'h4',
    type: 'MANICURE',
    client: { name: 'Laura Gómez' },
    manicurist: { name: 'Valentina Morales' },
    price: 25000,
    paymentMethod: 'TRANSFER',
    rating: 4,
    notes: 'Manicure clásico',
    createdAt: new Date('2024-05-18T19:00:00')
  },
  {
    id: 'h5',
    type: 'PEDICURE',
    client: { name: 'Ana López' },
    manicurist: { name: 'Andrea Vargas' },
    price: 30000,
    paymentMethod: 'CASH',
    rating: 5,
    notes: 'Pedicure spa',
    createdAt: new Date('2024-05-17T19:00:00')
  }
]
