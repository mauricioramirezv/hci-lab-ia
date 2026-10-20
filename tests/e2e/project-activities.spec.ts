import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { activityLanguages, activityResources } from '../../src/app/locales/projectActivities';
import { manageResources } from '../../src/features/project/locales';
import { representativeProject } from '../fixtures/representativeProject';
import { emptyProject } from '../../src/features/project/backup';

const root='/hci-lab-ia/';
const snapshot=(page:Page)=>page.evaluate(()=>JSON.parse(localStorage.getItem('hci-lab-ia-project-v2')!));
async function language(page:Page,lang:string){await page.locator('.language select').selectOption(lang);}
async function upload(page:Page,text:string){await page.locator('dialog input[type=file]').evaluate((el,text)=>{const dt=new DataTransfer();dt.items.add(new File([text],'project.json',{type:'application/json'}));(el as HTMLInputElement).files=dt.files;el.dispatchEvent(new Event('change',{bubbles:true}));},text);}
async function seed(page:Page){await page.goto(root);const p=representativeProject();p.personas[0]={...p.personas[0],basis:'mixed',observed:'Fuente observada / RAW',assumptions:'Supuesto / RAW',emotionSource:'declared'};p.scenarios[0]={...p.scenarios[0],personaId:p.personas[0].id,fictional:true};p.appointments[0]={...p.appointments[0],serviceId:'health',condition:'bad'};p.evidence!.push({id:'pattern-iteration-4',createdAt:'2026-10-09T15:00:00.000Z',kind:'pattern',participant:'Alias previo',task:'Formulario',condition:'bad',prototype:'patterns-iteration-4',scores:{},notes:'Problema RAW',pattern:{id:'form',problem:'Problema RAW',principle:'Principio RAW',correction:'Corrección RAW'}});p.evidence![0]={...p.evidence![0],concept:{id:'cognition',outcome:'completed',response:{text:'Texto anterior RAW',reason:'Razón RAW',edit:'',decision:''}}};await page.evaluate(p=>localStorage.setItem('hci-lab-ia-project-v2',JSON.stringify(p)),p);await page.reload();}

for(const lang of activityLanguages){const r=activityResources[lang];
 test(`reservations and research: three contexts and both conditions in ${lang}`,async({page})=>{
  await page.goto(`${root}#/lab`);await language(page,lang);await expect(page.locator('h1')).toHaveText(r.bookingTitle);
  for(const condition of ['good','bad'] as const){await page.getByRole('button',{name:r[condition],exact:true}).click();
   for(const [context,service] of [['university','advice'],['healthcare','health'],['culture','visit']]){
    if((await snapshot(page)).appointments.length)await page.getByRole('button',{name:r.newBooking,exact:true}).click();
    await page.getByLabel(r.context,{exact:true}).selectOption(context);await page.getByLabel(r.service,{exact:true}).selectOption(service);
    await page.getByRole('button',{name:r.next,exact:true}).click();await expect(page.locator('.activity-panel h2')).toBeFocused();
    await page.getByLabel(r.date,{exact:true}).fill(condition==='good'?'2099-10-15':'2099-10-16');await page.getByLabel(r.time,{exact:true}).selectOption('10:30');
    await page.getByRole('button',{name:r.back,exact:true}).click();await expect(page.locator('.activity-panel h2')).toBeFocused();await expect(page.getByLabel(r.service,{exact:true})).toHaveValue(service);
    await page.getByRole('button',{name:r.next,exact:true}).click();await expect(page.getByLabel(r.time,{exact:true})).toHaveValue('10:30');
    await page.getByRole('button',{name:r.next,exact:true}).click();await page.getByRole('button',{name:r.confirmBooking,exact:true}).dblclick();
    await expect(page.getByRole('status')).toHaveText(r.booked);await expect(page.getByRole('status')).toBeFocused();
    await expect(page.getByRole('button',{name:r.confirmBooking,exact:true})).toHaveCount(0);
   }
  }
  await expect(page.locator('[data-booking]')).toHaveCount(6);await page.reload();await expect(page.locator('[data-booking]')).toHaveCount(6);
  expect((await snapshot(page)).appointments.map((a:{condition:string})=>a.condition)).toEqual(['good','good','good','bad','bad','bad']);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 });
 test(`reservations and research: persona, empathy and scenario CRUD in ${lang}`,async({page})=>{
  await page.goto(`${root}#/research`);await language(page,lang);await expect(page.locator('form')).toHaveCount(0);
  await page.getByRole('button',{name:r.newScenario,exact:true}).click();await expect(page.getByRole('status')).toHaveText(r.noPersonas);
  await page.getByRole('button',{name:r.newPersona,exact:true}).click();await page.getByRole('button',{name:r.save,exact:true}).click();
  await expect(page.getByLabel(r.name,{exact:true})).toBeFocused();await expect(page.locator('#name-error')).toHaveText(r.required);
  const raw='Estudiante RAW áß';
  for(const [id,value] of [['name',raw],['context','Contexto RAW'],['goal','Objetivo RAW'],['barrier','Necesidad RAW'],['device','Dispositivo RAW']])await page.locator(`#${id}`).fill(value);
  await page.locator('#basis').selectOption('mixed');await page.locator('#observed').fill('Observación RAW');await page.locator('#assumptions').fill('Supuesto RAW');
  await language(page,lang==='es-CO'?'en-US':'es-CO');await expect(page.locator('#name')).toHaveValue(raw);await expect(page.locator('#observed')).toHaveValue('Observación RAW');await language(page,lang);
  await page.locator('summary').filter({hasText:r.empathy}).click();for(const k of ['says','thinks','does','feels'])await page.locator(`#${k}`).fill(`${k} RAW`);
  await page.getByRole('button',{name:r.save,exact:true}).click();await expect(page.locator('#emotionSource')).toBeFocused();await page.locator('#emotionSource').selectOption('declared');
  await page.getByRole('button',{name:r.save,exact:true}).click();await expect(page.getByRole('status')).toHaveText(r.saved);await expect(page.locator('form')).toHaveCount(0);
  await page.locator('[data-persona]').getByRole('button',{name:r.view,exact:true}).click();await expect(page.locator('.activity-panel')).toContainText('feels RAW');
  await page.getByRole('button',{name:r.back,exact:true}).click();await page.getByRole('button',{name:r.newScenario,exact:true}).click();
  await page.getByRole('button',{name:r.example,exact:true}).click();await page.getByRole('button',{name:r.save,exact:true}).click();await expect(page.locator('#personaId')).toBeFocused();
  await expect(page.locator('#task')).toHaveValue(r.exampleTask);const personaId=(await snapshot(page)).personas[0].id;await page.locator('#personaId').selectOption(personaId);
  await page.locator('#title').fill('Escenario RAW');await page.getByRole('button',{name:r.save,exact:true}).click();await expect(page.locator('[data-scenario]')).toHaveCount(1);
  await page.locator('[data-persona]').getByRole('button',{name:r.delete,exact:true}).click();await expect(page.getByRole('status')).toHaveText(r.deleteBlocked);
  await page.locator('[data-persona]').getByRole('button',{name:r.edit,exact:true}).click();await page.locator('#name').fill('Renombrada RAW');await page.getByRole('button',{name:r.save,exact:true}).click();
  await expect(page.locator('[data-scenario]')).toContainText('Renombrada RAW');expect((await snapshot(page)).scenarios[0].personaId).toBe(personaId);
  await page.locator('[data-scenario]').getByRole('button',{name:r.edit,exact:true}).click();await page.locator('#task').fill('Tarea corregida RAW');await page.getByRole('button',{name:r.cancel,exact:true}).click();
  expect((await snapshot(page)).scenarios[0].task).toBe(r.exampleTask);
  await page.locator('[data-scenario]').getByRole('button',{name:r.edit,exact:true}).click();await page.locator('#task').fill('Tarea corregida RAW');await page.getByRole('button',{name:r.save,exact:true}).click();
  await language(page,lang==='es-CO'?'en-US':'es-CO');await expect(page.locator('[data-scenario]')).toContainText('Tarea corregida RAW');await language(page,lang);
  await page.reload();await expect(page.locator('[data-persona]')).toContainText('Renombrada RAW');await expect(page.locator('[data-scenario]')).toContainText('Tarea corregida RAW');
  await page.locator('[data-scenario]').getByRole('button',{name:r.delete,exact:true}).click();await expect(page.getByRole('dialog')).toHaveAccessibleName(r.deleteTitle);await expect(page.getByRole('dialog').getByRole('button',{name:r.cancel,exact:true})).toBeFocused();
  await page.keyboard.press('Escape');await expect(page.locator('[data-scenario]')).toHaveCount(1);
  await page.locator('[data-scenario]').getByRole('button',{name:r.delete,exact:true}).click();await page.getByRole('dialog').getByRole('button',{name:r.delete,exact:true}).click();await expect(page.locator('[data-scenario]')).toHaveCount(0);
  await page.locator('[data-persona]').getByRole('button',{name:r.delete,exact:true}).click();await page.getByRole('dialog').getByRole('button',{name:r.delete,exact:true}).click();await expect(page.locator('[data-persona]')).toHaveCount(0);
  await expect(page.getByRole('status')).toBeFocused();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 });
}

test('reservations and research: validation, keyboard, condition switch, duplicate prevention, rescheduling and cancellations',async({page})=>{
 const r=activityResources['es-CO'];await page.goto(`${root}#/lab`);
 await page.getByRole('button',{name:r.next,exact:true}).focus();await page.keyboard.press('Enter');await expect(page.locator('#context')).toBeFocused();
 await page.locator('#context').selectOption('university');await page.locator('#service').selectOption('workshop');await page.getByRole('button',{name:r.next,exact:true}).click();
 await page.locator('#date').fill('2000-10-15');await page.locator('#time').selectOption('10:30');await page.getByRole('button',{name:r.next,exact:true}).click();await expect(page.locator('#date-error')).toHaveText(r.dateInvalid);await expect(page.locator('#time')).toHaveValue('10:30');
 await page.locator('#date').fill('2099-10-15');await page.getByRole('button',{name:r.bad,exact:true}).click();await expect(page.locator('#date')).toHaveValue('2099-10-15');await expect(page.locator('.activity-panel')).not.toContainText(r.workshop);
 await page.getByRole('button',{name:r.good,exact:true}).click();await expect(page.locator('.activity-panel')).toContainText(r.workshop);
 await page.getByRole('button',{name:r.next,exact:true}).click();await page.getByRole('button',{name:r.confirmBooking,exact:true}).click();await expect(page.locator('[data-booking]')).toHaveCount(1);
 await page.getByRole('button',{name:r.newBooking,exact:true}).click();await page.locator('#context').selectOption('university');await page.locator('#service').selectOption('workshop');await page.getByRole('button',{name:r.next,exact:true}).click();await page.locator('#date').fill('2099-10-15');await page.locator('#time').selectOption('10:30');await page.getByRole('button',{name:r.next,exact:true}).click();await expect(page.locator('#time-error')).toHaveText(r.duplicate);
 await page.getByRole('button',{name:r.cancel,exact:true}).click();await expect(page.locator('[data-booking]')).toHaveCount(1);
 await page.locator('[data-booking]').getByRole('button',{name:r.reschedule,exact:true}).click();await page.locator('#date').fill('2099-10-17');await page.getByRole('button',{name:r.cancel,exact:true}).click();expect((await snapshot(page)).appointments[0].date).toBe('2099-10-15');
 await page.locator('[data-booking]').getByRole('button',{name:r.reschedule,exact:true}).click();await page.locator('#date').fill('2099-10-17');await page.getByRole('button',{name:r.next,exact:true}).click();await page.getByRole('button',{name:r.confirmReschedule,exact:true}).click();expect((await snapshot(page)).appointments[0].date).toBe('2099-10-17');
 await page.locator('[data-booking]').getByRole('button',{name:r.cancelBooking,exact:true}).click();await expect(page.getByRole('dialog').getByRole('button',{name:r.cancel,exact:true})).toBeFocused();await page.keyboard.press('Escape');expect((await snapshot(page)).appointments[0].status).toBe('confirmed');
 await page.locator('[data-booking]').getByRole('button',{name:r.cancelBooking,exact:true}).click();await page.keyboard.press('Tab');await expect(page.getByRole('dialog').getByRole('button',{name:r.cancelBooking,exact:true})).toBeFocused();await page.keyboard.press('Enter');await expect(page.getByRole('status')).toHaveText(r.bookingCancelled);
 await page.reload();expect((await snapshot(page)).appointments[0].status).toBe('cancelled');
});

test('reservations and research: backup, invalid imports, recovery and reset preserve all previous data',async({page})=>{
 const m=manageResources['es-CO'];await seed(page);await page.goto(`${root}#/research`);const before=await snapshot(page);
 await page.getByRole('button',{name:m.title,exact:true}).click();const downloaded=page.waitForEvent('download');await page.getByRole('button',{name:m.backup,exact:true}).click();const file=await downloaded;const stream=await file.createReadStream();let content='';for await(const chunk of stream!)content+=chunk.toString();const backup=JSON.parse(content);expect(backup.personas).toEqual(before.personas);expect(backup.scenarios).toEqual(before.scenarios);expect(backup.appointments).toEqual(before.appointments);
 await upload(page,'{invalid');expect(await snapshot(page)).toEqual(before);await upload(page,JSON.stringify({...backup,personas:[{id:'incomplete'}]}));expect(await snapshot(page)).toEqual(before);
 await upload(page,content);await page.getByRole('button',{name:m.cancel,exact:true}).click();expect(await snapshot(page)).toEqual(before);
 await page.getByRole('button',{name:m.title,exact:true}).click();await upload(page,content);await page.getByRole('button',{name:m.confirmRecover,exact:true}).click();expect(await snapshot(page)).toEqual(before);
 await page.getByRole('button',{name:m.title,exact:true}).click();await page.getByRole('button',{name:m.reset,exact:true}).click();await page.getByRole('button',{name:m.confirmReset,exact:true}).click();expect(await snapshot(page)).toEqual(emptyProject());await page.reload();await expect(page.locator('[data-persona],[data-scenario]')).toHaveCount(0);
 await page.getByRole('button',{name:m.title,exact:true}).click();await upload(page,content);await page.getByRole('button',{name:m.confirmRecover,exact:true}).click();await page.reload();expect(await snapshot(page)).toEqual(before);
});

for(const theme of ['light','dark','contrast','dark-contrast'])test(`reservations and research: axe and responsive states in ${theme}`,async({page},info)=>{
 test.setTimeout(120000);const r=activityResources['es-CO'];await page.addInitScript(theme=>localStorage.setItem('hci-prefs-v2',JSON.stringify({dark:theme.includes('dark'),contrast:theme.includes('contrast'),font:100,spacing:false,dyslexia:false,motion:true})),theme);await seed(page);
 const axe=async(name:string)=>{const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(result.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})),name).toEqual([]);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),name).toBe(true);};
 await page.goto(`${root}#/lab`);await axe('booking service');await page.getByRole('button',{name:r.next,exact:true}).click();await axe('booking invalid');await page.locator('#context').selectOption('culture');await page.locator('#service').selectOption('culture');await page.getByRole('button',{name:r.next,exact:true}).click();await axe('date and time');await page.getByRole('button',{name:r.bad,exact:true}).click();await axe('bad condition');await page.locator('#date').fill('2099-10-15');await page.locator('#time').selectOption('14:00');await page.getByRole('button',{name:r.next,exact:true}).click();await axe('review');await page.getByRole('button',{name:r.confirmBooking,exact:true}).click();await axe('confirmed');await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:info.outputPath(`reservas-${theme}.png`),fullPage:true});await page.locator('[data-booking]').first().getByRole('button',{name:r.cancelBooking,exact:true}).click();await axe('cancel dialog');await page.keyboard.press('Escape');
 await page.goto(`${root}#/research`);await axe('research list');await page.locator('[data-persona]').getByRole('button',{name:r.view,exact:true}).click();await axe('persona detail');await page.getByRole('button',{name:r.back,exact:true}).click();await page.getByRole('button',{name:r.newPersona,exact:true}).click();await axe('persona form');await page.getByRole('button',{name:r.save,exact:true}).click();await axe('persona invalid');await page.locator('summary').filter({hasText:r.empathy}).click();await axe('empathy');await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:info.outputPath(`persona-${theme}.png`),fullPage:true});await page.getByRole('button',{name:r.cancel,exact:true}).click();await page.getByRole('button',{name:r.newScenario,exact:true}).click();await axe('scenario form');await page.getByRole('button',{name:r.example,exact:true}).click();await page.getByRole('button',{name:r.save,exact:true}).click();await axe('scenario invalid');await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:info.outputPath(`escenario-${theme}.png`),fullPage:true});
});

