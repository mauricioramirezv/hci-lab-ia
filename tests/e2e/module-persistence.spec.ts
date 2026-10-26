import { expect, test } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';
import { evaluationResources } from '../../src/features/evaluation/locales';
import { patternResources } from '../../src/features/patterns/locales';
import { conceptResources } from '../../src/features/concepts/locales';
import { trackingResources } from '../../src/features/tracking/locales';

const r=evaluationResources['es-CO'];
const records=(page:Page,collection:string)=>page.evaluate(key=>(JSON.parse(localStorage.getItem('hci-lab-ia-project-v2')!) as Record<string,unknown[]>)[key]||[],collection);
async function failureAndRetry(page:Page,save:Locator,collection:string,field?:Locator) {
 const before=await records(page,collection),original=await page.evaluate(()=>localStorage.getItem('hci-lab-ia-project-v2'));
 const authored=field?await field.inputValue():undefined;
 await page.evaluate(()=>{
  const flag={blocked:true},original=Storage.prototype.setItem;
  (window as Window&{projectWriteFailure?:{blocked:boolean}}).projectWriteFailure=flag;
  Storage.prototype.setItem=function(key,value){if(key==='hci-lab-ia-project-v2'&&flag.blocked)throw new DOMException('Quota','QuotaExceededError');original.call(this,key,value);};
 });
 await save.click();
 await expect(save).toBeEnabled();
 expect(await records(page,collection)).toEqual(before);
 expect(await page.evaluate(()=>localStorage.getItem('hci-lab-ia-project-v2'))).toBe(original);
 if(field)await expect(field).toHaveValue(authored!);
 await page.evaluate(()=>{(window as Window&{projectWriteFailure?:{blocked:boolean}}).projectWriteFailure!.blocked=false;});
 await save.click();
 await expect.poll(async()=>(await records(page,collection)).length).toBe(before.length+1);
 await page.reload();expect(await records(page,collection)).toHaveLength(before.length+1);
}

test('module persistence: research keeps the form and retries a failed save',async({page})=>{
 await page.goto('/hci-lab-ia/#/research');await page.getByRole('button',{name:'Crear persona',exact:true}).click();
 for(const key of ['name','context','goal','barrier','device','assumptions'])await page.locator('#'+key).fill('RAW '+key);
 await page.locator('#basis').selectOption('assumed');
 await failureAndRetry(page,page.getByRole('button',{name:'Guardar',exact:true}),'personas',page.locator('#name'));
});
test('module persistence: concepts do not confirm unpersisted results',async({page})=>{
 const resource=conceptResources['es-CO'];
 await page.goto('/hci-lab-ia/#/concepts');await page.locator('#concept-group-0-heading').click();await page.getByRole('button',{name:resource.ui.open.replace('{{name}}',resource.concepts[1].name),exact:true}).click();
 await page.getByRole('button',{name:resource.ui.start,exact:true}).click();await page.getByRole('button',{name:'Una visita · 12 €',exact:true}).click();
 const field=page.getByRole('textbox',{name:resource.ui.notes,exact:true});await field.fill('RAW observation');
 await failureAndRetry(page,page.getByRole('button',{name:resource.ui.saveResults,exact:true}),'evidence',field);
});
test('module persistence: patterns retain the observation on failure',async({page})=>{
 const resource=patternResources['es-CO'],ui=resource.ui;
 await page.goto('/hci-lab-ia/#/practices');await page.locator('.pattern-category .disclosure-toggle').first().click();await page.getByRole('button',{name:ui.open.replace('{{name}}',resource.patterns[0].name),exact:true}).click();
 for(const key of ['identified','principle','correction'] as const)await page.getByLabel(ui[key],{exact:true}).fill('RAW '+key);
 await failureAndRetry(page,page.getByRole('button',{name:ui.save,exact:true}),'evidence',page.getByRole('textbox',{name:ui.identified,exact:true}));
});
test('module persistence: questionnaires release the save lock after failure',async({page})=>{
 await page.goto('/hci-lab-ia/#/user-testing');await page.getByRole('button',{name:'SUS',exact:true}).click();const form=page.locator('form:visible');
 await form.getByLabel(r.task,{exact:true}).fill('RAW task');
 for(let number=1;number<=10;number++)await form.getByLabel(r.susResponse.replace('{{number}}',String(number)),{exact:true}).selectOption('4');
 await failureAndRetry(page,page.getByRole('button',{name:r.susSave,exact:true}),'evidence',form.getByLabel(r.task,{exact:true}));
});
test('module persistence: experiments retain measurements and allow a save retry',async({page})=>{
 await page.goto('/hci-lab-ia/#/experiments');await page.getByRole('button',{name:r.beginPractice,exact:true}).click();
 for(let trial=0;trial<2;trial++)await page.locator('.i7-board button[aria-pressed="true"]').click();
 await page.getByRole('button',{name:r.beginMeasure,exact:true}).click();
 for(let trial=0;trial<8;trial++)await page.locator('.i7-board button[aria-pressed="true"]').click();
 await failureAndRetry(page,page.getByRole('button',{name:r.experimentSave,exact:true}),'evidence');
});
test('module persistence: AI does not confirm a failed human review',async({page})=>{
 await page.goto('/hci-lab-ia/#/ai');await page.getByLabel(r.prompt,{exact:true}).fill('RAW request');await page.getByRole('button',{name:r.generate,exact:true}).click();
 await page.getByLabel(r.reason,{exact:true}).fill('RAW human review');
 await failureAndRetry(page,page.getByRole('button',{name:r.accept,exact:true}),'evidence',page.getByRole('textbox',{name:r.reason,exact:true}));
});
test('module persistence: chatbot rubric remains editable after failure',async({page})=>{
 await page.goto('/hci-lab-ia/#/chatbots');const chat=page.getByRole('heading',{name:r.goodChat,exact:true}).locator('..');
 await chat.getByLabel(r.chatPrompt,{exact:true}).fill('RAW prompt');await chat.getByRole('button',{name:r.send,exact:true}).click();
 await expect(chat.getByRole('textbox',{name:r.response,exact:true})).toBeEnabled();
 for(const key of ['clarity','control','tone','transparency'])await chat.getByLabel(r[key],{exact:true}).selectOption('4');
 await chat.getByLabel(r.rubricEvidence,{exact:true}).fill('RAW evidence');
 await failureAndRetry(page,chat.getByRole('button',{name:r.rubricSave,exact:true}),'evidence',chat.getByRole('textbox',{name:r.rubricEvidence,exact:true}));
});
test('module persistence: UX tracking can retry saving a stopped capture',async({page})=>{
 const ui=trackingResources['es-CO'];await page.goto('/hci-lab-ia/#/tracking');const controls=page.locator('#tracking-controls');
 await controls.getByLabel(ui.task,{exact:true}).fill('RAW task');await controls.getByRole('button',{name:ui.start,exact:true}).click();await controls.getByRole('button',{name:ui.stop,exact:true}).click();
 await failureAndRetry(page,controls.getByRole('button',{name:ui.save,exact:true}),'pageSessions');
});
test('module persistence: multimodal retains notes until storage succeeds',async({page})=>{
 await page.goto('/hci-lab-ia/#/multimodal');await page.locator('#multimodal-evidence-heading').click();const field=page.getByRole('textbox',{name:'Observación, problema y corrección propuesta',exact:true});await field.fill('RAW observation');
 await failureAndRetry(page,page.getByRole('button',{name:'Guardar evidencia',exact:true}),'multimodalEvidence',field);
});
