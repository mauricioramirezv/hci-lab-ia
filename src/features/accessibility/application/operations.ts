import type { ProjectRepository } from '../../project/application';
export function createAccessibilityOperations(repository:ProjectRepository) {
 return {toggleCheck:(id:string)=>repository.transact(current=>({...current,a11yChecks:{...current.a11yChecks,[id]:!current.a11yChecks[id]}}))};
}
