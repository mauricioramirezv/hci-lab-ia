import type { PagePoint, PageSession } from './pageSession';
import { POINT_LIMIT } from './geometry';
import { csvCell } from '../../../shared/csv';
export type Capture = Omit<PageSession,'id'|'createdAt'>;
export type TrackingMode='cursor'|'F'|'Gutenberg'|'none';
export type TrackingChannel='clicks'|'pointer'|'simulation'|'gaze';
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
