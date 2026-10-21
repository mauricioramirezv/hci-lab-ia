import type { EvidenceWriter } from '../../project/application';
import type { PatternDraft, PatternId } from '../domain/model';
import { missingObservation } from '../domain/observation';
export function recordObservation(write: EvidenceWriter, input: {id:PatternId;draft:PatternDraft;condition:string;task:string}) {
 const {id,draft,condition,task}=input;
 if(missingObservation(draft))return false;
 return write({kind:'pattern',participant:draft.alias,task,condition,prototype:'patterns-iteration-4',scores:{},notes:draft.problem,pattern:{id,problem:draft.problem,principle:draft.principle,correction:draft.correction}});
}
