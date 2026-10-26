import {ExpandableCard} from '../../../shared/ui/ExpandableCard';
import {useEffect,useRef,useState} from 'react';
import {useTranslation} from 'react-i18next';
import {PageHead} from '../../../shared/ui/Page';
import {useProject} from '../../project/presentation';
import {useTracker} from './context';
import {TrackingControls} from './Controls';
import {TrackingRecords,SessionResults} from './Results';
import {Heatmap} from './Heatmap';
export function TrackingPage(){
 const x=useTracker(),{state}=useProject(),{t}=useTranslation(),tr=(k:string)=>t(`trackingUX.${k}`),pane=useRef<HTMLDivElement>(null),content=useRef<HTMLDivElement>(null),[status,setStatus]=useState(''),[service,setService]=useState('advice'),[description,setDescription]=useState('');
 const register=x.register;
 useEffect(()=>{register(pane.current,content.current);return()=>register(null,null);},[register]);
 const session=x.session?.target==='example'?x.session:null;
 const marker=x.channel==='gaze'?session?.gaze.at(-1):((x.mode==='cursor'&&x.channel==='pointer')||(x.mode!=='cursor'&&x.mode!=='none'&&x.channel==='simulation'))?x.dot:null;
 return <div className="tracking-page"><PageHead eyebrow="HCI · UX" title={tr('title')} intro={tr('intro')}/><ol className="tracking-flow" data-no-track>{['prepare','start','interact','stop','review','save'].map(k=><li key={k}>{tr(k)}</li>)}</ol><ExpandableCard id="tracking-prepare" title={tr('prepare')}><TrackingControls showTitle={false}/></ExpandableCard>
 <ExpandableCard id="tracking-example" title={`${tr('exampleTitle')} · ${tr(x.condition)}`}><p>{tr('exampleIntro')}</p>{x.condition==='bad'&&<p data-no-track>{tr('badHelp')}</p>}
 <div ref={pane} className="tracking-viewport" role="region" tabIndex={0} aria-label={tr('example')}><div ref={content} className={`tracking-content ${x.condition}`}>
 <div className="tracking-demo-heading" data-aoi="intro"><h3>{tr('service')}</h3><p>{tr('exampleIntro')}</p><button onClick={()=>pane.current?.scrollTo({top:440,behavior:'auto'})}>{tr('jump')}</button></div>
 <section className="tracking-demo-section" data-aoi="services"><h3>{tr('service')}</h3><div className="tracking-demo-options"><button onClick={()=>setService('advice')} aria-pressed={service==='advice'}>{x.condition==='bad'?'A':tr('advice')}</button><button onClick={()=>setService('accessibility')} aria-pressed={service==='accessibility'}>{x.condition==='bad'?'B':tr('accessibility')}</button></div></section>
 <section className="tracking-demo-section" data-aoi="request"><h3>{tr('request')}</h3><form onSubmit={e=>{e.preventDefault();setStatus('requestDone');}}><label>{tr('text')}<input value={description} onChange={e=>setDescription(e.target.value)} autoComplete="off"/></label><label>{tr('service')}<select value={service} onChange={e=>setService(e.target.value)}><option value="advice">{tr('advice')}</option><option value="accessibility">{tr('accessibility')}</option></select></label><div className="tracking-actions"><button type="submit">{tr('confirm')}</button><button type="button" className="secondary" onClick={()=>setStatus('requestCancelled')}>{tr('cancelRequest')}</button></div></form><p className="tracking-demo-status" role="status">{status?tr(status):'—'}</p></section>
 <section className="tracking-demo-section" data-aoi="help"><h3>{tr('help')}</h3><p>{tr('helpText')}</p><button className="secondary" onClick={()=>setStatus('helpText')}>{tr('help')}</button></section><section className="tracking-demo-section" data-aoi="end"><h3>{tr('end')}</h3><p>{tr('scrollWarning')}</p><button onClick={()=>pane.current?.scrollTo({top:0,behavior:'auto'})}>{tr('back')}</button></section>
 {session&&<Heatmap points={session[x.channel]} width={session.width} height={session.height} visible={x.show&&x.mapValid}/>} {session&&marker&&x.show&&x.mapValid&&<span className="tracking-path-dot" aria-hidden="true" style={{left:marker.x,top:marker.y}}/>}
 </div></div></ExpandableCard>{x.session&&<ExpandableCard id="tracking-review" title={tr('review')}><SessionResults session={x.session} exportable={!x.running}/></ExpandableCard>}
 <TrackingRecords records={state.pageSessions||[]}/>{!!state.trackingSessions?.length&&<ExpandableCard id="tracking-legacy" title={tr('legacy')} defaultOpen={false}>{state.trackingSessions.map(s=><details key={s.id}><summary>{s.createdAt} · {tr(s.example)} · {s.seconds.toFixed(1)} s · {tr('clicks')}: {s.clicks.length}</summary><p>{s.notes}</p></details>)}</ExpandableCard>}
 </div>;
}
