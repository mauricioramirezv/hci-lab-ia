export const conceptIds = ['ux','usability','accessibility','awareness','engagement','emotions','ergonomics','cognition','information','universal','responsibleAI'] as const;
export type ConceptId = typeof conceptIds[number];
export const conceptGroups = [[0,1,3,4,5],[2,6,9],[7,8],[10]];
export type ConceptText = {
  name:string; description:string; learn:string; instructions:string;
  good:string; bad:string; correction:string; counts:string;
};
export type ConceptDraft = {
  alias:string; notes:string; text:string; reason:string; edit:string;
  emotionBefore:string; emotionAfter:string; confidenceBefore:string; confidenceAfter:string;
};
export const blankDraft = ():ConceptDraft => ({alias:'',notes:'',text:'',reason:'',edit:'',emotionBefore:'',emotionAfter:'',confidenceBefore:'',confidenceAfter:''});
export const countsErrors = (id:ConceptId) => !['engagement','responsibleAI'].includes(id);
export const normalizeSearch = (value:string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase().trim();
