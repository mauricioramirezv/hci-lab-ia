import {afterEach,describe,expect,it,vi} from 'vitest';
import {createHttpClient,getCsrfToken,HttpError,setCsrfToken} from '../../src/shared/http';

afterEach(()=>{setCsrfToken('');document.cookie='hci_identity_csrf=; Max-Age=0; Path=/';vi.restoreAllMocks();vi.useRealTimers();});
describe('HTTP service transport',()=>{
  it('keeps the access session in cookies and reads a session-bound CSRF value only for mutations',async()=>{
    document.cookie='hci_identity_csrf=cookie%2Bvalue; Path=/';setCsrfToken('memory-value');
    const fetch=vi.fn().mockImplementation(()=>Promise.resolve(new Response(JSON.stringify({ok:true}),{status:200,headers:{'content-type':'application/json'}})));
    const storage=vi.spyOn(Storage.prototype,'setItem'),client=createHttpClient('/api/learning/',{fetch});
    await client.request('/v1/workspaces');await client.request('/v1/workspaces',{method:'POST',body:{name:'Fixture'},idempotencyKey:'same-operation'});
    const read=fetch.mock.calls[0][1] as RequestInit,write=fetch.mock.calls[1][1] as RequestInit;
    expect(fetch.mock.calls[0][0]).toBe('/api/learning/v1/workspaces');expect(read.credentials).toBe('include');expect(read.headers).not.toHaveProperty('x-csrf-token');
    expect(write).toMatchObject({credentials:'include',method:'POST',body:JSON.stringify({name:'Fixture'}),headers:{'x-csrf-token':'memory-value','idempotency-key':'same-operation'}});
    expect(write.headers).not.toHaveProperty('Authorization');expect(storage).not.toHaveBeenCalled();
    setCsrfToken('');expect(getCsrfToken()).toBe('cookie+value');
  });
  it('blocks unsafe writes without a CSRF value and permits explicit public identity requests',async()=>{
    const fetch=vi.fn().mockResolvedValue(new Response(null,{status:204})),client=createHttpClient('/api/identity',{fetch});
    await expect(client.request('/v1/accounts/me',{method:'PATCH',body:{name:'Synthetic'}})).rejects.toMatchObject({code:'CSRF_REQUIRED',status:403});expect(fetch).not.toHaveBeenCalled();
    await client.request('/v1/sessions',{method:'POST',body:{},csrf:false});expect(fetch).toHaveBeenCalledOnce();
  });
  it('preserves stable errors, conflicts, correlation IDs and caller-owned idempotency on a deliberate retry',async()=>{
    setCsrfToken('fixture');const fetch=vi.fn().mockResolvedValueOnce(new Response(JSON.stringify({code:'VERSION_CONFLICT',requestId:'body-id'}),{status:409,headers:{'x-request-id':'header-id'}})).mockResolvedValueOnce(new Response(JSON.stringify({id:'done'}),{status:200}));
    const client=createHttpClient('/api/community',{fetch});const input={method:'POST',body:{name:'Synthetic'},idempotencyKey:'persisted-operation'};
    await expect(client.request('/v1/groups',input)).rejects.toMatchObject({code:'VERSION_CONFLICT',status:409,requestId:'header-id'});expect(fetch).toHaveBeenCalledOnce();
    await client.request('/v1/groups',input);expect((fetch.mock.calls[0][1] as RequestInit).headers).toEqual((fetch.mock.calls[1][1] as RequestInit).headers);
  });
  it('normalizes non-JSON errors and rejects malformed success responses without exposing server text',async()=>{
    const fetch=vi.fn().mockResolvedValueOnce(new Response('<internal stack>',{status:503})).mockResolvedValueOnce(new Response('<invalid JSON>',{status:200})).mockResolvedValueOnce(new Response(null,{status:204}));const client=createHttpClient('/api/evidence',{fetch});
    await expect(client.request('/v1/reports')).rejects.toMatchObject({code:'DEPENDENCY_UNAVAILABLE',status:503});
    await expect(client.request('/v1/reports')).rejects.toMatchObject({code:'INVALID_RESPONSE',status:200});expect(await client.request('/v1/reports')).toBeUndefined();
  });
  it('handles unauthenticated and network failures with stable codes',async()=>{
    const fetch=vi.fn().mockResolvedValueOnce(new Response('{}',{status:401})).mockRejectedValueOnce(new TypeError('private network detail'));const client=createHttpClient('/api/identity',{fetch});
    await expect(client.request('/v1/accounts/me')).rejects.toMatchObject({code:'UNAUTHENTICATED',status:401});await expect(client.request('/v1/accounts/me')).rejects.toMatchObject({code:'NETWORK_ERROR',status:0});
  });
  it('distinguishes request timeout from cancellation',async()=>{
    vi.useFakeTimers();const fetch=vi.fn().mockImplementation((_path:string,input:RequestInit)=>new Promise((_resolve,reject)=>input.signal?.addEventListener('abort',()=>reject(new DOMException('aborted','AbortError')))));
    const client=createHttpClient('/api/learning',{fetch,timeoutMs:25});const timeout=client.request('/v1/workspaces');const expectation=expect(timeout).rejects.toMatchObject({code:'REQUEST_TIMEOUT'});await vi.advanceTimersByTimeAsync(25);await expectation;
    const controller=new AbortController(),request=client.request('/v1/workspaces',{signal:controller.signal});const aborted=expect(request).rejects.toMatchObject({code:'REQUEST_ABORTED'});controller.abort();await aborted;
  });
  it('supports version preconditions without accepting bearer or CSRF overrides',async()=>{
    setCsrfToken('fixture');const fetch=vi.fn().mockResolvedValue(new Response(null,{status:204})),client=createHttpClient('/api/community',{fetch});
    await client.request('/v1/reservations/fixture',{method:'DELETE',headers:{'If-Match':'"3"'}});expect((fetch.mock.calls[0][1] as RequestInit).headers).toMatchObject({'if-match':'"3"','x-csrf-token':'fixture'});
    await expect(client.request('/v1/groups',{headers:{Authorization:'Bearer accidental'}})).rejects.toBeInstanceOf(HttpError);await expect(client.request('//foreign.test')).rejects.toMatchObject({code:'INVALID_REQUEST'});
  });
});
