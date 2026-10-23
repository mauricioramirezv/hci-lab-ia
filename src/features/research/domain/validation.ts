import type { Persona, ResearchData, Scenario } from './types';
import { linkedPersona } from './rules';

export type ResearchErrors = Record<string, 'required' | 'uniqueName' | 'legacyAmbiguous' | 'duplicate'>;
export function validatePersona(persona: Persona, current: ResearchData): ResearchErrors {
  const errors: ResearchErrors = {};
  for (const key of ['name','context','goal','barrier','device'] as const) if (!persona[key].trim()) errors[key]='required';
  if (current.personas.some(p=>p.id!==persona.id&&p.name.trim().toLocaleLowerCase()===persona.name.trim().toLocaleLowerCase())) errors.name='uniqueName';
  if (!persona.basis) errors.basis='required';
  if ((persona.basis==='observed'||persona.basis==='mixed')&&!persona.observed?.trim()) errors.observed='required';
  if ((persona.basis==='assumed'||persona.basis==='mixed')&&!persona.assumptions?.trim()) errors.assumptions='required';
  const old=current.personas.find(p=>p.id===persona.id);
  if (old&&old.name!==persona.name&&current.scenarios.some(s=>!s.personaId&&s.actor===old.name&&!linkedPersona(s,current.personas))) errors.name='legacyAmbiguous';
  if (persona.empathy.feels.trim()&&!persona.emotionSource&&(!old||old.empathy.feels!==persona.empathy.feels)) errors.emotionSource='required';
  return errors;
}
export function validateScenario(scenario: Scenario, current: ResearchData): ResearchErrors {
  const errors: ResearchErrors = {};
  for (const key of ['title','context','task','constraint','success'] as const) if (!scenario[key].trim()) errors[key]='required';
  if (!current.personas.some(p=>p.id===scenario.personaId)) errors.personaId='required';
  const key=(value:string)=>value.trim().toLowerCase();
  if(current.scenarios.some(other=>other.id!==scenario.id&&linkedPersona(other,current.personas)?.id===scenario.personaId&&(['title','context','task','constraint','success'] as const).every(field=>key(other[field])===key(scenario[field]))))errors.title='duplicate';
  return errors;
}
export function personaDeletionBlocked(id: string, current: ResearchData) {
  const person=current.personas.find(p=>p.id===id);
  return current.scenarios.some(s=>s.personaId===id||linkedPersona(s,current.personas)?.id===id||(!s.personaId&&s.actor===person?.name));
}
