import {useInterfaceText} from '../../shared/ui/useInterfaceText';
import { Presets } from './Presets';
import { calculateMetrics } from '../project/domain';
import { useProject } from '../project/presentation';
import { PageHead } from '../../shared/ui/Page';

export function DashboardPage() {
  const tx=useInterfaceText();
  const { state } = useProject();
  const metrics = calculateMetrics(state);
  const progress = [state.personas.length > 0, state.scenarios.length > 0, state.appointments.length > 0, state.findings.length > 0, state.sessions.length > 0].filter(Boolean).length * 20;
  return <>
    <PageHead eyebrow={tx("EVOLVING COURSE PROJECT")} title="HCI Lab + IA" intro={tx("Un laboratorio front-end para diseñar, comparar, evaluar y medir experiencias multiformato con control humano sobre la IA.")}/>
    <section className="hero-grid">
      <article className="hero-card primary-hero"><span className="eyebrow">{tx("PROYECTO ACTIVO · V2")}</span><h2>{tx("Del diagnóstico a la evidencia")}</h2><p>{tx("Los artefactos que cree en cada módulo permanecen en este navegador y alimentan las métricas del proyecto.")}</p><div className="progress large" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} aria-label={tx("{{percent}}% del laboratorio explorado",{percent:progress})}><span style={{ width: `${progress}%` }}/></div><strong>{progress}{tx("% de módulos con evidencia")}</strong></article>
      <article className="hero-card"><h2>{tx("Estado del laboratorio")}</h2><dl className="summary-list"><div><dt>{tx("Personas")}</dt><dd>{state.personas.length}</dd></div><div><dt>{tx("Escenarios")}</dt><dd>{state.scenarios.length}</dd></div><div><dt>{tx("Hallazgos")}</dt><dd>{state.findings.length}</dd></div><div><dt>{tx("Sesiones")}</dt><dd>{state.sessions.length}</dd></div></dl></article>
    </section>
    <section className="section-block"><div className="section-title"><div><span className="eyebrow">{tx("HILO CONDUCTOR")}</span><h2>{tx("El mismo sistema evoluciona con el curso")}</h2></div></div><div className="process-grid">{[
      ['1', tx("Comprender"), tx("Personas, empatía, contexto y dos funcionalidades.")], ['2', tx("Diseñar"), tx("Arquitectura, flujos y adaptación por dispositivo.")], ['3', tx("Prototipar"), tx("Buenas prácticas y alternativas generadas con IA.")], ['4', tx("Evaluar"), tx("Heurísticas humanas, IA, accesibilidad y pruebas.")], ['5', tx("Medir"), tx("{{completion}}% de finalización registrada y {{errors}} errores observados.",{completion:metrics.completionRate,errors:metrics.flowErrors})],
    ].map(([n, title, text]) => <article key={n}><span>{n}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
  <Presets/></>;
}
