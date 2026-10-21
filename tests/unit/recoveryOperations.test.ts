// @vitest-environment node
import { expect, it, vi } from 'vitest';
import { readRecovery } from '../../src/features/project/application';
import { emptyProject } from '../../src/features/project/domain';

it('checks the size before reading and distinguishes invalid data from read failures',async()=>{
 const text=vi.fn(async()=>JSON.stringify(emptyProject()));
 expect(await readRecovery({size:26*1024*1024,text},()=>true)).toEqual({ok:false,reason:'tooLarge'});expect(text).not.toHaveBeenCalled();
 expect(await readRecovery({size:1,text:async()=>'{invalid'},()=>true)).toEqual({ok:false,reason:'invalid'});
 expect(await readRecovery({size:1,text:async()=>{throw Error('read');}},()=>true)).toEqual({ok:false,reason:'readFailed'});
 expect(await readRecovery({size:1,text},()=>true)).toEqual({ok:true,data:{project:emptyProject(),settings:undefined}});
});
it('rejects a read invalidated while it was pending',async()=>{
 let active=true,finish!:(value:string)=>void;
 const text=()=>new Promise<string>(resolve=>{finish=resolve;});
 const pending=readRecovery({size:1,text},()=>active);active=false;finish(JSON.stringify(emptyProject()));
 expect(await pending).toEqual({ok:false,reason:'stale'});
});
