import type { Persona, ResearchData, Scenario } from './types';

export function linkedPersona(scenario:Scenario, personas:Persona[]):Persona|undefined {
  if (scenario.personaId) return personas.find(p=>p.id===scenario.personaId);
  const matches=personas.filter(p=>p.name===scenario.actor);
  return matches.length===1 ? matches[0] : undefined;
}

export function savePersona<T extends ResearchData>(project:T, persona:Persona):T {
  const old=project.personas.find(p=>p.id===persona.id);
  if(old&&old.name!==persona.name&&project.scenarios.some(s=>!s.personaId&&s.actor===old.name&&!linkedPersona(s,project.personas)))return project;
  // Resolve name-based legacy links before renaming; ambiguous links remain visible for repair.
  return {...project,personas:project.personas.some(p=>p.id===persona.id) ? project.personas.map(p=>p.id===persona.id?persona:p) : [...project.personas,persona],scenarios:project.scenarios.map(s=>linkedPersona(s,project.personas)?.id===persona.id ? {...s,personaId:persona.id,actor:persona.name} : s)};
}

export function deletePersona<T extends ResearchData>(project:T,id:string):T {
  const person=project.personas.find(p=>p.id===id);
  if(!person)return project;
  if (project.scenarios.some(s=>s.personaId===id||linkedPersona(s,project.personas)?.id===id||(!s.personaId&&s.actor===person?.name))) return project;
  return {...project,personas:project.personas.filter(p=>p.id!==id)};
}
