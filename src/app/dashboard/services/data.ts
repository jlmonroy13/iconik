import { Service } from './types'

export const STATIC_SERVICES: Service[] = [
  {
    id: '1',
    type: 'GEL_POLISH',
    client: { name: 'Camila Herrera' },
    manicurist: { name: 'Valentina Morales' },
    price: 35000,
    paymentMethod: 'TRANSFER',
    rating: 5,
    notes: 'Gel polish color rojo',
    createdAt: new Date('2024-05-24T19:00:00')
  },
  {
    id: '2',
    type: 'PEDICURE',
    client: { name: 'Sofia Martinez' },
    manicurist: { name: 'Valentina Morales' },
    price: 30000,
    paymentMethod: 'CARD',
    rating: 4,
    notes: 'Pedicure spa con exfoliación',
    createdAt: new Date('2024-05-21T19:00:00')
  },
  {
    id: '3',
    type: 'NAIL_ART',
    client: { name: 'Isabella Torres' },
    manicurist: { name: 'Andrea Vargas' },
    price: 45000,
    paymentMethod: 'CARD',
    rating: 5,
    notes: 'Diseño floral con colores pasteles',
    createdAt: new Date('2024-05-19T19:00:00')
  },
  {
    id: '4',
    type: 'MANICURE',
    client: { name: 'Sofia Martinez' },
    manicurist: { name: 'Andrea Vargas' },
    price: 25000,
    paymentMethod: 'CASH',
    rating: 5,
    notes: 'Manicure clásico con esmalte rosa',
    createdAt: new Date('2024-05-14T19:00:00')
  },
  {
    id: '5',
    type: 'ACRYLIC_NAILS',
    client: { name: 'Karla Torres' },
    manicurist: { name: 'Andrea Vargas' },
    price: 25000,
    paymentMethod: 'CASH',
    rating: 5,
    notes: 'Manicure clásico con esmalte rosa',
    createdAt: new Date('2024-05-14T19:00:00')
  }
]
