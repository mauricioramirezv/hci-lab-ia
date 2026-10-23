// @vitest-environment node
import {expect,it,vi} from 'vitest';
import {createProjectServices} from '../../src/features/project/infrastructure/projectServices';
import {parseBackup,emptyProject} from '../../src/features/project/domain';
import {emptyDraft} from '../../src/features/reports/domain';
import {findingErrors} from '../../src/features/evaluation/domain/validation';
import {validateScenario} from '../../src/features/research/domain';
import {crudProject} from '../fixtures/crudProject';
function setup(){
 let project=crudProject(),failed=false,current=true,sequence=0;
 const write=vi.fn((value:typeof project)=>{if(failed)throw Error('quota');project=parseBackup(value).project;});
 const services=createProjectServices({read:()=>project,save:write,isCurrent:()=>current,onStorageError:()=>{}},()=>`new-${++sequence}`,()=>new Date('2026-10-21T12:00:00Z'));
 return {services,write,read:()=>project,fail:(value:boolean)=>{failed=value;},replace:(value:typeof project)=>{project=value;},invalidate:()=>{current=false;}};
}
const modules=['reservations','users','personas','scenarios','findings'] as const;
type Module=typeof modules[number];
function edit(s:ReturnType<typeof setup>,module:Module){
 const p=s.read(),ops=s.services;
 if(module==='reservations')return ops.reservations.reschedule(p.appointments[0].id,{...p.appointments[0],date:'2099-10-20'},'example').ok;
 if(module==='users')return ops.users.save({...p.users![0],name:'RAW edited'},p.users![0].id).ok;
 if(module==='personas')return ops.research.savePersona({...p.personas[0],name:'RAW edited'});
 if(module==='scenarios')return ops.research.saveScenario({...p.scenarios[0],task:'RAW edited'});
 return ops.evaluation.saveFinding({...p.findings[0],problem:'RAW edited'},p.findings[0].id);
}
it.each(modules)('%s: failed edit preserves all collections; retry keeps identity and historical evidence',module=>{
 const s=setup(),before=structuredClone(s.read());s.fail(true);expect(edit(s,module)).toBe(false);expect(s.read()).toEqual(before);s.fail(false);expect(edit(s,module)).toBe(true);
 const after=s.read(),collection=module==='reservations'?'appointments':module;
 expect(after[collection]?.[0].id).toBe(before[collection]?.[0].id);
 if(['users','reservations','findings'].includes(module))expect((after[collection]![0] as {createdAt?:string}).createdAt).toBe((before[collection]![0] as {createdAt?:string}).createdAt);
 expect(after.sessions).toEqual(before.sessions);expect(after.pageSessions).toEqual(before.pageSessions);expect(after.trackingSessions).toEqual(before.trackingSessions);expect(after.evidence?.slice(0,before.evidence!.length)).toEqual(before.evidence);
 expect(parseBackup(JSON.parse(JSON.stringify(after))).project).toEqual(after);
});
it.each(modules)('%s: commands invalidated by reset/recovery cannot restore data',module=>{
 const s=setup();s.invalidate();expect(edit(s,module)).toBe(false);expect(s.write).not.toHaveBeenCalled();
});
it('keeps consecutive operations and the latest report draft on a single project',()=>{
 const s=setup();expect(s.services.saveReportDraft({...emptyDraft(),projectName:'RAW latest'})).toBe(true);
 for(const module of modules)expect(edit(s,module)).toBe(true);
 expect(s.read().reportDraft?.projectName).toBe('RAW latest');expect(s.read().scenarios[0].actor).toBe(s.read().personas[0].name);
 expect(s.read().users![0].name).toBe('RAW edited');expect(s.read().findings[0].problem).toBe('RAW edited');
});
it('preserves finding metadata even if an update payload attempts to replace it',()=>{
 const s=setup(),before=s.read().findings[0];expect(s.services.evaluation.updateFinding(before.id,{id:'other',createdAt:'different',problem:'RAW edit'})).toBe(true);
 expect(s.read().findings[0]).toMatchObject({id:before.id,createdAt:before.createdAt,problem:'RAW edit'});
});
it('rejects repeated findings and excludes the record being edited',()=>{
 const s=setup(),finding=s.read().findings[0];expect(findingErrors({...finding,task:` ${finding.task!.toUpperCase()} `},s.read().findings)).toEqual({problem:'duplicate'});
 expect(s.services.evaluation.saveFinding(finding)).toBe(false);expect(s.services.evaluation.saveFinding(finding,finding.id)).toBe(true);expect(s.read().findings).toHaveLength(1);
 expect(s.services.evaluation.saveFinding({...finding,source:'ai',status:'pending'})).toBe(true);expect(s.read().findings).toHaveLength(2);
});
it('rejects identical scenarios for the same person, permits a different task, protects linked personas',()=>{
 const s=setup(),p=s.read(),scenario={...p.scenarios[0],id:'new',title:` ${p.scenarios[0].title.toUpperCase()} `};
 expect(validateScenario(scenario,p)).toEqual({title:'duplicate'});expect(s.services.research.saveScenario(scenario)).toBe(false);
 expect(s.services.research.saveScenario({...scenario,task:'Different task'})).toBe(true);expect(s.services.research.removePersona(p.personas[0].id)).toBe(false);
 expect(s.services.research.saveScenario({...scenario,personaId:'missing',task:'Other'})).toBe(false);
});
it('does not write or append task evidence for repeated user status or unchanged edits',()=>{
 const s=setup(),user=s.read().users![0],before=s.read();expect(s.services.users.setStatus(user.id,user.status).ok).toBe(true);expect(s.services.users.save(user,user.id).ok).toBe(true);expect(s.read()).toBe(before);expect(s.write).not.toHaveBeenCalled();
});
it('reset shape and old backups continue to initialize users without losing other collections',()=>{
 const legacy=crudProject();delete legacy.users;expect(parseBackup(legacy).project).toEqual({...legacy,users:[]});expect(emptyProject().users).toEqual([]);
});
