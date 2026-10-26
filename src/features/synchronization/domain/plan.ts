import type { ProjectState, Evidence } from '../../project';

export type ActivityVersion = { id: string; code: string; type: string; version: number; locale: string };
export type InstrumentVersion = { id: string; code: string; type: string; version: number; formulaVersion: string | null; items: Array<{ id: string; code: string; order: number }> };
export type HeuristicVersion = { id: string; code: string; version: number };
export type Catalogs = { activities: ActivityVersion[]; instruments: InstrumentVersion[]; heuristics: HeuristicVersion[] };
export type SyncOptions = { learning: boolean; reservations: boolean; accessibility: boolean; report: boolean; ux?: { executionId: string; noticeVersion: string }; assignment?: { id: string; activityVersionId: string } };
export type SyncAction = 'persona.create' | 'scenario.create' | 'execution.start' | 'execution.results' | 'evaluation.create' | 'evaluation.responses' | 'finding.create' | 'demoUser.create' | 'reservation.create' | 'reservation.cancel' | 'accessibility.save' | 'report.create' | 'ux.create';
export type SyncStep = { id: string; action: SyncAction; data: Record<string, unknown> };
export type SyncItem = { key: string; label: string; steps: SyncStep[] };
export type SyncPlan = { items: SyncItem[]; excluded: Array<{ key: string; reason: string }> };
type Ref = { $ref: string; field?: 'id' | 'version' | 'updatedAt' };
type Selection = { source: string; id: Ref };
const ref = (id: string, field?: Ref['field']): Ref => field ? { $ref: id, field } : { $ref: id };
const finite = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);
const omitId = <T extends { id: string }>(value: T) => Object.fromEntries(Object.entries(value).filter(([key]) => key !== 'id'));
// Frontend 2.5.0 produces the v1 activity/instrument shapes. A future catalog
// revision must be reviewed before attaching historical local work to it.
const compatibleVersion = <T extends { version: number }>(values: T[]) => values.find(item => item.version === 1);

/** Pure plan: the caller explicitly executes it after authenticating the account. */
export function buildSyncPlan(project: ProjectState, catalogs: Catalogs, options: SyncOptions): SyncPlan {
  const plan: SyncPlan = { items: [], excluded: [] };
  const selections = new Map<string, Selection[]>();
  const add = (key: string, label: string, steps: SyncStep[], source?: string, selectedStep?: string) => {
    plan.items.push({ key, label, steps });
    if (source) selections.set(key, [{ source, id: ref(selectedStep ?? steps[0].id) }]);
  };
  const exclude = (key: string, reason: string) => plan.excluded.push({ key, reason });
  const activity = (code: string) => compatibleVersion(catalogs.activities.filter(item => item.code === code));
  const instrument = (type: string) => compatibleVersion(catalogs.instruments.filter(item => item.type === type && item.formulaVersion === (type === 'SUS' ? 'SUS-5PT-1.0' : 'RAW-TLX-MEAN-1.0')));
  const evaluation = (key: string, label: string, input: Record<string, unknown>, answers?: number[], type?: 'SUS' | 'NASA_TLX') => {
    const selectedInstrument = type ? instrument(type) : undefined;
    if (type && (!selectedInstrument || selectedInstrument.items.length !== (type === 'SUS' ? 10 : 6) || !selectedInstrument.formulaVersion)) { exclude(key, 'CATALOG_UNAVAILABLE'); return; }
    const createId = key + '/create';
    const steps: SyncStep[] = [{ id: createId, action: 'evaluation.create', data: { ...input, ...(selectedInstrument ? { instrumentId: selectedInstrument.id } : {}) } }];
    if (answers && selectedInstrument) steps.push({ id: key + '/responses', action: 'evaluation.responses', data: { sessionId: ref(createId), responses: [...selectedInstrument.items].sort((a, b) => a.order - b.order).map((item, index) => ({ itemId: item.id, value: answers[index] })) } });
    add(key, label, steps, 'evaluation_session');
  };

  if (options.learning) {
    for (const persona of project.personas) add('personas:' + persona.id, persona.name, [{ id: 'personas:' + persona.id + '/create', action: 'persona.create', data: omitId(persona) }], 'persona');
    for (const scenario of project.scenarios) {
      const key = 'scenarios:' + scenario.id;
      if (scenario.personaId && !selections.has('personas:' + scenario.personaId)) { exclude(key, 'MISSING_REFERENCE'); continue; }
      add(key, scenario.title, [{ id: key + '/create', action: 'scenario.create', data: { ...omitId(scenario), ...(scenario.personaId ? { personaId: ref('personas:' + scenario.personaId + '/create') } : {}) } }], 'scenario');
    }
    for (const user of project.users ?? []) {
      const key = 'users:' + user.id;
      add(key, user.name, [{ id: key + '/create', action: 'demoUser.create', data: { name: user.name, email: user.email, role: user.role, state: user.status } }], 'demo_user');
    }
    for (const session of project.sessions) {
      const key = 'sessions:' + session.id;
      evaluation(key, session.task, { type: 'task', participantAlias: session.participant, task: session.task, success: session.success, seconds: session.seconds, errors: session.errors, seq: session.seq, emotion: session.emotion, notes: session.notes });
      if (session.susResponses?.length === 10) {
        evaluation(key + '/sus', session.task, { type: 'SUS', participantAlias: session.participant, task: session.task, notes: session.notes }, session.susResponses, 'SUS');
        if (selections.has(key + '/sus')) selections.set(key, [...selections.get(key)!, ...selections.get(key + '/sus')!]);
      }
      else exclude(key + '/sus', 'MISSING_RESPONSES');
    }
    for (const finding of project.findings) {
      const key = 'findings:' + finding.id;
      const heuristic = finding.heuristicId ? compatibleVersion(catalogs.heuristics.filter(item => item.code === finding.heuristicId)) : undefined;
      if (finding.heuristicId && !heuristic) { exclude(key, 'CATALOG_UNAVAILABLE'); continue; }
      add(key, finding.problem, [
        { id: key + '/session', action: 'evaluation.create', data: { type: 'heuristic', task: finding.task || finding.heuristic } },
        { id: key + '/create', action: 'finding.create', data: { sessionId: ref(key + '/session'), task: finding.task || finding.heuristic, heuristicLabel: finding.heuristic, ...(heuristic ? { heuristicVersionId: heuristic.id } : {}), severity: finding.severity, problem: finding.problem, evidence: finding.evidence, recommendation: finding.recommendation, source: finding.source, state: finding.status } },
      ], 'finding', key + '/create');
    }
    for (const evidence of project.evidence ?? []) {
      const key = 'evidence:' + evidence.id;
      if (evidence.demo) { exclude(key, 'DEMO_RECORD'); continue; }
      const common = { participantAlias: evidence.participant, task: evidence.task, notes: evidence.notes };
      if (evidence.kind === 'ux') {
        const scores = evidence.scores;
        if (['seconds', 'errors', 'success'].some(code => !finite(scores[code]))) { exclude(key, 'MISSING_RESPONSES'); continue; }
        evaluation(key, evidence.task, { ...common, type: 'task', seconds: scores.seconds, errors: scores.errors, success: scores.success === 1, ...(scores.seq === undefined ? {} : { seq: scores.seq }), ...(scores.emotion === undefined ? {} : { emotion: scores.emotion }) });
        continue;
      }
      if (evidence.kind === 'sus' || evidence.kind === 'tlx') {
        const sus = evidence.kind === 'sus';
        const answers = (sus ? Array.from({ length: 10 }, (_, index) => 'response' + (index + 1)) : ['mental', 'physical', 'temporal', 'performance', 'effort', 'frustration']).map(code => evidence.scores[code]);
        if (answers.some(value => !finite(value) || value < (sus ? 1 : 0) || value > (sus ? 5 : 100) || sus && !Number.isInteger(value))) { exclude(key, 'MISSING_RESPONSES'); continue; }
        evaluation(key, evidence.task, { ...common, type: sus ? 'SUS' : 'NASA_TLX' }, answers, sus ? 'SUS' : 'NASA_TLX');
        continue;
      }
      const code = evidence.kind === 'concept' ? 'concept-practice' : evidence.kind === 'pattern' ? 'pattern-observation' : evidence.kind === 'experiment' ? evidence.experiment?.kind.toLowerCase() : undefined;
      if (!code) { exclude(key, 'UNSUPPORTED_RECORD'); continue; }
      const selectedActivity = activity(code);
      if (!selectedActivity) { exclude(key, 'CATALOG_UNAVAILABLE'); continue; }
      if (options.assignment && selectedActivity.id !== options.assignment.activityVersionId) { exclude(key, 'ASSIGNMENT_ACTIVITY_MISMATCH'); continue; }
      const result = resultData(evidence);
      if (!result) { exclude(key, 'MISSING_RESPONSES'); continue; }
      const startId = key + '/start';
      add(key, evidence.task, [
        { id: startId, action: 'execution.start', data: { activityVersionId: selectedActivity.id, ...(options.assignment ? { assignmentId: options.assignment.id } : {}), source: evidence.kind === 'experiment' ? 'measured' : 'mixed', alias: evidence.participant, condition: evidence.condition, prototype: evidence.prototype } },
        { id: key + '/results', action: 'execution.results', data: { ...result, executionId: ref(startId), expectedVersion: ref(startId, 'version') } },
      ], 'execution');
    }
  }
  if (options.reservations) for (const reservation of project.appointments) {
    const key = 'appointments:' + reservation.id;
    // A locally cancelled exercise never created a server reservation to cancel.
    if (reservation.status === 'cancelled') { exclude(key, 'CANCELLED_RESERVATION'); continue; }
    add(key, reservation.service, [{ id: key + '/create', action: 'reservation.create', data: { date: reservation.date, time: reservation.time, ...(reservation.serviceId ? { serviceCode: reservation.serviceId } : { serviceLabel: reservation.service }), ...(reservation.condition ? { condition: reservation.condition } : {}) } }], 'reservation');
  }
  if (options.accessibility) {
    const checks: Selection[] = [];
    for (const [code, passed] of Object.entries(project.a11yChecks)) {
      const key = 'a11yChecks:' + code;
      if (!['keyboard', 'labels', 'contrast', 'zoom', 'screenReader', 'motion'].includes(code)) { exclude(key, 'UNSUPPORTED_RECORD'); continue; }
      add(key, code, [{ id: key + '/save', action: 'accessibility.save', data: { code, passed } }], 'accessibility_check');
      checks.push({ source: 'accessibility_check', id: ref(key + '/save') });
    }
    if (checks.length) selections.set('a11yChecks:checks', checks);
  }
  for (const item of project.multimodalEvidence ?? []) exclude('multimodalEvidence:' + item.id, 'UNSUPPORTED_RECORD');
  for (const item of project.events) exclude('events:' + item.id, 'LOCAL_EVENT');
  for (const session of project.pageSessions ?? []) {
    const key = 'pageSessions:' + session.id;
    if (!options.ux) { exclude(key, 'CONSENT_REQUIRED'); continue; }
    const source = session.simulation.length ? session.pointer.length || session.gaze.length ? 'mixed' : 'simulated' : 'measured';
    add(key, session.task || session.route, [{ id: key + '/create', action: 'ux.create', data: { executionId: options.ux.executionId, type: session.target ?? 'page', route: session.route, alias: session.participant, task: session.task, prototype: session.prototype, notes: session.notes, mode: session.modeChanges?.at(-1)?.mode ?? 'observed', source, documentWidth: Math.round(session.width), documentHeight: Math.round(session.height), viewportWidth: Math.round(session.viewportWidth), viewportHeight: Math.round(session.viewportHeight), durationMs: Math.round(session.seconds * 1000), maxDepthPercent: session.maxDepth, clickCount: session.clickCount ?? session.clicks.length, wheelCount: session.wheelEvents ?? 0, exposures: Object.entries(session.exposure ?? {}).map(([band, seconds]) => ({ band, seconds })), consent: { purpose: 'aggregate_metrics', noticeVersion: options.ux.noticeVersion, granted: true } } }], 'ux_session');
  }
  for (const session of project.trackingSessions ?? []) {
    const key = 'trackingSessions:' + session.id;
    if (!options.ux) { exclude(key, 'CONSENT_REQUIRED'); continue; }
    add(key, session.example, [{ id: key + '/create', action: 'ux.create', data: { executionId: options.ux.executionId, type: 'example', route: '/tracking', notes: session.notes, mode: 'observed', source: 'measured', documentWidth: Math.round(session.width), documentHeight: Math.round(session.height), viewportWidth: Math.round(session.width), viewportHeight: Math.round(session.height), durationMs: Math.round(session.seconds * 1000), maxDepthPercent: session.maxDepth, clickCount: session.clicks.length, wheelCount: session.wheelEvents ?? 0, consent: { purpose: 'aggregate_metrics', noticeVersion: options.ux.noticeVersion, granted: true } } }], 'ux_session');
  }
  if (options.report && project.reportDraft) {
    const draft = project.reportDraft;
    const requested = [...draft.selected.map(key => ({ key, section: 'selected' })), ...(draft.includeComparison ? [...draft.before.map(key => ({ key, section: 'before' })), ...draft.after.map(key => ({ key, section: 'after' }))] : [])];
    if (!requested.length) exclude('reportDraft', 'EMPTY_SELECTION');
    else if (requested.some(item => !selections.has(item.key))) exclude('reportDraft', 'MISSING_REFERENCE');
    else add('reportDraft', draft.projectName, [{ id: 'reportDraft/create', action: 'report.create', data: { projectName: draft.projectName, objective: draft.objective, method: draft.method, interpretation: draft.interpretation, improvements: draft.improvements, limitations: draft.limits, conclusions: draft.conclusions, references: draft.references, includeComparison: draft.includeComparison, justification: draft.justification, format: 'json', records: requested.flatMap(item => selections.get(item.key)!.map(selection => ({ ...selection, section: item.section }))) } }]);
  }
  return plan;
}

function resultData(evidence: Evidence): Record<string, unknown> | undefined {
  if (evidence.kind === 'concept' && evidence.concept) return { metrics: [
    ...(finite(evidence.scores.seconds) ? [{ code: 'duration_seconds', repetition: 1, value: evidence.scores.seconds }] : []),
    ...(finite(evidence.scores.errors) ? [{ code: 'errors', repetition: 1, value: evidence.scores.errors }] : []),
  ], concept: { code: evidence.concept.id, outcome: evidence.concept.outcome, ...evidence.concept.response, ...Object.fromEntries(['emotionBefore', 'emotionAfter', 'confidenceBefore', 'confidenceAfter'].filter(key => evidence.scores[key] !== undefined).map(key => [key, evidence.scores[key]])) }, notes: evidence.notes };
  if (evidence.kind === 'pattern' && evidence.pattern) { const { id, ...pattern } = evidence.pattern; return { metrics: [], pattern: { code: id, ...pattern }, notes: evidence.notes }; }
  if (evidence.kind === 'experiment' && evidence.experiment?.trials.length === 8) return { metrics: [], trials: evidence.experiment.trials.map((trial, index) => ({ ...trial, number: index + 1 })), notes: evidence.notes };
  return undefined;
}
