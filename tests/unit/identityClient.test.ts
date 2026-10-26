import {afterEach,describe,expect,it,vi} from 'vitest';
import {identityClient} from '../../src/features/identity/infrastructure/client';
import {identityLocales} from '../../src/features/identity/locales';
afterEach(()=>vi.unstubAllGlobals());
describe('browser identity client',()=>{
 it('includes all six supported interface languages',()=>{expect(Object.keys(identityLocales).sort()).toEqual(['ca-ES','en-US','es-CO','fr-FR','it-IT','pt-BR'])});
 it('sends credentials with fetch and does not persist or expose a session bearer token',async()=>{
  const response={ok:true,status:200,json:async()=>({account:{id:'fixture',email:'learner@example.invalid',displayName:'Learner',platformRole:'participant',emailVerified:true}})};
  const fetchMock=vi.fn().mockResolvedValue(response);vi.stubGlobal('fetch',fetchMock);const storage=vi.spyOn(Storage.prototype,'setItem');
  const result=await identityClient.login({email:'learner@example.invalid',password:'synthetic-password'});
  const options=fetchMock.mock.calls[0][1] as RequestInit;
  expect(options.credentials).toBe('include');expect(options.headers).not.toHaveProperty('Authorization');expect(result).not.toHaveProperty('token');expect(storage).not.toHaveBeenCalled();
 });
 it('reads the development mail capture through the identity API without storing one-use links',async()=>{
  const messages=[{to:'learner@example.invalid',subject:'Verify email',link:'http://localhost:5173/hci-lab-ia/#/cuenta?verify=one-use-token'}];
  const fetchMock=vi.fn<typeof fetch>(async()=>new Response(JSON.stringify({messages}),{status:200,headers:{'content-type':'application/json'}}));vi.stubGlobal('fetch',fetchMock);const storage=vi.spyOn(Storage.prototype,'setItem');
  expect(await identityClient.developmentMailbox()).toEqual({messages});
  const [url,options]=fetchMock.mock.calls[0];
  expect(String(url)).toContain('/api/identity/__dev/mailbox');expect(options?.credentials).toBe('include');expect(storage).not.toHaveBeenCalled();
 });
});
