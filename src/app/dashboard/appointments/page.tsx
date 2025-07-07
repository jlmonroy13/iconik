import { prisma } from '@/lib/prisma'
import {
  AppointmentsClient
} from './components'
import { AppointmentsSection } from './components/AppointmentsSection'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Citas - Iconik',
  description: 'Gestiona el calendario de citas de tu spa de uñas. Programa, confirma y organiza las citas de tus clientes.',
}

async function getAppointmentsData() {
  // Get the first spa for now (later we'll get from session)
  const spa = await prisma.spa.findFirst()

  if (!spa) {
    return {
      appointments: [],
      clients: [],
      manicurists: [],
      services: [],
      stats: {
        total: 0,
        scheduled: 0,
        confirmed: 0,
        inProgress: 0,
        completed: 0,
        cancelled: 0,
        noShow: 0
      }
    }
  }

  const [appointments, clients, manicurists, services] = await Promise.all([
    prisma.appointment.findMany({
      where: { spaId: spa.id },
      include: {
        client: true,
        manicurist: true,
        services: {
          include: {
            service: true,
            manicurist: true,
            payments: {
              include: {
                paymentMethod: true
              }
            },
            feedback: true
          }
        },
        payments: {
          include: {
            paymentMethod: true
          }
        }
      },
      orderBy: { scheduledAt: 'asc' }
    }),
    prisma.client.findMany({
      where: { spaId: spa.id },
      select: { id: true, name: true },
      orderBy: { name: 'asc' }
    }),
    prisma.manicurist.findMany({
      where: { spaId: spa.id, isActive: true },
      select: { id: true, name: true },
      orderBy: { name: 'asc' }
    }),
    prisma.service.findMany({
      where: { spaId: spa.id },
      select: { id: true, type: true },
      orderBy: { type: 'asc' }
    })
  ])

  // Clean nulls to undefined for all appointments and their relations
  const cleanedAppointments = appointments.map(a => ({
    ...a,
    manicuristId: a.manicuristId ?? undefined,
    notes: a.notes ?? undefined,
    client: {
      ...a.client,
      phone: a.client.phone ?? undefined,
      email: a.client.email ?? undefined,
      notes: a.client.notes ?? undefined,
      birthday: a.client.birthday ?? undefined,
    },
    manicurist: a.manicurist
      ? {
          ...a.manicurist,
          phone: a.manicurist.phone ?? undefined,
          email: a.manicurist.email ?? undefined,
        }
      : undefined,
    services: a.services
      .filter(s => !!s.service && !!s.manicurist)
      .map(s => ({
        ...s,
        appointment: {
          ...a,
          manicuristId: a.manicuristId ?? undefined,
          notes: a.notes ?? undefined,
        },
        service: {
          ...s.service,
          description: s.service.description ?? undefined,
          kitCost: s.service.kitCost ?? undefined,
          taxRate: s.service.taxRate ?? undefined,
          imageUrl: s.service.imageUrl ?? undefined,
        },
        startedAtByManicurist: s.startedAtByManicurist ?? undefined,
        endedAtByManicurist: s.endedAtByManicurist ?? undefined,
        startedAtByAdmin: s.startedAtByAdmin ?? undefined,
        endedAtByAdmin: s.endedAtByAdmin ?? undefined,
        durationAvg: s.durationAvg ?? undefined,
        kitCost: s.kitCost ?? undefined,
        taxRate: s.taxRate ?? undefined,
        manicurist: {
          ...s.manicurist,
          phone: s.manicurist.phone ?? undefined,
          email: s.manicurist.email ?? undefined,
        },
        payments: (s.payments ?? [])
          .filter(p => !!p.paymentMethod)
          .map(p => ({
            ...p,
            appointmentId: p.appointmentId ?? undefined,
            appointmentServiceId: p.appointmentServiceId ?? undefined,
            paymentMethod: {
              ...p.paymentMethod,
              type: p.paymentMethod.type ?? undefined,
              icon: p.paymentMethod.icon ?? undefined
            },
            reference: p.reference ?? undefined,
            discountReason: p.discountReason ?? undefined,
          })),
        feedback: s.feedback ? { ...s.feedback, comment: s.feedback.comment ?? undefined, submittedAt: s.feedback.submittedAt ?? undefined } : undefined,
      })),
    payments: (a.payments ?? [])
      .filter(p => !!p.paymentMethod)
      .map(p => ({
        ...p,
        appointmentId: p.appointmentId ?? undefined,
        appointmentServiceId: p.appointmentServiceId ?? undefined,
        paymentMethod: {
          ...p.paymentMethod,
          type: p.paymentMethod.type ?? undefined,
          icon: p.paymentMethod.icon ?? undefined
        },
        reference: p.reference ?? undefined,
        discountReason: p.discountReason ?? undefined,
      })),
  }))

  // Calculate stats
  const stats = {
    total: cleanedAppointments.length,
    scheduled: cleanedAppointments.filter(a => a.status === 'SCHEDULED').length,
    inProgress: cleanedAppointments.filter(a => a.status === 'IN_PROGRESS').length,
    completed: cleanedAppointments.filter(a => a.status === 'COMPLETED').length,
    cancelled: cleanedAppointments.filter(a => a.status === 'CANCELLED').length,
    noShow: cleanedAppointments.filter(a => a.status === 'NO_SHOW').length
  }

  // Transform services to have name property
  const servicesWithNames = services.map(service => ({
    id: service.type,
    name: service.type.replace(/_/g, ' ')
  }))

  return {
    appointments: cleanedAppointments,
    clients,
    manicurists,
    services: servicesWithNames,
    stats
  }
}

export default async function AppointmentsPage() {
  const { appointments, clients, manicurists, services, stats } = await getAppointmentsData()

  return (
    <AppointmentsClient
      clients={clients}
      manicurists={manicurists}
      services={services}
    >
      <AppointmentsSection appointments={appointments} stats={stats} />
    </AppointmentsClient>
  )
}
