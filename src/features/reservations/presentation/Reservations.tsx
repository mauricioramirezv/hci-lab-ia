import {ExpandableCard} from '../../../shared/ui/ExpandableCard';
import {useDraftGuard} from '../../../shared/ui/useDraftGuard';
import {FormActions,RequiredFields} from '../../../shared/ui/FormActions';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Appointment, ReservationDraft, ServiceId } from '../domain/types';
import { services } from '../domain/types';
import { isConfirmed, localDay, serviceContexts } from '../domain/rules';
import { useReservations } from './useReservations';
import { PageHead } from '../../../shared/ui/Page';
import { Confirmation, Field } from '../../../shared/ui/Forms';
import { fieldAttributes, focusErrors } from '../../../shared/ui/fieldValidation';
import { DisclosureCard } from '../../../shared/ui/DisclosureCard';
import { LabSections } from '../../../shared/ui/LabSections';
import { userText } from '../../users/locales';
import '../../../shared/styles/forms.css';

type Draft=Omit<ReservationDraft,'condition'>;
const blank=():Draft=>({service:'',date:'',time:''});
export function Reservations() {
 const {t,i18n}=useTranslation();const tr=(key:string)=>t(`projectActivities.${key}`);const userLabel=userText(i18n.language);
 const {appointments,create,reschedule,cancel,validate:validateDraft,log}=useReservations();
 const [draft,setDraft]=useState<Draft>(blank);const [context,setContext]=useState('');const [condition,setCondition]=useState<'good'|'bad'>('good');
 const [step,setStep]=useState(1);const [active,setActive]=useState(false);const [editing,setEditing]=useState('');const [errors,setErrors]=useState<Record<string,string>>({});
 const [noticeEvent,setNoticeEvent]=useState({key:'',seq:0});const notice=noticeEvent.key;const setNotice=(key:string)=>setNoticeEvent(e=>({key,seq:e.seq+1}));const [cancelling,setCancelling]=useState<Appointment|null>(null);
 const [detail,setDetail]=useState<Appointment|null>(null);const baseline=useRef(JSON.stringify({draft:blank(),context:'',condition:'good'}));
 const [savedOpen,setSavedOpen]=useState(true);const savedHeading=useRef<HTMLButtonElement>(null);const createHeading=useRef<HTMLButtonElement>(null);const status=useRef<HTMLParagraphElement>(null);
 const guard=useDraftGuard(active&&step<4&&JSON.stringify({draft,context,condition})!==baseline.current);
 const locked=useRef(false);const heading=useRef<HTMLHeadingElement>(null);const started=useRef<number|null>(null);const initialStep=useRef(true),previousActive=useRef(active);
 const serviceName=(item:{service:string;serviceId?:ServiceId})=>item.serviceId?tr(item.serviceId==='culture'?'cultureActivity':item.serviceId):item.service;
 useEffect(()=>{
  if(!notice||notice==='draftCancelled'||notice==='editCancelled')return;
  const frame=requestAnimationFrame(()=>status.current?.focus());
  return()=>cancelAnimationFrame(frame);
 },[notice,noticeEvent.seq]);
 useLayoutEffect(()=>{const wasActive=previousActive.current;previousActive.current=active;if(initialStep.current){initialStep.current=false;return;}if(active||detail)heading.current?.focus();else if(wasActive)createHeading.current?.focus();else savedHeading.current?.focus();},[step,editing,active,detail]);
 const reset=()=>{baseline.current=JSON.stringify({draft:blank(),context:'',condition});setDetail(null);setDraft(blank());setContext('');setStep(1);setActive(true);setEditing('');setErrors({});setNotice('');locked.current=false;started.current=null;};
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
 const cancelDraft=()=>guard.request(()=>{setActive(false);setErrors({});setNotice(editing?'editCancelled':'draftCancelled');});
 const toggleDraft=()=>{if(!active){reset();return;}if(step===4){setActive(false);return;}guard.request(()=>{setActive(false);setErrors({});setNotice(editing?'editCancelled':'draftCancelled');});};
 const editReservation=(a:Appointment)=>{setDetail(null);baseline.current=JSON.stringify({draft:{service:a.service,serviceId:a.serviceId,date:a.date,time:a.time},context:a.serviceId?serviceContexts[a.serviceId]:'',condition:a.condition||'good'});setEditing(a.id);setDraft({service:a.service,serviceId:a.serviceId,date:a.date,time:a.time});setContext(a.serviceId?serviceContexts[a.serviceId]:'');setCondition(a.condition||'good');setStep(2);setActive(true);setErrors({});setNotice('');locked.current=false;started.current=Date.now();};
 const summary=(item:Draft)=><dl><div><dt>{tr('service')}</dt><dd>{serviceName(item)}</dd></div><div><dt>{tr('dateTime')}</dt><dd>{item.date} · {item.time}</dd></div></dl>;
 return <div className="project-activities" data-module="reservations"><PageHead eyebrow={tr('context')} title={tr('bookingTitle')} intro={tr('bookingIntro')}/>
  <LabSections active="reservations" navigationLabel={t('nav.lab')} sections={[{id:'reservations',title:userLabel('reservations'),intro:tr('bookingIntro'),href:'/lab'},{id:'users',title:userLabel('title'),intro:userLabel('intro'),href:'/lab/users'}]}><div className="lab-panels">
  <p ref={status} data-outcome={notice==='storageFailed'?'error':['booked','rescheduled','bookingCancelled'].includes(notice)?'success':'neutral'} aria-label={tr('bookingTitle')} role="status" tabIndex={-1} className={notice?'activity-notice':''}>{notice&&<span key={noticeEvent.seq}>{notice==='storageFailed'?t('manage.storageFailed'):tr(notice)}</span>}</p>
  {!detail&&<ExpandableCard headingLevel={3} id="reservation-condition" title={tr('condition')}>
  <div role="group" aria-label={tr('condition')} className="activity-actions">{(['good','bad'] as const).map(c=><button key={c} className="secondary" aria-pressed={condition===c} onClick={()=>setCondition(c)}>{tr(c)}</button>)}</div>
  <p className="activity-help">{tr(condition==='bad'?'badHelp':'goodHelp')}</p>
  </ExpandableCard>}
  {!detail&&<DisclosureCard headingLevel={3} id="reservation-create" title={active&&step===4?tr('confirmation'):active&&editing?t('crud.editBooking'):tr('startBooking')} open={active} onToggle={toggleDraft} triggerRef={createHeading}>
  {active&&<form noValidate onSubmit={event=>{event.preventDefault();if(step<3)next();else if(step===3)confirm();}} className={`activity-panel ${condition==='bad'?'activity-specimen-bad':''}`} aria-label={tr(condition)}>
   <ol className="activity-steps">{['service','dateTime','review','confirmation'].map((key,index)=><li key={key} aria-current={step===index+1?'step':undefined}>{tr(key)}</li>)}</ol>
   <h4 ref={heading} tabIndex={-1}>{step<4?`${t(editing?'crud.editBooking':'crud.createBooking')} - ${tr(['service','dateTime','review'][step-1])}`:tr('confirmation')}</h4>{step<4&&<RequiredFields/>}
   {step===1&&<><Field name="context" label={tr('context')} error={errors.context&&tr(errors.context)}><select {...fieldAttributes('context',errors)} required={!editing} value={context} onChange={e=>{setContext(e.target.value);setDraft(d=>({...d,service:'',serviceId:undefined}));}}><option value="">{tr('select')}</option>{['university','healthcare','culture'].map(c=><option value={c} key={c}>{tr(c)}</option>)}</select></Field><Field name="service" label={tr('service')} error={errors.service&&tr(errors.service)}><select required {...fieldAttributes('service',errors)} value={draft.serviceId||(draft.service?'__legacy__':'')} onChange={e=>{if(e.target.value==='__legacy__')return;setDraft(d=>({...d,serviceId:e.target.value as ServiceId||undefined,service:e.target.value?tr(e.target.value==='culture'?'cultureActivity':e.target.value):''}));}}><option value="">{tr('select')}</option>{!draft.serviceId&&draft.service&&<option value="__legacy__">{draft.service}</option>}{services.filter(s=>serviceContexts[s]===context).map(s=><option value={s} key={s}>{tr(s==='culture'?'cultureActivity':s)}</option>)}</select></Field></>}
   {step===2&&<>{condition==='good'&&<p><strong>{tr('service')}: </strong>{serviceName(draft)}</p>}<div className="activity-fields"><Field name="date" label={tr('date')} error={errors.date&&tr(errors.date)}><input type="date" min={localDay()} {...fieldAttributes('date',errors,false,true)} value={draft.date} onChange={e=>setDraft(d=>({...d,date:e.target.value}))}/></Field><Field name="time" label={tr('time')} error={errors.time&&tr(errors.time)} help={tr('timeHelp')}><select {...fieldAttributes('time',errors,true,true)} value={draft.time} onChange={e=>setDraft(d=>({...d,time:e.target.value}))}><option value="">{tr('select')}</option>{Array.from(new Set(['08:00','10:30','14:00','16:00',...(draft.time?[draft.time]:[])])).map(time=><option key={time}>{time}</option>)}</select></Field></div></>}
   {(step===3||step===4)&&summary(draft)}
   {Object.keys(errors).length>0&&<p role="alert">{tr('errors')}{step===3&&<> {Object.values(errors).map(key=>tr(key)).join(' ')}</>}</p>}
   <div className="activity-actions">{step<3&&<><button type="submit" className="primary">{tr('next')}</button><button type="button" className="secondary" onClick={cancelDraft}>{tr('cancel')}</button>{step>1&&<button type="button" className="secondary" onClick={()=>{setErrors({});setStep(s=>s-1);}}>{tr('back')}</button>}</>}{step===4&&<button type="button" className="primary" onClick={e=>{if(e.detail<2)reset();}}>{tr('newBooking')}</button>}</div>
   {step===3&&<FormActions onCancel={cancelDraft} onBack={()=>{setErrors({});setStep(2);}}/>}
  </form>}</DisclosureCard>}
  {!detail&&(!active||step===4)&&<DisclosureCard headingLevel={3} id="reservation-saved" title={tr('savedBookings')} open={savedOpen} onToggle={()=>setSavedOpen(value=>!value)} triggerRef={savedHeading}>{!appointments.length?<p>{tr('emptyBookings')}</p>:<div className="activity-records">{appointments.map(a=><article className="activity-record" key={a.id} data-booking={a.id}><h4>{serviceName(a)}</h4>{summary(a)}<p>{tr('status')}: {tr(a.status)}</p>{a.condition&&<p>{tr('condition')}: {tr(a.condition)}</p>}<div className="activity-actions"><button className="secondary" onClick={()=>{setDetail(a);setActive(false);}}>{t('crud.view')}</button>{isConfirmed(a)&&<><button className="secondary" onClick={()=>{editReservation(a);}}>{tr('reschedule')}</button><button className="secondary" onClick={()=>{setNotice('');setCancelling(a);}}>{tr('cancelBooking')}</button></>}</div></article>)}</div>}</DisclosureCard>}
  {detail&&<DisclosureCard headingLevel={3} id="reservation-detail" title={t('crud.view')} open onToggle={()=>setDetail(null)}><section className="activity-panel"><h4 ref={heading} tabIndex={-1}>{serviceName(detail)}</h4>{summary(detail)}<p>{tr('status')}: {tr(detail.status)}</p><p>ID: {detail.id}</p><p>{t('crud.createdAt')}: {detail.createdAt}</p><div className="activity-actions">{isConfirmed(detail)&&<button className="secondary" onClick={()=>editReservation(detail)}>{t('crud.edit')}</button>}<button className="secondary" onClick={()=>setDetail(null)}>{t('crud.back')}</button></div></section></DisclosureCard>}
  </div></LabSections>
  {guard.dialog}
  {cancelling&&<Confirmation title={tr('cancelTitle')} text={`${tr('cancelQuestion')} ${t('crud.cancelBookingHelp')}`} confirm={tr('cancelBooking')} onCancel={()=>setCancelling(null)} onConfirm={()=>{const result=cancel(cancelling.id);if(!result.ok){setCancelling(null);setNotice(result.reason==='storageFailed'?'storageFailed':'unchanged');return;}log({type:'appointment-change',detail:'cancel'});if(editing===cancelling.id){setActive(false);setEditing('');}setCancelling(null);setNotice('bookingCancelled');}}>{summary(cancelling)}</Confirmation>}
 </div>;
}
