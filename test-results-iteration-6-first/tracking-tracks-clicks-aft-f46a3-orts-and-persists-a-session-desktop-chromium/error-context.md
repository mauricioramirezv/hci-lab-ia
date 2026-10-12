# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tracking.spec.ts >> tracks clicks after scroll, pointer dwell, exports and persists a session
- Location: tests\e2e\tracking.spec.ts:3:1

# Error details

```
Error: locator.click: Error: strict mode violation: getByRole('heading', { name: 'Sesiones guardadas · 1' }).locator('..').locator('summary') resolved to 2 elements:
    1) <summary>…</summary> aka getByText('2026-10-10T17:54:18.383Z ·')
    2) <summary>Resumen textual de muestras por zona</summary> aka getByText('Resumen textual de muestras')

Call log:
  - waiting for getByRole('heading', { name: 'Sesiones guardadas · 1' }).locator('..').locator('summary')

```

# Page snapshot

```yaml
- generic [ref=f1e3]:
  - link "Saltar al contenido" [ref=f1e4] [cursor=pointer]:
    - /url: "#main-content"
  - complementary "Navegación principal" [ref=f1e5]:
    - generic [ref=f1e6]:
      - generic [ref=f1e7]: H+
      - generic [ref=f1e8]:
        - strong [ref=f1e9]: HCI Lab + IA
        - generic [ref=f1e10]: UX · A11y · AI
    - navigation [ref=f1e11]:
      - generic [ref=f1e12]:
        - heading "Inicio y aprendizaje" [level=2] [ref=f1e13]
        - link "Inicio" [ref=f1e14] [cursor=pointer]:
          - /url: "#/"
        - link "Conceptos" [ref=f1e19] [cursor=pointer]:
          - /url: "#/concepts"
        - link "Curso" [ref=f1e31] [cursor=pointer]:
          - /url: "#/course"
      - generic [ref=f1e36]:
        - heading "Diseñar y explorar" [level=2] [ref=f1e37]
        - link "Laboratorio" [ref=f1e38] [cursor=pointer]:
          - /url: "#/lab"
        - link "Personas" [ref=f1e42] [cursor=pointer]:
          - /url: "#/research"
        - link "Prácticas" [ref=f1e49] [cursor=pointer]:
          - /url: "#/practices"
        - link "Dispositivos" [ref=f1e55] [cursor=pointer]:
          - /url: "#/devices"
        - link "Interacción multimodal" [ref=f1e59] [cursor=pointer]:
          - /url: "#/multimodal"
        - link "Experimentos" [ref=f1e63] [cursor=pointer]:
          - /url: "#/experiments"
      - generic [ref=f1e67]:
        - heading "Evaluar y medir" [level=2] [ref=f1e68]
        - link "Seguimiento UX" [ref=f1e69] [cursor=pointer]:
          - /url: "#/tracking"
        - link "Informes y evidencias" [ref=f1e74] [cursor=pointer]:
          - /url: "#/reports"
        - link "Accesibilidad" [ref=f1e78] [cursor=pointer]:
          - /url: "#/accessibility"
        - link "Evaluación" [ref=f1e86] [cursor=pointer]:
          - /url: "#/evaluation"
        - link "Pruebas UX" [ref=f1e91] [cursor=pointer]:
          - /url: "#/user-testing"
        - link "Métricas" [ref=f1e96] [cursor=pointer]:
          - /url: "#/metrics"
      - generic [ref=f1e100]:
        - heading "Herramientas y calidad" [level=2] [ref=f1e101]
        - link "Evaluación de chatbots" [ref=f1e102] [cursor=pointer]:
          - /url: "#/chatbots"
        - link "IA" [ref=f1e107] [cursor=pointer]:
          - /url: "#/ai"
        - link "Calidad" [ref=f1e112] [cursor=pointer]:
          - /url: "#/quality"
    - generic [ref=f1e117]: WCAG · Nielsen · SUS · E2E
  - generic [ref=f1e122]:
    - banner [ref=f1e123]:
      - generic [ref=f1e124]:
        - strong [ref=f1e125]: HCI Lab + IA
        - generic [ref=f1e126]: Laboratorio evolutivo de interacción humano-computador
      - complementary [ref=f1e127]:
        - button "Seguimiento de página" [ref=f1e128] [cursor=pointer]
      - button "Gestionar proyecto" [ref=f1e130] [cursor=pointer]
      - generic [ref=f1e131]:
        - generic [ref=f1e136]: Idioma
        - combobox "Idioma" [ref=f1e137]:
          - option "ES" [selected]
          - option "EN"
          - option "PT"
          - option "FR"
          - option "IT"
          - option "CA"
      - button "Oscuro" [ref=f1e138] [cursor=pointer]
    - main [ref=f1e141]:
      - generic [ref=f1e142]:
        - generic [ref=f1e144]:
          - text: HCI · UX
          - heading "Seguimiento UX y mapas de calor" [level=1] [ref=f1e145]
          - paragraph [ref=f1e146]: Prepare una sesión, capture interacciones, detenga, revise y guarde. Los mapas describen muestras, no comprensión ni emociones.
        - list [ref=f1e147]:
          - listitem [ref=f1e148]: Preparar sesión
          - listitem [ref=f1e149]: Iniciar captura
          - listitem [ref=f1e150]: Interactuar
          - listitem [ref=f1e151]: Detener captura
          - listitem [ref=f1e152]: Revisar resultados
          - listitem [ref=f1e153]: Guardar sesión en proyecto
        - generic [ref=f1e154]:
          - heading "Preparar sesión" [level=2] [ref=f1e155]
          - paragraph [ref=f1e156]: Solo se registra el contenido elegido. Se excluyen estos controles, el menú y la barra superior. Cada muestra pertenece a esta sesión y a su ruta; nunca se guardan valores de formularios.
          - generic [ref=f1e157]:
            - generic [ref=f1e158]:
              - text: Contenido que se registra
              - combobox "Contenido que se registra" [ref=f1e159]:
                - option "Ejemplo para seguimiento" [selected]
                - option "Página actual (contenido principal)"
            - generic [ref=f1e160]:
              - text: Alias (opcional)
              - textbox "Alias (opcional)" [ref=f1e161]
            - generic [ref=f1e162]:
              - text: Tarea
              - textbox "Tarea" [ref=f1e163]
            - generic [ref=f1e164]:
              - text: Condición del ejemplo
              - combobox "Condición del ejemplo" [ref=f1e165]:
                - option "Buena práctica" [selected]
                - option "Antipatrón"
          - generic [ref=f1e166]:
            - button "Iniciar captura" [ref=f1e167] [cursor=pointer]
            - button "Detener captura" [disabled] [ref=f1e168]
            - button "Preparar otra sesión" [ref=f1e169] [cursor=pointer]
          - status [ref=f1e170]: Listo. Prepare una sesión para registrar el contenido elegido.
          - generic [ref=f1e171]:
            - generic [ref=f1e172]:
              - text: Capa del mapa
              - combobox "Capa del mapa" [ref=f1e173]:
                - option "Clics / activaciones" [selected]
                - 'option "Cursor: aproximación de atención"'
                - option "Atención simulada"
                - option "Mirada estimada (cámara)"
            - generic [ref=f1e174]:
              - checkbox "Mostrar mapa" [checked] [ref=f1e175]
              - text: Mostrar mapa
            - generic [ref=f1e176]:
              - text: Modo de recorrido
              - combobox "Modo de recorrido" [ref=f1e177]:
                - option "Cursor (aproximación)" [selected]
                - option "Patrón en F (simulado)"
                - option "Diagrama de Gutenberg (simulado)"
                - option "Sin recorrido"
          - generic [ref=f1e178]:
            - button "Iniciar recorrido" [disabled] [ref=f1e179]
            - button "Pausar recorrido" [disabled] [ref=f1e180]
            - button "Continuar recorrido" [disabled] [ref=f1e181]
            - button "Detener recorrido" [disabled] [ref=f1e182]
          - paragraph [ref=f1e183]: F y Gutenberg son recorridos didácticos generados, no predicciones de mirada ni evidencia de comprensión. Cambiar de modo inicia un recorrido nuevo y conserva las capas separadas y el historial de cambios.
          - paragraph [ref=f1e184]: "Movimiento reducido: el recorrido avanza por puntos, sin animación suave."
          - paragraph [ref=f1e185]: "Leyenda: amarillo = menor acumulación; rojo = mayor acumulación relativa dentro de esta capa. No compare intensidad entre capas o sesiones."
          - paragraph [ref=f1e186]: "Muestras de la capa: 0"
          - paragraph [ref=f1e187]: Sin muestras en esta capa. Inicie la captura e interactúe; para simulación, inicie también el recorrido.
          - generic [ref=f1e188]:
            - heading "Cámara y mirada estimada — experimental" [level=2] [ref=f1e189]
            - paragraph [ref=f1e190]: WebGazer 3.5.3 estima la mirada a partir de fotogramas procesados en este navegador. Se descargan código y modelos de proveedores externos, que reciben IP y metadatos de la petición. Este laboratorio no graba ni envía video, imágenes de rostro ni valores escritos. Guarda solo posiciones estimadas, tiempos y calidad de validación cuando guarde la sesión. El entrenamiento automático y su persistencia están desactivados.
            - generic [ref=f1e191]:
              - checkbox "Acepto activar la cámara y descargar WebGazer y sus modelos externos." [ref=f1e192]
              - generic [ref=f1e193]: Acepto activar la cámara y descargar WebGazer y sus modelos externos.
            - generic [ref=f1e194]:
              - button "Activar cámara y calibrar" [disabled] [ref=f1e195]
              - button "Recalibrar" [disabled] [ref=f1e196]
              - button "Comprobar calibración" [disabled] [ref=f1e197]
              - button "Apagar cámara" [disabled] [ref=f1e198]
            - generic [ref=f1e199]:
              - checkbox "Mostrar vista previa de cámara" [disabled] [ref=f1e200]
              - text: Mostrar vista previa de cámara
            - status [ref=f1e201]: Cámara apagada. Canal opcional.
            - paragraph [ref=f1e202]: "Predicciones válidas: 0"
        - generic [ref=f1e203]:
          - heading "Asesorías universitarias ficticias · Buena práctica" [level=2] [ref=f1e204]
          - paragraph [ref=f1e205]: Elija un servicio, complete la solicitud ficticia y revise su resultado. No se crea una reserva real.
          - region "Ejemplo para seguimiento" [ref=f1e206]:
            - generic [ref=f1e207]:
              - generic [ref=f1e208]:
                - heading "Servicio" [level=3] [ref=f1e209]
                - paragraph [ref=f1e210]: Elija un servicio, complete la solicitud ficticia y revise su resultado. No se crea una reserva real.
                - button "Ir al formulario" [ref=f1e211] [cursor=pointer]
              - generic [ref=f1e212]:
                - heading "Servicio" [level=3] [ref=f1e213]
                - generic [ref=f1e214]:
                  - button "Orientación UX" [pressed] [ref=f1e215] [cursor=pointer]
                  - button "Revisión de accesibilidad" [ref=f1e216] [cursor=pointer]
              - generic [ref=f1e217]:
                - heading "Solicitud ficticia" [level=3] [ref=f1e218]
                - generic [ref=f1e219]:
                  - generic [ref=f1e220]:
                    - text: Descripción ficticia (no se registra)
                    - textbox "Descripción ficticia (no se registra)" [ref=f1e221]
                  - generic [ref=f1e222]:
                    - text: Servicio
                    - combobox "Servicio" [ref=f1e223]:
                      - option "Orientación UX" [selected]
                      - option "Revisión de accesibilidad"
                  - generic [ref=f1e224]:
                    - button "Confirmar solicitud" [ref=f1e225] [cursor=pointer]
                    - button "Cancelar solicitud" [ref=f1e226] [cursor=pointer]
                - status [ref=f1e227]: —
              - generic [ref=f1e228]:
                - heading "Preguntas frecuentes" [level=3] [ref=f1e229]
                - paragraph [ref=f1e230]: Puede corregir o cancelar sin enviar datos. Solo se registran posiciones y tiempos. Desplace este panel hasta el final.
                - button "Preguntas frecuentes" [ref=f1e231] [cursor=pointer]
              - generic [ref=f1e232]:
                - heading "Final del recorrido" [level=3] [ref=f1e233]
                - paragraph [ref=f1e234]: Scroll no demuestra lectura ni atención. El cursor es una aproximación, no mirada medida. No se infieren emociones.
                - button "Volver al inicio" [ref=f1e235] [cursor=pointer]
        - generic [ref=f1e236]:
          - heading "Sesiones guardadas · 1" [level=2] [ref=f1e237]
          - group [ref=f1e238]:
            - generic "2026-10-10T17:54:18.383Z · Sin alias · Explorar el ejemplo · Ejemplo para seguimiento" [ref=f1e239] [cursor=pointer]
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import AxeBuilder from '@axe-core/playwright';
  3   | test('tracks clicks after scroll, pointer dwell, exports and persists a session', async ({page}) => {
  4   |   await page.goto('/hci-lab-ia/#/tracking');
  5   |   await expect(page.getByRole('heading',{name:'Seguimiento UX y mapas de calor'})).toBeVisible();
  6   |   await page.getByLabel('Tarea',{exact:true}).fill('Explorar el ejemplo');
  7   |   await page.getByRole('button',{name:'Iniciar captura',exact:true}).click();
  8   |   const pane=page.getByRole('region',{name:'Ejemplo para seguimiento'});
  9   |   await pane.locator('button',{hasText:'Ir al formulario'}).click();
  10  |   await page.getByLabel('Descripción ficticia (no se registra)',{exact:true}).fill('NO_GUARDAR_ESTE_TEXTO');
  11  |   await pane.getByRole('button',{name:'Confirmar solicitud',exact:true}).click();
  12  |   const box=await pane.boundingBox();
  13  |   await page.getByRole('button',{name:'Iniciar recorrido',exact:true}).click();
  14  |   await pane.scrollIntoViewIfNeeded();
  15  |   await page.mouse.move(box!.x+60,box!.y+70);
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
> 36  |   await page.reload();await page.getByRole('heading',{name:'Sesiones guardadas · 1'}).locator('..').locator('summary').click();await expect(page.getByText('Se comprendió el resultado del formulario.')).toBeVisible();
      |                                                                                                                        ^ Error: locator.click: Error: strict mode violation: getByRole('heading', { name: 'Sesiones guardadas · 1' }).locator('..').locator('summary') resolved to 2 elements:
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
  63  |   await expect(page.locator('dl div').filter({has:page.getByText('Eventos de rueda',{exact:true})}).locator('dd')).not.toHaveText('0');
  64  |   await pane.focus();await page.keyboard.press('End');await page.waitForTimeout(300);
  65  |   await expect(page.locator('dl div').filter({has:page.getByText('Profundidad visible máxima',{exact:true})}).locator('dd')).toHaveText('100.0%');
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
  92  |   await page.getByRole('region',{name:'Ejemplo para seguimiento'}).scrollIntoViewIfNeeded();
  93  |   await page.waitForTimeout(500);
  94  |   await page.getByRole('button',{name:'Detener captura',exact:true}).click();
  95  |   await page.getByLabel('Observación de la sesión').fill('Cámara probada con motor simulado.');
  96  |   await page.getByRole('button',{name:'Guardar sesión en proyecto'}).click();
  97  |   const state=await page.evaluate(()=>JSON.parse(localStorage.getItem('hci-lab-ia-project-v2')||'{}'));
  98  |   expect(state.pageSessions[0].gaze.length).toBeGreaterThan(0);expect(state.pageSessions[0].validation.medianErrorPx).toBe(10);
  99  |   expect(await page.evaluate(()=>(window as unknown as {cameraStopped:boolean}).cameraStopped)).toBe(true);
  100 | });
  101 | 
```