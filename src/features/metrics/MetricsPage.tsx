import {useInterfaceText} from '../../shared/ui/useInterfaceText';
import {csvCell} from '../../shared/csv';
import { Summary } from './Summary';
import { Download } from 'lucide-react';
import { calculateMetrics } from '../project/domain';
import { useProject } from '../project/presentation';
import { PageHead } from '../../shared/ui/Page';

export function MetricsPage() {
  const tx=useInterfaceText();
  const { state } = useProject();
  const metrics = calculateMetrics(state);
  const cards = [
    [tx("Finalización"), `${metrics.completionRate}%`, metrics.completionRate], [tx("Tiempo promedio"), metrics.averageSeconds ? `${metrics.averageSeconds}s` : '—', Math.max(0, 100 - metrics.averageSeconds / 3)], [tx("Errores"), String(metrics.flowErrors), Math.min(100, metrics.flowErrors * 12)], [tx("Accesibilidad"), `${metrics.accessibility}%`, metrics.accessibility], ['SUS', metrics.sus ? `${metrics.sus}/100` : '—', metrics.sus], ['SEQ', metrics.seq ? `${metrics.seq}/7` : '—', metrics.seq / 7 * 100], [tx("Emoción"), metrics.emotion ? `${metrics.emotion}/5` : '—', metrics.emotion * 20], [tx("Acuerdo humano–IA"), `${metrics.aiAgreement}%`, metrics.aiAgreement],
  ] as const;
  const exportCsv = () => {
    const rows = [[tx("Métrica"), tx("Valor")], ...cards.map(([label, value]) => [label, value])];
    const blob = new Blob([rows.map((row) => row.map(csvCell).join(',')).join('\n')], { type: 'text/csv' }); const anchor = document.createElement('a'); anchor.href = URL.createObjectURL(blob); anchor.download = 'hci-lab-metrics.csv'; anchor.click();
  };
  return <><PageHead eyebrow={tx("MEASUREMENT")} title={tx("Panel de métricas calculadas")} intro={tx("Los valores provienen de las interacciones, listas de verificación, evaluaciones y sesiones almacenadas en este proyecto.")} actions={<button className="secondary" onClick={exportCsv}><Download/>{tx("Exportar CSV")}</button>}/><div className="metric-grid">{cards.map(([label, value, percent]) => <article className="metric-card" key={label}><span>{label}</span><strong>{value}</strong><div className="metric-bar"><span style={{ width: `${Math.max(0, Math.min(100, percent))}%` }}/></div></article>)}</div><div className="dashboard-grid"><section className="panel"><h2>{tx("Embudo observado")}</h2>{[[tx("Intentos"), metrics.attempts], [tx("Completados"), state.events.filter((event) => event.type === 'flow-complete').length], [tx("Citas activas"), state.appointments.filter((item) => item.status === 'confirmed').length]].map(([label, value]) => <div className="funnel-row" key={label}><span>{label}</span><div><i style={{ width: `${metrics.attempts ? Number(value) / metrics.attempts * 100 : 0}%` }}/></div><strong>{value}</strong></div>)}</section><section className="panel"><h2>{tx("Interpretación responsable")}</h2><ul><li>{tx("Un indicador sin meta ni contexto no demuestra calidad.")}</li><li>{tx("Las muestras pequeñas deben reportarse como exploratorias.")}</li><li>{tx("Accesibilidad automatizada no equivale a conformidad WCAG.")}</li><li>{tx("El acuerdo con IA no equivale a verdad.")}</li></ul></section></div><Summary/></>;
}
