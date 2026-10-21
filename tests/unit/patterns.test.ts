import {describe,it,expect} from 'vitest';
import {patternResources} from '../../src/features/patterns/locales';
import {patternIds,patternSearch} from '../../src/features/patterns/domain';
import {patternObservationMarkdown} from '../../src/features/patterns/report';
import {createBackup,parseBackup,emptyProject} from '../../src/features/project/domain';
import {defaultPrefs} from '../../src/features/project/domain';
import {reportMarkdown} from '../../src/features/reports/format';
import type { Evidence } from '../../src/features/project/domain';
const observation:Evidence={id:'pattern-record',createdAt:'2026-10-09T12:00:00.000Z',kind:'pattern',participant:'',task:'Formulario',condition:'bad',prototype:'patterns-iteration-4',scores:{},notes:'Texto original ✍️',pattern:{id:'form',problem:'Texto original ✍️',principle:'Control del usuario',correction:'Conservar mi texto\nY explicar el error.'}};
describe('pattern observations and resources',()=>{
  it('fully translates six distinct categories and examples in six languages',()=>{
    const reference=patternResources['es-CO'];
    expect(Object.keys(patternResources)).toHaveLength(6);
    for(const resource of Object.values(patternResources)){
      expect(Object.keys(resource.ui).sort()).toEqual(Object.keys(reference.ui).sort());
      expect(Object.values(resource.ui).every(value=>value.trim().length>0)).toBe(true);
      expect(new Set(resource.categories).size).toBe(6);expect(resource.patterns).toHaveLength(6);
      expect(new Set(resource.patterns.map(pattern=>pattern.instructions)).size).toBe(6);
      for(const pattern of resource.patterns){expect(Object.keys(pattern).sort()).toEqual(Object.keys(reference.patterns[0]).sort());expect(Object.values(pattern).every(value=>value.trim().length>0)).toBe(true);}
    }
  });
  it('searches without accents, case or surrounding spaces',()=>{expect(patternSearch('  NAVEGACIÓN ')).toBe('navegacion');});
  it('round-trips all six patterns and both conditions with untouched authored text',()=>{
    const project=emptyProject();project.evidence=patternIds.flatMap(id=>['good','bad'].map(condition=>({...observation,id:`${id}-${condition}`,condition,pattern:{...observation.pattern!,id}})));
    expect(parseBackup(JSON.parse(JSON.stringify(createBackup(project,defaultPrefs,'ca-ES')))).project).toEqual(project);
  });
  it.each([
    {...observation,pattern:undefined},
    {...observation,condition:'unknown'},
    {...observation,pattern:{...observation.pattern,id:'unknown'}},
    {...observation,pattern:{id:'form',problem:'x',principle:'x'}},
    {...observation,pattern:{...observation.pattern,correction:123}},
  ])('rejects incomplete or unknown pattern metadata %#',record=>{expect(()=>parseBackup({...emptyProject(),evidence:[record]})).toThrow();});
  it('localizes reports without translating or inventing the student response',()=>{
    for(const [language,resource] of Object.entries(patternResources)){
      const rendered=patternObservationMarkdown(observation,language);
      expect(rendered).toContain(resource.ui.bad);expect(rendered).toContain(resource.ui.identified);expect(rendered).toContain(resource.ui.noAlias);
      expect(rendered).toContain(observation.pattern!.correction);expect(rendered).toContain(observation.pattern!.problem);
      expect(rendered).not.toContain('seconds');expect(rendered).not.toContain('{}');
      const report=reportMarkdown({...emptyProject(),evidence:[observation]},language);expect(report).toContain(resource.patterns[0].name);expect(report).toContain(observation.pattern!.problem);expect(report).toContain(observation.pattern!.correction.replaceAll('\n','<br>'));
    }
  });
});
