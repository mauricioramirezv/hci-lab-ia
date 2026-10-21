import type { ProjectRepository } from '../../project/application';
import type { Persona, Scenario } from '../domain/types';
import { deletePersona, savePersona } from '../domain/rules';
import { validatePersona, validateScenario } from '../domain/validation';

export function createResearchOperations(repository: ProjectRepository) {
  return {
    appendLegacyPersona:(item:Persona)=>repository.transact(current=>({...current,personas:[...current.personas,item]})),
    appendLegacyScenario:(item:Scenario)=>repository.transact(current=>({...current,scenarios:[...current.scenarios,item]})),
    savePersona: (persona: Persona, legacy=false) => repository.transact(current => !legacy&&Object.keys(validatePersona(persona,current)).length ? current : savePersona(current,persona)),
    removePersona: (id: string) => repository.transact(current=>deletePersona(current,id)),
    saveScenario: (scenario: Scenario, legacy=false) => repository.transact(current => {
      if (legacy ? !current.personas.some(p=>p.id===scenario.personaId) : Object.keys(validateScenario(scenario,current)).length) return current;
      const item={...scenario,actor:current.personas.find(p=>p.id===scenario.personaId)!.name};
      return {...current,scenarios:current.scenarios.some(s=>s.id===item.id)?current.scenarios.map(s=>s.id===item.id?item:s):[...current.scenarios,item]};
    }),
    removeScenario: (id: string) => repository.transact(current=>({...current,scenarios:current.scenarios.filter(s=>s.id!==id)})),
  };
}
