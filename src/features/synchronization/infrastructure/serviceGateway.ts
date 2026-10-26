import { createHttpClient, HttpError, serviceUrls } from '../../../shared/http';
import type { Catalogs, SyncAssignment, SyncRemote, Workspace } from '../application/remote';
import type { SyncAction } from '../domain/plan';

type Row = Record<string, unknown>;
type Client = ReturnType<typeof createHttpClient>;
const invalid = (): never => { throw new HttpError('INVALID_RESPONSE'); };
function row(value: unknown): Row { return value && typeof value === 'object' && !Array.isArray(value) ? value as Row : invalid(); }
function string(value: unknown): string { return typeof value === 'string' && value.length > 0 ? value : invalid(); }
function number(value: unknown): number { const parsed = typeof value === 'number' ? value : typeof value === 'string' && value.trim() ? Number(value) : NaN; return Number.isFinite(parsed) ? parsed : invalid(); }
function list(value: unknown): Row[] { const items = row(value).items; return Array.isArray(items) ? items.map(row) : invalid(); }
function item(value: unknown): Row {
  const outer = row(value), result = outer.item === undefined ? outer : row(outer.item);
  return { ...result, id: string(result.id), ...(result.version === undefined ? {} : { version: number(result.version) }), ...(result.updated_at === undefined ? {} : { updatedAt: string(result.updated_at) }) };
}
function workspace(value: unknown): Workspace { const data = row(value); return { id: string(data.id), name: string(data.name ?? data.nombre) }; }
async function pages(client: Client, path: string, signal?: AbortSignal) {
  const result: Row[] = [], separator = path.includes('?') ? '&' : '?';
  // A full final page requires one further request. Never silently truncate a catalog.
  for (let offset = 0; offset < 10000; offset += 100) {
    const values = list(await client.request<unknown>(`${path}${separator}limit=100&offset=${offset}`, { signal }));
    result.push(...values);
    if (values.length < 100) return result;
  }
  throw new HttpError('PAGINATION_LIMIT');
}
const without = (data: Row, ...keys: string[]) => Object.fromEntries(Object.entries(data).filter(([key]) => !keys.includes(key)));

export function createServiceGateway(options: { fetch?: typeof fetch; urls?: typeof serviceUrls; timeoutMs?: number } = {}): SyncRemote {
  const urls = options.urls ?? serviceUrls;
  const learning = createHttpClient(urls.learning, options), community = createHttpClient(urls.community, options), evidence = createHttpClient(urls.evidence, options);
  return {
    async listAssignments(signal): Promise<SyncAssignment[]> {
      const groups = await pages(community, '/v1/groups', signal);
      const assignments = await Promise.all(groups.map(async group => {
        const groupId = string(group.id), groupName = string(group.name ?? group.nombre);
        return (await pages(learning, `/v1/groups/${encodeURIComponent(groupId)}/assignments`, signal))
          .filter(value => value.state === 'published')
          .map(value => ({ id: string(value.id), title: string(value.title), groupName, activityVersionId: string(value.activity_version_id ?? value.activityVersionId) }));
      }));
      return assignments.flat();
    },
    async listWorkspaces(signal) { return (await pages(learning, '/v1/workspaces', signal)).map(workspace); },
    async listExecutions(workspaceId, signal) {
      return (await pages(learning, '/v1/executions', signal)).filter(value => value.workspace_id === workspaceId || value.workspaceId === workspaceId).map(value => ({ id: string(value.id), label: [value.participant_alias, value.alias, value.condition, value.state, value.id].filter(part => typeof part === 'string' && part).join(' · ') }));
    },
    async createWorkspace(name, idempotencyKey, signal) { return workspace(item(await learning.request<unknown>('/v1/workspaces', { method: 'POST', body: { name }, idempotencyKey, signal }))); },
    async loadCatalogs(locale, signal): Promise<Catalogs> {
      const query = '?locale=' + encodeURIComponent(locale);
      const [activities, instruments, heuristics] = await Promise.all([
        pages(learning, '/v1/catalog/activities' + query, signal), pages(learning, '/v1/instruments' + query, signal), pages(learning, '/v1/heuristics' + query, signal),
      ]);
      return {
        activities: activities.map(value => ({ id: string(value.version_id ?? value.activity_version_id), code: string(value.code ?? value.activity_code), type: string(value.type), version: number(value.version), locale: string(value.locale) })),
        instruments: instruments.map(value => ({ id: string(value.id), code: string(value.code), type: string(value.type), version: number(value.version), formulaVersion: value.formulaVersion === null || value.formula_version === null ? null : string(value.formulaVersion ?? value.formula_version), items: Array.isArray(value.items) ? value.items.map(input => { const current = row(input); return { id: string(current.id), code: string(current.code), order: number(current.order) }; }) : invalid() })),
        heuristics: heuristics.map(value => ({ id: string(value.id), code: string(value.code), version: number(value.version) })),
      };
    },
    async perform(action: SyncAction, data, workspaceId, idempotencyKey, signal) {
      let client = learning, method = 'POST', path: string, body: unknown = data;
      let headers: Record<string, string> | undefined;
      switch (action) {
        case 'persona.create': path = `/v1/workspaces/${encodeURIComponent(workspaceId)}/personas`; break;
        case 'scenario.create': path = `/v1/workspaces/${encodeURIComponent(workspaceId)}/scenarios`; break;
        case 'execution.start': path = '/v1/executions'; body = { ...data, workspaceId }; break;
        case 'execution.results': path = `/v1/executions/${encodeURIComponent(string(data.executionId))}/results`; body = without(data, 'executionId'); break;
        case 'evaluation.create': path = `/v1/workspaces/${encodeURIComponent(workspaceId)}/evaluation-sessions`; break;
        case 'evaluation.responses': path = `/v1/evaluation-sessions/${encodeURIComponent(string(data.sessionId))}/responses`; body = without(data, 'sessionId'); break;
        case 'finding.create': path = `/v1/workspaces/${encodeURIComponent(workspaceId)}/heuristic-findings`; break;
        case 'demoUser.create': path = '/v1/demo-users'; break;
        case 'reservation.create': client = community; path = '/v1/reservations'; body = { ...data, workspaceId }; break;
        case 'reservation.cancel': client = community; path = `/v1/reservations/${encodeURIComponent(string(data.id))}/cancellation`; body = undefined; headers = { 'if-match': `"${number(data.version)}"` }; break;
        case 'accessibility.save': client = evidence; method = 'PUT'; path = `/v1/workspaces/${encodeURIComponent(workspaceId)}/accessibility-checks/${encodeURIComponent(string(data.code))}`; body = { passed: data.passed }; break;
        case 'report.create': client = evidence; path = '/v1/reports'; body = { ...data, workspaceId }; break;
        case 'ux.create': client = evidence; path = '/v1/ux-sessions'; break;
        default: throw new HttpError('INVALID_REQUEST');
      }
      return item(await client.request<unknown>(path, { method, body, idempotencyKey, signal, headers }));
    },
  };
}

export const serviceGateway = createServiceGateway();
