import {createHttpClient, HttpError, serviceUrls, setCsrfToken} from '../../../shared/http';
import type {IdentityAccount, GlobalRole, AccountStatus, SignInInput} from '../domain/types';
export {HttpError as IdentityError} from '../../../shared/http';
const http = createHttpClient(serviceUrls.identity);
type SessionResponse = {account:IdentityAccount;csrfToken?:string};
export type AdminAccount = IdentityAccount & {disabled:boolean};
export type DevelopmentMail = {to:string;subject:string;link:string};
export type MailOptions = {delivery:'local'|'smtp_local'|'smtp';developmentInboxUrl?:string};
let sessionGeneration = 0;
async function session(path:string, method='GET', body?:unknown) {
  const generation = ++sessionGeneration;
  try {
    const result = await http.request<SessionResponse>(path,{method,body,csrf:false});
    if(generation === sessionGeneration)setCsrfToken(result.csrfToken);
    return result;
  } catch(error) {
    if(generation === sessionGeneration && error instanceof HttpError && error.status === 401) setCsrfToken('');
    throw error;
  }
}
export const identityClient = {
  authOptions:()=>http.request<MailOptions>('/v1/auth-options'),
  register:(input:{email:string;password:string;displayName:string;lastName?:string})=>http.request<{message:string}>('/v1/accounts',{method:'POST',body:input,csrf:false}),
  resendVerification:(email:string)=>http.request<{message:string}>('/v1/email-verifications/resend',{method:'POST',body:{email},csrf:false}),
  login:(input:SignInInput)=>session('/v1/sessions','POST',input),
  logout:async()=>{const generation=++sessionGeneration;await http.request<void>('/v1/sessions/current',{method:'DELETE'});if(generation===sessionGeneration)setCsrfToken('');},
  me:()=>session('/v1/accounts/me'),
  profile:(input:{displayName:string;lastName?:string;version:number})=>http.request<{version:number}>('/v1/accounts/me',{method:'PATCH',body:input}),
  requestReset:(email:string)=>http.request<{message:string}>('/v1/password-resets',{method:'POST',body:{email},csrf:false}),
  finishReset:(token:string,password:string)=>http.request<{completed:boolean}>('/v1/password-resets/complete',{method:'POST',body:{token,password},csrf:false}),
  verify:(token:string)=>http.request<{verified:boolean}>('/v1/email-verifications',{method:'POST',body:{token},csrf:false}),
  developmentMailbox:()=>http.request<{messages:DevelopmentMail[]}>('/__dev/mailbox'),
  adminList:()=>http.request<{items:AdminAccount[]}>('/v1/admin/accounts?limit=100&offset=0'),
  adminUpdate:(id:string,input:{globalRoles:GlobalRole[];status:AccountStatus;version:number})=>http.request<{updated:boolean}>(`/v1/admin/accounts/${encodeURIComponent(id)}`,{method:'PATCH',body:input}),
};
