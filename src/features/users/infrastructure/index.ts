import type {ProjectState} from '../../project/domain';
import type {UserRepository} from '../application';
type Host={read:()=>ProjectState;save:(project:ProjectState)=>void;isCurrent:()=>boolean;onStorageError:()=>void};
// User records and their task evidence are committed together in the existing aggregate.
export function createProjectUserRepository(host:Host,id:()=>string,now:()=>Date):UserRepository {
  return {read:()=>host.read().users||[],transact:change=>{
    if(!host.isCurrent())return {ok:false,errors:{},reason:'staleProject'};
    const project=host.read(),result=change(project.users||[]);
    if(!result.ok)return result;
    if(result.users===project.users)return {ok:true,user:result.user};
    try {
      host.save({...project,users:[...result.users],evidence:[...(project.evidence||[]),{
        id:id(),createdAt:now().toISOString(),kind:'ux',participant:'',task:`users:${result.action}`,condition:'good',prototype:'users-lab',scores:{},notes:result.user.id,
      }]});
      return {ok:true,user:result.user};
    } catch {host.onStorageError();return {ok:false,errors:{},reason:'storageFailed'};}
  }};
}
