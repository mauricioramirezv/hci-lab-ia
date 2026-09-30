import { calculateMetrics, sampleProject } from '../../src/domain';

describe('calculated evidence metrics', () => {
  it('calculates completion, accessibility and user-study averages from evidence', () => {
    const metrics = calculateMetrics({
      ...sampleProject,
      events: [
        { id: '1', type: 'flow-start', at: '2026-01-01' },
        { id: '2', type: 'flow-start', at: '2026-01-01' },
        { id: '3', type: 'flow-complete', at: '2026-01-01', duration: 90 },
      ],
      sessions: [{ id: 's', participant: 'P01', task: 'Reserva', success: true, seconds: 90, errors: 1, seq: 6, emotion: 4, sus: 80, notes: '', createdAt: '2026-01-01' }],
      a11yChecks: { keyboard: true, labels: true, contrast: false, zoom: false },
    });
    expect(metrics.completionRate).toBe(50);
    expect(metrics.averageSeconds).toBe(90);
    expect(metrics.accessibility).toBe(50);
    expect(metrics.sus).toBe(80);
    expect(metrics.seq).toBe(6);
  });
});
