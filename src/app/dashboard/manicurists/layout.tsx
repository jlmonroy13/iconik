import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Manicuristas - Iconik',
  description: 'Gestiona tu equipo de manicuristas. Agrega, edita y organiza la información de los profesionales de tu spa de uñas.',
}

export default function ManicuristsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
