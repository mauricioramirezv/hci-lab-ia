import { describe,it,expect,vi,afterEach } from 'vitest';
import { sampleProject,calculateMetrics } from '../../src/domain';
import { commitProject,createBackup,defaultPrefs,emptyProject,parseBackup,PROJECT_KEY,PREFS_KEY } from '../../src/projectBackup';
import { representativeProject } from '../fixtures/representativeProject';
import { manageResources } from '../../src/manageLocales';

afterEach(()=>vi.restoreAllMocks());
describe('project backup validation',()=>{
  it('round-trips every saved module, settings and tracking field',()=>{
    const project=representativeProject();
    const settings={preferences:{...defaultPrefs,dark:true,font:150},language:'ca-ES'};
    expect(parseBackup(JSON.parse(JSON.stringify(createBackup(project,settings.preferences,settings.language))))).toEqual({project,settings});
  });
  it('accepts previous version 2 projects without newer optional collections',()=>{
    const result=parseBackup(sampleProject);
    expect(result.settings).toBeUndefined();
    expect(result.project.personas).toEqual(sampleProject.personas);
    expect(result.project.pageSessions).toEqual([]);
    expect(result.project.evidence).toEqual([]);
  });
  it('exports newly recorded sessions with undefined optional camera validation',()=>{
    const project=representativeProject();
    project.trackingSessions![0].validation=undefined;
    project.pageSessions![0].validationError=undefined;
    const result=parseBackup(JSON.parse(JSON.stringify(createBackup(project,defaultPrefs,'es-CO'))));
    expect(result.project.trackingSessions![0].validation).toBeUndefined();
    expect(result.project.pageSessions![0].validationError).toBeUndefined();
    expect(result.project.pageSessions![0].clicks).toEqual(project.pageSessions![0].clicks);
  });
  it.each([null,[],{}, {version:2}, {...sampleProject,version:3}, {...sampleProject,personas:null}, {...sampleProject,findings:[{id:'bad'}]}, {...sampleProject,a11yChecks:{labels:'yes'}}])('rejects invalid or incomplete structure %#',value=>{
    expect(()=>parseBackup(value)).toThrow();
  });
  it('rejects invalid nested types, ranges, duplicate IDs and unsafe fields',()=>{
    for (const mutate of [
      (p:ReturnType<typeof representativeProject>)=>{p.trackingSessions![0].clicks[0].weight=Infinity;},
      (p:ReturnType<typeof representativeProject>)=>{p.sessions[0].susResponses=[0];},
      (p:ReturnType<typeof representativeProject>)=>{p.findings[0].severity=5;},
      (p:ReturnType<typeof representativeProject>)=>{p.personas.push(p.personas[0]);},
    ]) { const p=representativeProject();mutate(p);expect(()=>parseBackup(p)).toThrow(); }
    expect(()=>parseBackup(JSON.parse(JSON.stringify(sampleProject).replace('"version":2','"version":2,"__proto__":{}')))).toThrow();
    const backup=createBackup(representativeProject(),defaultPrefs,'es-CO');backup.backup.language='xx';
    expect(()=>parseBackup(backup)).toThrow();
  });
  it('returns finite zero metrics for an empty project',()=>{
    expect(Object.values(calculateMetrics(emptyProject())).every(v=>v===0)).toBe(true);
  });
  it('does not leave the project replaced when writing preferences fails',()=>{
    localStorage.setItem(PROJECT_KEY,JSON.stringify(sampleProject));
    localStorage.setItem(PREFS_KEY,JSON.stringify({...defaultPrefs,dark:true}));
    const previousProject=localStorage.getItem(PROJECT_KEY),previousPrefs=localStorage.getItem(PREFS_KEY);
    const write=Storage.prototype.setItem;
    vi.spyOn(Storage.prototype,'setItem').mockImplementation(function(this:Storage,key,value){if(key===PREFS_KEY)throw new Error('quota');write.call(this,key,value);});
    expect(()=>commitProject(emptyProject(),{preferences:defaultPrefs})).toThrow();
    expect(localStorage.getItem(PROJECT_KEY)).toBe(previousProject);
    expect(localStorage.getItem(PREFS_KEY)).toBe(previousPrefs);
  });
  it('provides every management label in all six languages',()=>{
    for(const labels of Object.values(manageResources)){
      expect(Object.keys(labels).sort()).toEqual(Object.keys(manageResources['es-CO']).sort());
      expect(Object.values(labels).every(v=>v.trim().length>0)).toBe(true);
    }
  });
});
