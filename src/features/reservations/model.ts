import type { Appointment } from '../project/domain';

export const services = ['advice', 'workshop', 'health', 'visit', 'culture'] as const;

export type ServiceId = typeof services[number];

export const serviceContexts: Record<ServiceId, string> = { advice:'university', workshop:'university', health:'healthcare', visit:'culture', culture:'culture' };

export const localDay = (now = new Date()) => `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;

export function scheduleError(date:string, time:string, now=new Date()): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return 'dateRequired';
  const parsed = new Date(`${date}T12:00:00`);
  if (!Number.isFinite(parsed.getTime()) || localDay(parsed)!==date || date<localDay(now)) return 'dateInvalid';
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) return 'timeRequired';
  if (new Date(`${date}T${time}:00`).getTime()<=now.getTime()) return 'timePast';
  return '';
}

export const sameBooking = (a:Appointment, b:{service:string;serviceId?:ServiceId;date:string;time:string}) => a.status==='confirmed' && (a.serviceId && b.serviceId ? a.serviceId===b.serviceId : a.service===b.service) && a.date===b.date && a.time===b.time;
