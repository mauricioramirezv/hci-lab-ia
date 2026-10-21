// @vitest-environment node
import { expect, it, vi } from 'vitest';
import { blankDraft, conceptScores, recordConcept } from '../../src/features/concepts';
import type { EvidenceDraft } from '../../src/features/project/application';
import { blankPatternDraft, missingObservation, observationExists, recordObservation } from '../../src/features/patterns';

it('keeps self-reports separate from counted errors and excludes irrelevant emotions',()=>{
 const draft={...blankDraft(),emotionBefore:'3',confidenceAfter:'4'};
 const result={seconds:2,interactions:3,errors:1,outcome:'completed' as const};
 expect(conceptScores('engagement',draft,result)).toEqual({seconds:2,interactions:3,confidenceAfter:4});
 expect(conceptScores('emotions',draft,result)).toMatchObject({errors:1,emotionBefore:3});
 const write=vi.fn(()=>false);
 expect(recordConcept(write,{id:'emotions',draft,result,task:'RAW',good:false,decision:''})).toBe(false);
 expect(write.mock.calls).toHaveLength(1);
});
it('rejects incomplete observations and propagates failed saves without changing student text',()=>{
 const write=vi.fn<(item:EvidenceDraft)=>boolean>(()=>false),draft={...blankPatternDraft(),problem:'  RAW  ',principle:'Principle',correction:'Correction'};
 expect(missingObservation(blankPatternDraft())).toBe('problem');
 expect(recordObservation(write,{id:'form',draft:blankPatternDraft(),condition:'good',task:'Form'})).toBe(false);expect(write).not.toHaveBeenCalled();
 expect(recordObservation(write,{id:'form',draft,condition:'bad',task:'Form'})).toBe(false);
 expect(observationExists([{...write.mock.calls[0][0]!,id:'e',createdAt:'now'}],'form','bad',draft)).toBe(true);
 expect(draft.problem).toBe('  RAW  ');
});
