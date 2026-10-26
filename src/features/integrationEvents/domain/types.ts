export type IntegrationService = 'identidad' | 'aprendizaje' | 'comunidad' | 'evidencias';

export type IntegrationEvent = {
  service: IntegrationService;
  state: 'available' | 'unavailable';
  outbox?: Array<{ target: IntegrationService; status: string; count: number }>;
  inbox?: { received: number; processed: number; pending: number; lastReceivedAt: string | null };
  deadLetters?: Array<{
    eventId: string;
    target: IntegrationService;
    attempts: number;
    lastError: string | null;
    eventType: string;
    aggregateType: string;
    aggregateId: string;
    occurredAt: string;
  }>;
  code?: string;
};
