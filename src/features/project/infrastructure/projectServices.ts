import {createProjectRepository} from './projectRepository';
import {createResearchOperations} from '../../research';
import {createEvaluationOperations} from '../../evaluation';
import {createTrackingOperations} from '../../tracking';
import {createMultimodalOperations} from '../../multimodal';
import {createReportOperations} from '../../reports/application';
import {createReservationOperations} from '../../reservations/application';
import {createProjectReservationRepository} from '../../reservations/infrastructure';
import {createAccessibilityOperations} from '../../accessibility/application';
import {createEvidenceOperations} from '../application/evidence';
import {createEventOperations} from '../application/events';
import type {Appointment} from '../../reservations/domain';
export function createProjectServices(host:Parameters<typeof createProjectRepository>[0],id:()=>string,now:()=>Date) {
 const repository=createProjectRepository(host),research=createResearchOperations(repository),evaluation=createEvaluationOperations(repository,id,now),tracking=createTrackingOperations(repository,id,now),multimodal=createMultimodalOperations(repository,id,now),reports=createReportOperations(repository),evidence=createEvidenceOperations(repository,id,now),events=createEventOperations(repository,id,now),accessibility=createAccessibilityOperations(repository);
 const reservations=createReservationOperations(createProjectReservationRepository(host),{id,now});
 return {research,evaluation,reservations,saveReportDraft:reports.saveDraft,addEvidence:evidence.add,removeEvidence:evidence.remove,...tracking,addMultimodalEvidence:multimodal.record,...events,...accessibility,
  addPersona:research.appendLegacyPersona,savePersona:(item:Parameters<typeof research.savePersona>[0])=>research.savePersona(item,true),removePersona:research.removePersona,
  addScenario:research.appendLegacyScenario,saveScenario:(item:Parameters<typeof research.saveScenario>[0])=>research.saveScenario(item,true),removeScenario:research.removeScenario,
  addFinding:evaluation.addFinding,updateFinding:evaluation.updateFinding,removeFinding:evaluation.removeFinding,addSession:evaluation.addSession,
  addAppointment:(item:Omit<Appointment,'id'|'createdAt'|'status'>)=>reservations.create(item,{variant:'example'}).ok,
  updateAppointment:(id:string,patch:Partial<Appointment>)=>{if(patch.status==='cancelled')return reservations.cancel(id).ok;const previous=reservations.get(id);return !!previous&&reservations.reschedule(id,{...previous,...patch},'example').ok;},
 };
}
