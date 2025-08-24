import type { Metadata } from 'next'
import HomePageClient from '../components/pages/HomePageClient'

export const metadata: Metadata = {
  title: 'Iconik - SaaS para Gestión de Spas de Uñas',
  description: 'Plataforma multi-tenant para gestionar operaciones de spas de uñas: agendamiento, ventas, inventario y más.',
}

export default async function HomePage() {
  // If no session, show the landing page
  return <HomePageClient />
}
