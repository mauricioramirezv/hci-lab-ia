import type { EvidenceWriter } from '../../project/application';
import { susScore, validAnswers } from '../domain/questionnaires';
import { rawTLX } from '../domain/workload';
import { validTask } from '../domain/validation';
import type { TaskValues } from '../domain/validation';
export const dimensions=['mental','physical','temporal','performance','effort','frustration'];
export function recordQuestionnaire(write:EvidenceWriter,input:{kind:'sus'|'tlx';alias:string;task:string;notes:string;answers:string[]}) {
 const {kind,alias,task,notes,answers}=input;
 if(!task.trim()||!validAnswers(answers,kind==='sus'?10:6,kind==='sus'?5:100,kind==='sus'))return false;
 const score=kind==='sus'?susScore(answers.map(Number)):rawTLX(answers.map(Number));
 return write({kind,participant:alias,task,condition:kind==='sus'?'SUS':'Raw TLX',prototype:'iteration7',scores:{[kind==='sus'?'sus':'rawTLX']:score,...Object.fromEntries(answers.map((v,i)=>[kind==='sus'?`response${i+1}`:dimensions[i],Number(v)]))},notes});
}
export function recordTask(write:EvidenceWriter,input:{alias:string;task:string;notes:string;values:TaskValues}) {
 const {alias,task,notes,values}=input;
 if(!validTask(task,values))return false;
 return write({kind:'ux',participant:alias,task,condition:'human',prototype:'iteration7',notes,scores:{seconds:Number(values.seconds),errors:Number(values.errors),success:Number(values.success),...(values.seq?{seq:Number(values.seq)}:{}),...(values.emotion?{emotion:Number(values.emotion)}:{})}});
}
