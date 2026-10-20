import type { Appointment, ReservationDraft, ReservationErrors, ReservationVariant, ServiceId } from './types';

export const serviceContexts: Record<ServiceId, string> = { advice:'university', workshop:'university', health:'healthcare', visit:'culture', culture:'culture' };
export const localDay = (now = new Date()) => `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;

export function scheduleError(date: string, time: string, now = new Date()): '' | 'dateRequired' | 'dateInvalid' | 'timeRequired' | 'timePast' {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return 'dateRequired';
  const parsed = new Date(`${date}T12:00:00`);
  if (!Number.isFinite(parsed.getTime()) || localDay(parsed)!==date || date<localDay(now)) return 'dateInvalid';
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) return 'timeRequired';
  if (new Date(`${date}T${time}:00`).getTime()<=now.getTime()) return 'timePast';
  return '';
}

export const isConfirmed = (appointment: Appointment) => appointment.status === 'confirmed';
export const sameBooking = (a: Appointment, b: Pick<ReservationDraft, 'service' | 'serviceId' | 'date' | 'time'>) => isConfirmed(a) && (a.serviceId && b.serviceId ? a.serviceId===b.serviceId : a.service===b.service) && a.date===b.date && a.time===b.time;
export function appointmentStateError(appointment: Appointment | undefined): 'notFound' | 'notConfirmed' | undefined {
  if (!appointment) return 'notFound';
  if (!isConfirmed(appointment)) return 'notConfirmed';
}

export type ValidationOptions = {
  context?: string;
  editingId?: string;
  stage?: 'selection' | 'schedule' | 'all';
  variant?: ReservationVariant;
  now?: Date;
};

export function validateReservation(draft: ReservationDraft, appointments: readonly Appointment[], options: ValidationOptions = {}): ReservationErrors {
  const { context = '', editingId = '', stage = 'all', variant = 'catalog', now = new Date() } = options;
  const errors: ReservationErrors = {};
  if (stage !== 'schedule') {
    if (variant === 'catalog' && !editingId && !context) errors.context = 'required';
    if (!draft.service.trim() || (variant === 'catalog' && !editingId && !draft.serviceId)) errors.service = 'required';
  }
  if (stage !== 'selection') {
    if (variant === 'example') {
      // The device demonstration historically checks presence, not future availability.
      if (!draft.date) errors.date = 'dateRequired';
      if (!draft.time) errors.time = 'timeRequired';
    } else {
      const code = scheduleError(draft.date, draft.time, now);
      if (code === 'dateRequired' || code === 'dateInvalid') errors.date = code;
      else if (code) errors.time = code;
    }
    if ((variant === 'catalog' || stage === 'all') && !Object.keys(errors).length && appointments.some(a => a.id !== editingId && sameBooking(a, draft))) errors.time = 'duplicate';
  }
  return errors;
}
