import type { Evidence } from '../domain/evidence';
import type { ProjectRepository } from './ProjectRepository';

export type EvidenceDraft = Omit<Evidence,'id'|'createdAt'>;
export type EvidenceWriter = (item: EvidenceDraft) => boolean;
export function createEvidenceOperations(repository: ProjectRepository, id: () => string, now: () => Date) {
  return {
    add: (item: EvidenceDraft) => repository.transact(current=>({...current,evidence:[...(current.evidence||[]),{...item,id:id(),createdAt:now().toISOString()}]})),
    remove: (id: string) => repository.transact(current=>({...current,evidence:(current.evidence||[]).filter(e=>e.id!==id)})),
  };
}
