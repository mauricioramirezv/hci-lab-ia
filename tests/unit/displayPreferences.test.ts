// @vitest-environment node
import {it,expect,vi} from 'vitest';
import {adjustTextSize,defaultPrefs,parsePreferences,parseBackup,createBackup} from '../../src/features/project/domain';
import {createPreferenceOperations} from '../../src/features/accessibility/application';
import {experimentDisplayKey,experimentDisplayScores} from '../../src/features/experiments/domain';
import {recordExperiment} from '../../src/features/experiments/application';
import {collectRecords,compareGroups,metricGroups} from '../../src/features/reports/domain';
import {crudProject} from '../fixtures/crudProject';
import type {Evidence} from '../../src/features/project/domain';
import {displayResources} from '../../src/features/accessibility/locales';
it('normalizes older partial preferences without changing the six existing fields',()=>{
 expect(parsePreferences({font:150,dark:true})).toEqual({...defaultPrefs,font:150,dark:true});expect(parsePreferences(defaultPrefs)).toEqual(defaultPrefs);expect(parsePreferences({})).toEqual(defaultPrefs);
});
it.each([null,[],new Date(),{font:99},{font:201},{font:NaN},{contrast:'yes'},{unknown:true},Object.create(null)])('rejects malformed preferences %j',value=>{expect(parsePreferences(value)).toBeUndefined();});
it('bounds increases and decreases without reducing text to fit containers',()=>{expect(adjustTextSize(100,-1)).toBe(100);expect(adjustTextSize(200,1)).toBe(200);expect(adjustTextSize(125,1)).toBe(150);expect(adjustTextSize(112,1)).toBe(137);});
it('uses current preferences for consecutive operations and preserves the old configuration on failure',()=>{
 let current={...defaultPrefs},failed=false;const write=vi.fn((next:typeof current)=>{if(failed)return false;current=next;return true;});const op=createPreferenceOperations({read:()=>current,write});
 expect(op.change(p=>({...p,font:adjustTextSize(p.font,1)}))).toBe(true);expect(op.change(p=>({...p,font:adjustTextSize(p.font,1),spacing:true}))).toBe(true);expect(current).toMatchObject({font:150,spacing:true});
 const previous=current;failed=true;expect(op.restore()).toBe(false);expect(current).toBe(previous);failed=false;expect(op.restore()).toBe(true);expect(current).toEqual(defaultPrefs);
});
it('restoring display preferences never modifies the project or language',()=>{
 const project=crudProject(),before=structuredClone(project);let prefs={...defaultPrefs,dark:true,font:200};const language='ca-ES';
 const op=createPreferenceOperations({read:()=>prefs,write:next=>{prefs=next;return true;}});expect(op.restore()).toBe(true);expect(project).toEqual(before);expect(language).toBe('ca-ES');
 const legacy=createBackup(project,prefs,language);expect(parseBackup({...legacy,backup:{...legacy.backup,preferences:{font:150}}}).settings).toEqual({preferences:{...defaultPrefs,font:150},language});
});
it('records experimental display context and separates known contexts from one another and legacy results',()=>{
 const display={font:100,dark:false,contrast:false,spacing:false,alternativeFont:false,motion:false,width:1280,height:800,pixelRatio:1};
 const project=crudProject();project.evidence=[];let id=0;const write=(record:Omit<Evidence,'id'|'createdAt'>)=>{project.evidence!.push({...record,id:`experiment-${++id}`,createdAt:'2026-10-21T12:00:00Z'});return true;};
 const input={rows:Array.from({length:8},()=>({seconds:1,errors:0,input:'pointer'})),kind:'Fitts' as const,condition:'simple',alias:'RAW',notes:'RAW observation',size:64,options:6};
 expect(recordExperiment(write,input)).toBe(true);expect(recordExperiment(write,{...input,display})).toBe(true);expect(recordExperiment(write,{...input,display:{...display,font:200}})).toBe(true);
 const records=collectRecords(project).filter(record=>record.type==='experiment');expect(metricGroups(records)).toHaveLength(3);expect(compareGroups(records,[records[1].key],[records[2].key])).toBeNull();expect(compareGroups(records,[records[0].key],[records[1].key])).toBeNull();
 expect(project.evidence![1].scores.displayFont).toBe(100);expect(parseBackup(JSON.parse(JSON.stringify(project))).project).toEqual(project);
 expect(experimentDisplayKey({})).toBeUndefined();expect(experimentDisplayKey({displayFont:100})).toBeNull();expect(experimentDisplayKey(experimentDisplayScores(display))).toBeTypeOf('string');
 expect(()=>parseBackup({...project,evidence:[{...project.evidence![1],scores:{...project.evidence![1].scores,displayDark:2}}]})).toThrow();
});
it('contains complete display controls, explanations and messages in all six languages',()=>{
 expect(Object.keys(displayResources)).toHaveLength(6);for(const strings of Object.values(displayResources)){expect(Object.keys(strings)).toEqual(Object.keys(displayResources['es-CO']));expect(Object.values(strings).every(text=>text.length>0&&!text.includes('\ufffd'))).toBe(true);}
});
