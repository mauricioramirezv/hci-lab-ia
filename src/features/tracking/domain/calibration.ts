import { median } from './geometry';
import type { GazeValidation } from './geometry';

export function gazeValidation(rows: number[][], viewportWidth: number, viewportHeight: number, at: string): GazeValidation | undefined {
  if (rows.some(row=>row.length<5)) return undefined;
  return {medianErrorPx:Math.round(median(rows.map(row=>median(row)))),viewportWidth,viewportHeight,sampleCount:rows.reduce((n,row)=>n+row.length,0),at};
}
