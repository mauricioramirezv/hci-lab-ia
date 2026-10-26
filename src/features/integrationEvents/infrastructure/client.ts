import { createHttpClient, serviceUrls } from '../../../shared/http';
import type { IntegrationEvent, IntegrationService } from '../domain/types';

const http = createHttpClient(serviceUrls.identity);

export const integrationEventsClient = {
  list: () => http.request<{ items: IntegrationEvent[]; requestId: string }>('/v1/admin/integrations/events'),
  retry: (input: { service: IntegrationService; eventId: string; target: IntegrationService }) =>
    http.request<{ service: IntegrationService; eventId: string; target: IntegrationService; requeued: boolean }>(
      '/v1/admin/integrations/events/retry', { method: 'POST', body: input },
    ),
};
