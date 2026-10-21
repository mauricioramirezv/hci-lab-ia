import type { AiDraft, AiTask } from './types';
export type ReviewDecision='accept'|'applyEdit'|'reject';
export function incorporationError(kind:AiTask,draft:AiDraft,personas:readonly {id:string}[]) {
 const required=kind==='persona'?['name','context','goal','barrier','device']:kind==='scenario'?['personaId','scenarioTitle','context','scenarioTask','constraint','success']:['problem','evidence','recommendation','heuristicId','severity'];
 if(required.some(k=>!draft[k as keyof AiDraft].trim()))return 'required';
 if(kind==='scenario'&&!personas.some(p=>p.id===draft.personaId))return 'needsPersona';
 return '';
}
