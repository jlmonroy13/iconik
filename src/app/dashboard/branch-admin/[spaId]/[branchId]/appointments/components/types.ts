import type { z } from 'zod';
import type { appointmentFormSchema } from '@/types/forms';

export type AppointmentFormData = z.input<typeof appointmentFormSchema>;
