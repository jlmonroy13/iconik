"use client"
import { useState } from 'react'
import { DashboardSectionLayout } from '../../components/DashboardSectionLayout'
import { ManicuristClientWrapper } from './ManicuristClientWrapper'
import { ManicuristStats } from './ManicuristStats'
import { Users, Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { Manicurist, ManicuristStatsData } from '../types'

interface ManicuristsClientPageProps {
  manicurists: Manicurist[]
  stats: ManicuristStatsData
}

export default function ManicuristsClientPage({ manicurists, stats }: ManicuristsClientPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedManicurist, setSelectedManicurist] = useState<Manicurist | undefined>(undefined)

  const openCreateModal = () => {
    setSelectedManicurist(undefined)
    setIsModalOpen(true)
  }

  return (
    <DashboardSectionLayout
      icon={<Users className="w-8 h-8 text-blue-600" />}
      title="Manicuristas"
      description="Gestiona el equipo de profesionales de tu spa."
      stats={<ManicuristStats stats={stats} />}
      actionButton={
        <Button onClick={openCreateModal} variant="primary" className="w-full sm:w-auto flex items-center gap-2">
          <Plus className="h-4 w-4" /> Nueva Manicurista
        </Button>
      }
    >
      <ManicuristClientWrapper
        manicurists={manicurists}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedManicurist={selectedManicurist}
        setSelectedManicurist={setSelectedManicurist}
      />
    </DashboardSectionLayout>
  )
}
