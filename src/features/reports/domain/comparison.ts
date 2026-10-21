import {finite} from './records';
import type {ReportRecord} from './records';
export function comparable(r:ReportRecord){return ['ux','sus','tlx','experiment'].includes(r.type)&&!!r.method&&!!r.task&&Object.keys(r.metrics).length>0;}
const signature=(r:ReportRecord)=>JSON.stringify([r.type,r.task,r.method]);
export function compareGroups(records:ReportRecord[],before:string[],after:string[]){const b=records.filter(r=>before.includes(r.key)),a=records.filter(r=>after.includes(r.key));if(!b.length||!a.length||before.some(id=>after.includes(id))||b.length!==before.length||a.length!==after.length||[...b,...a].some(r=>!comparable(r)||signature(r)!==signature(b[0])))return null;
 const homogeneous=(group:ReportRecord[])=>group.every(r=>r.condition===group[0].condition&&r.version===group[0].version);if(!homogeneous(b)||!homogeneous(a))return null;
 const keys=Object.keys(b[0].metrics).filter(k=>[...b,...a].every(r=>finite(r.metrics[k])));if(!keys.length)return null;
 return {before:b,after:a,values:keys.map(key=>{const bm=b.reduce((sum,r)=>sum+r.metrics[key],0)/b.length,am=a.reduce((sum,r)=>sum+r.metrics[key],0)/a.length;return {key,before:bm,after:am,delta:am-bm};})};
}
export function metricGroups(records:ReportRecord[]){const groups=new Map<string,ReportRecord[]>();records.filter(r=>comparable(r)).forEach(r=>{const key=JSON.stringify([signature(r),r.condition,r.version]);groups.set(key,[...(groups.get(key)||[]),r]);});return [...groups.values()].map(group=>({record:group[0],values:[...new Set(group.flatMap(r=>Object.keys(r.metrics)))].map(key=>{const vals=group.map(r=>r.metrics[key]).filter(finite);return {key,mean:vals.reduce((a,b)=>a+b,0)/vals.length,n:vals.length};})}));}
