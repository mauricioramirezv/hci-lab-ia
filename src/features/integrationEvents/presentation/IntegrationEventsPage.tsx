import {ExpandableCard} from '../../../shared/ui/ExpandableCard';
import { useCallback, useEffect, useState } from 'react';
import { RefreshCw, RotateCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PageHead, StatusPill } from '../../../shared/ui/Page';
import { AccountGate } from '../../community/presentation/shared';
import { canManageAccounts, isActiveAccount, useIdentity } from '../../identity';
import { identityClient } from '../../identity/infrastructure/client';
import type { IntegrationEvent } from '../../identity/infrastructure/client';
import './integration-events.css';

const services: IntegrationEvent['service'][] = ['identidad','aprendizaje','comunidad','evidencias'];
function date(value: string | null | undefined, locale: string) {
  if (!value) return '—';
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? '—' : new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(parsed);
}

export function IntegrationEventsPage() {
  const { t, i18n } = useTranslation();
  const identity = useIdentity();
  const account = identity.account && isActiveAccount(identity.account) ? identity.account : null;
  const allowed = canManageAccounts(account);
  const canRetry = allowed && !!account?.permissions?.includes('role:assign');
  const [items, setItems] = useState<IntegrationEvent[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const [notice, setNotice] = useState('');
  const load = useCallback(async (preserveNotice = false) => {
    if (!allowed) return;
    setBusy(true); setError(false); if (!preserveNotice) setNotice('');
    try { setItems((await identityClient.integrationEvents()).items); }
    catch { setError(true); }
    finally { setBusy(false); }
  }, [allowed]);
  useEffect(() => { void load(); }, [load]);
  const retry = async (service: IntegrationEvent['service'], eventId: string, target: IntegrationEvent['service']) => {
    setBusy(true); setError(false); setNotice('');
    try {
      const result = await identityClient.retryIntegrationEvent({ service, eventId, target });
      setNotice(result.requeued ? 'retryQueued' : 'retryUnchanged');
      await load(true);
    } catch { setError(true); setNotice('retryFailed'); }
    finally { setBusy(false); }
  };
  const title = (service: IntegrationEvent['service']) => t(`integrationEvents.service.${service}`);
  if (identity.status === 'checking') return <section className="page-content"><PageHead eyebrow="HCI LAB + IA" title={t('integrationEvents.title')} intro={t('integrationEvents.intro')}/><p role="status">{t('integrationEvents.loading')}</p></section>;
  if (!account) return <section className="page-content"><PageHead eyebrow="HCI LAB + IA" title={t('integrationEvents.title')} intro={t('integrationEvents.intro')}/><AccountGate account={identity.account} status={identity.status}/></section>;
  if (!allowed) return <section className="page-content"><PageHead eyebrow="HCI LAB + IA" title={t('integrationEvents.title')} intro={t('integrationEvents.intro')}/><p className="integration-alert" role="status">{t('integrationEvents.forbidden')}</p></section>;
  const dead = items.flatMap(item => (item.deadLetters ?? []).map(event => ({ service: item.service, ...event })));
  return <section className="page-content integration-events">
    <PageHead eyebrow="HCI LAB + IA · ADMINISTRACIÓN" title={t('integrationEvents.title')} intro={t('integrationEvents.intro')} actions={<button type="button" className="secondary" onClick={() => void load()} disabled={busy}><RefreshCw aria-hidden="true"/>{t('integrationEvents.refresh')}</button>}/>
    {busy && <p role="status" aria-live="polite">{t('integrationEvents.loading')}</p>}
    {notice && <p className="integration-status" role="status" aria-live="polite" aria-atomic="true">{t(`integrationEvents.${notice}`)}</p>}
    {error && <p className="integration-alert" role="alert">{t('integrationEvents.requestFailed')}</p>}
    {!items.length && !busy && !error && <p>{t('integrationEvents.empty')}</p>}
    <div className="integration-grid">
      {services.map(service => {
        const item = items.find(value => value.service === service);
        return <ExpandableCard className="integration-card" id={`integration-${service}`} title={title(service)} key={service}>
          <header><StatusPill tone={item?.state === 'available' ? 'good' : 'bad'}>{t(item?.state === 'available' ? 'integrationEvents.available' : 'integrationEvents.unavailable')}</StatusPill></header>
          {item?.state === 'available' ? <>
            <section aria-labelledby={`inbox-${service}`}><h3 id={`inbox-${service}`}>{t('integrationEvents.inbox')}</h3><dl><div><dt>{t('integrationEvents.received')}</dt><dd>{item.inbox?.received ?? 0}</dd></div><div><dt>{t('integrationEvents.processed')}</dt><dd>{item.inbox?.processed ?? 0}</dd></div><div><dt>{t('integrationEvents.pending')}</dt><dd>{item.inbox?.pending ?? 0}</dd></div></dl><p>{t('integrationEvents.lastReceived')}: {item.inbox?.lastReceivedAt ? date(item.inbox.lastReceivedAt, i18n.language) : t('integrationEvents.lastNever')}</p></section>
            <section aria-labelledby={`outbox-${service}`}><h3 id={`outbox-${service}`}>{t('integrationEvents.outbox')}</h3>{item.outbox?.length ? <ul>{item.outbox.map((row, index) => <li key={`${row.target}-${row.status}-${index}`}><span>{title(row.target as IntegrationEvent['service'])}</span><StatusPill tone={row.status === 'deadletter' ? 'bad' : row.status === 'delivered' ? 'good' : 'neutral'}>{t(`integrationEvents.statusLabel.${row.status}`, { defaultValue: row.status })}</StatusPill><strong>{row.count}</strong></li>)}</ul> : <p>0</p>}</section>
          </> : <p>{t('integrationEvents.unavailable')}</p>}
        </ExpandableCard>;
      })}
    </div>
    <ExpandableCard className="integration-card" id="integration-dead" title={t('integrationEvents.deadLetters')}>
      {!dead.length ? <p>{t('integrationEvents.noDeadLetters')}</p> : <>{!canRetry && <p>{t('integrationEvents.retryPermission')}</p>}<ul className="integration-dead-list">{dead.map(event => <li key={`${event.service}-${event.eventId}-${event.target}`}>
        <div><strong>{event.eventType}</strong><span>{title(event.service)} → {title(event.target)}</span><span>{t('integrationEvents.occurred')}: {date(event.occurredAt, i18n.language)}</span><span>{t('integrationEvents.attempts')}: {event.attempts}</span>{event.lastError && <code>{event.lastError}</code>}</div>
        {canRetry && <button type="button" className="secondary" disabled={busy || items.find(item => item.service === event.service)?.state !== 'available'} onClick={() => void retry(event.service, event.eventId, event.target)}><RotateCw aria-hidden="true"/>{t('integrationEvents.retry')}</button>}
      </li>)}</ul></>}
    </ExpandableCard>
  </section>;
}
