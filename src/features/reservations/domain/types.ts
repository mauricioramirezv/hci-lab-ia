export const services = ['advice', 'workshop', 'health', 'visit', 'culture'] as const;
export type ServiceId = typeof services[number];
export type Appointment = {
  id: string;
  service: string;
  date: string;
  time: string;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
  serviceId?: ServiceId;
  condition?: 'good' | 'bad';
};
export type ReservationDraft = Pick<Appointment, 'service' | 'serviceId' | 'date' | 'time' | 'condition'>;
export type ReservationValidationCode = 'required' | 'dateRequired' | 'dateInvalid' | 'timeRequired' | 'timePast' | 'duplicate';
export type ReservationErrors = Partial<Record<'context' | 'service' | 'date' | 'time', ReservationValidationCode>>;
export type ReservationVariant = 'catalog' | 'example';
