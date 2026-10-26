import {ExpandableCard} from '../../../shared/ui/ExpandableCard';
import {useCallback, useEffect, useRef, useState} from 'react';
import type {ReactNode} from 'react';
import {ChevronDown} from 'lucide-react';
import {useTranslation} from 'react-i18next';
import {HttpError} from '../../../shared/http';
import {canManageAccounts} from '../domain/types';
import type {AccountStatus,GlobalRole} from '../domain/types';
import {identityClient} from '../infrastructure/client';
import type {AdminAccount, MailOptions} from '../infrastructure/client';
import {useIdentity} from './IdentityProvider';
import './identity.css';

type Panel = 'login' | 'recovery' | 'register';
type LocalDelivery = {kind:'verify'|'reset';mode:'local'|'smtp_local';link:string|null};
type PasswordField = 'login'|'register'|'registerConfirmation'|'reset'|'resetConfirmation';
type ValidationState = 'neutral'|'invalid'|'valid'|'weak'|'medium'|'strong';
const isValidEmail=(value:string)=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
const passwordLengthState=(value:string):ValidationState=>value.length===0?'neutral':value.length<12||value.length>128?'invalid':'valid';
const passwordStrength=(value:string):Exclude<ValidationState,'neutral'|'invalid'|'valid'>=>{
  if(value.length<12)return 'weak';
  const variety=[/[a-z]/.test(value),/[A-Z]/.test(value),/\d/.test(value),/[^a-zA-Z\d]/.test(value)].filter(Boolean).length;
  return value.length>=16&&variety>=3?'strong':variety>=2?'medium':'weak';
};
function ValidationHint({id,state,children}:{id:string;state:ValidationState;children:ReactNode}) {
  return <p id={id} className={`identity-validation identity-validation-${state}`} aria-live="polite" aria-atomic="true">{children}</p>;
}
const errors:Record<string,string> = {
  NETWORK_ERROR:'network', REQUEST_TIMEOUT:'network', DEPENDENCY_UNAVAILABLE:'network',
  VERSION_CONFLICT:'conflict', CSRF_INVALID:'csrf', CSRF_REQUIRED:'csrf',
  UNAUTHENTICATED:'unauthenticated', INVALID_CREDENTIALS:'credentials',
  RATE_LIMITED:'rateLimited', TOKEN_INVALID_OR_EXPIRED:'expired', FORBIDDEN:'forbidden',
  PASSWORD_POLICY:'passwordPolicy', INVALID_EMAIL:'emailInvalid', INVALID_NAME:'nameInvalid',
  PASSWORD_MISMATCH:'passwordMismatch', LAST_ADMIN:'lastAdmin', LAST_ADMIN_REQUIRED:'lastAdmin', EMAIL_NOT_VERIFIED:'emailNotVerified', INVALID_STATUS_TRANSITION:'statusTransition',
};

function AccountSection({id,title,open,onToggle,children}:{id:Panel;title:string;open:boolean;onToggle:()=>void;children:ReactNode}) {
  return <section className="identity-card identity-disclosure">
    <h2><button type="button" id={`identity-${id}-heading`} aria-expanded={open} aria-controls={`identity-${id}-panel`} onClick={onToggle}>
      <span>{title}</span><ChevronDown aria-hidden="true" size={20}/>
    </button></h2>
    <div id={`identity-${id}-panel`} role="region" aria-labelledby={`identity-${id}-heading`} hidden={!open} className="identity-disclosure-content">{children}</div>
  </section>;
}

export function IdentityPage() {
  const {t} = useTranslation();
  const identity = useIdentity(), account = identity.account;
  const [panel,setPanel] = useState<Panel|null>(()=>{const fragment=window.location.hash.slice(1);const search=fragment.includes('?')?fragment.slice(fragment.indexOf('?')+1):'';return new URLSearchParams(search).get('panel')==='register'?'register':'login';});
  const [registerEmail,setRegisterEmail] = useState(''), [registerPassword,setRegisterPassword] = useState(''), [registerName,setRegisterName] = useState('');
  const [registerLastName,setRegisterLastName] = useState(''), [registerConfirmation,setRegisterConfirmation] = useState('');
  const [loginEmail,setLoginEmail] = useState(''), [loginPassword,setLoginPassword] = useState('');
  const [resetEmail,setResetEmail] = useState(''), [name,setName] = useState<string|null>(null), [lastName,setLastName] = useState<string|null>(null);
  const [newPassword,setNewPassword] = useState(''), [resetConfirmation,setResetConfirmation] = useState('');
  const [visiblePasswords,setVisiblePasswords] = useState<Partial<Record<PasswordField,boolean>>>({});
  const [resetToken,setResetToken] = useState(''), [message,setMessage] = useState('');
  const [error,setError] = useState(''), [items,setItems] = useState<AdminAccount[]>([]);
  const [roleDrafts,setRoleDrafts] = useState<Record<string,GlobalRole[]>>({}), [statusDrafts,setStatusDrafts] = useState<Record<string,AccountStatus>>({});
  const [busy,setBusy] = useState(false);
  const [delivery,setDelivery] = useState<LocalDelivery|null>(null);
  const [mailOptions,setMailOptions] = useState<MailOptions>({delivery:import.meta.env.DEV?'local':'smtp'});
  const noticeRef = useRef<HTMLDivElement>(null);
  const canAdmin = canManageAccounts(account), pending = busy || identity.status === 'checking';
  const passwordVisible=(field:PasswordField)=>visiblePasswords[field]??false;
  const togglePassword=(field:PasswordField)=>setVisiblePasswords(current=>({...current,[field]:!current[field]}));
  const emailState=(value:string):ValidationState=>!value?'neutral':isValidEmail(value)?'valid':value.includes('@')?'invalid':'neutral';
  const nameState=(value:string):ValidationState=>!value?'neutral':value.trim()?'valid':'invalid';
  const registerNameState=nameState(registerName), registerLastNameState=nameState(registerLastName);
  const registerEmailState=emailState(registerEmail), registerPasswordState=passwordLengthState(registerPassword);
  const registerStrength=registerPassword?passwordStrength(registerPassword):null;
  const registerConfirmationState=!registerConfirmation?'neutral':registerConfirmation===registerPassword?'valid':'invalid';
  const resetPasswordState=passwordLengthState(newPassword), resetStrength=newPassword?passwordStrength(newPassword):null;
  const resetConfirmationState=!resetConfirmation?'neutral':resetConfirmation===newPassword?'valid':'invalid';
  const run = useCallback(async(action:()=>Promise<void>) => {
    setBusy(true);setError('');setMessage('');setDelivery(null);
    try {await action();} catch(failure) {setError(failure instanceof HttpError ? failure.code : 'REQUEST_FAILED');}
    finally {setBusy(false);}
  },[]);
  useEffect(()=>{if(error||message)noticeRef.current?.focus();},[error,message]);
  const resolveMailOptions=async()=>{
    try {const options=await identityClient.authOptions();setMailOptions(options);return options;}
    catch {return mailOptions;}
  };
  useEffect(()=>{
    if(!canAdmin){setItems([]);return;}
    let current=true;
    void identityClient.adminList().then(result=>{if(current)setItems(result.items);}).catch(failure=>{if(current)setError(failure instanceof HttpError ? failure.code : 'REQUEST_FAILED');});
    return()=>{current=false;};
  },[canAdmin,account?.id]);
  useEffect(()=>{
    const processLink=()=>{
      const fragment=location.hash.slice(1), query=fragment.includes('?') ? fragment.slice(fragment.indexOf('?')+1) : fragment;
      const parameters=new URLSearchParams(query), verify=parameters.get('verify'), reset=parameters.get('reset');
      if(!verify&&!reset)return;
      history.replaceState(null,'',`${location.pathname}${location.search}#/cuenta`);
      if(verify){
        setPanel('login');setResetToken('');
        void run(async()=>{await identityClient.verify(verify);setMessage('identity.verifySent');});
      } else if(reset){
        setResetToken(reset);setPanel('recovery');setError('');setMessage('');setDelivery(null);
      }
    };
    processLink();
    window.addEventListener('hashchange',processLink);
    return()=>window.removeEventListener('hashchange',processLink);
  },[run]);
  const selectPanel=(next:Panel)=>{
    if(busy)return;
    setPanel(current=>current===next?null:next);setError('');setMessage('');setDelivery(null);
  };
  const captureLocalLink=async(email:string,kind:LocalDelivery['kind'],options:MailOptions)=>{
    if(options.delivery==='smtp_local'){
      setDelivery({kind,mode:'smtp_local',link:null});
      return;
    }
    if(!import.meta.env.DEV||options.delivery!=='local')return;
    try {
      const result=await identityClient.developmentMailbox();
      const normalize=(value:string)=>value.trim().normalize('NFKC').toLowerCase();
      let link:string|null=null;
      for(const mail of [...result.messages].reverse()){
        if(normalize(mail.to)!==normalize(email))continue;
        try {
          const fragment=new URL(mail.link).hash;
          const token=new URLSearchParams(fragment.split('?')[1]??'').get(kind);
          if(fragment.startsWith('#/cuenta?')&&token){link=`#/cuenta?${kind}=${encodeURIComponent(token)}`;break;}
        } catch { /* Ignore malformed messages from the development adapter. */ }
      }
      setDelivery({kind,mode:'local',link});
    } catch { /* A production API does not expose the local adapter. */ }
  };
  const updateAdmin=async(item:AdminAccount,changes:Partial<{globalRoles:GlobalRole[];status:AccountStatus}>) => {
    const globalRoles=changes.globalRoles??item.globalRoles??['participant'];
    const status=changes.status??item.status??'active';
    await identityClient.adminUpdate(item.id,{globalRoles,status,version:item.version});
    setItems((await identityClient.adminList()).items);
    setRoleDrafts(current=>{const next={...current};delete next[item.id];return next;});
    setStatusDrafts(current=>{const next={...current};delete next[item.id];return next;});
    if(item.id===account?.id)await identity.refresh();
    setMessage('identity.success');
  };
  const setRoleDraft=(item:AdminAccount,role:GlobalRole,checked:boolean)=>setRoleDrafts(current=>{
    const existing=current[item.id]??item.globalRoles??['participant'];
    const next=role==='participant'?existing:checked?[...new Set([...existing,role])]:existing.filter(value=>value!==role);
    return {...current,[item.id]:['participant',...next.filter(value=>value!=='participant')]};
  });
  const failure=error || (identity.status==='error'?identity.error:'');
  const feedback=(pending||message||failure||delivery)?<div ref={noticeRef} tabIndex={-1} className="identity-feedback">
    {(pending||message)&&<p className="identity-notice" role="status" aria-live="polite">{pending?t(busy?'identity.processing':'identity.loading'):t(message)}</p>}
    {failure&&<p id="identity-form-error" className="identity-notice identity-error" role="alert">{t(errors[failure]?`identity.${errors[failure]}`:'identity.invalid')}</p>}
    {identity.status==='error'&&<button className="secondary" type="button" disabled={pending} onClick={()=>void identity.refresh()}>{t('identity.retry')}</button>}
    {delivery?.mode==='local'&&<aside className="identity-local-step"><p>{t('identity.localSetupHelp')}</p>{delivery.link?<a className="secondary" href={delivery.link}>{t(delivery.kind==='verify'?'identity.verifyHere':'identity.recoverHere')}</a>:<p>{t('identity.localLinkUnavailable')}</p>}</aside>}
    {delivery?.mode==='smtp_local'&&<aside className="identity-local-step"><p>{t('identity.localSmtpHelp')}</p>{mailOptions.developmentInboxUrl&&<a className="secondary" href={mailOptions.developmentInboxUrl} target="_blank" rel="noopener noreferrer">{t('identity.openMailpit')}</a>}</aside>}
    {(message==='identity.registrationReceived'||message==='identity.resendSent')&&<button className="secondary" type="button" disabled={pending||!registerEmail.trim()} onClick={()=>void run(async()=>{await identityClient.resendVerification(registerEmail);const options=await resolveMailOptions();await captureLocalLink(registerEmail,'verify',options);setMessage('identity.resendSent');})}>{t('identity.resendVerification')}</button>}
  </div>:null;
  return <section className="activity-page identity-page" aria-labelledby="identity-title" aria-busy={pending}>
    <header className="page-head"><div><p className="eyebrow">HCI LAB + IA</p><h1 id="identity-title">{t('identity.title')}</h1><p>{t('identity.intro')}</p></div></header>
    {account&&!resetToken? <div className="identity-account-layout">
      <ExpandableCard className="identity-card" id="identity-profile-card" title={t('identity.profile')}>
        <div className="identity-card-heading"><div><p className="eyebrow">{t('identity.profile')}</p><h2 id="identity-profile">{[account.displayName,account.lastName].filter(Boolean).join(' ')||account.email}</h2><p>{account.email}</p></div><span className="identity-status">{t(account.emailVerified?'identity.emailVerified':'identity.emailPending')}</span></div>
        <p className="identity-role">{t('identity.role')}: <strong>{canAdmin?t('identity.administrator'):t('identity.participant')}</strong></p>
        {feedback}
        <form className="identity-form" onSubmit={event=>{event.preventDefault();void run(async()=>{await identityClient.profile({displayName:name??account.displayName,lastName:lastName??account.lastName??'',version:account.version});await identity.refresh();setName(null);setLastName(null);setMessage('identity.profileSaved');});}}>
          <label htmlFor="identity-name">{t('identity.name')}<input id="identity-name" autoComplete="given-name" value={name??account.displayName} maxLength={100} onChange={event=>setName(event.target.value)}/></label>
          <label htmlFor="identity-last-name">{t('identity.lastName')}<input id="identity-last-name" autoComplete="family-name" value={lastName??account.lastName??''} maxLength={100} onChange={event=>setLastName(event.target.value)}/></label>
          <div className="identity-actions"><button className="primary" type="submit" disabled={pending}>{t('identity.save')}</button><button className="secondary" type="button" disabled={pending} onClick={()=>void run(async()=>{await identity.signOut();setName(null);setLastName(null);setItems([]);setLoginPassword('');setPanel('login');setMessage('identity.signedOut');})}>{t('identity.logout')}</button></div>
        </form>
      </ExpandableCard>
      {canAdmin&&<ExpandableCard className="identity-card identity-admin" id="identity-admin-card" title={t('identity.admin')}>
        {items.length===0?<p>{t('identity.noAccounts')}</p>:<div className="identity-admin-list">{items.map(item=>{
          const roles=roleDrafts[item.id]??item.globalRoles??['participant'];
          const status=statusDrafts[item.id]??item.status??'active';
          const sameRoles=[...roles].sort().join('|')===[...(item.globalRoles??['participant'])].sort().join('|');
          const sameStatus=status===(item.status??'active');
          const roleOptions:Array<{role:GlobalRole;label:string}>=[{role:'participant',label:t('identity.participant')},{role:'teacher',label:t('identity.roleTeacher')},{role:'evaluator',label:t('identity.roleEvaluator')},{role:'administrator',label:t('identity.administrator')}];
          return <article className="identity-admin-row" key={item.id}>
            <div><h3>{[item.displayName,item.lastName].filter(Boolean).join(' ')||item.email}</h3><p>{item.email}</p><span className="identity-status">{t(`identity.state${status[0].toUpperCase()}${status.slice(1)}`)}</span></div>
            <div className="identity-admin-controls">
              <fieldset className="identity-admin-roles" disabled={pending||!account?.permissions?.includes('role:assign')}><legend>{t('identity.rolesTitle')}</legend><p>{t('identity.rolesHelp')}</p><div>{roleOptions.map(option=><label key={option.role}><input type="checkbox" checked={roles.includes(option.role)} disabled={option.role==='participant'} onChange={event=>setRoleDraft(item,option.role,event.target.checked)}/>{option.label}</label>)}</div><button className="secondary" type="button" disabled={pending||sameRoles||!account?.permissions?.includes('role:assign')} onClick={()=>void run(()=>updateAdmin(item,{globalRoles:roles}))}>{t('identity.assignRoles')}</button></fieldset>
              <div className="identity-admin-state"><label htmlFor={`state-${item.id}`}>{t('identity.accountState')}<select id={`state-${item.id}`} value={status} disabled={pending||!account?.permissions?.includes('role:assign')} onChange={event=>setStatusDrafts(current=>({...current,[item.id]:event.target.value as AccountStatus}))}><option value="pending">{t('identity.statePending')}</option><option value="active">{t('identity.stateActive')}</option><option value="inactive">{t('identity.stateInactive')}</option><option value="locked">{t('identity.stateLocked')}</option></select></label><button className="secondary" type="button" disabled={pending||sameStatus||!account?.permissions?.includes('role:assign')} onClick={()=>void run(()=>updateAdmin(item,{status}))}>{t('identity.saveState')}</button></div>
            </div>
          </article>;
        })}</div>}
      </ExpandableCard>}
    </div> : <div className="identity-accordion">
      <AccountSection id="login" title={t('identity.login')} open={panel==='login'} onToggle={()=>selectPanel('login')}>
        <p>{t('identity.loginIntro')}</p>{panel==='login'&&feedback}
        <form aria-label={t('identity.login')} className="identity-form" onSubmit={event=>{event.preventDefault();void run(async()=>{await identity.signIn({email:loginEmail,password:loginPassword});setLoginPassword('');setMessage('identity.session');});}}>
          <label htmlFor="identity-login-email">{t('identity.email')}<input id="identity-login-email" type="email" autoComplete="username" required value={loginEmail} onChange={event=>setLoginEmail(event.target.value)}/></label>
          <div className="identity-password-control"><label htmlFor="identity-login-password">{t('identity.password')}</label><div className="identity-password-input"><input id="identity-login-password" type={passwordVisible('login')?'text':'password'} autoComplete="current-password" required value={loginPassword} onChange={event=>setLoginPassword(event.target.value)}/><button className="secondary identity-password-toggle" type="button" aria-controls="identity-login-password" aria-pressed={passwordVisible('login')} onClick={()=>togglePassword('login')}>{t(passwordVisible('login')?'identity.hidePassword':'identity.showPassword')}</button></div></div>
          <div className="identity-actions"><button className="primary" type="submit" disabled={pending}>{t('identity.login')}</button></div>
        </form>
      </AccountSection>
      <AccountSection id="recovery" title={t('identity.forgot')} open={panel==='recovery'} onToggle={()=>selectPanel('recovery')}>
        <p>{t(resetToken?'identity.newPasswordIntro':'identity.resetIntro')}</p>{panel==='recovery'&&feedback}
        {resetToken?<form aria-label={t('identity.completeReset')} className="identity-form" onSubmit={event=>{event.preventDefault();void run(async()=>{
          if(newPassword!==resetConfirmation)throw new HttpError('PASSWORD_MISMATCH',400);
          await identityClient.finishReset(resetToken,newPassword);setResetToken('');setNewPassword('');setResetConfirmation('');await identity.refresh();setPanel('login');setMessage('identity.passwordChanged');
        });}}>
          <div className="identity-password-control"><label htmlFor="identity-new-password">{t('identity.newPassword')}</label><div className="identity-password-input"><input id="identity-new-password" type={passwordVisible('reset')?'text':'password'} autoComplete="new-password" required minLength={12} maxLength={128} aria-invalid={resetPasswordState==='invalid'} aria-describedby="identity-reset-password-help identity-reset-password-state identity-reset-password-strength" value={newPassword} onChange={event=>setNewPassword(event.target.value)}/><button className="secondary identity-password-toggle" type="button" aria-controls="identity-new-password" aria-pressed={passwordVisible('reset')} onClick={()=>togglePassword('reset')}>{t(passwordVisible('reset')?'identity.hidePassword':'identity.showPassword')}</button></div></div>
          <p className="identity-help" id="identity-reset-password-help">{t('identity.passwordHelp')}</p>
          <ValidationHint id="identity-reset-password-state" state={resetPasswordState}>{t(resetPasswordState==='valid'?'identity.passwordLengthValid':resetPasswordState==='invalid'?'identity.passwordLengthInvalid':'identity.passwordLengthPrompt')}</ValidationHint>
          <ValidationHint id="identity-reset-password-strength" state={resetStrength??'neutral'}>{t(resetStrength?`identity.passwordStrength.${resetStrength}`:'identity.passwordStrengthPrompt')}</ValidationHint>
          <div className="identity-password-control"><label htmlFor="identity-reset-confirmation">{t('identity.confirmPassword')}</label><div className="identity-password-input"><input id="identity-reset-confirmation" type={passwordVisible('resetConfirmation')?'text':'password'} autoComplete="new-password" required minLength={12} maxLength={128} aria-invalid={resetConfirmationState==='invalid'} aria-describedby="identity-reset-confirmation-state" value={resetConfirmation} onChange={event=>setResetConfirmation(event.target.value)}/><button className="secondary identity-password-toggle" type="button" aria-controls="identity-reset-confirmation" aria-pressed={passwordVisible('resetConfirmation')} onClick={()=>togglePassword('resetConfirmation')}>{t(passwordVisible('resetConfirmation')?'identity.hidePassword':'identity.showPassword')}</button></div></div>
          <ValidationHint id="identity-reset-confirmation-state" state={resetConfirmationState}>{t(resetConfirmationState==='valid'?'identity.passwordMatch':resetConfirmationState==='invalid'?'identity.passwordMismatch':'identity.passwordConfirmationPrompt')}</ValidationHint>
          <div className="identity-actions"><button className="primary" type="submit" disabled={pending||resetPasswordState!=='valid'||resetConfirmationState!=='valid'}>{t('identity.completeReset')}</button></div>
          <button className="secondary" type="button" disabled={pending} onClick={()=>{setResetToken('');setNewPassword('');setResetConfirmation('');setError('');setMessage('');}}>{t('identity.requestAnotherReset')}</button>
        </form>:<form aria-label={t('identity.forgot')} className="identity-form" onSubmit={event=>{event.preventDefault();void run(async()=>{await identityClient.requestReset(resetEmail);const options=await resolveMailOptions();await captureLocalLink(resetEmail,'reset',options);setMessage('identity.resetSent');});}}>
          <label htmlFor="identity-reset-email">{t('identity.email')}<input id="identity-reset-email" type="email" autoComplete="email" required value={resetEmail} onChange={event=>setResetEmail(event.target.value)}/></label>
          <div className="identity-actions"><button className="primary" type="submit" disabled={pending}>{t('identity.sendReset')}</button></div>
        </form>}
      </AccountSection>
      <AccountSection id="register" title={t('identity.register')} open={panel==='register'} onToggle={()=>selectPanel('register')}>
        <p>{t('identity.registerIntro')}</p>{panel==='register'&&feedback}
        <form aria-label={t('identity.register')} className="identity-form" onSubmit={event=>{event.preventDefault();void run(async()=>{
          if(!registerName.trim()||!registerLastName.trim())throw new HttpError('INVALID_NAME',400);
          if(registerPassword!==registerConfirmation)throw new HttpError('PASSWORD_MISMATCH',400);
          await identityClient.register({email:registerEmail,password:registerPassword,displayName:registerName.trim(),lastName:registerLastName.trim()});
          setRegisterPassword('');setRegisterConfirmation('');setLoginEmail(registerEmail);const options=await resolveMailOptions();await captureLocalLink(registerEmail,'verify',options);setMessage('identity.registrationReceived');
        });}}>
          <div className="identity-name-fields">
            <div><label htmlFor="identity-register-name">{t('identity.name')}<input id="identity-register-name" autoComplete="given-name" required aria-invalid={registerNameState==='invalid'} aria-describedby="identity-register-name-state" value={registerName} maxLength={100} onChange={event=>setRegisterName(event.target.value)}/></label><ValidationHint id="identity-register-name-state" state={registerNameState}>{t(registerNameState==='valid'?'identity.nameValid':registerNameState==='invalid'?'identity.nameInvalid':'identity.namePrompt')}</ValidationHint></div>
            <div><label htmlFor="identity-register-last-name">{t('identity.lastName')}<input id="identity-register-last-name" autoComplete="family-name" required aria-invalid={registerLastNameState==='invalid'} aria-describedby="identity-register-last-name-state" value={registerLastName} maxLength={100} onChange={event=>setRegisterLastName(event.target.value)}/></label><ValidationHint id="identity-register-last-name-state" state={registerLastNameState}>{t(registerLastNameState==='valid'?'identity.lastNameValid':registerLastNameState==='invalid'?'identity.lastNameInvalid':'identity.lastNamePrompt')}</ValidationHint></div>
          </div>
          <label htmlFor="identity-register-email">{t('identity.email')}<input id="identity-register-email" type="email" autoComplete="email" required aria-invalid={registerEmailState==='invalid'} aria-describedby="identity-register-email-state" value={registerEmail} onChange={event=>setRegisterEmail(event.target.value)}/></label>
          <ValidationHint id="identity-register-email-state" state={registerEmailState}>{t(registerEmailState==='valid'?'identity.emailValid':registerEmailState==='invalid'?'identity.emailInvalid':'identity.emailPrompt')}</ValidationHint>
          <div className="identity-password-control"><label htmlFor="identity-register-password">{t('identity.password')}</label><div className="identity-password-input"><input id="identity-register-password" type={passwordVisible('register')?'text':'password'} autoComplete="new-password" required minLength={12} maxLength={128} aria-invalid={registerPasswordState==='invalid'} aria-describedby="identity-password-help identity-register-password-state identity-register-password-strength" value={registerPassword} onChange={event=>setRegisterPassword(event.target.value)}/><button className="secondary identity-password-toggle" type="button" aria-controls="identity-register-password" aria-pressed={passwordVisible('register')} onClick={()=>togglePassword('register')}>{t(passwordVisible('register')?'identity.hidePassword':'identity.showPassword')}</button></div></div>
          <p className="identity-help" id="identity-password-help">{t('identity.passwordHelp')}</p>
          <ValidationHint id="identity-register-password-state" state={registerPasswordState}>{t(registerPasswordState==='valid'?'identity.passwordLengthValid':registerPasswordState==='invalid'?'identity.passwordLengthInvalid':'identity.passwordLengthPrompt')}</ValidationHint>
          <ValidationHint id="identity-register-password-strength" state={registerStrength??'neutral'}>{t(registerStrength?`identity.passwordStrength.${registerStrength}`:'identity.passwordStrengthPrompt')}</ValidationHint>
          <div className="identity-password-control"><label htmlFor="identity-register-confirmation">{t('identity.confirmPassword')}</label><div className="identity-password-input"><input id="identity-register-confirmation" type={passwordVisible('registerConfirmation')?'text':'password'} autoComplete="new-password" required minLength={12} maxLength={128} aria-invalid={registerConfirmationState==='invalid'} aria-describedby="identity-register-confirmation-state" value={registerConfirmation} onChange={event=>setRegisterConfirmation(event.target.value)}/><button className="secondary identity-password-toggle" type="button" aria-controls="identity-register-confirmation" aria-pressed={passwordVisible('registerConfirmation')} onClick={()=>togglePassword('registerConfirmation')}>{t(passwordVisible('registerConfirmation')?'identity.hidePassword':'identity.showPassword')}</button></div></div>
          <ValidationHint id="identity-register-confirmation-state" state={registerConfirmationState}>{t(registerConfirmationState==='valid'?'identity.passwordMatch':registerConfirmationState==='invalid'?'identity.passwordMismatch':'identity.passwordConfirmationPrompt')}</ValidationHint>
          <div className="identity-actions"><button className="primary" type="submit" disabled={pending||!registerName.trim()||!registerLastName.trim()||registerEmailState!=='valid'||registerPasswordState!=='valid'||registerConfirmationState!=='valid'}>{t('identity.register')}</button></div>
        </form>
      </AccountSection>
    </div>}
  </section>;
}
