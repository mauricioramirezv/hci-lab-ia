import {ExpandableCard} from '../../../shared/ui/ExpandableCard';
import {useEffect, useRef, useState} from 'react';
import {Link} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {isActiveAccount, useIdentity} from '../../identity';
import {useProject} from '../../project/presentation';
import type {ProjectState} from '../../project';
import {buildSyncPlan} from '../domain/plan';
import type {Catalogs, SyncOptions, SyncPlan} from '../domain/plan';
import type {Workspace} from '../application/remote';
import {createSynchronization, SyncFailure} from '../application/synchronize';
import type {SyncProgress} from '../application/synchronize';
import {createSyncJournal} from '../infrastructure/journal';
import {createServiceGateway} from '../infrastructure/serviceGateway';
import {assignmentSyncCopy} from './assignment-sync-copy';
import './synchronization.css';

const consentNoticeVersion = 'frontend-2.5.0-aggregate-v1';
const initialOptions: SyncOptions = {learning:false, reservations:false, accessibility:false, report:false};
type Preview = {source:ProjectState; catalogs:Catalogs; plan:SyncPlan; workspaceId:string};
type Busy = '' | 'load' | 'create' | 'preview' | 'send';
function codeOf(error:unknown):string {
  return error && typeof error === 'object' && 'code' in error ? String(error.code) : 'SYNC_NETWORK_ERROR';
}
function errorKey(code:string):string {
  if(/UNAUTHENTICATED|CSRF|SESSION/.test(code)) return 'session';
  if(/CONFLICT|409/.test(code)) return 'conflict';
  if(/STORAGE/.test(code)) return 'storage';
  if(/NETWORK|TIMEOUT|UNAVAILABLE|DEPENDENCY|FAILED_FETCH/.test(code)) return 'unavailable';
  return 'invalid';
}

export function SynchronizationPage() {
  const {t} = useTranslation();
  const {account,status,refresh} = useIdentity();
  const {state,epoch} = useProject();
  return <section className="activity-page synchronization-page" aria-labelledby="sync-title" data-no-track="true">
    <header className="page-head"><div><p className="eyebrow">HCI LAB + IA</p><h1 id="sync-title">{t('sync.title')}</h1><p>{t('sync.intro')}</p></div></header>
    <p className="sync-policy">{t('sync.localPreserved')}</p>
    {!account ? <section aria-labelledby="sync-local-title"><h2 id="sync-local-title">{t('sync.localTitle')}</h2>
      <p role="status">{t(status === 'checking' ? 'sync.checking' : status === 'error' ? 'sync.accountUnavailable' : 'sync.visitor')}</p>
      <p>{t('identity.syncSignInHelp')}</p><Link className="secondary" to="/lab">{t('sync.localTitle')}</Link>
    </section> : !isActiveAccount(account) ? <section><p role="status">{t('sync.inactive')}</p><p>{t('identity.syncSignInHelp')}</p><Link className="secondary" to="/lab">{t('sync.localTitle')}</Link></section> :
      <AccountSynchronization key={`${account.id}:${epoch}`} accountId={account.id} project={state} refresh={refresh}/>
    }
  </section>;
}

function AccountSynchronization({accountId,project,refresh}:{accountId:string;project:ProjectState;refresh:ReturnType<typeof useIdentity>['refresh']}) {
  const {t,i18n} = useTranslation();
  const [remote] = useState(createServiceGateway);
  const [journal] = useState(createSyncJournal);
  const [workspaces,setWorkspaces] = useState<Workspace[]>([]);
  const [workspaceId,setWorkspaceId] = useState('');
  const [workspaceName,setWorkspaceName] = useState('');
  const [loaded,setLoaded] = useState(false);
  const [options,setOptions] = useState<SyncOptions>(initialOptions);
  const [uxConsent,setUxConsent] = useState(false);
  const [executionId,setExecutionId] = useState('');
  const [executions,setExecutions] = useState<Array<{id:string;label:string}>>([]);
  const [assignments,setAssignments] = useState<Array<{id:string;title:string;groupName:string;activityVersionId:string}>>([]);
  const [assignmentId,setAssignmentId] = useState('');
  const [preview,setPreview] = useState<Preview>();
  const [copyChanged,setCopyChanged] = useState(false);
  const [busy,setBusy] = useState<Busy>('');
  const [error,setError] = useState('');
  const [notice,setNotice] = useState('');
  const [progress,setProgress] = useState<SyncProgress>();
  const active = useRef<AbortController|null>(null);
  const mounted = useRef(true);
  const previewHeading = useRef<HTMLHeadingElement>(null);
  const verify = async () => {
    const account = await refresh();
    if(!account || !isActiveAccount(account) || account.id !== accountId) throw new SyncFailure('UNAUTHENTICATED');
    return account.id;
  };
  useEffect(() => {mounted.current=true; return () => {mounted.current=false;active.current?.abort();};}, []);
  useEffect(() => {if(preview) previewHeading.current?.focus();}, [preview]);
  const run = async (kind:Busy, action:(signal:AbortSignal)=>Promise<void>) => {
    if(active.current) return;
    const controller = new AbortController();
    active.current=controller;setBusy(kind);setError('');setNotice('');
    try {await action(controller.signal);}
    catch(failure) {
      if(mounted.current) {
        if(controller.signal.aborted) setNotice('cancelled');
        else setError(codeOf(failure));
      }
    } finally {if(active.current===controller) {active.current=null;if(mounted.current) setBusy('');}}
  };
  const check = async (signal:AbortSignal) => {await verify();if(signal.aborted || !mounted.current) throw new SyncFailure('SYNC_CANCELLED');};
  const resetPreview = () => {setPreview(undefined);setProgress(undefined);setCopyChanged(false);};
  const loadWorkspaces = () => run('load', async signal => {
    await check(signal);
    const items = await remote.listWorkspaces(signal);
    if(signal.aborted || !mounted.current) return;
    setWorkspaces(items);setLoaded(true);setNotice('workspacesLoaded');
    if(!items.some(item=>item.id===workspaceId)){setWorkspaceId('');resetPreview();}
  });
  const createWorkspace = () => run('create', async signal => {
    const name=workspaceName.trim();
    if(!name) throw new SyncFailure('SYNC_INVALID_DATA');
    await check(signal);
    // Persist the request key before POST so a retry after a lost response is safe.
    const manifest=journal.read(accountId,'workspace-creation');
    const fingerprint=await journal.digest({name});
    const itemKey='workspace:'+fingerprint;
    let saved=manifest.items[itemKey];
    if(!saved){saved={fingerprint,steps:{create:{key:await journal.operationKey({accountId,action:'workspace.create',name}),input:{name}}}};manifest.items[itemKey]=saved;}
    journal.save(manifest);
    const prior=saved.steps.create;
    const item=prior.output && typeof prior.output.id==='string' && typeof prior.output.name==='string'
      ? {id:prior.output.id,name:prior.output.name}
      : await remote.createWorkspace(name,prior.key,signal);
    if(signal.aborted || !mounted.current) return;
    prior.output=item;journal.save(manifest);
    setWorkspaces(items=>[...items.filter(value=>value.id!==item.id),item]);setWorkspaceId(item.id);setWorkspaceName('');setLoaded(true);resetPreview();setNotice('workspaceCreated');
  });
  const optionsForPlan = ():SyncOptions => {
    const assignment=assignments.find(item=>item.id===assignmentId);
    return {...options,...(uxConsent && executionId ? {ux:{executionId,noticeVersion:consentNoticeVersion}} : {}),...(assignment ? {assignment:{id:assignment.id,activityVersionId:assignment.activityVersionId}} : {})};
  };
  const prepare = () => run('preview', async signal => {
    if(!workspaceId) throw new SyncFailure('SYNC_INVALID_DATA');
    if(uxConsent && !executionId) throw new SyncFailure('SYNC_EXECUTION_REQUIRED');
    const snapshot=structuredClone(project),source=project,id=workspaceId,selectedOptions=optionsForPlan();
    await check(signal);
    const [catalogs,items] = await Promise.all([remote.loadCatalogs(i18n.language,signal),remote.listExecutions(id,signal)]);
    if(signal.aborted || !mounted.current) return;
    setExecutions(items);
    if(selectedOptions.ux && !items.some(item=>item.id===selectedOptions.ux?.executionId)) throw new SyncFailure('SYNC_EXECUTION_REQUIRED');
    const plan=buildSyncPlan(snapshot,catalogs,selectedOptions);
    if(selectedOptions.assignment && !plan.items.some(item=>item.steps.some(step=>step.action==='execution.start'&&step.data.assignmentId===selectedOptions.assignment?.id))) throw new SyncFailure('SYNC_ASSIGNMENT_ACTIVITY_UNAVAILABLE');
    setPreview({source,catalogs,workspaceId:id,plan});setProgress(undefined);setCopyChanged(false);
  });
  const loadAssignments = () => run('load', async signal => {
    await check(signal);
    const items=await remote.listAssignments?.(signal) ?? [];
    if(signal.aborted || !mounted.current) return;
    setAssignments(items);
    if(!items.some(item=>item.id===assignmentId)) setAssignmentId('');
    setNotice('assignmentsLoaded');
  });
  const loadExecutions = () => run('load', async signal => {
    if(!workspaceId) throw new SyncFailure('SYNC_INVALID_DATA');
    await check(signal);
    const items=await remote.listExecutions(workspaceId,signal);
    if(signal.aborted || !mounted.current) return;
    setExecutions(items);setNotice('executionsLoaded');
  });
  const send = () => run('send', async signal => {
    if(!preview || preview.source!==project || preview.workspaceId!==workspaceId || !preview.plan.items.length) throw new SyncFailure('SYNC_INVALID_DATA');
    const snapshot=structuredClone(project);
    const plan=buildSyncPlan(snapshot,preview.catalogs,optionsForPlan());
    const engine=createSynchronization(remote,journal,async()=>{try{return await verify();}catch{return null;}});
    const result=await engine.run({accountId,workspaceId,plan,copyChanged,signal,onProgress:value=>{if(mounted.current)setProgress(value);}});
    if(!mounted.current) return;
    setProgress(result);
  });
  const selected=options.learning||options.reservations||options.accessibility||options.report||uxConsent;
  const locale=assignmentSyncCopy[i18n.language as keyof typeof assignmentSyncCopy] ?? assignmentSyncCopy['en-US'];
  const stale=preview && (preview.source!==project || preview.workspaceId!==workspaceId);
  const progressFailure=progress?.state==='error'||progress?.state==='conflict';
  const shownError=error||(progressFailure?progress?.code:'');
  const changeCategory = (key:keyof Omit<SyncOptions,'ux'>,value:boolean) => {setOptions(current=>({...current,[key]:value}));resetPreview();};

  return <div className="sync-content" aria-busy={!!busy}>
    <ExpandableCard className="sync-card" id="sync-workspaces" title={t('sync.workspaceTitle')}>
      <p>{t('sync.workspaceHelp')}</p>
      <button className="secondary" type="button" disabled={!!busy} onClick={()=>void loadWorkspaces()}>{t('sync.loadWorkspaces')}</button>
      {loaded && !workspaces.length && <p>{t('sync.noWorkspaces')}</p>}
      <div className="sync-field"><label htmlFor="sync-workspace">{t('sync.workspace')}</label><select id="sync-workspace" value={workspaceId} disabled={!!busy} onChange={event=>{setWorkspaceId(event.target.value);setExecutions([]);setExecutionId('');resetPreview();}}><option value="">{t('sync.chooseWorkspace')}</option>{workspaces.map(item=><option key={item.id} value={item.id}>{item.name}</option>)}</select></div>
      <form className="sync-workspace-create" onSubmit={event=>{event.preventDefault();void createWorkspace();}}><div className="sync-field"><label htmlFor="sync-workspace-name">{t('sync.newWorkspace')}</label><input id="sync-workspace-name" maxLength={120} required value={workspaceName} disabled={!!busy} onChange={event=>setWorkspaceName(event.target.value)}/></div><button className="secondary" disabled={!!busy||!workspaceName.trim()}>{t('sync.createWorkspace')}</button></form>
    </ExpandableCard>
    <ExpandableCard className="sync-card" id="sync-selection" title={t('sync.selectionTitle')}><p>{t('sync.selectionHelp')}</p>
      <div className="sync-field"><button className="secondary" type="button" disabled={!!busy} onClick={()=>void loadAssignments()}>{locale.load}</button><label htmlFor="sync-assignment">{locale.label}</label><select id="sync-assignment" value={assignmentId} disabled={!!busy} onChange={event=>{setAssignmentId(event.target.value);resetPreview();}}><option value="">{locale.none}</option>{assignments.map(item=><option key={item.id} value={item.id}>{item.groupName} · {item.title}</option>)}</select><small>{locale.help}</small></div>
      <fieldset disabled={!!busy} className="sync-options"><legend>{t('sync.categories')}</legend>{(['learning','reservations','accessibility','report'] as const).map(key=><label key={key}><input type="checkbox" checked={options[key]} onChange={event=>changeCategory(key,event.target.checked)}/><span>{t(`sync.category.${key}`)}</span></label>)}</fieldset>
      <fieldset disabled={!!busy} className="sync-options"><legend>{t('sync.uxTitle')}</legend><label><input type="checkbox" checked={uxConsent} onChange={event=>{setUxConsent(event.target.checked);resetPreview();}}/><span>{t('sync.uxConsent')}</span></label><p id="sync-ux-notice">{t('sync.uxHelp')}</p><p className="sync-notice-version">{t('sync.noticeVersion',{version:consentNoticeVersion})}</p>
        {uxConsent && <><button className="secondary" type="button" disabled={!workspaceId} onClick={()=>void loadExecutions()}>{t('sync.loadExecutions')}</button><div className="sync-field"><label htmlFor="sync-execution">{t('sync.execution')}</label><select id="sync-execution" value={executionId} aria-describedby="sync-ux-notice" onChange={event=>{setExecutionId(event.target.value);resetPreview();}}><option value="">{t('sync.chooseExecution')}</option>{executions.map(item=><option key={item.id} value={item.id}>{item.label}</option>)}</select></div>{!executions.length&&<p>{t('sync.noExecutions')}</p>}</>}
      </fieldset>
      <button className="secondary" type="button" disabled={!!busy||!workspaceId||!selected||uxConsent&&!executionId} onClick={()=>void prepare()}>{t('sync.preview')}</button>
    </ExpandableCard>
    {preview && <section className="sync-card" aria-labelledby="sync-preview-title"><h2 id="sync-preview-title" ref={previewHeading} tabIndex={-1}>{t('sync.previewTitle')}</h2><p>{t('sync.previewCount',{count:preview.plan.items.length})}</p>
      {preview.plan.items.length ? <ul className="sync-records">{preview.plan.items.map(item=><li key={item.key}>{item.key.startsWith('a11yChecks:') ? t(`sync.check.${item.label}`,{defaultValue:t('sync.unnamed')}) : item.label||t('sync.unnamed')}</li>)}</ul> : <p>{t('sync.emptyPlan')}</p>}
      {!!preview.plan.excluded.length && <details><summary>{t('sync.excludedCount',{count:preview.plan.excluded.length})}</summary><ul className="sync-records">{preview.plan.excluded.map((item,index)=><li key={`${item.key}:${index}`}>{t(`sync.source.${item.key.split(':')[0]}`,{defaultValue:t('sync.unnamed')})}: {t(`sync.excluded.${item.reason}`,{defaultValue:t('sync.excluded.UNSUPPORTED_RECORD')})}</li>)}</ul></details>}
      {stale && <p role="status">{t('sync.previewStale')}</p>}
      {progress?.state==='conflict' && <div><p>{t('sync.copyHelp')}</p>{!!progress.conflicts?.length && <ul>{progress.conflicts.map((label,index)=><li key={index}>{label}</li>)}</ul>}<label className="sync-checkbox"><input type="checkbox" checked={copyChanged} disabled={!!busy} onChange={event=>setCopyChanged(event.target.checked)}/><span>{t('sync.copyChanged')}</span></label></div>}
      <button className="primary" type="button" disabled={!!busy||!preview.plan.items.length||!!stale} onClick={()=>void send()}>{t(progress?.state==='error'||progress?.state==='cancelled'||progress?.state==='conflict'?'sync.retry':'sync.send')}</button>
    </section>}
    {(busy || progress || notice) && <div className="sync-status" role="status" aria-live="polite" aria-atomic="true">{busy && busy!=='send' ? t(`sync.busy.${busy}`) : progress ? <><p>{t(`sync.progress.${progress.state}`,{completed:progress.completed,total:progress.total})}</p>{progress.current&&<p>{progress.current}</p>}</> : t(`sync.${notice}`)}</div>}
    {busy && <button className="secondary" type="button" onClick={()=>active.current?.abort()}>{t('sync.cancel')}</button>}
    {shownError && <div className="sync-error" role="alert"><p>{shownError==='SYNC_ASSIGNMENT_ACTIVITY_UNAVAILABLE'?locale.mismatch:t(`sync.error.${errorKey(shownError)}`)}</p>{progress?.requestId && <p>{t('sync.requestId',{id:progress.requestId})}</p>}<p>{t('sync.retryHelp')}</p></div>}
  </div>;
}
