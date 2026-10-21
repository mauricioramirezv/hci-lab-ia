// @vitest-environment node
import { expect, it, vi } from 'vitest';
import { incorporationError, incorporateProposal, recordReview } from '../../src/features/ai';
import type { AiDraft } from '../../src/features/ai';
import { responseFrame, recordRubric } from '../../src/features/chatbots';
import type { EvidenceWriter } from '../../src/features/project/application';

const draft:AiDraft={name:'Person',goal:'Goal',barrier:'Barrier',device:'Device',context:'Context',personaId:'p',scenarioTitle:'Scenario',scenarioTask:'Task',constraint:'Constraint',success:'Success',problem:'Problem',evidence:'RAW',recommendation:'Recommendation',heuristicId:'h1',severity:'0'};
it('requires explicit review, preserves provenance, and propagates a failed write',()=>{
 const write=vi.fn<EvidenceWriter>(()=>false),input={kind:'persona' as const,alias:'',prompt:'RAW',proposal:'Proposal',reason:'Human reason',decision:'applyEdit' as const,snapshot:{basis:'Basis',limits:'Limits',review:'Review'}};
 expect(recordReview(write,{...input,reason:' '})).toBe(false);expect(write).not.toHaveBeenCalled();
 expect(recordReview(write,input)).toBe(false);expect(write.mock.calls[0][0].review).toMatchObject({prompt:'RAW',reason:'Human reason',decision:'applyEdit',basis:'Basis'});
});
it('does not incorporate a rejection or orphan scenario, and preserves the persona link',()=>{
 const ports={personas:()=>[],id:()=> 'new',addPersona:vi.fn<Parameters<typeof incorporateProposal>[0]['addPersona']>(()=>true),saveScenario:vi.fn(()=>true),addFinding:vi.fn(()=>true)};
 expect(incorporationError('scenario',draft,[])).toBe('needsPersona');
 expect(incorporateProposal(ports,{kind:'persona',draft,decision:'reject',prompt:'RAW',proposal:'Proposal',heuristic:'Visibility'})).toBe(false);expect(ports.addPersona).not.toHaveBeenCalled();
 expect(incorporateProposal(ports,{kind:'persona',draft,decision:'accept',prompt:'RAW',proposal:'Proposal',heuristic:'Visibility'})).toBe(true);
 expect(ports.addPersona.mock.calls[0][0]).toMatchObject({id:'new',basis:'assumed',assumptions:'Proposal'});
});
it('keeps progressive and delayed demonstrations distinct and only records human rubric data',()=>{
 expect(responseFrame('one two three',1,true)).toEqual({text:'one',complete:false});
 expect(responseFrame('one two three',1,false)).toEqual({text:'',complete:false});
 expect(responseFrame('one two three',3,false)).toEqual({text:'one two three',complete:true});
 const write=vi.fn<EvidenceWriter>(()=>false),input={alias:'',prompt:'Original',response:'Human edit',good:true,scores:['4','4','4','4'],notes:'RAW'};
 expect(recordRubric(write,{...input,notes:''})).toBe(false);expect(write).not.toHaveBeenCalled();
 expect(recordRubric(write,input)).toBe(false);expect(write.mock.calls[0][0].chatbot).toEqual({prompt:'Original',response:'Human edit',human:true});
});
