import {describe,it,expect} from 'vitest';
import i18n from '../../src/app/i18n';
import {interfaceResources} from '../../src/app/locales/interface';
import {course} from '../../src/features/course/content';
import {concepts} from '../../src/features/concepts/catalog';
import {antiPatterns} from '../../src/features/patterns/catalog';
import {a11yChecks} from '../../src/features/accessibility/presentation/checks';

const languages=['es-CO','en-US','pt-BR','fr-FR','it-IT','ca-ES'];
function leaves(value:unknown,prefix=''):string[]{return value&&typeof value==='object'?Object.entries(value).flatMap(([key,item])=>leaves(item,prefix?`${prefix}.${key}`:key)):[prefix];}
const placeholders=(text:string)=>[...text.matchAll(/{{\s*(\w+)\s*}}/g)].map(match=>match[1]).sort();
describe.each(languages)('static interface translations: %s',language=>{
 it('has every key without relying on the Spanish fallback and preserves interpolation',()=>{
  const base=leaves(i18n.getResourceBundle('es-CO','translation'));
  expect(base.filter(key=>i18n.getResource(language,'translation',key)===undefined)).toEqual([]);
  const catalog=interfaceResources[language];
  expect(Object.keys(catalog).sort()).toEqual(Object.keys(interfaceResources['es-CO']).sort());
  expect(Object.entries(catalog).filter(([key,text])=>!text.trim()||JSON.stringify(placeholders(text))!==JSON.stringify(placeholders(interfaceResources['es-CO'][key])))).toEqual([]);
 });
 it('covers the historical course, concept, pattern and accessibility catalogs',()=>{
  const keys=[...course.flatMap(([,title,description,evidence])=>[title,description,evidence]),...concepts.flat(),...antiPatterns.flatMap(p=>[p.title,p.principle,p.good,p.bad]),...a11yChecks.map(([,label])=>label)];
  expect(keys.filter(key=>!['UX'].includes(key)&&!interfaceResources[language][key])).toEqual([]);
 });
});
