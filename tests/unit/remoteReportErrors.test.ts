import { describe, expect, it } from 'vitest';
import { HttpError } from '../../src/shared/http';
import { remoteReportErrorKind, remoteReportRequestId } from '../../src/features/remoteReports/presentation/errors';

describe('remote report user-facing errors', () => {
  it('maps server codes to a translated recovery category without returning the code', () => {
    expect(remoteReportErrorKind(new HttpError('INTERNAL_ERROR', 500))).toBe('unavailable');
    expect(remoteReportErrorKind(new HttpError('VERSION_CONFLICT', 409))).toBe('conflict');
    expect(remoteReportErrorKind('DEPENDENCY_UNAVAILABLE')).toBe('unavailable');
    expect(remoteReportErrorKind('UNRECOGNIZED_BACKEND_CODE')).toBe('generic');
  });

  it('maps access, validation, throttling and connectivity failures', () => {
    expect(remoteReportErrorKind(new HttpError('UNAUTHENTICATED', 401))).toBe('unauthenticated');
    expect(remoteReportErrorKind(new HttpError('FORBIDDEN', 403))).toBe('forbidden');
    expect(remoteReportErrorKind(new HttpError('INVALID_REQUEST', 422))).toBe('invalid');
    expect(remoteReportErrorKind(new HttpError('RATE_LIMITED', 429))).toBe('rateLimited');
    expect(remoteReportErrorKind(new HttpError('NETWORK_ERROR'))).toBe('connectivity');
  });

  it('keeps a request reference separate from the user-facing message', () => {
    expect(remoteReportRequestId(new HttpError('INTERNAL_ERROR', 500, 'req-123'))).toBe('req-123');
    expect(remoteReportRequestId(new Error('INTERNAL_ERROR'))).toBeUndefined();
  });
});
