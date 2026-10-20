import { Presets } from './Presets';
import { calculateMetrics } from '../project/domain';
import { useProject } from '../project/store';
import { PageHead } from '../../shared/ui/Page';

export function DashboardPage() {
  const { state } = useProject();
  const metrics = calculateMetrics(state);
  const progress = [state.personas.length > 0, state.scenarios.length > 0, state.appointments.length > 0, state.findings.length > 0, state.sessions.length > 0].filter(Boolean).length * 20;
  return <>
    <PageHead eyebrow="EVOLVING COURSE PROJECT" title="HCI Lab + IA" intro="Un laboratorio front-end para diseñar, comparar, evaluar y medir experiencias multiformato con control humano sobre la IA."/>
    <section className="hero-grid">
      <article className="hero-card primary-hero"><span className="eyebrow">PROYECTO ACTIVO · V2</span><h2>Del diagnóstico a la evidencia</h2><p>Los artefactos que cree en cada módulo permanecen en este navegador y alimentan las métricas del proyecto.</p><div className="progress large" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} aria-label={`${progress}% del laboratorio explorado`}><span style={{ width: `${progress}%` }}/></div><strong>{progress}% de módulos con evidencia</strong></article>
      <article className="hero-card"><h2>Estado del laboratorio</h2><dl className="summary-list"><div><dt>Personas</dt><dd>{state.personas.length}</dd></div><div><dt>Escenarios</dt><dd>{state.scenarios.length}</dd></div><div><dt>Hallazgos</dt><dd>{state.findings.length}</dd></div><div><dt>Sesiones</dt><dd>{state.sessions.length}</dd></div></dl></article>
    </section>
    <section className="section-block"><div className="section-title"><div><span className="eyebrow">HILO CONDUCTOR</span><h2>El mismo sistema evoluciona con el curso</h2></div></div><div className="process-grid">{[
      ['1', 'Comprender', 'Personas, empatía, contexto y dos funcionalidades.'], ['2', 'Diseñar', 'Arquitectura, flujos y adaptación por dispositivo.'], ['3', 'Prototipar', 'Buenas prácticas y alternativas generadas con IA.'], ['4', 'Evaluar', 'Heurísticas humanas, IA, accesibilidad y pruebas.'], ['5', 'Medir', `${metrics.completionRate}% de finalización registrada y ${metrics.flowErrors} errores observados.`],
    ].map(([n, title, text]) => <article key={n}><span>{n}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
  <Presets/></>;
}
