import {useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {useProject} from '../project/store';
import type { Evidence } from '../project/evidence';
import {patternIds} from './model';
import './styles.css';
export function PatternEvidencePanel({records}:{records:Evidence[]}){
  const {t,i18n}=useTranslation(),{removeEvidence}=useProject(),heading=useRef<HTMLHeadingElement>(null);
  const tr=(key:string,values?:Record<string,unknown>)=>t(`patternLab.ui.${key}`,values);
  return <section className="pattern-module panel" aria-labelledby="pattern-evidence-title"><h2 id="pattern-evidence-title" ref={heading} tabIndex={-1} className="pattern-focus">{tr('evidenceTitle')}</h2><p>{tr('recordHelp')}</p>{!records.length&&<p>{tr('noEvidence')}</p>}
    {records.map(record=>{const data=record.pattern;if(!data)return null;const index=patternIds.indexOf(data.id),date=new Date(record.createdAt);return <details className="pattern-record" key={record.id}><summary>{t(`patternLab.patterns.${index}.name`)} · {tr(record.condition==='good'?'good':'bad')} · {record.participant||tr('noAlias')}</summary><p>{tr('recordDate',{date:Number.isNaN(date.getTime())?record.createdAt:date.toLocaleString(i18n.language)})}</p>{(['problem','principle','correction'] as const).map(key=><div key={key}><h3>{tr(key==='problem'?'identified':key)}</h3><p className="pattern-user-text">{data[key]}</p></div>)}<button className="secondary" onClick={()=>{if(window.confirm(tr('deleteConfirm'))){removeEvidence(record.id);requestAnimationFrame(()=>heading.current?.focus());}}}>{tr('delete')}</button></details>;})}
  </section>;
}
