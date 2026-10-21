// @vitest-environment node
import { describe, expect, it, vi } from 'vitest';
import { createProjectReservationRepository } from '../../src/features/reservations/infrastructure';
import { createReservationOperations } from '../../src/features/reservations/application';
import {emptyProject} from '../../src/features/project/domain';
import type { ProjectState } from '../../src/features/project/domain';

function setup() {
  let project=emptyProject();let current=true;let fail=false;
  const save=vi.fn((next:ProjectState)=>{if(fail)throw new Error('quota');project=next;});
  const onStorageError=vi.fn();
  const repository=createProjectReservationRepository({read:()=>project,save,isCurrent:()=>current,onStorageError});
  const operations=createReservationOperations(repository,{id:()=>`booking-${project.appointments.length}`,now:()=>new Date(2026,9,19,12)});
  return {operations,save,onStorageError,read:()=>project,replace:(next:ProjectState)=>{project=next;},invalidate:()=>{current=false;},fail:()=>{fail=true;}};
}
const draft={service:'Consulta',serviceId:'health' as const,date:'2099-10-20',time:'10:30'};

describe('reservation adapter for the current project',()=>{
  it('persists the entire latest project and preserves unrelated records',()=>{
    const s=setup();const project=s.read();project.events=[{id:'event',at:'now',type:'flow-start'}];
    expect(s.operations.create(draft,{context:'healthcare'}).ok).toBe(true);
    expect(s.save).toHaveBeenCalledOnce();expect(s.read().events).toEqual(project.events);expect(s.read().version).toBe(project.version);
    const next={...s.read(),a11yChecks:{keyboard:true},appointments:[]};s.replace(next);
    expect(s.operations.list()).toEqual([]);expect(s.operations.create(draft,{context:'healthcare'}).ok).toBe(true);
    expect(s.read().a11yChecks).toEqual({keyboard:true});expect(s.read().events).toEqual(project.events);
  });
  it('leaves the original project intact and returns storage failure instead of success',()=>{
    const s=setup(),before=s.read();s.fail();
    expect(s.operations.create(draft,{context:'healthcare'})).toEqual({ok:false,errors:{},reason:'storageFailed'});
    expect(s.read()).toBe(before);expect(s.operations.list()).toEqual([]);expect(s.onStorageError).toHaveBeenCalledOnce();
  });
  it('rejects old callbacks after reset or recovery before reading or writing',()=>{
    const s=setup();s.invalidate();
    expect(s.operations.create(draft,{context:'healthcare'})).toEqual({ok:false,errors:{},reason:'staleProject'});
    expect(s.save).not.toHaveBeenCalled();expect(s.onStorageError).not.toHaveBeenCalled();
  });
  it('does not persist validation failures or cancelled-state commands',()=>{
    const s=setup();
    expect(s.operations.create({...draft,date:''},{context:'healthcare'}).ok).toBe(false);expect(s.save).not.toHaveBeenCalled();
    s.operations.create(draft,{context:'healthcare'});s.operations.cancel('booking-0');const before=s.save.mock.calls.length;
    expect(s.operations.reschedule('booking-0',draft).ok).toBe(false);expect(s.save).toHaveBeenCalledTimes(before);
  });
});
