# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tracking-iteration6.spec.ts >> tracking6: exact clicks, keyboard, control exclusion, scrolling map and no form values
- Location: tests\e2e\tracking-iteration6.spec.ts:13:1

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
  4  | import {trackingLanguages,trackingResources} from '../../src/components/tracking/locales';
  5  | import {representativeProject} from '../fixtures/representativeProject';
  6  | const controls=(p:Page)=>p.locator('#tracking-controls');
  7  | const pane=(p:Page)=>p.getByRole('region',{name:'Ejemplo para seguimiento'});
  8  | const metric=(p:Page,label:string)=>controls(p).locator('dl div').filter({has:p.getByText(label,{exact:true})}).locator('dd');
  9  | async function start(page:Page){await page.getByLabel('Tarea',{exact:true}).fill('Explorar servicios');await page.getByRole('button',{name:'Iniciar captura',exact:true}).click();}
  10 | const stored=(p:Page)=>p.evaluate(()=>JSON.parse(localStorage.getItem('hci-lab-ia-project-v2')||'{}'));
  11 | test('tracking6: opening live textual results does not stop page capture on height growth',async({page})=>{await page.goto('/hci-lab-ia/#/tracking');await page.getByLabel('Contenido que se registra',{exact:true}).selectOption('page');await start(page);await page.locator('main h1').click();await page.getByText('Resumen textual de muestras por zona',{exact:true}).click();await page.waitForTimeout(450);await expect(page.getByRole('button',{name:'Detener captura'})).toBeEnabled();await expect(metric(page,'Clics / activaciones')).toHaveText('1');await page.getByRole('button',{name:'Detener captura'}).click();});
  12 | test('tracking6: viewport resize stops and discard really clears current samples',async({page})=>{await page.goto('/hci-lab-ia/#/tracking');await start(page);await pane(page).getByRole('button',{name:'Ir al formulario'}).click();await page.evaluate(()=>window.dispatchEvent(new Event('resize')));await expect(page.getByRole('button',{name:'Detener captura'})).toBeDisabled();await expect(controls(page).getByRole('status').first()).toContainText('tamaño');await expect(page.getByRole('checkbox',{name:'Mostrar mapa',exact:true})).toBeDisabled();await expect(pane(page).locator('canvas')).not.toBeVisible();await page.getByRole('button',{name:'Preparar otra sesión'}).click();await page.getByRole('button',{name:'Descartar sesión',exact:true}).click();await expect(page.getByRole('button',{name:'Iniciar captura'})).toBeEnabled();await expect(controls(page).locator('dl')).toHaveCount(0);expect((await stored(page)).pageSessions||[]).toEqual([]);});
  13 | test('tracking6: exact clicks, keyboard, control exclusion, scrolling map and no form values',async({page})=>{
> 14 |  await page.goto('/hci-lab-ia/#/tracking');await start(page);await expect(page.getByRole('button',{name:'Iniciar captura'})).toBeDisabled();
     |             ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:4173/hci-lab-ia/#/tracking
  15 |  await pane(page).getByRole('button',{name:'Ir al formulario'}).click();await expect(metric(page,'Clics / activaciones')).toHaveText('1');
  16 |  await page.getByRole('checkbox',{name:'Mostrar mapa',exact:true}).uncheck();await expect(metric(page,'Clics / activaciones')).toHaveText('1');await page.getByRole('checkbox',{name:'Mostrar mapa',exact:true}).check();
  17 |  await pane(page).getByLabel('Descripción ficticia (no se registra)').fill('NEVER_STORE_FORM_TEXT');
  18 |  const button=pane(page).getByRole('button',{name:'Confirmar solicitud',exact:true});await button.focus();await page.keyboard.press('Enter');await expect(metric(page,'Clics / activaciones')).toHaveText('2');
  19 |  await pane(page).scrollIntoViewIfNeeded();const before=await pane(page).locator('canvas').boundingBox();await pane(page).evaluate(el=>el.scrollTop+=180);await page.waitForTimeout(250);const after=await pane(page).locator('canvas').boundingBox();expect(after!.y-before!.y).toBeCloseTo(-180,0);
  20 |  expect(await pane(page).locator('canvas').evaluate(c=>Array.from((c as HTMLCanvasElement).getContext('2d')!.getImageData(0,0,(c as HTMLCanvasElement).width,(c as HTMLCanvasElement).height).data).some((v,i)=>i%4===3&&v>0))).toBe(true);
  21 |  await page.getByRole('button',{name:'Detener captura'}).click();await page.getByLabel('Observación de la sesión').fill('Resultado observado');await page.getByRole('button',{name:'Guardar sesión en proyecto'}).click();await expect(controls(page).getByRole('status').first()).toContainText('guardada');
  22 |  const s=(await stored(page)).pageSessions[0];expect(s.clickCount).toBe(2);expect(s.clicks).toHaveLength(2);expect(s.clicks[1].source).toBe('keyboard');expect(s.clicks[1].y).toBeGreaterThan(400);expect(s.clicks.every((v:{route:string;area:string})=>v.route==='/tracking'&&!!v.area)).toBe(true);expect(JSON.stringify(s)).not.toContain('NEVER_STORE_FORM_TEXT');
  23 |  const beforeReload=await stored(page);await page.reload();expect(await stored(page)).toEqual(beforeReload);
  24 | });
  25 | test('tracking6: wheel without movement, effective scroll and maximum depth',async({page})=>{
  26 |  await page.goto('/hci-lab-ia/#/tracking');await start(page);await pane(page).evaluate(el=>el.dispatchEvent(new WheelEvent('wheel',{deltaY:-100,bubbles:true})));await expect(metric(page,'Eventos de rueda')).toHaveText('1');await expect(metric(page,'Desplazamientos efectivos')).toHaveText('0');
  27 |  await pane(page).focus();await page.keyboard.press('End');await expect(metric(page,'Profundidad visible máxima')).toHaveText('100.0%');await expect(metric(page,'Desplazamientos efectivos')).not.toHaveText('0');
  28 | });
  29 | test('tracking6: simulation pause, resume, mode changes and cancel discard',async({page})=>{
  30 |  await page.goto('/hci-lab-ia/#/tracking');await start(page);await page.getByLabel('Modo de recorrido',{exact:true}).selectOption('F');await page.getByRole('button',{name:'Iniciar recorrido',exact:true}).click();await pane(page).scrollIntoViewIfNeeded();await page.waitForTimeout(650);await page.getByRole('button',{name:'Pausar recorrido'}).click();
  31 |  await page.getByLabel('Capa del mapa').selectOption('simulation');const count=await controls(page).getByText(/Muestras de la capa:/).textContent();expect(count).not.toContain(': 0');await page.waitForTimeout(400);expect(await controls(page).getByText(/Muestras de la capa:/).textContent()).toBe(count);
  32 |  await page.getByLabel('Modo de recorrido').selectOption('Gutenberg');await page.getByRole('button',{name:'Continuar recorrido'}).click();await pane(page).scrollIntoViewIfNeeded();await page.waitForTimeout(650);await page.getByRole('button',{name:'Detener recorrido'}).click();await page.getByRole('button',{name:'Preparar otra sesión'}).click();await page.getByRole('button',{name:'Cancelar',exact:true}).click();await expect(page.getByRole('button',{name:'Detener captura'})).toBeEnabled();
  33 |  await page.getByRole('button',{name:'Detener captura'}).click();await page.getByRole('button',{name:'Guardar sesión en proyecto'}).click();const s=(await stored(page)).pageSessions[0];expect(s.simulation.some((p:{source:string})=>p.source==='simulated-F')).toBe(true);expect(s.simulation.some((p:{source:string})=>p.source==='simulated-Gutenberg')).toBe(true);expect(s.pointer).toEqual([]);expect(s.gaze).toEqual([]);expect(s.modeChanges.map((m:{mode:string})=>m.mode)).toEqual(['cursor','F','Gutenberg']);
  34 | });
  35 | test('tracking6: page geometry, growing results, route stops and shared controls',async({page})=>{
  36 |  await page.goto('/hci-lab-ia/#/quality');await page.getByRole('button',{name:'Seguimiento de página'}).click();await start(page);await page.getByRole('button',{name:'Seguimiento de página'}).click();await page.locator('main h1').click();
  37 |  await page.evaluate(()=>{const p=document.createElement('p');p.textContent='New results';p.style.height='600px';document.querySelector('main')!.append(p);});await page.waitForTimeout(450);await page.getByRole('button',{name:'Seguimiento de página'}).click();await expect(page.getByRole('button',{name:'Detener captura'})).toBeEnabled();await expect(metric(page,'Clics / activaciones')).toHaveText('1');
  38 |  await page.evaluate(()=>{location.hash='#/tracking';});await expect(page.locator('main')).toBeFocused();await expect(page.getByRole('button',{name:'Detener captura'})).toBeDisabled();await expect(controls(page).getByRole('status').first()).toContainText('ruta');await expect(page.locator('#tracking-controls')).toHaveCount(1);await expect(page.locator('.tracking-document-overlay')).toHaveCount(0);
  39 |  await page.getByRole('button',{name:'Guardar sesión en proyecto'}).click();expect((await stored(page)).pageSessions[0].route).toBe('/quality');
  40 | });
  41 | test('tracking6: backup recovery, reset, reports and JSON/CSV',async({page},info)=>{
  42 |  await page.addInitScript(project=>{if(!sessionStorage.getItem('tracking6-seed')){localStorage.setItem('hci-lab-ia-project-v2',JSON.stringify(project));sessionStorage.setItem('tracking6-seed','yes');}},representativeProject());
  43 |  await page.goto('/hci-lab-ia/#/tracking');await start(page);await pane(page).getByRole('button',{name:'Ir al formulario'}).click();await page.getByRole('button',{name:'Detener captura'}).click();await page.getByLabel('Observación de la sesión').fill('New tracking evidence');await page.getByRole('button',{name:'Guardar sesión en proyecto'}).click();const before=await stored(page);
  44 |  for(const [label,name]of [['Descargar JSON','hci-seguimiento-ux.json'],['Descargar CSV','hci-seguimiento-ux.csv']]){const promise=page.waitForEvent('download');await page.getByRole('button',{name:label,exact:true}).first().click();expect((await promise).suggestedFilename()).toBe(name);}
  45 |  await page.getByRole('button',{name:'Gestionar proyecto'}).click();const backup=page.waitForEvent('download');await page.getByRole('button',{name:'Descargar respaldo JSON'}).click();const file=info.outputPath('tracking-project.json');await(await backup).saveAs(file);await page.getByRole('button',{name:'Restablecer proyecto',exact:true}).click();await page.getByRole('button',{name:'Borrar datos y restablecer'}).click();await page.reload();expect((await stored(page)).pageSessions).toEqual([]);expect((await stored(page)).trackingSessions).toEqual([]);
  46 |  await page.getByRole('button',{name:'Gestionar proyecto'}).click();await page.locator('dialog input[type=file]').setInputFiles(file);await page.getByRole('button',{name:'Reemplazar y recuperar',exact:true}).click();expect(await stored(page)).toEqual(before);await page.evaluate(()=>location.hash='#/reports');await page.getByRole('heading',{name:/Sesiones guardadas/}).locator('..').locator('summary').first().click();await expect(page.getByText('New tracking evidence',{exact:true})).toBeVisible();
  47 | });
  48 | test('tracking6: six languages, both conditions, themes, focus, responsive axe',async({page},info)=>{
  49 |  await page.goto('/hci-lab-ia/#/tracking');for(const lang of trackingLanguages){const r=trackingResources[lang];await page.locator('.language select').selectOption(lang);await expect(page.getByRole('heading',{name:r.title,exact:true})).toBeVisible();await expect(page.getByRole('button',{name:r.cameraStart})).toBeDisabled();await page.getByLabel(r.task,{exact:true}).fill('USER_TEXT');await page.getByLabel(r.condition,{exact:true}).selectOption('bad');await expect(page.getByText(r.badHelp,{exact:true})).toBeVisible();await page.getByLabel(r.condition,{exact:true}).selectOption('good');await expect(page.getByLabel(r.task,{exact:true})).toHaveValue('USER_TEXT');}
  50 |  await page.locator('.language select').selectOption('es-CO');for(const [theme,contrast]of [['light','false'],['dark','false'],['light','true'],['dark','true']]){await page.evaluate(([theme,contrast])=>{document.documentElement.dataset.theme=theme;document.documentElement.dataset.contrast=contrast;},[theme,contrast]);const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(axe.violations.map(v=>({id:v.id,target:v.nodes.map(n=>n.target)}))).toEqual([]);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);await page.screenshot({path:info.outputPath(`tracking-${theme}-${contrast}.png`),fullPage:true});}
  51 |  await page.getByRole('button',{name:'Seguimiento de página'}).click();await expect(controls(page)).toBeFocused();await page.keyboard.press('Tab');expect(await page.evaluate(()=>document.activeElement?.matches('select'))).toBe(true);
  52 | });
  53 | 
```