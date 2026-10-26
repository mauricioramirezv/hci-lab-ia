import {HttpError} from '../../../shared/http';
export const shortIdentifier=(value:string)=>value.length>16?`${value.slice(0,8)}…${value.slice(-4)}`:value;
export function errorKey(error:unknown){
  const code=error instanceof HttpError?error.code:'NETWORK_ERROR';
  if(code==='LIST_REFRESH_FAILED')return 'refreshUnavailable';
  if(/VERSION_CONFLICT|STATE_CONFLICT|IDEMPOTENCY_KEY_REUSED/.test(code))return 'conflict';
  if(/UNAUTHENTICATED|CSRF|SESSION/.test(code))return 'unauthenticated';
  if(code==='INVITATION_INVALID_OR_EXPIRED')return 'invitationInvalid';
  if(/FORBIDDEN|NOT_FOUND|RESOURCE_NOT_FOUND/.test(code))return 'forbidden';
  if(/INVALID_INPUT|INVALID_REQUEST/.test(code))return 'invalid';
  if(/NETWORK|TIMEOUT|UNAVAILABLE|RATE_LIMITED/.test(code))return 'unavailable';
  return 'generic';
}
export async function refreshAfterSave(action:()=>Promise<void>){try{await action();}catch{throw new HttpError('LIST_REFRESH_FAILED');}}
