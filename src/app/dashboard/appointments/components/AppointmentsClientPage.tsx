"use client"
import { useState } from 'react'
import { DashboardSectionLayout } from '../../components/DashboardSectionLayout'
import { AppointmentStats } from './AppointmentStats'
import { AppointmentsClientWrapper } from './AppointmentsClientWrapper'
import { CalendarPlus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { AppointmentWithDetails } from '../types'

interface Option {
  id: string
  name: string
}

interface AppointmentStatsData {
  total: number
  completed?: number
  cancelled?: number
  mostPopularService?: string
}

interface AppointmentsClientPageProps {
  appointments: AppointmentWithDetails[]
  stats: AppointmentStatsData
  clients: Option[]
  manicurists: Option[]
  services: Option[]
}

export default function AppointmentsClientPage({ appointments, stats, clients, manicurists, services }: AppointmentsClientPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentWithDetails | undefined>(undefined)

  const openCreateModal = () => {
    setSelectedAppointment(undefined)
    setIsModalOpen(true)
  }

  return (
    <DashboardSectionLayout
      icon={<CalendarPlus className="w-8 h-8 text-blue-600" />}
      title="Citas"
      description="Administra y organiza las citas de tus clientes."
      stats={<AppointmentStats stats={stats} />}
      actionButton={
        <Button onClick={openCreateModal} variant="primary" className="w-full sm:w-auto flex items-center gap-2">
          <CalendarPlus className="h-4 w-4" /> Nueva Cita
        </Button>
      }
    >
      <AppointmentsClientWrapper
        appointments={appointments}
        clients={clients}
        manicurists={manicurists}
        services={services}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedAppointment={selectedAppointment}
        setSelectedAppointment={setSelectedAppointment}
      />
    </DashboardSectionLayout>
  )
}
