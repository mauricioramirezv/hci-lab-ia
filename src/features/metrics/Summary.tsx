import { useProject } from '../project/store';
export function Summary() {
  const {state}=useProject();const e=(state.evidence || []).filter(x=>!x.demo),tlx=e.filter(x=>x.kind==='tlx'),ai=e.filter(x=>x.kind==='ai'),sessions=state.pageSessions || [];
  const mean=tlx.length?tlx.reduce((s,x)=>s+x.scores.rawTLX,0)/tlx.length:undefined;
  return <section className="panel section-block" lang="es"><h2>Métricas de los nuevos módulos</h2><p>Evidencias reales: {e.length} · Raw TLX medio: {mean?.toFixed(1) ?? 'sin datos'} · Sesiones de página: {sessions.length} · Clics de página: {sessions.reduce((s,x)=>s+x.clicks.length,0)}</p><p>Decisiones humano-IA: {ai.length} · Ediciones o rechazos: {ai.length?(ai.filter(x=>x.condition!=='aceptar').length/ai.length*100).toFixed(1)+'%':'sin datos'}</p><a href="#/reports">Revisar, comparar y exportar evidencias</a></section>;
}
