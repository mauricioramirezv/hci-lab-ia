// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { appointmentStateError, sameBooking, validateReservation } from '../../src/features/reservations/domain/rules';
import type { Appointment, ReservationDraft } from '../../src/features/reservations/domain/types';

const now = new Date(2026, 9, 19, 12, 0);
const draft: ReservationDraft = {service:'Consulta', serviceId:'health', date:'2026-10-20', time:'10:30'};
const confirmed: Appointment = {...draft, id:'original', createdAt:'2026-10-18T12:00:00.000Z', status:'confirmed'};

describe('reservation rules without a browser', () => {
  it('requires context and a catalog service, while preserving legacy editing', () => {
    expect(validateReservation({...draft,service:' ',serviceId:undefined},[],{now})).toEqual({context:'required',service:'required'});
    expect(validateReservation({...draft,serviceId:undefined},[confirmed],{now,editingId:'original'})).toEqual({});
    expect(validateReservation(draft,[],{context:'healthcare',now})).toEqual({});
  });
  it('validates each stage without leaking untranslated messages or UI step numbers', () => {
    const missing = {...draft,date:'',time:''};
    expect(validateReservation(missing,[],{context:'healthcare',stage:'selection',now})).toEqual({});
    expect(validateReservation(missing,[],{stage:'schedule',now})).toEqual({date:'dateRequired'});
    expect(validateReservation({...draft,date:'2026-10-19',time:'12:00'},[],{context:'healthcare',now})).toEqual({time:'timePast'});
  });
  it('handles invalid calendar dates, leap days and midnight using the injected local clock', () => {
    expect(validateReservation({...draft,date:'2026-02-29'},[],{context:'healthcare',now})).toEqual({date:'dateInvalid'});
    expect(validateReservation({...draft,date:'2028-02-29'},[],{context:'healthcare',now})).toEqual({});
    expect(validateReservation({...draft,time:'24:00'},[],{context:'healthcare',now})).toEqual({time:'timeRequired'});
    expect(validateReservation({...draft,time:'00:00'},[],{context:'healthcare',now:new Date(2026,9,19,23,59)})).toEqual({});
  });
  it('detects duplicates across labels and conditions, excludes the edited record and reuses cancelled slots', () => {
    const translated = {...draft,service:'Fictional appointment',condition:'bad' as const};
    expect(validateReservation(translated,[confirmed],{context:'healthcare',now})).toEqual({time:'duplicate'});
    expect(validateReservation(translated,[confirmed],{editingId:'original',now})).toEqual({});
    expect(sameBooking({...confirmed,status:'cancelled'},draft)).toBe(false);
    expect(validateReservation(draft,[{...confirmed,status:'cancelled'}],{context:'healthcare',now})).toEqual({});
    expect(sameBooking({...confirmed,serviceId:undefined},draft)).toBe(true);
  });
  it('allows changes only to confirmed existing bookings', () => {
    expect(appointmentStateError(undefined)).toBe('notFound');
    expect(appointmentStateError({...confirmed,status:'cancelled'})).toBe('notConfirmed');
    expect(appointmentStateError(confirmed)).toBeUndefined();
  });
  it('retains the minimal date policy of the device example without weakening catalog validation', () => {
    const example={service:'Asesoría UX',date:'2000-01-01',time:'08:00'};
    expect(validateReservation(example,[],{variant:'example',now})).toEqual({});
    expect(validateReservation(example,[],{context:'university',now})).toEqual({service:'required',date:'dateInvalid'});
    expect(validateReservation({...example,time:''},[],{variant:'example',now})).toEqual({time:'timeRequired'});
  });
});
