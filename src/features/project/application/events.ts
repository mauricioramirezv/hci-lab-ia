import type { ProjectRepository } from './ProjectRepository';
import type { LabEvent } from '../domain/state';
export function createEventOperations(repository:ProjectRepository,id:()=>string,now:()=>Date) {
 return {log:(event:Omit<LabEvent,'id'|'at'>)=>repository.transact(current=>({...current,events:[...current.events,{...event,id:id(),at:now().toISOString()}]}))};
}
