import { recordConcept } from '../application/recordConcept';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useProject } from '../../project/presentation';
import { conceptIds, countsErrors } from '../domain/model';
import type { ConceptDraft } from '../domain/model';

type Props={index:number;draft:ConceptDraft;onDraft:(next:ConceptDraft)=>void;onBack:()=>void;onEvidence:()=>void};
export function ConceptActivityRunner({index,draft,onDraft,onBack,onEvidence}:Props) {
  const {t,i18n}=useTranslation();
  const tr=(key:string,values?:Record<string,unknown>)=>t(`conceptLab.ui.${key}`,values);
  const text=(key:string)=>t(`conceptLab.concepts.${index}.${key}`);
  const id=conceptIds[index];
  const {addEvidence,addFinding}=useProject();
  const [good,setGood]=useState(true),[phase,setPhase]=useState<'instructions'|'trial'|'result'>('instructions');
  const [message,setMessage]=useState(''),[error,setError]=useState(false),[saved,setSaved]=useState(false),[savedObservation,setSavedObservation]=useState('');
  const [result,setResult]=useState<{seconds:number;interactions:number;errors:number;outcome:'completed'|'cancelled'}>();
  const clock=useRef(0),interactions=useRef(0),errors=useRef(0),active=useRef(false),generation=useRef(0),timer=useRef<ReturnType<typeof setTimeout>|undefined>(undefined);
  const focus=useRef<HTMLHeadingElement>(null);
  const [destination,setDestination]=useState(''),[mobile,setMobile]=useState(false),[details,setDetails]=useState(false);
  const [saving,setSaving]=useState(false),[noteSaved,setNoteSaved]=useState(false);
  const [size,setSize]=useState(48),[gap,setGap]=useState(16),[assembly,setAssembly]=useState(false),[listVisible,setListVisible]=useState(true),[kit,setKit]=useState<string[]>([]);
  const [category,setCategory]=useState(''),[context,setContext]=useState('silent'),[channel,setChannel]=useState('audio'),[alternatives,setAlternatives]=useState(true),[decision,setDecision]=useState('');
  const update=(key:keyof ConceptDraft,value:string)=>onDraft({...draft,[key]:value});
  useEffect(()=>{
    const token=generation;
    return()=>{active.current=false;token.current++;clearTimeout(timer.current);};
  },[]);
  useEffect(()=>{focus.current?.focus();},[phase]);
  const prepare=(nextGood=good)=>{
    active.current=false;generation.current++;clearTimeout(timer.current);
    interactions.current=0;errors.current=0;clock.current=0;
    setResult(undefined);setSaved(false);setMessage('');setError(false);setDestination('');setMobile(false);setDetails(false);setSaving(false);setNoteSaved(false);
    setSize(nextGood?48:24);setGap(nextGood?16:4);setAssembly(false);setListVisible(true);setKit([]);setCategory('');setContext('silent');setChannel('audio');setAlternatives(nextGood);setDecision('');
  };
  const start=()=>{prepare();active.current=true;clock.current=performance.now();setPhase('trial');};
  const finish=(outcome:'completed'|'cancelled'='completed',choice?:string)=>{
    if(!active.current)return;
    active.current=false;generation.current++;clearTimeout(timer.current);setSaving(false);
    if(choice!==undefined)setDecision(choice);
    setResult({seconds:Math.max(0,(performance.now()-clock.current)/1000),interactions:interactions.current,errors:errors.current,outcome});setMessage('');setError(false);setPhase('result');
  };
  const interact=(action:()=>void)=>{if(!active.current)return;interactions.current++;setMessage('');setError(false);action();};
  const fail=(key:string)=>{if(countsErrors(id))errors.current++;setMessage(key);setError(true);};
  const ratings=(after:boolean)=><fieldset className="concept-ratings"><legend>{tr('selfReports')}</legend><p>{tr('ratingsHelp')}</p>
    {id==='emotions' && <><label>{tr(after?'emotionAfter':'emotionBefore')}<select value={draft[after?'emotionAfter':'emotionBefore']} onChange={e=>update(after?'emotionAfter':'emotionBefore',e.target.value)}><option value="">{tr('unanswered')}</option>{[1,2,3,4,5].map(n=><option key={n} value={n}>{n}</option>)}</select></label><p className="fine-print">{tr('emotionScale')}</p></>}
    <label>{tr(after?'confidenceAfter':'confidenceBefore')}<select value={draft[after?'confidenceAfter':'confidenceBefore']} onChange={e=>update(after?'confidenceAfter':'confidenceBefore',e.target.value)}><option value="">{tr('unanswered')}</option>{[1,2,3,4,5].map(n=><option key={n} value={n}>{n}</option>)}</select></label><p className="fine-print">{tr('confidenceScale')}</p>
  </fieldset>;
  const save=()=>{
    if(!result || saved)return;
    if(!recordConcept(addEvidence,{id,draft,result,task:text('name'),good,decision}))return;
    setSaved(true);setError(false);setMessage('saved');
  };
  const observationSignature=`${good}:${draft.notes}`;
  const saveObservation=()=>{
    if(!draft.notes.trim()){setMessage('missingNote');setError(true);return;}
    if(!addFinding({heuristic:text('name'),severity:1,problem:draft.notes,evidence:`${text('name')} · ${tr(good?'good':'bad')}`,recommendation:text('correction'),source:'human',status:'pending'}))return;
    setSavedObservation(observationSignature);setMessage('findingSaved');setError(false);
  };
  const labels={museum:tr('museum'),park:tr('park')};
  const choiceButton=(key:string,action:()=>void)=><button type="button" className="secondary" onClick={()=>interact(action)}>{tr(key)}</button>;
  const categoryLabels={music:good||details?'music':'areaA',books:good||details?'books':'areaB',support:good||details?'support':'areaC'};
  return <section className="concept-activity panel" aria-labelledby="concept-activity-title">
    <div className="concept-activity-heading"><h2 id="concept-activity-title">{text('name')}</h2><label>{tr('condition')}<select value={good?'good':'bad'} aria-describedby="concept-condition-help" onChange={e=>{const next=e.target.value==='good';setGood(next);prepare(next);setPhase('instructions');setMessage('conditionReset');}}><option value="good">{tr('good')}</option><option value="bad">{tr('bad')}</option></select></label></div>
    <p id="concept-condition-help" className="fine-print">{tr('conditionHelp')}</p>
    <ol className="concept-steps" aria-label={text('name')}>{(['instructions','trial','result'] as const).map(step=><li key={step} aria-current={phase===step?'step':undefined}>{tr(step)}</li>)}</ol>
    <h3 ref={focus} tabIndex={-1} className="concept-focus">{tr(phase)}</h3>
    <p>{text('instructions')}</p>
    <p><strong>{tr('explanation')}: </strong>{text(good?'good':'bad')}</p>
    {phase==='instructions' && <>{ratings(false)}<div className="concept-actions"><button className="primary" onClick={start}>{tr('start')}</button></div></>}
    {phase==='trial' && <div className="concept-test-area" data-concept={id}>
      <p className="fine-print">{tr('sampleOnly')}</p>
      {id==='ux' && <>
        <div className="concept-sample" data-condition={good?'good':'bad'}><h4>{tr(mobile?'mobile':'desktop')}</h4><p>{destination?`${tr('destination')}: ${labels[destination as keyof typeof labels]}`:tr('noDestination')}</p>{mobile && <p>{tr(good?'handoffKept':'handoffLost')}</p>}</div>
        <label>{tr('destination')}<select value={destination} onChange={e=>interact(()=>setDestination(e.target.value))}><option value="">{tr('choose')}</option><option value="museum">{tr('museum')}</option><option value="park">{tr('park')}</option></select></label>
        <div className="concept-actions"><button className="secondary" disabled={mobile} onClick={()=>interact(()=>{setMobile(true);if(!good)setDestination('');})}>{tr('continueMobile')}</button>{choiceButton('finishTrip',()=>destination==='museum'&&mobile?finish():fail('tripError'))}</div>
      </>}
      {id==='usability' && <>
        {(good||details) && <p className="concept-sample">{tr('planDetails')}</p>}
        <div className="concept-actions">{choiceButton(good?'visit':'planA',()=>finish())}{choiceButton(good?'subscription':'planB',()=>fail('planError'))}{choiceButton('showDetails',()=>setDetails(true))}</div>
      </>}
      {id==='accessibility' && <>
        <div className="concept-sample" data-condition={good?'good':'bad'} role="group" aria-label={tr('notification')}><span className="concept-status-dot" aria-hidden="true"/>{good&&<p>⚠ {tr('interrupted')}</p>}</div>
        <p>{tr('whatStatus')}</p><div className="concept-actions">{choiceButton('interrupted',()=>good?finish():fail('statusError'))}{choiceButton('connected',()=>fail('statusError'))}{choiceButton('unknown',()=>!good?finish():fail('statusError'))}</div>
      </>}
      {id==='awareness' && <>
        <label>{tr('noteLabel')}<textarea value={draft.text} onChange={e=>update('text',e.target.value)}/></label>
        <button className="secondary" disabled={saving||noteSaved} onClick={()=>interact(()=>{if(!draft.text.trim()){fail('writeNote');return;}setSaving(true);const token=generation.current;timer.current=setTimeout(()=>{if(token!==generation.current||!active.current)return;setSaving(false);setNoteSaved(true);},800);})}>{tr('statusSaveAction')}</button>
        <div className="concept-sample" data-condition={good?'good':'bad'}>{good&&<p role="status">{saving?tr('pendingSave'):noteSaved?tr('savedNote'):tr('noteLabel')}</p>}{!good&&<p>{tr('unknownSave')}</p>}</div>
        <div className="concept-actions"><button className="secondary" disabled={!noteSaved} onClick={()=>interact(()=>good?finish():fail('awarenessError'))}>{tr('yesSaved')}</button><button className="secondary" disabled={!noteSaved} onClick={()=>interact(()=>!good?finish():fail('awarenessError'))}>{tr('noConfirmation')}</button></div>
      </>}
      {id==='engagement' && <><div className="concept-sample" data-condition={good?'good':'bad'}><p>{tr(good?'promoteGood':'promoteBad')}</p></div><p>{tr('noticePolicy')}</p><div className="concept-actions">{choiceButton('withNotices',()=>finish('completed','withNotices'))}{choiceButton('withoutNotices',()=>finish('completed','withoutNotices'))}</div></>}
      {id==='emotions' && <><p>{tr('couponRule')}</p><form onSubmit={e=>{e.preventDefault();interact(()=>draft.text.trim().toUpperCase()==='CALMA'?finish():fail('couponError'));}}><label>{tr('coupon')}<input value={draft.text} onChange={e=>update('text',e.target.value)} aria-invalid={error||undefined}/></label><button className="secondary" type="submit">{tr('applyCoupon')}</button></form>{error&&<p className="concept-sample" data-condition={good?'good':'bad'}>{tr(good?'couponGoodError':'couponBadError')}</p>}</>}
      {id==='ergonomics' && <>
        <p>{tr('layoutRule')}</p><label>{tr('targetSize',{value:size})}<input aria-label={tr('targetSize',{value:size})} type="range" min="24" max="80" step="4" value={size} onChange={e=>interact(()=>setSize(Number(e.target.value)))}/></label><label>{tr('targetGap',{value:gap})}<input aria-label={tr('targetGap',{value:gap})} type="range" min="4" max="24" step="4" value={gap} onChange={e=>interact(()=>setGap(Number(e.target.value)))}/></label>
        <div className="concept-target-sample" role="img" aria-label={`${tr('targetPreview')}: ${size} px / ${gap} px`} style={{gap}}>{[0,1,2].map(n=><span key={n} aria-hidden="true" style={{width:size,height:size}}/>)}</div>{choiceButton('checkLayout',()=>size>=44&&gap>=8?finish():fail('layoutError'))}
      </>}
      {id==='cognition' && <>
        {(good||listVisible)&&<p className="concept-sample">{tr('packingList')}</p>}
        {!assembly?choiceButton('continueKit',()=>{setAssembly(true);setListVisible(good);}):<><fieldset><legend>{tr('kit')}</legend>{['water','map','keys','snack'].map(item=><label className="check-row" key={item}><input type="checkbox" checked={kit.includes(item)} onChange={e=>interact(()=>setKit(current=>e.target.checked?[...current,item]:current.filter(x=>x!==item)))}/><span>{tr(item)}</span></label>)}</fieldset><div className="concept-actions">{choiceButton('showList',()=>setListVisible(true))}{choiceButton('checkKit',()=>kit.length===3&&['water','map','keys'].every(item=>kit.includes(item))?finish():fail('kitError'))}</div></>}
      </>}
      {id==='information' && <>
        <div className="concept-actions">{choiceButton('categoryHint',()=>setDetails(true))}</div>
        {!category?<div className="concept-actions">{(['music','books','support'] as const).map(key=><button className="secondary" key={key} onClick={()=>interact(()=>setCategory(key))}>{tr(categoryLabels[key])}</button>)}</div>:<><h4>{tr('category')}: {tr(categoryLabels[category as keyof typeof categoryLabels])}</h4><div className="concept-actions">{(category==='books'?['audiobooks','ebooks']:category==='music'?['albums','playlists']:['contact','faq']).map((key,n)=><button className="secondary" key={key} onClick={()=>interact(()=>key==='audiobooks'?finish():fail('infoError'))}>{tr(good||details?key:n===0?'itemA':'itemB')}</button>)}{choiceButton('categoryBack',()=>setCategory(''))}</div></>}
      </>}
      {id==='universal' && <>
        <label>{tr('context')}<select value={context} onChange={e=>interact(()=>setContext(e.target.value))}><option value="silent">{tr('silent')}</option><option value="oneHand">{tr('oneHand')}</option></select></label>
        <label>{tr('channel')}<select value={channel} onChange={e=>interact(()=>setChannel(e.target.value))}><option value="audio">{tr('audio')}</option>{alternatives&&<><option value="textChannel">{tr('textChannel')}</option><option value="largeControl">{tr('largeControl')}</option></>}</select></label>
        <div className="concept-actions"><button className="secondary" disabled={alternatives} onClick={()=>interact(()=>setAlternatives(true))}>{tr('addAlternative')}</button>{choiceButton('checkChannel',()=>channel===(context==='silent'?'textChannel':'largeControl')?finish():fail('channelError'))}</div>
      </>}
      {id==='responsibleAI' && <>
        <div className="concept-sample" data-condition={good?'good':'bad'}><h4>{tr('proposal')}</h4><p>{tr('proposalText')}</p>{(good||details)?<><h4>{tr('evidenceSource')}</h4><p>{tr('sourceText')}</p></>:<p>{tr('unsupportedProposal')}</p>}</div>
        {choiceButton('sourceReview',()=>setDetails(true))}
        <label>{tr('decision')}<select value={decision} onChange={e=>interact(()=>setDecision(e.target.value))}><option value="">{tr('choose')}</option>{['accept','editDecision','reject'].map(key=><option key={key} value={key}>{tr(key)}</option>)}</select></label>
        {decision==='editDecision'&&<label>{tr('edit')}<textarea value={draft.edit} onChange={e=>update('edit',e.target.value)}/></label>}
        <label>{tr('reason')}<textarea value={draft.reason} onChange={e=>update('reason',e.target.value)}/></label>
        {choiceButton('finishReview',()=>{if(!decision){fail('chooseDecision');return;}if(!draft.reason.trim()){fail('reasonRequired');return;}if(decision==='editDecision'&&!draft.edit.trim()){fail('editRequired');return;}finish();})}
      </>}
      <div className="concept-actions concept-trial-footer"><button className="secondary" onClick={()=>finish('cancelled')}>{tr('cancel')}</button></div>
    </div>}
    {phase==='result'&&result&&<section aria-label={tr('result')}>
      <h4>{tr(result.outcome)}</h4>{result.outcome==='cancelled'&&<p>{tr('cancelledHelp')}</p>}
      <p>{tr('resultCondition',{condition:tr(good?'good':'bad')})}</p>
      <ul className="concept-metrics"><li>{tr('seconds',{value:result.seconds.toLocaleString(i18n.language,{maximumFractionDigits:2})})}</li><li>{tr('interactions',{value:result.interactions})}</li>{countsErrors(id)&&<li>{tr('errors',{value:result.errors})}</li>}</ul>
      {decision&&<p>{tr('decision')}: {tr(decision)}</p>}
      <p>{text('counts')}</p><p>{tr('countHelp')}</p><h4>{tr('correction')}</h4><p>{text('correction')}</p><p className="fine-print">{tr('limits')}</p>
      {ratings(true)}<div className="concept-actions"><button className="primary" disabled={saved} onClick={save}>{tr('saveResults')}</button><button className="secondary" onClick={()=>{prepare();setPhase('instructions');}}>{tr('repeat')}</button><button className="secondary" onClick={onEvidence}>{tr('evidence')}</button></div>{saved&&<p>{tr('alreadySaved')}</p>}
    </section>}
    <section className="concept-observation" aria-labelledby="concept-observation-title"><h3 id="concept-observation-title">{tr('observationTitle')}</h3><label>{tr('alias')}<input value={draft.alias} onChange={e=>update('alias',e.target.value)} aria-describedby="concept-alias-help"/></label><p id="concept-alias-help" className="fine-print">{tr('aliasHelp')}</p><label>{tr('notes')}<textarea value={draft.notes} onChange={e=>update('notes',e.target.value)}/></label><div className="concept-actions"><button className="secondary" disabled={!draft.notes.trim()||savedObservation===observationSignature} onClick={saveObservation}>{tr('saveObservation')}</button><Link to="/evaluation">{tr('viewFindings')}</Link></div></section>
    {message&&<p role={error?'alert':'status'} className="concept-feedback">{tr(message)}</p>}
    <div className="concept-actions"><button className="secondary" onClick={onBack}>{tr('back')}</button></div><p className="fine-print">{tr('backHelp')}</p>
  </section>;
}
