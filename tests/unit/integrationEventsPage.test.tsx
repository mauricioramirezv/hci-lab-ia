import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '../../src/app/i18n';
import { IdentityProvider } from '../../src/features/identity/presentation';
import { identityClient } from '../../src/features/identity/infrastructure/client';
import { integrationEventsClient } from '../../src/features/integrationEvents/infrastructure/client';
import { IntegrationEventsPage } from '../../src/features/integrationEvents/presentation/IntegrationEventsPage';
import { integrationEventLocales } from '../../src/features/integrationEvents/locales';
import type { IntegrationEvent } from '../../src/features/integrationEvents/domain/types';
import type { IdentityAccount } from '../../src/features/identity/domain/types';

const copy = integrationEventLocales['es-CO'];
const administrator = {
  id: '00000000-0000-4000-8000-000000000001', email: 'admin@example.invalid', displayName: 'Admin sintético',
  platformRole: 'admin' as const, emailVerified: true, status: 'active' as const, version: 1,
  globalRoles: ['administrator' as const], permissions: ['account:manage', 'role:assign'],
};
const response = (events: NonNullable<IntegrationEvent['deadLetters']> = []) => ({requestId:'request-test',items:[
  {service:'identidad' as const,state:'available' as const,outbox:[{target:'aprendizaje' as const,status:'deadletter',count:1}],inbox:{received:7,processed:6,pending:1,lastReceivedAt:'2026-10-24T10:00:00Z'},deadLetters:events},
  ...(['aprendizaje','comunidad','evidencias'] as const).map(service=>({service,state:'available' as const,outbox:[],inbox:{received:0,processed:0,pending:0,lastReceivedAt:null},deadLetters:[]})),
]});
afterEach(()=>{cleanup();vi.restoreAllMocks();});
function renderPage(account: IdentityAccount = administrator) {
  vi.spyOn(identityClient,'me').mockResolvedValue({account,csrfToken:'test-csrf'});
  render(<MemoryRouter><IdentityProvider><IntegrationEventsPage/></IdentityProvider></MemoryRouter>);
}

it('shows service inbox/outbox health and lets a permitted administrator retry a dead letter', async()=>{
  const integration = vi.spyOn(integrationEventsClient,'list').mockResolvedValueOnce(response([{eventId:'00000000-0000-4000-8000-000000000002',target:'aprendizaje',attempts:8,lastError:'HTTP_503',eventType:'execution.changed',aggregateType:'execution',aggregateId:'00000000-0000-4000-8000-000000000003',occurredAt:'2026-10-24T10:00:00Z'}])).mockResolvedValueOnce(response());
  const retry = vi.spyOn(integrationEventsClient,'retry').mockResolvedValue({service:'identidad',eventId:'00000000-0000-4000-8000-000000000002',target:'aprendizaje',requeued:true});
  renderPage();
  expect(await screen.findByRole('heading',{name:copy.title})).toBeVisible();
  expect(await screen.findByText('HTTP_503')).toBeVisible();
  expect(screen.getAllByText(copy.pending,{exact:true}).length).toBeGreaterThan(0);
  fireEvent.click(screen.getByRole('button',{name:copy.retry}));
  await waitFor(()=>expect(retry).toHaveBeenCalledWith({service:'identidad',eventId:'00000000-0000-4000-8000-000000000002',target:'aprendizaje'}));
  expect(await screen.findByText(copy.retryQueued)).toBeVisible();
  expect(integration).toHaveBeenCalledTimes(2);
});

it('does not query event status for non-administrator accounts', async()=>{
  const integration = vi.spyOn(integrationEventsClient,'list');
  renderPage({...administrator,platformRole:'participant',globalRoles:['participant']});
  expect(await screen.findByText(copy.forbidden)).toBeVisible();
  expect(integration).not.toHaveBeenCalled();
});

it('keeps monitoring permission separate from retry permission', async()=>{
  const integration=vi.spyOn(integrationEventsClient,'list').mockResolvedValue(response([{eventId:'00000000-0000-4000-8000-000000000002',target:'aprendizaje',attempts:8,lastError:'HTTP_503',eventType:'execution.changed',aggregateType:'execution',aggregateId:'00000000-0000-4000-8000-000000000003',occurredAt:'2026-10-24T10:00:00Z'}]));
  renderPage({...administrator,permissions:['account:manage']});
  expect(await screen.findByText(copy.retryPermission)).toBeVisible();
  expect(screen.queryByRole('button',{name:copy.retry})).not.toBeInTheDocument();
  expect(integration).toHaveBeenCalledTimes(1);
});
