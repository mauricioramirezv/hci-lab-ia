import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import '../../src/app/i18n';
import i18n from '../../src/app/i18n';
import { AssignmentComposer } from '../../src/features/learning/presentation/AssignmentComposer';
import { assignmentCopy } from '../../src/features/learning/presentation/assignment-copy';
import { progressClient } from '../../src/features/learning/infrastructure/client';

afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe('group learning assignments', () => {
  it('publishes a versioned group assignment with its criteria and accessible confirmation', async () => {
    await i18n.changeLanguage('es-CO');
    const create = vi.spyOn(progressClient, 'createAssignment').mockResolvedValue({ item: { id: 'assignment-1', title: 'Práctica de evaluación', instructions: 'Evalúa el prototipo', state: 'published' } });
    const onCreated = vi.fn();
    render(<AssignmentComposer groupId="group-1" activities={[{ activity_version_id: 'activity-version-1', title: 'Evaluación heurística', version: 3 }]} onCreated={onCreated}/>);
    const copy = assignmentCopy['es-CO'];
    fireEvent.click(screen.getByText(copy.create));
    fireEvent.change(screen.getByLabelText(copy.title), { target: { value: 'Práctica de evaluación' } });
    fireEvent.change(screen.getByLabelText(copy.instructions), { target: { value: 'Evalúa el prototipo' } });
    fireEvent.change(screen.getByLabelText(`${copy.criterion} 1`), { target: { value: 'Hallazgos con evidencia' } });
    fireEvent.click(screen.getByRole('button', { name: copy.addCriterion }));
    fireEvent.change(screen.getByLabelText(`${copy.criterion} 2`), { target: { value: 'Propuestas de mejora' } });
    fireEvent.click(screen.getByRole('button', { name: copy.submit }));
    await waitFor(() => expect(create).toHaveBeenCalledWith('group-1', {
      activityVersionId: 'activity-version-1',
      title: 'Práctica de evaluación',
      instructions: 'Evalúa el prototipo',
      dueAt: undefined,
      criteria: [
        { code: 'criterion-1', name: 'Hallazgos con evidencia', maxScore: 100, order: 1 },
        { code: 'criterion-2', name: 'Propuestas de mejora', maxScore: 100, order: 2 },
      ],
    }));
    expect(await screen.findByRole('status')).toHaveTextContent(copy.published);
    expect(onCreated).toHaveBeenCalledOnce();
  });

  it('provides assignment controls in all six interface languages', () => {
    expect(Object.keys(assignmentCopy)).toEqual(['es-CO', 'en-US', 'pt-BR', 'fr-FR', 'it-IT', 'ca-ES']);
    for (const locale of Object.values(assignmentCopy)) {
      expect(locale.create.trim()).not.toBe('');
      expect(locale.submit.trim()).not.toBe('');
      expect(locale.failed.trim()).not.toBe('');
    }
  });
});
