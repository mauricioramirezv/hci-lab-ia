import type { ProjectRepository } from '../../project/application';
import type { MultimodalEvidence } from '../domain/types';
export function createMultimodalOperations(repository:ProjectRepository,id:()=>string,now:()=>Date) {
 return {record:(item:Omit<MultimodalEvidence,'id'|'createdAt'>)=>repository.transact(current=>({...current,multimodalEvidence:[...(current.multimodalEvidence||[]),{...item,id:id(),createdAt:now().toISOString()}]}))};
}
