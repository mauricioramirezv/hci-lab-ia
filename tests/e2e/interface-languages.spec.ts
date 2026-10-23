import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {emptyProject} from '../../src/features/project/domain';
import {interfaceResources} from '../../src/app/locales/interface';
import {displayResources} from '../../src/features/accessibility/locales';
import {course} from '../../src/features/course/content';

const routes=['/','/lab','/lab/users','/concepts','/research','/practices','/devices','/multimodal','/tracking','/experiments','/chatbots','/reports','/accessibility','/evaluation','/user-testing','/metrics','/ai','/quality','/course'];
for(const language of ['es-CO','en-US','pt-BR','fr-FR','it-IT','ca-ES'])test(`interface languages: every empty route, auxiliary feedback, TTS and CSV in ${language}`,async({page},info)=>{
 test.setTimeout(120000);
 await page.addInitScript(({language,project})=>{
  localStorage.setItem('hci-language',language);localStorage.setItem('hci-lab-ia-project-v2',JSON.stringify(project));
  Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{cancel(){},speak(value:{text:string;lang:string}){(window as Window&{spoken?:{text:string;lang:string}}).spoken={text:value.text,lang:value.lang};}}});
  Object.defineProperty(window,'SpeechSynthesisUtterance',{configurable:true,value:class {lang='';constructor(public text:string){}}});
 },{language,project:emptyProject()});
 const tx=(key:string)=>interfaceResources[language][key];
 const localValues=new Set(Object.values(interfaceResources[language]));
 const forbidden=language==='es-CO'?[]:[...new Set(Object.entries(interfaceResources['es-CO']).filter(([key,value])=>tx(key)!==value&&!localValues.has(value)&&!value.includes('{{')).map(([,value])=>value))];
 for(const route of routes){
  await page.goto(`/hci-lab-ia/#${route}`);await expect(page.locator('main h1')).toBeVisible();await expect(page.locator('html')).toHaveAttribute('lang',language);
  const copy=await page.evaluate(()=>{
   const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);const texts:string[]=[];while(walker.nextNode()){const node=walker.currentNode;if(!node.parentElement?.closest('script,style'))texts.push(node.textContent?.replace(/\s+/g,' ').trim()||'');}
   return [...texts,...Array.from(document.querySelectorAll('[aria-label],[title],[placeholder],[alt]')).flatMap(el=>['aria-label','title','placeholder','alt'].map(key=>el.getAttribute(key)||''))];
  });
  expect(copy.filter(text=>forbidden.includes(text)),route).toEqual([]);
  expect(copy.filter(text=>/\b(?:closure|displayPreferences|conceptLab|patternLab|evaluationLab|trackingUX|usersLab|projectActivities|multimodal)\.\w+/.test(text)),route).toEqual([]);
  if(route==='/course')expect(copy,`${language} course sections`).toEqual(expect.arrayContaining(course.map(([, , ,section])=>tx(section))));
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),route).toBe(true);
 }
 await page.goto('/hci-lab-ia/#/accessibility');await page.getByRole('button',{name:tx('Anunciar actualización'),exact:true}).click();await expect(page.locator('.live-demo')).toContainText(tx('Estado actualizado a las {{time}}').split('{{time}}')[0]);
 await page.getByRole('button',{name:tx('Escuchar nombre y estado (TTS)'),exact:true}).click();expect(await page.evaluate(()=>(window as Window&{spoken?:unknown}).spoken)).toEqual({text:tx('Botón: Confirmar reserva. Estado: acción confirmada.'),lang:language});
 await page.getByRole('button',{name:tx('Restablecer demostración'),exact:true}).click();await expect(page.locator('.section-block [role=status]')).toHaveText(tx('Demostración restablecida.'));
 await page.keyboard.press('Alt+Shift+KeyV');const dialog=page.getByRole('dialog');const display=displayResources[language as keyof typeof displayResources];
 while(await dialog.getByRole('button',{name:display.increase,exact:true}).isEnabled())await dialog.getByRole('button',{name:display.increase,exact:true}).click();
 await page.keyboard.press('Escape');expect(await page.evaluate(()=>getComputedStyle(document.documentElement).fontSize)).toBe('32px');
 const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(axe.violations).toEqual([]);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 await page.goto('/hci-lab-ia/#/metrics');const download=page.waitForEvent('download');await page.getByRole('button',{name:tx('Exportar CSV'),exact:true}).click();const file=await download;const stream=await file.createReadStream();let csv='';for await(const chunk of stream!)csv+=chunk.toString();expect(csv.split('\n')[0]).toBe(`"${tx('Métrica')}","${tx('Valor')}"`);await file.saveAs(info.outputPath(`metrics-${language}.csv`));
 // Empty-project checks must not create observations or records as a side effect.
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('hci-lab-ia-project-v2')!))).toEqual(emptyProject());
});
