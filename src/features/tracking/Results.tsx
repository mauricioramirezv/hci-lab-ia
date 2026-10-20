import {useTranslation} from 'react-i18next';
import type { PageSession } from './pageSession';
import { areaSummary } from './pageSession';
import { download } from '../../shared/files';
import type {Capture} from './session';
import {sessionCSV} from './session';
export function SessionResults({session:s,exportable=false,textual=true}:{session:Capture|PageSession;exportable?:boolean;textual?:boolean}){
 const {t}=useTranslation(),tr=(k:string)=>t(`trackingUX.${k}`);
 const zones:Record<string,string>={intro:tr('exampleTitle'),services:tr('service'),request:tr('request'),help:tr('help'),end:tr('end')};
 return <section className="tracking-results" data-no-track><dl className="tracking-metrics">{[[tr('clicks'),s.clickCount??s.clicks.length],[tr('wheel'),s.wheelEvents??0],[tr('scroll'),Math.max(0,s.scroll.length-1)],[tr('depth'),`${s.maxDepth.toFixed(1)}%`],[tr('duration'),s.seconds.toFixed(1)]].map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><p>{tr('scrollWarning')}</p>{s.capped&&<p role="alert">{tr('cap')}</p>}
 {textual&&<details><summary>{tr('textual')}</summary>{(['clicks','pointer','simulation','gaze'] as const).map(ch=><section key={ch}><h3>{tr(ch)} · {s[ch].length}</h3>{s[ch].length?<><ul>{areaSummary(s[ch]).map(row=><li key={row.area}>{zones[row.area]||row.area}: {row.count}</li>)}</ul><p>{t('trackingUX.position',{x:Math.round(s[ch].at(-1)!.x),y:Math.round(s[ch].at(-1)!.y)})}</p></>:<p>{tr('noSamples')}</p>}</section>)}<h3>{tr('evolution')}</h3><ol>{s.scroll.slice(-20).map((p,i)=><li key={i}>{(p.at/1000).toFixed(1)} s · {Math.round(p.top)} px · {p.depth.toFixed(1)}%</li>)}</ol>{s.validation&&<p>{tr('error')}: {s.validation.medianErrorPx}px · {tr('predictions')}: {s.validation.sampleCount}</p>}</details>}
 {exportable&&<div className="tracking-actions"><button onClick={()=>download('hci-seguimiento-ux.json',JSON.stringify(s,null,2),'application/json')}>{tr('json')}</button><button onClick={()=>download('hci-seguimiento-ux.csv',sessionCSV(s),'text/csv;charset=utf-8')}>{tr('csv')}</button></div>}</section>;
}
export function TrackingRecords({records}:{records:PageSession[]}){
 const {t}=useTranslation();
 return <section className="panel tracking-records" data-no-track><h2>{t('trackingUX.records')} · {records.length}</h2>{!records.length&&<p>{t('trackingUX.empty')}</p>}{records.slice().reverse().map(s=><details key={s.id}><summary>{s.createdAt} · {s.participant||t('trackingUX.noAlias')} · {s.task} · {t(`trackingUX.${s.target||'page'}`)}</summary><p>{s.route} · {(s.exampleCondition||s.prototype)&&<>{s.exampleCondition?t(`trackingUX.${s.exampleCondition}`):s.prototype} · </>}{s.width} × {s.height}px</p><p>{s.notes}</p><SessionResults session={s} exportable/></details>)}</section>;
}
