import type { EvidenceWriter } from '../../project/application';
import { rubricDimensions } from '../domain/response';
export function recordRubric(write:EvidenceWriter,input:{alias:string;prompt:string;response:string;good:boolean;scores:string[];notes:string}) {
 const {alias,prompt,response,good,scores,notes}=input;
 if(!response||scores.length!==4||scores.some(v=>!v)||!notes.trim())return false;
 return write({kind:'chatbot',participant:alias,task:prompt,condition:good?'B-buena':'A-antipatrón',prototype:'local-script-iteration7',scores:Object.fromEntries(rubricDimensions.map((key,i)=>[key,Number(scores[i])])),notes,chatbot:{prompt,response,human:true}});
}
