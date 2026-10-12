# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tracking-camera6.spec.ts >> tracking6 camera: NotFoundError is explicit, no invented predictions (mock)
- Location: tests\e2e\tracking-camera6.spec.ts:6:67

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:4173/hci-lab-ia/#/tracking
Call log:
  - navigating to "http://127.0.0.1:4173/hci-lab-ia/#/tracking", waiting until "load"

```

# Test source

```ts
  1  | import {test,expect} from '@playwright/test';
  2  | import type {Page} from '@playwright/test';
  3  | import AxeBuilder from '@axe-core/playwright';
  4  | import {trackingResources} from '../../src/components/tracking/locales';
  5  | async function accept(page:Page){await page.getByRole('checkbox',{name:/Acepto activar la cámara/}).check();await page.getByRole('button',{name:'Activar cámara y calibrar'}).click();}
  6  | for(const outcome of ['NotAllowedError','NotFoundError'] as const)test(`tracking6 camera: ${outcome} is explicit, no invented predictions (mock)`,async({page})=>{
  7  |  await page.addInitScript(outcome=>{const api={params:{},saveDataAcrossSessions:()=>api,clearData:async()=>{},setGazeListener:()=>api,clearGazeListener:()=>api,end:()=>{},begin:async()=>{throw new DOMException('Camera error',outcome);}};(window as unknown as {webgazer:unknown}).webgazer=api;},outcome);
> 8  |  await page.goto('/hci-lab-ia/#/tracking');await accept(page);await expect(page.getByText(trackingResources['es-CO'][outcome==='NotAllowedError'?'denied':'unavailable'],{exact:true})).toBeVisible();await expect(page.getByText('Predicciones válidas: 0',{exact:true})).toBeVisible();await expect(page.locator('.tracking-calibration')).not.toBeVisible();
     |             ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:4173/hci-lab-ia/#/tracking
  9  | });
  10 | test('tracking6 camera: absent media API does not request the external estimator',async({page})=>{const requests:string[]=[];page.on('request',r=>{if(r.url().includes('webgazer'))requests.push(r.url());});await page.addInitScript(()=>Object.defineProperty(navigator,'mediaDevices',{value:undefined,configurable:true}));await page.goto('/hci-lab-ia/#/tracking');await accept(page);await expect(page.getByText(/Cámara no disponible/)).toBeVisible();expect(requests).toEqual([]);});
  11 | test('tracking6 camera: no valid predictions, validation stays unmeasured, close releases tracks (mock)',async({page})=>{
  12 |  test.setTimeout(45000);
  13 |  await page.addInitScript(()=>{const w=window as unknown as {webgazer:unknown;stopped:number;training:number};w.stopped=0;w.training=0;const api={params:{},saveDataAcrossSessions:()=>api,clearData:async()=>{},setGazeListener:()=>api,clearGazeListener:()=>api,removeMouseEventListeners:()=>api,recordScreenPosition:()=>{w.training++;return api;},showVideoPreview:()=>api,showPredictionPoints:()=>api,begin:async()=>{const v=document.createElement('video');v.id='webgazerVideoFeed';Object.defineProperty(v,'srcObject',{value:{getTracks:()=>[{stop:()=>w.stopped++}]}});document.body.append(v);return api;},end:()=>{}};w.webgazer=api;});
  14 |  await page.goto('/hci-lab-ia/#/tracking');await accept(page);const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(axe.violations.map(v=>v.id)).toEqual([]);
  15 |  for(let i=1;i<=9;i++)for(let j=0;j<5;j++)await page.getByRole('button',{name:`Punto ${i}, ${j} de 5`,exact:true}).click();await page.getByRole('button',{name:'Terminar calibración'}).click();await page.getByRole('button',{name:'Comprobar calibración',exact:true}).click();await expect(page.getByText(/Predicciones insuficientes en la validación/)).toBeVisible({timeout:18000});await expect(page.getByText('Predicciones válidas: 0',{exact:true})).toBeVisible();expect(await page.evaluate(()=>(window as unknown as {training:number}).training)).toBe(45);
  16 |  await page.getByRole('button',{name:'Recalibrar',exact:true}).click();await page.keyboard.press('Escape');await expect(page.locator('video[id^=webgazer]')).toHaveCount(0);expect(await page.evaluate(()=>(window as unknown as {stopped:number}).stopped)).toBe(1);await expect(page.getByRole('button',{name:'Activar cámara y calibrar'})).toBeEnabled();
  17 | });
  18 | test('tracking6 camera: preview and route exit release physical-resource adapter (mock)',async({page})=>{
  19 |  await page.addInitScript(()=>{const w=window as unknown as {webgazer:unknown;tracks:number;preview:boolean};w.tracks=0;w.preview=false;const api={params:{},saveDataAcrossSessions:()=>api,clearData:async()=>{},setGazeListener:()=>api,clearGazeListener:()=>api,removeMouseEventListeners:()=>api,recordScreenPosition:()=>api,showVideoPreview:(v:boolean)=>{w.preview=v;return api;},showPredictionPoints:()=>api,begin:async()=>{const v=document.createElement('video');v.id='webgazerVideoFeed';Object.defineProperty(v,'srcObject',{value:{getTracks:()=>[{stop:()=>w.tracks++}]}});document.body.append(v);return api;},end:()=>{}};w.webgazer=api;});
  20 |  await page.goto('/hci-lab-ia/#/tracking');await accept(page);for(let i=1;i<=9;i++)for(let j=0;j<5;j++)await page.getByRole('button',{name:`Punto ${i}, ${j} de 5`,exact:true}).click();await page.getByRole('button',{name:'Terminar calibración'}).click();await page.getByRole('checkbox',{name:'Mostrar vista previa de cámara'}).check();expect(await page.evaluate(()=>(window as unknown as {preview:boolean}).preview)).toBe(true);await page.evaluate(()=>location.hash='#/quality');await expect(page.locator('video[id^=webgazer]')).toHaveCount(0);expect(await page.evaluate(()=>(window as unknown as {tracks:number}).tracks)).toBe(1);
  21 | });
  22 | 
```