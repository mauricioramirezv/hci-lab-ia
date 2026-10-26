import { afterEach, describe, expect, it, vi } from 'vitest';
import { HttpError, setCsrfToken } from '../../src/shared/http';
import { createServiceGateway } from '../../src/features/synchronization/infrastructure/serviceGateway';
import type { SyncAction } from '../../src/features/synchronization/domain/plan';

const urls = { identity: 'http://test/identity', learning: 'http://test/learning', community: 'http://test/community', evidence: 'http://test/evidence' };
const response = (body: unknown) => new Response(JSON.stringify(body), { status: 200, headers: { 'content-type': 'application/json' } });
afterEach(() => setCsrfToken(''));

describe('service HTTP gateway contracts', () => {
  it('loads published assignments through Community memberships and Learning-owned records', async () => {
    const request = vi.fn(async (url: RequestInfo | URL) => {
      const path=String(url);
      if(path.includes('community/v1/groups')) return response({items:[{id:'group-1',name:'Study group'}]});
      return response({items:[{id:'assignment-1',title:'Fitts task',activity_version_id:'activity-v1',state:'published'},{id:'closed-assignment',title:'Closed',activity_version_id:'activity-v1',state:'closed'}]});
    });
    const remote=createServiceGateway({fetch:request as typeof fetch,urls});
    expect(await remote.listAssignments?.()).toEqual([{id:'assignment-1',title:'Fitts task',groupName:'Study group',activityVersionId:'activity-v1'}]);
    expect(request.mock.calls.map(call=>String(call[0]))).toEqual(['http://test/community/v1/groups?limit=100&offset=0','http://test/learning/v1/groups/group-1/assignments?limit=100&offset=0']);
  });
  it('normalizes workspace names and reads every page without enabling any mutation', async () => {
    const request = vi.fn(async (url: RequestInfo | URL) => response({ items: String(url).includes('offset=0') ? Array.from({ length: 100 }, (_, index) => ({ id: 'workspace-' + index, nombre: 'Workspace ' + index })) : [{ id: 'last', name: 'Last' }] }));
    const remote = createServiceGateway({ fetch: request as typeof fetch, urls });
    const workspaces = await remote.listWorkspaces();
    expect(workspaces).toHaveLength(101);
    expect(workspaces[0]).toEqual({ id: 'workspace-0', name: 'Workspace 0' });
    expect(workspaces.at(-1)).toEqual({ id: 'last', name: 'Last' });
    expect(request.mock.calls.map(call => String(call[0]))).toEqual(['http://test/learning/v1/workspaces?limit=100&offset=0', 'http://test/learning/v1/workspaces?limit=100&offset=100']);
  });
  it('normalizes activity/instrument versions and items from the actual REST responses', async () => {
    const request = vi.fn(async (url: RequestInfo | URL) => {
      const path = String(url);
      return response({ items: path.includes('/catalog/activities') ? [{ version_id: 'activity-v1', code: 'fitts', type: 'experiment', version: 1, locale: 'fr-FR' }] : path.includes('/instruments') ? [{ id: 'instrument-v1', code: 'SUS', type: 'SUS', version: 1, formulaVersion: 'SUS-5PT-1.0', items: [{ id: 'q1-id', code: 'q1', order: 1 }] }] : [{ id: 'h1-v1', code: 'h1', version: 1 }] });
    });
    const remote = createServiceGateway({ fetch: request as typeof fetch, urls });
    expect(await remote.loadCatalogs('fr-FR')).toEqual({ activities: [{ id: 'activity-v1', code: 'fitts', type: 'experiment', version: 1, locale: 'fr-FR' }], instruments: [{ id: 'instrument-v1', code: 'SUS', type: 'SUS', version: 1, formulaVersion: 'SUS-5PT-1.0', items: [{ id: 'q1-id', code: 'q1', order: 1 }] }], heuristics: [{ id: 'h1-v1', code: 'h1', version: 1 }] });
    expect(request.mock.calls.every(call => String(call[0]).includes('locale=fr-FR'))).toBe(true);
  });
  it('filters executions by the selected workspace before offering them for aggregate consent', async () => {
    const request = vi.fn(async () => response({ items: [{ id: 'allowed', workspace_id: 'selected', condition: 'good', state: 'completed' }, { id: 'other', workspace_id: 'another', state: 'completed' }] }));
    const remote = createServiceGateway({ fetch: request as typeof fetch, urls });
    expect(await remote.listExecutions('selected')).toEqual([{ id: 'allowed', label: 'good · completed · allowed' }]);
  });
  it.each<[SyncAction, Record<string, unknown>, string, string, unknown]>([
    ['persona.create', { name: 'Persona' }, 'learning', '/v1/workspaces/workspace/personas', { name: 'Persona' }],
    ['scenario.create', { personaId: 'remote-persona' }, 'learning', '/v1/workspaces/workspace/scenarios', { personaId: 'remote-persona' }],
    ['execution.start', { activityVersionId: 'v1' }, 'learning', '/v1/executions', { activityVersionId: 'v1', workspaceId: 'workspace' }],
    ['execution.results', { executionId: 'execution', expectedVersion: 1, metrics: [] }, 'learning', '/v1/executions/execution/results', { expectedVersion: 1, metrics: [] }],
    ['evaluation.create', { type: 'task' }, 'learning', '/v1/workspaces/workspace/evaluation-sessions', { type: 'task' }],
    ['evaluation.responses', { sessionId: 'session', responses: [{ itemId: 'q1', value: 3 }] }, 'learning', '/v1/evaluation-sessions/session/responses', { responses: [{ itemId: 'q1', value: 3 }] }],
    ['finding.create', { sessionId: 'session', task: 'Task' }, 'learning', '/v1/workspaces/workspace/heuristic-findings', { sessionId: 'session', task: 'Task' }],
    ['demoUser.create', { role: 'teacher' }, 'learning', '/v1/demo-users', { role: 'teacher' }],
    ['reservation.create', { date: '2099-01-01', time: '10:00', serviceCode: 'advice' }, 'community', '/v1/reservations', { date: '2099-01-01', time: '10:00', serviceCode: 'advice', workspaceId: 'workspace' }],
    ['accessibility.save', { code: 'keyboard', passed: true }, 'evidence', '/v1/workspaces/workspace/accessibility-checks/keyboard', { passed: true }],
    ['report.create', { records: [] }, 'evidence', '/v1/reports', { records: [], workspaceId: 'workspace' }],
    ['ux.create', { executionId: 'execution', consent: { granted: true } }, 'evidence', '/v1/ux-sessions', { executionId: 'execution', consent: { granted: true } }],
  ])('maps %s to its owning service, preserves the request key and uses cookie+CSRF access', async (action, data, service, path, expectedBody) => {
    setCsrfToken('csrf-fixture');
    const request = vi.fn<typeof fetch>(async () => response({ item: { id: 'remote', version: 2, updated_at: '2026-10-24T12:00:00Z' }, replayed: false }));
    const remote = createServiceGateway({ fetch: request as typeof fetch, urls });
    expect(await remote.perform(action, data, 'workspace', 'durable-operation')).toMatchObject({ id: 'remote', version: 2, updatedAt: '2026-10-24T12:00:00Z' });
    const [url, init] = request.mock.calls[0];
    expect(String(url)).toBe(`http://test/${service}${path}`);
    expect(init?.credentials).toBe('include');
    expect(init?.method).toBe(action === 'accessibility.save' ? 'PUT' : 'POST');
    expect(init?.headers).toMatchObject({ 'x-csrf-token': 'csrf-fixture', 'idempotency-key': 'durable-operation' });
    expect(JSON.parse(String(init?.body))).toEqual(expectedBody);
  });
  it('requires the known reservation version when cancelling and does not send a body', async () => {
    setCsrfToken('csrf-fixture');
    const request = vi.fn<typeof fetch>(async () => response({ id: 'reservation', version: 3 }));
    const remote = createServiceGateway({ fetch: request as typeof fetch, urls });
    await remote.perform('reservation.cancel', { id: 'reservation', version: 2 }, 'workspace', 'operation');
    expect(request.mock.calls[0][1]?.headers).toMatchObject({ 'if-match': '"2"' });
    expect(request.mock.calls[0][1]?.body).toBeUndefined();
  });
  it('fails on malformed responses instead of inventing identifiers', async () => {
    const remote = createServiceGateway({ fetch: vi.fn(async () => response({ items: [{ name: 'Missing identifier' }] })) as typeof fetch, urls });
    await expect(remote.listWorkspaces()).rejects.toMatchObject({ code: 'INVALID_RESPONSE' });
  });
  it('fails visibly when pagination cannot finish within the safe bound', async () => {
    const request = vi.fn(async () => response({ items: Array.from({ length: 100 }, (_, index) => ({ id: 'id-' + index, name: 'Name' })) }));
    const remote = createServiceGateway({ fetch: request as typeof fetch, urls });
    await expect(remote.listWorkspaces()).rejects.toEqual(new HttpError('PAGINATION_LIMIT'));
    expect(request).toHaveBeenCalledTimes(100);
  });
});
