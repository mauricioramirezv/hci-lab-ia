import type { EvidenceWriter } from '../../project/application';
import type { Persona, Scenario } from '../../research/domain';
import type { Finding } from '../../evaluation/domain';
import type { AiDraft, AiTask } from '../domain/types';
import type { ReviewDecision } from '../domain/review';
import { incorporationError } from '../domain/review';
export function recordReview(write:EvidenceWriter,input:{kind:AiTask;alias:string;prompt:string;proposal:string;reason:string;decision:ReviewDecision;snapshot:{basis:string;limits:string;review:string}}) {
 const {kind,alias,prompt,proposal,reason,decision,snapshot}=input;
 if(!reason.trim()||!proposal.trim())return false;
 return write({kind:'ai',participant:alias,task:prompt,condition:decision==='accept'?'aceptar':decision==='applyEdit'?'editar':'rechazar',prototype:'local-template-iteration7',scores:{accepted:decision==='accept'?1:0,edited:decision==='applyEdit'?1:0,rejected:decision==='reject'?1:0},notes:reason,review:{type:kind,prompt,proposal,...snapshot,reason,decision}});
}
export function incorporateProposal(ports:{personas:()=>readonly Persona[];id:()=>string;addPersona:(p:Persona)=>boolean;saveScenario:(s:Scenario)=>boolean;addFinding:(f:Omit<Finding,'id'|'createdAt'>)=>boolean},input:{kind:AiTask;draft:AiDraft;decision:string;prompt:string;proposal:string;heuristic:string}) {
 const {kind,draft,decision,prompt,proposal,heuristic}=input;
 if(!decision||decision==='reject'||incorporationError(kind,draft,ports.personas()))return false;
 if(kind==='persona')return ports.addPersona({id:ports.id(),name:draft.name,age:'',context:draft.context,goal:draft.goal,barrier:draft.barrier,device:draft.device,empathy:{says:'',thinks:'',does:'',feels:''},basis:'assumed',assumptions:proposal});
 if(kind==='scenario') {
  const person=ports.personas().find(p=>p.id===draft.personaId)!;
  return ports.saveScenario({id:ports.id(),title:draft.scenarioTitle,actor:person.name,personaId:person.id,context:draft.context,task:draft.scenarioTask,constraint:draft.constraint,success:draft.success,fictional:true});
 }
 if(kind==='evaluation')return ports.addFinding({task:prompt,heuristicId:draft.heuristicId,heuristic,severity:Number(draft.severity),problem:draft.problem,evidence:draft.evidence,recommendation:draft.recommendation,source:'ai',status:'validated'});
 return true;
}
