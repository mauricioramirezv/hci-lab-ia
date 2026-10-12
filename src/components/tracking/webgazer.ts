export type Prediction = { x: number; y: number } | null;
export type Gazer = {
  params: { faceMeshSolutionPath: string };
  begin: () => Promise<Gazer>; end: () => void; clearData: () => Promise<unknown>;
  saveDataAcrossSessions: (value: boolean) => Gazer;
  setGazeListener: (callback: (data: Prediction) => void) => Gazer;
  clearGazeListener: () => Gazer; removeMouseEventListeners: () => Gazer;
  recordScreenPosition: (x: number, y: number, type: 'click') => Gazer;
  showVideoPreview: (value: boolean) => Gazer; showPredictionPoints: (value: boolean) => Gazer;
};
export const WEBGAZER_URL = 'https://cdn.jsdelivr.net/npm/webgazer@3.5.3/dist/webgazer.js';
export function getGazer(): Gazer | undefined { return (window as Window & { webgazer?: Gazer }).webgazer; }
let loading: Promise<Gazer> | undefined;
export function loadGazer(): Promise<Gazer> {
  const current = getGazer();
  if (current) return Promise.resolve(current);
  if (loading) return loading;
  loading = new Promise<Gazer>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = WEBGAZER_URL; script.async = true; script.dataset.hciGazer = 'true';
    const timer = window.setTimeout(() => { script.remove(); reject(new Error('Tiempo de descarga agotado. Use el módulo sin cámara.')); }, 30000);
    script.onload = () => { window.clearTimeout(timer); const gazer = getGazer(); if (gazer) resolve(gazer); else reject(new Error('La biblioteca no se inició.')); };
    script.onerror = () => { window.clearTimeout(timer); script.remove(); reject(new Error('No se pudo descargar WebGazer; revise la conexión.')); };
    document.head.appendChild(script);
  }).catch(error => { loading = undefined; throw error; });
  return loading;
}
export function shutdownGazer() {
  const gazer = getGazer();
  for (const element of document.querySelectorAll<HTMLVideoElement>('video[id^="webgazer"]')) {
    const stream = element.srcObject;
    if (stream && 'getTracks' in stream) stream.getTracks().forEach(track => track.stop());
  }
  try { gazer?.clearGazeListener(); } catch { /* Continue cleanup. */ }
  try { gazer?.end(); } catch { /* Continue cleanup. */ }
  document.querySelectorAll('[id^="webgazer"]').forEach(el => el.remove());
}
