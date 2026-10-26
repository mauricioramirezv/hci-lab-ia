// @vitest-environment node
import {describe,it,expect,vi,afterEach} from 'vitest';
import {createSynchronization,canonical,type SyncJournal,type SyncManifest} from '../../src/features/synchronization/application/synchronize';
import type {SyncPlan} from '../../src/features/synchronization/domain/plan';
import type {SyncRemote} from '../../src/features/synchronization/application/remote';
import {createSyncJournal} from '../../src/features/synchronization/infrastructure/journal';
const accountId='00000000-0000-4000-8000-000000000001',workspaceId='00000000-0000-4000-8000-000000000002';
const plan:SyncPlan={items:[{key:'personas:local',label:'Persona',steps:[{id:'personas:local/create',action:'persona.create',data:{name:'Synthetic persona'}}]},{key:'scenarios:local',label:'Scenario',steps:[{id:'scenarios:local/create',action:'scenario.create',data:{personaId:{$ref:'personas:local/create'},title:'Synthetic scenario'}}]}],excluded:[]};
function setup(){
  const storage=new Map<string,string>();
  const journal:SyncJournal={read:()=>storage.has('manifest')?JSON.parse(storage.get('manifest')!):{version:1,accountId,workspaceId,items:{},history:[]},save:value=>{storage.set('manifest',JSON.stringify(value));},digest:async value=>canonical(value),operationKey:async value=>'key:'+canonical(value)};
  const perform=vi.fn<SyncRemote['perform']>(async(_action,data)=>({id:data.name?'remote-persona':'remote-scenario',version:1}));
  const remote={perform} as unknown as SyncRemote;
  return {journal,remote,perform,storage};
}
afterEach(()=>vi.unstubAllGlobals());
describe('explicit synchronization',()=>{
  it('refuses visitors before creating a journal or performing remote writes',async()=>{
    const {remote,journal,perform,storage}=setup();
    const result=await createSynchronization(remote,journal,async()=>null).run({accountId,workspaceId,plan});
    expect(result).toMatchObject({state:'error',code:'UNAUTHENTICATED',completed:0});expect(perform).not.toHaveBeenCalled();expect(storage.size).toBe(0);
  });
  it('checkpoints partial success, reuses the pending key and leaves the input snapshot intact',async()=>{
    const {remote,journal,perform}=setup();const before=canonical(plan);
    perform.mockResolvedValueOnce({id:'remote-persona',version:1}).mockRejectedValueOnce({code:'DEPENDENCY_UNAVAILABLE',status:503}).mockResolvedValue({id:'remote-scenario',version:1});
    const sync=createSynchronization(remote,journal,async()=>accountId);
    expect(await sync.run({accountId,workspaceId,plan})).toMatchObject({state:'error',completed:1});
    const pendingKey=perform.mock.calls[1][3];
    expect(await sync.run({accountId,workspaceId,plan})).toMatchObject({state:'success',completed:2});
    expect(perform).toHaveBeenCalledTimes(3);expect(perform.mock.calls[2][3]).toBe(pendingKey);expect(perform.mock.calls[2][1]).toEqual({personaId:'remote-persona',title:'Synthetic scenario'});expect(canonical(plan)).toBe(before);
  });
  it('surfaces local edits and dependent records as conflicts before writing, requiring explicit copies',async()=>{
    const {remote,journal,perform}=setup();const sync=createSynchronization(remote,journal,async()=>accountId);
    await sync.run({accountId,workspaceId,plan});perform.mockClear();
    const edited=structuredClone(plan);edited.items[0].steps[0].data.name='Edited persona';
    const conflict=await sync.run({accountId,workspaceId,plan:edited});
    expect(conflict).toMatchObject({state:'conflict',code:'SYNC_LOCAL_CONFLICT',conflicts:['Persona','Scenario']});expect(perform).not.toHaveBeenCalled();
    expect(await sync.run({accountId,workspaceId,plan:edited,copyChanged:true})).toMatchObject({state:'success'});expect(perform).toHaveBeenCalledTimes(2);expect(journal.read(accountId,workspaceId).history).toHaveLength(2);
  });
  it('reports server conflicts without acknowledging or overwriting the pending record',async()=>{
    const {remote,journal,perform}=setup();perform.mockRejectedValue({code:'VERSION_CONFLICT',status:409,requestId:'request-fixture'});
    const result=await createSynchronization(remote,journal,async()=>accountId).run({accountId,workspaceId,plan});
    expect(result).toMatchObject({state:'conflict',code:'VERSION_CONFLICT',requestId:'request-fixture'});
    expect(journal.read(accountId,workspaceId).items['personas:local'].steps['personas:local/create'].output).toBeUndefined();
  });
  it('uses a fresh key when a confirmed edit returns to an earlier value',async()=>{
    const {remote,journal,perform}=setup(),sync=createSynchronization(remote,journal,async()=>accountId);
    await sync.run({accountId,workspaceId,plan});const originalKey=perform.mock.calls[0][3];
    const edited=structuredClone(plan);edited.items[0].steps[0].data.name='Changed persona';
    await sync.run({accountId,workspaceId,plan:edited,copyChanged:true});
    await sync.run({accountId,workspaceId,plan,copyChanged:true});
    expect(perform.mock.calls[4][3]).not.toBe(originalKey);
    expect(journal.read(accountId,workspaceId).history.filter(entry=>entry.itemKey==='personas:local')).toHaveLength(2);
  });
  it('revalidates the account between writes and stops when the session changes',async()=>{
    const {remote,journal,perform}=setup();const authorize=vi.fn().mockResolvedValueOnce(accountId).mockResolvedValueOnce(accountId).mockResolvedValue('other-account');
    const result=await createSynchronization(remote,journal,authorize).run({accountId,workspaceId,plan});
    expect(result).toMatchObject({state:'error',code:'UNAUTHENTICATED',completed:1});expect(perform).toHaveBeenCalledTimes(1);
  });
  it('keeps journals isolated by account and workspace, with deterministic UUID operation keys',async()=>{
    const storage=new Map<string,string>();const journal=createSyncJournal({getItem:key=>storage.get(key)??null,setItem:(key,value)=>{storage.set(key,value);}});
    const saved:SyncManifest={version:1,accountId,workspaceId,items:{},history:[]};journal.save(saved);
    expect(journal.read('another-account',workspaceId).accountId).toBe('another-account');
    const key=await journal.operationKey({accountId,workspaceId,record:'fixture'});
    expect(key).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-8[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);expect(await journal.operationKey({record:'fixture',workspaceId,accountId})).toBe(key);
    expect(await journal.operationKey({accountId:'other',workspaceId,record:'fixture'})).not.toBe(key);
    expect([...storage.values()].join('')).not.toMatch(/csrf|password|sessionToken|accessToken/);
  });
});
