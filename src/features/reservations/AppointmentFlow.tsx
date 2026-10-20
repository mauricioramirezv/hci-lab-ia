import { useRef, useState } from 'react';
import { AlertTriangle, CalendarCheck, Check, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useProject } from '../project/store';
import { StatusPill } from '../../shared/ui/Page';

export function AppointmentFlow({ bad = false, compact = false }: { bad?: boolean; compact?: boolean }) {
  const { t } = useTranslation();
  const { addAppointment, log } = useProject();
  const [step, setStep] = useState(1);
  const [service, setService] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [message, setMessage] = useState('');
  const started = useRef(Date.now());
  const startLogged = useRef(false);
  const ensureStart = () => { if (!startLogged.current) { log({ type: 'flow-start', detail: bad ? 'bad' : 'good' }); startLogged.current = true; } };
  const next = () => {
    ensureStart();
    if (!bad && ((step === 1 && !service) || (step === 2 && (!date || !time)))) { setMessage(step === 1 ? t('lab.select') : t('lab.goodMessage')); log({ type: 'flow-error', detail: `step-${step}` }); return; }
    setMessage(''); setStep((current) => Math.min(3, current + 1));
  };
  const confirm = () => {
    ensureStart();
    if (bad) { setMessage(t('lab.badMessage')); log({ type: 'flow-error', detail: 'bad-confirmation' }); return; }
    if (!service || !date || !time) { setMessage(t('lab.goodMessage')); log({ type: 'flow-error', detail: 'incomplete-confirmation' }); return; }
    addAppointment({ service, date, time });
    log({ type: 'flow-complete', duration: Math.round((Date.now() - started.current) / 1000), detail: service });
    setMessage(t('lab.success'));
  };
  return <section className={`appointment-demo ${bad ? 'anti-pattern' : ''} ${compact ? 'compact' : ''}`} aria-label={bad ? t('common.bad') : t('common.good')}>
    <div className="demo-head"><StatusPill tone={bad ? 'bad' : 'good'}>{bad ? t('common.bad') : t('common.good')}</StatusPill><span>{t('lab.steps')}: {step}/3</span></div>
    {!bad && <div className="progress" role="progressbar" aria-valuemin={1} aria-valuemax={3} aria-valuenow={step} aria-label={`${step} de 3`}><span style={{ width: `${step / 3 * 100}%` }}/></div>}
    {step === 1 && <div className="field"><label htmlFor={`service-${bad}`}>{bad ? '' : t('lab.service')}</label><select id={`service-${bad}`} aria-label={bad ? 'Servicio sin etiqueta visible' : undefined} value={service} onChange={(event) => setService(event.target.value)}><option value="">{t('lab.select')}</option><option value="Orientación UX">Orientación UX</option><option value="Evaluación de accesibilidad">Evaluación de accesibilidad</option><option value="Asesoría de prototipo">Asesoría de prototipo</option></select><button className="primary" onClick={next}>{bad ? 'OK' : t('common.continue')}<ChevronRight/></button></div>}
    {step === 2 && <div className="form-grid"><label>{t('lab.date')}<input type="date" value={date} onChange={(event) => setDate(event.target.value)}/></label><label>{t('lab.time')}<select value={time} onChange={(event) => setTime(event.target.value)}><option value="">{t('lab.select')}</option><option>08:00</option><option>10:30</option><option>14:00</option></select></label><button className="primary" onClick={next}>{t('common.continue')}<ChevronRight/></button></div>}
    {step === 3 && <div className="summary"><CalendarCheck/><div><strong>{service || 'Servicio'}</strong><p>{date || '—'} · {time || '—'}</p></div><button className="primary" onClick={confirm}>{t('lab.confirm')}</button></div>}
    {message && <div role={bad ? undefined : 'status'} className={`message ${bad ? 'error-vague' : message === t('lab.success') ? 'success' : 'warning'}`}>{bad ? <AlertTriangle/> : <Check/>}{message}</div>}
  </section>;
}
