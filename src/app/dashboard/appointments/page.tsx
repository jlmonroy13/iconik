import {
  getAppointments,
  getAppointmentStats,
  getAppointmentClients,
  getAppointmentManicurists,
  getAppointmentServices,
} from './actions';
import AppointmentsClientPage from './components/AppointmentsClientPage';
import type { Metadata } from 'next';
import type {
  AppointmentWithDetails,
  AppointmentServiceWithDetails,
} from '@/types';

function isAppointmentServiceWithDetails(
  s: unknown
): s is AppointmentServiceWithDetails {
  return (
    !!s &&
    typeof s === 'object' &&
    'appointment' in s &&
    s.appointment !== undefined &&
    'service' in s &&
    s.service !== undefined &&
    'manicurist' in s &&
    s.manicurist !== undefined &&
    Array.isArray((s as AppointmentServiceWithDetails).payments) &&
    (s as AppointmentServiceWithDetails).payments.every(
      p => p.paymentMethod !== undefined && p.paymentMethod !== null
    )
  );
}

export const metadata: Metadata = {
  title: 'Citas - Iconik',
  description:
    'Gestiona el calendario de citas de tu spa de uñas. Programa, confirma y organiza las citas de tus clientes.',
};

export default async function AppointmentsPage() {
  const appointmentsResult = await getAppointments();
  const statsResult = await getAppointmentStats();
  const clientsResult = await getAppointmentClients();
  const manicuristsResult = await getAppointmentManicurists();
  const servicesResult = await getAppointmentServices();

  if (!appointmentsResult.success) {
    return (
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center'>
        <h2 className='text-lg font-bold mb-2'>Error al cargar las citas</h2>
        <p className='text-gray-500 dark:text-gray-400'>
          {appointmentsResult.message}
        </p>
      </div>
    );
  }
  if (!clientsResult.success) {
    return (
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center'>
        <h2 className='text-lg font-bold mb-2'>Error al cargar los clientes</h2>
        <p className='text-gray-500 dark:text-gray-400'>
          {clientsResult.message}
        </p>
      </div>
    );
  }
  if (!manicuristsResult.success) {
    return (
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center'>
        <h2 className='text-lg font-bold mb-2'>
          Error al cargar las manicuristas
        </h2>
        <p className='text-gray-500 dark:text-gray-400'>
          {manicuristsResult.message}
        </p>
      </div>
    );
  }
  if (!servicesResult.success) {
    return (
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center'>
        <h2 className='text-lg font-bold mb-2'>
          Error al cargar los servicios
        </h2>
        <p className='text-gray-500 dark:text-gray-400'>
          {servicesResult.message}
        </p>
      </div>
    );
  }

  const appointmentsRaw = appointmentsResult.data || [];
  const cleanedAppointments: AppointmentWithDetails[] = appointmentsRaw
    .filter(
      a =>
        !!a.client &&
        Array.isArray(a.services) &&
        a.services.every(isAppointmentServiceWithDetails)
    )
    .map(a => ({
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
      services: (
        a.services.filter(
          isAppointmentServiceWithDetails
        ) as AppointmentServiceWithDetails[]
      ).map(s => ({
        ...s,
        startedAtByManicurist: s.startedAtByManicurist ?? undefined,
        endedAtByManicurist: s.endedAtByManicurist ?? undefined,
        startedAtByAdmin: s.startedAtByAdmin ?? undefined,
        endedAtByAdmin: s.endedAtByAdmin ?? undefined,
        durationAvg: s.durationAvg ?? undefined,
        kitCost: s.kitCost ?? undefined,
        taxRate: s.taxRate ?? undefined,
        appointment: {
          ...s.appointment,
          manicuristId: s.appointment.manicuristId ?? undefined,
          notes: s.appointment.notes ?? undefined,
        },
        service: {
          ...s.service,
          description: s.service.description ?? undefined,
          kitCost: s.service.kitCost ?? undefined,
          taxRate: s.service.taxRate ?? undefined,
          imageUrl: s.service.imageUrl ?? undefined,
        },
        manicurist: {
          ...s.manicurist,
          phone: s.manicurist.phone ?? undefined,
          email: s.manicurist.email ?? undefined,
        },
        payments: s.payments.map(p => ({
          ...p,
          appointmentId: p.appointmentId ?? undefined,
          appointmentServiceId: p.appointmentServiceId ?? undefined,
          paymentMethod: {
            ...p.paymentMethod,
            type: p.paymentMethod.type ?? undefined,
            icon: p.paymentMethod.icon ?? undefined,
          },
          reference: p.reference ?? undefined,
          discountReason: p.discountReason ?? undefined,
        })),
        feedback: s.feedback
          ? {
              ...s.feedback,
              comment: s.feedback.comment ?? undefined,
              submittedAt: s.feedback.submittedAt ?? undefined,
            }
          : undefined,
      })),
      payments: (a.payments ?? [])
        .filter(p => p.paymentMethod !== undefined && p.paymentMethod !== null)
        .map(p => ({
          ...p,
          appointmentId: p.appointmentId ?? undefined,
          appointmentServiceId: p.appointmentServiceId ?? undefined,
          paymentMethod: {
            ...p.paymentMethod,
            type: p.paymentMethod.type ?? undefined,
            icon: p.paymentMethod.icon ?? undefined,
          },
          reference: p.reference ?? undefined,
          discountReason: p.discountReason ?? undefined,
        })),
    }));

  const stats =
    statsResult.success && statsResult.data
      ? statsResult.data
      : { total: 0, completed: 0, cancelled: 0 };
  const clients = clientsResult.data || [];
  const manicurists = manicuristsResult.data || [];
  const services = servicesResult.data || [];

  return (
    <AppointmentsClientPage
      appointments={cleanedAppointments}
      stats={stats}
      clients={clients}
      manicurists={manicurists}
      services={services}
    />
  );
}
