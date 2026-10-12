# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: project-management.spec.ts >> management: cancel is unchanged; reset clears every collection and preferences across reload, preserving language
- Location: tests\e2e\project-management.spec.ts:40:1

# Error details

```
Error: expect(locator).toHaveText(expected) failed

Locator: getByRole('status')
Expected: "Project reset: all records deleted, activities stopped and preferences reset. The language was kept."
Error: strict mode violation: getByRole('status') resolved to 2 elements:
    1) <p role="status" tabindex="-1" class="management-notice" data-management-notice="true">Project reset: all records deleted, activities st…</p> aka getByText('Project reset: all records')
    2) <p class="" role="status" tabindex="-1"></p> aka getByRole('status').filter({ hasText: /^$/ })

Call log:
  - Expect "toHaveText" getByRole('status') with timeout 5000ms
  - waiting for getByRole('status')

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - link "Skip to content" [ref=e4] [cursor=pointer]:
    - /url: "#main-content"
  - generic [ref=e5]:
    - banner [ref=e6]:
      - button "Open menu" [ref=e7] [cursor=pointer]
      - strong [ref=e10]: HCI Lab + AI
      - complementary "Controles de seguimiento de la página" [ref=e11]:
        - button "Page tracking" [ref=e12] [cursor=pointer]
      - button "Manage project" [ref=e15] [cursor=pointer]
      - generic [ref=e16]:
        - generic [ref=e21]: Language
        - combobox "Language" [ref=e22]:
          - option "ES"
          - option "EN" [selected]
          - option "PT"
          - option "FR"
          - option "IT"
          - option "CA"
      - button "Dark" [ref=e23] [cursor=pointer]
    - status [active] [ref=e26]: "Project reset: all records deleted, activities stopped and preferences reset. The language was kept."
    - main [ref=e27]:
      - generic [ref=e28]:
        - generic [ref=e30]:
          - text: Context
          - heading "Personas, empathy and scenarios" [level=1] [ref=e31]
          - paragraph [ref=e32]: A persona is a fictional profile summarizing goals, needs and context of use to guide design decisions. Separate observed evidence from assumptions awaiting validation; do not enter personal identifying information.
        - paragraph [ref=e33]: The link is preserved when a name changes. Reassign or delete a persona’s scenarios before deleting the persona.
        - status
        - heading "Saved personas" [level=2] [ref=e34]
        - button "New persona" [ref=e35] [cursor=pointer]
        - paragraph [ref=e36]: No personas yet. Create a fictional profile to link your scenarios.
        - generic [ref=e37]:
          - heading "Saved scenarios" [level=2] [ref=e38]
          - paragraph [ref=e39]: A scenario describes how a persona performs a task in context and which observable result verifies success.
          - button "New scenario" [ref=e40] [cursor=pointer]
          - paragraph [ref=e41]: Create a persona before creating a scenario.
          - paragraph [ref=e42]: No scenarios yet. Describe a task and how to verify success.
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import type { Page } from '@playwright/test';
  3   | import AxeBuilder from '@axe-core/playwright';
  4   | import { representativeProject } from '../fixtures/representativeProject';
  5   | import { sampleProject } from '../../src/domain';
  6   | import { defaultPrefs, emptyProject, createBackup } from '../../src/projectBackup';
  7   | import { manageResources } from '../../src/manageLocales';
  8   | 
  9   | const project=representativeProject();
  10  | const prefs={...defaultPrefs,dark:true,font:125,spacing:true,motion:true};
  11  | async function seed(page:Page,language='es-CO') {
  12  |   await page.addInitScript(({project,prefs,language})=>{
  13  |     if (!sessionStorage.getItem('management-test-seeded')) {
  14  |       localStorage.setItem('hci-lab-ia-project-v2',JSON.stringify(project));
  15  |       localStorage.setItem('hci-prefs-v2',JSON.stringify(prefs));
  16  |       localStorage.setItem('hci-language',language);
  17  |       sessionStorage.setItem('management-test-seeded','yes');
  18  |     }
  19  |   },{project,prefs,language});
  20  | }
  21  | const snapshot=(page:Page)=>page.evaluate(()=>({project:JSON.parse(localStorage.getItem('hci-lab-ia-project-v2')!),prefs:JSON.parse(localStorage.getItem('hci-prefs-v2')!),language:localStorage.getItem('hci-language')}));
  22  | async function open(page:Page,language:keyof typeof manageResources='es-CO') {
  23  |   await page.getByRole('button',{name:manageResources[language].title,exact:true}).click();
  24  |   await expect(page.getByRole('dialog')).toBeVisible();
  25  | }
  26  | async function reset(page:Page,language:keyof typeof manageResources='es-CO') {
  27  |   await open(page,language);
  28  |   await page.getByRole('button',{name:manageResources[language].reset,exact:true}).click();
  29  |   await page.getByRole('button',{name:manageResources[language].confirmReset,exact:true}).click();
  30  |   await expect(page.locator('[data-management-notice]')).toBeFocused();
  31  | }
  32  | async function upload(page:Page,content:string) {
  33  |   await page.locator('dialog input[type=file]').evaluate((node,content)=>{
  34  |     const input=node as HTMLInputElement, transfer=new DataTransfer();
  35  |     transfer.items.add(new File([content],'project.json',{type:'application/json'}));
  36  |     input.files=transfer.files;input.dispatchEvent(new Event('change',{bubbles:true}));
  37  |   },content);
  38  | }
  39  | 
  40  | test('management: cancel is unchanged; reset clears every collection and preferences across reload, preserving language',async({page})=>{
  41  |   await seed(page,'en-US');await page.goto('/hci-lab-ia/#/research');
  42  |   const before=await snapshot(page);
  43  |   await open(page,'en-US');await page.getByRole('button',{name:manageResources['en-US'].reset,exact:true}).click();
  44  |   await expect(page.getByRole('dialog')).toHaveAccessibleName(manageResources['en-US'].resetTitle);
  45  |   await expect(page.getByRole('dialog')).toHaveAccessibleDescription(manageResources['en-US'].resetWarning);
  46  |   await expect(page.getByRole('button',{name:manageResources['en-US'].cancel,exact:true})).toBeFocused();
  47  |   await page.keyboard.press('Enter');expect(await snapshot(page)).toEqual(before);
  48  |   await expect(page.getByRole('button',{name:manageResources['en-US'].title,exact:true})).toBeFocused();
  49  |   await reset(page,'en-US');
> 50  |   await expect(page.getByRole('status')).toHaveText(manageResources['en-US'].resetDone);
      |                                          ^ Error: expect(locator).toHaveText(expected) failed
  51  |   expect(await snapshot(page)).toEqual({project:emptyProject(),prefs:defaultPrefs,language:'en-US'});
  52  |   await page.reload();expect(await snapshot(page)).toEqual({project:emptyProject(),prefs:defaultPrefs,language:'en-US'});
  53  |   await expect(page.locator('main')).toHaveAttribute('lang','en-US');
  54  | });
  55  | 
  56  | test('management: export and recover all modules with settings; cancel and confirmation are transactional',async({page},testInfo)=>{
  57  |   await seed(page,'ca-ES');await page.goto('/hci-lab-ia/#/reports');const before=await snapshot(page);
  58  |   await open(page,'ca-ES');const downloadPromise=page.waitForEvent('download');
  59  |   await page.getByRole('button',{name:manageResources['ca-ES'].backup,exact:true}).click();
  60  |   const file=testInfo.outputPath('complete-project.json');await (await downloadPromise).saveAs(file);
  61  |   expect(await snapshot(page)).toEqual(before);await page.keyboard.press('Escape');
  62  |   await reset(page,'ca-ES');const cleared=await snapshot(page);
  63  |   await open(page,'ca-ES');await page.locator('dialog input[type=file]').setInputFiles(file);
  64  |   await expect(page.getByRole('button',{name:manageResources['ca-ES'].confirmRecover})).toBeVisible();
  65  |   await expect(page.getByRole('dialog')).toHaveAccessibleName(manageResources['ca-ES'].recoverTitle);
  66  |   await expect(page.getByRole('dialog')).toHaveAccessibleDescription(manageResources['ca-ES'].recoverWarning);
  67  |   expect(await snapshot(page)).toEqual(cleared);await page.keyboard.press('Escape');expect(await snapshot(page)).toEqual(cleared);
  68  |   await open(page,'ca-ES');await page.locator('dialog input[type=file]').setInputFiles(file);
  69  |   await page.getByRole('button',{name:manageResources['ca-ES'].confirmRecover}).click();
  70  |   await expect(page.locator('[data-management-notice]')).toHaveText(manageResources['ca-ES'].recoverDone);
  71  |   expect(await snapshot(page)).toEqual(before);await page.reload();expect(await snapshot(page)).toEqual(before);
  72  | });
  73  | 
  74  | test('management: rejects invalid JSON, incomplete structure, versions and nested fields without changes; recovers legacy v2',async({page})=>{
  75  |   await seed(page);await page.goto('/hci-lab-ia/');const before=await snapshot(page);await open(page);
  76  |   for (const content of ['{',JSON.stringify({version:2}),JSON.stringify({...project,version:9}),JSON.stringify({...project,pageSessions:[{id:'invalid'}]})]) {
  77  |     await upload(page,content);await expect(page.getByRole('alert')).toHaveText(manageResources['es-CO'].invalid);
  78  |     await expect(page.getByRole('button',{name:manageResources['es-CO'].confirmRecover})).toHaveCount(0);
  79  |     expect(await snapshot(page)).toEqual(before);
  80  |   }
  81  |   await upload(page,JSON.stringify(sampleProject));
  82  |   await expect(page.getByText(manageResources['es-CO'].legacyInfo)).toBeVisible();
  83  |   await expect(page.getByRole('button',{name:'Cancelar',exact:true})).toBeFocused();
  84  |   await page.keyboard.press('Tab');await expect(page.getByRole('button',{name:manageResources['es-CO'].confirmRecover})).toBeFocused();
  85  |   await page.keyboard.press('Enter');
  86  |   expect(await snapshot(page)).toEqual({project:{...emptyProject(),...sampleProject},prefs,language:'es-CO'});
  87  |   await page.reload();expect(await snapshot(page)).toEqual({project:{...emptyProject(),...sampleProject},prefs,language:'es-CO'});
  88  | });
  89  | 
  90  | test('management: translated dialog is accessible in six languages, themes and enlarged text',async({page},testInfo)=>{
  91  |   await page.goto('/hci-lab-ia/');
  92  |   for (const language of Object.keys(manageResources) as (keyof typeof manageResources)[]) {
  93  |     await page.locator('.language select').selectOption(language);
  94  |     for (const theme of ['light','dark','contrast']) {
  95  |       await page.evaluate(theme=>{document.documentElement.dataset.theme=theme==='dark'?'dark':'light';document.documentElement.dataset.contrast=String(theme==='contrast');},theme);
  96  |       await open(page,language);
  97  |       await expect(page.getByRole('button',{name:manageResources[language].close,exact:true})).toBeFocused();
  98  |       await expect(page.getByLabel(manageResources[language].file)).toBeVisible();
  99  |       if(language==='es-CO') await page.screenshot({path:testInfo.outputPath(`management-${theme}.png`)});
  100 |       const results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  101 |       expect(results.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)}))).toEqual([]);
  102 |       await page.keyboard.press('Escape');
  103 |     }
  104 |   }
  105 |   await page.locator('.language select').selectOption('es-CO');await open(page);
  106 |   await page.evaluate(()=>document.documentElement.style.fontSize='200%');
  107 |   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  108 |   await page.getByRole('button',{name:manageResources['es-CO'].reset,exact:true}).click();
  109 |   await expect(page.getByRole('button',{name:manageResources['es-CO'].confirmReset})).toBeInViewport();
  110 |   await page.screenshot({path:testInfo.outputPath('management-200.png'),fullPage:true});
  111 | });
  112 | 
  113 | test('management: replacing settings changes the language only after confirmation',async({page})=>{
  114 |   await seed(page);await page.goto('/hci-lab-ia/');await open(page);
  115 |   await upload(page,JSON.stringify(createBackup(project,defaultPrefs,'fr-FR')));
  116 |   await expect(page.locator('main')).toHaveAttribute('lang','es-CO');
  117 |   await page.getByRole('button',{name:manageResources['es-CO'].confirmRecover}).click();
  118 |   await expect(page.locator('[data-management-notice]')).toHaveText(manageResources['fr-FR'].recoverDone);
  119 |   await expect(page.locator('[data-management-notice]')).toBeFocused();
  120 |   await page.reload();expect((await snapshot(page)).language).toBe('fr-FR');
  121 | });
  122 | 
  123 | test('management: reset aborts active microphone and speech, clears forms and restarts simulated page capture',async({page})=>{
  124 |   await page.addInitScript(()=>{
  125 |     const w=window as unknown as {SpeechRecognition:unknown;micActive:boolean;micAborts:number;speechStops:number;recognition?:{onresult:unknown;onend:unknown;onerror:unknown}};
  126 |     w.micActive=false;w.micAborts=0;w.speechStops=0;
  127 |     w.SpeechRecognition=class {
  128 |       onresult=null;onend=null;onerror=null;
  129 |       start(){w.micActive=true;w.recognition=this;}
  130 |       abort(){w.micActive=false;w.micAborts++;}
  131 |     };
  132 |     Object.defineProperty(window.speechSynthesis,'cancel',{value:()=>w.speechStops++});
  133 |   });
  134 |   await page.goto('/hci-lab-ia/#/multimodal');
  135 |   await page.getByLabel('Comando (confirmar, cancelar, navegar)').fill('confirmar');
  136 |   await page.getByRole('button',{name:'Activar micrófono',exact:true}).click();
  137 |   expect(await page.evaluate(()=>(window as unknown as {micActive:boolean}).micActive)).toBe(true);
  138 |   await reset(page);
  139 |   expect(await page.evaluate(()=>{
  140 |     const w=window as unknown as {micActive:boolean;micAborts:number;speechStops:number;recognition:{onresult:unknown;onend:unknown;onerror:unknown}};
  141 |     return {active:w.micActive,aborted:w.micAborts>0,speechStopped:w.speechStops>0,handlers:[w.recognition.onresult,w.recognition.onend,w.recognition.onerror]};
  142 |   })).toEqual({active:false,aborted:true,speechStopped:true,handlers:[null,null,null]});
  143 |   await expect(page.getByLabel('Comando (confirmar, cancelar, navegar)')).toHaveValue('');
  144 |   await expect(page.getByRole('button',{name:'Activar micrófono',exact:true})).toBeEnabled();
  145 |   await page.getByRole('button',{name:'Seguimiento de página',exact:true}).click();
  146 |   const tracker=page.getByRole('complementary',{name:'Controles de seguimiento de la página'});
  147 |   await tracker.getByLabel('Participante',{exact:true}).fill('P01');await tracker.getByLabel('Tarea',{exact:true}).fill('Simular');
  148 |   await tracker.getByLabel('Recorrido simulado',{exact:true}).selectOption('F');
  149 |   await tracker.getByRole('button',{name:'Iniciar captura'}).click();
  150 |   await expect(tracker.getByRole('button',{name:'Detener captura'})).toBeEnabled();
```