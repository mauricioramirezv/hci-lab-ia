import {Evaluation} from './iteration7/Evaluation';
import {Questionnaires} from './iteration7/Questionnaires';
import {AI} from './iteration7/AI';
import './iteration7/styles.css';
import { Sensory } from './enhancements/Sensory';
import { Summary } from './enhancements/Summary';
import { Presets } from './enhancements/Presets';
import { ConceptActivity } from './components/multimodal/ConceptActivity';
import { useRef, useState } from 'react';
import { Accessibility, Activity, AlertTriangle, BarChart3, Brain, CalendarCheck, Check, CheckCircle2, ChevronRight, Clock3, Code2, Download, Eye, Gauge, Heart, LayoutGrid, Monitor, MousePointer2, RotateCcw, ShieldCheck, Smartphone, Sparkles, Tablet, Upload, Users, Watch, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { a11yChecks, antiPatterns, concepts, course } from './data';
import { calculateMetrics } from './domain';
import { Reservations } from './projectActivities/Reservations';
import { Research } from './projectActivities/Research';
import { useProject } from './store';
import { PageHead, StatusPill } from './ui';

type Device = 'desktop' | 'tablet' | 'mobile' | 'watch';

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

function AppointmentFlow({ bad = false, compact = false }: { bad?: boolean; compact?: boolean }) {
  const { t } = useTranslation();
  const { addAppointment, log } = useProject();
  const [step, setStep] = useState(1);
  const [service, setService] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [message, setMessage] = useState('');
  const started = useRef(Date.now());
  const startLogged = useRef(false);
  const ensureStart = () => { if (!startLogged.current) { log({ type: 'flow-start', detail: bad ? 'bad' : 'good' }); startLogged.current = true; } };
  const next = () => {
    ensureStart();
    if (!bad && ((step === 1 && !service) || (step === 2 && (!date || !time)))) { setMessage(step === 1 ? t('lab.select') : t('lab.goodMessage')); log({ type: 'flow-error', detail: `step-${step}` }); return; }
    setMessage(''); setStep((current) => Math.min(3, current + 1));
  };
  const confirm = () => {
    ensureStart();
    if (bad) { setMessage(t('lab.badMessage')); log({ type: 'flow-error', detail: 'bad-confirmation' }); return; }
    if (!service || !date || !time) { setMessage(t('lab.goodMessage')); log({ type: 'flow-error', detail: 'incomplete-confirmation' }); return; }
    addAppointment({ service, date, time });
    log({ type: 'flow-complete', duration: Math.round((Date.now() - started.current) / 1000), detail: service });
    setMessage(t('lab.success'));
  };
  return <section className={`appointment-demo ${bad ? 'anti-pattern' : ''} ${compact ? 'compact' : ''}`} aria-label={bad ? t('common.bad') : t('common.good')}>
    <div className="demo-head"><StatusPill tone={bad ? 'bad' : 'good'}>{bad ? t('common.bad') : t('common.good')}</StatusPill><span>{t('lab.steps')}: {step}/3</span></div>
    {!bad && <div className="progress" role="progressbar" aria-valuemin={1} aria-valuemax={3} aria-valuenow={step} aria-label={`${step} de 3`}><span style={{ width: `${step / 3 * 100}%` }}/></div>}
    {step === 1 && <div className="field"><label htmlFor={`service-${bad}`}>{bad ? '' : t('lab.service')}</label><select id={`service-${bad}`} aria-label={bad ? 'Servicio sin etiqueta visible' : undefined} value={service} onChange={(event) => setService(event.target.value)}><option value="">{t('lab.select')}</option><option value="Orientación UX">Orientación UX</option><option value="Evaluación de accesibilidad">Evaluación de accesibilidad</option><option value="Asesoría de prototipo">Asesoría de prototipo</option></select><button className="primary" onClick={next}>{bad ? 'OK' : t('common.continue')}<ChevronRight/></button></div>}
    {step === 2 && <div className="form-grid"><label>{t('lab.date')}<input type="date" value={date} onChange={(event) => setDate(event.target.value)}/></label><label>{t('lab.time')}<select value={time} onChange={(event) => setTime(event.target.value)}><option value="">{t('lab.select')}</option><option>08:00</option><option>10:30</option><option>14:00</option></select></label><button className="primary" onClick={next}>{t('common.continue')}<ChevronRight/></button></div>}
    {step === 3 && <div className="summary"><CalendarCheck/><div><strong>{service || 'Servicio'}</strong><p>{date || '—'} · {time || '—'}</p></div><button className="primary" onClick={confirm}>{t('lab.confirm')}</button></div>}
    {message && <div role={bad ? undefined : 'status'} className={`message ${bad ? 'error-vague' : message === t('lab.success') ? 'success' : 'warning'}`}>{bad ? <AlertTriangle/> : <Check/>}{message}</div>}
  </section>;
}

export function LabPage() { return <Reservations/>; }

const conceptIcons = [Heart, Gauge, Accessibility, Eye, Activity, Sparkles, MousePointer2, Brain, LayoutGrid, Users, ShieldCheck];
export function ConceptsPage() {
  return <><PageHead eyebrow="HCI + UX" title="Mapa integral de conceptos" intro="Cada dimensión se conecta con una decisión observable y una forma de medirla."/><div className="concept-grid">{concepts.map(([name, description, metric, example], index) => { const Icon = conceptIcons[index]; return <article className="concept-card" key={name}><div className="concept-icon"><Icon/></div><h2>{name}</h2><p>{description}</p><div className="example-note"><strong>En el laboratorio</strong><span>{example}</span></div><small><BarChart3/> {metric}</small><ConceptActivity name={name} metric={metric} index={index}/></article>; })}</div></>;
}

export function ResearchPage() { return <Research/>; }

export function PracticesPage() {
  const [open, setOpen] = useState(antiPatterns[0].id);
  return <><PageHead eyebrow="PATTERN LIBRARY" title="Buenas prácticas y antipatrones" intro="Compare decisiones equivalentes. La mala práctica es deliberada y sirve como objeto de evaluación, no como plantilla."/><div className="pattern-list">{antiPatterns.map((pattern) => <article key={pattern.id} className="pattern-row"><button className="pattern-heading" aria-expanded={open === pattern.id} onClick={() => setOpen(open === pattern.id ? '' : pattern.id)}><span>{pattern.title}</span><StatusPill>{pattern.principle}</StatusPill><ChevronRight/></button>{open === pattern.id && <div className="pattern-comparison"><div className="good-sample"><CheckCircle2/><div><strong>Buena práctica</strong><p>{pattern.good}</p></div></div><div className="bad-sample"><XCircle/><div><strong>No se debe hacer</strong><p>{pattern.bad}</p></div></div></div>}</article>)}</div></>;
}

export function DevicesPage() {
  const { t } = useTranslation();
  const [device, setDevice] = useState<Device>('desktop');
  const icons = { desktop: Monitor, tablet: Tablet, mobile: Smartphone, watch: Watch };
  const priorities: Record<Device, string[]> = { desktop: ['Comparar horarios', 'Ver contexto y ayuda', 'Administrar citas'], tablet: ['Entrada táctil', 'Orientación variable', 'Continuidad'], mobile: ['Una tarea por vista', 'Acciones al alcance', 'Conectividad variable'], watch: ['Estado de un vistazo', 'Confirmar o cancelar', 'Sin captura extensa'] };
  return <><PageHead eyebrow="MULTIFORMAT" title={t('devices.title')} intro="La misma tarea cambia jerarquía, densidad, navegación y controles según el contexto; no es solo reducir el ancho."/><div className="device-tabs">{(['desktop', 'tablet', 'mobile', 'watch'] as Device[]).map((item) => { const Icon = icons[item]; return <button key={item} onClick={() => setDevice(item)} className={device === item ? 'selected' : ''}><Icon/>{t(`devices.${item}`)}</button>; })}</div><div className="device-layout"><div className={`device-stage ${device}`}><div className="device-frame"><div className="device-bar"><span/><span/><span/></div>{device === 'watch' ? <div className="watch-glance"><Clock3/><strong>10:30</strong><span>Asesoría UX</span><button><Check/>Confirmar</button></div> : <AppointmentFlow compact/>}</div></div><aside className="panel context-panel"><h2>Prioridades del contexto</h2><ul>{priorities[device].map((item) => <li key={item}>{item}</li>)}</ul><div className="ergonomic-note"><MousePointer2/><p><strong>Ergonomía:</strong> objetivos táctiles amplios, separación suficiente y acción principal alcanzable.</p></div></aside></div></>;
}

type Prefs = { dark: boolean; contrast: boolean; font: number; spacing: boolean; dyslexia: boolean; motion: boolean };
const initialAccessibilityPrefs: Prefs = { dark: false, contrast: false, font: 100, spacing: false, dyslexia: false, motion: false };
export function AccessibilityPage({ prefs, setPrefs }: { prefs: Prefs; setPrefs: React.Dispatch<React.SetStateAction<Prefs>> }) {
  const { state, toggleCheck } = useProject();
  const [announcement, setAnnouncement] = useState('');
  const [video, setVideo] = useState('');
  const set = (key: keyof Prefs, value: boolean | number) => setPrefs((current) => ({ ...current, [key]: value }));
  return <><PageHead eyebrow="WCAG 2.2 + UNIVERSAL DESIGN" title="Centro de accesibilidad" intro="Ajuste la experiencia, verifique criterios básicos y pruebe una muestra multimedia con transcripción. La automatización no sustituye pruebas con personas."/><div className="a11y-layout"><section className="panel form-panel"><h2>Preferencias de lectura</h2>{([['dark', 'Fondo oscuro'], ['contrast', 'Alto contraste'], ['spacing', 'Espaciado de lectura'], ['dyslexia', 'Tipografía y renglón accesibles'], ['motion', 'Reducir movimiento']] as const).map(([key, label]) => <label className="check-row" key={key}><input type="checkbox" checked={Boolean(prefs[key])} onChange={(event) => set(key, event.target.checked)}/><span>{label}</span></label>)}<label>Tamaño del texto: {prefs.font}%<input type="range" min="100" max="200" step="25" value={prefs.font} onChange={(event) => set('font', Number(event.target.value))}/></label><button className="secondary" onClick={() => setPrefs(initialAccessibilityPrefs)}><RotateCcw/>Restablecer preferencias</button><h2>Demostración semántica</h2><p>El botón actualiza una región viva para que el cambio no dependa solo de la vista.</p><button className="primary" onClick={() => setAnnouncement(`Estado actualizado a las ${new Date().toLocaleTimeString()}`)}>Anunciar actualización</button><p className="live-demo" aria-live="polite">{announcement}</p></section><section className="panel"><h2>Verificación manual</h2><div className="checklist">{a11yChecks.map(([id, label]) => <label key={id}><input type="checkbox" checked={Boolean(state.a11yChecks[id])} onChange={() => toggleCheck(id)}/><span>{label}</span></label>)}</div><div className="tool-note"><Code2/><p><strong>Automatizable:</strong> axe-core y Lighthouse detectan parte de los problemas. Teclado, zoom, lector y comprensión requieren revisión manual.</p></div><h2>Muestra en Lengua de Señas Colombiana</h2><p>Se permite una muestra pequeña. El contenido debe ser producido o validado por una persona competente en LSC.</p>{video ? <video controls src={video} className="lsc-video"/> : <label className="file-button"><Upload/>Cargar video local<input type="file" accept="video/*" onChange={(event) => { const file = event.target.files?.[0]; if (file) setVideo(URL.createObjectURL(file)); }}/></label>}<details><summary>Transcripción textual</summary><p>Ejemplo: “Su cita quedó confirmada. Puede modificarla o cancelarla desde Mis citas”.</p></details></section></div><Sensory/></>;
}

export function EvaluationPage(){return <Evaluation/>;}
export function TestingPage(){return <Questionnaires/>;}

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

export function AiStudioPage(){return <AI/>;}

export function QualityPage() {
  const groups = [['Unitarias', 'Vitest', 'Métricas, transformaciones y validaciones'], ['Componentes', 'Testing Library', 'Formularios, estados y nombres accesibles'], ['E2E principal', 'Playwright', 'CRUD, idiomas, dispositivos y regresión'], ['E2E alternativo', 'Selenium', 'Flujos mediante WebDriver'], ['Accesibilidad', 'axe-core + manual', 'WCAG automatizable, teclado y lector'], ['Rendimiento', 'Lighthouse CI', 'Performance, SEO y buenas prácticas'], ['Grabación', 'Katalon', 'Caso de reserva importable'], ['Integración', 'GitHub Actions', 'Lint, test, build, E2E y Pages']];
  return <><PageHead eyebrow="QUALITY ENGINEERING" title="Pruebas y automatización" intro="La interfaz explica las capas y el repositorio incluye configuraciones ejecutables. Cada capa responde preguntas diferentes."/><div className="test-grid">{groups.map(([name, tool, scope]) => <article key={name}><Check/><div><strong>{name}</strong><span>{tool}</span><p>{scope}</p></div></article>)}</div><section className="pipeline" aria-label="Flujo de integración continua"><span>Lint</span><ChevronRight/><span>Unit</span><ChevronRight/><span>Build</span><ChevronRight/><span>E2E</span><ChevronRight/><span>A11y</span><ChevronRight/><span>Pages</span></section><div className="dashboard-grid"><section className="panel"><h2>Comandos</h2><pre><code>npm run lint{`\n`}npm test{`\n`}npm run build{`\n`}npm run test:e2e{`\n`}npm run test:a11y</code></pre></section><section className="panel"><h2>Criterios de salida</h2><ul><li>Sin errores de lint o TypeScript.</li><li>Flujo crítico cubierto de extremo a extremo.</li><li>Sin infracciones serias detectables por axe.</li><li>Revisión manual documentada.</li><li>Métricas interpretadas con contexto.</li></ul></section></div></>;
}

export function CoursePage() {
  return <><PageHead eyebrow="8 CLASSES" title="Evolución del curso" intro="Cada taller agrega evidencia al mismo sistema; las entregas consolidan, corrigen y justifican lo construido."/><div className="timeline">{course.map(([number, title, description, evidence]) => <article key={number}><span>{number}</span><div><div className="card-top"><h2>{title}</h2><StatusPill>{evidence}</StatusPill></div><p>{description}</p></div></article>)}</div><section className="panel traceability"><h2>Trazabilidad conceptual</h2><div className="table-wrap"><table><thead><tr><th>Artefacto</th><th>Decisión</th><th>Evidencia posterior</th></tr></thead><tbody><tr><td>Persona + empatía</td><td>Prioridad y contexto</td><td>Escenario y criterio de éxito</td></tr><tr><td>Flujo multiformato</td><td>Jerarquía por dispositivo</td><td>Prototipo y prueba E2E</td></tr><tr><td>Hallazgo heurístico</td><td>Corrección priorizada</td><td>Versión corregida y nueva prueba</td></tr><tr><td>Sesión de usuario</td><td>Valida o refuta hipótesis</td><td>Métricas y reflexión final</td></tr></tbody></table></div></section></>;
}

