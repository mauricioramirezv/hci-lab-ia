import type {LabUser} from '../../users/domain';
import type { Evidence } from './evidence';
import type { PageSession } from '../../tracking/domain';
import type { TrackingSession } from '../../tracking/domain';
import type { Appointment } from '../../reservations/domain';
export type { Appointment } from '../../reservations/domain';
import type { Persona, Scenario } from '../../research/domain';
export type { Persona, Scenario } from '../../research/domain';

import type { Finding, TestSession } from '../../evaluation/domain';
export type { Source, FindingStatus, Finding, TestSession } from '../../evaluation/domain';

export type LabEvent = {
  id: string;
  type: 'flow-start' | 'flow-error' | 'flow-complete' | 'appointment-change' | 'ai-run' | 'export';
  at: string;
  duration?: number;
  detail?: string;
};

export type ProjectState = {
  version: 2;
  users?: LabUser[];
  reportDraft?: ReportDraft;
  evidence?: Evidence[];
  pageSessions?: PageSession[];
  appointments: Appointment[];
  personas: Persona[];
  scenarios: Scenario[];
  findings: Finding[];
  sessions: TestSession[];
  events: LabEvent[];
  a11yChecks: Record<string, boolean>;
  multimodalEvidence?: MultimodalEvidence[];
  trackingSessions?: TrackingSession[];
};

import type { ReportDraft } from '../../reports/domain/draft';
export type { ReportDraft } from '../../reports/domain/draft';


export const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const sampleProject: ProjectState = {
  version: 2,
  appointments: [],
  users: [],
  personas: [{
    id: 'persona-ana', name: 'Ana', age: '58', device: 'Tableta',
    context: 'Realiza trámites desde casa y alterna entre tableta y celular.',
    goal: 'Reservar una asesoría sin perder la información ingresada.',
    barrier: 'Baja experiencia digital y visión reducida.',
    empathy: {
      says: 'Necesito saber si la reserva sí quedó guardada.',
      thinks: 'No quiero repetir todo si se pierde la conexión.',
      does: 'Amplía el texto y revisa dos veces antes de confirmar.',
      feels: 'Confianza cuando ve progreso y confirmación clara.',
    },
  }],
  scenarios: [{
    id: 'scenario-handoff', title: 'Cambio de dispositivo', actor: 'Ana',
    context: 'Inicia en tableta y debe continuar desde el celular.',
    task: 'Reservar una asesoría UX.', constraint: 'Conexión inestable y texto ampliado al 150%.',
    success: 'Finaliza en menos de 3 minutos, sin repetir datos y comprende el estado.',
  }],
  findings: [], sessions: [], events: [],
  a11yChecks: { keyboard: false, labels: true, contrast: true, zoom: false, screenReader: false, motion: true },
};

export type Metrics = {
  attempts: number;
  completionRate: number;
  averageSeconds: number;
  flowErrors: number;
  sus: number;
  seq: number;
  emotion: number;
  accessibility: number;
  aiAgreement: number;
};

export function calculateMetrics(state: ProjectState): Metrics {
  const completed = state.events.filter((event) => event.type === 'flow-complete');
  const started = state.events.filter((event) => event.type === 'flow-start').length;
  const durations = completed.map((event) => event.duration || 0).filter(Boolean);
  const sessions = state.sessions;
  const taskSessions=(state.evidence||[]).filter(e=>e.kind==='ux'&&!e.demo);
  const observed=(key:string)=>taskSessions.map(e=>e.scores[key]).filter(Number.isFinite);
  const checked = Object.values(state.a11yChecks).filter(Boolean).length;
  const human = state.findings.filter((finding) => finding.source === 'human');
  const ai = state.findings.filter((finding) => finding.source === 'ai');
  const matches = ai.filter((aiFinding) => human.some((humanFinding) => humanFinding.heuristic === aiFinding.heuristic)).length;
  const average = (values: number[]) => values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;

  return {
    attempts: started,
    completionRate: started ? Math.round((completed.length / started) * 100) : 0,
    averageSeconds: Math.round(average(durations)),
    flowErrors: state.events.filter((event) => event.type === 'flow-error').length + sessions.reduce((sum, session) => sum + session.errors, 0)+observed('errors').reduce((a,b)=>a+b,0),
    sus: Math.round(average([...sessions.map((session) => session.sus),...(state.evidence||[]).filter(e=>e.kind==='sus'&&!e.demo).map(e=>e.scores.sus)])),
    seq: Number(average([...sessions.map((session) => session.seq),...observed('seq')]).toFixed(1)),
    emotion: Number(average([...sessions.map((session) => session.emotion),...observed('emotion')]).toFixed(1)),
    accessibility: Object.keys(state.a11yChecks).length ? Math.round((checked / Object.keys(state.a11yChecks).length) * 100) : 0,
    aiAgreement: ai.length ? Math.round((matches / ai.length) * 100) : 0,
  };
}

import type { MultimodalEvidence } from '../../multimodal/domain';
export type { DeviceContext, AccessibilityMode, MultimodalEvidence } from '../../multimodal/domain';
