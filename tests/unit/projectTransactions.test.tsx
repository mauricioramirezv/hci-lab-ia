import { act, cleanup, render } from '@testing-library/react';
import { useEffect, useRef } from 'react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { ProjectProvider, useProject } from '../../src/features/project/presentation';
import { emptyProject, sampleProject, PROJECT_KEY } from '../../src/features/project/domain';
import { emptyDraft } from '../../src/features/reports/domain';
import '../../src/app/i18n';

let store:ReturnType<typeof useProject>;
function Probe(){store=useProject();return null;}
beforeEach(()=>localStorage.clear());
afterEach(()=>{cleanup();vi.restoreAllMocks();});
function InitialCommand(){
 const project=useProject(),command=useRef(project.log);
 useEffect(()=>{command.current({type:'flow-start',detail:'Child effect'});},[]);
 return null;
}
it('does not overwrite a command from a child mount effect with the initial snapshot',()=>{
 render(<ProjectProvider><Probe/><InitialCommand/></ProjectProvider>);
 expect(store.state.events[0].detail).toBe('Child effect');
 expect(JSON.parse(localStorage.getItem(PROJECT_KEY)!).events).toEqual(store.state.events);
});
it('persists consecutive operations from different modules on the same current aggregate',()=>{
 render(<ProjectProvider><Probe/></ProjectProvider>);
 act(()=>{
  expect(store.addPersona(sampleProject.personas[0])).toBe(true);
  expect(store.saveScenario({...sampleProject.scenarios[0],personaId:sampleProject.personas[0].id})).toBe(true);
  expect(store.addEvidence({kind:'concept',participant:'',task:'RAW',condition:'good',prototype:'legacy',scores:{},notes:'RAW'})).toBe(true);
  expect(store.addFinding({heuristic:'RAW',severity:1,problem:'RAW',evidence:'RAW',recommendation:'RAW',source:'human',status:'pending'})).toBe(true);
  expect(store.toggleCheck('keyboard')).toBe(true);
  expect(store.saveReportDraft({...emptyDraft(),projectName:'Latest'})).toBe(true);
 });
 expect(store.state.personas).toHaveLength(1);expect(store.state.scenarios).toHaveLength(1);expect(store.state.findings).toHaveLength(1);expect(store.state.evidence).toHaveLength(1);expect(store.state.a11yChecks.keyboard).toBe(true);
 expect(JSON.parse(localStorage.getItem(PROJECT_KEY)!)).toEqual(JSON.parse(JSON.stringify(store.state)));
});
it('keeps failed writes unpublished, permits retries and rejects commands invalidated by reset or recovery',()=>{
 render(<ProjectProvider><Probe/></ProjectProvider>);const before=store.state;
 const failure=vi.spyOn(Storage.prototype,'setItem').mockImplementation(()=>{throw Error('quota');});
 act(()=>{expect(store.addPersona(sampleProject.personas[0])).toBe(false);expect(store.toggleCheck('keyboard')).toBe(false);});
 expect(store.state).toBe(before);expect(store.storageError).toBeTruthy();failure.mockRestore();
 act(()=>{expect(store.addPersona(sampleProject.personas[0])).toBe(true);});
 const stale=store;
 act(()=>{expect(store.reset()).toBe(true);});
 act(()=>{expect(stale.addPersona(sampleProject.personas[0])).toBe(false);expect(stale.saveReportDraft(emptyDraft())).toBe(false);expect(stale.importProject(sampleProject)).toBe(false);});
 expect(store.state).toEqual(emptyProject());const resetCommands=store;
 act(()=>{expect(store.importProject(sampleProject)).toBe(true);});
 act(()=>{expect(resetCommands.toggleCheck('keyboard')).toBe(false);});
 expect(store.state.personas).toEqual(sampleProject.personas);
});
