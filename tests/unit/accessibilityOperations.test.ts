// @vitest-environment node
import { expect, it } from 'vitest';
import { motorOffset, createAccessibilityOperations } from '../../src/features/accessibility';
import { createProjectRepository } from '../../src/features/project/infrastructure/projectRepository';
import { emptyProject } from '../../src/features/project/domain';

it('keeps the teaching target displacement independent from timers and the DOM',()=>{
 expect(motorOffset(0)).toEqual({x:0,y:8});
 for(let phase=0;phase<100;phase++){const offset=motorOffset(phase);expect(Math.abs(offset.x)).toBeLessThanOrEqual(12);expect(Math.abs(offset.y)).toBeLessThanOrEqual(8);}
});
it('toggles the latest checklist and does not publish failed writes',()=>{
 let state=emptyProject(),fail=false;
 const repo=createProjectRepository({read:()=>state,isCurrent:()=>true,save:next=>{if(fail)throw Error('quota');state=next;},onStorageError:()=>{}});
 const operations=createAccessibilityOperations(repo);
 expect(operations.toggleCheck('keyboard')).toBe(true);expect(operations.toggleCheck('keyboard')).toBe(true);expect(state.a11yChecks.keyboard).toBe(false);
 const before=state;fail=true;expect(operations.toggleCheck('keyboard')).toBe(false);expect(state).toBe(before);
});
