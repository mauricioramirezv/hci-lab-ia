import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { concepts as previousConcepts } from '../data';
import { PageHead } from '../ui';
import { useProject } from '../store';
import { ConceptActivityRunner } from './concepts/Activity';
import { conceptGroups, conceptIds, blankDraft, normalizeSearch } from './concepts/model';
import type { ConceptDraft } from './concepts/model';
import { conceptResources } from './concepts/locales';
import './concepts/styles.css';

const recordIndex=(name:string,id?:string)=>id?conceptIds.findIndex(key=>key===id):previousConcepts.findIndex((item,index)=>item[0]===name||Object.values(conceptResources).some(resource=>resource.concepts[index].name===name));
export function Concepts() {
  const {t,i18n}=useTranslation();
  const tr=(key:string,values?:Record<string,unknown>)=>t(`conceptLab.ui.${key}`,values);
  const text=(index:number,key:string)=>t(`conceptLab.concepts.${index}.${key}`);
  const {state}=useProject();
  const [topic,setTopic]=useState('all'),[query,setQuery]=useState(''),[selected,setSelected]=useState<number>();
  const [drafts,setDrafts]=useState<Record<number,ConceptDraft>>({}),[showEvidence,setShowEvidence]=useState(false);
  const [answer,setAnswer]=useState(''),[checked,setChecked]=useState(false),[diagnosisError,setDiagnosisError]=useState(false);
  const evidenceHeading=useRef<HTMLHeadingElement>(null),diagnosisInput=useRef<HTMLSelectElement>(null),catalogSearch=useRef<HTMLInputElement>(null);
  const matches=(index:number)=>normalizeSearch([text(index,'name'),text(index,'description'),text(index,'learn')].join(' ')).includes(normalizeSearch(query));
  const visible=conceptGroups.flatMap((indices,group)=>topic==='all'||Number(topic)===group?indices.filter(matches):[]);
  const viewEvidence=()=>{setShowEvidence(true);requestAnimationFrame(()=>evidenceHeading.current?.focus());};
  const back=()=>{const old=selected;setSelected(undefined);requestAnimationFrame(()=>{const opener=document.getElementById(`open-concept-${old}`);if(opener)opener.focus();else catalogSearch.current?.focus();});};
  const records=(state.evidence||[]).filter(e=>e.kind==='concept'&&!e.demo&&recordIndex(e.task,e.concept?.id)>=0);
  const findings=state.findings.filter(f=>recordIndex(f.heuristic)>=0);
  return <div className="concept-module">
    <PageHead eyebrow={tr('eyebrow')} title={tr('title')} intro={tr('intro')}/>
    <div className="concept-actions"><button className="secondary" aria-expanded={showEvidence} aria-controls="concept-evidence" onClick={()=>showEvidence?setShowEvidence(false):viewEvidence()}>{tr(showEvidence?'hideEvidence':'evidence')}</button></div>
    {selected===undefined?<>
      <div className="concept-filters"><label>{tr('topic')}<select value={topic} onChange={e=>setTopic(e.target.value)}><option value="all">{tr('allTopics')}</option>{conceptGroups.map((_,i)=><option key={i} value={i}>{t(`conceptLab.groups.${i}`)}</option>)}</select></label><label>{tr('search')}<input ref={catalogSearch} type="search" value={query} aria-describedby="concept-search-help" onChange={e=>setQuery(e.target.value)}/></label><button className="secondary" onClick={()=>{setTopic('all');setQuery('');}}>{tr('clear')}</button></div>
      <p id="concept-search-help" className="fine-print">{tr('searchHint')}</p><p role="status">{tr('count',{count:visible.length})}</p>
      {!visible.length&&<p className="concept-empty">{tr('noMatches')}</p>}
      {conceptGroups.map((indices,group)=>{
        const cards=indices.filter(index=>visible.includes(index));
        return cards.length?<section className="concept-topic section-block" key={group}><h2>{t(`conceptLab.groups.${group}`)}</h2><div className="concept-catalog-grid">{cards.map(index=><article className="concept-catalog-card" key={conceptIds[index]} data-concept={conceptIds[index]}><h3>{text(index,'name')}</h3><p>{text(index,'description')}</p><h4>{tr('learn')}</h4><p>{text(index,'learn')}</p><button id={`open-concept-${index}`} className="secondary" onClick={()=>setSelected(index)}>{tr('open',{name:text(index,'name')})}</button></article>)}</div></section>:null;
      })}
      <section className="panel concept-diagnosis" aria-labelledby="concept-diagnosis-title"><h2 id="concept-diagnosis-title">{tr('diagTitle')}</h2><p>{t('conceptLab.diagnosis.situation')}</p><p>{t('conceptLab.diagnosis.question')}</p>
        <form onSubmit={e=>{e.preventDefault();if(!answer){setDiagnosisError(true);setChecked(false);diagnosisInput.current?.focus();return;}setDiagnosisError(false);setChecked(true);}}>
          <label>{tr('diagAnswer')}<select ref={diagnosisInput} value={answer} aria-invalid={diagnosisError||undefined} aria-describedby={diagnosisError?'concept-diagnosis-error':undefined} onChange={e=>{setAnswer(e.target.value);setChecked(false);setDiagnosisError(false);}}><option value="">{tr('choose')}</option>{[0,1,2].map(index=><option key={index} value={String(index+1)}>{t(`conceptLab.diagnosis.options.${index}`)}</option>)}</select></label>
          <div className="concept-actions"><button className="primary" type="submit">{tr('check')}</button><button className="secondary" type="button" onClick={()=>{setAnswer('');setChecked(false);setDiagnosisError(false);diagnosisInput.current?.focus();}}>{tr('retry')}</button></div>
        </form>
        {diagnosisError&&<p id="concept-diagnosis-error" role="alert">{tr('noAnswer')}</p>}
        {checked&&<div className="concept-feedback" role="status"><h3>{tr(answer==='1'?'correctAnswer':'reviewAnswer')}</h3><p>{t(`conceptLab.diagnosis.explanations.${Number(answer)-1}`)}</p><h4>{tr('correction')}</h4><p>{t('conceptLab.diagnosis.correction')}</p></div>}
      </section>
    </>:<ConceptActivityRunner index={selected} draft={drafts[selected]||blankDraft()} onDraft={next=>setDrafts(current=>({...current,[selected]:next}))} onBack={back} onEvidence={viewEvidence}/>}
    {showEvidence&&<section id="concept-evidence" className="panel concept-evidence" aria-labelledby="concept-evidence-title"><h2 ref={evidenceHeading} id="concept-evidence-title" tabIndex={-1} className="concept-focus">{tr('evidenceTitle')}</h2><p>{tr('savedText')}</p>
      {!records.length&&!findings.length&&<p>{tr('noEvidence')}</p>}
      {records.map(record=>{
        const index=recordIndex(record.task,record.concept?.id);
        const rawCondition=normalizeSearch(record.condition);
        const knownGood=['good','buena',...Object.values(conceptResources).map(resource=>normalizeSearch(resource.ui.good))].includes(rawCondition);
        const knownBad=['bad','antipatron','mala',...Object.values(conceptResources).map(resource=>normalizeSearch(resource.ui.bad))].includes(rawCondition);
        const condition=knownGood?tr('good'):knownBad?tr('bad'):record.condition;
        const counter=record.scores.interactions??record.scores.clicks;
        const date=new Date(record.createdAt);
        return <article className="concept-evidence-record" key={record.id}><h3>{text(index,'name')} · {condition}</h3><p>{record.participant||tr('noAlias')} · {tr('recordDate',{date:Number.isNaN(date.getTime())?record.createdAt:date.toLocaleString(i18n.language)})}</p>
          {record.concept?<p>{tr(record.concept.outcome)}</p>:<p>{tr('legacy')}</p>}
          <ul className="concept-metrics">{record.scores.seconds!==undefined&&<li>{tr('seconds',{value:record.scores.seconds.toLocaleString(i18n.language,{maximumFractionDigits:2})})}</li>}{counter!==undefined&&<li>{tr('interactions',{value:counter})}</li>}{record.scores.errors!==undefined&&<li>{tr('errors',{value:record.scores.errors})}</li>}</ul>
          {['emotionBefore','emotionAfter','confidenceBefore','confidenceAfter'].map(key=>record.scores[key]!==undefined&&<p key={key}>{tr(key)}: {record.scores[key]}/5</p>)}
          {record.scores.emotion!==undefined&&<p>{tr('legacyRating')}: {record.scores.emotion}/5</p>}
          {record.concept?.response.decision&&<p>{tr('decision')}: {tr(record.concept.response.decision)}</p>}
          {record.concept&&(['text','reason','edit'] as const).map(key=>record.concept!.response[key]&&<div key={key}><h4>{tr(key==='text'?'taskText':key)}</h4><p className="concept-user-text">{record.concept!.response[key]}</p></div>)}
          <h4>{tr('notes')}</h4><p className="concept-user-text">{record.notes||tr('noNotes')}</p>
        </article>;
      })}
      {findings.map(finding=><article className="concept-evidence-record" key={finding.id}><h3>{tr('observationRecord')}: {text(recordIndex(finding.heuristic),'name')}</h3><p>{tr(finding.status)}</p><p className="concept-user-text">{finding.problem}</p></article>)}
    </section>}
  </div>;
}
