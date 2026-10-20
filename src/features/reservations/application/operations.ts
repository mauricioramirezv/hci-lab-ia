import type { Appointment, ReservationDraft, ReservationVariant } from '../domain/types';
import { appointmentStateError, validateReservation } from '../domain/rules';
import type { ReservationRepository, ReservationResult } from './ReservationRepository';

type CreateOptions = { context?: string; variant?: ReservationVariant };
type Dependencies = { id: () => string; now: () => Date };
const details = (draft: ReservationDraft): ReservationDraft => ({
  service:draft.service, date:draft.date, time:draft.time,
  ...(Object.hasOwn(draft,'serviceId') ? {serviceId:draft.serviceId} : {}),
  ...(Object.hasOwn(draft,'condition') ? {condition:draft.condition} : {}),
});

export function createReservationOperations(repository: ReservationRepository, dependencies: Dependencies) {
  const list = () => repository.read();
  const get = (id: string) => repository.read().find(a => a.id === id);
  const validate = (draft: ReservationDraft, options: Parameters<typeof validateReservation>[2] = {}) => validateReservation(draft, repository.read(), {now:dependencies.now(), ...options});

  const create = (draft: ReservationDraft, options: CreateOptions = {}): ReservationResult => repository.transact(current => {
    const now = dependencies.now();
    const errors = validateReservation(draft, current, {...options, now});
    if (Object.keys(errors).length) return {ok:false, errors};
    const appointment: Appointment = {...details(draft), id:dependencies.id(), status:'confirmed', createdAt:now.toISOString()};
    return {ok:true, appointment, appointments:[...current, appointment]};
  });

  const reschedule = (id: string, draft: ReservationDraft, variant: ReservationVariant = 'catalog'): ReservationResult => repository.transact(current => {
    const previous = current.find(a => a.id === id);
    const reason = appointmentStateError(previous);
    if (reason || !previous) return {ok:false, errors:{}, reason:reason || 'notFound'};
    const errors = validateReservation(draft, current, {editingId:id, variant, now:dependencies.now()});
    if (Object.keys(errors).length) return {ok:false, errors};
    const appointment = {...previous, ...details(draft)};
    return {ok:true, appointment, appointments:current.map(a => a.id === id ? appointment : a)};
  });

  const cancel = (id: string): ReservationResult => repository.transact(current => {
    const previous = current.find(a => a.id === id);
    const reason = appointmentStateError(previous);
    if (reason || !previous) return {ok:false, errors:{}, reason:reason || 'notFound'};
    const appointment: Appointment = {...previous, status:'cancelled'};
    return {ok:true, appointment, appointments:current.map(a => a.id === id ? appointment : a)};
  });
  return {list, get, validate, create, reschedule, cancel};
}
export type ReservationOperations = ReturnType<typeof createReservationOperations>;
