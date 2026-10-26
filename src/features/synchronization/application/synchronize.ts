import type {SyncPlan,SyncItem,SyncStep} from '../domain/plan';
import type {SyncRemote} from './remote';

export type SavedStep={key:string;input:Record<string,unknown>;output?:Record<string,unknown>};
export type SavedItem={fingerprint:string;steps:Record<string,SavedStep>};
export type SyncManifest={version:1;accountId:string;workspaceId:string;items:Record<string,SavedItem>;history:Array<{itemKey:string;record:SavedItem}>};
export interface SyncJournal {
  read(accountId:string,workspaceId:string):SyncManifest;
  save(manifest:SyncManifest):void;
  digest(value:unknown):Promise<string>;
  operationKey(value:unknown):Promise<string>;
}
export type SyncProgress={state:'preparing'|'syncing'|'success'|'conflict'|'error'|'cancelled';completed:number;total:number;current?:string;code?:string;requestId?:string;conflicts?:string[]};
export class SyncFailure extends Error {constructor(readonly code:string){super(code);this.name='SyncFailure';}}
export function canonical(value:unknown):string {
  if(value===null||typeof value==='string'||typeof value==='boolean')return JSON.stringify(value);
  if(typeof value==='number'&&Number.isFinite(value))return JSON.stringify(value);
  if(Array.isArray(value))return '['+value.map(canonical).join(',')+']';
  if(value&&typeof value==='object')return '{'+Object.entries(value).filter(([,v])=>v!==undefined).sort(([a],[b])=>a.localeCompare(b,'en')).map(([k,v])=>JSON.stringify(k)+':'+canonical(v)).join(',')+'}';
  throw new SyncFailure('SYNC_INVALID_DATA');
}
function resolve(value:unknown,outputs:Map<string,Record<string,unknown>>,depth=0):unknown {
  if(depth>30)throw new SyncFailure('SYNC_INVALID_DATA');
  if(Array.isArray(value))return value.map(item=>resolve(item,outputs,depth+1));
  if(value&&typeof value==='object'){
    const record=value as Record<string,unknown>;
    if(typeof record.$ref==='string'){
      const output=outputs.get(record.$ref),field=typeof record.field==='string'?record.field:'id';
      if(!output||!Object.hasOwn(output,field))throw new SyncFailure('SYNC_MISSING_REFERENCE');
      return output[field];
    }
    return Object.fromEntries(Object.entries(record).map(([key,item])=>[key,resolve(item,outputs,depth+1)]));
  }
  return value;
}
function references(value:unknown):string[]{
  if(Array.isArray(value))return value.flatMap(references);
  if(value&&typeof value==='object'){const record=value as Record<string,unknown>;return typeof record.$ref==='string'?[record.$ref]:Object.values(record).flatMap(references);}
  return [];
}
const failureCode=(error:unknown)=>error&&typeof error==='object'&&'code'in error?String(error.code):'SYNC_NETWORK_ERROR';
/** Each call is an explicit action; only the gateway performs HTTP and the journal performs storage. */
export function createSynchronization(remote:SyncRemote,journal:SyncJournal,authorize:()=>Promise<string|null>){
  let running=false;
  return {async run(input:{accountId:string;workspaceId:string;plan:SyncPlan;copyChanged?:boolean;signal?:AbortSignal;onProgress?:(progress:SyncProgress)=>void}):Promise<SyncProgress>{
    if(running)throw new SyncFailure('SYNC_BUSY');
    running=true;
    let completed=0;
    const total=input.plan.items.length,emit=(state:SyncProgress['state'],extra:Partial<SyncProgress>={})=>{const next={state,completed,total,...extra};input.onProgress?.(next);return next;};
    const check=async()=>{if(input.signal?.aborted)throw new SyncFailure('SYNC_CANCELLED');if(await authorize()!==input.accountId)throw new SyncFailure('UNAUTHENTICATED');if(input.signal?.aborted)throw new SyncFailure('SYNC_CANCELLED');};
    try{
      emit('preparing');await check();
      const manifest=journal.read(input.accountId,input.workspaceId),fingerprints=new Map<string,string>();
      const owners=new Map(input.plan.items.flatMap(item=>item.steps.map(step=>[step.id,item] as const)));
      const fingerprint=async(item:SyncItem,visiting=new Set<string>()):Promise<string>=>{
        if(fingerprints.has(item.key))return fingerprints.get(item.key)!;
        if(visiting.has(item.key))throw new SyncFailure('SYNC_INVALID_DATA');
        const next=new Set(visiting).add(item.key),dependencies=new Map<string,string>();
        for(const step of item.steps)for(const reference of references(step.data)){
          const owner=owners.get(reference);if(owner&&owner.key!==item.key)dependencies.set(owner.key,await fingerprint(owner,next));
        }
        const result=await journal.digest({steps:item.steps,dependencies:[...dependencies].sort(([a],[b])=>a.localeCompare(b,'en'))});fingerprints.set(item.key,result);return result;
      };
      for(const item of input.plan.items)await fingerprint(item);
      const changed=input.plan.items.filter(item=>manifest.items[item.key]&&manifest.items[item.key].fingerprint!==fingerprints.get(item.key));
      if(changed.length&&!input.copyChanged)return emit('conflict',{code:'SYNC_LOCAL_CONFLICT',conflicts:changed.map(item=>item.label)});
      for(const item of changed){manifest.history.push({itemKey:item.key,record:manifest.items[item.key]});delete manifest.items[item.key];}
      journal.save(manifest);
      const outputs=new Map<string,Record<string,unknown>>();
      for(const record of Object.values(manifest.items))for(const [id,step] of Object.entries(record.steps))if(step.output)outputs.set(id,step.output);
      for(const item of input.plan.items){
        if(input.signal?.aborted)throw new SyncFailure('SYNC_CANCELLED');
        emit('syncing',{current:item.label});
        const fingerprint=fingerprints.get(item.key)!;
        let saved=manifest.items[item.key];
        if(!saved){saved={fingerprint,steps:{}};manifest.items[item.key]=saved;}
        for(const step of item.steps){
          const previous=saved.steps[step.id];
          if(previous?.output){outputs.set(step.id,previous.output);continue;}
          await check();
          const data=resolve(step.data,outputs) as Record<string,unknown>;
          const revision=manifest.history.filter(entry=>entry.itemKey===item.key).length;
          const prepared=previous??{key:await journal.operationKey({accountId:input.accountId,workspaceId:input.workspaceId,stepId:step.id,revision,data}),input:data};
          if(previous&&canonical(previous.input)!==canonical(data))throw new SyncFailure('SYNC_PENDING_CONFLICT');
          saved.steps[step.id]=prepared;journal.save(manifest);
          const output=await remote.perform(step.action,prepared.input,input.workspaceId,prepared.key,input.signal);
          if(input.signal?.aborted)throw new SyncFailure('SYNC_CANCELLED');
          // Save acknowledgement before continuing; a failed save is safely replayed with the same key.
          prepared.output=output;journal.save(manifest);outputs.set(step.id,output);
        }
        completed++;emit('syncing',{current:item.label});
      }
      return emit('success');
    }catch(error){
      const code=failureCode(error),status=error&&typeof error==='object'&&'status'in error?Number(error.status):0;
      const requestId=error&&typeof error==='object'&&'requestId'in error?String(error.requestId??''):undefined;
      if(input.signal?.aborted||code==='SYNC_CANCELLED'||(error as {name?:string})?.name==='AbortError')return emit('cancelled',{code:'SYNC_CANCELLED'});
      return emit(status===409||code.endsWith('CONFLICT')?'conflict':'error',{code,requestId});
    }finally{running=false;}
  }};
}
export function synchronizedItems(plan:SyncPlan,manifest:SyncManifest):number {
  return plan.items.filter((item:SyncItem)=>item.steps.every((step:SyncStep)=>manifest.items[item.key]?.steps[step.id]?.output)).length;
}
