import { HttpError } from '../../../shared/http';

export type RemoteReportErrorKind =
  | 'connectivity'
  | 'unauthenticated'
  | 'forbidden'
  | 'invalid'
  | 'conflict'
  | 'rateLimited'
  | 'notFound'
  | 'unavailable'
  | 'generic';

function kindFromCode(value: string): RemoteReportErrorKind {
  const code = value.toUpperCase();
  if (code.includes('UNAUTHENTICATED') || code.includes('SESSION_EXPIRED')) return 'unauthenticated';
  if (code.includes('FORBIDDEN') || code.includes('ACCESS_DENIED')) return 'forbidden';
  if (code.includes('CONFLICT') || code.includes('VERSION_MISMATCH')) return 'conflict';
  if (code.includes('RATE_LIMIT') || code.includes('TOO_MANY')) return 'rateLimited';
  if (code.includes('NOT_FOUND')) return 'notFound';
  if (code.includes('INVALID') || code.includes('VALIDATION')) return 'invalid';
  if (code.includes('NETWORK') || code.includes('TIMEOUT') || code.includes('ABORT')) return 'connectivity';
  if (code.includes('UNAVAILABLE') || code.includes('INTERNAL_ERROR') || code.includes('SERVICE_ERROR')) return 'unavailable';
  return 'generic';
}

export function remoteReportErrorKind(error: unknown): RemoteReportErrorKind {
  if (error instanceof HttpError) {
    if (error.status === 401) return 'unauthenticated';
    if (error.status === 403) return 'forbidden';
    if (error.status === 404) return 'notFound';
    if (error.status === 409) return 'conflict';
    if (error.status === 429) return 'rateLimited';
    if (error.status === 400 || error.status === 422) return 'invalid';
    if (error.status >= 500) return 'unavailable';
    if (error.status === 0) return kindFromCode(error.code) === 'generic' ? 'connectivity' : kindFromCode(error.code);
    return kindFromCode(error.code);
  }
  if (error instanceof TypeError || (error instanceof Error && error.name === 'AbortError')) return 'connectivity';
  if (typeof error === 'string') return kindFromCode(error);
  return 'generic';
}

export function remoteReportRequestId(error: unknown): string | undefined {
  return error instanceof HttpError && error.requestId ? error.requestId : undefined;
}
