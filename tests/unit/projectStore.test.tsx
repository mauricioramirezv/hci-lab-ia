import { act, cleanup, render } from '@testing-library/react';
import { vi } from 'vitest';
import { ProjectProvider, useProject } from '../../src/store';
import { sampleProject } from '../../src/domain';
import { defaultPrefs, emptyProject, PROJECT_KEY, PREFS_KEY, LANGUAGE_KEY } from '../../src/projectBackup';
import i18n from '../../src/i18n';
import {emptyDraft} from '../../src/reports/model';

let store:ReturnType<typeof useProject>;
function Probe(){store=useProject();return null;}
it('saves report drafts explicitly, rejects quota failure and prevents stale drafts restoring a reset project',()=>{
  render(<ProjectProvider><Probe/></ProjectProvider>);
  const draft={...emptyDraft(),projectName:'USER_PROJECT'};
  act(()=>{expect(store.saveReportDraft(draft)).toBe(true);});
  expect(JSON.parse(localStorage.getItem(PROJECT_KEY)!).reportDraft).toEqual(draft);
  const previous=store.state,persisted=localStorage.getItem(PROJECT_KEY);
  const failure=vi.spyOn(Storage.prototype,'setItem').mockImplementation(()=>{throw new Error('quota');});
  act(()=>{expect(store.saveReportDraft({...draft,projectName:'Must not persist'})).toBe(false);});
  expect(store.state).toBe(previous);expect(localStorage.getItem(PROJECT_KEY)).toBe(persisted);
  failure.mockRestore();const oldSave=store.saveReportDraft;
  act(()=>{expect(store.reset()).toBe(true);});
  act(()=>{expect(oldSave(draft)).toBe(false);});
  expect(store.state).toEqual(emptyProject());expect(JSON.parse(localStorage.getItem(PROJECT_KEY)!)).toEqual(emptyProject());
});
beforeEach(()=>{localStorage.clear();void i18n.changeLanguage('es-CO');});
afterEach(()=>{cleanup();vi.restoreAllMocks();});
it('guards rapid duplicate bookings and scenario links in the store',()=>{
  render(<ProjectProvider><Probe/></ProjectProvider>);
  const booking={service:'Ficticia',serviceId:'health' as const,date:'2099-10-15',time:'10:30'};
  act(()=>{store.addAppointment(booking);store.addAppointment({...booking,service:'Fictional'});});
  expect(store.state.appointments).toHaveLength(1);
  const scenario={...sampleProject.scenarios[0],personaId:'not-present'};
  act(()=>store.saveScenario(scenario));expect(store.state.scenarios).toHaveLength(0);
  act(()=>store.savePersona(sampleProject.personas[0]));
  act(()=>store.saveScenario({...scenario,personaId:sampleProject.personas[0].id}));
  act(()=>store.removePersona(sampleProject.personas[0].id));expect(store.state.personas).toHaveLength(1);
  act(()=>store.removeScenario(scenario.id));act(()=>store.removePersona(sampleProject.personas[0].id));expect(store.state.personas).toHaveLength(0);
});
it('starts empty and prevents callbacks from the old project restoring deleted records',()=>{
  render(<ProjectProvider><Probe/></ProjectProvider>);
  expect(store.state).toEqual(emptyProject());
  act(()=>store.addAppointment({service:'UX',date:'2026-10-15',time:'10:30'}));
  const oldLog=store.log,oldAppointment=store.addAppointment;
  localStorage.setItem(LANGUAGE_KEY,'ca-ES');
  act(()=>{expect(store.reset()).toBe(true);});
  act(()=>{oldLog({type:'flow-complete'});oldAppointment({service:'Late',date:'2026-10-15',time:'10:30'});});
  expect(store.state).toEqual(emptyProject());
  expect(JSON.parse(localStorage.getItem(PROJECT_KEY)!)).toEqual(emptyProject());
  expect(JSON.parse(localStorage.getItem(PREFS_KEY)!)).toEqual(defaultPrefs);
  expect(localStorage.getItem(LANGUAGE_KEY)).toBe('ca-ES');
  act(()=>store.addAppointment({service:'New',date:'2026-10-15',time:'10:30'}));
  expect(store.state.appointments).toHaveLength(1);
});
it('reports failed replacement without remounting activities or changing current data',()=>{
  localStorage.setItem(PROJECT_KEY,JSON.stringify(sampleProject));
  render(<ProjectProvider><Probe/></ProjectProvider>);
  const previous=store.state, persisted=localStorage.getItem(PROJECT_KEY);
  vi.spyOn(Storage.prototype,'setItem').mockImplementation(()=>{throw new Error('quota');});
  act(()=>{expect(store.reset()).toBe(false);});
  expect(store.state).toBe(previous);expect(store.epoch).toBe(0);
  expect(store.storageError).toBe(i18n.t('manage.storageFailed'));
  expect(localStorage.getItem(PROJECT_KEY)).toBe(persisted);
});
it('preserves an invalid original storage record until explicit recovery or reset',()=>{
  localStorage.setItem(PROJECT_KEY,'{"version":2}');
  render(<ProjectProvider><Probe/></ProjectProvider>);
  expect(store.state).toEqual(emptyProject());
  expect(localStorage.getItem(PROJECT_KEY)).toBe('{"version":2}');
  expect(store.storageError).toBe(i18n.t('manage.storedInvalid'));
  act(()=>{expect(store.reset()).toBe(true);});
  expect(JSON.parse(localStorage.getItem(PROJECT_KEY)!)).toEqual(emptyProject());
  expect(store.storageError).toBe('');
});
