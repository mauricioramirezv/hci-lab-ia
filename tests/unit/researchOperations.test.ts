// @vitest-environment node
import { expect, it } from 'vitest';
import { createResearchOperations, validatePersona, validateScenario } from '../../src/features/research';
import { createProjectRepository } from '../../src/features/project/infrastructure';
import { representativeProject } from '../fixtures/representativeProject';

function setup() {
  let state=representativeProject(), active=true, fail=false;
  const repository=createProjectRepository({read:()=>state,isCurrent:()=>active,save:next=>{if(fail)throw Error('quota');state=next;},onStorageError:()=>{}});
  return {operations:createResearchOperations(repository),read:()=>state,fail:()=>{fail=true;},invalidate:()=>{active=false;}};
}
it('validates evidence of empathy and provenance independently of React',()=>{
  const p=representativeProject(),person={...p.personas[0],name:' ',basis:'mixed' as const,observed:'',assumptions:'',empathy:{...p.personas[0].empathy,feels:'New emotion'}};
  expect(validatePersona(person,p)).toMatchObject({name:'required',observed:'required',assumptions:'required',emotionSource:'required'});
  expect(validateScenario({...p.scenarios[0],personaId:'missing',task:' '},p)).toMatchObject({task:'required',personaId:'required'});
});
it('uses the latest persona when linking a scenario and preserves other collections',()=>{
  const h=setup(),before=h.read(),person={...before.personas[0],name:'Renamed',basis:'assumed' as const,assumptions:'Pending validation'};
  expect(h.operations.savePersona(person)).toBe(true);
  expect(h.operations.saveScenario({...before.scenarios[0],personaId:person.id,actor:'Old actor'})).toBe(true);
  expect(h.read().scenarios[0].actor).toBe('Renamed');
  expect(h.read().appointments).toBe(before.appointments);
  expect(h.operations.removePersona(person.id)).toBe(false);
});
it('does not publish failed writes or accept commands invalidated by recovery',()=>{
  const h=setup(),before=h.read();h.fail();
  expect(h.operations.removeScenario(before.scenarios[0].id)).toBe(false);expect(h.read()).toBe(before);
  const next=setup();next.invalidate();expect(next.operations.removeScenario(next.read().scenarios[0].id)).toBe(false);
});
