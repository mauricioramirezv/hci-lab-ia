import {createHttpClient,serviceUrls,HttpError} from '../../../shared/http';
import type {Group,GroupInvitation,GroupMember,Page,SharedWorkspace,Suggestion,SuggestionHistory,SuggestionStatus,Workspace} from '../domain/types';

type Client=ReturnType<typeof createHttpClient>;
function page<T>(value:Page<T>):Page<T>{
  if(!value||!Array.isArray(value.items)||!Number.isInteger(value.total)||!Number.isInteger(value.offset)||!Number.isInteger(value.limit))throw new HttpError('INVALID_RESPONSE');
  return value;
}
const path=(value:string)=>encodeURIComponent(value);
export function createCommunityClient(http:Client=createHttpClient(serviceUrls.community),learning:Client=createHttpClient(serviceUrls.learning)){
  const getPage=async<T>(route:string,offset=0)=>page(await http.request<Page<T>>(`${route}?limit=25&offset=${offset}`));
  return {
    groups:(offset=0)=>getPage<Group>('/v1/groups',offset),
    createGroup:async(name:string,description:string,idempotencyKey:string)=>(await http.request<{item:Group}>('/v1/groups',{method:'POST',body:{name,description},idempotencyKey})).item,
    members:(id:string,offset=0)=>getPage<GroupMember>(`/v1/groups/${path(id)}/members`,offset),
    invitations:(id:string,offset=0)=>getPage<GroupInvitation>(`/v1/groups/${path(id)}/invitations`,offset),
    createInvitation:(id:string,email:string)=>http.request<{id:string;token:string;expiresAt:string}>(`/v1/groups/${path(id)}/invitations`,{method:'POST',body:email.trim()?{email:email.trim()}: {}}),
    acceptInvitation:(token:string)=>http.request<{groupId:string;accepted:true}>('/v1/group-invitations/accept',{method:'POST',body:{token:token.trim()}}),
    revokeInvitation:(id:string,invitationId:string)=>http.request<void>(`/v1/groups/${path(id)}/invitations/${path(invitationId)}`,{method:'DELETE'}),
    removeMember:(id:string,accountId:string)=>http.request<void>(`/v1/groups/${path(id)}/members/${path(accountId)}`,{method:'DELETE'}),
    sharedWorkspaces:(id:string,offset=0)=>getPage<SharedWorkspace>(`/v1/groups/${path(id)}/workspaces`,offset),
    async workspaces(){const result:Workspace[]=[];for(let offset=0;offset<10000;offset+=100){const next=page(await learning.request<Page<{id:string;name?:string;nombre?:string}>>(`/v1/workspaces?limit=100&offset=${offset}`));result.push(...next.items.map(item=>({id:item.id,name:item.name??item.nombre??item.id})));if(result.length>=next.total)return result;}throw new HttpError('PAGINATION_LIMIT');},
    shareWorkspace:(id:string,workspaceId:string)=>http.request<void>(`/v1/groups/${path(id)}/workspaces/${path(workspaceId)}`,{method:'PUT'}),
    revokeWorkspace:(id:string,workspaceId:string)=>http.request<void>(`/v1/groups/${path(id)}/workspaces/${path(workspaceId)}`,{method:'DELETE'}),
    suggestions:(offset=0)=>getPage<Suggestion>('/v1/suggestions',offset),
    createSuggestion:async(input:{category:string;title:string;description:string;anonymous:boolean},idempotencyKey:string)=>(await http.request<{item:Suggestion}>('/v1/suggestions',{method:'POST',body:input,idempotencyKey})).item,
    suggestion:(id:string)=>http.request<Suggestion>(`/v1/suggestions/${path(id)}`),
    history:(id:string,offset=0)=>getPage<SuggestionHistory>(`/v1/suggestions/${path(id)}/history`,offset),
    updateSuggestion:(id:string,version:number,status:SuggestionStatus,response:string)=>http.request<Suggestion>(`/v1/suggestions/${path(id)}`,{method:'PATCH',body:{version,status,response}}),
  };
}
export const communityClient=createCommunityClient();
