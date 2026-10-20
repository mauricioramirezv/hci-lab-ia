import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Appointment, ReservationDraft, ServiceId } from '../domain/types';
import { services } from '../domain/types';
import { isConfirmed, localDay, serviceContexts } from '../domain/rules';
import { useReservations } from './useReservations';
import { PageHead } from '../../../shared/ui/Page';
import { Confirmation, Field } from '../../../shared/ui/Forms';
import { fieldAttributes, focusErrors } from '../../../shared/ui/fieldValidation';
import '../../../shared/styles/forms.css';

type Draft=Omit<ReservationDraft,'condition'>;
const blank=():Draft=>({service:'',date:'',time:''});
export function Reservations() {
 const {t}=useTranslation();const tr=(key:string)=>t(`projectActivities.${key}`);
 const {appointments,create,reschedule,cancel,validate:validateDraft,log}=useReservations();
 const [draft,setDraft]=useState<Draft>(blank);const [context,setContext]=useState('');const [condition,setCondition]=useState<'good'|'bad'>('good');
 const [step,setStep]=useState(1);const [active,setActive]=useState(true);const [editing,setEditing]=useState('');const [errors,setErrors]=useState<Record<string,string>>({});
 const [noticeEvent,setNoticeEvent]=useState({key:'',seq:0});const notice=noticeEvent.key;const setNotice=(key:string)=>setNoticeEvent(e=>({key,seq:e.seq+1}));const [cancelling,setCancelling]=useState<Appointment|null>(null);
 const locked=useRef(false);const heading=useRef<HTMLHeadingElement>(null);const noticeRef=useRef<HTMLParagraphElement>(null);const started=useRef<number|null>(null);const initialStep=useRef(true);
 const serviceName=(item:{service:string;serviceId?:ServiceId})=>item.serviceId?tr(item.serviceId==='culture'?'cultureActivity':item.serviceId):item.service;
 useEffect(()=>{if(initialStep.current){initialStep.current=false;return;}heading.current?.focus();},[step,editing,active]);
 useEffect(()=>{if(!noticeEvent.key)return;const frame=requestAnimationFrame(()=>noticeRef.current?.focus());return()=>cancelAnimationFrame(frame);},[noticeEvent]);
 const reset=()=>{setDraft(blank());setContext('');setStep(1);setActive(true);setEditing('');setErrors({});setNotice('');locked.current=false;started.current=null;};
 const validate=(all=false)=>{
   const next=validateDraft(draft,{context,editingId:editing,stage:all?'all':step===1?'selection':'schedule'});
   setErrors(next);if(Object.keys(next).length){if(all)setStep(next.context||next.service?1:2);log({type:'flow-error',detail:`booking-${condition}`});requestAnimationFrame(()=>focusErrors(next));return false;}return true;
 };
 const next=()=>{if(started.current===null){started.current=Date.now();log({type:'flow-start',detail:`booking-${condition}`});}if(validate())setStep(s=>s+1);};
 const confirm=()=>{
   if(locked.current||!validate(true))return;locked.current=true;
   const item={...draft,service:serviceName(draft),condition};
   const result=editing?reschedule(editing,item):create(item,{context});
   if(!result.ok){locked.current=false;setErrors(result.errors);if(Object.keys(result.errors).length){setStep(result.errors.context||result.errors.service?1:2);requestAnimationFrame(()=>focusErrors(result.errors));}else setNotice(result.reason==='storageFailed'?'storageFailed':'unchanged');return;}
   if(editing){log({type:'appointment-change',detail:'reschedule'});setNotice('rescheduled');}
   else{log({type:'flow-complete',duration:Math.max(0,Math.round((Date.now()-(started.current??Date.now()))/1000)),detail:`booking-${condition}`});setNotice('booked');}
   setStep(4);
 };
 const cancelDraft=()=>{setActive(false);setErrors({});setNotice(editing?'editCancelled':'draftCancelled');};
 const summary=(item:Draft)=><dl><div><dt>{tr('service')}</dt><dd>{serviceName(item)}</dd></div><div><dt>{tr('dateTime')}</dt><dd>{item.date} · {item.time}</dd></div></dl>;
 return <div className="project-activities" data-module="reservations"><PageHead eyebrow={tr('context')} title={tr('bookingTitle')} intro={tr('bookingIntro')}/>
  <div role="group" aria-label={tr('condition')} className="activity-actions">{(['good','bad'] as const).map(c=><button key={c} className="secondary" aria-pressed={condition===c} onClick={()=>setCondition(c)}>{tr(c)}</button>)}</div>
  <p className="activity-help">{tr(condition==='bad'?'badHelp':'goodHelp')}</p>
  <p ref={noticeRef} role="status" tabIndex={-1} className={notice?'activity-notice':''}>{notice&&<span key={noticeEvent.seq}>{notice==='storageFailed'?t('manage.storageFailed'):tr(notice)}</span>}</p>
  {!active?<button className="primary" onClick={e=>{if(e.detail<2)reset();}}>{tr('startBooking')}</button>:<section className={`activity-panel ${condition==='bad'?'activity-specimen-bad':''}`} aria-label={tr(condition)}>
   <ol className="activity-steps">{['service','dateTime','review','confirmation'].map((key,index)=><li key={key} aria-current={step===index+1?'step':undefined}>{tr(key)}</li>)}</ol>
   <h2 ref={heading} tabIndex={-1}>{tr(editing&&step<4?'reschedule':['service','dateTime','review','confirmation'][step-1])}</h2>
   {step===1&&<><Field name="context" label={tr('context')} error={errors.context&&tr(errors.context)}><select {...fieldAttributes('context',errors)} required={!editing} value={context} onChange={e=>{setContext(e.target.value);setDraft(d=>({...d,service:'',serviceId:undefined}));}}><option value="">{tr('select')}</option>{['university','healthcare','culture'].map(c=><option value={c} key={c}>{tr(c)}</option>)}</select></Field><Field name="service" label={tr('service')} error={errors.service&&tr(errors.service)}><select required {...fieldAttributes('service',errors)} value={draft.serviceId||(draft.service?'__legacy__':'')} onChange={e=>{if(e.target.value==='__legacy__')return;setDraft(d=>({...d,serviceId:e.target.value as ServiceId||undefined,service:e.target.value?tr(e.target.value==='culture'?'cultureActivity':e.target.value):''}));}}><option value="">{tr('select')}</option>{!draft.serviceId&&draft.service&&<option value="__legacy__">{draft.service}</option>}{services.filter(s=>serviceContexts[s]===context).map(s=><option value={s} key={s}>{tr(s==='culture'?'cultureActivity':s)}</option>)}</select></Field></>}
   {step===2&&<>{condition==='good'&&<p><strong>{tr('service')}: </strong>{serviceName(draft)}</p>}<div className="activity-fields"><Field name="date" label={tr('date')} error={errors.date&&tr(errors.date)}><input type="date" min={localDay()} {...fieldAttributes('date',errors,false,true)} value={draft.date} onChange={e=>setDraft(d=>({...d,date:e.target.value}))}/></Field><Field name="time" label={tr('time')} error={errors.time&&tr(errors.time)} help={tr('timeHelp')}><select {...fieldAttributes('time',errors,true,true)} value={draft.time} onChange={e=>setDraft(d=>({...d,time:e.target.value}))}><option value="">{tr('select')}</option>{Array.from(new Set(['08:00','10:30','14:00','16:00',...(draft.time?[draft.time]:[])])).map(time=><option key={time}>{time}</option>)}</select></Field></div></>}
   {(step===3||step===4)&&summary(draft)}
   {Object.keys(errors).length>0&&<p role="alert">{tr('errors')}{step===3&&<> {Object.values(errors).map(key=>tr(key)).join(' ')}</>}</p>}
   <div className="activity-actions">{step<4&&<>{step>1&&<button className="secondary" onClick={()=>{setErrors({});setStep(s=>s-1);}}>{tr('back')}</button>}<button className="secondary" onClick={cancelDraft}>{tr('cancel')}</button>{step<3?<button className="primary" onClick={next}>{tr('next')}</button>:<button className="primary" onClick={confirm}>{tr(editing?'confirmReschedule':'confirmBooking')}</button>}</>}{step===4&&<button className="primary" onClick={e=>{if(e.detail<2)reset();}}>{tr('newBooking')}</button>}</div>
  </section>}
  <section><h2>{tr('savedBookings')}</h2>{!appointments.length?<p>{tr('emptyBookings')}</p>:<div className="activity-records">{appointments.map(a=><article className="activity-record" key={a.id} data-booking={a.id}><h3>{serviceName(a)}</h3>{summary(a)}<p>{tr('status')}: {tr(a.status)}</p>{a.condition&&<p>{tr('condition')}: {tr(a.condition)}</p>}{isConfirmed(a)&&<div className="activity-actions"><button className="secondary" onClick={()=>{setEditing(a.id);setDraft({service:a.service,serviceId:a.serviceId,date:a.date,time:a.time});setContext(a.serviceId?serviceContexts[a.serviceId]:'');setCondition(a.condition||'good');setStep(2);setActive(true);setErrors({});setNotice('');locked.current=false;started.current=Date.now();}}>{tr('reschedule')}</button><button className="secondary" onClick={()=>setCancelling(a)}>{tr('cancelBooking')}</button></div>}</article>)}</div>}</section>
  {cancelling&&<Confirmation title={tr('cancelTitle')} text={tr('cancelQuestion')} confirm={tr('cancelBooking')} onCancel={()=>{setCancelling(null);setNotice('unchanged');}} onConfirm={()=>{const result=cancel(cancelling.id);if(!result.ok){setCancelling(null);setNotice(result.reason==='storageFailed'?'storageFailed':'unchanged');return;}log({type:'appointment-change',detail:'cancel'});if(editing===cancelling.id){setActive(false);setEditing('');}setCancelling(null);setNotice('bookingCancelled');}}>{summary(cancelling)}</Confirmation>}
 </div>;
}
