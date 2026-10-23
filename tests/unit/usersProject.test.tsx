import {act,cleanup,render} from '@testing-library/react';
import {afterEach,beforeEach,expect,it,vi} from 'vitest';
import {ProjectProvider,useProject} from '../../src/features/project/presentation';
import {emptyProject,parseBackup,PROJECT_KEY} from '../../src/features/project/domain';
import {emptyDraft} from '../../src/features/reports/domain';
import '../../src/app/i18n';
let store:ReturnType<typeof useProject>;
function Probe(){store=useProject();return null;}
const draft={name:'RAW Júlia',email:'julia@example.test',role:'evaluator' as const,status:'active' as const};
beforeEach(()=>localStorage.clear());
afterEach(()=>{cleanup();vi.restoreAllMocks();});
it('persists consecutive user and report operations, then reloads the same user identity',()=>{
 const first=render(<ProjectProvider><Probe/></ProjectProvider>);
 act(()=>{expect(store.users.save(draft).ok).toBe(true);expect(store.saveReportDraft({...emptyDraft(),projectName:'Current report'})).toBe(true);expect(store.users.save({...draft,email:'second@example.test'}).ok).toBe(true);});
 const saved=structuredClone(store.state);expect(JSON.parse(localStorage.getItem(PROJECT_KEY)!)).toEqual(saved);first.unmount();
 render(<ProjectProvider><Probe/></ProjectProvider>);expect(store.state).toEqual(saved);expect(store.users.list()).toHaveLength(2);expect(store.state.evidence).toHaveLength(2);
});
it('does not publish failed writes in the actual provider and permits retry',()=>{
 render(<ProjectProvider><Probe/></ProjectProvider>);const before=store.state,persisted=localStorage.getItem(PROJECT_KEY);
 const failure=vi.spyOn(Storage.prototype,'setItem').mockImplementation(()=>{throw Error('quota');});
 act(()=>{expect(store.users.save(draft)).toMatchObject({ok:false,reason:'storageFailed'});});
 expect(store.state).toBe(before);expect(localStorage.getItem(PROJECT_KEY)).toBe(persisted);expect(store.storageError).toBeTruthy();failure.mockRestore();
 act(()=>{expect(store.users.save(draft).ok).toBe(true);});expect(store.state.users).toHaveLength(1);expect(store.state.evidence).toHaveLength(1);expect(store.storageError).toBe('');
});
it('invalidates user callbacks and undo after reset and recovery without resurrecting records',()=>{
 render(<ProjectProvider><Probe/></ProjectProvider>);act(()=>{store.users.save(draft);});const snapshot=store.state.users![0],beforeReset=store.users;
 act(()=>{expect(store.reset()).toBe(true);});
 act(()=>{expect(beforeReset.restore(snapshot)).toMatchObject({ok:false,reason:'staleProject'});expect(beforeReset.save(draft).ok).toBe(false);});
 expect(store.state).toEqual(emptyProject());const beforeRecovery=store.users;
 const legacy=emptyProject();delete legacy.users;legacy.scenarios=[{id:'legacy',title:'Original',actor:'A',context:'C',task:'T',constraint:'C',success:'S'}];
 act(()=>{expect(store.importProject(parseBackup(legacy).project)).toBe(true);});
 act(()=>{expect(beforeRecovery.restore(snapshot).ok).toBe(false);});
 expect(store.state.users).toEqual([]);expect(store.state.scenarios).toEqual(legacy.scenarios);expect(JSON.parse(localStorage.getItem(PROJECT_KEY)!)).toEqual(store.state);
});
