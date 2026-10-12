# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tracking.spec.ts >> tracks clicks after scroll, pointer dwell, exports and persists a session
- Location: tests\e2e\tracking.spec.ts:3:1

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:4173/hci-lab-ia/#/tracking
Call log:
  - navigating to "http://127.0.0.1:4173/hci-lab-ia/#/tracking", waiting until "load"

```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import AxeBuilder from '@axe-core/playwright';
  3   | test('tracks clicks after scroll, pointer dwell, exports and persists a session', async ({page}) => {
> 4   |   await page.goto('/hci-lab-ia/#/tracking');
      |              ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:4173/hci-lab-ia/#/tracking
  5   |   await expect(page.getByRole('heading',{name:'Seguimiento UX y mapas de calor'})).toBeVisible();
  6   |   await page.getByLabel('Tarea',{exact:true}).fill('Explorar el ejemplo');
  7   |   await page.getByRole('button',{name:'Iniciar captura',exact:true}).click();
  8   |   const pane=page.getByRole('region',{name:'Ejemplo para seguimiento'});
  9   |   await pane.locator('button',{hasText:'Ir al formulario'}).click();
  10  |   await page.getByLabel('Descripción ficticia (no se registra)',{exact:true}).fill('NO_GUARDAR_ESTE_TEXTO');
  11  |   await pane.getByRole('button',{name:'Confirmar solicitud',exact:true}).click();
  12  |   
  13  |   await page.getByRole('button',{name:'Iniciar recorrido',exact:true}).click();
  14  |   await pane.scrollIntoViewIfNeeded();
  15  |   const box=await pane.boundingBox();await page.mouse.move(box!.x+60,box!.y+70);
  16  |   await page.waitForTimeout(600);
  17  |   await expect(pane.locator('canvas')).toBeVisible();
  18  |   await page.getByRole('button',{name:'Detener captura',exact:true}).click();
  19  |   await page.getByLabel('Observación de la sesión').fill('Se comprendió el resultado del formulario.');
  20  |   await page.getByRole('button',{name:'Guardar sesión en proyecto'}).click();
  21  |   const state=await page.evaluate(()=>JSON.parse(localStorage.getItem('hci-lab-ia-project-v2')||'{}'));
  22  |   expect(state.pageSessions).toHaveLength(1);
  23  |   expect(state.pageSessions[0].clicks.some((p:{y:number})=>p.y>400)).toBe(true);
  24  |   expect(state.pageSessions[0].pointer.length).toBeGreaterThan(0);
  25  |   expect(state.pageSessions[0].gaze).toEqual([]);
  26  |   expect(JSON.stringify(state)).not.toContain('NO_GUARDAR_ESTE_TEXTO');
  27  |   expect(state.pageSessions[0].maxDepth).toBeGreaterThan(25);
  28  |   const download=page.waitForEvent('download');
  29  |   await page.getByRole('button',{name:'Descargar JSON'}).click();
  30  |   expect((await download).suggestedFilename()).toBe('hci-seguimiento-ux.json');
  31  |   await page.getByRole('button',{name:'Gestionar proyecto',exact:true}).click();
  32  |   const projectDownload=page.waitForEvent('download');
  33  |   await page.getByRole('button',{name:'Descargar respaldo JSON',exact:true}).click();
  34  |   expect((await projectDownload).suggestedFilename()).toBe('hci-lab-ia-project.json');
  35  |   await page.keyboard.press('Escape');
  36  |   await page.reload();await page.getByRole('heading',{name:'Sesiones guardadas · 1'}).locator('..').locator('summary').first().click();await expect(page.getByText('Se comprendió el resultado del formulario.')).toBeVisible();
  37  | });
  38  | test('does not load camera without consent and does not collect after stopping', async ({page}) => {
  39  |   const external:string[]=[];page.on('request',request=>{if(request.url().includes('webgazer'))external.push(request.url());});
  40  |   await page.goto('/hci-lab-ia/#/tracking');
  41  |   await expect(page.getByRole('button',{name:'Activar cámara y calibrar'})).toBeDisabled();
  42  |   expect(external).toEqual([]);
  43  |   await page.getByLabel('Tarea',{exact:true}).fill('Explorar el ejemplo');
  44  |   await page.getByRole('button',{name:'Iniciar captura',exact:true}).click();
  45  |   const pane=page.getByRole('region',{name:'Ejemplo para seguimiento'});
  46  |   await pane.getByRole('button',{name:'Orientación UX',exact:true}).click();
  47  |   await page.getByRole('button',{name:'Detener captura',exact:true}).click();
  48  |   const count=await page.locator('#tracking-controls dl').textContent();
  49  |   await pane.getByRole('button',{name:'Orientación UX',exact:true}).click();
  50  |   expect(await page.locator('#tracking-controls dl').textContent()).toBe(count);
  51  |   const results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  52  |   expect(results.violations.filter(v=>['serious','critical'].includes(v.impact||''))).toEqual([]);
  53  |   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
  54  | });
  55  | test('wheel events and actual scroll are distinct measurements', async ({page}) => {
  56  |   await page.goto('/hci-lab-ia/#/tracking');
  57  |   await page.getByLabel('Tarea',{exact:true}).fill('Explorar el ejemplo');
  58  |   await page.getByRole('button',{name:'Iniciar captura',exact:true}).click();
  59  |   const pane=page.getByRole('region',{name:'Ejemplo para seguimiento'});
  60  |   await pane.scrollIntoViewIfNeeded();
  61  |   const box=await pane.boundingBox();await page.mouse.move(box!.x+80,box!.y+80);
  62  |   await page.mouse.wheel(0,350);await page.waitForTimeout(300);
  63  |   await expect(page.locator('#tracking-controls dl div').filter({has:page.getByText('Eventos de rueda',{exact:true})}).locator('dd')).not.toHaveText('0');
  64  |   await pane.focus();await page.keyboard.press('End');await page.waitForTimeout(300);
  65  |   await expect(page.locator('#tracking-controls dl div').filter({has:page.getByText('Profundidad visible máxima',{exact:true})}).locator('dd')).toHaveText('100.0%');
  66  | });
  67  | test('experimental camera adapter calibrates, validates separately and stops (mocked engine)', async ({page},testInfo) => {
  68  |   test.skip(testInfo.project.name.includes('mobile'),'Camera validation adapter is exercised on desktop; no real camera is used.');
  69  |   await page.addInitScript(() => {
  70  |     let listener: ((data:{x:number;y:number})=>void)|undefined;
  71  |     let timer: ReturnType<typeof setInterval>|undefined;
  72  |     const w=window as unknown as {webgazer:object;trainingCalls:number;automaticTrainingRemoved:boolean;cameraStopped:boolean};
  73  |     w.trainingCalls=0;w.automaticTrainingRemoved=false;w.cameraStopped=false;
  74  |     const api={params:{faceMeshSolutionPath:''},
  75  |       saveDataAcrossSessions:()=>api,clearData:async()=>{},setGazeListener:(cb:typeof listener)=>{listener=cb;return api;},clearGazeListener:()=>{listener=undefined;return api;},
  76  |       begin:async()=>{timer=setInterval(()=>{const target=document.querySelector('.tracking-target.validation')||document.querySelector('.tracking-viewport');if(target){const r=target.getBoundingClientRect();listener?.({x:r.left+r.width/2+10,y:r.top+r.height/2});}},40);return api;},
  77  |       end:()=>{if(timer)clearInterval(timer);w.cameraStopped=true;},removeMouseEventListeners:()=>{w.automaticTrainingRemoved=true;return api;},
  78  |       recordScreenPosition:()=>{w.trainingCalls++;return api;},showVideoPreview:()=>api,showPredictionPoints:()=>api,
  79  |     };w.webgazer=api;
  80  |   });
  81  |   await page.goto('/hci-lab-ia/#/tracking');
  82  |   await page.getByRole('checkbox',{name:/Acepto activar la cámara/}).check();
  83  |   await page.getByRole('button',{name:'Activar cámara y calibrar'}).click();
  84  |   for(let i=1;i<=9;i++)for(let j=0;j<5;j++)await page.getByRole('button',{name:`Punto ${i}, ${j} de 5`,exact:true}).click();
  85  |   await page.getByRole('button',{name:'Terminar calibración'}).click();
  86  |   await page.getByRole('button',{name:'Comprobar calibración',exact:true}).click();
  87  |   await expect(page.getByText(/Error mediano de validación \(px\): 10px/)).toBeVisible({timeout:18000});
  88  |   expect(await page.evaluate(()=>(window as unknown as {trainingCalls:number}).trainingCalls)).toBe(45);
  89  |   expect(await page.evaluate(()=>(window as unknown as {automaticTrainingRemoved:boolean}).automaticTrainingRemoved)).toBe(true);
  90  |   await page.getByLabel('Tarea',{exact:true}).fill('Explorar el ejemplo');
  91  |   await page.getByRole('button',{name:'Iniciar captura',exact:true}).click();
  92  |   await page.getByLabel('Modo de recorrido',{exact:true}).selectOption('F');
  93  |   await page.getByRole('button',{name:'Iniciar recorrido',exact:true}).click();
  94  |   await page.getByRole('region',{name:'Ejemplo para seguimiento'}).scrollIntoViewIfNeeded();
  95  |   await page.waitForTimeout(500);
  96  |   await expect.poll(async()=>Number(await page.locator('#tracking-controls dl div').filter({has:page.getByText('Duración (segundos)',{exact:true})}).locator('dd').textContent())).toBeGreaterThan(0);
  97  |   await page.getByRole('button',{name:'Detener captura',exact:true}).click();
  98  |   await page.getByLabel('Observación de la sesión').fill('Cámara probada con motor simulado.');
  99  |   await page.getByRole('button',{name:'Guardar sesión en proyecto'}).click();
  100 |   const state=await page.evaluate(()=>JSON.parse(localStorage.getItem('hci-lab-ia-project-v2')||'{}'));
  101 |   expect(state.pageSessions[0].gaze.length).toBeGreaterThan(0);expect(state.pageSessions[0].simulation.length).toBeGreaterThan(0);expect(state.pageSessions[0].validation.medianErrorPx).toBe(10);
  102 |   expect(await page.evaluate(()=>(window as unknown as {cameraStopped:boolean}).cameraStopped)).toBe(true);
  103 | });
  104 | 
```