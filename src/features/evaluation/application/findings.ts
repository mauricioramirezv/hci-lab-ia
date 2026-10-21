import type { ProjectRepository } from '../../project/application';
import type { Finding, TestSession } from '../domain/types';
import { validFinding } from '../domain/validation';
export function createEvaluationOperations(repository:ProjectRepository,id:()=>string,now:()=>Date) {
 const addFinding=(item:Omit<Finding,'id'|'createdAt'>)=>repository.transact(current=>({...current,findings:[...current.findings,{...item,id:id(),createdAt:now().toISOString()}]}));
 const updateFinding=(id:string,patch:Partial<Finding>)=>repository.transact(current=>({...current,findings:current.findings.map(item=>item.id===id?{...item,...patch}:item)}));
 return {addFinding,updateFinding,
  saveFinding:(item:Omit<Finding,'id'|'createdAt'>,id?:string)=>validFinding(item)&&(id?updateFinding(id,item):addFinding(item)),
  removeFinding:(id:string)=>repository.transact(current=>({...current,findings:current.findings.filter(item=>item.id!==id)})),
  addSession:(item:Omit<TestSession,'id'|'createdAt'>)=>repository.transact(current=>({...current,sessions:[...current.sessions,{...item,id:id(),createdAt:now().toISOString()}]})),
 };
}
