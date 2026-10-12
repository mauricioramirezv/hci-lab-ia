export type HeatChannel = 'click' | 'pointer' | 'gaze';
export type HeatPoint = { x: number; y: number; at: number; weight: number; source?: string };
export type ScrollRecord = { at: number; top: number; depth: number };
export type GazeValidation = { medianErrorPx: number; viewportWidth: number; viewportHeight: number; sampleCount: number; at: string };
export type TrackingSession = {
  id: string; createdAt: string; example: 'good' | 'bad'; width: number; height: number;
  seconds: number; clicks: HeatPoint[]; pointer: HeatPoint[]; gaze: HeatPoint[];
  scroll: ScrollRecord[]; wheelEvents: number; maxDepth: number; notes: string;
  validation?: GazeValidation; capped: boolean;
};
export const POINT_LIMIT = 5000;
export function contentPoint(clientX: number, clientY: number, rect: { left: number; top: number }, scrollLeft: number, scrollTop: number, clientLeft = 0, clientTop = 0) {
  return { x: clientX - rect.left - clientLeft + scrollLeft, y: clientY - rect.top - clientTop + scrollTop };
}
export function scrollDepth(top: number, viewportHeight: number, contentHeight: number) {
  return contentHeight > 0 ? Math.min(100, Math.max(0, (top + viewportHeight) / contentHeight * 100)) : 0;
}
export function median(values: number[]) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}
/** Fixed grid: normalized within each channel. Never compare color intensity across sessions. */
export function heatCells(points: HeatPoint[], size = 28) {
  const cells = new Map<string, { x: number; y: number; value: number }>();
  for (const p of points) {
    const x = Math.floor(p.x / size) * size, y = Math.floor(p.y / size) * size;
    const key = `${x}:${y}`, cell = cells.get(key) || { x, y, value: 0 };
    cell.value += p.weight; cells.set(key, cell);
  }
  return [...cells.values()];
}
