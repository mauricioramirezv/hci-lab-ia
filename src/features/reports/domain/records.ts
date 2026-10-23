import {experimentDisplayKey} from '../../experiments/domain';
import type {ProjectState,ReportDraft} from '../../project/domain';
import type {Evidence} from '../../project/domain';
import {susScore,rawTLX} from '../../evaluation/domain';
export type RecordType='user'|'persona'|'scenario'|'appointment'|'finding'|Evidence['kind']|'tracking'|'multimodal'|'event'|'checklist';
export type ReportRecord={key:string;id:string;collection:string;type:RecordType;task:string;date:string;condition:string;alias:string;version:string;notes:string;origin:'human'|'measured'|'declared'|'simulated'|'mixed'; raw:Record<string,unknown>; metrics:Record<string,number>;method?:string;};
const object=(value:unknown)=>value as Record<string,unknown>;
export const finite=(n:unknown):n is number=>typeof n==='number'&&Number.isFinite(n);
export function collectRecords(s:ProjectState):ReportRecord[]{
 const out:ReportRecord[]=[];
 const push=(collection:string,type:RecordType,raw:Record<string,unknown>,props:Partial<ReportRecord>={})=>out.push({key:`${collection}:${raw.id||'checks'}`,id:String(raw.id||'checks'),collection,type,task:String(raw.task||''),date:String(raw.createdAt||raw.at||''),condition:String(raw.condition||''),alias:String(raw.participant||''),version:String(raw.prototype||''),notes:String(raw.notes||''),origin:'human',raw,metrics:{},...props});
 (s.users||[]).forEach(user=>push('users','user',object(user),{task:user.name,condition:user.status,origin:'simulated'}));
 s.personas.forEach(p=>push('personas','persona',object(p),{task:p.name,notes:[p.observed,p.assumptions].filter(Boolean).join('\n'),origin:p.basis==='assumed'?'simulated':'human'}));
 s.scenarios.forEach(p=>push('scenarios','scenario',object(p),{task:p.title,notes:p.constraint,origin:p.fictional?'simulated':'human'}));
 s.appointments.forEach(p=>push('appointments','appointment',object(p),{task:p.service,notes:'',origin:'simulated'}));
 s.findings.forEach(p=>push('findings','finding',object(p),{task:p.task||p.heuristic,condition:p.status,notes:p.problem,origin:'human'}));
 s.sessions.forEach(p=>{const complete=p.susResponses?.length===10&&p.susResponses.every(v=>Number.isInteger(v)&&v>=1&&v<=5);const metrics={seconds:p.seconds,errors:p.errors,success:Number(p.success),...(complete?{sus:susScore(p.susResponses!)}:{})};push('sessions','ux',object(p),{origin:'mixed',metrics,method:'legacy-ux'});});
 (s.evidence||[]).forEach(e=>{
  const metrics:Record<string,number>={};let method:string|undefined;
  if(!e.demo){
   if(e.kind==='ux'&&e.prototype==='iteration7'){method='manual-ux';for(const k of ['seconds','errors','success'])if(finite(e.scores[k]))metrics[k]=e.scores[k];}
   if(e.kind==='sus'){const responses=Array.from({length:10},(_,i)=>e.scores[`response${i+1}`]);if(responses.every(v=>Number.isInteger(v)&&v>=1&&v<=5)){method='sus-10';metrics.sus=susScore(responses);}}
   if(e.kind==='tlx'){const values=['mental','physical','temporal','performance','effort','frustration'].map(k=>e.scores[k]);if(values.every(v=>finite(v)&&v>=0&&v<=100)){method='raw-tlx-6';metrics.rawTLX=rawTLX(values);}}
   if(e.kind==='experiment'&&e.experiment){const trials=e.experiment.trials,inputs=new Set(trials.map(t=>t.input));if(trials.length&&inputs.size===1){const display=experimentDisplayKey(e.scores);if(display!==null)method=`${e.experiment.kind}:${trials[0].input}:${trials.length}${display===undefined?'':':display='+display}`;metrics.seconds=trials.reduce((a,t)=>a+t.seconds,0)/trials.length;metrics.errors=trials.reduce((a,t)=>a+t.errors,0);}}
  }
  const origin=e.demo?'simulated':['sus','tlx','chatbot'].includes(e.kind)?'declared':e.kind==='ai'||e.kind==='comparison'||e.kind==='pattern'?'human':e.kind==='ux'||e.kind==='concept'?'mixed':'measured';
  push('evidence',e.kind,object(e),{origin,metrics,method});
 });
 (s.pageSessions||[]).forEach(p=>push('pageSessions','tracking',object(p),{condition:p.exampleCondition||'',origin:'mixed',metrics:{seconds:p.seconds,clicks:p.clickCount??p.clicks.length,maxDepth:p.maxDepth}}));
 (s.trackingSessions||[]).forEach(p=>push('trackingSessions','tracking',object(p),{task:'',condition:p.example,origin:'mixed',metrics:{seconds:p.seconds,clicks:p.clicks.length,maxDepth:p.maxDepth}}));
 (s.multimodalEvidence||[]).forEach(p=>push('multimodalEvidence','multimodal',object(p),{condition:p.practice,origin:'declared'}));
 s.events.filter(e=>e.type!=='export').forEach(p=>push('events','event',object(p),{task:p.detail||'',origin:'measured',metrics:{...(finite(p.duration)?{seconds:p.duration}:{})}}));
 if(Object.keys(s.a11yChecks).length)push('a11yChecks','checklist',{...s.a11yChecks,id:'checks'});
 return out;
}
export function emptyDraft(records:ReportRecord[]=[]):ReportDraft{return {selected:records.map(r=>r.key),before:[],after:[],includeComparison:false,justification:'',projectName:'',objective:'',method:'',interpretation:'',improvements:'',limits:'',conclusions:'',references:''};}
export function normalizeSearch(value:string){return value.normalize('NFD').replace(/\p{Diacritic}/gu,'').trim().toLocaleLowerCase();}
