import type { EvidenceWriter } from '../../project/application';
import type { ConceptDraft, ConceptId } from '../domain/model';
import { conceptScores } from '../domain/scores';
import type { ConceptResult } from '../domain/scores';
export function recordConcept(write: EvidenceWriter, input: {id:ConceptId;draft:ConceptDraft;result:ConceptResult;task:string;good:boolean;decision:string}) {
  const {id,draft,result,task,good,decision}=input;
  return write({kind:'concept',participant:draft.alias,task,condition:good?'good':'bad',prototype:'concepts-iteration-3',scores:conceptScores(id,draft,result),notes:draft.notes,concept:{id,outcome:result.outcome,response:{text:draft.text,reason:draft.reason,edit:draft.edit,decision}}});
}
