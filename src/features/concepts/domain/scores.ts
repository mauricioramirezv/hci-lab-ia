import { countsErrors } from './model';
import type { ConceptDraft, ConceptId } from './model';
export type ConceptResult = {seconds:number;interactions:number;errors:number;outcome:'completed'|'cancelled'};
export function conceptScores(id: ConceptId, draft: ConceptDraft, result: ConceptResult) {
  const scores:Record<string,number>={seconds:result.seconds,interactions:result.interactions};
  if(countsErrors(id))scores.errors=result.errors;
  for(const key of ['emotionBefore','emotionAfter','confidenceBefore','confidenceAfter'] as const)if(draft[key]&&(key.startsWith('confidence')||id==='emotions'))scores[key]=Number(draft[key]);
  return scores;
}
