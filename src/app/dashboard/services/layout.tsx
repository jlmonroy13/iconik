import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Servicios - Iconik',
  description: 'Gestiona y visualiza todos los servicios realizados en tu spa de uñas. Filtra por tipo, manicurista y fecha.',
}

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
