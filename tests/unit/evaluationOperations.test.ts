// @vitest-environment node
import { expect, it, vi } from 'vitest';
import { recordQuestionnaire, recordTask, validTask, createEvaluationOperations } from '../../src/features/evaluation';
import type { EvidenceWriter } from '../../src/features/project/application';
import { createProjectRepository } from '../../src/features/project/infrastructure';
import {emptyProject} from '../../src/features/project/domain';

it('does not write incomplete questionnaires and preserves declared answers and computed scores',()=>{
 const write=vi.fn<EvidenceWriter>(()=>false),input={kind:'sus' as const,alias:'',task:'Task',notes:'RAW',answers:Array(10).fill('5')};
 expect(recordQuestionnaire(write,{...input,answers:['5']})).toBe(false);expect(write).not.toHaveBeenCalled();
 expect(recordQuestionnaire(write,input)).toBe(false);expect(write.mock.calls[0][0].scores).toMatchObject({sus:50,response1:5,response10:5});
 expect(recordQuestionnaire(write,{...input,kind:'tlx',answers:['10','20','30','40','50','60']})).toBe(false);
 expect(write.mock.calls[1][0].scores.rawTLX).toBe(35);
});
it('validates manual task data without fabricating optional self-reports',()=>{
 const values={seconds:'1.5',errors:'0',success:'1',seq:'',emotion:''},write=vi.fn<EvidenceWriter>(()=>true);
 expect(validTask('Task',{...values,errors:'0.5'})).toBe(false);
 expect(recordTask(write,{alias:'',task:'Task',notes:'RAW',values})).toBe(true);
 expect(write.mock.calls[0][0].scores).toEqual({seconds:1.5,errors:0,success:1});
});
it('edits findings on the current project and rejects persistence failure and stale operations',()=>{
 let state=emptyProject(),active=true,fail=false;
 const repository=createProjectRepository({read:()=>state,isCurrent:()=>active,save:next=>{if(fail)throw Error('quota');state=next;},onStorageError:()=>{}});
 const operations=createEvaluationOperations(repository,()=> 'finding',()=>new Date('2026-10-20T10:00:00Z'));
 const item={task:'Task',problem:'Problem',evidence:'RAW',recommendation:'Recommendation',heuristic:'Visibility',severity:2,source:'ai' as const,status:'pending' as const};
 expect(operations.saveFinding({...item,task:''})).toBe(false);
 expect(operations.saveFinding(item)).toBe(true);
 expect(operations.updateFinding('finding',{status:'validated'})).toBe(true);
 expect(state.findings[0]).toMatchObject({source:'ai',status:'validated'});
 const before=state;fail=true;expect(operations.removeFinding('finding')).toBe(false);expect(state).toBe(before);
 fail=false;active=false;expect(operations.removeFinding('finding')).toBe(false);expect(state).toBe(before);
});
