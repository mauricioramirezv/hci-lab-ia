

export type Evidence = {
  id: string; createdAt: string; kind: 'concept' | 'experiment' | 'sus' | 'ux' | 'tlx' | 'chatbot' | 'ai' | 'comparison' | 'pattern';
  participant: string; task: string; condition: string; prototype: string;
  scores: Record<string, number>; notes: string; demo?: boolean;
  experiment?:{kind:'Fitts'|'Hick';condition:string;trials:import('../../experiments/domain').Trial[];practiceCount:number};
  review?:{type:string;prompt:string;proposal:string;basis:string;limits:string;review:string;reason:string;decision:'accept'|'applyEdit'|'reject'};
  chatbot?:{prompt:string;response:string;human:boolean};
  pattern?: {id:'form'|'navigation'|'feedback'|'choice'|'content'|'privacy';problem:string;principle:string;correction:string};
  concept?: {
    id: 'ux'|'usability'|'accessibility'|'awareness'|'engagement'|'emotions'|'ergonomics'|'cognition'|'information'|'universal'|'responsibleAI';
    outcome:'completed'|'cancelled';
    response:{text:string;reason:string;edit:string;decision:string};
  };
};
