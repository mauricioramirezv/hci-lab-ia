import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { representativeProject } from '../fixtures/representativeProject';
import { sampleProject } from '../../src/features/project/domain';
import {defaultPrefs} from '../../src/features/project/domain';
import {emptyProject,createBackup} from '../../src/features/project/domain';
import { manageResources } from '../../src/features/project/locales';

const project=representativeProject();
const prefs={...defaultPrefs,dark:true,font:125,spacing:true,motion:true};
async function seed(page:Page,language='es-CO') {
  await page.addInitScript(({project,prefs,language})=>{
    if (!sessionStorage.getItem('management-test-seeded')) {
      localStorage.setItem('hci-lab-ia-project-v2',JSON.stringify(project));
      localStorage.setItem('hci-prefs-v2',JSON.stringify(prefs));
      localStorage.setItem('hci-language',language);
      sessionStorage.setItem('management-test-seeded','yes');
    }
  },{project,prefs,language});
}
const snapshot=(page:Page)=>page.evaluate(()=>({project:JSON.parse(localStorage.getItem('hci-lab-ia-project-v2')!),prefs:JSON.parse(localStorage.getItem('hci-prefs-v2')!),language:localStorage.getItem('hci-language')}));
async function open(page:Page,language:keyof typeof manageResources='es-CO') {
  await page.getByRole('button',{name:manageResources[language].title,exact:true}).click();
  await expect(page.getByRole('dialog')).toBeVisible();
}
async function reset(page:Page,language:keyof typeof manageResources='es-CO') {
  await open(page,language);
  await page.getByRole('button',{name:manageResources[language].reset,exact:true}).click();
  await page.getByRole('button',{name:manageResources[language].confirmReset,exact:true}).click();
  await expect(page.locator('[data-management-notice]')).toBeFocused();
}
async function upload(page:Page,content:string) {
  await page.locator('dialog input[type=file]').evaluate((node,content)=>{
    const input=node as HTMLInputElement, transfer=new DataTransfer();
    transfer.items.add(new File([content],'project.json',{type:'application/json'}));
    input.files=transfer.files;input.dispatchEvent(new Event('change',{bubbles:true}));
  },content);
}

test('management: cancel is unchanged; reset clears every collection and preferences across reload, preserving language',async({page})=>{
  await seed(page,'en-US');await page.goto('/hci-lab-ia/#/research');
  const before=await snapshot(page);
  await open(page,'en-US');await page.getByRole('button',{name:manageResources['en-US'].reset,exact:true}).click();
  await expect(page.getByRole('dialog')).toHaveAccessibleName(manageResources['en-US'].resetTitle);
  await expect(page.getByRole('dialog')).toHaveAccessibleDescription(manageResources['en-US'].resetWarning);
  await expect(page.getByRole('button',{name:manageResources['en-US'].cancel,exact:true})).toBeFocused();
  await page.keyboard.press('Enter');expect(await snapshot(page)).toEqual(before);
  await expect(page.getByRole('button',{name:manageResources['en-US'].title,exact:true})).toBeFocused();
  await reset(page,'en-US');
  await expect(page.locator('[data-management-notice]')).toHaveText(manageResources['en-US'].resetDone);
  expect(await snapshot(page)).toEqual({project:emptyProject(),prefs:defaultPrefs,language:'en-US'});
  await page.reload();expect(await snapshot(page)).toEqual({project:emptyProject(),prefs:defaultPrefs,language:'en-US'});
  await expect(page.locator('main')).toHaveAttribute('lang','en-US');
});

test('management: export and recover all modules with settings; cancel and confirmation are transactional',async({page},testInfo)=>{
  await seed(page,'ca-ES');await page.goto('/hci-lab-ia/#/reports');const before=await snapshot(page);
  await open(page,'ca-ES');const downloadPromise=page.waitForEvent('download');
  await page.getByRole('button',{name:manageResources['ca-ES'].backup,exact:true}).click();
  const file=testInfo.outputPath('complete-project.json');await (await downloadPromise).saveAs(file);
  expect(await snapshot(page)).toEqual(before);await page.keyboard.press('Escape');
  await reset(page,'ca-ES');const cleared=await snapshot(page);
  await open(page,'ca-ES');await page.locator('dialog input[type=file]').setInputFiles(file);
  await expect(page.getByRole('button',{name:manageResources['ca-ES'].confirmRecover})).toBeVisible();
  await expect(page.getByRole('dialog')).toHaveAccessibleName(manageResources['ca-ES'].recoverTitle);
  await expect(page.getByRole('dialog')).toHaveAccessibleDescription(manageResources['ca-ES'].recoverWarning);
  expect(await snapshot(page)).toEqual(cleared);await page.keyboard.press('Escape');expect(await snapshot(page)).toEqual(cleared);
  await open(page,'ca-ES');await page.locator('dialog input[type=file]').setInputFiles(file);
  await page.getByRole('button',{name:manageResources['ca-ES'].confirmRecover}).click();
  await expect(page.locator('[data-management-notice]')).toHaveText(manageResources['ca-ES'].recoverDone);
  expect(await snapshot(page)).toEqual(before);await page.reload();expect(await snapshot(page)).toEqual(before);
});

test('management: rejects invalid JSON, incomplete structure, versions and nested fields without changes; recovers legacy v2',async({page})=>{
  await seed(page);await page.goto('/hci-lab-ia/');const before=await snapshot(page);await open(page);
  for (const content of ['{',JSON.stringify({version:2}),JSON.stringify({...project,version:9}),JSON.stringify({...project,pageSessions:[{id:'invalid'}]})]) {
    await upload(page,content);await expect(page.getByRole('alert')).toHaveText(manageResources['es-CO'].invalid);
    await expect(page.getByRole('button',{name:manageResources['es-CO'].confirmRecover})).toHaveCount(0);
    expect(await snapshot(page)).toEqual(before);
  }
  await upload(page,JSON.stringify(sampleProject));
  await expect(page.getByText(manageResources['es-CO'].legacyInfo)).toBeVisible();
  await expect(page.getByRole('button',{name:'Cancelar',exact:true})).toBeFocused();
  await page.keyboard.press('Tab');await expect(page.getByRole('button',{name:manageResources['es-CO'].confirmRecover})).toBeFocused();
  await page.keyboard.press('Enter');
  expect(await snapshot(page)).toEqual({project:{...emptyProject(),...sampleProject},prefs,language:'es-CO'});
  await page.reload();expect(await snapshot(page)).toEqual({project:{...emptyProject(),...sampleProject},prefs,language:'es-CO'});
});

test('management: translated dialog is accessible in six languages, themes and enlarged text',async({page},testInfo)=>{
  await page.goto('/hci-lab-ia/');
  for (const language of Object.keys(manageResources) as (keyof typeof manageResources)[]) {
    await page.locator('.language select').selectOption(language);
    for (const theme of ['light','dark','contrast']) {
      await page.evaluate(theme=>{document.documentElement.dataset.theme=theme==='dark'?'dark':'light';document.documentElement.dataset.contrast=String(theme==='contrast');},theme);
      await open(page,language);
      await expect(page.getByRole('button',{name:manageResources[language].close,exact:true})).toBeFocused();
      await expect(page.getByLabel(manageResources[language].file)).toBeVisible();
      if(language==='es-CO') await page.screenshot({path:testInfo.outputPath(`management-${theme}.png`)});
      const results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
      expect(results.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)}))).toEqual([]);
      await page.keyboard.press('Escape');
    }
  }
  await page.locator('.language select').selectOption('es-CO');await open(page);
  await page.evaluate(()=>document.documentElement.style.fontSize='200%');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  await page.getByRole('button',{name:manageResources['es-CO'].reset,exact:true}).click();
  await expect(page.getByRole('button',{name:manageResources['es-CO'].confirmReset})).toBeInViewport();
  await page.screenshot({path:testInfo.outputPath('management-200.png'),fullPage:true});
});

test('management: replacing settings changes the language only after confirmation',async({page})=>{
  await seed(page);await page.goto('/hci-lab-ia/');await open(page);
  await upload(page,JSON.stringify(createBackup(project,defaultPrefs,'fr-FR')));
  await expect(page.locator('main')).toHaveAttribute('lang','es-CO');
  await page.getByRole('button',{name:manageResources['es-CO'].confirmRecover}).click();
  await expect(page.locator('[data-management-notice]')).toHaveText(manageResources['fr-FR'].recoverDone);
  await expect(page.locator('[data-management-notice]')).toBeFocused();
  await page.reload();expect((await snapshot(page)).language).toBe('fr-FR');
});

test('management: reset aborts active microphone and speech, clears forms and restarts simulated page capture',async({page})=>{
  await page.addInitScript(()=>{
    const w=window as unknown as {SpeechRecognition:unknown;micActive:boolean;micAborts:number;speechStops:number;recognition?:{onresult:unknown;onend:unknown;onerror:unknown}};
    w.micActive=false;w.micAborts=0;w.speechStops=0;
    w.SpeechRecognition=class {
      onresult=null;onend=null;onerror=null;
      start(){w.micActive=true;w.recognition=this;}
      abort(){w.micActive=false;w.micAborts++;}
    };
    Object.defineProperty(window.speechSynthesis,'cancel',{value:()=>w.speechStops++});
  });
  await page.goto('/hci-lab-ia/#/multimodal');
  await page.getByLabel('Comando (confirmar, cancelar, navegar)').fill('confirmar');
  await page.getByRole('button',{name:'Activar micrófono',exact:true}).click();
  expect(await page.evaluate(()=>(window as unknown as {micActive:boolean}).micActive)).toBe(true);
  await reset(page);
  expect(await page.evaluate(()=>{
    const w=window as unknown as {micActive:boolean;micAborts:number;speechStops:number;recognition:{onresult:unknown;onend:unknown;onerror:unknown}};
    return {active:w.micActive,aborted:w.micAborts>0,speechStopped:w.speechStops>0,handlers:[w.recognition.onresult,w.recognition.onend,w.recognition.onerror]};
  })).toEqual({active:false,aborted:true,speechStopped:true,handlers:[null,null,null]});
  await expect(page.getByLabel('Comando (confirmar, cancelar, navegar)')).toHaveValue('');
  await expect(page.getByRole('button',{name:'Activar micrófono',exact:true})).toBeEnabled();
  await page.getByRole('button',{name:'Seguimiento de página',exact:true}).click();
  const tracker=page.locator('.page-tracker');
  await tracker.getByLabel('Alias (opcional)',{exact:true}).fill('P01');await tracker.getByLabel('Tarea',{exact:true}).fill('Simular');
  await tracker.getByLabel('Modo de recorrido',{exact:true}).selectOption('F');
  await tracker.getByRole('button',{name:'Iniciar captura'}).click();await tracker.getByRole('button',{name:'Iniciar recorrido',exact:true}).click();
  await expect(tracker.getByRole('button',{name:'Detener captura'})).toBeEnabled();
  await tracker.getByRole('button',{name:'Seguimiento de página'}).click();
  await reset(page);await page.getByRole('button',{name:'Seguimiento de página',exact:true}).click();
  await expect(tracker.getByLabel('Alias (opcional)',{exact:true})).toHaveValue('');
  await expect(tracker.getByLabel('Tarea',{exact:true})).toHaveValue('');
  await expect(tracker.getByRole('button',{name:'Iniciar captura'})).toBeEnabled();
  await expect(tracker.getByRole('button',{name:'Detener captura'})).toBeDisabled();
  await expect(tracker.getByRole('button',{name:'Descargar JSON',exact:true})).toHaveCount(0);
  await expect(tracker.getByText('Listo. Prepare una sesión para registrar el contenido elegido.')).toBeVisible();
  await page.waitForTimeout(1200);expect((await snapshot(page)).project).toEqual(emptyProject());
});

test('management: reset stops camera engine, releases video tracks and pending camera start',async({page})=>{
  await page.addInitScript(()=>{
    const w=window as unknown as {webgazer:object;cameraStarts:number;cameraStops:number;trackStops:number;clears:number;resolveCamera?:()=>void;blockNextClear?:boolean;resolveClear?:()=>void};
    w.cameraStarts=0;w.cameraStops=0;w.trackStops=0;w.clears=0;
    const api={params:{faceMeshSolutionPath:''},saveDataAcrossSessions:()=>api,clearData:async()=>{w.clears++;if(w.blockNextClear){w.blockNextClear=false;await new Promise<void>(resolve=>{w.resolveClear=resolve;});}},
      setGazeListener:()=>api,clearGazeListener:()=>api,removeMouseEventListeners:()=>api,recordScreenPosition:()=>api,showVideoPreview:()=>api,showPredictionPoints:()=>api,
      begin:async()=>{
        w.cameraStarts++;
        const addVideo=()=>{const video=document.createElement('video');video.id='webgazerVideoFeed';Object.defineProperty(video,'srcObject',{value:{getTracks:()=>[{stop:()=>w.trackStops++}]}});document.body.append(video);};
        if(w.cameraStarts===1)addVideo();else await new Promise<void>(resolve=>{w.resolveCamera=()=>{addVideo();resolve();};});
        return api;
      },end:()=>{w.cameraStops++;},
    };w.webgazer=api;
  });
  await page.goto('/hci-lab-ia/#/tracking');
  await page.getByRole('checkbox',{name:/Acepto activar la cámara/}).check();await page.getByRole('button',{name:'Activar cámara y calibrar'}).click();
  await page.getByRole('dialog',{name:'Calibración de mirada'}).getByRole('button',{name:'Cerrar',exact:true}).click();
  const stops=await page.evaluate(()=>(window as unknown as {cameraStops:number}).cameraStops);
  await open(page);await page.getByRole('button',{name:'Restablecer proyecto',exact:true}).click();await page.keyboard.press('Escape');
  expect(await page.evaluate(()=>(window as unknown as {cameraStops:number}).cameraStops)).toBe(stops);
  await reset(page);
  expect(await page.evaluate(()=>{const w=window as unknown as {cameraStops:number;trackStops:number;clears:number};return {stops:w.cameraStops,tracks:w.trackStops,clears:w.clears};})).toMatchObject({tracks:1});
  expect(await page.evaluate(()=>(window as unknown as {cameraStops:number}).cameraStops)).toBeGreaterThan(stops);
  await expect(page.locator('video[id^=webgazer]')).toHaveCount(0);
  await expect(page.getByRole('checkbox',{name:/Acepto activar la cámara/})).not.toBeChecked();
  await page.evaluate(()=>(window as unknown as {blockNextClear:boolean}).blockNextClear=true);
  await page.getByRole('checkbox',{name:/Acepto activar la cámara/}).check();await page.getByRole('button',{name:'Activar cámara y calibrar'}).click();
  await expect.poll(()=>page.evaluate(()=>Boolean((window as unknown as {resolveClear?:()=>void}).resolveClear))).toBe(true);
  await reset(page);await page.evaluate(()=>(window as unknown as {resolveClear:()=>void}).resolveClear());
  expect(await page.evaluate(()=>(window as unknown as {cameraStarts:number}).cameraStarts)).toBe(1);
  await page.getByRole('checkbox',{name:/Acepto activar la cámara/}).check();await page.getByRole('button',{name:'Activar cámara y calibrar'}).click();
  await expect.poll(()=>page.evaluate(()=>Boolean((window as unknown as {resolveCamera?:()=>void}).resolveCamera))).toBe(true);
  await reset(page);await page.evaluate(()=>(window as unknown as {resolveCamera:()=>void}).resolveCamera());
  await expect.poll(()=>page.evaluate(()=>(window as unknown as {trackStops:number}).trackStops)).toBe(2);
  await expect(page.getByRole('dialog',{name:'Calibración de mirada'})).toHaveCount(0);
  await expect(page.getByRole('button',{name:'Activar cámara y calibrar'})).toBeDisabled();
  expect((await snapshot(page)).project).toEqual(emptyProject());
});

test('management: reset cancels chatbot generation and clears an open booking form',async({page})=>{
  await page.goto('/hci-lab-ia/#/chatbots');
  const chat=page.locator('section').filter({has:page.getByRole('heading',{name:'Chatbot B: buena práctica'})});
  await chat.getByLabel('Alias opcional').fill('P01');await chat.getByLabel('Mensaje editable').fill('Revisar accesibilidad');await chat.getByRole('button',{name:'Enviar mensaje'}).click();
  await expect(chat.getByText('Generando respuesta simulada…')).toBeVisible();await reset(page);
  await expect(chat.getByLabel('Alias opcional')).toHaveValue('');
  await expect(chat.getByText('Generando respuesta simulada…')).toHaveCount(0);
  await expect(chat.getByLabel('Mensaje editable')).toHaveValue('');await expect(chat.getByRole('button',{name:'Enviar mensaje'})).toBeDisabled();
  await page.waitForTimeout(1200);expect((await snapshot(page)).project).toEqual(emptyProject());
  await page.goto('/hci-lab-ia/#/lab');
  await page.getByRole('button',{name:'Crear reserva',exact:true}).click();
  await page.getByLabel('Contexto',{exact:true}).selectOption('university');
  await page.getByLabel('Servicio',{exact:true}).selectOption({index:1});
  await page.getByRole('button',{name:'Continuar',exact:true}).click();
  await expect(page.getByLabel('Fecha',{exact:true})).toBeVisible();await reset(page);
  await expect(page.locator('form')).toHaveCount(0);await page.getByRole('button',{name:'Crear reserva',exact:true}).click();await expect(page.getByLabel('Servicio',{exact:true})).toHaveValue('');
  await expect(page.getByLabel('Fecha',{exact:true})).toHaveCount(0);
});
