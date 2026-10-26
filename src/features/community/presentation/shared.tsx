import {Link} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {HttpError} from '../../../shared/http';
import type {IdentityAccount} from '../../identity';
import {isActiveAccount} from '../../identity';
import {errorKey} from './feedback';
export function AccountGate({account,status}:{account:IdentityAccount|null;status:string}){
  const {t}=useTranslation();
  return <section className="community-card"><p role={status==='error'?'alert':'status'}>{t(`community.${status==='checking'?'loading':status==='error'?'unavailable':account&&!isActiveAccount(account)?'inactiveAccount':'needAccount'}`)}</p><div className="community-actions"><Link className="secondary" to="/cuenta">{t('community.accountLink')}</Link><Link className="secondary" to="/lab">{t('community.publicLink')}</Link></div></section>;
}
export function Feedback({busy,error,notice}:{busy:boolean;error:unknown;notice:string}){
  const {t}=useTranslation();
  return <>{(busy||notice)&&<p className={notice?'community-status':undefined} role="status" aria-live="polite" aria-atomic="true">{t(notice?`community.${notice}`:'community.loading')}</p>}{!!error&&<div className="community-error" role="alert"><p>{t(`community.${errorKey(error)}`)}</p>{error instanceof HttpError&&error.requestId&&<p>{t('community.requestId',{id:error.requestId})}</p>}</div>}</>;
}
export function PageMore({count,total,busy,onMore}:{count:number;total:number;busy:boolean;onMore:()=>void}){
  const {t}=useTranslation();
  return <div><p className="community-meta">{t('community.pageCount',{count,total})}</p>{count<total&&<button type="button" className="secondary" disabled={busy} onClick={onMore}>{t('community.more')}</button>}</div>;
}
