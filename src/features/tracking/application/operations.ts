import type { ProjectRepository } from '../../project/application';
import type { PageSession } from '../domain/pageSession';
import type { TrackingSession } from '../domain/geometry';
export function createTrackingOperations(repository:ProjectRepository,id:()=>string,now:()=>Date) {
 return {
  addPageSession:(item:Omit<PageSession,'id'|'createdAt'>)=>repository.transact(current=>({...current,pageSessions:[...(current.pageSessions||[]),{...item,id:id(),createdAt:now().toISOString()}]})),
  removePageSession:(id:string)=>repository.transact(current=>({...current,pageSessions:(current.pageSessions||[]).filter(e=>e.id!==id)})),
  addTrackingSession:(item:Omit<TrackingSession,'id'|'createdAt'>)=>repository.transact(current=>({...current,trackingSessions:[...(current.trackingSessions||[]),{...item,id:id(),createdAt:now().toISOString()}]})),
  removeTrackingSession:(id:string)=>repository.transact(current=>({...current,trackingSessions:(current.trackingSessions||[]).filter(e=>e.id!==id)})),
 };
}
