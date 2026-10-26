import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import '../../src/app/i18n';
import i18n from '../../src/app/i18n';
import { DeliveryReview, DeliverySubmission } from '../../src/features/learning/presentation/DeliveryActions';
import { deliveryCopy } from '../../src/features/learning/presentation/delivery-copy';
import { progressClient } from '../../src/features/learning/infrastructure/client';

afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe('group assignment delivery actions', () => {
  it('submits a completed assigned execution with a stable retry key and localized confirmation', async () => {
    await i18n.changeLanguage('es-CO');
    const create = vi.spyOn(progressClient, 'createDelivery').mockResolvedValue({ item: { id: 'delivery-1', version: 1, state: 'submitted' } });
    const onComplete = vi.fn();
    render(<DeliverySubmission execution={{ id: 'execution-1', state: 'completed', version: 2, assignment_id: 'assignment-1' }} onComplete={onComplete}/>);
    fireEvent.change(screen.getByLabelText(deliveryCopy['es-CO'].comment), { target: { value: 'Resultados del ejercicio' } });
    fireEvent.click(screen.getByRole('button', { name: deliveryCopy['es-CO'].submit }));
    await waitFor(() => expect(create).toHaveBeenCalledOnce());
    expect(create.mock.calls[0][0]).toBe('execution-1');
    expect(create.mock.calls[0][1]).toBe('Resultados del ejercicio');
    expect(create.mock.calls[0][2]).toMatch(/^[0-9a-f-]{36}$/i);
    expect(await screen.findByRole('status')).toHaveTextContent(deliveryCopy['es-CO'].sent);
    expect(onComplete).toHaveBeenCalledOnce();
  });

  it('only shows submission for a completed execution linked to an assignment', () => {
    const { container } = render(<DeliverySubmission execution={{ id: 'execution-1', state: 'in_progress', version: 1 }} onComplete={vi.fn()}/>);
    expect(container).toBeEmptyDOMElement();
  });

  it('reviews a group delivery with optimistic state and clear feedback', async () => {
    await i18n.changeLanguage('es-CO');
    const review = vi.spyOn(progressClient, 'reviewDelivery').mockResolvedValue({ item: { id: 'delivery-1', version: 1, state: 'accepted' } });
    const onComplete = vi.fn();
    render(<DeliveryReview delivery={{ id: 'delivery-1', version: 1, state: 'submitted' }} onComplete={onComplete}/>);
    fireEvent.change(screen.getByLabelText(deliveryCopy['es-CO'].response), { target: { value: 'Buen análisis, evidencia clara.' } });
    fireEvent.click(screen.getByRole('button', { name: deliveryCopy['es-CO'].accepted }));
    await waitFor(() => expect(review).toHaveBeenCalledWith('delivery-1', 'submitted', 'accepted', 'Buen análisis, evidencia clara.'));
    expect(await screen.findByRole('status')).toHaveTextContent(deliveryCopy['es-CO'].reviewed);
    expect(onComplete).toHaveBeenCalledOnce();
  });

  it('provides delivery and review messages in all six supported locales', () => {
    expect(Object.keys(deliveryCopy)).toEqual(['es-CO', 'en-US', 'pt-BR', 'fr-FR', 'it-IT', 'ca-ES']);
    for (const copy of Object.values(deliveryCopy)) expect(copy.failed.trim()).not.toBe('');
  });
});
