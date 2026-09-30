import { useRef, useState } from 'react';
import { Accessibility, Activity, AlertTriangle, BarChart3, Bot, Brain, CalendarCheck, Check, CheckCircle2, ChevronRight, Clock3, Code2, Download, Eye, Gauge, Heart, LayoutGrid, Monitor, MousePointer2, Plus, RotateCcw, Save, ShieldCheck, Smartphone, Sparkles, Tablet, Trash2, Upload, Users, Watch, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { a11yChecks, antiPatterns, concepts, course, heuristics } from './data';
import { calculateMetrics, uid } from './domain';
import type { Persona, Scenario } from './domain';
import { useProject } from './store';
import { Empty, PageHead, ProjectActions, StatusPill } from './ui';

type Mode = 'good' | 'bad' | 'compare';
type Device = 'desktop' | 'tablet' | 'mobile' | 'watch';

function ModeSwitch({ mode, setMode }: { mode: Mode; setMode: (mode: Mode) => void }) {
  const { t } = useTranslation();
  return <div className="segmented" aria-label="Modo de demostración">
    <button className={mode === 'good' ? 'selected' : ''} onClick={() => setMode('good')}>{t('common.good')}</button>
    <button className={mode === 'bad' ? 'selected danger' : ''} onClick={() => setMode('bad')}>{t('common.bad')}</button>
    <button className={mode === 'compare' ? 'selected' : ''} onClick={() => setMode('compare')}>{t('common.compare')}</button>
  </div>;
}

export function DashboardPage() {
  const { state } = useProject();
  const metrics = calculateMetrics(state);
  const progress = [state.personas.length > 0, state.scenarios.length > 0, state.appointments.length > 0, state.findings.length > 0, state.sessions.length > 0].filter(Boolean).length * 20;
  return <>
    <PageHead eyebrow="EVOLVING COURSE PROJECT" title="HCI Lab + IA" intro="Un laboratorio front-end para diseñar, comparar, evaluar y medir experiencias multiformato con control humano sobre la IA." actions={<ProjectActions/>}/>
    <section className="hero-grid">
      <article className="hero-card primary-hero"><span className="eyebrow">PROYECTO ACTIVO · V2</span><h2>Del diagnóstico a la evidencia</h2><p>Los artefactos que cree en cada módulo permanecen en este navegador y alimentan las métricas del proyecto.</p><div className="progress large" aria-label={`${progress}% del laboratorio explorado`}><span style={{ width: `${progress}%` }}/></div><strong>{progress}% de módulos con evidencia</strong></article>
      <article className="hero-card"><h2>Estado del laboratorio</h2><dl className="summary-list"><div><dt>Personas</dt><dd>{state.personas.length}</dd></div><div><dt>Escenarios</dt><dd>{state.scenarios.length}</dd></div><div><dt>Hallazgos</dt><dd>{state.findings.length}</dd></div><div><dt>Sesiones</dt><dd>{state.sessions.length}</dd></div></dl></article>
    </section>
    <section className="section-block"><div className="section-title"><div><span className="eyebrow">HILO CONDUCTOR</span><h2>El mismo sistema evoluciona con el curso</h2></div></div><div className="process-grid">{[
      ['1', 'Comprender', 'Personas, empatía, contexto y dos funcionalidades.'], ['2', 'Diseñar', 'Arquitectura, flujos y adaptación por dispositivo.'], ['3', 'Prototipar', 'Buenas prácticas y alternativas generadas con IA.'], ['4', 'Evaluar', 'Heurísticas humanas, IA, accesibilidad y pruebas.'], ['5', 'Medir', `${metrics.completionRate}% de finalización registrada y ${metrics.flowErrors} errores observados.`],
    ].map(([n, title, text]) => <article key={n}><span>{n}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
  </>;
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
    {!bad && <div className="progress" aria-label={`${step} de 3`}><span style={{ width: `${step / 3 * 100}%` }}/></div>}
    {step === 1 && <div className="field"><label htmlFor={`service-${bad}`}>{bad ? '' : t('lab.service')}</label><select id={`service-${bad}`} aria-label={bad ? 'Servicio sin etiqueta visible' : undefined} value={service} onChange={(event) => setService(event.target.value)}><option value="">{t('lab.select')}</option><option value="Orientación UX">Orientación UX</option><option value="Evaluación de accesibilidad">Evaluación de accesibilidad</option><option value="Asesoría de prototipo">Asesoría de prototipo</option></select><button className="primary" onClick={next}>{bad ? 'OK' : t('common.continue')}<ChevronRight/></button></div>}
    {step === 2 && <div className="form-grid"><label>{t('lab.date')}<input type="date" value={date} onChange={(event) => setDate(event.target.value)}/></label><label>{t('lab.time')}<select value={time} onChange={(event) => setTime(event.target.value)}><option value="">{t('lab.select')}</option><option>08:00</option><option>10:30</option><option>14:00</option></select></label><button className="primary" onClick={next}>{t('common.continue')}<ChevronRight/></button></div>}
    {step === 3 && <div className="summary"><CalendarCheck/><div><strong>{service || 'Servicio'}</strong><p>{date || '—'} · {time || '—'}</p></div><button className="primary" onClick={confirm}>{t('lab.confirm')}</button></div>}
    {message && <div role={bad ? undefined : 'status'} className={`message ${bad ? 'error-vague' : message === t('lab.success') ? 'success' : 'warning'}`}>{bad ? <AlertTriangle/> : <Check/>}{message}</div>}
  </section>;
}

export function LabPage() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<Mode>('good');
  const { state, updateAppointment, log } = useProject();
  return <>
    <PageHead eyebrow="INTERACTIVE LAB" title={t('lab.title')} intro={t('lab.intro')} actions={<ModeSwitch mode={mode} setMode={setMode}/>}/>
    {mode === 'compare' ? <div className="comparison-grid"><AppointmentFlow/><AppointmentFlow bad/></div> : <div className="single-demo"><AppointmentFlow bad={mode === 'bad'}/><aside className="learning-panel"><h2>{mode === 'bad' ? 'Problemas intencionales' : 'Decisiones aplicadas'}</h2><ul>{(mode === 'bad' ? ['Etiqueta ausente', 'Error sin explicación', 'Estado poco visible', 'Jerarquía inconsistente'] : ['Progreso visible', 'Etiquetas asociadas', 'Prevención de errores', 'Confirmación anunciada']).map((item) => <li key={item}>{item}</li>)}</ul></aside></div>}
    <section className="section-block"><div className="section-title"><div><span className="eyebrow">CRUD PERSISTENTE</span><h2>Mis citas</h2></div></div>{state.appointments.length === 0 ? <Empty>Complete la versión de buena práctica para crear la primera cita.</Empty> : <div className="table-wrap"><table><thead><tr><th>Servicio</th><th>Fecha</th><th>Hora</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>{state.appointments.map((item) => <tr key={item.id}><td>{item.service}</td><td><input aria-label={`Fecha de ${item.service}`} type="date" value={item.date} onChange={(event) => { updateAppointment(item.id, { date: event.target.value }); log({ type: 'appointment-change', detail: 'reschedule' }); }}/></td><td>{item.time}</td><td><StatusPill tone={item.status === 'confirmed' ? 'good' : 'bad'}>{item.status}</StatusPill></td><td><button className="text-button" disabled={item.status === 'cancelled'} onClick={() => { updateAppointment(item.id, { status: 'cancelled' }); log({ type: 'appointment-change', detail: 'cancel' }); }}>Cancelar</button></td></tr>)}</tbody></table></div>}</section>
  </>;
}

const conceptIcons = [Heart, Gauge, Accessibility, Eye, Activity, Sparkles, MousePointer2, Brain, LayoutGrid, Users, ShieldCheck];
export function ConceptsPage() {
  return <><PageHead eyebrow="HCI + UX" title="Mapa integral de conceptos" intro="Cada dimensión se conecta con una decisión observable y una forma de medirla."/><div className="concept-grid">{concepts.map(([name, description, metric, example], index) => { const Icon = conceptIcons[index]; return <article className="concept-card" key={name}><div className="concept-icon"><Icon/></div><h2>{name}</h2><p>{description}</p><div className="example-note"><strong>En el laboratorio</strong><span>{example}</span></div><small><BarChart3/> {metric}</small></article>; })}</div></>;
}

const blankPersona = (): Persona => ({ id: uid(), name: '', age: '', context: '', goal: '', barrier: '', device: '', empathy: { says: '', thinks: '', does: '', feels: '' } });
const blankScenario = (): Scenario => ({ id: uid(), title: '', actor: '', context: '', task: '', constraint: '', success: '' });

export function ResearchPage() {
  const { state, addPersona, removePersona, addScenario, removeScenario } = useProject();
  const [persona, setPersona] = useState(blankPersona);
  const [scenario, setScenario] = useState(blankScenario);
  const updateEmpathy = (key: keyof Persona['empathy'], value: string) => setPersona((current) => ({ ...current, empathy: { ...current.empathy, [key]: value } }));
  return <>
    <PageHead eyebrow="USER RESEARCH" title="Personas, empatía y escenarios" intro="Convierta la evidencia de la Entrega 1 en artefactos editables que orientan el prototipo y sus pruebas."/>
    <div className="research-layout"><form className="panel form-panel" onSubmit={(event) => { event.preventDefault(); if (!persona.name || !persona.goal) return; addPersona(persona); setPersona(blankPersona()); }}><div className="panel-title"><Users/><div><h2>Nueva persona</h2><p>Use datos observados; declare supuestos pendientes.</p></div></div><div className="form-grid"><label>Nombre<input required value={persona.name} onChange={(event) => setPersona({ ...persona, name: event.target.value })}/></label><label>Edad o rango<input value={persona.age} onChange={(event) => setPersona({ ...persona, age: event.target.value })}/></label></div><label>Contexto<textarea value={persona.context} onChange={(event) => setPersona({ ...persona, context: event.target.value })}/></label><label>Objetivo<input required value={persona.goal} onChange={(event) => setPersona({ ...persona, goal: event.target.value })}/></label><div className="form-grid"><label>Barrera<input value={persona.barrier} onChange={(event) => setPersona({ ...persona, barrier: event.target.value })}/></label><label>Dispositivo principal<input value={persona.device} onChange={(event) => setPersona({ ...persona, device: event.target.value })}/></label></div><h3>Mapa de empatía</h3><div className="empathy-grid">{([['says', 'Dice'], ['thinks', 'Piensa'], ['does', 'Hace'], ['feels', 'Siente']] as const).map(([key, label]) => <label key={key}>{label}<textarea value={persona.empathy[key]} onChange={(event) => updateEmpathy(key, event.target.value)}/></label>)}</div><button className="primary" type="submit"><Plus/>Guardar persona</button></form>
    <form className="panel form-panel" onSubmit={(event) => { event.preventDefault(); if (!scenario.title || !scenario.task) return; addScenario(scenario); setScenario(blankScenario()); }}><div className="panel-title"><Brain/><div><h2>Nuevo escenario</h2><p>Defina tarea, contexto, restricción y éxito verificable.</p></div></div>{([['title', 'Título'], ['actor', 'Persona'], ['context', 'Contexto'], ['task', 'Tarea'], ['constraint', 'Restricción'], ['success', 'Criterio de éxito']] as const).map(([key, label]) => <label key={key}>{label}{['context', 'constraint', 'success'].includes(key) ? <textarea value={scenario[key]} onChange={(event) => setScenario({ ...scenario, [key]: event.target.value })}/> : <input required={key === 'title' || key === 'task'} value={scenario[key]} onChange={(event) => setScenario({ ...scenario, [key]: event.target.value })}/>}</label>)}<button className="primary" type="submit"><Plus/>Guardar escenario</button></form></div>
    <section className="section-block"><h2>Artefactos guardados</h2><div className="artifact-grid">{state.personas.map((item) => <article className="artifact-card" key={item.id}><div className="card-top"><StatusPill tone="good">Persona</StatusPill><button className="icon-button" aria-label={`Eliminar ${item.name}`} onClick={() => removePersona(item.id)}><Trash2/></button></div><h3>{item.name} · {item.age}</h3><p>{item.goal}</p><small>{item.device} · {item.barrier}</small><div className="mini-empathy"><span><strong>Dice</strong>{item.empathy.says}</span><span><strong>Piensa</strong>{item.empathy.thinks}</span><span><strong>Hace</strong>{item.empathy.does}</span><span><strong>Siente</strong>{item.empathy.feels}</span></div></article>)}{state.scenarios.map((item) => <article className="artifact-card" key={item.id}><div className="card-top"><StatusPill>Escenario</StatusPill><button className="icon-button" aria-label={`Eliminar ${item.title}`} onClick={() => removeScenario(item.id)}><Trash2/></button></div><h3>{item.title}</h3><p><strong>{item.actor}:</strong> {item.task}</p><small>{item.constraint}</small><div className="success-criterion"><CheckCircle2/> {item.success}</div></article>)}</div></section>
  </>;
}

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
  return <><PageHead eyebrow="WCAG 2.2 + UNIVERSAL DESIGN" title="Centro de accesibilidad" intro="Ajuste la experiencia, verifique criterios básicos y pruebe una muestra multimedia con transcripción. La automatización no sustituye pruebas con personas."/><div className="a11y-layout"><section className="panel form-panel"><h2>Preferencias de lectura</h2>{([['dark', 'Fondo oscuro'], ['contrast', 'Alto contraste'], ['spacing', 'Espaciado de lectura'], ['dyslexia', 'Tipografía y renglón accesibles'], ['motion', 'Reducir movimiento']] as const).map(([key, label]) => <label className="check-row" key={key}><input type="checkbox" checked={Boolean(prefs[key])} onChange={(event) => set(key, event.target.checked)}/><span>{label}</span></label>)}<label>Tamaño del texto: {prefs.font}%<input type="range" min="100" max="200" step="25" value={prefs.font} onChange={(event) => set('font', Number(event.target.value))}/></label><button className="secondary" onClick={() => setPrefs(initialAccessibilityPrefs)}><RotateCcw/>Restablecer preferencias</button><h2>Demostración semántica</h2><p>El botón actualiza una región viva para que el cambio no dependa solo de la vista.</p><button className="primary" onClick={() => setAnnouncement(`Estado actualizado a las ${new Date().toLocaleTimeString()}`)}>Anunciar actualización</button><p className="live-demo" aria-live="polite">{announcement}</p></section><section className="panel"><h2>Verificación manual</h2><div className="checklist">{a11yChecks.map(([id, label]) => <label key={id}><input type="checkbox" checked={Boolean(state.a11yChecks[id])} onChange={() => toggleCheck(id)}/><span>{label}</span></label>)}</div><div className="tool-note"><Code2/><p><strong>Automatizable:</strong> axe-core y Lighthouse detectan parte de los problemas. Teclado, zoom, lector y comprensión requieren revisión manual.</p></div><h2>Muestra en Lengua de Señas Colombiana</h2><p>Se permite una muestra pequeña. El contenido debe ser producido o validado por una persona competente en LSC.</p>{video ? <video controls src={video} className="lsc-video"/> : <label className="file-button"><Upload/>Cargar video local<input type="file" accept="video/*" onChange={(event) => { const file = event.target.files?.[0]; if (file) setVideo(URL.createObjectURL(file)); }}/></label>}<details><summary>Transcripción textual</summary><p>Ejemplo: “Su cita quedó confirmada. Puede modificarla o cancelarla desde Mis citas”.</p></details></section></div></>;
}

export function EvaluationPage() {
  const { state, addFinding, updateFinding, removeFinding, log } = useProject();
  const [form, setForm] = useState({ heuristic: heuristics[0], severity: 2, problem: '', evidence: '', recommendation: '' });
  const add = (source: 'human' | 'ai', finding = form) => addFinding({ ...finding, source, status: source === 'human' ? 'validated' : 'pending' });
  const runAI = () => {
    const candidates = [
      { heuristic: heuristics[0], severity: 3, problem: 'La variante de mala práctica no hace visible el progreso.', evidence: 'El indicador de paso fue retirado deliberadamente.', recommendation: 'Mostrar el paso actual y anunciarlo programáticamente.' },
      { heuristic: heuristics[4], severity: 3, problem: 'La confirmación permite continuar con campos vacíos.', evidence: 'No existe validación previa en la variante de mala práctica.', recommendation: 'Validar antes de avanzar y explicar cómo resolver el error.' },
      { heuristic: heuristics[8], severity: 2, problem: 'El mensaje “Código 405” no permite recuperarse.', evidence: 'El mensaje no indica causa ni próxima acción.', recommendation: 'Explicar el problema en lenguaje directo y conservar los datos.' },
    ];
    candidates.forEach((finding) => add('ai', finding)); log({ type: 'ai-run', detail: 'heuristic-evaluation' });
  };
  const human = state.findings.filter((item) => item.source === 'human').length;
  const ai = state.findings.filter((item) => item.source === 'ai').length;
  return <><PageHead eyebrow="NIELSEN + HUMAN IN THE LOOP" title="Evaluación heurística humana + IA" intro="Registre evidencia humana, ejecute un análisis reproducible y valide o rechace cada sugerencia de IA. La severidad usa la escala 0–4." actions={<button className="secondary" onClick={runAI}><Bot/>Ejecutar IA simulada</button>}/><div className="evaluation-layout"><form className="panel form-panel" onSubmit={(event) => { event.preventDefault(); if (!form.problem) return; add('human'); setForm({ ...form, problem: '', evidence: '', recommendation: '' }); }}><h2>Nuevo hallazgo humano</h2><label>Heurística<select value={form.heuristic} onChange={(event) => setForm({ ...form, heuristic: event.target.value })}>{heuristics.map((item) => <option key={item}>{item}</option>)}</select></label><label>Severidad: {form.severity}<input type="range" min="0" max="4" value={form.severity} onChange={(event) => setForm({ ...form, severity: Number(event.target.value) })}/></label><label>Problema<textarea required value={form.problem} onChange={(event) => setForm({ ...form, problem: event.target.value })}/></label><label>Evidencia<textarea value={form.evidence} onChange={(event) => setForm({ ...form, evidence: event.target.value })}/></label><label>Recomendación<textarea value={form.recommendation} onChange={(event) => setForm({ ...form, recommendation: event.target.value })}/></label><button className="primary" type="submit"><Plus/>Agregar hallazgo</button></form><section className="panel"><h2>Comparación</h2><div className="comparison-summary"><div><strong>{human}</strong><span>Humanos</span></div><div><strong>{ai}</strong><span>IA</span></div><div><strong>{state.findings.filter((item) => item.status === 'validated').length}</strong><span>Validados</span></div></div><p>El acuerdo se calcula cuando humano e IA identifican la misma heurística. No equivale a exactitud ni reemplaza el juicio experto.</p><div className="severity-legend"><span>S0: no problema</span><span>S1: cosmético</span><span>S2: menor</span><span>S3: mayor</span><span>S4: crítico</span></div></section></div><section className="section-block"><h2>Registro trazable de hallazgos</h2>{state.findings.length === 0 ? <Empty>Agregue una observación o ejecute la evaluación simulada.</Empty> : <div className="findings-grid">{state.findings.map((finding) => <article className="finding" key={finding.id}><div className="card-top"><div><StatusPill tone={finding.source === 'ai' ? 'ai' : 'good'}>{finding.source === 'ai' ? 'IA' : 'Humano'}</StatusPill><StatusPill tone={finding.severity >= 3 ? 'bad' : 'neutral'}>S{finding.severity}</StatusPill></div><button className="icon-button" aria-label="Eliminar hallazgo" onClick={() => removeFinding(finding.id)}><Trash2/></button></div><h3>{finding.heuristic}</h3><p>{finding.problem}</p><small><strong>Evidencia:</strong> {finding.evidence || 'Pendiente'}</small><small><strong>Recomendación:</strong> {finding.recommendation || 'Pendiente'}</small>{finding.source === 'ai' && <div className="review-actions"><button className="secondary" onClick={() => updateFinding(finding.id, { status: 'validated' })}><Check/>Validar</button><button className="secondary" onClick={() => updateFinding(finding.id, { status: 'rejected' })}><XCircle/>Rechazar</button></div>}<StatusPill tone={finding.status === 'validated' ? 'good' : finding.status === 'rejected' ? 'bad' : 'neutral'}>{finding.status}</StatusPill></article>)}</div>}</section></>;
}

function susScore(values: number[]) {
  return Math.round(values.reduce((sum, value, index) => sum + (index % 2 === 0 ? value - 1 : 5 - value), 0) * 2.5);
}
export function TestingPage() {
  const { state, addSession } = useProject();
  const [sus, setSus] = useState(Array(10).fill(3) as number[]);
  const [form, setForm] = useState({ participant: '', task: 'Reservar una asesoría', success: true, seconds: 120, errors: 0, seq: 5, emotion: 4, notes: '' });
  return <><PageHead eyebrow="USER TESTING" title="Pruebas con usuarios" intro="Registre resultados por participante: éxito, tiempo, errores, facilidad percibida (SEQ), emoción y SUS."/><div className="testing-layout"><form className="panel form-panel" onSubmit={(event) => { event.preventDefault(); if (!form.participant) return; addSession({ ...form, sus: susScore(sus) }); setForm({ ...form, participant: '', notes: '' }); }}><h2>Nueva sesión</h2><div className="form-grid"><label>Participante o código<input required value={form.participant} onChange={(event) => setForm({ ...form, participant: event.target.value })}/></label><label>Tarea<input value={form.task} onChange={(event) => setForm({ ...form, task: event.target.value })}/></label><label>Tiempo (segundos)<input type="number" min="1" value={form.seconds} onChange={(event) => setForm({ ...form, seconds: Number(event.target.value) })}/></label><label>Errores<input type="number" min="0" value={form.errors} onChange={(event) => setForm({ ...form, errors: Number(event.target.value) })}/></label><label>SEQ, facilidad 1–7<input type="number" min="1" max="7" value={form.seq} onChange={(event) => setForm({ ...form, seq: Number(event.target.value) })}/></label><label>Emoción 1–5<input type="number" min="1" max="5" value={form.emotion} onChange={(event) => setForm({ ...form, emotion: Number(event.target.value) })}/></label></div><label className="check-row"><input type="checkbox" checked={form.success} onChange={(event) => setForm({ ...form, success: event.target.checked })}/><span>Tarea completada</span></label><label>Notas<textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })}/></label><button className="primary" type="submit"><Save/>Guardar sesión</button></form><section className="panel sus-panel"><h2>Escala SUS</h2><p>Marque 1 (totalmente en desacuerdo) a 5 (totalmente de acuerdo). Los ítems alternan sentido para calcular 0–100.</p>{['Usaría este sistema con frecuencia.', 'El sistema es innecesariamente complejo.', 'El sistema es fácil de usar.', 'Necesitaría apoyo técnico.', 'Las funciones están bien integradas.', 'Hay demasiada inconsistencia.', 'Se aprende rápidamente.', 'Es incómodo de usar.', 'Me siento seguro al usarlo.', 'Necesito aprender mucho antes de usarlo.'].map((question, index) => <label className="sus-item" key={question}><span>{index + 1}. {question}</span><input aria-label={`Respuesta SUS ${index + 1}`} type="range" min="1" max="5" value={sus[index]} onChange={(event) => setSus(sus.map((value, itemIndex) => itemIndex === index ? Number(event.target.value) : value))}/><strong>{sus[index]}</strong></label>)}<div className="score-preview"><Gauge/><span>SUS calculado</span><strong>{susScore(sus)}/100</strong></div></section></div><section className="section-block"><h2>Sesiones registradas</h2>{state.sessions.length === 0 ? <Empty>Aún no hay sesiones.</Empty> : <div className="table-wrap"><table><thead><tr><th>Participante</th><th>Resultado</th><th>Tiempo</th><th>Errores</th><th>SEQ</th><th>Emoción</th><th>SUS</th></tr></thead><tbody>{state.sessions.map((item) => <tr key={item.id}><td>{item.participant}</td><td><StatusPill tone={item.success ? 'good' : 'bad'}>{item.success ? 'Éxito' : 'No completó'}</StatusPill></td><td>{item.seconds}s</td><td>{item.errors}</td><td>{item.seq}/7</td><td>{item.emotion}/5</td><td>{item.sus}/100</td></tr>)}</tbody></table></div>}</section></>;
}

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
  return <><PageHead eyebrow="MEASUREMENT" title="Panel de métricas calculadas" intro="Los valores provienen de las interacciones, listas de verificación, evaluaciones y sesiones almacenadas en este proyecto." actions={<button className="secondary" onClick={exportCsv}><Download/>Exportar CSV</button>}/><div className="metric-grid">{cards.map(([label, value, percent]) => <article className="metric-card" key={label}><span>{label}</span><strong>{value}</strong><div className="metric-bar"><span style={{ width: `${Math.max(0, Math.min(100, percent))}%` }}/></div></article>)}</div><div className="dashboard-grid"><section className="panel"><h2>Embudo observado</h2>{[['Intentos', metrics.attempts], ['Completados', state.events.filter((event) => event.type === 'flow-complete').length], ['Citas activas', state.appointments.filter((item) => item.status === 'confirmed').length]].map(([label, value]) => <div className="funnel-row" key={label}><span>{label}</span><div><i style={{ width: `${metrics.attempts ? Number(value) / metrics.attempts * 100 : 0}%` }}/></div><strong>{value}</strong></div>)}</section><section className="panel"><h2>Interpretación responsable</h2><ul><li>Un indicador sin meta ni contexto no demuestra calidad.</li><li>Las muestras pequeñas deben reportarse como exploratorias.</li><li>Accesibilidad automatizada no equivale a conformidad WCAG.</li><li>El acuerdo con IA no equivale a verdad.</li></ul></section></div></>;
}

export function AiStudioPage() {
  const { state, addPersona, addScenario, addFinding, log } = useProject();
  const [type, setType] = useState<'persona' | 'scenario' | 'interface' | 'evaluation'>('scenario');
  const [prompt, setPrompt] = useState('Persona con baja visión que cambia de dispositivo durante una reserva.');
  const [result, setResult] = useState('');
  const generate = () => {
    const outputs = {
      persona: `Protopersona: Elena, 61 años. Objetivo: reservar sin perder el avance. Contexto: ${prompt} Riesgo: este perfil es una hipótesis y requiere investigación.`,
      scenario: `Escenario adverso: durante “${prompt}”, la conexión falla antes de confirmar. Éxito: retoma el paso, entiende el estado y termina sin duplicar la cita.`,
      interface: `Alternativa: flujo de tres pasos, guardado local, resumen editable, confirmación persistente y transferencia entre dispositivos. Validar con teclado, zoom 200% y lector.`,
      evaluation: `Hipótesis de hallazgo: el estado podría depender del color. Evidencia requerida: inspección del componente y prueba con lector. Heurística: visibilidad del estado.`,
    };
    setResult(outputs[type]); log({ type: 'ai-run', detail: type });
  };
  const save = () => {
    if (!result) return;
    if (type === 'persona') addPersona({ id: uid(), name: 'Elena (IA)', age: '61', context: prompt, goal: 'Reservar sin perder el avance', barrier: 'Baja visión', device: 'Celular y tableta', empathy: { says: 'Necesito saber qué se guardó.', thinks: '¿Puedo continuar después?', does: 'Amplía el texto.', feels: 'Tranquilidad con confirmaciones claras.' } });
    if (type === 'scenario') addScenario({ id: uid(), title: 'Escenario propuesto por IA', actor: state.personas[0]?.name || 'Persona pendiente', context: prompt, task: 'Completar la reserva', constraint: 'Interrupción y cambio de dispositivo', success: 'Retoma sin pérdida y comprende el estado' });
    if (type === 'evaluation') addFinding({ heuristic: heuristics[0], severity: 2, problem: 'El estado podría depender del color.', evidence: 'Hipótesis generada; requiere inspección.', recommendation: 'Agregar texto, icono y anuncio programático.', source: 'ai', status: 'pending' });
  };
  return <><PageHead eyebrow="RESPONSIBLE AI" title="AI Studio" intro="Proveedor simulado, determinista y sin datos externos. Permite enseñar generación, trazabilidad, revisión y decisión humana antes de integrar una API real."/><div className="ai-workspace"><section className="panel form-panel"><label>Tipo de generación<select value={type} onChange={(event) => setType(event.target.value as typeof type)}><option value="persona">Protopersona</option><option value="scenario">Escenario</option><option value="interface">Alternativa de interfaz</option><option value="evaluation">Hipótesis de evaluación</option></select></label><label>Contexto e instrucciones<textarea value={prompt} onChange={(event) => setPrompt(event.target.value)}/></label><button className="primary" onClick={generate}><Bot/>Generar propuesta</button><div className="provider-box"><ShieldCheck/><div><strong>Adaptador actual: mock local</strong><span>No envía datos. Para conectar un proveedor real, use un backend seguro; nunca exponga una clave en Vite.</span></div></div></section><section className="panel ai-result"><div className="ai-orb"><Bot/></div><h2>Resultado revisable</h2><p>{result || 'La propuesta aparecerá aquí.'}</p><button className="secondary" disabled={!result || type === 'interface'} onClick={save}><Save/>Guardar en el proyecto</button><p className="fine-print">Revise sesgos, datos personales, exactitud, accesibilidad y relación con evidencia real.</p></section></div></>;
}

export function QualityPage() {
  const groups = [['Unitarias', 'Vitest', 'Métricas, transformaciones y validaciones'], ['Componentes', 'Testing Library', 'Formularios, estados y nombres accesibles'], ['E2E principal', 'Playwright', 'CRUD, idiomas, dispositivos y regresión'], ['E2E alternativo', 'Selenium', 'Flujos mediante WebDriver'], ['Accesibilidad', 'axe-core + manual', 'WCAG automatizable, teclado y lector'], ['Rendimiento', 'Lighthouse CI', 'Performance, SEO y buenas prácticas'], ['Grabación', 'Katalon', 'Caso de reserva importable'], ['Integración', 'GitHub Actions', 'Lint, test, build, E2E y Pages']];
  return <><PageHead eyebrow="QUALITY ENGINEERING" title="Pruebas y automatización" intro="La interfaz explica las capas y el repositorio incluye configuraciones ejecutables. Cada capa responde preguntas diferentes."/><div className="test-grid">{groups.map(([name, tool, scope]) => <article key={name}><Check/><div><strong>{name}</strong><span>{tool}</span><p>{scope}</p></div></article>)}</div><section className="pipeline" aria-label="Flujo de integración continua"><span>Lint</span><ChevronRight/><span>Unit</span><ChevronRight/><span>Build</span><ChevronRight/><span>E2E</span><ChevronRight/><span>A11y</span><ChevronRight/><span>Pages</span></section><div className="dashboard-grid"><section className="panel"><h2>Comandos</h2><pre><code>npm run lint{`\n`}npm test{`\n`}npm run build{`\n`}npm run test:e2e{`\n`}npm run test:a11y</code></pre></section><section className="panel"><h2>Criterios de salida</h2><ul><li>Sin errores de lint o TypeScript.</li><li>Flujo crítico cubierto de extremo a extremo.</li><li>Sin infracciones serias detectables por axe.</li><li>Revisión manual documentada.</li><li>Métricas interpretadas con contexto.</li></ul></section></div></>;
}

export function CoursePage() {
  return <><PageHead eyebrow="8 CLASSES" title="Evolución del curso" intro="Cada taller agrega evidencia al mismo sistema; las entregas consolidan, corrigen y justifican lo construido."/><div className="timeline">{course.map(([number, title, description, evidence]) => <article key={number}><span>{number}</span><div><div className="card-top"><h2>{title}</h2><StatusPill>{evidence}</StatusPill></div><p>{description}</p></div></article>)}</div><section className="panel traceability"><h2>Trazabilidad conceptual</h2><div className="table-wrap"><table><thead><tr><th>Artefacto</th><th>Decisión</th><th>Evidencia posterior</th></tr></thead><tbody><tr><td>Persona + empatía</td><td>Prioridad y contexto</td><td>Escenario y criterio de éxito</td></tr><tr><td>Flujo multiformato</td><td>Jerarquía por dispositivo</td><td>Prototipo y prueba E2E</td></tr><tr><td>Hallazgo heurístico</td><td>Corrección priorizada</td><td>Versión corregida y nueva prueba</td></tr><tr><td>Sesión de usuario</td><td>Valida o refuta hipótesis</td><td>Métricas y reflexión final</td></tr></tbody></table></div></section></>;
}
