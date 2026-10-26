export class HttpError extends Error {
  constructor(readonly code: string, readonly status = 0, readonly requestId = '') {
    super(code);
    this.name = 'HttpError';
  }
}

let csrfToken = '';
export function setCsrfToken(value: string | null | undefined) { csrfToken = value ?? ''; }
export function getCsrfToken(): string {
  if (csrfToken) return csrfToken;
  const value = document.cookie.split(';').map(part => part.trim()).find(part => part.startsWith('hci_identity_csrf='))?.slice('hci_identity_csrf='.length);
  try { return value ? decodeURIComponent(value) : ''; } catch { return ''; }
}

export const serviceUrls = {
  identity: import.meta.env.VITE_IDENTITY_API_URL || '/api/identity',
  learning: import.meta.env.VITE_LEARNING_API_URL || '/api/learning',
  community: import.meta.env.VITE_COMMUNITY_API_URL || '/api/community',
  evidence: import.meta.env.VITE_EVIDENCE_API_URL || '/api/evidence',
};

export type HttpRequest = { method?: string; body?: unknown; idempotencyKey?: string; signal?: AbortSignal; csrf?: boolean; headers?: Record<string,string> };
export function createHttpClient(baseUrl: string, options: { fetch?: typeof fetch; timeoutMs?: number } = {}) {
  const base = baseUrl.replace(/\/$/, '');
  return {
    async request<T>(path: string, input: HttpRequest = {}): Promise<T> {
      if (!path.startsWith('/') || path.startsWith('//')) throw new HttpError('INVALID_REQUEST');
      const method = (input.method ?? 'GET').toUpperCase();
      const mutates = !['GET', 'HEAD', 'OPTIONS'].includes(method);
      const headers: Record<string, string> = { accept: 'application/json' };
      for(const [name,value] of Object.entries(input.headers ?? {})) {
        if(name.toLowerCase() !== 'if-match') throw new HttpError('INVALID_REQUEST');
        headers['if-match'] = value;
      }
      if (input.body !== undefined) headers['content-type'] = 'application/json';
      if (input.idempotencyKey) headers['idempotency-key'] = input.idempotencyKey;
      if (mutates && input.csrf !== false) {
        const token = getCsrfToken();
        if (!token) throw new HttpError('CSRF_REQUIRED', 403);
        headers['x-csrf-token'] = token;
      }
      const controller = new AbortController();
      let timedOut = false;
      const abort = () => controller.abort();
      if (input.signal?.aborted) throw new HttpError('REQUEST_ABORTED');
      input.signal?.addEventListener('abort', abort, { once: true });
      const timer = setTimeout(() => { timedOut = true; controller.abort(); }, options.timeoutMs ?? 15000);
      try {
        const response = await (options.fetch ?? globalThis.fetch)(`${base}${path}`, {
          method, credentials: 'include', headers, signal: controller.signal,
          ...(input.body === undefined ? {} : { body: JSON.stringify(input.body) }),
        });
        const requestId = response.headers?.get('x-request-id') ?? '';
        if (response.status === 204) return undefined as T;
        let payload: unknown;
        try { payload = await response.json(); } catch {
          if (response.ok) throw new HttpError('INVALID_RESPONSE', response.status, requestId);
        }
        if (!response.ok) {
          const error = payload && typeof payload === 'object' ? payload as Record<string, unknown> : {};
          const fallback = response.status === 401 ? 'UNAUTHENTICATED' : response.status === 409 ? 'VERSION_CONFLICT' : response.status === 429 ? 'RATE_LIMITED' : response.status >= 500 ? 'DEPENDENCY_UNAVAILABLE' : 'REQUEST_FAILED';
          const code = typeof error.code === 'string' && /^[A-Z][A-Z0-9_]{1,79}$/.test(error.code) ? error.code : fallback;
          throw new HttpError(code, response.status, requestId || (typeof error.requestId === 'string' ? error.requestId : ''));
        }
        return payload as T;
      } catch (error) {
        if (error instanceof HttpError) throw error;
        if (timedOut) throw new HttpError('REQUEST_TIMEOUT');
        if (input.signal?.aborted) throw new HttpError('REQUEST_ABORTED');
        throw new HttpError('NETWORK_ERROR');
      } finally {
        clearTimeout(timer);
        input.signal?.removeEventListener('abort', abort);
      }
    },
  };
}
