import {experimentDisplayKey} from '../../experiments/domain';
import {validateUser} from '../../users/domain';
import type { ProjectState } from './state';
import { languages,parsePreferences } from './preferences';
import type { Preferences, BackupSettings } from './preferences';
type Check = (value:unknown) => boolean;
const text:Check = v => typeof v === 'string';
const identifier:Check = v => typeof v === 'string' && v.trim().length > 0;
const bool:Check = v => typeof v === 'boolean';
const number = (min=-Infinity,max=Infinity,integer=false):Check => v => typeof v === 'number' && Number.isFinite(v) && v>=min && v<=max && (!integer || Number.isInteger(v));
const choices = (...values:(string|number)[]):Check => v => values.includes(v as string|number);
const plain = (v:unknown):v is Record<string,unknown> => {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return false;
  const prototype = Object.getPrototypeOf(v);
  return prototype !== null && Object.getPrototypeOf(prototype) === null && Object.prototype.toString.call(v) === '[object Object]';
};
const safeKey = (key:string) => !['__proto__','prototype','constructor'].includes(key);
const object = (fields:Record<string,Check>, optional:string[]=[]):Check => v => plain(v) && Object.keys(v).every(k=>Object.hasOwn(fields,k)) && Object.entries(fields).every(([k,check])=>Object.hasOwn(v,k) ? (optional.includes(k) && v[k]===undefined) || check(v[k]) : optional.includes(k));
const map = (check:Check):Check => v => plain(v) && Object.entries(v).every(([k,item])=>safeKey(k) && check(item));
const array = (check:Check, ids=false):Check => v => Array.isArray(v) && v.every(check) && (!ids || new Set(v.map(item=>(item as {id:string}).id)).size===v.length);
const strings = (...keys:string[]) => Object.fromEntries(keys.map(k=>[k,text]));
const identity = {id:identifier,createdAt:identifier};
const point = object({x:number(),y:number(),at:number(0),weight:number(0),source:text},['source']);
const pagePoint = object({x:number(),y:number(),at:number(0),weight:number(0),source:text,area:text,route:text},['route']);
const scroll = object({at:number(0),top:number(0),depth:number(0,100)});
const validation = object({medianErrorPx:number(0),viewportWidth:number(1),viewportHeight:number(1),sampleCount:number(0,Infinity,true),at:identifier});
const preferences:Check = value=>!!parsePreferences(value);
const schemas:Record<string,Check> = {
  version:choices(2),
  users:array(object({...identity,name:identifier,email:identifier,role:choices('student','teacher','evaluator'),status:choices('active','inactive')}),true),
  reportDraft:object({...strings('justification','projectName','objective','method','interpretation','improvements','limits','conclusions','references'),selected:array(identifier),before:array(identifier),after:array(identifier),includeComparison:bool}),
  appointments:array(object({...identity,...strings('service','date','time'),status:choices('confirmed','cancelled'),serviceId:choices('advice','workshop','health','visit','culture'),condition:choices('good','bad')},['serviceId','condition']),true),
  personas:array(object({id:identifier,...strings('name','age','context','goal','barrier','device'),empathy:object(strings('says','thinks','does','feels')),basis:choices('observed','assumed','mixed'),observed:text,assumptions:text,emotionSource:choices('observed','declared')},['basis','observed','assumptions','emotionSource']),true),
  scenarios:array(object({id:identifier,...strings('title','actor','context','task','constraint','success'),personaId:identifier,fictional:bool},['personaId','fictional']),true),
  findings:array(object({...identity,...strings('heuristic','problem','evidence','recommendation'),severity:number(0,4,true),source:choices('human','ai'),status:choices('pending','validated','rejected'),task:text,heuristicId:choices('h1','h2','h3','h4','h5','h6','h7','h8','h9','h10')},['task','heuristicId']),true),
  sessions:array(object({...identity,...strings('participant','task','notes'),success:bool,seconds:number(0),errors:number(0,Infinity,true),seq:number(1,7),emotion:number(1,5),sus:number(0,100),susResponses:v=>Array.isArray(v) && v.length===10 && v.every(number(1,5,true))},['susResponses']),true),
  events:array(object({id:identifier,at:identifier,type:choices('flow-start','flow-error','flow-complete','appointment-change','ai-run','export'),duration:number(0),detail:text},['duration','detail']),true),
  a11yChecks:map(bool),
  multimodalEvidence:array(object({...identity,device:choices('desktop','tablet','mobile','watch','car','tv','kiosk','iot'),practice:choices('good','bad'),vision:choices('normal','protanopia','deuteranopia','tritanopia','achromatopsia'),...strings('notes','demoStatus','channelStatus'),confidence:number(1,5)}),true),
  evidence:array(object({...identity,kind:choices('concept','experiment','sus','ux','tlx','chatbot','ai','comparison','pattern'),...strings('participant','task','condition','prototype','notes'),scores:map(number()),demo:bool,experiment:object({kind:choices('Fitts','Hick'),condition:text,practiceCount:choices(2),trials:v=>Array.isArray(v)&&v.length===8&&v.every(object({seconds:number(0),errors:number(0,Infinity,true),distance:number(0),indexDifficulty:number(0),input:choices('keyboard','pointer')},['distance','indexDifficulty']))}),review:object({...strings('type','prompt','proposal','basis','limits','review','reason'),decision:choices('accept','applyEdit','reject')}),chatbot:object({...strings('prompt','response'),human:v=>v===true}),pattern:object({id:choices('form','navigation','feedback','choice','content','privacy'),...strings('problem','principle','correction')}),concept:object({id:choices('ux','usability','accessibility','awareness','engagement','emotions','ergonomics','cognition','information','universal','responsibleAI'),outcome:choices('completed','cancelled'),response:object({...strings('text','reason','edit'),decision:choices('','withNotices','withoutNotices','accept','editDecision','reject')})})},['demo','concept','pattern','experiment','review','chatbot']),true),
  trackingSessions:array(object({...identity,example:choices('good','bad'),width:number(1),height:number(1),seconds:number(0),clicks:array(point),pointer:array(point),gaze:array(point),scroll:array(scroll),wheelEvents:number(0,Infinity,true),maxDepth:number(0,100),notes:text,validation,capped:bool},['validation','wheelEvents']),true),
  pageSessions:array(object({...identity,...strings('route','participant','task','prototype','notes'),width:number(1),height:number(1),viewportWidth:number(1),viewportHeight:number(1),seconds:number(0),clicks:array(pagePoint),pointer:array(pagePoint),gaze:array(pagePoint),simulation:array(pagePoint),scroll:array(object({at:number(0),top:number(0),depth:number(0,100),direction:text})),maxDepth:number(0,100),exposure:map(number(0)),validationError:number(0),capped:bool,target:choices('example','page'),coordinateSystem:choices('example-content','document'),wheelEvents:number(0,Infinity,true),clickCount:number(0,Infinity,true),modeChanges:array(object({at:number(0),mode:choices('cursor','F','Gutenberg','none')})),validation,exampleCondition:choices('good','bad')},['exposure','validationError','target','coordinateSystem','wheelEvents','clickCount','modeChanges','validation','exampleCondition']),true),
  backup:object({format:choices('hci-lab-ia-backup'),version:choices(1),exportedAt:identifier,preferences,language:choices(...languages)}),
};
const optional = ['users','multimodalEvidence','evidence','trackingSessions','pageSessions','backup','reportDraft'];

export function emptyProject():ProjectState {
  return {version:2,users:[],appointments:[],personas:[],scenarios:[],findings:[],sessions:[],events:[],a11yChecks:{},multimodalEvidence:[],trackingSessions:[],evidence:[],pageSessions:[]};
}

export function parseBackup(value:unknown):{project:ProjectState;settings?:BackupSettings} {
  if (!object(schemas,optional)(value)) throw new Error(`Invalid project backup: ${plain(value) ? Object.entries(schemas).filter(([key,check])=>Object.hasOwn(value,key) && !check(value[key])).map(([key])=>key).join(',') : 'structure'}`);
  if ((value as ProjectState).evidence?.some(record=>record.kind==='pattern'&&(!record.pattern||!['good','bad'].includes(record.condition)))) throw new Error('Invalid pattern observation');
  if ((value as ProjectState).pageSessions?.some(s=>s.target&&s.coordinateSystem&&s.coordinateSystem!==(s.target==='example'?'example-content':'document'))) throw new Error('Invalid tracking coordinates');
  for (const e of (value as ProjectState).evidence||[]) {
    if(e.kind==='experiment'&&experimentDisplayKey(e.scores)===null)throw new Error('Invalid experimental display context');
    if(e.review&&(!['persona','scenario','interface','evaluation'].includes(e.review.type)||e.review.prompt!==e.task))throw new Error('Invalid AI review');
    if(e.prototype!=='iteration7')continue;
    if(e.kind==='tlx'){const values=['mental','physical','temporal','performance','effort','frustration'].map(k=>e.scores[k]);if(values.some(v=>!Number.isFinite(v)||v<0||v>100)||Math.abs(e.scores.rawTLX-values.reduce((a,b)=>a+b,0)/6)>1e-9||!Number.isFinite(e.scores.rawTLX))throw new Error('Invalid Raw TLX');}
    if(e.kind==='ux'&&(!Number.isFinite(e.scores.seconds)||e.scores.seconds<0||!Number.isInteger(e.scores.errors)||e.scores.errors<0||![0,1].includes(e.scores.success)||(['seq','emotion']as const).some(k=>e.scores[k]!==undefined&&(!Number.isInteger(e.scores[k])||e.scores[k]<1||e.scores[k]>(k==='seq'?7:5)))))throw new Error('Invalid task session');
    if(e.kind==='experiment'&&(!e.experiment||e.experiment.kind!==e.task||e.experiment.condition!==e.condition||e.scores.trials!==8||!Number.isFinite(e.scores.seconds)||Math.abs(e.scores.seconds-e.experiment.trials.reduce((a,b)=>a+b.seconds,0)/8)>1e-9||e.scores.errors!==e.experiment.trials.reduce((a,b)=>a+b.errors,0)))throw new Error('Invalid experimental measurements');
  }
  if ((value as ProjectState).evidence?.some(e=>e.kind==='sus'&&(Array.from({length:10},(_,i)=>e.scores['response'+(i+1)]).some(v=>!Number.isInteger(v)||v<1||v>5)||e.scores.sus!==Array.from({length:10},(_,i)=>i%2===0?e.scores['response'+(i+1)]-1:5-e.scores['response'+(i+1)]).reduce((a,b)=>a+b,0)*2.5))) throw new Error('Invalid SUS measurement');
  const users=(value as ProjectState).users||[];
  if(users.some(user=>Object.keys(validateUser(user,users,user.id)).length || !Number.isFinite(Date.parse(user.createdAt))))throw new Error('Invalid users');
  const data = structuredClone(value) as ProjectState & {backup?:BackupSettings};
  const settings = data.backup ? {preferences:parsePreferences(data.backup.preferences)!,language:data.backup.language} : undefined;
  delete data.backup;
  const project = {...emptyProject(),...data};
  project.users = project.users || [];
  project.trackingSessions = project.trackingSessions?.map(s=>({...s,wheelEvents:s.wheelEvents ?? 0}));
  return {project,settings};
}

export function createBackup(project:ProjectState, prefs:Preferences, language:string) {
  const result = {...project,backup:{format:'hci-lab-ia-backup',version:1,exportedAt:new Date().toISOString(),preferences:prefs,language}};
  parseBackup(result);
  return result;
}

export const isPreferences = (value:unknown):value is Preferences => preferences(value) && plain(value) && ['dark','contrast','font','spacing','dyslexia','motion'].every(key=>Object.hasOwn(value,key));
