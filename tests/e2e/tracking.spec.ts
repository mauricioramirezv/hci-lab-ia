import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('tracks clicks after scroll, pointer dwell, exports and persists a session', async ({page}) => {
  await page.goto('/hci-lab-ia/#/tracking');
  await expect(page.getByRole('heading',{name:'Seguimiento UX y mapas de calor'})).toBeVisible();
  await page.getByLabel('Tarea',{exact:true}).fill('Explorar el ejemplo');
  await page.getByRole('button',{name:'Iniciar captura',exact:true}).click();
  const pane=page.getByRole('region',{name:'Ejemplo para seguimiento'});
  await pane.locator('button',{hasText:'Ir al formulario'}).click();
  await page.getByLabel('Descripción ficticia (no se registra)',{exact:true}).fill('NO_GUARDAR_ESTE_TEXTO');
  await pane.getByRole('button',{name:'Confirmar solicitud',exact:true}).click();
  
  await page.getByRole('button',{name:'Iniciar recorrido',exact:true}).click();
  await pane.scrollIntoViewIfNeeded();
  const box=await pane.boundingBox();await page.mouse.move(box!.x+60,box!.y+70);
  await page.waitForTimeout(600);
  await expect(pane.locator('canvas')).toBeVisible();
  await page.getByRole('button',{name:'Detener captura',exact:true}).click();
  await page.getByLabel('Observación de la sesión').fill('Se comprendió el resultado del formulario.');
  await page.getByRole('button',{name:'Guardar sesión en proyecto'}).click();
  const state=await page.evaluate(()=>JSON.parse(localStorage.getItem('hci-lab-ia-project-v2')||'{}'));
  expect(state.pageSessions).toHaveLength(1);
  expect(state.pageSessions[0].clicks.some((p:{y:number})=>p.y>400)).toBe(true);
  expect(state.pageSessions[0].pointer.length).toBeGreaterThan(0);
  expect(state.pageSessions[0].gaze).toEqual([]);
  expect(JSON.stringify(state)).not.toContain('NO_GUARDAR_ESTE_TEXTO');
  expect(state.pageSessions[0].maxDepth).toBeGreaterThan(25);
  const download=page.waitForEvent('download');
  await page.getByRole('button',{name:'Descargar JSON'}).click();
  expect((await download).suggestedFilename()).toBe('hci-seguimiento-ux.json');
  await page.getByRole('button',{name:'Gestionar proyecto',exact:true}).click();
  const projectDownload=page.waitForEvent('download');
  await page.getByRole('button',{name:'Descargar respaldo JSON',exact:true}).click();
  expect((await projectDownload).suggestedFilename()).toBe('hci-lab-ia-project.json');
  await page.keyboard.press('Escape');
  await page.reload();await page.locator('#tracking-records-heading').click();await page.locator('#tracking-records-panel summary').first().click();await expect(page.getByText('Se comprendió el resultado del formulario.')).toBeVisible();
});
test('does not load camera without consent and does not collect after stopping', async ({page}) => {
  const external:string[]=[];page.on('request',request=>{if(request.url().includes('webgazer'))external.push(request.url());});
  await page.goto('/hci-lab-ia/#/tracking');
  await expect(page.getByRole('button',{name:'Activar cámara y calibrar'})).toBeDisabled();
  expect(external).toEqual([]);
  await page.getByLabel('Tarea',{exact:true}).fill('Explorar el ejemplo');
  await page.getByRole('button',{name:'Iniciar captura',exact:true}).click();
  const pane=page.getByRole('region',{name:'Ejemplo para seguimiento'});
  await pane.getByRole('button',{name:'Orientación UX',exact:true}).click();
  await page.getByRole('button',{name:'Detener captura',exact:true}).click();
  const count=await page.locator('#tracking-controls dl').textContent();
  await pane.getByRole('button',{name:'Orientación UX',exact:true}).click();
  expect(await page.locator('#tracking-controls dl').textContent()).toBe(count);
  const results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  expect(results.violations.filter(v=>['serious','critical'].includes(v.impact||''))).toEqual([]);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
});
test('wheel events and actual scroll are distinct measurements', async ({page}) => {
  await page.goto('/hci-lab-ia/#/tracking');
  await page.getByLabel('Tarea',{exact:true}).fill('Explorar el ejemplo');
  await page.getByRole('button',{name:'Iniciar captura',exact:true}).click();
  const pane=page.getByRole('region',{name:'Ejemplo para seguimiento'});
  await pane.scrollIntoViewIfNeeded();
  const box=await pane.boundingBox();await page.mouse.move(box!.x+80,box!.y+80);
  await page.mouse.wheel(0,350);await page.waitForTimeout(300);
  await expect(page.locator('#tracking-controls dl div').filter({has:page.getByText('Eventos de rueda',{exact:true})}).locator('dd')).not.toHaveText('0');
  await pane.focus();await page.keyboard.press('End');await page.waitForTimeout(300);
  await expect(page.locator('#tracking-controls dl div').filter({has:page.getByText('Profundidad visible máxima',{exact:true})}).locator('dd')).toHaveText('100.0%');
});
test('experimental camera adapter calibrates, validates separately and stops (mocked engine)', async ({page},testInfo) => {
  test.skip(testInfo.project.name.includes('mobile'),'Camera validation adapter is exercised on desktop; no real camera is used.');
  await page.addInitScript(() => {
    let listener: ((data:{x:number;y:number})=>void)|undefined;
    let timer: ReturnType<typeof setInterval>|undefined;
    const w=window as unknown as {webgazer:object;trainingCalls:number;automaticTrainingRemoved:boolean;cameraStopped:boolean};
    w.trainingCalls=0;w.automaticTrainingRemoved=false;w.cameraStopped=false;
    const api={params:{faceMeshSolutionPath:''},
      saveDataAcrossSessions:()=>api,clearData:async()=>{},setGazeListener:(cb:typeof listener)=>{listener=cb;return api;},clearGazeListener:()=>{listener=undefined;return api;},
      begin:async()=>{timer=setInterval(()=>{const target=document.querySelector('.tracking-target.validation')||document.querySelector('.tracking-viewport');if(target){const r=target.getBoundingClientRect();listener?.({x:r.left+r.width/2+10,y:r.top+r.height/2});}},40);return api;},
      end:()=>{if(timer)clearInterval(timer);w.cameraStopped=true;},removeMouseEventListeners:()=>{w.automaticTrainingRemoved=true;return api;},
      recordScreenPosition:()=>{w.trainingCalls++;return api;},showVideoPreview:()=>api,showPredictionPoints:()=>api,
    };w.webgazer=api;
  });
  await page.goto('/hci-lab-ia/#/tracking');
  await page.getByRole('checkbox',{name:/Acepto activar la cámara/}).check();
  await page.getByRole('button',{name:'Activar cámara y calibrar'}).click();
  for(let i=1;i<=9;i++)for(let j=0;j<5;j++)await page.getByRole('button',{name:`Punto ${i}, ${j} de 5`,exact:true}).click();
  await page.getByRole('button',{name:'Terminar calibración'}).click();
  await page.getByRole('button',{name:'Comprobar calibración',exact:true}).click();
  await expect(page.getByText(/Error mediano de validación \(px\): 10px/)).toBeVisible({timeout:18000});
  expect(await page.evaluate(()=>(window as unknown as {trainingCalls:number}).trainingCalls)).toBe(45);
  expect(await page.evaluate(()=>(window as unknown as {automaticTrainingRemoved:boolean}).automaticTrainingRemoved)).toBe(true);
  await page.getByLabel('Tarea',{exact:true}).fill('Explorar el ejemplo');
  await page.getByRole('button',{name:'Iniciar captura',exact:true}).click();
  await page.getByLabel('Modo de recorrido',{exact:true}).selectOption('F');
  await page.getByRole('button',{name:'Iniciar recorrido',exact:true}).click();
  await page.getByRole('region',{name:'Ejemplo para seguimiento'}).scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await expect.poll(async()=>Number(await page.locator('#tracking-controls dl div').filter({has:page.getByText('Duración (segundos)',{exact:true})}).locator('dd').textContent())).toBeGreaterThan(0);
  await page.getByRole('button',{name:'Detener captura',exact:true}).click();
  await page.getByLabel('Observación de la sesión').fill('Cámara probada con motor simulado.');
  await page.getByRole('button',{name:'Guardar sesión en proyecto'}).click();
  const state=await page.evaluate(()=>JSON.parse(localStorage.getItem('hci-lab-ia-project-v2')||'{}'));
  expect(state.pageSessions[0].gaze.length).toBeGreaterThan(0);expect(state.pageSessions[0].simulation.length).toBeGreaterThan(0);expect(state.pageSessions[0].validation.medianErrorPx).toBe(10);
  expect(await page.evaluate(()=>(window as unknown as {cameraStopped:boolean}).cameraStopped)).toBe(true);
});
