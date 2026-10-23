import {queryUsers, validateUser} from '../domain';
import type {LabUser,UserDraft,UserErrors,UserQuery} from '../domain';
export type UserAction = 'create'|'edit'|'activate'|'deactivate'|'delete'|'restore';
export type UserResult = {ok:true;user:LabUser}|{ok:false;errors:UserErrors;reason?:'notFound'|'storageFailed'|'staleProject'|'conflict'};
export type UserChange = {ok:true;user:LabUser;users:readonly LabUser[];action:UserAction}|Extract<UserResult,{ok:false}>;
export type UserRepository = {read:()=>readonly LabUser[];transact:(change:(users:readonly LabUser[])=>UserChange)=>UserResult};
export function createUserOperations(repository:UserRepository, dependencies:{id:()=>string;now:()=>Date}) {
  const save=(draft:UserDraft, editingId?:string):UserResult=>repository.transact(users=>{
    const previous=editingId ? users.find(user=>user.id===editingId) : undefined;
    if(editingId && !previous)return {ok:false,errors:{},reason:'notFound'};
    const errors=validateUser(draft,users,editingId);
    if(Object.keys(errors).length)return {ok:false,errors};
    const user:LabUser={name:draft.name.trim(),email:draft.email.trim(),role:draft.role,status:draft.status,id:previous?.id||dependencies.id(),createdAt:previous?.createdAt||dependencies.now().toISOString()};
    if(previous&&(['name','email','role','status'] as const).every(key=>previous[key]===user[key]))return {ok:true,user:previous,users,action:'edit'};
    return {ok:true,user,action:previous?'edit':'create',users:previous?users.map(item=>item.id===user.id?user:item):[...users,user]};
  });
  return {
    list:(query?:UserQuery)=>queryUsers(repository.read(),query),
    get:(id:string)=>repository.read().find(user=>user.id===id),save,
    setStatus:(id:string,status:LabUser['status']):UserResult=>repository.transact(users=>{
      const previous=users.find(user=>user.id===id);
      if(!previous)return {ok:false,errors:{},reason:'notFound'};
      if(previous.status===status)return {ok:true,user:previous,users,action:status==='active'?'activate':'deactivate'};
      const user={...previous,status};const errors=validateUser(user,users,id);
      if(Object.keys(errors).length)return {ok:false,errors};
      return {ok:true,user,users:users.map(item=>item.id===id?user:item),action:status==='active'?'activate':'deactivate'};
    }),
    remove:(id:string):UserResult=>repository.transact(users=>{
      const user=users.find(item=>item.id===id);
      return user?{ok:true,user,users:users.filter(item=>item.id!==id),action:'delete'}:{ok:false,errors:{},reason:'notFound'};
    }),
    restore:(snapshot:LabUser):UserResult=>repository.transact(users=>{
      const errors=validateUser(snapshot,users);
      if(users.some(user=>user.id===snapshot.id)||Object.keys(errors).length)return {ok:false,errors,reason:'conflict'};
      return {ok:true,user:{...snapshot},users:[...users,{...snapshot}],action:'restore'};
    }),
  };
}
