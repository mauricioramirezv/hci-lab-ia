# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tracking-camera6.spec.ts >> tracking6 camera: no valid predictions, validation stays unmeasured, close releases tracks (mock)
- Location: tests\e2e\tracking-camera6.spec.ts:11:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText(/Predicciones insuficientes en la validación/)
Expected: visible
Timeout: 18000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByText(/Predicciones insuficientes en la validación/) with timeout 18000ms
  - waiting for getByText(/Predicciones insuficientes en la validación/)

```

```yaml
- link "Saltar al contenido":
  - /url: "#main-content"
- complementary "Navegación principal":
  - text: H+
  - strong: HCI Lab + IA
  - text: UX · A11y · AI
  - navigation:
    - heading "Inicio y aprendizaje" [level=2]
    - link "Inicio":
      - /url: "#/"
    - link "Conceptos":
      - /url: "#/concepts"
    - link "Curso":
      - /url: "#/course"
    - heading "Diseñar y explorar" [level=2]
    - link "Laboratorio":
      - /url: "#/lab"
    - link "Personas":
      - /url: "#/research"
    - link "Prácticas":
      - /url: "#/practices"
    - link "Dispositivos":
      - /url: "#/devices"
    - link "Interacción multimodal":
      - /url: "#/multimodal"
    - link "Experimentos":
      - /url: "#/experiments"
    - heading "Evaluar y medir" [level=2]
    - link "Seguimiento UX":
      - /url: "#/tracking"
    - link "Informes y evidencias":
      - /url: "#/reports"
    - link "Accesibilidad":
      - /url: "#/accessibility"
    - link "Evaluación":
      - /url: "#/evaluation"
    - link "Pruebas UX":
      - /url: "#/user-testing"
    - link "Métricas":
      - /url: "#/metrics"
    - heading "Herramientas y calidad" [level=2]
    - link "Evaluación de chatbots":
      - /url: "#/chatbots"
    - link "IA":
      - /url: "#/ai"
    - link "Calidad":
      - /url: "#/quality"
  - img
  - text: WCAG · Nielsen · SUS · E2E
- banner:
  - strong: HCI Lab + IA
  - text: Laboratorio evolutivo de interacción humano-computador
  - complementary:
    - button "Seguimiento de página"
  - button "Gestionar proyecto"
  - text: Idioma
  - combobox "Idioma":
    - option "ES" [selected]
    - option "EN"
    - option "PT"
    - option "FR"
    - option "IT"
    - option "CA"
  - button "Oscuro"
- main:
  - text: HCI · UX
  - heading "Seguimiento UX y mapas de calor" [level=1]
  - paragraph: Prepare una sesión, capture interacciones, detenga, revise y guarde. Los mapas describen muestras, no comprensión ni emociones.
  - list:
    - listitem: Preparar sesión
    - listitem: Iniciar captura
    - listitem: Interactuar
    - listitem: Detener captura
    - listitem: Revisar resultados
    - listitem: Guardar sesión en proyecto
  - heading "Preparar sesión" [level=2]
  - paragraph: Solo se registra el contenido elegido. Se excluyen estos controles, el menú y la barra superior. Cada muestra pertenece a esta sesión y a su ruta; nunca se guardan valores de formularios.
  - text: Contenido que se registra
  - combobox "Contenido que se registra":
    - option "Ejemplo para seguimiento" [selected]
    - option "Página actual (contenido principal)"
  - text: Alias (opcional)
  - textbox "Alias (opcional)"
  - text: Tarea
  - textbox "Tarea"
  - text: Condición del ejemplo
  - combobox "Condición del ejemplo":
    - option "Buena práctica" [selected]
    - option "Antipatrón"
  - button "Iniciar captura"
  - button "Detener captura" [disabled]
  - button "Preparar otra sesión"
  - status: Listo. Prepare una sesión para registrar el contenido elegido.
  - text: Capa del mapa
  - combobox "Capa del mapa":
    - option "Clics / activaciones" [selected]
    - 'option "Cursor: aproximación de atención"'
    - option "Atención simulada"
    - option "Mirada estimada (cámara)"
  - checkbox "Mostrar mapa" [checked]
  - text: Mostrar mapa Modo de recorrido
  - combobox "Modo de recorrido":
    - option "Cursor (aproximación)" [selected]
    - option "Patrón en F (simulado)"
    - option "Diagrama de Gutenberg (simulado)"
    - option "Sin recorrido"
  - button "Iniciar recorrido" [disabled]
  - button "Pausar recorrido" [disabled]
  - button "Continuar recorrido" [disabled]
  - button "Detener recorrido" [disabled]
  - paragraph: F y Gutenberg son recorridos didácticos generados, no predicciones de mirada ni evidencia de comprensión. Cambiar de modo inicia un recorrido nuevo y conserva las capas separadas y el historial de cambios.
  - paragraph: "Movimiento reducido: el recorrido avanza por puntos, sin animación suave."
  - paragraph: "Leyenda: amarillo = menor acumulación; rojo = mayor acumulación relativa dentro de esta capa. No compare intensidad entre capas o sesiones."
  - paragraph: "Muestras de la capa: 0"
  - paragraph: Sin muestras en esta capa. Inicie la captura e interactúe; para simulación, inicie también el recorrido.
  - heading "Cámara y mirada estimada — experimental" [level=2]
  - paragraph: WebGazer 3.5.3 estima la mirada a partir de fotogramas procesados en este navegador. Se descargan código y modelos de proveedores externos, que reciben IP y metadatos de la petición. Este laboratorio no graba ni envía video, imágenes de rostro ni valores escritos. Guarda solo posiciones estimadas, tiempos y calidad de validación cuando guarde la sesión. El entrenamiento automático y su persistencia están desactivados.
  - checkbox "Acepto activar la cámara y descargar WebGazer y sus modelos externos." [checked] [disabled]
  - text: Acepto activar la cámara y descargar WebGazer y sus modelos externos.
  - button "Activar cámara y calibrar" [disabled]
  - button "Recalibrar"
  - button "Comprobar calibración"
  - button "Apagar cámara"
  - checkbox "Mostrar vista previa de cámara"
  - text: Mostrar vista previa de cámara
  - status: No llegan predicciones válidas. Revise luz, rostro visible, permisos y conexión. Recalibre o elija simulación; no se sustituye automáticamente la cámara.
  - paragraph: "Predicciones válidas: 0"
  - heading "Asesorías universitarias ficticias · Buena práctica" [level=2]
  - paragraph: Elija un servicio, complete la solicitud ficticia y revise su resultado. No se crea una reserva real.
  - region "Ejemplo para seguimiento":
    - heading "Servicio" [level=3]
    - paragraph: Elija un servicio, complete la solicitud ficticia y revise su resultado. No se crea una reserva real.
    - button "Ir al formulario"
    - heading "Servicio" [level=3]
    - button "Orientación UX" [pressed]
    - button "Revisión de accesibilidad"
    - heading "Solicitud ficticia" [level=3]
    - text: Descripción ficticia (no se registra)
    - textbox "Descripción ficticia (no se registra)"
    - text: Servicio
    - combobox "Servicio":
      - option "Orientación UX" [selected]
      - option "Revisión de accesibilidad"
    - button "Confirmar solicitud"
    - button "Cancelar solicitud"
    - status: —
    - heading "Preguntas frecuentes" [level=3]
    - paragraph: Puede corregir o cancelar sin enviar datos. Solo se registran posiciones y tiempos. Desplace este panel hasta el final.
    - button "Preguntas frecuentes"
    - heading "Final del recorrido" [level=3]
    - paragraph: Scroll no demuestra lectura ni atención. El cursor es una aproximación, no mirada medida. No se infieren emociones.
    - button "Volver al inicio"
  - heading "Sesiones guardadas · 0" [level=2]
  - paragraph: Todavía no hay sesiones guardadas. Prepare una captura para obtener muestras.
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
  8  |  await page.goto('/hci-lab-ia/#/tracking');await accept(page);await expect(page.getByText(trackingResources['es-CO'][outcome==='NotAllowedError'?'denied':'unavailable'],{exact:true})).toBeVisible();await expect(page.getByText('Predicciones válidas: 0',{exact:true})).toBeVisible();await expect(page.locator('.tracking-calibration')).not.toBeVisible();
  9  | });
  10 | test('tracking6 camera: absent media API does not request the external estimator',async({page})=>{const requests:string[]=[];page.on('request',r=>{if(r.url().includes('webgazer'))requests.push(r.url());});await page.addInitScript(()=>Object.defineProperty(navigator,'mediaDevices',{value:undefined,configurable:true}));await page.goto('/hci-lab-ia/#/tracking');await accept(page);await expect(page.getByText(/Cámara no disponible/)).toBeVisible();expect(requests).toEqual([]);});
  11 | test('tracking6 camera: no valid predictions, validation stays unmeasured, close releases tracks (mock)',async({page})=>{
  12 |  test.setTimeout(45000);
  13 |  await page.addInitScript(()=>{const w=window as unknown as {webgazer:unknown;stopped:number;training:number};w.stopped=0;w.training=0;const api={params:{},saveDataAcrossSessions:()=>api,clearData:async()=>{},setGazeListener:()=>api,clearGazeListener:()=>api,removeMouseEventListeners:()=>api,recordScreenPosition:()=>{w.training++;return api;},showVideoPreview:()=>api,showPredictionPoints:()=>api,begin:async()=>{const v=document.createElement('video');v.id='webgazerVideoFeed';Object.defineProperty(v,'srcObject',{value:{getTracks:()=>[{stop:()=>w.stopped++}]}});document.body.append(v);return api;},end:()=>{}};w.webgazer=api;});
  14 |  await page.goto('/hci-lab-ia/#/tracking');await accept(page);const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(axe.violations.map(v=>v.id)).toEqual([]);
> 15 |  for(let i=1;i<=9;i++)for(let j=0;j<5;j++)await page.getByRole('button',{name:`Punto ${i}, ${j} de 5`,exact:true}).click();await page.getByRole('button',{name:'Terminar calibración'}).click();await page.getByRole('button',{name:'Comprobar calibración',exact:true}).click();await expect(page.getByText(/Predicciones insuficientes en la validación/)).toBeVisible({timeout:18000});await expect(page.getByText('Predicciones válidas: 0',{exact:true})).toBeVisible();expect(await page.evaluate(()=>(window as unknown as {training:number}).training)).toBe(45);
     |                                                                                                                                                                                                                                                                                                                                                              ^ Error: expect(locator).toBeVisible() failed
  16 |  await page.getByRole('button',{name:'Recalibrar',exact:true}).click();await page.keyboard.press('Escape');await expect(page.locator('video[id^=webgazer]')).toHaveCount(0);expect(await page.evaluate(()=>(window as unknown as {stopped:number}).stopped)).toBe(1);await expect(page.getByRole('button',{name:'Activar cámara y calibrar'})).toBeEnabled();
  17 | });
  18 | test('tracking6 camera: preview and route exit release physical-resource adapter (mock)',async({page})=>{
  19 |  await page.addInitScript(()=>{const w=window as unknown as {webgazer:unknown;tracks:number;preview:boolean};w.tracks=0;w.preview=false;const api={params:{},saveDataAcrossSessions:()=>api,clearData:async()=>{},setGazeListener:()=>api,clearGazeListener:()=>api,removeMouseEventListeners:()=>api,recordScreenPosition:()=>api,showVideoPreview:(v:boolean)=>{w.preview=v;return api;},showPredictionPoints:()=>api,begin:async()=>{const v=document.createElement('video');v.id='webgazerVideoFeed';Object.defineProperty(v,'srcObject',{value:{getTracks:()=>[{stop:()=>w.tracks++}]}});document.body.append(v);return api;},end:()=>{}};w.webgazer=api;});
  20 |  await page.goto('/hci-lab-ia/#/tracking');await accept(page);for(let i=1;i<=9;i++)for(let j=0;j<5;j++)await page.getByRole('button',{name:`Punto ${i}, ${j} de 5`,exact:true}).click();await page.getByRole('button',{name:'Terminar calibración'}).click();await page.getByRole('checkbox',{name:'Mostrar vista previa de cámara'}).check();expect(await page.evaluate(()=>(window as unknown as {preview:boolean}).preview)).toBe(true);await page.evaluate(()=>location.hash='#/quality');await expect(page.locator('video[id^=webgazer]')).toHaveCount(0);expect(await page.evaluate(()=>(window as unknown as {tracks:number}).tracks)).toBe(1);
  21 | });
  22 | 
```