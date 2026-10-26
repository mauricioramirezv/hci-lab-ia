import {ExpandableCard} from '../../../shared/ui/ExpandableCard';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CalendarDays, RefreshCw } from 'lucide-react';
import { PageHead, StatusPill } from '../../../shared/ui/Page';
import { useIdentity, isActiveAccount } from '../../identity';
import { AccountGate, Feedback } from '../../community/presentation/shared';
import { progressClient } from '../infrastructure/client';
import type { LearningExecution, Delivery } from '../domain/progress';
import { AssignmentComposer } from './AssignmentComposer';
import { DeliveryReview, DeliverySubmission } from './DeliveryActions';
import './progress.css';

function latest(items: Delivery[]) { return [...items].sort((a, b) => b.version - a.version)[0]; }
function date(value: string | null | undefined, locale: string) {
  if (!value) return '—';
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? '—' : new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(parsed);
}
function isEvaluated(deliveries: Delivery[]) {
  return deliveries.some(delivery => (delivery.evaluations?.length ?? 0) > 0);
}
function ExecutionStatus({ execution, deliveries }: { execution: LearningExecution; deliveries: Delivery[] }) {
  const { t } = useTranslation();
  const delivery = latest(deliveries);
  const completed = execution.state === 'completed';
  const evaluated = isEvaluated(deliveries);
  return <div className="learning-statuses">
    <StatusPill tone={completed ? 'good' : 'neutral'}>{completed ? t('learning.activityCompleted') : t('learning.activityInProgress')}</StatusPill>
    {delivery && <StatusPill tone={delivery.state === 'accepted' ? 'good' : 'neutral'}>{t('learning.deliveryState', { state: t('learning.state.' + delivery.state, { defaultValue: delivery.state }) })}</StatusPill>}
    <StatusPill tone={evaluated ? 'ai' : 'neutral'}>{evaluated ? t('learning.assessed') : t('learning.notAssessed')}</StatusPill>
  </div>;
}

export function ProgressPage() {
  const { t, i18n } = useTranslation();
  const identity = useIdentity();
  const account = identity.account && isActiveAccount(identity.account) ? identity.account : null;
  const accountId = account?.id;
  const [data, setData] = useState<Awaited<ReturnType<typeof progressClient.load>> | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    if (!accountId) return;
    let alive = true;
    setBusy(true); setError(null);
    progressClient.load(i18n.language).then(value => { if (alive) setData(value); })
      .catch(reason => { if (alive) setError(reason); })
      .finally(() => { if (alive) setBusy(false); });
    return () => { alive = false; };
  }, [accountId, retry, i18n.language]);
  const completedCount = useMemo(() => data?.executions.filter(item => item.state === 'completed').length ?? 0, [data]);
  const assessedCount = useMemo(() => data?.ownDeliveries.filter(item => isEvaluated(item.items)).length ?? 0, [data]);
  if (identity.status === 'checking') return <section className="page-content"><PageHead eyebrow={t('learning.eyebrow')} title={t('learning.title')} intro={t('learning.intro')}/><p role="status">{t('learning.loading')}</p></section>;
  if (identity.status === 'error') return <section className="page-content"><PageHead eyebrow={t('learning.eyebrow')} title={t('learning.title')} intro={t('learning.intro')}/><p role="alert">{t('learning.unavailable')}</p></section>;
  if (!account) return <section className="page-content"><PageHead eyebrow={t('learning.eyebrow')} title={t('learning.title')} intro={t('learning.intro')}/><AccountGate account={identity.account} status={identity.status}/></section>;
  return <section className="page-content">
    <PageHead eyebrow={t('learning.eyebrow')} title={t('learning.title')} intro={t('learning.intro')} actions={<button className="secondary" type="button" onClick={() => setRetry(value => value + 1)} disabled={busy}><RefreshCw aria-hidden="true"/>{t('learning.refresh')}</button>}/>
    <Feedback busy={busy} error={error} notice=""/>
    {Boolean(error) && <button className="secondary" type="button" onClick={() => setRetry(value => value + 1)} disabled={busy}>{t('learning.tryAgain')}</button>}
    {data && <>
      <div className="learning-summary" aria-label={t('learning.summary')}>
        <article><strong>{data.executions.length}</strong><span>{t('learning.activities')}</span></article>
        <article><strong>{completedCount}</strong><span>{t('learning.completedActivities')}</span></article>
        <article><strong>{assessedCount}</strong><span>{t('learning.assessedActivities')}</span></article>
        <article><strong>{data.groups.length}</strong><span>{t('learning.groups')}</span></article>
      </div>
      <ExpandableCard className="learning-panel" id="learning-own" title={t('learning.myWork')}>
        {!data.executions.length ? <p>{t('learning.noActivities')}</p> : <ul className="learning-list">
          {data.ownDeliveries.map(({ execution, items }) => <li key={execution.id}>
            <div><strong>{data.activities.find(activity => activity.activity_version_id === (execution.activity_version_id ?? execution.activityVersionId))?.title ?? t('learning.activityVersion', { version: execution.activity_version_id ?? execution.activityVersionId ?? execution.id })}</strong><span>{t('learning.started', { date: date(execution.started_at, i18n.language) })}</span></div>
            <ExecutionStatus execution={execution} deliveries={items}/>
            {items[0]?.feedback?.length ? <details><summary>{t('learning.feedback', { count: items[0].feedback.length })}</summary><ul>{items[0].feedback.map(note => <li key={note.id}>{note.message}</li>)}</ul></details> : null}
            <DeliverySubmission execution={execution} latestDelivery={latest(items)} onComplete={() => setRetry(value => value + 1)}/>
          </li>)}
        </ul>}
      </ExpandableCard>
      <ExpandableCard className="learning-panel" id="learning-assignments" title={t('learning.assignments')}>
        {!data.assignments.some(item => item.items.length) ? <p>{t('learning.noAssignments')}</p> : data.assignments.map(({ group, items }) => items.length > 0 && <div className="learning-group" key={group.id}>
          <h3>{group.name}</h3><ul className="learning-list">{items.map(assignment => <li key={assignment.id}>
            <div><strong>{assignment.title}</strong><span>{assignment.instructions}</span></div>
            <StatusPill tone={assignment.state === 'published' ? 'good' : 'neutral'}>{t('learning.state.' + assignment.state, { defaultValue: assignment.state })}</StatusPill>
            {assignment.due_at && <span className="learning-meta"><CalendarDays aria-hidden="true"/>{t('learning.due', { date: date(assignment.due_at, i18n.language) })}</span>}
          </li>)}</ul>
        </div>)}
      </ExpandableCard>
      {data.leaderDeliveries.length > 0 && <ExpandableCard className="learning-panel" id="learning-team" title={t('learning.teamProgress')}>
        {data.leaderDeliveries.map(({ group, items }) => <div className="learning-group" key={group.id}>
          <h3>{group.name}</h3>
          <AssignmentComposer groupId={group.id} activities={data.activities} onCreated={() => setRetry(value => value + 1)}/>
          {!items.length ? <p>{t('learning.noDeliveries')}</p> : <ul className="learning-list">{items.map(delivery => <li key={delivery.id}>
            <div><strong>{t('learning.deliveryVersion', { version: delivery.version })}</strong><span>{t('learning.participantRef', { id: (delivery.participant_id ?? '').slice(0, 8) || '—' })}</span><span>{t('learning.submitted', { date: date(delivery.submitted_at, i18n.language) })}</span></div>
            <div className="learning-statuses"><StatusPill tone={delivery.state === 'accepted' ? 'good' : 'neutral'}>{t('learning.state.' + delivery.state, { defaultValue: delivery.state })}</StatusPill><StatusPill tone={(delivery.evaluations?.length ?? 0) > 0 ? 'ai' : 'neutral'}>{t((delivery.evaluations?.length ?? 0) > 0 ? 'learning.assessed' : 'learning.notAssessed')}</StatusPill></div>
            {delivery.feedback?.length ? <details><summary>{t('learning.feedback', { count: delivery.feedback.length })}</summary><ul>{delivery.feedback.map(note => <li key={note.id}>{note.message}</li>)}</ul></details> : null}
            <DeliveryReview delivery={delivery} onComplete={() => setRetry(value => value + 1)}/>
          </li>)}</ul>}
        </div>)}
      </ExpandableCard>}
      <p className="learning-note">{t('learning.localLabNote')} <Link to="/sync">{t('learning.syncLink')}</Link></p>
    </>}
  </section>;
}
