import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Clientes - Iconik',
  description:
    'Gestiona tu base de datos de clientes. Agrega, edita y organiza la información de tus clientes del spa de uñas.',
};

export default function ClientsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
