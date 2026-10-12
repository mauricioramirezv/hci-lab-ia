import type { PagePoint, PageSession } from '../../enhancements/model';
import { csvCell } from '../../enhancements/model';
import { contentPoint, POINT_LIMIT } from './model';
import { trackingResources } from './locales';
export type Capture = Omit<PageSession,'id'|'createdAt'>;
export type TrackingMode='cursor'|'F'|'Gutenberg'|'none';
export type TrackingChannel='clicks'|'pointer'|'simulation'|'gaze';
export function interactionArea(element:Element):string {
 const tagged=element.closest('[data-aoi]');if(tagged)return tagged.getAttribute('data-aoi')||'area';
 const control=element.closest('button,a,input,select,textarea')||element;
 const parts:string[]=[];let node:Element|null=control;
 while(node&&node.id!=='main-content'&&parts.length<5){const tag=node.tagName.toLowerCase();const siblings=node.parentElement?[...node.parentElement.children].filter(e=>e.tagName===node?.tagName):[];parts.unshift(`${tag}:${siblings.indexOf(node)+1}`);node=node.parentElement;}
 return parts.join('/'); // No text, IDs, input values or label contents are collected.
}
export function pointPosition(x:number,y:number,pane:HTMLElement|null,target:'example'|'page'){
 return target==='example'&&pane?contentPoint(x,y,pane.getBoundingClientRect(),pane.scrollLeft,pane.scrollTop,pane.clientLeft,pane.clientTop):{x:x+window.scrollX,y:y+window.scrollY};
}
export function appendSample(session:Capture,channel:TrackingChannel,point:PagePoint){
 if(channel==='clicks')session.clickCount=(session.clickCount??session.clicks.length)+1;
 if(session[channel].length<POINT_LIMIT)session[channel].push(point);else session.capped=true;
}
export const calibrationTargets=[[10,12],[50,12],[90,12],[10,50],[50,50],[90,50],[10,88],[50,88],[90,88]];
export const independentTargets=[[25,25],[75,25],[45,45],[25,75],[75,75]];
export function simulationPosition(mode:TrackingMode,phase:number){
 const path=mode==='F'?[[.12,.15],[.4,.15],[.85,.15],[.12,.15],[.12,.35],[.6,.35],[.12,.35],[.12,.85]]:[[.12,.15],[.35,.3],[.5,.5],[.65,.7],[.85,.85]];
 const i=Math.floor(phase)%path.length,j=(i+1)%path.length,f=phase%1;
 return {x:path[i][0]*(1-f)+path[j][0]*f,y:path[i][1]*(1-f)+path[j][1]*f};
}
export function sessionCSV(session:Capture|PageSession){
 const rows:unknown[][]=[['channel','x','y','ms','weight','route','area','source','depth','direction','mode']];
 for(const key of ['target','coordinateSystem','participant','task','seconds','clickCount','wheelEvents','maxDepth','notes','validation'] as const)rows.push(['metadata','','','','',session.route,key,JSON.stringify(session[key]??''),'','','']);
 for(const channel of ['clicks','pointer','simulation','gaze'] as const)for(const p of session[channel])rows.push([channel,p.x,p.y,p.at,p.weight,p.route??session.route,p.area,p.source,'','','']);
 for(const s of session.scroll)rows.push(['scroll','',s.top,s.at,'',session.route,'','',s.depth,s.direction,'']);
 for(const m of session.modeChanges||[])rows.push(['mode','','',m.at,'',session.route,'','','','',m.mode]);
 return rows.map(r=>r.map(csvCell).join(',')).join('\n');
}
export function trackingMarkdown(s:PageSession,language:string){
 const r=trackingResources[language as keyof typeof trackingResources]||trackingResources['es-CO'];
 return [`### ${r.records}: ${s.task}`,`${r.alias}: ${s.participant||r.noAlias}`,`${r.target}: ${r[s.target||'page']} · ${s.route}`,`${r.duration}: ${s.seconds.toFixed(1)}`,`${r.clicks}: ${s.clickCount??s.clicks.length}`,`${r.wheel}: ${s.wheelEvents??0}`,`${r.scroll}: ${Math.max(0,s.scroll.length-1)}`,`${r.depth}: ${s.maxDepth.toFixed(1)}%`,`${r.mode}: ${(s.modeChanges||[]).map(m=>`${r[m.mode]} (${(m.at/1000).toFixed(1)} s)`).join(' → ')}`,`${r.pointer}: ${s.pointer.length} · ${r.simulation}: ${s.simulation.length} · ${r.gaze}: ${s.gaze.length}`,...(s.validation?[`${r.error}: ${s.validation.medianErrorPx}px · ${r.predictions}: ${s.validation.sampleCount}`]:[]),`${r.notes}: ${s.notes}`,r.scrollWarning,...(s.capped?[r.cap]:[])].join('\n');
}
