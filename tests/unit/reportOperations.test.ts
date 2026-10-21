// @vitest-environment node
import { expect, it, vi } from 'vitest';
import { createReportOperations, exportReport, collectRecords, emptyDraft } from '../../src/features/reports';
import { createProjectRepository } from '../../src/features/project/infrastructure';
import { representativeProject } from '../fixtures/representativeProject';

it('preserves the latest data when explicitly saving a draft, and rejects failed/stale saves',()=>{
 let state=representativeProject(),active=true,fail=false;
 const repository=createProjectRepository({read:()=>state,isCurrent:()=>active,save:next=>{if(fail)throw Error('quota');state=next;},onStorageError:()=>{}});
 const operations=createReportOperations(repository),draft={...emptyDraft(collectRecords(state)),projectName:'RAW'};
 const reservations=state.appointments;expect(operations.saveDraft(draft)).toBe(true);expect(state.appointments).toBe(reservations);
 const before=state;fail=true;expect(operations.saveDraft({...draft,projectName:'Lost'})).toBe(false);expect(state).toBe(before);
 fail=false;active=false;expect(operations.saveDraft(draft)).toBe(false);expect(state).toBe(before);
});
it('exports only a selected preview, keeps filenames and propagates download failure',()=>{
 const render=vi.fn(()=> 'RAW'),write=vi.fn();
 expect(exportReport({kind:'md',preview:false,selectedCount:1},render,write)).toBe(false);expect(render).not.toHaveBeenCalled();
 expect(exportReport({kind:'json',preview:true,selectedCount:0},render,write)).toBe(false);expect(write).not.toHaveBeenCalled();
 expect(exportReport({kind:'csv',preview:true,selectedCount:1},render,write)).toBe(true);expect(write).toHaveBeenCalledWith('hci-evidencias.csv','RAW','text/csv;charset=utf-8');
 expect(exportReport({kind:'md',preview:true,selectedCount:1},render,()=>{throw Error('Unavailable');})).toBe(false);
});
