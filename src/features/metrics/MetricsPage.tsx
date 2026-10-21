import { Summary } from './Summary';
import { Download } from 'lucide-react';
import { calculateMetrics } from '../project/domain';
import { useProject } from '../project/presentation';
import { PageHead } from '../../shared/ui/Page';

export function MetricsPage() {
  const { state } = useProject();
  const metrics = calculateMetrics(state);
  const cards = [
    ['Finalización', `${metrics.completionRate}%`, metrics.completionRate], ['Tiempo promedio', metrics.averageSeconds ? `${metrics.averageSeconds}s` : '—', Math.max(0, 100 - metrics.averageSeconds / 3)], ['Errores', String(metrics.flowErrors), Math.min(100, metrics.flowErrors * 12)], ['Accesibilidad', `${metrics.accessibility}%`, metrics.accessibility], ['SUS', metrics.sus ? `${metrics.sus}/100` : '—', metrics.sus], ['SEQ', metrics.seq ? `${metrics.seq}/7` : '—', metrics.seq / 7 * 100], ['Emoción', metrics.emotion ? `${metrics.emotion}/5` : '—', metrics.emotion * 20], ['Acuerdo humano–IA', `${metrics.aiAgreement}%`, metrics.aiAgreement],
  ] as const;
  const exportCsv = () => {
    const rows = [['metric', 'value'], ...cards.map(([label, value]) => [label, value])];
    const blob = new Blob([rows.map((row) => row.join(',')).join('\n')], { type: 'text/csv' }); const anchor = document.createElement('a'); anchor.href = URL.createObjectURL(blob); anchor.download = 'hci-lab-metrics.csv'; anchor.click();
  };
  return <><PageHead eyebrow="MEASUREMENT" title="Panel de métricas calculadas" intro="Los valores provienen de las interacciones, listas de verificación, evaluaciones y sesiones almacenadas en este proyecto." actions={<button className="secondary" onClick={exportCsv}><Download/>Exportar CSV</button>}/><div className="metric-grid">{cards.map(([label, value, percent]) => <article className="metric-card" key={label}><span>{label}</span><strong>{value}</strong><div className="metric-bar"><span style={{ width: `${Math.max(0, Math.min(100, percent))}%` }}/></div></article>)}</div><div className="dashboard-grid"><section className="panel"><h2>Embudo observado</h2>{[['Intentos', metrics.attempts], ['Completados', state.events.filter((event) => event.type === 'flow-complete').length], ['Citas activas', state.appointments.filter((item) => item.status === 'confirmed').length]].map(([label, value]) => <div className="funnel-row" key={label}><span>{label}</span><div><i style={{ width: `${metrics.attempts ? Number(value) / metrics.attempts * 100 : 0}%` }}/></div><strong>{value}</strong></div>)}</section><section className="panel"><h2>Interpretación responsable</h2><ul><li>Un indicador sin meta ni contexto no demuestra calidad.</li><li>Las muestras pequeñas deben reportarse como exploratorias.</li><li>Accesibilidad automatizada no equivale a conformidad WCAG.</li><li>El acuerdo con IA no equivale a verdad.</li></ul></section></div><Summary/></>;
}
