import type { ProjectRepository } from '../../project/application';
import type { Finding, TestSession } from '../domain/types';
import { findingErrors } from '../domain/validation';
export function createEvaluationOperations(repository:ProjectRepository,id:()=>string,now:()=>Date) {
 const addFinding=(item:Omit<Finding,'id'|'createdAt'>)=>repository.transact(current=>({...current,findings:[...current.findings,{...item,id:id(),createdAt:now().toISOString()}]}));
 const updateFinding=(id:string,patch:Partial<Finding>)=>repository.transact(current=>current.findings.some(item=>item.id===id)?({...current,findings:current.findings.map(item=>item.id===id?{...item,...patch,id:item.id,createdAt:item.createdAt}:item)}):current);
 return {addFinding,updateFinding,
  saveFinding:(item:Omit<Finding,'id'|'createdAt'>,editingId?:string)=>repository.transact(current=>{
   const previous=editingId?current.findings.find(f=>f.id===editingId):undefined;
   if(editingId&&!previous||Object.keys(findingErrors(item,current.findings,editingId)).length)return current;
   const finding:Finding={...item,id:previous?.id||id(),createdAt:previous?.createdAt||now().toISOString(),source:previous?.source||item.source};
   return {...current,findings:previous?current.findings.map(f=>f.id===editingId?finding:f):[...current.findings,finding]};
  }),
  removeFinding:(id:string)=>repository.transact(current=>current.findings.some(f=>f.id===id)?({...current,findings:current.findings.filter(item=>item.id!==id)}):current),
  addSession:(item:Omit<TestSession,'id'|'createdAt'>)=>repository.transact(current=>({...current,sessions:[...current.sessions,{...item,id:id(),createdAt:now().toISOString()}]})),
 };
}
