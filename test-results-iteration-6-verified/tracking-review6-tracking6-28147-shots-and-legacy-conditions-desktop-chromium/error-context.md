# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tracking-review6.spec.ts >> tracking6 review: focus, real weighted cursor, map screenshots and legacy conditions
- Location: tests\e2e\tracking-review6.spec.ts:3:1

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:4173/hci-lab-ia/#/tracking
Call log:
  - navigating to "http://127.0.0.1:4173/hci-lab-ia/#/tracking", waiting until "load"

```

# Test source

```ts
  1  | import {test,expect} from '@playwright/test';
  2  | import AxeBuilder from '@axe-core/playwright';
  3  | test('tracking6 review: focus, real weighted cursor, map screenshots and legacy conditions',async({page},info)=>{
> 4  |  await page.goto('/hci-lab-ia/#/tracking');await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:info.outputPath('preparar.png')});
     |             ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:4173/hci-lab-ia/#/tracking
  5  |  await page.getByLabel('Tarea',{exact:true}).fill('Recorrer el ejemplo');await page.getByRole('button',{name:'Iniciar captura',exact:true}).click();const pane=page.getByRole('region',{name:'Ejemplo para seguimiento'});await expect(pane).toBeFocused();
  6  |  await page.getByRole('button',{name:'Iniciar recorrido'}).click();await pane.scrollIntoViewIfNeeded();const r=await pane.boundingBox();await page.mouse.move(r!.x+60,r!.y+60);await page.waitForTimeout(650);await page.getByLabel('Capa del mapa').selectOption('pointer');await pane.scrollIntoViewIfNeeded();await pane.screenshot({path:info.outputPath('mapa-cursor.png')});
  7  |  await page.getByRole('button',{name:'Detener captura'}).click();await expect(page.getByLabel('Observación de la sesión')).toBeFocused();await page.getByLabel('Observación de la sesión').fill('Observación exportada antes de guardar.');const download=page.waitForEvent('download');await page.getByRole('button',{name:'Descargar JSON',exact:true}).click();const stream=await(await download).createReadStream();let body='';for await(const chunk of stream!)body+=chunk.toString();expect(JSON.parse(body).notes).toBe('Observación exportada antes de guardar.');await page.getByRole('button',{name:'Guardar sesión en proyecto'}).click();const s=await page.evaluate(()=>JSON.parse(localStorage.getItem('hci-lab-ia-project-v2')!).pageSessions[0]);expect(s.pointer.length).toBeGreaterThan(0);expect(s.pointer.every((p:{weight:number})=>p.weight>0&&p.weight<=1000)).toBe(true);expect(s.gaze).toEqual([]);
  8  |  const pngDownload=page.waitForEvent('download');await page.getByRole('button',{name:'Descargar mapa PNG'}).click();expect((await pngDownload).suggestedFilename()).toBe('hci-mapa-pointer.png');
  9  |  const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(axe.violations.map(v=>v.id)).toEqual([]);
  10 |  await page.getByRole('button',{name:'Preparar otra sesión'}).click();await page.getByLabel('Condición del ejemplo').selectOption('bad');await pane.scrollIntoViewIfNeeded();await expect(pane.getByRole('button',{name:'A',exact:true})).toBeVisible();await pane.screenshot({path:info.outputPath('antipatron.png')});
  11 |  await page.getByRole('button',{name:'Seguimiento de página'}).click();await expect(page.locator('#tracking-controls')).toBeFocused();await page.screenshot({path:info.outputPath('controles.png')});
  12 | });
  13 | 
```