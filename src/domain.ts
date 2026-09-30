export type Source = 'human' | 'ai';
export type FindingStatus = 'pending' | 'validated' | 'rejected';

export type Appointment = {
  id: string;
  service: string;
  date: string;
  time: string;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
};

export type Persona = {
  id: string;
  name: string;
  age: string;
  context: string;
  goal: string;
  barrier: string;
  device: string;
  empathy: { says: string; thinks: string; does: string; feels: string };
};

export type Scenario = {
  id: string;
  title: string;
  actor: string;
  context: string;
  task: string;
  constraint: string;
  success: string;
};

export type Finding = {
  id: string;
  heuristic: string;
  severity: number;
  problem: string;
  evidence: string;
  recommendation: string;
  source: Source;
  status: FindingStatus;
  createdAt: string;
};

export type TestSession = {
  id: string;
  participant: string;
  task: string;
  success: boolean;
  seconds: number;
  errors: number;
  seq: number;
  emotion: number;
  sus: number;
  notes: string;
  createdAt: string;
};

export type LabEvent = {
  id: string;
  type: 'flow-start' | 'flow-error' | 'flow-complete' | 'appointment-change' | 'ai-run' | 'export';
  at: string;
  duration?: number;
  detail?: string;
};

export type ProjectState = {
  version: 2;
  appointments: Appointment[];
  personas: Persona[];
  scenarios: Scenario[];
  findings: Finding[];
  sessions: TestSession[];
  events: LabEvent[];
  a11yChecks: Record<string, boolean>;
  multimodalEvidence?: MultimodalEvidence[];
};

export const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const sampleProject: ProjectState = {
  version: 2,
  appointments: [],
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
  const checked = Object.values(state.a11yChecks).filter(Boolean).length;
  const human = state.findings.filter((finding) => finding.source === 'human');
  const ai = state.findings.filter((finding) => finding.source === 'ai');
  const matches = ai.filter((aiFinding) => human.some((humanFinding) => humanFinding.heuristic === aiFinding.heuristic)).length;
  const average = (values: number[]) => values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;

  return {
    attempts: started,
    completionRate: started ? Math.round((completed.length / started) * 100) : 0,
    averageSeconds: Math.round(average(durations)),
    flowErrors: state.events.filter((event) => event.type === 'flow-error').length + sessions.reduce((sum, session) => sum + session.errors, 0),
    sus: Math.round(average(sessions.map((session) => session.sus))),
    seq: Number(average(sessions.map((session) => session.seq)).toFixed(1)),
    emotion: Number(average(sessions.map((session) => session.emotion)).toFixed(1)),
    accessibility: Math.round((checked / Object.keys(state.a11yChecks).length) * 100),
    aiAgreement: ai.length ? Math.round((matches / ai.length) * 100) : 0,
  };
}

export type DeviceContext = 'desktop' | 'tablet' | 'mobile' | 'watch' | 'car' | 'tv' | 'kiosk' | 'iot';
export type AccessibilityMode = 'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';
export type MultimodalEvidence = {
  id: string; createdAt: string; device: DeviceContext; practice: 'good' | 'bad';
  vision: AccessibilityMode; notes: string; confidence: number; demoStatus: string; channelStatus: string;
};
