import {afterEach,describe,expect,it,vi} from 'vitest';
import {createCommunityClient} from '../../src/features/community/infrastructure/client';
import {createHttpClient,setCsrfToken} from '../../src/shared/http';
import {communityLocales} from '../../src/features/community/locales';

afterEach(()=>{setCsrfToken('');vi.restoreAllMocks();});
describe('Community HTTP adapter',()=>{
  it('sends cookie credentials, CSRF and idempotency for creation, never an access token',async()=>{
    const fetcher=vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify({item:{id:'synthetic'}}),{status:201}));setCsrfToken('synthetic-csrf');const client=createCommunityClient(createHttpClient('/community',{fetch:fetcher}));await client.createGroup('Group','Description','synthetic-idempotency');expect(fetcher).toHaveBeenCalledWith('/community/v1/groups',expect.objectContaining({method:'POST',credentials:'include',headers:expect.objectContaining({'x-csrf-token':'synthetic-csrf','idempotency-key':'synthetic-idempotency'}),body:JSON.stringify({name:'Group',description:'Description'})}));expect(fetcher.mock.calls[0][1]?.headers).not.toHaveProperty('authorization');
  });
  it('sends the selected version when moderating and rejects malformed pages',async()=>{
    const fetcher=vi.fn<typeof fetch>().mockResolvedValueOnce(new Response('{}')).mockResolvedValueOnce(new Response(JSON.stringify({items:[]})));setCsrfToken('synthetic-csrf');const client=createCommunityClient(createHttpClient('/community',{fetch:fetcher}));await client.updateSuggestion('id',3,'accepted','Reviewed');expect(JSON.parse(String(fetcher.mock.calls[0][1]?.body))).toMatchObject({version:3,status:'accepted',response:'Reviewed'});await expect(client.groups()).rejects.toMatchObject({code:'INVALID_RESPONSE'});
  });
  it('provides every Community message in all six languages',()=>{
    expect(Object.keys(communityLocales)).toHaveLength(6);const keys=Object.keys(communityLocales['es-CO']);for(const values of Object.values(communityLocales)){expect(Object.keys(values)).toEqual(keys);expect(Object.values(values).every(value=>!!value.trim())).toBe(true);}
  });
});
