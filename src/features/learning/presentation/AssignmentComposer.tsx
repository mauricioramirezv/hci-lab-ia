import { useState, type FormEvent } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { progressClient } from '../infrastructure/client';
import { assignmentCopy } from './assignment-copy';
import './assignment.css';

type ActivityOption = { activity_version_id: string; title: string; version: number };
type CriterionDraft = { name: string; maxScore: string };

export function AssignmentComposer({ groupId, activities, onCreated }: { groupId: string; activities: ActivityOption[]; onCreated: () => void }) {
  const { i18n } = useTranslation();
  const locale = assignmentCopy[i18n.language as keyof typeof assignmentCopy] ?? assignmentCopy['en-US'];
  const [activityVersionId, setActivityVersionId] = useState(activities[0]?.activity_version_id ?? '');
  const [title, setTitle] = useState('');
  const [instructions, setInstructions] = useState('');
  const [due, setDue] = useState('');
  const [criteria, setCriteria] = useState<CriterionDraft[]>([{ name: '', maxScore: '100' }]);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice(''); setError('');
    if (!activityVersionId || !title.trim() || !instructions.trim() || criteria.some(item => !item.name.trim())) { setError(locale.required); return; }
    const dueDate = due ? new Date(due) : undefined;
    if (dueDate && (!Number.isFinite(dueDate.getTime()) || dueDate.getTime() <= Date.now())) { setError(locale.dateError); return; }
    setBusy(true);
    try {
      await progressClient.createAssignment(groupId, {
        activityVersionId,
        title: title.trim(),
        instructions: instructions.trim(),
        dueAt: dueDate?.toISOString(),
        criteria: criteria.map((item, index) => ({ code: `criterion-${index + 1}`, name: item.name.trim(), maxScore: item.maxScore === '' ? undefined : Number(item.maxScore), order: index + 1 })),
      });
      setNotice(locale.published); setTitle(''); setInstructions(''); setDue(''); setCriteria([{ name: '', maxScore: '100' }]); onCreated();
    } catch { setError(locale.failed); }
    finally { setBusy(false); }
  }

  return <details className="learning-assignment-composer">
    <summary>{locale.create}</summary>
    <p>{locale.publicationNote}</p>
    {activities.length === 0 ? <p role="status">{locale.unavailableActivity}</p> : <form className="assignment-form" onSubmit={event => void submit(event)} aria-busy={busy}>
      <div className="assignment-field">
        <label htmlFor={`assignment-activity-${groupId}`}>{locale.activity}</label>
        <select id={`assignment-activity-${groupId}`} required value={activityVersionId} disabled={busy} onChange={event => setActivityVersionId(event.target.value)}>
          {activities.map(activity => <option key={activity.activity_version_id} value={activity.activity_version_id}>{activity.title} · v{activity.version}</option>)}
        </select>
      </div>
      <div className="assignment-field"><label htmlFor={`assignment-title-${groupId}`}>{locale.title}</label><input id={`assignment-title-${groupId}`} required maxLength={200} value={title} disabled={busy} onChange={event => setTitle(event.target.value)}/></div>
      <div className="assignment-field"><label htmlFor={`assignment-instructions-${groupId}`}>{locale.instructions}</label><textarea id={`assignment-instructions-${groupId}`} required maxLength={5000} rows={4} value={instructions} disabled={busy} onChange={event => setInstructions(event.target.value)}/></div>
      <div className="assignment-field"><label htmlFor={`assignment-due-${groupId}`}>{locale.due}</label><input id={`assignment-due-${groupId}`} type="datetime-local" value={due} disabled={busy} onChange={event => setDue(event.target.value)}/></div>
      <fieldset className="assignment-criteria"><legend>{locale.criteria}</legend>
        {criteria.map((criterion, index) => <div className="assignment-criterion" key={index}>
          <div className="assignment-field"><label htmlFor={`assignment-criterion-${groupId}-${index}`}>{locale.criterion} {index + 1}</label><input id={`assignment-criterion-${groupId}-${index}`} required maxLength={160} value={criterion.name} disabled={busy} onChange={event => setCriteria(items => items.map((item, itemIndex) => itemIndex === index ? { ...item, name: event.target.value } : item))}/></div>
          <div className="assignment-field"><label htmlFor={`assignment-score-${groupId}-${index}`}>{locale.score}</label><input id={`assignment-score-${groupId}-${index}`} type="number" min="0" step="0.01" value={criterion.maxScore} disabled={busy} onChange={event => setCriteria(items => items.map((item, itemIndex) => itemIndex === index ? { ...item, maxScore: event.target.value } : item))}/></div>
          {criteria.length > 1 && <button type="button" className="secondary" aria-label={`${locale.removeCriterion} ${index + 1}`} disabled={busy} onClick={() => setCriteria(items => items.filter((_, itemIndex) => itemIndex !== index))}><Trash2 aria-hidden="true"/>{locale.removeCriterion}</button>}
        </div>)}
        {criteria.length < 30 && <button type="button" className="secondary" disabled={busy} onClick={() => setCriteria(items => [...items, { name: '', maxScore: '100' }])}><Plus aria-hidden="true"/>{locale.addCriterion}</button>}
      </fieldset>
      {error && <p role="alert" className="assignment-error">{error}</p>}
      {notice && <p role="status" className="assignment-success">{notice}</p>}
      <button type="submit" className="primary" disabled={busy || !activityVersionId}>{busy ? locale.publishing : locale.submit}</button>
    </form>}
  </details>;
}
