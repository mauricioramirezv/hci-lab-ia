import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Persona, Scenario } from '../project/domain';
import { uid } from '../project/domain';
import { useProject } from '../project/store';
import { PageHead } from '../../shared/ui/Page';
import { linkedPersona } from './model';
import { Confirmation, Field } from '../../shared/ui/Forms';
import { fieldAttributes, focusErrors } from '../../shared/ui/fieldValidation';
import '../../shared/styles/forms.css';

const blankPersona=():Persona=>({id:uid(),name:'',age:'',context:'',goal:'',barrier:'',device:'',empathy:{says:'',thinks:'',does:'',feels:''},observed:'',assumptions:''});
const blankScenario=():Scenario=>({id:uid(),title:'',actor:'',context:'',task:'',constraint:'',success:''});
const personFields=['name','context','goal','barrier','device','age'] as const;
const scenarioFields=['title','context','task','constraint','success'] as const;
const empathyFields=['says','thinks','does','feels'] as const;
type View='list'|'personaForm'|'scenarioForm'|'personaDetail'|'scenarioDetail';
export function Research() {
 const {t}=useTranslation();const tr=(key:string)=>t(`projectActivities.${key}`);
 const {state,savePersona,removePersona,saveScenario,removeScenario}=useProject();
 const [view,setView]=useState<View>('list');const [persona,setPersona]=useState(blankPersona);const [scenario,setScenario]=useState(blankScenario);const [editing,setEditing]=useState(false);
 const [errors,setErrors]=useState<Record<string,string>>({});const [noticeEvent,setNoticeEvent]=useState({key:'',seq:0});const notice=noticeEvent.key;const setNotice=(key:string)=>setNoticeEvent(e=>({key,seq:e.seq+1}));const [deleting,setDeleting]=useState<{type:'persona'|'scenario';id:string;name:string}|null>(null);
 const title=useRef<HTMLHeadingElement>(null);const message=useRef<HTMLParagraphElement>(null);const initialView=useRef(true);
 useEffect(()=>{if(initialView.current){initialView.current=false;return;}title.current?.focus();},[view]);
 useEffect(()=>{if(!noticeEvent.key)return;const frame=requestAnimationFrame(()=>message.current?.focus());return()=>cancelAnimationFrame(frame);},[noticeEvent]);
 const label=(key:string)=>tr(key==='context'?'useContext':key);
 const openPersona=(p?:Persona,detail=false)=>{setPersona(p?{...p,empathy:{...p.empathy}}:blankPersona());setEditing(!!p);setErrors({});setNotice('');setView(detail?'personaDetail':'personaForm');};
 const openScenario=(s?:Scenario,detail=false)=>{if(!state.personas.length&&!detail){setNotice('noPersonas');return;}setScenario(s?{...s,...(!s.personaId&&linkedPersona(s,state.personas)?{personaId:linkedPersona(s,state.personas)!.id}:{})}:blankScenario());setEditing(!!s);setErrors({});setNotice('');setView(detail?'scenarioDetail':'scenarioForm');};
 const back=(cancel=false)=>{setView('list');setErrors({});setNotice(cancel?'editCancelled':'');};
 const submitPersona=()=>{
  const next:Record<string,string>={};personFields.filter(k=>k!=='age').forEach(k=>{if(!persona[k].trim())next[k]='required';});
  if(state.personas.some(p=>p.id!==persona.id&&p.name.trim().toLocaleLowerCase()===persona.name.trim().toLocaleLowerCase()))next.name='uniqueName';
  if(!persona.basis)next.basis='required';
  if((persona.basis==='observed'||persona.basis==='mixed')&&!persona.observed?.trim())next.observed='required';
  if((persona.basis==='assumed'||persona.basis==='mixed')&&!persona.assumptions?.trim())next.assumptions='required';
  const old=state.personas.find(p=>p.id===persona.id);
  if(old&&old.name!==persona.name&&state.scenarios.some(s=>!s.personaId&&s.actor===old.name&&!linkedPersona(s,state.personas)))next.name='legacyAmbiguous';
  if(persona.empathy.feels.trim()&&!persona.emotionSource&&(!old||old.empathy.feels!==persona.empathy.feels))next.emotionSource='required';
  setErrors(next);if(Object.keys(next).length){requestAnimationFrame(()=>focusErrors(next));return;}
  savePersona(persona);setView('list');setNotice('saved');
 };
 const submitScenario=()=>{
  const next:Record<string,string>={};scenarioFields.forEach(k=>{if(!scenario[k].trim())next[k]='required';});
  const linked=state.personas.find(p=>p.id===scenario.personaId);if(!linked)next.personaId='required';
  setErrors(next);if(Object.keys(next).length){requestAnimationFrame(()=>focusErrors(next));return;}
  saveScenario({...scenario,actor:linked!.name});setView('list');setNotice('saved');
 };
 const askDelete=(type:'persona'|'scenario',item:{id:string;name?:string;title?:string})=>{
  if(type==='persona'&&state.scenarios.some(s=>s.personaId===item.id||linkedPersona(s,state.personas)?.id===item.id||(!s.personaId&&s.actor===item.name))){setNotice('deleteBlocked');return;}
  setDeleting({type,id:item.id,name:item.name||item.title||''});
 };
 const textField=(key:typeof personFields[number],area=false)=> <Field key={key} name={key} label={label(key)} error={errors[key]&&tr(errors[key])}>{area?<textarea {...fieldAttributes(key,errors,false,key!=='age')} value={persona[key]} onChange={e=>setPersona(p=>({...p,[key]:e.target.value}))}/>:<input {...fieldAttributes(key,errors,false,key!=='age')} value={persona[key]} onChange={e=>setPersona(p=>({...p,[key]:e.target.value}))}/>}</Field>;
 const data=(fields:readonly string[],item:object,labels=true)=><dl>{fields.map(key=><div key={key}><dt>{labels?label(key):tr(key)}</dt><dd>{String((item as Record<string,unknown>)[key]||tr('noValue'))}</dd></div>)}</dl>;
 return <div className="project-activities" data-module="research"><PageHead eyebrow={tr('context')} title={tr('researchTitle')} intro={tr('researchIntro')}/><p className="activity-help">{tr('relationshipHelp')}</p>
  <p role="status" ref={message} tabIndex={-1} className={notice?'activity-notice':''}>{notice&&<span key={noticeEvent.seq}>{tr(notice)}</span>}</p>
  {view==='list'&&<><h2 ref={title} tabIndex={-1}>{tr('personas')}</h2><button className="primary" onClick={()=>openPersona()}>{tr('newPersona')}</button>{!state.personas.length?<p>{tr('emptyPersonas')}</p>:<div className="activity-records">{state.personas.map(p=><article className="activity-record" key={p.id} data-persona={p.id}><h3>{p.name}</h3><p>{p.goal}</p><p>{tr('basis')}: {tr(p.basis==='assumed'?'assumed':p.basis||'unknown')}</p><div className="activity-actions"><button className="secondary" onClick={()=>openPersona(p,true)}>{tr('view')}</button><button className="secondary" onClick={()=>openPersona(p)}>{tr('edit')}</button><button className="secondary" onClick={()=>askDelete('persona',p)}>{tr('delete')}</button></div></article>)}</div>}
   <section className="section-block"><h2>{tr('scenarios')}</h2><p>{tr('scenarioHelp')}</p><button className="primary" onClick={()=>openScenario()}>{tr('newScenario')}</button>{!state.personas.length&&<p>{tr('noPersonas')}</p>}{!state.scenarios.length?<p>{tr('emptyScenarios')}</p>:<div className="activity-records">{state.scenarios.map(s=><article className="activity-record" key={s.id} data-scenario={s.id}><h3>{s.title}</h3>{s.fictional&&<p>{tr('fictional')}</p>}<p>{tr('linked')}: {linkedPersona(s,state.personas)?.name||s.actor||tr('noValue')}</p>{!linkedPersona(s,state.personas)&&<p className="activity-error">{tr('missingLink')}</p>}<p>{s.task}</p><div className="activity-actions"><button className="secondary" onClick={()=>openScenario(s,true)}>{tr('view')}</button><button className="secondary" onClick={()=>openScenario(s)}>{tr('edit')}</button><button className="secondary" onClick={()=>askDelete('scenario',s)}>{tr('delete')}</button></div></article>)}</div>}</section></>}
  {view==='personaForm'&&<form noValidate className="activity-panel" onSubmit={e=>{e.preventDefault();submitPersona();}}><h2 ref={title} tabIndex={-1}>{tr(editing?'editPersona':'newPersona')}</h2><div className="activity-fields">{personFields.map(k=>textField(k,['context','barrier'].includes(k)))}</div>
   <Field name="basis" label={tr('basis')} error={errors.basis&&tr(errors.basis)}><select {...fieldAttributes('basis',errors,false,true)} value={persona.basis||''} onChange={e=>setPersona(p=>({...p,basis:e.target.value as Persona['basis']}))}><option value="">{tr('select')}</option>{['observed','assumed','mixed'].map(k=><option key={k} value={k}>{tr(k)}</option>)}</select></Field>
   {(['observed','assumptions'] as const).map(k=><Field key={k} name={k} label={tr(k==='observed'?'observations':k)} error={errors[k]&&tr(errors[k])}><textarea {...fieldAttributes(k,errors,false,persona.basis==='mixed'||(k==='observed'?persona.basis==='observed':persona.basis==='assumed'))} value={persona[k]||''} onChange={e=>setPersona(p=>({...p,[k]:e.target.value}))}/></Field>)}
   <details open={!!errors.emotionSource||undefined}><summary>{tr('empathy')}</summary><p>{tr('empathyHelp')}</p><div className="activity-fields">{empathyFields.map(k=><Field key={k} name={k} label={tr(k)}><textarea id={k} value={persona.empathy[k]} onChange={e=>setPersona(p=>({...p,empathy:{...p.empathy,[k]:e.target.value}}))}/></Field>)}</div><Field name="emotionSource" label={tr('emotionSource')} error={errors.emotionSource&&tr(errors.emotionSource)}><select {...fieldAttributes('emotionSource',errors,false,!!persona.empathy.feels.trim()&&(!editing||state.personas.find(p=>p.id===persona.id)?.empathy.feels!==persona.empathy.feels))} value={persona.emotionSource||''} onChange={e=>setPersona(p=>({...p,emotionSource:e.target.value as Persona['emotionSource']||undefined}))}><option value="">{tr('select')}</option>{['observed','declared'].map(k=><option key={k} value={k}>{tr(k)}</option>)}</select></Field></details>
   {!!Object.keys(errors).length&&<p role="alert">{tr('errors')}</p>}<div className="activity-actions"><button type="submit" className="primary">{tr('save')}</button><button type="button" className="secondary" onClick={()=>back(true)}>{tr('cancel')}</button><button type="button" className="secondary" onClick={()=>back(true)}>{tr('back')}</button></div></form>}
  {view==='scenarioForm'&&<form noValidate className="activity-panel" onSubmit={e=>{e.preventDefault();submitScenario();}}><h2 ref={title} tabIndex={-1}>{tr(editing?'editScenario':'newScenario')}</h2><p>{tr('scenarioHelp')}</p>
   {!editing&&<button type="button" className="secondary" onClick={()=>setScenario(s=>({...s,title:tr('exampleTitle'),context:tr('exampleContext'),task:tr('exampleTask'),constraint:tr('exampleConstraint'),success:tr('exampleSuccess'),fictional:true}))}>{tr('example')}</button>}{scenario.fictional&&<p>{tr('fictional')}</p>}
   <Field name="personaId" label={tr('linked')} error={errors.personaId&&tr(errors.personaId)}><select {...fieldAttributes('personaId',errors,false,true)} value={scenario.personaId||''} onChange={e=>setScenario(s=>({...s,personaId:e.target.value||undefined}))}><option value="">{tr('select')}</option>{state.personas.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></Field>
   {scenarioFields.map(k=><Field key={k} name={k} label={k==='context'?tr('context'):tr(k)} error={errors[k]&&tr(errors[k])}>{k==='title'?<input {...fieldAttributes(k,errors,false,true)} value={scenario[k]} onChange={e=>setScenario(s=>({...s,[k]:e.target.value}))}/>:<textarea {...fieldAttributes(k,errors,false,true)} value={scenario[k]} onChange={e=>setScenario(s=>({...s,[k]:e.target.value}))}/>}</Field>)}
   {!!Object.keys(errors).length&&<p role="alert">{tr('errors')}</p>}<div className="activity-actions"><button className="primary" type="submit">{tr('save')}</button><button className="secondary" type="button" onClick={()=>back(true)}>{tr('cancel')}</button><button className="secondary" type="button" onClick={()=>back(true)}>{tr('back')}</button></div></form>}
  {view==='personaDetail'&&<section className="activity-panel"><h2 ref={title} tabIndex={-1}>{persona.name}</h2>{data(personFields,persona)}<p>{tr('basis')}: {tr(persona.basis||'unknown')}</p>{data(['observed','assumptions'],{observed:persona.observed||'',assumptions:persona.assumptions||''})}<h3>{tr('empathy')}</h3><p>{tr('empathyHelp')}</p>{data(empathyFields,persona.empathy,false)}<p>{tr('emotionSource')}: {tr(persona.emotionSource||'unknown')}</p><div className="activity-actions"><button className="secondary" onClick={()=>setView('personaForm')}>{tr('edit')}</button><button className="secondary" onClick={()=>back()}>{tr('back')}</button></div></section>}
  {view==='scenarioDetail'&&<section className="activity-panel"><h2 ref={title} tabIndex={-1}>{scenario.title}</h2>{scenario.fictional&&<p>{tr('fictional')}</p>}<p>{tr('linked')}: {linkedPersona(scenario,state.personas)?.name||scenario.actor}</p>{!linkedPersona(scenario,state.personas)&&<p>{tr('missingLink')}</p>}{data(scenarioFields,scenario,false)}<div className="activity-actions"><button className="secondary" onClick={()=>openScenario(scenario)}>{tr('edit')}</button><button className="secondary" onClick={()=>back()}>{tr('back')}</button></div></section>}
  {deleting&&<Confirmation title={tr('deleteTitle')} text={t('projectActivities.deleteQuestion',{name:deleting.name})} confirm={tr('delete')} onCancel={()=>{setDeleting(null);setNotice('unchanged');}} onConfirm={()=>{if(deleting.type==='persona')removePersona(deleting.id);else removeScenario(deleting.id);setDeleting(null);setNotice('deleted');}}/>}
 </div>;
}
