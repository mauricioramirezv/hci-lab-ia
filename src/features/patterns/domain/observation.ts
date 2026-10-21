import type { PatternDraft, PatternId } from './model';
import type { Evidence } from '../../project/domain';
export const missingObservation = (draft: PatternDraft) => (['problem','principle','correction'] as const).find(key=>!draft[key].trim());
export function observationExists(records: readonly Evidence[], id: PatternId, condition: string, draft: PatternDraft) {
 return records.some(e=>e.kind==='pattern'&&e.pattern?.id===id&&e.condition===condition&&e.participant===draft.alias&&e.pattern.problem===draft.problem&&e.pattern.principle===draft.principle&&e.pattern.correction===draft.correction);
}
