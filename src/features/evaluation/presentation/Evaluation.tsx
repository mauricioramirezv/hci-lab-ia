import {useEffect,useRef,useState} from 'react';
import {Link} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {findingErrors} from '../domain/validation';
import {heuristics as legacyHeuristics} from './heuristicNames';
import {PageHead} from '../../../shared/ui/Page';
import {ExpandableCard} from '../../../shared/ui/ExpandableCard';
import {Confirmation,Field} from '../../../shared/ui/Forms';
import {FormActions,RequiredFields} from '../../../shared/ui/FormActions';
import {useDraftGuard} from '../../../shared/ui/useDraftGuard';
import {useProject} from '../../project/presentation';
import {heuristicContent} from './heuristics';
import {useEvaluationText} from './Records';
import type {Finding} from '../../project/domain';
import '../../../shared/styles/forms.css';
type Draft=Omit<Finding,'id'|'createdAt'>;
const blank:Draft={source:'human',status:'validated',task:'',heuristicId:'h1',heuristic:'',severity:2,problem:'',evidence:'',recommendation:''};
export function Evaluation(){
 const {state,evaluation}=useProject(),{tr,language}=useEvaluationText(),{t}=useTranslation(),catalog=heuristicContent(language);
 const [form,setForm]=useState<Draft>(blank),[editing,setEditing]=useState(''),[view,setView]=useState<'list'|'form'|'detail'>('list'),[deleting,setDeleting]=useState<Finding|null>(null),[errors,setErrors]=useState<Record<string,string>>({});
 const [message,setMessage]=useState({key:'',sequence:0}),heading=useRef<HTMLHeadingElement>(null),notice=useRef<HTMLParagraphElement>(null),baseline=useRef(''),submitted=useRef(false);
 const guard=useDraftGuard(view==='form'&&JSON.stringify(form)!==baseline.current),selected=catalog.find(h=>h.id===form.heuristicId)||catalog[0];
 const text=(key:string)=>['storageFailed','duplicate','notFound'].includes(key)?t(`crud.${key}`):tr(key);
 const notify=(key:string)=>setMessage(old=>({key,sequence:old.sequence+1}));
 useEffect(()=>{if(view!=='list')heading.current?.focus();},[view,editing]);
 useEffect(()=>{if(message.key){const frame=requestAnimationFrame(()=>notice.current?.focus());return()=>cancelAnimationFrame(frame);}},[message]);
 const start=(item?:Finding,detail=false)=>{
  const next:Draft=item?{...item,heuristicId:item.heuristicId||(legacyHeuristics.includes(item.heuristic)?'h'+(legacyHeuristics.indexOf(item.heuristic)+1):undefined)}:{...blank};
  baseline.current=JSON.stringify(next);submitted.current=false;setForm(next);setEditing(item?.id||'');setErrors({});notify('');setView(detail?'detail':'form');
 };
 const close=()=>guard.request(()=>{setView('list');setErrors({});notify('');requestAnimationFrame(()=>document.getElementById('finding-new')?.focus());});
 const save=()=>{
  if(submitted.current)return;
  const previous=editing?state.findings.find(f=>f.id===editing):undefined;
  if(editing&&!previous){notify('notFound');return;}
  const item={...form,heuristic:form.heuristicId?selected.name:form.heuristic,source:previous?.source||'human' as const};
  const next=findingErrors(item,state.findings,editing||undefined);setErrors(next);
  if(Object.keys(next).length){requestAnimationFrame(()=>document.getElementById(`finding-${Object.keys(next)[0]}`)?.focus());return;}
  if(!evaluation.saveFinding(item,editing||undefined)){notify('storageFailed');return;}
  submitted.current=true;setView('list');notify('saved');
 };
 const attrs=(key:string,required=true)=>({id:`finding-${key}`,required,'aria-invalid':!!errors[key],'aria-describedby':errors[key]?`finding-${key}-error`:undefined});
 const detailValue=(key:string)=>key==='severity'?tr(`severity${form.severity}`):key==='status'?tr(form.status):key==='source'?tr(form.source==='ai'?'aiSource':'human'):key==='createdAt'?state.findings.find(f=>f.id===editing)?.createdAt||'':String(form[key as keyof Draft]||'');
 return <div className="i7 project-activities" data-module="findings"><PageHead title={tr('evaluation')} intro={tr('evalHelp')} eyebrow="Nielsen"/>
  <p ref={notice} data-outcome={['storageFailed','duplicate','notFound'].includes(message.key)?'error':['saved','deleted'].includes(message.key)?'success':'neutral'} tabIndex={-1} role={message.key==='storageFailed'?'alert':'status'}>{message.key&&<span key={message.sequence}>{text(message.key)}</span>}</p>
  {view==='list'&&<div className="disclosure-stack"><ExpandableCard id="evaluation-heuristics" title={tr('heuristic')} defaultOpen={false}>{catalog.map(h=><details key={h.id}><summary>{h.name}</summary><p>{h.explanation}</p><p><strong>{tr('criterion')}:</strong> {h.question}</p><p><strong>{tr('example')}:</strong> {h.example}</p></details>)}<a href="https://www.nngroup.com/articles/ten-usability-heuristics/">Nielsen Norman Group</a></ExpandableCard>
   <ExpandableCard id="evaluation-findings" title={tr('records')}><div className="activity-actions"><button id="finding-new" className="primary" onClick={()=>start()}>{tr('newFinding')}</button><Link to="/ai">{tr('aiTitle')}</Link></div>{!state.findings.length&&<p>{tr('empty')}</p>}{state.findings.map(f=><article className="i7-record" data-finding={f.id} key={f.id}><h3>{catalog.find(h=>h.id===f.heuristicId)?.name||f.heuristic}</h3><p>{f.task} · {tr(`severity${f.severity}`)}</p><p>{tr(f.source==='ai'?'aiSource':'human')} · {tr(f.status)}</p><p>{f.problem}</p><p>{tr('location')}: {f.evidence}</p><p>{tr('recommendation')}: {f.recommendation}</p><div className="activity-actions"><button className="secondary" onClick={()=>start(f,true)}>{t('crud.view')}</button><button className="secondary" onClick={()=>start(f)}>{t('crud.edit')}</button><button id={`finding-delete-${f.id}`} className="secondary" onClick={()=>{notify('');setDeleting(f);}}>{tr('remove')}</button></div></article>)}</ExpandableCard></div>}
  {view==='form'&&<form className="activity-panel" noValidate onSubmit={event=>{event.preventDefault();save();}}><h2 ref={heading} tabIndex={-1}>{editing?t('crud.editFinding'):tr('newFinding')}</h2><RequiredFields/>
   <Field name="finding-task" label={tr('task')} error={errors.task&&text(errors.task)}><input {...attrs('task')} value={form.task||''} onChange={event=>setForm({...form,task:event.target.value})}/></Field>
   <Field name="finding-heuristicId" label={tr('heuristic')} error={errors.heuristicId&&text(errors.heuristicId)}><select {...attrs('heuristicId')} value={form.heuristicId||'legacy'} onChange={event=>setForm({...form,heuristicId:event.target.value==='legacy'?undefined:event.target.value})}>{!form.heuristicId&&<option value="legacy">{form.heuristic}</option>}{catalog.map(h=><option value={h.id} key={h.id}>{h.name}</option>)}</select></Field><p>{selected.explanation} {selected.question}</p>
   {(['problem','evidence','recommendation'] as const).map(key=><Field key={key} name={`finding-${key}`} label={tr(key==='evidence'?'location':key)} error={errors[key]&&text(errors[key])}><textarea {...attrs(key)} value={form[key]} onChange={event=>setForm({...form,[key]:event.target.value})}/></Field>)}
   <Field name="finding-severity" label={tr('severity')} error={errors.severity&&text(errors.severity)}><select {...attrs('severity')} value={form.severity} onChange={event=>setForm({...form,severity:Number(event.target.value)})}>{[0,1,2,3,4].map(value=><option key={value} value={value}>{tr(`severity${value}`)}</option>)}</select></Field><p>{tr(`severity${form.severity}`)}</p>
   {editing&&form.source==='ai'&&<Field name="finding-status" label={tr('reviewState')} error={errors.status&&text(errors.status)}><select {...attrs('status')} value={form.status} onChange={event=>setForm({...form,status:event.target.value as Finding['status']})}>{(['pending','validated','rejected'] as const).map(status=><option key={status} value={status}>{tr(status)}</option>)}</select></Field>}
   <FormActions onCancel={close} onBack={close}/>
  </form>}
  {view==='detail'&&<section className="activity-panel"><h2 ref={heading} tabIndex={-1}>{t('crud.view')}</h2><dl>{(['task','heuristic','problem','evidence','recommendation','severity','status','source','createdAt'] as const).map(key=><div key={key}><dt>{key==='createdAt'||key==='source'?t(`crud.${key}`):tr(key==='evidence'?'location':key)}</dt><dd>{detailValue(key)}</dd></div>)}<div><dt>ID</dt><dd>{editing}</dd></div></dl><div className="activity-actions"><button className="secondary" onClick={()=>setView('form')}>{t('crud.edit')}</button><button className="secondary" onClick={close}>{t('crud.back')}</button></div></section>}
  {deleting&&<Confirmation title={tr('remove')} text={`${tr('deleteQuestion')} ${t('crud.deleteHelp')}`} confirm={tr('remove')} onCancel={()=>setDeleting(null)} onConfirm={()=>{if(!evaluation.removeFinding(deleting.id)){notify('storageFailed');return;}setDeleting(null);notify('deleted');}}><p>{deleting.task} · {deleting.problem}</p>{message.key==='storageFailed'&&<p role="alert">{text(message.key)}</p>}</Confirmation>}
  {guard.dialog}
 </div>;
}
