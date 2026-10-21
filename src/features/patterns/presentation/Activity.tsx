import { missingObservation, observationExists, recordObservation } from '../index';
import {useEffect,useRef,useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';
import {useProject} from '../../project/presentation';
import {patternIds} from '../domain/model';
import type {PatternDraft} from '../domain/model';
import {PatternExample} from './Examples';
type Props={index:number;draft:PatternDraft;onDraft:(draft:PatternDraft)=>void;onBack:()=>void};
export function PatternActivity({index,draft,onDraft,onBack}:Props){
  const {t}=useTranslation(),{state,addEvidence}=useProject();const tr=(key:string)=>t(`patternLab.ui.${key}`),text=(key:string)=>t(`patternLab.patterns.${index}.${key}`);
  const [good,setGood]=useState(true),[epoch,setEpoch]=useState(0),[message,setMessage]=useState(''),[missing,setMissing]=useState('');
  const title=useRef<HTMLHeadingElement>(null),problem=useRef<HTMLTextAreaElement>(null),principle=useRef<HTMLInputElement>(null),correction=useRef<HTMLTextAreaElement>(null);
  useEffect(()=>{title.current?.focus();},[]);
  const condition=good?'good':'bad',id=patternIds[index];
  const saved=observationExists(state.evidence||[],id,condition,draft);
  const update=(key:keyof PatternDraft,value:string)=>{onDraft({...draft,[key]:value});setMessage('');setMissing('');};
  const reset=(changed=false)=>{setEpoch(value=>value+1);setMessage(changed?'changed':'restarted');setMissing('');};
  return <section className="pattern-activity panel" aria-labelledby="pattern-activity-title">
    <div className="pattern-activity-heading"><h2 id="pattern-activity-title" ref={title} tabIndex={-1} className="pattern-focus">{text('name')}</h2><label>{tr('condition')}<select value={condition} aria-describedby="pattern-condition-help" onChange={e=>{setGood(e.target.value==='good');reset(true);}}><option value="good">{tr('good')}</option><option value="bad">{tr('bad')}</option></select></label></div>
    <p id="pattern-condition-help" className="fine-print">{tr('conditionHelp')}</p>
    <h3>{tr('instructions')}</h3><p>{text('instructions')}</p><p><strong>{tr(good?'good':'bad')}: </strong>{text(good?'good':'bad')}</p><h3>{tr('heuristic')}</h3><p>{text('heuristic')}</p><p>{text('explanation')}</p><p><strong>{tr('recommendation')}: </strong>{text('recommendation')}</p>
    <PatternExample key={epoch} id={id} good={good} draft={draft} onDraft={onDraft}/>
    <div className="pattern-actions"><button className="secondary" onClick={()=>reset()}>{tr('restart')}</button></div>
    <form className="pattern-observation" noValidate onSubmit={e=>{e.preventDefault();const key=missingObservation(draft);if(key){setMissing(key);setMessage('required');({problem,principle,correction}[key]).current?.focus();return;}if(saved)return;if(!recordObservation(addEvidence,{id,draft,condition,task:text('name')}))return;setMissing('');setMessage('saved');}}>
      <h3>{tr('observation')}</h3><p>{tr('observationHelp')}</p><label>{tr('alias')}<input value={draft.alias} onChange={e=>update('alias',e.target.value)} aria-describedby="pattern-alias-help"/></label><p id="pattern-alias-help" className="fine-print">{tr('aliasHelp')}</p>
      <label>{tr('identified')}<textarea ref={problem} value={draft.problem} onChange={e=>update('problem',e.target.value)} aria-invalid={missing==='problem'||undefined} aria-describedby={missing==='problem'?'pattern-message':undefined}/></label>
      <label>{tr('principle')}<input ref={principle} value={draft.principle} onChange={e=>update('principle',e.target.value)} aria-invalid={missing==='principle'||undefined} aria-describedby={missing==='principle'?'pattern-message':undefined}/></label>
      <label>{tr('correction')}<textarea ref={correction} value={draft.correction} onChange={e=>update('correction',e.target.value)} aria-invalid={missing==='correction'||undefined} aria-describedby={missing==='correction'?'pattern-message':undefined}/></label>
      <div className="pattern-actions"><button className="primary" type="submit" disabled={saved}>{tr('save')}</button><Link to="/reports">{tr('reports')}</Link></div>{saved&&<p>{tr('alreadySaved')}</p>}
    </form>
    {message&&<p id="pattern-message" role={missing?'alert':'status'} className="pattern-message">{tr(message)}</p>}
    <div className="pattern-actions"><button className="secondary" onClick={onBack}>{tr('back')}</button></div>
  </section>;
}
