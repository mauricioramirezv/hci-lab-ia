import type { Appointment, ReservationErrors } from '../domain/types';

export type ReservationFailureCode = 'notFound' | 'notConfirmed' | 'storageFailed' | 'staleProject';
export type ReservationFailure = { ok: false; errors: ReservationErrors; reason?: ReservationFailureCode };
export type ReservationResult = { ok: true; appointment: Appointment } | ReservationFailure;
export type ReservationChange = { ok: true; appointment: Appointment; appointments: Appointment[] } | ReservationFailure;

// Validation and mutation share one current snapshot, including rapid consecutive commands.
export interface ReservationRepository {
  read(): readonly Appointment[];
  transact(change: (current: readonly Appointment[]) => ReservationChange): ReservationResult;
}
