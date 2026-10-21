import { parseBackup } from '../domain/backup';

export const recoverySizeError = (size:number) => size>25*1024*1024 ? 'tooLarge' : '';
type RecoveryResult = {ok:true;data:ReturnType<typeof parseBackup>} | {ok:false;reason:'tooLarge'|'readFailed'|'invalid'|'stale'};
export async function readRecovery(source:{size:number;text:()=>Promise<string>},isCurrent:()=>boolean):Promise<RecoveryResult> {
  if(recoverySizeError(source.size))return {ok:false,reason:'tooLarge'};
  let content:string;
  try {content=await source.text();}
  catch {return {ok:false,reason:isCurrent()?'readFailed':'stale'};}
  if(!isCurrent())return {ok:false,reason:'stale'};
  try {return {ok:true,data:parseBackup(JSON.parse(content))};}
  catch {return {ok:false,reason:'invalid'};}
}
