# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: project-management.spec.ts >> management: reset stops camera engine, releases video tracks and pending camera start
- Location: tests\e2e\project-management.spec.ts:162:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('dialog', { name: 'Calibración de mirada' }).getByRole('button', { name: 'Cerrar', exact: true })
    - locator resolved to <button>Cerrar</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <button class="tracking-target" aria-label="Punto 2, 0 de 5">0</button> intercepts pointer events
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <button class="tracking-target" aria-label="Punto 2, 0 de 5">0</button> intercepts pointer events
    - retrying click action
      - waiting 100ms
    56 × waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <button class="tracking-target" aria-label="Punto 2, 0 de 5">0</button> intercepts pointer events
     - retrying click action
       - waiting 500ms

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - link "Saltar al contenido" [ref=e4] [cursor=pointer]:
    - /url: "#main-content"
  - complementary "Navegación principal" [ref=e5]:
    - generic [ref=e6]:
      - generic [ref=e7]: H+
      - generic [ref=e8]:
        - strong [ref=e9]: HCI Lab + IA
        - generic [ref=e10]: UX · A11y · AI
    - navigation [ref=e11]:
      - generic [ref=e12]:
        - heading "Inicio y aprendizaje" [level=2] [ref=e13]
        - link "Inicio" [ref=e14] [cursor=pointer]:
          - /url: "#/"
        - link "Conceptos" [ref=e19] [cursor=pointer]:
          - /url: "#/concepts"
        - link "Curso" [ref=e31] [cursor=pointer]:
          - /url: "#/course"
      - generic [ref=e36]:
        - heading "Diseñar y explorar" [level=2] [ref=e37]
        - link "Laboratorio" [ref=e38] [cursor=pointer]:
          - /url: "#/lab"
        - link "Personas" [ref=e42] [cursor=pointer]:
          - /url: "#/research"
        - link "Prácticas" [ref=e49] [cursor=pointer]:
          - /url: "#/practices"
        - link "Dispositivos" [ref=e55] [cursor=pointer]:
          - /url: "#/devices"
        - link "Interacción multimodal" [ref=e59] [cursor=pointer]:
          - /url: "#/multimodal"
        - link "Experimentos" [ref=e63] [cursor=pointer]:
          - /url: "#/experiments"
      - generic [ref=e67]:
        - heading "Evaluar y medir" [level=2] [ref=e68]
        - link "Seguimiento UX" [ref=e69] [cursor=pointer]:
          - /url: "#/tracking"
        - link "Informes y evidencias" [ref=e74] [cursor=pointer]:
          - /url: "#/reports"
        - link "Accesibilidad" [ref=e78] [cursor=pointer]:
          - /url: "#/accessibility"
        - link "Evaluación" [ref=e86] [cursor=pointer]:
          - /url: "#/evaluation"
        - link "Pruebas UX" [ref=e91] [cursor=pointer]:
          - /url: "#/user-testing"
        - link "Métricas" [ref=e96] [cursor=pointer]:
          - /url: "#/metrics"
      - generic [ref=e100]:
        - heading "Herramientas y calidad" [level=2] [ref=e101]
        - link "Evaluación de chatbots" [ref=e102] [cursor=pointer]:
          - /url: "#/chatbots"
        - link "IA" [ref=e107] [cursor=pointer]:
          - /url: "#/ai"
        - link "Calidad" [ref=e112] [cursor=pointer]:
          - /url: "#/quality"
    - generic [ref=e117]: WCAG · Nielsen · SUS · E2E
  - generic [ref=e122]:
    - banner [ref=e123]:
      - generic [ref=e124]:
        - strong [ref=e125]: HCI Lab + IA
        - generic [ref=e126]: Laboratorio evolutivo de interacción humano-computador
      - complementary [ref=e127]:
        - button "Seguimiento de página" [ref=e128] [cursor=pointer]
      - button "Gestionar proyecto" [ref=e130] [cursor=pointer]
      - generic [ref=e131]:
        - generic [ref=e136]: Idioma
        - combobox "Idioma" [ref=e137]:
          - option "ES" [selected]
          - option "EN"
          - option "PT"
          - option "FR"
          - option "IT"
          - option "CA"
      - button "Oscuro" [ref=e138] [cursor=pointer]
    - main [ref=e141]:
      - generic [ref=e142]:
        - generic [ref=e144]:
          - text: HCI · UX
          - heading "Seguimiento UX y mapas de calor" [level=1] [ref=e145]
          - paragraph [ref=e146]: Prepare una sesión, capture interacciones, detenga, revise y guarde. Los mapas describen muestras, no comprensión ni emociones.
        - list [ref=e147]:
          - listitem [ref=e148]: Preparar sesión
          - listitem [ref=e149]: Iniciar captura
          - listitem [ref=e150]: Interactuar
          - listitem [ref=e151]: Detener captura
          - listitem [ref=e152]: Revisar resultados
          - listitem [ref=e153]: Guardar sesión en proyecto
        - generic [ref=e154]:
          - heading "Preparar sesión" [level=2] [ref=e155]
          - paragraph [ref=e156]: Solo se registra el contenido elegido. Se excluyen estos controles, el menú y la barra superior. Cada muestra pertenece a esta sesión y a su ruta; nunca se guardan valores de formularios.
          - generic [ref=e157]:
            - generic [ref=e158]:
              - text: Contenido que se registra
              - combobox "Contenido que se registra" [ref=e159]:
                - option "Ejemplo para seguimiento" [selected]
                - option "Página actual (contenido principal)"
            - generic [ref=e160]:
              - text: Alias (opcional)
              - textbox "Alias (opcional)" [ref=e161]
            - generic [ref=e162]:
              - text: Tarea
              - textbox "Tarea" [ref=e163]
            - generic [ref=e164]:
              - text: Condición del ejemplo
              - combobox "Condición del ejemplo" [ref=e165]:
                - option "Buena práctica" [selected]
                - option "Antipatrón"
          - generic [ref=e166]:
            - button "Iniciar captura" [ref=e167] [cursor=pointer]
            - button "Detener captura" [disabled] [ref=e168]
            - button "Preparar otra sesión" [ref=e169] [cursor=pointer]
          - status [ref=e170]: Listo. Prepare una sesión para registrar el contenido elegido.
          - generic [ref=e171]:
            - generic [ref=e172]:
              - text: Capa del mapa
              - combobox "Capa del mapa" [ref=e173]:
                - option "Clics / activaciones" [selected]
                - 'option "Cursor: aproximación de atención"'
                - option "Atención simulada"
                - option "Mirada estimada (cámara)"
            - generic [ref=e174]:
              - checkbox "Mostrar mapa" [checked] [ref=e175]
              - text: Mostrar mapa
            - generic [ref=e176]:
              - text: Modo de recorrido
              - combobox "Modo de recorrido" [ref=e177]:
                - option "Cursor (aproximación)" [selected]
                - option "Patrón en F (simulado)"
                - option "Diagrama de Gutenberg (simulado)"
                - option "Sin recorrido"
          - generic [ref=e178]:
            - button "Iniciar recorrido" [disabled] [ref=e179]
            - button "Pausar recorrido" [disabled] [ref=e180]
            - button "Continuar recorrido" [disabled] [ref=e181]
            - button "Detener recorrido" [disabled] [ref=e182]
          - paragraph [ref=e183]: F y Gutenberg son recorridos didácticos generados, no predicciones de mirada ni evidencia de comprensión. Cambiar de modo inicia un recorrido nuevo y conserva las capas separadas y el historial de cambios.
          - paragraph [ref=e184]: "Movimiento reducido: el recorrido avanza por puntos, sin animación suave."
          - paragraph [ref=e185]: "Leyenda: amarillo = menor acumulación; rojo = mayor acumulación relativa dentro de esta capa. No compare intensidad entre capas o sesiones."
          - paragraph [ref=e186]: "Muestras de la capa: 0"
          - paragraph [ref=e187]: Sin muestras en esta capa. Inicie la captura e interactúe; para simulación, inicie también el recorrido.
          - generic [ref=e188]:
            - heading "Cámara y mirada estimada — experimental" [level=2] [ref=e189]
            - paragraph [ref=e190]: WebGazer 3.5.3 estima la mirada a partir de fotogramas procesados en este navegador. Se descargan código y modelos de proveedores externos, que reciben IP y metadatos de la petición. Este laboratorio no graba ni envía video, imágenes de rostro ni valores escritos. Guarda solo posiciones estimadas, tiempos y calidad de validación cuando guarde la sesión. El entrenamiento automático y su persistencia están desactivados.
            - generic [ref=e191]:
              - checkbox "Acepto activar la cámara y descargar WebGazer y sus modelos externos." [checked] [disabled] [ref=e192]
              - generic [ref=e193]: Acepto activar la cámara y descargar WebGazer y sus modelos externos.
            - generic [ref=e194]:
              - button "Activar cámara y calibrar" [disabled] [ref=e195]
              - button "Recalibrar" [ref=e196] [cursor=pointer]
              - button "Comprobar calibración" [disabled] [ref=e197]
              - button "Apagar cámara" [ref=e198] [cursor=pointer]
            - generic [ref=e199]:
              - checkbox "Mostrar vista previa de cámara" [ref=e200]
              - text: Mostrar vista previa de cámara
            - status [ref=e201]: No llegan predicciones válidas. Revise luz, rostro visible, permisos y conexión. Recalibre o elija simulación; no se sustituye automáticamente la cámara.
            - paragraph [ref=e202]: "Predicciones válidas: 0"
            - dialog "Calibración de mirada" [ref=e203]:
              - generic [ref=e204]:
                - strong [ref=e205]: Mire cada punto y púlselo cinco veces, manteniendo la cabeza estable. Después se validarán cinco puntos independientes.
                - button "Cerrar" [active] [ref=e206] [cursor=pointer]
              - button "Punto 1, 0 de 5" [ref=e207] [cursor=pointer]: "0"
              - button "Punto 2, 0 de 5" [ref=e208] [cursor=pointer]: "0"
              - button "Punto 3, 0 de 5" [ref=e209] [cursor=pointer]: "0"
              - button "Punto 4, 0 de 5" [ref=e210] [cursor=pointer]: "0"
              - button "Punto 5, 0 de 5" [ref=e211] [cursor=pointer]: "0"
              - button "Punto 6, 0 de 5" [ref=e212] [cursor=pointer]: "0"
              - button "Punto 7, 0 de 5" [ref=e213] [cursor=pointer]: "0"
              - button "Punto 8, 0 de 5" [ref=e214] [cursor=pointer]: "0"
              - button "Punto 9, 0 de 5" [ref=e215] [cursor=pointer]: "0"
        - generic [ref=e216]:
          - heading "Asesorías universitarias ficticias · Buena práctica" [level=2] [ref=e217]
          - paragraph [ref=e218]: Elija un servicio, complete la solicitud ficticia y revise su resultado. No se crea una reserva real.
          - region "Ejemplo para seguimiento" [ref=e219]:
            - generic [ref=e220]:
              - generic [ref=e221]:
                - heading "Servicio" [level=3] [ref=e222]
                - paragraph [ref=e223]: Elija un servicio, complete la solicitud ficticia y revise su resultado. No se crea una reserva real.
                - button "Ir al formulario" [ref=e224] [cursor=pointer]
              - generic [ref=e225]:
                - heading "Servicio" [level=3] [ref=e226]
                - generic [ref=e227]:
                  - button "Orientación UX" [pressed] [ref=e228] [cursor=pointer]
                  - button "Revisión de accesibilidad" [ref=e229] [cursor=pointer]
              - generic [ref=e230]:
                - heading "Solicitud ficticia" [level=3] [ref=e231]
                - generic [ref=e232]:
                  - generic [ref=e233]:
                    - text: Descripción ficticia (no se registra)
                    - textbox "Descripción ficticia (no se registra)" [ref=e234]
                  - generic [ref=e235]:
                    - text: Servicio
                    - combobox "Servicio" [ref=e236]:
                      - option "Orientación UX" [selected]
                      - option "Revisión de accesibilidad"
                  - generic [ref=e237]:
                    - button "Confirmar solicitud" [ref=e238] [cursor=pointer]
                    - button "Cancelar solicitud" [ref=e239] [cursor=pointer]
                - status [ref=e240]: —
              - generic [ref=e241]:
                - heading "Preguntas frecuentes" [level=3] [ref=e242]
                - paragraph [ref=e243]: Puede corregir o cancelar sin enviar datos. Solo se registran posiciones y tiempos. Desplace este panel hasta el final.
                - button "Preguntas frecuentes" [ref=e244] [cursor=pointer]
              - generic [ref=e245]:
                - heading "Final del recorrido" [level=3] [ref=e246]
                - paragraph [ref=e247]: Scroll no demuestra lectura ni atención. El cursor es una aproximación, no mirada medida. No se infieren emociones.
                - button "Volver al inicio" [ref=e248] [cursor=pointer]
        - generic [ref=e249]:
          - heading "Sesiones guardadas · 0" [level=2] [ref=e250]
          - paragraph [ref=e251]: Todavía no hay sesiones guardadas. Prepare una captura para obtener muestras.
```

# Test source

```ts
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
> 178 |   await page.getByRole('dialog',{name:'Calibración de mirada'}).getByRole('button',{name:'Cerrar',exact:true}).click();
      |                                                                                                                ^ Error: locator.click: Test timeout of 30000ms exceeded.
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
  202 |   await page.goto('/hci-lab-ia/#/chatbots');
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