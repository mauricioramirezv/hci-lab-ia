export type TaskValues = {seconds:string;errors:string;success:string;seq:string;emotion:string};
export const bounded = (v:string,min:number,max:number,integer=false) => v.trim()!==''&&Number.isFinite(Number(v))&&Number(v)>=min&&Number(v)<=max&&(!integer||Number.isInteger(Number(v)));
export const validTask = (task:string,values:TaskValues) => !!task.trim()&&bounded(values.seconds,0,Infinity)&&bounded(values.errors,0,Infinity,true)&&values.success!==''&&(!values.seq||bounded(values.seq,1,7,true))&&(!values.emotion||bounded(values.emotion,1,5,true));
export const validFinding = (draft:{task?:string;problem:string;evidence:string;recommendation:string}) => !!draft.task?.trim()&&!!draft.problem.trim()&&!!draft.evidence.trim()&&!!draft.recommendation.trim();
import type {Finding} from './types';
export function findingErrors(draft:Omit<Finding,'id'|'createdAt'>,current:readonly Finding[],editingId?:string):Record<string,'required'|'duplicate'>{
 const errors:Record<string,'required'|'duplicate'>={};
 for(const key of ['task','problem','evidence','recommendation'] as const)if(!draft[key]?.trim())errors[key]='required';
 if(!Number.isInteger(draft.severity)||draft.severity<0||draft.severity>4)errors.severity='required';
 if(!draft.heuristic.trim()||(draft.heuristicId!==undefined&&!/^h(?:[1-9]|10)$/.test(draft.heuristicId)))errors.heuristicId='required';
 if(!['pending','validated','rejected'].includes(draft.status))errors.status='required';
 const key=(value:string|undefined)=>(value||'').trim().toLowerCase();
 if(current.some(other=>other.id!==editingId&&other.source===draft.source&&key(other.task)===key(draft.task)&&key(other.heuristicId||other.heuristic)===key(draft.heuristicId||draft.heuristic)&&key(other.problem)===key(draft.problem)&&key(other.evidence)===key(draft.evidence)))errors.problem='duplicate';
 return errors;
}
