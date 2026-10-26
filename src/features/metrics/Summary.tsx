import {useInterfaceText} from '../../shared/ui/useInterfaceText';
import { useProject } from '../project/presentation';
import { ExpandableCard } from '../../shared/ui/ExpandableCard';
export function Summary() {
  const tx=useInterfaceText();
  const {state}=useProject();const e=(state.evidence || []).filter(x=>!x.demo),tlx=e.filter(x=>x.kind==='tlx'),ai=e.filter(x=>x.kind==='ai'),sessions=state.pageSessions || [];
  const mean=tlx.length?tlx.reduce((s,x)=>s+x.scores.rawTLX,0)/tlx.length:undefined;
  return <ExpandableCard id="metrics-modules" title={tx("Métricas de los nuevos módulos")} defaultOpen={false} className="section-block"><p>{tx("Evidencias reales:")} {e.length}  {tx("· Raw TLX medio:")} {mean?.toFixed(1) ?? tx("sin datos")}  {tx("· Sesiones de página:")} {sessions.length}  {tx("· Clics de página:")} {sessions.reduce((s,x)=>s+x.clicks.length,0)}</p><p>{tx("Decisiones humano-IA:")} {ai.length}  {tx("· Ediciones o rechazos:")} {ai.length?(ai.filter(x=>x.condition!=='aceptar').length/ai.length*100).toFixed(1)+'%':tx("sin datos")}</p><a href="#/reports">{tx("Revisar, comparar y exportar evidencias")}</a></ExpandableCard>;
}
