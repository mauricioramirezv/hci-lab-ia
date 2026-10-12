# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: project-activities.spec.ts >> iteration 5: three contexts and both conditions in it-IT
- Location: tests\e2e\project-activities.spec.ts:16:2

# Error details

```
Error: expect(locator).toHaveText(expected) failed

Locator:  getByRole('status')
Expected: "Prenotazione confermata e salvata."
Received: ""
Timeout:  5000ms

Call log:
  - Expect "toHaveText" getByRole('status') with timeout 5000ms
  - waiting for getByRole('status')
    13 × locator resolved to <p class="" role="status" tabindex="-1"></p>
       - unexpected value ""

```

```yaml
- link "Vai al contenuto":
  - /url: "#main-content"
- banner:
  - button "Apri menu"
  - strong: HCI Lab + IA
  - complementary "Controles de seguimiento de la página":
    - button "Monitoraggio della pagina"
  - button "Gestisci progetto"
  - text: Lingua
  - combobox "Lingua":
    - option "ES"
    - option "EN"
    - option "PT"
    - option "FR"
    - option "IT" [selected]
    - option "CA"
  - button "Tema scuro"
- main:
  - text: Contesto
  - heading "Prenotazioni in diversi contesti" [level=1]
  - paragraph: Simula una prenotazione universitaria, sanitaria o culturale. Tutti i servizi e gli orari sono fittizi; nessun ente viene contattato.
  - group "Condizione dell’esempio":
    - button "Buona pratica" [pressed]
    - button "Antipattern"
  - paragraph: Passaggi e riepilogo visibili favoriscono il riconoscimento. I dati rimangono quando torni indietro o correggi.
  - status
  - region "Buona pratica":
    - list:
      - listitem: Servizio
      - listitem: Data e ora
      - listitem: Revisione
      - listitem: Conferma
    - heading "Servizio" [level=2]
    - text: Contesto
    - combobox "Contesto":
      - option "Seleziona un’opzione" [selected]
      - option "Università"
      - option "Salute"
      - option "Cultura"
    - text: Servizio
    - combobox "Servizio":
      - option "Seleziona un’opzione" [selected]
    - button "Annulla"
    - button "Continua"
  - heading "Prenotazioni salvate" [level=2]
  - article:
    - heading "Consulenza universitaria fittizia" [level=3]
    - term: Servizio
    - definition: Consulenza universitaria fittizia
    - term: Data e ora
    - definition: 2099-10-15 · 10:30
    - paragraph: "Stato: Confermata"
    - paragraph: "Condizione dell’esempio: Buona pratica"
    - button "Riprogramma"
    - button "Annulla prenotazione"
```

# Test source

```ts
  1   | ﻿import { test, expect } from '@playwright/test';
  2   | import type { Page } from '@playwright/test';
  3   | import AxeBuilder from '@axe-core/playwright';
  4   | import { activityLanguages, activityResources } from '../../src/projectActivities/locales';
  5   | import { manageResources } from '../../src/manageLocales';
  6   | import { representativeProject } from '../fixtures/representativeProject';
  7   | import { emptyProject } from '../../src/projectBackup';
  8   | 
  9   | const root='/hci-lab-ia/';
  10  | const snapshot=(page:Page)=>page.evaluate(()=>JSON.parse(localStorage.getItem('hci-lab-ia-project-v2')!));
  11  | async function language(page:Page,lang:string){await page.locator('.language select').selectOption(lang);}
  12  | async function upload(page:Page,text:string){await page.locator('dialog input[type=file]').evaluate((el,text)=>{const dt=new DataTransfer();dt.items.add(new File([text],'project.json',{type:'application/json'}));(el as HTMLInputElement).files=dt.files;el.dispatchEvent(new Event('change',{bubbles:true}));},text);}
  13  | async function seed(page:Page){await page.goto(root);const p=representativeProject();p.personas[0]={...p.personas[0],basis:'mixed',observed:'Fuente observada / RAW',assumptions:'Supuesto / RAW',emotionSource:'declared'};p.scenarios[0]={...p.scenarios[0],personaId:p.personas[0].id,fictional:true};p.appointments[0]={...p.appointments[0],serviceId:'health',condition:'bad'};await page.evaluate(p=>localStorage.setItem('hci-lab-ia-project-v2',JSON.stringify(p)),p);await page.reload();}
  14  | 
  15  | for(const lang of activityLanguages){const r=activityResources[lang];
  16  |  test(`iteration 5: three contexts and both conditions in ${lang}`,async({page})=>{
  17  |   await page.goto(`${root}#/lab`);await language(page,lang);await expect(page.locator('h1')).toHaveText(r.bookingTitle);
  18  |   for(const condition of ['good','bad'] as const){await page.getByRole('button',{name:r[condition],exact:true}).click();
  19  |    for(const [context,service] of [['university','advice'],['healthcare','health'],['culture','visit']]){
  20  |     if((await snapshot(page)).appointments.length)await page.getByRole('button',{name:r.newBooking,exact:true}).click();
  21  |     await page.getByLabel(r.context,{exact:true}).selectOption(context);await page.getByLabel(r.service,{exact:true}).selectOption(service);
  22  |     await page.getByRole('button',{name:r.next,exact:true}).click();await expect(page.locator('.activity-panel h2')).toBeFocused();
  23  |     await page.getByLabel(r.date,{exact:true}).fill(condition==='good'?'2099-10-15':'2099-10-16');await page.getByLabel(r.time,{exact:true}).selectOption('10:30');
  24  |     await page.getByRole('button',{name:r.back,exact:true}).click();await expect(page.getByLabel(r.service,{exact:true})).toHaveValue(service);
  25  |     await page.getByRole('button',{name:r.next,exact:true}).click();await expect(page.getByLabel(r.time,{exact:true})).toHaveValue('10:30');
  26  |     await page.getByRole('button',{name:r.next,exact:true}).click();await page.getByRole('button',{name:r.confirmBooking,exact:true}).dblclick();
> 27  |     await expect(page.getByRole('status')).toHaveText(r.booked);await expect(page.getByRole('status')).toBeFocused();
      |                                            ^ Error: expect(locator).toHaveText(expected) failed
  28  |     await expect(page.getByRole('button',{name:r.confirmBooking,exact:true})).toHaveCount(0);
  29  |    }
  30  |   }
  31  |   await expect(page.locator('[data-booking]')).toHaveCount(6);await page.reload();await expect(page.locator('[data-booking]')).toHaveCount(6);
  32  |   expect((await snapshot(page)).appointments.map((a:{condition:string})=>a.condition)).toEqual(['good','good','good','bad','bad','bad']);
  33  |   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  34  |  });
  35  |  test(`iteration 5: persona, empathy and scenario CRUD in ${lang}`,async({page})=>{
  36  |   await page.goto(`${root}#/research`);await language(page,lang);await expect(page.locator('form')).toHaveCount(0);
  37  |   await page.getByRole('button',{name:r.newScenario,exact:true}).click();await expect(page.getByRole('status')).toHaveText(r.noPersonas);
  38  |   await page.getByRole('button',{name:r.newPersona,exact:true}).click();await page.getByRole('button',{name:r.save,exact:true}).click();
  39  |   await expect(page.getByLabel(r.name,{exact:true})).toBeFocused();await expect(page.locator('#name-error')).toHaveText(r.required);
  40  |   const raw='Estudiante RAW áß';
  41  |   for(const [id,value] of [['name',raw],['context','Contexto RAW'],['goal','Objetivo RAW'],['barrier','Necesidad RAW'],['device','Dispositivo RAW']])await page.locator(`#${id}`).fill(value);
  42  |   await page.locator('#basis').selectOption('mixed');await page.locator('#observed').fill('Observación RAW');await page.locator('#assumptions').fill('Supuesto RAW');
  43  |   await language(page,lang==='es-CO'?'en-US':'es-CO');await expect(page.locator('#name')).toHaveValue(raw);await expect(page.locator('#observed')).toHaveValue('Observación RAW');await language(page,lang);
  44  |   await page.locator('summary').filter({hasText:r.empathy}).click();for(const k of ['says','thinks','does','feels'])await page.locator(`#${k}`).fill(`${k} RAW`);
  45  |   await page.getByRole('button',{name:r.save,exact:true}).click();await expect(page.locator('#emotionSource')).toBeFocused();await page.locator('#emotionSource').selectOption('declared');
  46  |   await page.getByRole('button',{name:r.save,exact:true}).click();await expect(page.getByRole('status')).toHaveText(r.saved);await expect(page.locator('form')).toHaveCount(0);
  47  |   await page.locator('[data-persona]').getByRole('button',{name:r.view,exact:true}).click();await expect(page.locator('.activity-panel')).toContainText('feels RAW');
  48  |   await page.getByRole('button',{name:r.back,exact:true}).click();await page.getByRole('button',{name:r.newScenario,exact:true}).click();
  49  |   await page.getByRole('button',{name:r.example,exact:true}).click();await page.getByRole('button',{name:r.save,exact:true}).click();await expect(page.locator('#personaId')).toBeFocused();
  50  |   await expect(page.locator('#task')).toHaveValue(r.exampleTask);const personaId=(await snapshot(page)).personas[0].id;await page.locator('#personaId').selectOption(personaId);
  51  |   await page.locator('#title').fill('Escenario RAW');await page.getByRole('button',{name:r.save,exact:true}).click();await expect(page.locator('[data-scenario]')).toHaveCount(1);
  52  |   await page.locator('[data-persona]').getByRole('button',{name:r.delete,exact:true}).click();await expect(page.getByRole('status')).toHaveText(r.deleteBlocked);
  53  |   await page.locator('[data-persona]').getByRole('button',{name:r.edit,exact:true}).click();await page.locator('#name').fill('Renombrada RAW');await page.getByRole('button',{name:r.save,exact:true}).click();
  54  |   await expect(page.locator('[data-scenario]')).toContainText('Renombrada RAW');expect((await snapshot(page)).scenarios[0].personaId).toBe(personaId);
  55  |   await page.locator('[data-scenario]').getByRole('button',{name:r.edit,exact:true}).click();await page.locator('#task').fill('Tarea corregida RAW');await page.getByRole('button',{name:r.cancel,exact:true}).click();
  56  |   expect((await snapshot(page)).scenarios[0].task).toBe(r.exampleTask);
  57  |   await page.locator('[data-scenario]').getByRole('button',{name:r.edit,exact:true}).click();await page.locator('#task').fill('Tarea corregida RAW');await page.getByRole('button',{name:r.save,exact:true}).click();
  58  |   await language(page,lang==='es-CO'?'en-US':'es-CO');await expect(page.locator('[data-scenario]')).toContainText('Tarea corregida RAW');await language(page,lang);
  59  |   await page.reload();await expect(page.locator('[data-persona]')).toContainText('Renombrada RAW');await expect(page.locator('[data-scenario]')).toContainText('Tarea corregida RAW');
  60  |   await page.locator('[data-scenario]').getByRole('button',{name:r.delete,exact:true}).click();await expect(page.getByRole('dialog')).toHaveAccessibleName(r.deleteTitle);await expect(page.getByRole('dialog').getByRole('button',{name:r.cancel,exact:true})).toBeFocused();
  61  |   await page.keyboard.press('Escape');await expect(page.locator('[data-scenario]')).toHaveCount(1);
  62  |   await page.locator('[data-scenario]').getByRole('button',{name:r.delete,exact:true}).click();await page.getByRole('dialog').getByRole('button',{name:r.delete,exact:true}).click();await expect(page.locator('[data-scenario]')).toHaveCount(0);
  63  |   await page.locator('[data-persona]').getByRole('button',{name:r.delete,exact:true}).click();await page.getByRole('dialog').getByRole('button',{name:r.delete,exact:true}).click();await expect(page.locator('[data-persona]')).toHaveCount(0);
  64  |   await expect(page.getByRole('status')).toBeFocused();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  65  |  });
  66  | }
  67  | 
  68  | test('iteration 5: validation, keyboard, condition switch, duplicate prevention, rescheduling and cancellations',async({page})=>{
  69  |  const r=activityResources['es-CO'];await page.goto(`${root}#/lab`);
  70  |  await page.getByRole('button',{name:r.next,exact:true}).focus();await page.keyboard.press('Enter');await expect(page.locator('#context')).toBeFocused();
  71  |  await page.locator('#context').selectOption('university');await page.locator('#service').selectOption('workshop');await page.getByRole('button',{name:r.next,exact:true}).click();
  72  |  await page.locator('#date').fill('2000-10-15');await page.locator('#time').selectOption('10:30');await page.getByRole('button',{name:r.next,exact:true}).click();await expect(page.locator('#date-error')).toHaveText(r.dateInvalid);await expect(page.locator('#time')).toHaveValue('10:30');
  73  |  await page.locator('#date').fill('2099-10-15');await page.getByRole('button',{name:r.bad,exact:true}).click();await expect(page.locator('#date')).toHaveValue('2099-10-15');await expect(page.locator('.activity-panel')).not.toContainText(r.workshop);
  74  |  await page.getByRole('button',{name:r.good,exact:true}).click();await expect(page.locator('.activity-panel')).toContainText(r.workshop);
  75  |  await page.getByRole('button',{name:r.next,exact:true}).click();await page.getByRole('button',{name:r.confirmBooking,exact:true}).click();await expect(page.locator('[data-booking]')).toHaveCount(1);
  76  |  await page.getByRole('button',{name:r.newBooking,exact:true}).click();await page.locator('#context').selectOption('university');await page.locator('#service').selectOption('workshop');await page.getByRole('button',{name:r.next,exact:true}).click();await page.locator('#date').fill('2099-10-15');await page.locator('#time').selectOption('10:30');await page.getByRole('button',{name:r.next,exact:true}).click();await expect(page.locator('#time-error')).toHaveText(r.duplicate);
  77  |  await page.getByRole('button',{name:r.cancel,exact:true}).click();await expect(page.locator('[data-booking]')).toHaveCount(1);
  78  |  await page.locator('[data-booking]').getByRole('button',{name:r.reschedule,exact:true}).click();await page.locator('#date').fill('2099-10-17');await page.getByRole('button',{name:r.cancel,exact:true}).click();expect((await snapshot(page)).appointments[0].date).toBe('2099-10-15');
  79  |  await page.locator('[data-booking]').getByRole('button',{name:r.reschedule,exact:true}).click();await page.locator('#date').fill('2099-10-17');await page.getByRole('button',{name:r.next,exact:true}).click();await page.getByRole('button',{name:r.confirmReschedule,exact:true}).click();expect((await snapshot(page)).appointments[0].date).toBe('2099-10-17');
  80  |  await page.locator('[data-booking]').getByRole('button',{name:r.cancelBooking,exact:true}).click();await expect(page.getByRole('dialog').getByRole('button',{name:r.cancel,exact:true})).toBeFocused();await page.keyboard.press('Escape');expect((await snapshot(page)).appointments[0].status).toBe('confirmed');
  81  |  await page.locator('[data-booking]').getByRole('button',{name:r.cancelBooking,exact:true}).click();await page.keyboard.press('Tab');await expect(page.getByRole('dialog').getByRole('button',{name:r.cancelBooking,exact:true})).toBeFocused();await page.keyboard.press('Enter');await expect(page.getByRole('status')).toHaveText(r.bookingCancelled);
  82  |  await page.reload();expect((await snapshot(page)).appointments[0].status).toBe('cancelled');
  83  | });
  84  | 
  85  | test('iteration 5: backup, invalid imports, recovery and reset preserve all previous data',async({page})=>{
  86  |  const m=manageResources['es-CO'];await seed(page);await page.goto(`${root}#/research`);const before=await snapshot(page);
  87  |  await page.getByRole('button',{name:m.title,exact:true}).click();const downloaded=page.waitForEvent('download');await page.getByRole('button',{name:m.backup,exact:true}).click();const file=await downloaded;const stream=await file.createReadStream();let content='';for await(const chunk of stream!)content+=chunk.toString();const backup=JSON.parse(content);expect(backup.personas).toEqual(before.personas);expect(backup.scenarios).toEqual(before.scenarios);expect(backup.appointments).toEqual(before.appointments);
  88  |  await upload(page,'{invalid');expect(await snapshot(page)).toEqual(before);await upload(page,JSON.stringify({...backup,personas:[{id:'incomplete'}]}));expect(await snapshot(page)).toEqual(before);
  89  |  await upload(page,content);await page.getByRole('button',{name:m.cancel,exact:true}).click();expect(await snapshot(page)).toEqual(before);
  90  |  await page.getByRole('button',{name:m.title,exact:true}).click();await upload(page,content);await page.getByRole('button',{name:m.confirmRecover,exact:true}).click();expect(await snapshot(page)).toEqual(before);
  91  |  await page.getByRole('button',{name:m.title,exact:true}).click();await page.getByRole('button',{name:m.reset,exact:true}).click();await page.getByRole('button',{name:m.confirmReset,exact:true}).click();expect(await snapshot(page)).toEqual(emptyProject());await page.reload();await expect(page.locator('[data-persona],[data-scenario]')).toHaveCount(0);
  92  |  await page.getByRole('button',{name:m.title,exact:true}).click();await upload(page,content);await page.getByRole('button',{name:m.confirmRecover,exact:true}).click();await page.reload();expect(await snapshot(page)).toEqual(before);
  93  | });
  94  | 
  95  | for(const theme of ['light','dark','contrast','dark-contrast'])test(`iteration 5: axe and responsive states in ${theme}`,async({page},info)=>{
  96  |  test.setTimeout(120000);const r=activityResources['es-CO'];await page.addInitScript(theme=>localStorage.setItem('hci-prefs-v2',JSON.stringify({dark:theme.includes('dark'),contrast:theme.includes('contrast'),font:100,spacing:false,dyslexia:false,motion:true})),theme);await seed(page);
  97  |  const axe=async(name:string)=>{const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(result.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})),name).toEqual([]);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),name).toBe(true);};
  98  |  await page.goto(`${root}#/lab`);await axe('booking service');await page.getByRole('button',{name:r.next,exact:true}).click();await axe('booking invalid');await page.locator('#context').selectOption('culture');await page.locator('#service').selectOption('culture');await page.getByRole('button',{name:r.next,exact:true}).click();await axe('date and time');await page.getByRole('button',{name:r.bad,exact:true}).click();await axe('bad condition');await page.locator('#date').fill('2099-10-15');await page.locator('#time').selectOption('14:00');await page.getByRole('button',{name:r.next,exact:true}).click();await axe('review');await page.getByRole('button',{name:r.confirmBooking,exact:true}).click();await axe('confirmed');await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:info.outputPath(`reservas-${theme}.png`),fullPage:true});await page.locator('[data-booking]').first().getByRole('button',{name:r.cancelBooking,exact:true}).click();await axe('cancel dialog');await page.keyboard.press('Escape');
  99  |  await page.goto(`${root}#/research`);await axe('research list');await page.locator('[data-persona]').getByRole('button',{name:r.view,exact:true}).click();await axe('persona detail');await page.getByRole('button',{name:r.back,exact:true}).click();await page.getByRole('button',{name:r.newPersona,exact:true}).click();await axe('persona form');await page.getByRole('button',{name:r.save,exact:true}).click();await axe('persona invalid');await page.locator('summary').filter({hasText:r.empathy}).click();await axe('empathy');await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:info.outputPath(`persona-${theme}.png`),fullPage:true});await page.getByRole('button',{name:r.cancel,exact:true}).click();await page.getByRole('button',{name:r.newScenario,exact:true}).click();await axe('scenario form');await page.getByRole('button',{name:r.example,exact:true}).click();await page.getByRole('button',{name:r.save,exact:true}).click();await axe('scenario invalid');await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:info.outputPath(`escenario-${theme}.png`),fullPage:true});
  100 | });
  101 | 
  102 | 
```