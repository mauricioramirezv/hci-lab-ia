import {canonical,SyncFailure,type SyncJournal,type SyncManifest} from '../application/synchronize';
const prefix='hci-lab-ia-sync-v1:';
const isObject=(value:unknown):value is Record<string,unknown>=>!!value&&typeof value==='object'&&!Array.isArray(value);
function valid(manifest:unknown,accountId:string,workspaceId:string):manifest is SyncManifest {
  if(!isObject(manifest)||manifest.version!==1||manifest.accountId!==accountId||manifest.workspaceId!==workspaceId||!isObject(manifest.items)||!Array.isArray(manifest.history))return false;
  return Object.entries(manifest.items).every(([key,item])=>key!=='__proto__'&&isObject(item)&&typeof item.fingerprint==='string'&&isObject(item.steps)&&Object.values(item.steps).every(step=>isObject(step)&&typeof step.key==='string'&&isObject(step.input)&&(step.output===undefined||isObject(step.output))));
}
export function createSyncJournal(storage:Pick<Storage,'getItem'|'setItem'>=localStorage):SyncJournal {
  const digest=async(value:unknown)=>{
    const bytes=new TextEncoder().encode(canonical(value));
    const result=await crypto.subtle.digest('SHA-256',bytes);
    return Array.from(new Uint8Array(result),byte=>byte.toString(16).padStart(2,'0')).join('');
  };
  return {
    read(accountId,workspaceId){
      let raw:string|null;try{raw=storage.getItem(prefix+accountId+':'+workspaceId);}catch{throw new SyncFailure('SYNC_STORAGE_FAILED');}
      if(!raw)return {version:1,accountId,workspaceId,items:{},history:[]};
      let parsed:unknown;try{parsed=JSON.parse(raw);}catch{throw new SyncFailure('SYNC_STORAGE_INVALID');}
      if(!valid(parsed,accountId,workspaceId))throw new SyncFailure('SYNC_STORAGE_INVALID');
      return parsed;
    },
    save(manifest){try{storage.setItem(prefix+manifest.accountId+':'+manifest.workspaceId,JSON.stringify(manifest));}catch{throw new SyncFailure('SYNC_STORAGE_FAILED');}},
    digest,
    async operationKey(value){const hex=(await digest(value)).slice(0,32).split('');hex[12]='8';hex[16]=((parseInt(hex[16],16)&3)|8).toString(16);const id=hex.join('');return `${id.slice(0,8)}-${id.slice(8,12)}-${id.slice(12,16)}-${id.slice(16,20)}-${id.slice(20)}`;},
  };
}
