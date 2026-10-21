export const patternIds=['form','navigation','feedback','choice','content','privacy'] as const;
export type PatternId=typeof patternIds[number];
export type PatternText={name:string;problem:string;when:string;good:string;bad:string;heuristic:string;explanation:string;recommendation:string;instructions:string};
export type PatternDraft={alias:string;problem:string;principle:string;correction:string;email:string;request:string;document:string;contentQuery:string};
export const blankPatternDraft=(alias=''):PatternDraft=>({alias,problem:'',principle:'',correction:'',email:'',request:'',document:'',contentQuery:''});
export const patternSearch=(value:string)=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase().trim();
