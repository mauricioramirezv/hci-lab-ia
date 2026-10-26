import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Delivery, LearningExecution } from '../domain/progress';
import { progressClient } from '../infrastructure/client';
import { deliveryCopy } from './delivery-copy';

type DeliveryLocale = (typeof deliveryCopy)[keyof typeof deliveryCopy];
function messageFor(error: unknown, copy: DeliveryLocale) {
  const code = error && typeof error === 'object' && 'code' in error ? String(error.code) : '';
  if (/VERSION|STATE|CONFLICT/.test(code)) return copy.conflict;
  if (/UNAUTHENTICATED|CSRF|FORBIDDEN|NOT_FOUND/.test(code)) return copy.forbidden;
  return copy.failed;
}

export function DeliverySubmission({ execution, latestDelivery, onComplete }: { execution: LearningExecution; latestDelivery?: Delivery; onComplete: () => void }) {
  const { i18n } = useTranslation();
  const copy = deliveryCopy[i18n.language as keyof typeof deliveryCopy] ?? deliveryCopy['en-US'];
  const assignmentId = execution.assignment_id ?? execution.assignmentId;
  const canSubmit = execution.state === 'completed' && !!assignmentId && (!latestDelivery || ['changes_requested', 'revision'].includes(latestDelivery.state));
  const [comment, setComment] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [pendingKey, setPendingKey] = useState(() => crypto.randomUUID());
  if (!canSubmit) return null;
  const send = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true); setError(''); setNotice('');
    try {
      await progressClient.createDelivery(execution.id, comment.trim(), pendingKey);
      setPendingKey(crypto.randomUUID()); setComment(''); setNotice(copy.sent); onComplete();
    } catch (reason) { setError(messageFor(reason, copy)); }
    finally { setBusy(false); }
  };
  return <form className="delivery-action" onSubmit={event => void send(event)} aria-busy={busy}>
    <label htmlFor={`delivery-comment-${execution.id}`}>{copy.comment}</label>
    <textarea id={`delivery-comment-${execution.id}`} maxLength={5000} value={comment} disabled={busy} onChange={event => setComment(event.target.value)}/>
    <button className="primary" type="submit" disabled={busy}>{busy ? copy.sending : latestDelivery ? copy.submitAgain : copy.submit}</button>
    {notice && <p role="status">{notice}</p>}{error && <p role="alert">{error}</p>}
  </form>;
}

export function DeliveryReview({ delivery, onComplete }: { delivery: Delivery; onComplete: () => void }) {
  const { i18n } = useTranslation();
  const copy = deliveryCopy[i18n.language as keyof typeof deliveryCopy] ?? deliveryCopy['en-US'];
  const canReview = ['submitted', 'revision', 'changes_requested'].includes(delivery.state);
  const [state, setState] = useState<'changes_requested' | 'accepted'>('accepted');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  if (!canReview) return null;
  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy || !message.trim()) return;
    setBusy(true); setError(''); setNotice('');
    try {
      await progressClient.reviewDelivery(delivery.id, delivery.state, state, message.trim());
      setMessage(''); setNotice(copy.reviewed); onComplete();
    } catch (reason) { setError(messageFor(reason, copy)); }
    finally { setBusy(false); }
  };
  return <form className="delivery-action" onSubmit={event => void save(event)} aria-busy={busy}>
    <label htmlFor={`delivery-review-${delivery.id}`}>{copy.response}</label>
    <textarea id={`delivery-review-${delivery.id}`} required maxLength={5000} value={message} disabled={busy} onChange={event => setMessage(event.target.value)}/>
    <div className="delivery-action-buttons">
      <button className="primary" type="submit" disabled={busy || !message.trim()}>{busy ? copy.saving : state === 'accepted' ? copy.accepted : copy.changes}</button>
      <button className="secondary" type="button" disabled={busy} onClick={() => setState(value => value === 'accepted' ? 'changes_requested' : 'accepted')}>{state === 'accepted' ? copy.changes : copy.accepted}</button>
    </div>
    {notice && <p role="status">{notice}</p>}{error && <p role="alert">{error}</p>}
  </form>;
}
