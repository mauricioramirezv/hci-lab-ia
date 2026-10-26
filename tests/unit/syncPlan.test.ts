import { describe, expect, it } from 'vitest';
import { createBackup, defaultPrefs, emptyProject, parseBackup } from '../../src/features/project';
import type { Evidence } from '../../src/features/project';
import { buildSyncPlan } from '../../src/features/synchronization/domain/plan';
import type { Catalogs, SyncOptions } from '../../src/features/synchronization/domain/plan';

const options: SyncOptions = { learning: true, reservations: true, accessibility: true, report: true };
const catalogs: Catalogs = {
  activities: ['concept-practice', 'pattern-observation', 'fitts', 'hick'].map((code, index) => ({ id: 'version-' + index, code, type: index === 0 ? 'concept' : index === 1 ? 'pattern' : 'experiment', locale: 'es-CO', version: 1 })),
  instruments: [
    { id: 'sus-version', code: 'SUS', type: 'SUS', version: 1, formulaVersion: 'SUS-5PT-1.0', items: Array.from({ length: 10 }, (_, index) => ({ id: 'sus-' + index, code: 'q' + (index + 1), order: index + 1 })) },
    { id: 'tlx-version', code: 'NASA_TLX_RAW', type: 'NASA_TLX', version: 1, formulaVersion: 'RAW-TLX-MEAN-1.0', items: ['mental', 'physical', 'temporal', 'performance', 'effort', 'frustration'].map((code, index) => ({ id: 'tlx-' + code, code, order: index + 1 })) },
  ],
  heuristics: [{ id: 'h1-version', code: 'h1', version: 1 }],
};
const evidence = (id: string, extra: Partial<Evidence> = {}): Evidence => ({ id, createdAt: '2026-10-24T12:00:00.000Z', kind: 'concept', participant: 'P1', task: 'Task', condition: 'good', prototype: '2.5.0', scores: {}, notes: '', ...extra });

describe('explicit synchronization plan', () => {
  it('maps local persona links through remote step references without mutating backups', () => {
    const project = emptyProject();
    project.personas.push({ id: 'local-1', name: 'Persona', age: '40', context: 'Context', goal: 'Goal', barrier: 'Barrier', device: 'Tablet', empathy: { says: '', thinks: '', does: '', feels: '' } });
    project.scenarios.push({ id: 'local-scenario', personaId: 'local-1', title: 'Scenario', actor: 'Persona', context: 'Context', task: 'Task', constraint: 'Constraint', success: 'Success' });
    const before = createBackup(project, defaultPrefs, 'ca-ES');
    const result = buildSyncPlan(project, catalogs, options);
    expect(result.items[0].steps[0]).toEqual({ id: 'personas:local-1/create', action: 'persona.create', data: { name: 'Persona', age: '40', context: 'Context', goal: 'Goal', barrier: 'Barrier', device: 'Tablet', empathy: { says: '', thinks: '', does: '', feels: '' } } });
    expect(result.items[1].steps[0].data.personaId).toEqual({ $ref: 'personas:local-1/create' });
    expect(parseBackup(before).project).toEqual(project);
    expect(buildSyncPlan(project, catalogs, options)).toEqual(result);
  });
  it('pins the activity version, preserves reflections and lets result recording complete the execution', () => {
    const project = emptyProject();
    project.evidence = [evidence('concept', { concept: { id: 'emotions', outcome: 'cancelled', response: { text: 'My text', reason: 'Reason', edit: '', decision: 'reject' } }, scores: { seconds: 4.2, errors: 1, emotionBefore: 2, emotionAfter: 3 } })];
    const result = buildSyncPlan(project, { ...catalogs, activities: [...catalogs.activities, { ...catalogs.activities[0], id: 'latest', version: 2 }] }, options);
    expect(result.items[0].steps.map(step => step.action)).toEqual(['execution.start', 'execution.results']);
    expect(result.items[0].steps[0].data.activityVersionId).toBe('version-0');
    expect(result.items[0].steps[1].data).toMatchObject({ expectedVersion: { $ref: 'evidence:concept/start', field: 'version' }, metrics: [{ code: 'duration_seconds', repetition: 1, value: 4.2 }, { code: 'errors', repetition: 1, value: 1 }], concept: { code: 'emotions', outcome: 'cancelled', text: 'My text', emotionBefore: 2, emotionAfter: 3 } });
    const unsupported=buildSyncPlan(project,{...catalogs,activities:[{...catalogs.activities[0],id:'future-version',version:2}]},options);
    expect(unsupported.items).toHaveLength(0);expect(unsupported.excluded).toContainEqual({key:'evidence:concept',reason:'CATALOG_UNAVAILABLE'});
  });
  it('links only matching activity versions to the selected group assignment', () => {
    const project = emptyProject();
    project.evidence = [evidence('concept', { concept: { id: 'emotions', outcome: 'completed', response: { text: 'Worked', reason: '', edit: '', decision: 'keep' } }, scores: { seconds: 4, errors: 0 } }), evidence('pattern', { kind: 'pattern', pattern: { id: 'feedback', problem: 'Status is hidden', principle: 'Feedback', correction: 'Make status visible' }, scores: { seconds: 3, errors: 0 } })];
    const result = buildSyncPlan(project, catalogs, { ...options, assignment: { id: 'group-assignment', activityVersionId: 'version-0' } });
    expect(result.items).toHaveLength(1);
    expect(result.items[0].steps[0].data).toMatchObject({ activityVersionId: 'version-0', assignmentId: 'group-assignment' });
    expect(result.excluded).toContainEqual({ key: 'evidence:pattern', reason: 'ASSIGNMENT_ACTIVITY_MISMATCH' });
  });
  it('sends all eight experiment trials and does not resubmit derived metrics', () => {
    const project = emptyProject();
    project.evidence = [evidence('experiment', { kind: 'experiment', experiment: { kind: 'Fitts', condition: 'good', practiceCount: 2, trials: Array.from({ length: 8 }, () => ({ input: 'keyboard', seconds: 0.5, errors: 0, distance: 200, indexDifficulty: 3 })) } })];
    const result = buildSyncPlan(project, catalogs, options).items[0].steps[1].data;
    expect(result.metrics).toEqual([]);
    expect(result.trials).toHaveLength(8);
    expect((result.trials as Record<string, unknown>[])[7]).toEqual({ number: 8, input: 'keyboard', seconds: 0.5, errors: 0, distance: 200, indexDifficulty: 3 });
  });
  it('uses complete versioned instrument answers rather than trusting local SUS/TLX scores', () => {
    const project = emptyProject();
    project.evidence = [evidence('sus', { kind: 'sus', scores: { sus: 100, ...Object.fromEntries(Array.from({ length: 10 }, (_, index) => ['response' + (index + 1), index % 2 ? 1 : 5])) } }), evidence('tlx', { kind: 'tlx', scores: { mental: 10, physical: 20, temporal: 30, performance: 40, effort: 50, frustration: 60, rawTLX: 99 } })];
    const result = buildSyncPlan(project, catalogs, options);
    expect(result.items[0].steps[0].data.instrumentId).toBe('sus-version');
    expect(result.items[0].steps[1].data).toEqual({ sessionId: { $ref: 'evidence:sus/create' }, responses: Array.from({ length: 10 }, (_, index) => ({ itemId: 'sus-' + index, value: index % 2 ? 1 : 5 })) });
    expect(result.items[1].steps[1].data.responses).toEqual(['mental', 'physical', 'temporal', 'performance', 'effort', 'frustration'].map((code, index) => ({ itemId: 'tlx-' + code, value: (index + 1) * 10 })));
    expect(JSON.stringify(result)).not.toContain('rawTLX');
    expect(JSON.stringify(result)).not.toContain('sus_score');
  });
  it('creates a heuristic evaluation context before its finding and maps report refs to the finding', () => {
    const project = emptyProject();
    project.findings = [{ id: 'finding', createdAt: '2026-10-24T12:00:00.000Z', heuristicId: 'h1', heuristic: 'Visibility', severity: 2, problem: 'Problem', evidence: 'Observed', recommendation: 'Fix', source: 'human', status: 'pending' }];
    const result = buildSyncPlan(project, catalogs, options);
    expect(result.items[0].steps[0].data.type).toBe('heuristic');
    expect(result.items[0].steps[1].data).toMatchObject({ sessionId: { $ref: 'findings:finding/session' }, heuristicVersionId: 'h1-version', state: 'pending' });
  });
  it('keeps telemetry, camera calibration and demo records local unless aggregate consent is explicit', () => {
    const project = emptyProject();
    project.evidence = [evidence('demo', { demo: true })];
    project.pageSessions = [{ id: 'page', createdAt: '2026-10-24T12:00:00.000Z', route: '/research', participant: 'P1', task: 'Task', prototype: 'v1', width: 1000, height: 2000, viewportWidth: 1000, viewportHeight: 700, seconds: 5, clicks: [{ x: 12, y: 55, at: 0, weight: 1, source: 'cursor', area: 'main' }], pointer: [], gaze: [], simulation: [], scroll: [], maxDepth: 50, notes: '', capped: false, validation: { medianErrorPx: 15, viewportWidth: 1000, viewportHeight: 700, sampleCount: 6, at: '2026-10-24T12:00:00.000Z' } }];
    expect(buildSyncPlan(project, catalogs, options).excluded).toContainEqual({ key: 'pageSessions:page', reason: 'CONSENT_REQUIRED' });
    const result = buildSyncPlan(project, catalogs, { ...options, ux: { executionId: 'approved-execution', noticeVersion: 'notice-v1' } });
    const data = result.items[0].steps[0].data;
    expect(data).toMatchObject({ executionId: 'approved-execution', durationMs: 5000, clickCount: 1, consent: { purpose: 'aggregate_metrics', noticeVersion: 'notice-v1', granted: true } });
    expect(data).not.toHaveProperty('clicks');
    expect(data).not.toHaveProperty('gaze');
    expect(data).not.toHaveProperty('validation');
    expect(result.excluded).toContainEqual({ key: 'evidence:demo', reason: 'DEMO_RECORD' });
  });
  it('does not silently omit unresolved report selections or invent missing questionnaire responses', () => {
    const project = emptyProject();
    project.evidence = [evidence('old-sus', { kind: 'sus', scores: { sus: 75 } })];
    project.reportDraft = { selected: ['evidence:old-sus'], before: [], after: [], includeComparison: false, justification: '', projectName: '', objective: '', method: '', interpretation: '', improvements: '', limits: '', conclusions: '', references: '' };
    const result = buildSyncPlan(project, catalogs, options);
    expect(result.items).toHaveLength(0);
    expect(result.excluded).toContainEqual({ key: 'evidence:old-sus', reason: 'MISSING_RESPONSES' });
    expect(result.excluded).toContainEqual({ key: 'reportDraft', reason: 'MISSING_REFERENCE' });
  });
  it('preserves fictional-user roles and expands the accessibility checklist into typed report selections', () => {
    const project = emptyProject();
    project.users = [{ id: 'fictional', createdAt: '2026-10-24T12:00:00.000Z', name: 'Fictional', email: 'fictional@example.test', role: 'teacher', status: 'active' }];
    project.a11yChecks = { keyboard: true, contrast: false };
    project.reportDraft = { selected: ['users:fictional', 'a11yChecks:checks'], before: [], after: [], includeComparison: false, justification: '', projectName: 'Study', objective: '', method: '', interpretation: '', improvements: '', limits: 'Limited sample', conclusions: '', references: '' };
    const result = buildSyncPlan(project, catalogs, options);
    expect(result.items[0].steps[0]).toMatchObject({ action: 'demoUser.create', data: { role: 'teacher', state: 'active' } });
    expect(result.items.at(-1)?.steps[0].data).toMatchObject({ limitations: 'Limited sample', records: [
      { section: 'selected', source: 'demo_user', id: { $ref: 'users:fictional/create' } },
      { section: 'selected', source: 'accessibility_check', id: { $ref: 'a11yChecks:keyboard/save' } },
      { section: 'selected', source: 'accessibility_check', id: { $ref: 'a11yChecks:contrast/save' } },
    ] });
  });
});
