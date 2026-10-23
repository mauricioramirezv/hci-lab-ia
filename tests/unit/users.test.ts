// @vitest-environment node
import {describe,it,expect,vi} from 'vitest';
import {validateUser,queryUsers} from '../../src/features/users/domain';
import type {UserDraft,LabUser} from '../../src/features/users/domain';
import {createUserOperations} from '../../src/features/users/application';
import {createProjectUserRepository} from '../../src/features/users/infrastructure';
import {emptyProject,parseBackup,createBackup,defaultPrefs} from '../../src/features/project/domain';
import type {ProjectState} from '../../src/features/project/domain';
import {createProjectServices} from '../../src/features/project/infrastructure/projectServices';
import {collectRecords} from '../../src/features/reports/domain';
import {recordTask,recordCondition,detailRows} from '../../src/features/reports/format';
import {userResources} from '../../src/features/users/locales';
const draft:UserDraft={name:' Ana ',email:' Ana@example.test ',role:'student',status:'active'};
function setup(){
 let project=emptyProject(),current=true,fail=false,sequence=0;
 const save=vi.fn((value:ProjectState)=>{if(fail)throw Error('quota');project=value;});
 const host={read:()=>project,save,isCurrent:()=>current,onStorageError:vi.fn()},id=()=>`record-${++sequence}`,now=()=>new Date('2026-10-21T12:00:00Z');
 return {operations:createUserOperations(createProjectUserRepository(host,id,now),{id,now}),services:createProjectServices(host,id,now),read:()=>project,save,replace:(value:ProjectState)=>{project=value;},fail:()=>{fail=true;},invalidate:()=>{current=false;}};
}
describe('fictitious user rules and queries without React',()=>{
 it.each([
  [{name:'  '},'name','nameRequired'],[{email:''},'email','emailRequired'],[{email:'ana @example.test'},'email','emailInvalid'],[{email:'ana@'},'email','emailInvalid'],[{role:'admin'},'role','roleInvalid'],[{status:'deleted'},'status','statusInvalid'],
 ])('rejects invalid fields %j',(patch,key,code)=>{expect(validateUser({...draft,...patch} as UserDraft,[])).toHaveProperty(key,code);});
 it('ignores case and exterior spaces for duplicates, excludes the record being edited',()=>{
  const user:LabUser={...draft,id:'u',createdAt:'2026-10-21'};
  expect(validateUser({...draft,email:'ANA@EXAMPLE.TEST'},[user])).toEqual({email:'emailDuplicate'});
  expect(validateUser({...draft,email:'ANA@EXAMPLE.TEST'},[user],'u')).toEqual({});
 });
 it('searches, combines filters, sorts without mutating input',()=>{
  const users:LabUser[]=[{...draft,name:'Zed',email:'z@example.test',id:'z',createdAt:'2026-10-20'},{...draft,name:'Ana',email:'a@example.test',id:'a',role:'teacher',status:'inactive',createdAt:'2026-10-21'}];
  expect(queryUsers(users).map(u=>u.id)).toEqual(['a','z']);
  expect(queryUsers(users,{search:' A@EXAMPLE ',role:'teacher',status:'inactive'}).map(u=>u.id)).toEqual(['a']);
  expect(queryUsers(users,{search:'ZED'}).map(u=>u.id)).toEqual(['z']);
  expect(queryUsers(users,{sort:'newest'}).map(u=>u.id)).toEqual(['a','z']);
  expect(queryUsers(users,{sort:'oldest'}).map(u=>u.id)).toEqual(['z','a']);
  expect(queryUsers(users,{sort:'email'}).map(u=>u.id)).toEqual(['a','z']);
  expect(users.map(u=>u.id)).toEqual(['z','a']);
 });
});
describe('user operations and project persistence',()=>{
 it('creates, edits own email, keeps identity and creation date, consults latest state',()=>{
  const s=setup(),created=s.operations.save(draft);expect(created.ok).toBe(true);if(!created.ok)return;
  expect(created.user).toMatchObject({name:'Ana',email:'Ana@example.test',createdAt:'2026-10-21T12:00:00.000Z'});
  const edited=s.operations.save({...draft,name:'Ana edited'},created.user.id);expect(edited.ok).toBe(true);
  expect(s.operations.get(created.user.id)).toEqual({...created.user,name:'Ana edited'});
  expect(s.read().evidence?.map(e=>e.task)).toEqual(['users:create','users:edit']);
 });
 it('does not mutate a stored record when a draft is edited and abandoned',()=>{
  const s=setup(),created=s.operations.save(draft);if(!created.ok)throw Error('create');
  const before=structuredClone(s.read()),edit={...created.user,name:'not saved'};expect(edit.name).toBe('not saved');expect(s.read()).toEqual(before);
 });
 it('activates, deactivates, deletes and restores the exact snapshot',()=>{
  const s=setup(),created=s.operations.save(draft);if(!created.ok)throw Error('create');
  expect(s.operations.setStatus(created.user.id,'inactive').ok).toBe(true);expect(s.operations.get(created.user.id)?.status).toBe('inactive');
  expect(s.operations.setStatus(created.user.id,'active').ok).toBe(true);
  const removed=s.operations.remove(created.user.id);if(!removed.ok)throw Error('delete');
  expect(s.operations.list()).toEqual([]);expect(s.operations.restore(removed.user).ok).toBe(true);expect(s.operations.get(created.user.id)).toEqual(created.user);
  expect(s.operations.restore(removed.user)).toMatchObject({ok:false,reason:'conflict'});
 });
 it('rejects restore if its email has been reused and preserves current users',()=>{
  const s=setup(),created=s.operations.save(draft);if(!created.ok)throw Error('create');
  s.operations.remove(created.user.id);s.operations.save({...draft,name:'Other'});const before=s.read();
  expect(s.operations.restore(created.user)).toMatchObject({ok:false,reason:'conflict'});expect(s.read()).toBe(before);
 });
 it('never commits invalid or missing records',()=>{
  const s=setup();expect(s.operations.save({...draft,name:''}).ok).toBe(false);
  expect(s.operations.save(draft,'missing')).toMatchObject({ok:false,reason:'notFound'});
  expect(s.operations.remove('missing').ok).toBe(false);expect(s.operations.setStatus('missing','inactive').ok).toBe(false);expect(s.save).not.toHaveBeenCalled();
 });
 it.each(['create','edit','status','delete','restore'])('rolls back the entire aggregate and evidence on %s failure',action=>{
  const s=setup(),created=s.operations.save(draft);if(!created.ok)throw Error('create');
  if(action==='restore')s.operations.remove(created.user.id);
  const before=s.read();s.fail();
  const result=action==='create'?s.operations.save({...draft,email:'b@example.test'}):action==='edit'?s.operations.save({...draft,name:'Changed'},created.user.id):action==='status'?s.operations.setStatus(created.user.id,'inactive'):action==='delete'?s.operations.remove(created.user.id):s.operations.restore(created.user);
  expect(result).toEqual({ok:false,errors:{},reason:'storageFailed'});expect(s.read()).toBe(before);
 });
 it('preserves concurrent report drafts and other collections with a single project source',()=>{
  const s=setup();s.services.saveReportDraft({selected:[],before:[],after:[],includeComparison:false,justification:'',projectName:'Current draft',objective:'',method:'',interpretation:'',improvements:'',limits:'',conclusions:'',references:''});
  s.operations.save(draft);expect(s.read().reportDraft?.projectName).toBe('Current draft');
  s.replace({...s.read(),a11yChecks:{keyboard:true}});s.operations.save({...draft,email:'other@example.test'});expect(s.read().a11yChecks).toEqual({keyboard:true});expect(s.services.users.list()).toHaveLength(2);
 });
 it('rejects callbacks invalidated by reset or recovery, including undo',()=>{
  const s=setup(),created=s.operations.save(draft);if(!created.ok)throw Error('create');s.invalidate();const before=s.read();
  for(const result of [s.operations.save(draft),s.operations.remove(created.user.id),s.operations.restore(created.user),s.operations.setStatus(created.user.id,'inactive')])expect(result).toMatchObject({ok:false,reason:'staleProject'});
  expect(s.read()).toBe(before);
 });
});
describe('users, backups and report evidence',()=>{
 it('accepts older backups without users and preserves unrelated collections',()=>{
  const legacy=emptyProject();delete legacy.users;legacy.scenarios=[{id:'s',title:'Original',actor:'Ana',context:'C',task:'T',constraint:'N',success:'S'}];
  const parsed=parseBackup(legacy).project;expect(parsed.users).toEqual([]);expect(parsed.scenarios).toEqual(legacy.scenarios);
 });
 it('round trips users and evidence through backup, reload, recovery and reset shape',()=>{
  const s=setup();s.operations.save(draft);const backup=createBackup(s.read(),defaultPrefs,'es-CO');
  const recovered=parseBackup(JSON.parse(JSON.stringify(backup))).project;expect(recovered).toEqual(s.read());
  s.replace(recovered);expect(s.operations.list()).toEqual(recovered.users);s.replace(emptyProject());expect(s.operations.list()).toEqual([]);
 });
 it('rejects malformed roles, duplicate emails and dates in backups',()=>{
  const s=setup(),created=s.operations.save(draft);if(!created.ok)throw Error('create');
  for(const users of [[{...created.user,role:'admin'}],[created.user,{...created.user,id:'other',email:' ANA@example.test '}],[{...created.user,createdAt:'invalid'}]])expect(()=>parseBackup({...s.read(),users})).toThrow();
 });
 it('includes fictitious records and task evidence in reports without invented metrics, in six languages',()=>{
  const s=setup();s.operations.save({...draft,name:'RAW name'});const records=collectRecords(s.read()),user=records.find(r=>r.type==='user')!,task=records.find(r=>r.task==='users:create')!;
  expect(user.origin).toBe('simulated');expect(task.metrics).toEqual({});
  for(const [lang,strings]of Object.entries(userResources)){
   expect(recordTask(user,lang)).toBe('RAW name');expect(recordTask(task,lang)).toBe(strings.create);expect(recordCondition(user,lang)).toBe(strings.active);
   expect(detailRows(user,lang).flat()).toContain(strings.student);
   expect(Object.keys(strings)).toEqual(Object.keys(userResources['es-CO']));expect(Object.values(strings).some(text=>text.includes('\ufffd'))).toBe(false);
  }
 });
});
