import { createHttpClient, HttpError, serviceUrls } from '../../../shared/http';
import type { ReportFormat, RemoteReport, ReportSelection } from '../domain/report';

const http = createHttpClient(serviceUrls.evidence);
const learning = createHttpClient(serviceUrls.learning);
type List<T> = { items: T[]; limit?: number; offset?: number };
export type ReportWorkspace = { id: string; nombre?: string; name?: string };
export type ReportExecution = { id: string; workspace_id?: string; state: string; started_at?: string };
export type ReportDefinitionInput = {
  workspaceId: string;
  projectName?: string;
  objective?: string;
  method?: string;
  interpretation?: string;
  improvements?: string;
  limitations?: string;
  conclusions?: string;
  references?: string;
  includeComparison?: boolean;
  justification?: string;
  format: ReportFormat;
  records: ReportSelection[];
};
export const reportClient = {
  async workspaces() { return (await learning.request<List<ReportWorkspace>>('/v1/workspaces?limit=100&offset=0')).items ?? []; },
  async executions() { return (await learning.request<List<ReportExecution>>('/v1/executions?limit=100&offset=0')).items ?? []; },
  async list(workspaceId: string) {
    return (await http.request<List<RemoteReport>>('/v1/reports?workspaceId=' + encodeURIComponent(workspaceId) + '&limit=100&offset=0')).items ?? [];
  },
  async get(id: string) { return (await http.request<{ item: RemoteReport }>('/v1/reports/' + encodeURIComponent(id))).item; },
  async create(input: ReportDefinitionInput, idempotencyKey: string) {
    const result = await http.request<{ item: RemoteReport; replayed: boolean }>('/v1/reports', { method: 'POST', body: input, idempotencyKey });
    if (!result?.item?.id) throw new HttpError('INVALID_RESPONSE');
    return result.item;
  },
  async generate(id: string, idempotencyKey: string) {
    return http.request<{ item: Pick<RemoteReport, 'id' | 'status' | 'snapshotVersion' | 'missingSources' | 'lastError' | 'generatedAt'>; replayed: boolean }>('/v1/reports/' + encodeURIComponent(id) + '/generate', { method: 'POST', idempotencyKey });
  },
  async download(id: string, format: ReportFormat) {
    const url = serviceUrls.evidence.replace(/\/$/, '') + '/v1/reports/' + encodeURIComponent(id) + '/export?format=' + format;
    let response: Response;
    try { response = await fetch(url, { method: 'GET', credentials: 'include', headers: { accept: '*/*' } }); }
    catch { throw new HttpError('NETWORK_ERROR'); }
    if (!response.ok) {
      let body: { code?: unknown; requestId?: unknown } = {};
      try { body = await response.json() as typeof body; } catch { /* keep status fallback */ }
      throw new HttpError(typeof body.code === 'string' ? body.code : 'REQUEST_FAILED', response.status, typeof body.requestId === 'string' ? body.requestId : '');
    }
    return { blob: await response.blob(), filename: response.headers.get('content-disposition')?.match(/filename="?([^";]+)"?/i)?.[1] ?? ('hci-report-' + id + '.' + format) };
  },
};
