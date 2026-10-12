# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: project-management.spec.ts >> management: reset cancels chatbot generation and clears an open booking form
- Location: tests\e2e\project-management.spec.ts:201:1

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:4173/hci-lab-ia/#/chatbots
Call log:
  - navigating to "http://127.0.0.1:4173/hci-lab-ia/#/chatbots", waiting until "load"

```

# Test source

```ts
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
  146 |   const tracker=page.locator('.page-tracker');
  147 |   await tracker.getByLabel('Alias (opcional)',{exact:true}).fill('P01');await tracker.getByLabel('Tarea',{exact:true}).fill('Simular');
  148 |   await tracker.getByLabel('Modo de recorrido',{exact:true}).selectOption('F');
  149 |   await tracker.getByRole('button',{name:'Iniciar captura'}).click();await tracker.getByRole('button',{name:'Iniciar recorrido',exact:true}).click();
  150 |   await expect(tracker.getByRole('button',{name:'Detener captura'})).toBeEnabled();
  151 |   await tracker.getByRole('button',{name:'Seguimiento de página'}).click();
  152 |   await reset(page);await page.getByRole('button',{name:'Seguimiento de página',exact:true}).click();
  153 |   await expect(tracker.getByLabel('Alias (opcional)',{exact:true})).toHaveValue('');
  154 |   await expect(tracker.getByLabel('Tarea',{exact:true})).toHaveValue('');
  155 |   await expect(tracker.getByRole('button',{name:'Iniciar captura'})).toBeEnabled();
  156 |   await expect(tracker.getByRole('button',{name:'Detener captura'})).toBeDisabled();
  157 |   await expect(tracker.getByRole('button',{name:'Descargar JSON',exact:true})).toHaveCount(0);
  158 |   await expect(tracker.getByText('Listo. Prepare una sesión para registrar el contenido elegido.')).toBeVisible();
  159 |   await page.waitForTimeout(1200);expect((await snapshot(page)).project).toEqual(emptyProject());
  160 | });
  161 | 
  162 | test('management: reset stops camera engine, releases video tracks and pending camera start',async({page})=>{
  163 |   await page.addInitScript(()=>{
  164 |     const w=window as unknown as {webgazer:object;cameraStarts:number;cameraStops:number;trackStops:number;clears:number;resolveCamera?:()=>void;blockNextClear?:boolean;resolveClear?:()=>void};
  165 |     w.cameraStarts=0;w.cameraStops=0;w.trackStops=0;w.clears=0;
  166 |     const api={params:{faceMeshSolutionPath:''},saveDataAcrossSessions:()=>api,clearData:async()=>{w.clears++;if(w.blockNextClear){w.blockNextClear=false;await new Promise<void>(resolve=>{w.resolveClear=resolve;});}},
  167 |       setGazeListener:()=>api,clearGazeListener:()=>api,removeMouseEventListeners:()=>api,recordScreenPosition:()=>api,showVideoPreview:()=>api,showPredictionPoints:()=>api,
  168 |       begin:async()=>{
  169 |         w.cameraStarts++;
  170 |         const addVideo=()=>{const video=document.createElement('video');video.id='webgazerVideoFeed';Object.defineProperty(video,'srcObject',{value:{getTracks:()=>[{stop:()=>w.trackStops++}]}});document.body.append(video);};
  171 |         if(w.cameraStarts===1)addVideo();else await new Promise<void>(resolve=>{w.resolveCamera=()=>{addVideo();resolve();};});
  172 |         return api;
  173 |       },end:()=>{w.cameraStops++;},
  174 |     };w.webgazer=api;
  175 |   });
  176 |   await page.goto('/hci-lab-ia/#/tracking');
  177 |   await page.getByRole('checkbox',{name:/Acepto activar la cámara/}).check();await page.getByRole('button',{name:'Activar cámara y calibrar'}).click();
  178 |   await page.getByRole('dialog',{name:'Calibración de mirada'}).getByRole('button',{name:'Cerrar',exact:true}).click();
  179 |   const stops=await page.evaluate(()=>(window as unknown as {cameraStops:number}).cameraStops);
  180 |   await open(page);await page.getByRole('button',{name:'Restablecer proyecto',exact:true}).click();await page.keyboard.press('Escape');
  181 |   expect(await page.evaluate(()=>(window as unknown as {cameraStops:number}).cameraStops)).toBe(stops);
  182 |   await reset(page);
  183 |   expect(await page.evaluate(()=>{const w=window as unknown as {cameraStops:number;trackStops:number;clears:number};return {stops:w.cameraStops,tracks:w.trackStops,clears:w.clears};})).toMatchObject({tracks:1});
  184 |   expect(await page.evaluate(()=>(window as unknown as {cameraStops:number}).cameraStops)).toBeGreaterThan(stops);
  185 |   await expect(page.locator('video[id^=webgazer]')).toHaveCount(0);
  186 |   await expect(page.getByRole('checkbox',{name:/Acepto activar la cámara/})).not.toBeChecked();
  187 |   await page.evaluate(()=>(window as unknown as {blockNextClear:boolean}).blockNextClear=true);
  188 |   await page.getByRole('checkbox',{name:/Acepto activar la cámara/}).check();await page.getByRole('button',{name:'Activar cámara y calibrar'}).click();
  189 |   await expect.poll(()=>page.evaluate(()=>Boolean((window as unknown as {resolveClear?:()=>void}).resolveClear))).toBe(true);
  190 |   await reset(page);await page.evaluate(()=>(window as unknown as {resolveClear:()=>void}).resolveClear());
  191 |   expect(await page.evaluate(()=>(window as unknown as {cameraStarts:number}).cameraStarts)).toBe(1);
  192 |   await page.getByRole('checkbox',{name:/Acepto activar la cámara/}).check();await page.getByRole('button',{name:'Activar cámara y calibrar'}).click();
  193 |   await expect.poll(()=>page.evaluate(()=>Boolean((window as unknown as {resolveCamera?:()=>void}).resolveCamera))).toBe(true);
  194 |   await reset(page);await page.evaluate(()=>(window as unknown as {resolveCamera:()=>void}).resolveCamera());
  195 |   await expect.poll(()=>page.evaluate(()=>(window as unknown as {trackStops:number}).trackStops)).toBe(2);
  196 |   await expect(page.getByRole('dialog',{name:'Calibración de mirada'})).toHaveCount(0);
  197 |   await expect(page.getByRole('button',{name:'Activar cámara y calibrar'})).toBeDisabled();
  198 |   expect((await snapshot(page)).project).toEqual(emptyProject());
  199 | });
  200 | 
  201 | test('management: reset cancels chatbot generation and clears an open booking form',async({page})=>{
> 202 |   await page.goto('/hci-lab-ia/#/chatbots');
      |              ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:4173/hci-lab-ia/#/chatbots
  203 |   const chat=page.locator('section').filter({has:page.getByRole('heading',{name:'Chatbot B: buena práctica'})});
  204 |   await chat.getByLabel('Código del participante').fill('P01');await chat.getByRole('button',{name:'Enviar mensaje'}).click();
  205 |   await expect(chat.getByText('Generando respuesta…')).toBeVisible();await reset(page);
  206 |   await expect(chat.getByLabel('Código del participante')).toHaveValue('');
  207 |   await expect(chat.getByText('Generando respuesta…')).toHaveCount(0);
  208 |   await expect(chat.getByRole('button',{name:'Enviar mensaje'})).toBeEnabled();
  209 |   await page.waitForTimeout(1200);expect((await snapshot(page)).project).toEqual(emptyProject());
  210 |   await page.goto('/hci-lab-ia/#/lab');
  211 |   await page.getByLabel('Contexto',{exact:true}).selectOption('university');
  212 |   await page.getByLabel('Servicio',{exact:true}).selectOption({index:1});
  213 |   await page.getByRole('button',{name:'Continuar',exact:true}).click();
  214 |   await expect(page.getByLabel('Fecha',{exact:true})).toBeVisible();await reset(page);
  215 |   await expect(page.getByLabel('Servicio',{exact:true})).toHaveValue('');
  216 |   await expect(page.getByLabel('Fecha',{exact:true})).toHaveCount(0);
  217 | });
  218 | 
```