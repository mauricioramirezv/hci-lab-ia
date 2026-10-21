export type TaskValues = {seconds:string;errors:string;success:string;seq:string;emotion:string};
export const bounded = (v:string,min:number,max:number,integer=false) => v.trim()!==''&&Number.isFinite(Number(v))&&Number(v)>=min&&Number(v)<=max&&(!integer||Number.isInteger(Number(v)));
export const validTask = (task:string,values:TaskValues) => !!task.trim()&&bounded(values.seconds,0,Infinity)&&bounded(values.errors,0,Infinity,true)&&values.success!==''&&(!values.seq||bounded(values.seq,1,7,true))&&(!values.emotion||bounded(values.emotion,1,5,true));
export const validFinding = (draft:{task?:string;problem:string;evidence:string;recommendation:string}) => !!draft.task?.trim()&&!!draft.problem.trim()&&!!draft.evidence.trim()&&!!draft.recommendation.trim();
