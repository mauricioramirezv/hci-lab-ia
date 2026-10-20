

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
  validation?: import('./model').GazeValidation;
  exampleCondition?: 'good'|'bad';
};

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
