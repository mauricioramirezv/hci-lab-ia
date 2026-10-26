import {ExpandableCard} from '../../../shared/ui/ExpandableCard';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FileDown, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PageHead, StatusPill } from '../../../shared/ui/Page';
import { useIdentity, isActiveAccount } from '../../identity';
import { AccountGate, Feedback } from '../../community/presentation/shared';
import { reportClient } from '../infrastructure/client';
import type { ReportDefinitionInput, ReportExecution, ReportWorkspace } from '../infrastructure/client';
import type { RemoteReport, ReportFormat } from '../domain/report';
import { remoteReportErrorKind, remoteReportRequestId } from './errors';
import './remote-reports.css';

export function RemoteReportsPage() {
  const { t } = useTranslation();
  const identity = useIdentity();
  const account = identity.account && isActiveAccount(identity.account) ? identity.account : null;
  const accountId = account?.id;
  const [workspaces, setWorkspaces] = useState<ReportWorkspace[]>([]);
  const [executions, setExecutions] = useState<ReportExecution[]>([]);
  const [reports, setReports] = useState<RemoteReport[]>([]);
  const [workspaceId, setWorkspaceId] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [projectName, setProjectName] = useState('');
  const [objective, setObjective] = useState('');
  const [method, setMethod] = useState('');
  const [format, setFormat] = useState<ReportFormat>('json');
  const [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [notice, setNotice] = useState('');
  const createKey = useRef('');
  const executionsInWorkspace = useMemo(() => executions.filter(item => (item.workspace_id ?? '') === workspaceId), [executions, workspaceId]);
  const reload = useCallback(async (activeWorkspace: string) => {
    if (!accountId) return;
    setBusy(true); setError(null);
    try {
      const [workspaceList, executionList] = await Promise.all([reportClient.workspaces(), reportClient.executions()]);
      setWorkspaces(workspaceList); setExecutions(executionList);
      const nextWorkspace = activeWorkspace || workspaceList[0]?.id || '';
      setWorkspaceId(nextWorkspace);
      setReports(nextWorkspace ? await reportClient.list(nextWorkspace) : []);
      setLoaded(true);
    } catch (failure) { setError(failure); setLoaded(true); }
    finally { setBusy(false); }
  }, [accountId]);
  useEffect(() => { void reload(''); }, [reload]);
  const changeWorkspace = (value: string) => {
    setWorkspaceId(value); setSelected([]); setError(null); setNotice('');
    if (!value) { setReports([]); return; }
    setBusy(true); reportClient.list(value).then(setReports).catch(setError).finally(() => setBusy(false));
  };
  const toggleExecution = (id: string) => setSelected(value => value.includes(id) ? value.filter(item => item !== id) : [...value, id]);
  const saveAndGenerate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); if (!workspaceId || !selected.length || busy) return;
    setBusy(true); setError(null); setNotice('');
    if (!createKey.current) createKey.current = crypto.randomUUID();
    try {
      const input: ReportDefinitionInput = {
        workspaceId, projectName: projectName.trim() || undefined, objective: objective.trim() || undefined,
        method: method.trim() || undefined, format, includeComparison: false,
        records: selected.map(id => ({ id, source: 'execution', section: 'selected' })),
      };
      const created = await reportClient.create(input, createKey.current);
      createKey.current = '';
      setNotice('saved');
      try { await reportClient.generate(created.id, crypto.randomUUID()); setNotice('generated'); }
      catch (failure) { setError(failure); setNotice('savedRetry'); }
      const next = await reportClient.list(workspaceId); setReports(next);
      setSelected([]);
    } catch (failure) { setError(failure); }
    finally { setBusy(false); }
  };
  const generateAgain = async (id: string) => {
    setBusy(true); setError(null); setNotice('');
    try { await reportClient.generate(id, crypto.randomUUID()); setNotice('generated'); setReports(await reportClient.list(workspaceId)); }
    catch (failure) { setError(failure); }
    finally { setBusy(false); }
  };
  const download = async (id: string, kind: ReportFormat) => {
    setBusy(true); setError(null);
    try {
      const { blob, filename } = await reportClient.download(id, kind);
      const href = URL.createObjectURL(blob); const anchor = document.createElement('a');
      anchor.href = href; anchor.download = filename; anchor.click(); URL.revokeObjectURL(href);
    } catch (failure) { setError(failure); }
    finally { setBusy(false); }
  };
  if (identity.status === 'checking' || !account) return <section className="page-content"><PageHead eyebrow={t('remoteReports.eyebrow')} title={t('remoteReports.title')} intro={t('remoteReports.intro')}/><AccountGate account={identity.account} status={identity.status}/></section>;
  return <section className="page-content remote-reports">
    <PageHead eyebrow={t('remoteReports.eyebrow')} title={t('remoteReports.title')} intro={t('remoteReports.intro')} actions={<button type="button" className="secondary" onClick={() => void reload(workspaceId)} disabled={busy}><RefreshCw aria-hidden="true"/>{t('remoteReports.refresh')}</button>}/>
    <Feedback busy={busy && !loaded} error={null} notice=""/>
    {notice && <p role="status" aria-live="polite">{t('remoteReports.' + notice)}</p>}
    {Boolean(error) && <div className="remote-report-error" role="alert"><p>{t(`remoteReports.errors.${remoteReportErrorKind(error)}`)}</p>{remoteReportRequestId(error) && <p>{t('remoteReports.requestId', { id: remoteReportRequestId(error) })}</p>}</div>}
    {!workspaces.length && loaded && <p className="remote-report-empty">{t('remoteReports.noWorkspace')}</p>}
    {!!workspaces.length && <>
      <ExpandableCard className="remote-report-panel" id="remote-report-create" title={t('remoteReports.create')}>
        <p>{t('remoteReports.createHelp')}</p>
        <form onSubmit={saveAndGenerate}>
          <label htmlFor="report-workspace">{t('remoteReports.workspace')}</label>
          <select id="report-workspace" value={workspaceId} onChange={event => changeWorkspace(event.target.value)} required>
            {workspaces.map(workspace => <option key={workspace.id} value={workspace.id}>{workspace.name ?? workspace.nombre ?? workspace.id}</option>)}
          </select>
          <label htmlFor="report-project-name">{t('remoteReports.projectName')}</label>
          <input id="report-project-name" value={projectName} onChange={event => setProjectName(event.target.value)} maxLength={200}/>
          <label htmlFor="report-objective">{t('remoteReports.objective')}</label>
          <textarea id="report-objective" value={objective} onChange={event => setObjective(event.target.value)} maxLength={5000} rows={3}/>
          <fieldset className="remote-report-records"><legend>{t('remoteReports.records')}</legend>
            {executionsInWorkspace.length ? executionsInWorkspace.map(execution => <label className="remote-report-record" key={execution.id}>
              <input type="checkbox" checked={selected.includes(execution.id)} onChange={() => toggleExecution(execution.id)}/>
              <span>{t('remoteReports.execution', { date: execution.started_at ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(execution.started_at)) : '—' })}</span>
              <StatusPill tone={execution.state === 'completed' ? 'good' : 'neutral'}>{t('remoteReports.state.' + execution.state, { defaultValue: execution.state })}</StatusPill>
            </label>) : <p>{t('remoteReports.noExecutions')}</p>}
          </fieldset>
          <details className="remote-report-advanced"><summary>{t('remoteReports.advanced')}</summary>
            <label htmlFor="report-method">{t('remoteReports.method')}</label>
            <textarea id="report-method" value={method} onChange={event => setMethod(event.target.value)} maxLength={5000} rows={2}/>
          </details>
          <label htmlFor="report-format">{t('remoteReports.format')}</label>
          <select id="report-format" value={format} onChange={event => setFormat(event.target.value as ReportFormat)}><option value="json">JSON</option><option value="markdown">Markdown</option><option value="csv">CSV</option></select>
          <p className="remote-report-note">{t('remoteReports.versionNote')}</p>
          <button className="primary" type="submit" disabled={busy || !workspaceId || !selected.length}>{busy ? t('remoteReports.saving') : t('remoteReports.saveGenerate')}</button>
        </form>
      </ExpandableCard>
      <ExpandableCard className="remote-report-panel" id="remote-report-history" title={t('remoteReports.history')}>
        <label htmlFor="report-history-workspace">{t('remoteReports.workspace')}</label>
        <select id="report-history-workspace" value={workspaceId} onChange={event => changeWorkspace(event.target.value)}>{workspaces.map(workspace => <option key={workspace.id} value={workspace.id}>{workspace.name ?? workspace.nombre ?? workspace.id}</option>)}</select>
        {!reports.length ? <p>{t('remoteReports.noReports')}</p> : <ul className="remote-report-list">{reports.map(report => <li key={report.id}>
          <div className="remote-report-heading"><div><strong>{report.projectName || t('remoteReports.untitled')}</strong><span>{t('remoteReports.recordCount', { count: report.records?.length ?? report.snapshot?.records.length ?? 0 })}</span></div><StatusPill tone={report.status === 'ready' ? 'good' : report.status === 'failed' ? 'bad' : 'neutral'}>{t('remoteReports.status.' + report.status, { defaultValue: report.status })}</StatusPill></div>
          {report.lastError && <p role="alert">{t('remoteReports.generationFailed')} {t(`remoteReports.errors.${remoteReportErrorKind(report.lastError)}`)} {t('remoteReports.generationRetry')}</p>}
          {!!report.missingSources?.length && <p>{t('remoteReports.missingSources', { sources: report.missingSources.join(', ') })}</p>}
          {report.snapshot && <details><summary>{t('remoteReports.snapshot', { version: report.snapshotVersion })}</summary><ul>{report.snapshot.records.map(record => <li key={record.source + record.id}>{t('remoteReports.snapshotRecord', { source: record.source, version: record.version, activity: record.activityVersion ?? '—', instrument: record.instrumentVersion ?? '—', formula: record.formulaVersion ?? '—' })}</li>)}</ul>{report.snapshot.missingRecords.map(record => <p key={record.source + record.id}>{t('remoteReports.missingRecord', { source: record.source, id: record.id })}</p>)}</details>}
          <div className="remote-report-actions">
            {(report.status === 'pending' || report.status === 'partial' || report.status === 'failed') && <button type="button" className="secondary" onClick={() => void generateAgain(report.id)} disabled={busy}>{t(report.status === 'pending' ? 'remoteReports.refreshStatus' : 'remoteReports.retry')}</button>}
            {report.status === 'ready' && <><button type="button" className="secondary" onClick={() => void download(report.id, 'json')} disabled={busy}><FileDown aria-hidden="true"/>{t('remoteReports.downloadJson')}</button><button type="button" className="secondary" onClick={() => void download(report.id, 'markdown')} disabled={busy}>{t('remoteReports.downloadMarkdown')}</button><button type="button" className="secondary" onClick={() => void download(report.id, 'csv')} disabled={busy}>{t('remoteReports.downloadCsv')}</button></>}
          </div>
        </li>)}</ul>}
      </ExpandableCard>
    </>}
  </section>;
}
