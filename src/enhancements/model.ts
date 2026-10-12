export type Evidence = {
  id: string; createdAt: string; kind: 'concept' | 'experiment' | 'sus' | 'ux' | 'tlx' | 'chatbot' | 'ai' | 'comparison' | 'pattern';
  participant: string; task: string; condition: string; prototype: string;
  scores: Record<string, number>; notes: string; demo?: boolean;
  experiment?:{kind:'Fitts'|'Hick';condition:string;trials:import('../iteration7/model').Trial[];practiceCount:number};
  review?:{type:string;prompt:string;proposal:string;basis:string;limits:string;review:string;reason:string;decision:'accept'|'applyEdit'|'reject'};
  chatbot?:{prompt:string;response:string;human:boolean};
  pattern?: {id:'form'|'navigation'|'feedback'|'choice'|'content'|'privacy';problem:string;principle:string;correction:string};
  concept?: {
    id: 'ux'|'usability'|'accessibility'|'awareness'|'engagement'|'emotions'|'ergonomics'|'cognition'|'information'|'universal'|'responsibleAI';
    outcome:'completed'|'cancelled';
    response:{text:string;reason:string;edit:string;decision:string};
  };
};
export type PagePoint = { x: number; y: number; at: number; weight: number; area: string; source: string; route?:string };
export type PageSession = {
  id: string; createdAt: string; route: string; participant: string; task: string; prototype: string;
  width: number; height: number; viewportWidth: number; viewportHeight: number; seconds: number;
  clicks: PagePoint[]; pointer: PagePoint[]; gaze: PagePoint[]; simulation: PagePoint[];
  scroll: { at: number; top: number; depth: number; direction: string }[]; maxDepth: number;
  exposure?: Record<string, number>;
  validationError?: number; capped: boolean; notes: string;
  target?: 'example'|'page';
  coordinateSystem?: 'example-content'|'document';
  wheelEvents?: number;
  clickCount?: number;
  modeChanges?: {at:number;mode:'cursor'|'F'|'Gutenberg'|'none'}[];
  validation?: import('../components/tracking/model').GazeValidation;
  exampleCondition?: 'good'|'bad';
};
export const topics = [
  { name: 'Experiencia, cognición y participación', indices: [0,1,3,4,5,7] },
  { name: 'Inclusión y adaptación', indices: [2,6,9] },
  { name: 'Organización y sistemas responsables', indices: [8,10] },
];
export const tlxDimensions = ['Exigencia mental','Exigencia física','Exigencia temporal','Rendimiento: 0 excelente, 100 deficiente','Esfuerzo','Frustración'];
export function rawTLX(values: number[]) {
  if (values.length !== 6 || values.some(v => !Number.isFinite(v) || v < 0 || v > 100)) throw new Error('Se requieren seis valores entre 0 y 100.');
  return values.reduce((s,v) => s+v,0)/6;
}
export function areaSummary(points: PagePoint[]) {
  const counts: Record<string,number> = {};
  points.forEach(p => { counts[p.area] = (counts[p.area] || 0)+1; });
  return Object.entries(counts).map(([area,count]) => ({area,count,percent: points.length ? count/points.length*100 : 0}));
}
/** Counts exposure of the viewport's upper edge, not reading or attention. */
export function scrollBand(top: number, height: number) {
  const band=Math.min(9,Math.max(0,Math.floor(top/Math.max(1,height)*10)));
  return `${band*10}-${(band+1)*10}%`;
}
export function download(name: string, body: string, type = 'text/plain;charset=utf-8') {
  const url = URL.createObjectURL(new Blob([body], {type}));
  const a = document.createElement('a'); a.href=url; a.download=name; a.click();
  setTimeout(() => URL.revokeObjectURL(url),1000);
}
export function csvCell(value: unknown) {
  const text = String(value ?? '');
  return '"'+(/^[=+\-@\t\r]/.test(text) ? "'"+text : text).replaceAll('"','""')+'"';
}
