import type { Trial } from './types';
type Position={x:number;y:number};
export const meanSeconds = (rows:readonly Trial[]) => rows.length?rows.reduce((s,r)=>s+r.seconds,0)/rows.length:0;
export function measuredTrial(input:{kind:'Fitts'|'Hick';position:Position;previous:Position|null;size:number;seconds:number;errors:number;keyboard:boolean}):Trial {
 const {kind,position,previous,size,seconds,errors,keyboard}=input;
 const distance=previous?Math.hypot(position.x-previous.x,position.y-previous.y):undefined;
 return {seconds,errors,input:keyboard?'keyboard':'pointer',...(kind==='Fitts'&&distance!==undefined?{distance,indexDifficulty:Math.log2(distance/size+1)}:{})};
}
export function experimentScores(rows:readonly Trial[],kind:'Fitts'|'Hick',size:number,options:number) {
 const scores:Record<string,number>={seconds:meanSeconds(rows),errors:rows.reduce((s,r)=>s+r.errors,0),trials:8,...(kind==='Fitts'?{size}:{options})};
 rows.forEach((r,i)=>{scores[`trial${i+1}Seconds`]=r.seconds;scores[`trial${i+1}Errors`]=r.errors;if(r.distance!==undefined)scores[`trial${i+1}Distance`]=r.distance;});
 return scores;
}
