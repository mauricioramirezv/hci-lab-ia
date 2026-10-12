import type { Appointment, Persona, ProjectState, Scenario } from '../domain';

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
export function linkedPersona(scenario:Scenario, personas:Persona[]):Persona|undefined {
  if (scenario.personaId) return personas.find(p=>p.id===scenario.personaId);
  const matches=personas.filter(p=>p.name===scenario.actor);
  return matches.length===1 ? matches[0] : undefined;
}
export function savePersona(project:ProjectState, persona:Persona):ProjectState {
  const old=project.personas.find(p=>p.id===persona.id);
  if(old&&old.name!==persona.name&&project.scenarios.some(s=>!s.personaId&&s.actor===old.name&&!linkedPersona(s,project.personas)))return project;
  // Resolve name-based legacy links before renaming; ambiguous links remain visible for repair.
  return {...project,personas:project.personas.some(p=>p.id===persona.id) ? project.personas.map(p=>p.id===persona.id?persona:p) : [...project.personas,persona],scenarios:project.scenarios.map(s=>linkedPersona(s,project.personas)?.id===persona.id ? {...s,personaId:persona.id,actor:persona.name} : s)};
}
export function deletePersona(project:ProjectState,id:string):ProjectState {
  const person=project.personas.find(p=>p.id===id);
  if (project.scenarios.some(s=>s.personaId===id||linkedPersona(s,project.personas)?.id===id||(!s.personaId&&s.actor===person?.name))) return project;
  return {...project,personas:project.personas.filter(p=>p.id!==id)};
}
