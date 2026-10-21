import {useRef,useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';
import {PageHead} from '../../../shared/ui/Page';
import {useProject} from '../../project/presentation';
import {PatternActivity} from './Activity';
import {blankPatternDraft,patternIds,patternSearch} from '../domain/model';
import type {PatternDraft} from '../domain/model';
import '../styles.css';
export function Patterns(){
  const {t}=useTranslation(),{state}=useProject();const tr=(key:string,values?:Record<string,unknown>)=>t(`patternLab.ui.${key}`,values),text=(index:number,key:string)=>t(`patternLab.patterns.${index}.${key}`);
  const [category,setCategory]=useState('all'),[query,setQuery]=useState(''),[selected,setSelected]=useState<number>(),[drafts,setDrafts]=useState<Record<number,PatternDraft>>({});
  const [alias,setAlias]=useState(()=>[...(state.evidence||[])].reverse().find(e=>e.participant.trim())?.participant||'');
  const search=useRef<HTMLInputElement>(null);
  const visible=patternIds.map((_,index)=>index).filter(index=>(category==='all'||Number(category)===index)&&patternSearch(['name','problem','when','heuristic'].map(key=>text(index,key)).join(' ')).includes(patternSearch(query)));
  const back=()=>{const index=selected;setSelected(undefined);requestAnimationFrame(()=>{const button=document.getElementById(`open-pattern-${index}`);if(button)button.focus();else search.current?.focus();});};
  return <div className="pattern-module"><PageHead eyebrow={tr('eyebrow')} title={tr('title')} intro={tr('intro')}/>
    {selected===undefined?<><div className="pattern-actions"><Link to="/reports">{tr('reports')}</Link></div><div className="pattern-filters"><label>{tr('category')}<select value={category} onChange={e=>setCategory(e.target.value)}><option value="all">{tr('all')}</option>{patternIds.map((id,index)=><option key={id} value={index}>{t(`patternLab.categories.${index}`)}</option>)}</select></label><label>{tr('search')}<input ref={search} type="search" value={query} aria-describedby="pattern-search-help" onChange={e=>setQuery(e.target.value)}/></label><button className="secondary" onClick={()=>{setCategory('all');setQuery('');}}>{tr('clear')}</button></div><p id="pattern-search-help" className="fine-print">{tr('searchHelp')}</p><p role="status">{tr('count',{count:visible.length})}</p>{!visible.length&&<p className="pattern-message">{tr('empty')}</p>}
      <div className="pattern-catalog-grid">{visible.map(index=><article className="pattern-card" key={patternIds[index]} data-pattern={patternIds[index]}><p className="eyebrow">{t(`patternLab.categories.${index}`)}</p><h2>{text(index,'name')}</h2>{(['problem','when','good','bad','heuristic','explanation','recommendation'] as const).map(key=><div key={key}><h3>{tr(key)}</h3><p>{text(index,key)}</p></div>)}<button id={`open-pattern-${index}`} className="secondary" onClick={()=>setSelected(index)}>{tr('open',{name:text(index,'name')})}</button></article>)}</div>
    </>:<PatternActivity index={selected} draft={drafts[selected]||blankPatternDraft(alias)} onDraft={next=>{setAlias(next.alias);setDrafts(current=>({...current,[selected]:next}));}} onBack={back}/>}
  </div>;
}
