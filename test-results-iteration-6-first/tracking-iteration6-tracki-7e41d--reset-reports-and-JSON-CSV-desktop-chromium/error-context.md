# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tracking-iteration6.spec.ts >> tracking6: backup recovery, reset, reports and JSON/CSV
- Location: tests\e2e\tracking-iteration6.spec.ts:39:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Reemplazar proyecto', exact: true })

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
      - generic [ref=f1e129]:
        - button "Gestionar proyecto" [ref=f1e130] [cursor=pointer]
        - dialog [ref=f1e131]:
          - generic [ref=f1e132]:
            - heading "Gestionar proyecto" [level=2] [ref=f1e133]
            - button "Cerrar" [ref=f1e134] [cursor=pointer]: ×
          - paragraph [ref=f1e135]: Respalde sus datos, recupere un archivo guardado o deje el laboratorio vacío.
          - generic [ref=f1e136]:
            - heading "Confirmar recuperación" [level=3] [ref=f1e137]
            - paragraph [ref=f1e138]: El respaldo reemplazará todos los datos actuales y reiniciará las actividades abiertas. Puede cancelar y descargar primero un respaldo del proyecto actual.
            - paragraph [ref=f1e139]: Este respaldo también reemplazará las preferencias de accesibilidad y el idioma por los guardados en el archivo.
            - paragraph [ref=f1e140]: "Contenido: 1 reservas, 1 personas, 1 escenarios, 1 hallazgos, 1 sesiones UX, 7 evidencias y 3 sesiones de seguimiento."
            - generic [ref=f1e141]:
              - button "Cancelar" [active] [ref=f1e142] [cursor=pointer]
              - button "Reemplazar y recuperar" [ref=f1e143] [cursor=pointer]
      - generic [ref=f1e144]:
        - generic [ref=f1e149]: Idioma
        - combobox "Idioma" [ref=f1e150]:
          - option "ES" [selected]
          - option "EN"
          - option "PT"
          - option "FR"
          - option "IT"
          - option "CA"
      - button "Oscuro" [ref=f1e151] [cursor=pointer]
    - main [ref=f1e154]:
      - generic [ref=f1e155]:
        - generic [ref=f1e157]:
          - text: HCI · UX
          - heading "Seguimiento UX y mapas de calor" [level=1] [ref=f1e158]
          - paragraph [ref=f1e159]: Prepare una sesión, capture interacciones, detenga, revise y guarde. Los mapas describen muestras, no comprensión ni emociones.
        - list [ref=f1e160]:
          - listitem [ref=f1e161]: Preparar sesión
          - listitem [ref=f1e162]: Iniciar captura
          - listitem [ref=f1e163]: Interactuar
          - listitem [ref=f1e164]: Detener captura
          - listitem [ref=f1e165]: Revisar resultados
          - listitem [ref=f1e166]: Guardar sesión en proyecto
        - generic [ref=f1e167]:
          - heading "Preparar sesión" [level=2] [ref=f1e168]
          - paragraph [ref=f1e169]: Solo se registra el contenido elegido. Se excluyen estos controles, el menú y la barra superior. Cada muestra pertenece a esta sesión y a su ruta; nunca se guardan valores de formularios.
          - generic [ref=f1e170]:
            - generic [ref=f1e171]:
              - text: Contenido que se registra
              - combobox "Contenido que se registra" [ref=f1e172]:
                - option "Ejemplo para seguimiento" [selected]
                - option "Página actual (contenido principal)"
            - generic [ref=f1e173]:
              - text: Alias (opcional)
              - textbox "Alias (opcional)" [ref=f1e174]
            - generic [ref=f1e175]:
              - text: Tarea
              - textbox "Tarea" [ref=f1e176]
            - generic [ref=f1e177]:
              - text: Condición del ejemplo
              - combobox "Condición del ejemplo" [ref=f1e178]:
                - option "Buena práctica" [selected]
                - option "Antipatrón"
          - generic [ref=f1e179]:
            - button "Iniciar captura" [ref=f1e180] [cursor=pointer]
            - button "Detener captura" [disabled] [ref=f1e181]
            - button "Preparar otra sesión" [ref=f1e182] [cursor=pointer]
          - status [ref=f1e183]: Listo. Prepare una sesión para registrar el contenido elegido.
          - generic [ref=f1e184]:
            - generic [ref=f1e185]:
              - text: Capa del mapa
              - combobox "Capa del mapa" [ref=f1e186]:
                - option "Clics / activaciones" [selected]
                - 'option "Cursor: aproximación de atención"'
                - option "Atención simulada"
                - option "Mirada estimada (cámara)"
            - generic [ref=f1e187]:
              - checkbox "Mostrar mapa" [checked] [ref=f1e188]
              - text: Mostrar mapa
            - generic [ref=f1e189]:
              - text: Modo de recorrido
              - combobox "Modo de recorrido" [ref=f1e190]:
                - option "Cursor (aproximación)" [selected]
                - option "Patrón en F (simulado)"
                - option "Diagrama de Gutenberg (simulado)"
                - option "Sin recorrido"
          - generic [ref=f1e191]:
            - button "Iniciar recorrido" [disabled] [ref=f1e192]
            - button "Pausar recorrido" [disabled] [ref=f1e193]
            - button "Continuar recorrido" [disabled] [ref=f1e194]
            - button "Detener recorrido" [disabled] [ref=f1e195]
          - paragraph [ref=f1e196]: F y Gutenberg son recorridos didácticos generados, no predicciones de mirada ni evidencia de comprensión. Cambiar de modo inicia un recorrido nuevo y conserva las capas separadas y el historial de cambios.
          - paragraph [ref=f1e197]: "Movimiento reducido: el recorrido avanza por puntos, sin animación suave."
          - paragraph [ref=f1e198]: "Leyenda: amarillo = menor acumulación; rojo = mayor acumulación relativa dentro de esta capa. No compare intensidad entre capas o sesiones."
          - paragraph [ref=f1e199]: "Muestras de la capa: 0"
          - paragraph [ref=f1e200]: Sin muestras en esta capa. Inicie la captura e interactúe; para simulación, inicie también el recorrido.
          - generic [ref=f1e201]:
            - heading "Cámara y mirada estimada — experimental" [level=2] [ref=f1e202]
            - paragraph [ref=f1e203]: WebGazer 3.5.3 estima la mirada a partir de fotogramas procesados en este navegador. Se descargan código y modelos de proveedores externos, que reciben IP y metadatos de la petición. Este laboratorio no graba ni envía video, imágenes de rostro ni valores escritos. Guarda solo posiciones estimadas, tiempos y calidad de validación cuando guarde la sesión. El entrenamiento automático y su persistencia están desactivados.
            - generic [ref=f1e204]:
              - checkbox "Acepto activar la cámara y descargar WebGazer y sus modelos externos." [ref=f1e205]
              - generic [ref=f1e206]: Acepto activar la cámara y descargar WebGazer y sus modelos externos.
            - generic [ref=f1e207]:
              - button "Activar cámara y calibrar" [disabled] [ref=f1e208]
              - button "Recalibrar" [disabled] [ref=f1e209]
              - button "Comprobar calibración" [disabled] [ref=f1e210]
              - button "Apagar cámara" [disabled] [ref=f1e211]
            - generic [ref=f1e212]:
              - checkbox "Mostrar vista previa de cámara" [disabled] [ref=f1e213]
              - text: Mostrar vista previa de cámara
            - status [ref=f1e214]: Cámara apagada. Canal opcional.
            - paragraph [ref=f1e215]: "Predicciones válidas: 0"
        - generic [ref=f1e216]:
          - heading "Asesorías universitarias ficticias · Buena práctica" [level=2] [ref=f1e217]
          - paragraph [ref=f1e218]: Elija un servicio, complete la solicitud ficticia y revise su resultado. No se crea una reserva real.
          - region "Ejemplo para seguimiento" [ref=f1e219]:
            - generic [ref=f1e220]:
              - generic [ref=f1e221]:
                - heading "Servicio" [level=3] [ref=f1e222]
                - paragraph [ref=f1e223]: Elija un servicio, complete la solicitud ficticia y revise su resultado. No se crea una reserva real.
                - button "Ir al formulario" [ref=f1e224] [cursor=pointer]
              - generic [ref=f1e225]:
                - heading "Servicio" [level=3] [ref=f1e226]
                - generic [ref=f1e227]:
                  - button "Orientación UX" [pressed] [ref=f1e228] [cursor=pointer]
                  - button "Revisión de accesibilidad" [ref=f1e229] [cursor=pointer]
              - generic [ref=f1e230]:
                - heading "Solicitud ficticia" [level=3] [ref=f1e231]
                - generic [ref=f1e232]:
                  - generic [ref=f1e233]:
                    - text: Descripción ficticia (no se registra)
                    - textbox "Descripción ficticia (no se registra)" [ref=f1e234]
                  - generic [ref=f1e235]:
                    - text: Servicio
                    - combobox "Servicio" [ref=f1e236]:
                      - option "Orientación UX" [selected]
                      - option "Revisión de accesibilidad"
                  - generic [ref=f1e237]:
                    - button "Confirmar solicitud" [ref=f1e238] [cursor=pointer]
                    - button "Cancelar solicitud" [ref=f1e239] [cursor=pointer]
                - status [ref=f1e240]: —
              - generic [ref=f1e241]:
                - heading "Preguntas frecuentes" [level=3] [ref=f1e242]
                - paragraph [ref=f1e243]: Puede corregir o cancelar sin enviar datos. Solo se registran posiciones y tiempos. Desplace este panel hasta el final.
                - button "Preguntas frecuentes" [ref=f1e244] [cursor=pointer]
              - generic [ref=f1e245]:
                - heading "Final del recorrido" [level=3] [ref=f1e246]
                - paragraph [ref=f1e247]: Scroll no demuestra lectura ni atención. El cursor es una aproximación, no mirada medida. No se infieren emociones.
                - button "Volver al inicio" [ref=f1e248] [cursor=pointer]
        - generic [ref=f1e249]:
          - heading "Sesiones guardadas · 0" [level=2] [ref=f1e250]
          - paragraph [ref=f1e251]: Todavía no hay sesiones guardadas. Prepare una captura para obtener muestras.
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
  11 | test('tracking6: exact clicks, keyboard, control exclusion, scrolling map and no form values',async({page})=>{
  12 |  await page.goto('/hci-lab-ia/#/tracking');await start(page);await expect(page.getByRole('button',{name:'Iniciar captura'})).toBeDisabled();
  13 |  await pane(page).getByRole('button',{name:'Ir al formulario'}).click();await expect(metric(page,'Clics / activaciones')).toHaveText('1');
  14 |  await page.getByRole('checkbox',{name:'Mostrar mapa',exact:true}).uncheck();await expect(metric(page,'Clics / activaciones')).toHaveText('1');await page.getByRole('checkbox',{name:'Mostrar mapa',exact:true}).check();
  15 |  await pane(page).getByLabel('Descripción ficticia (no se registra)').fill('NEVER_STORE_FORM_TEXT');
  16 |  const button=pane(page).getByRole('button',{name:'Confirmar solicitud',exact:true});await button.focus();await page.keyboard.press('Enter');await expect(metric(page,'Clics / activaciones')).toHaveText('2');
  17 |  await pane(page).scrollIntoViewIfNeeded();const before=await pane(page).locator('canvas').boundingBox();await pane(page).evaluate(el=>el.scrollTop+=180);await page.waitForTimeout(250);const after=await pane(page).locator('canvas').boundingBox();expect(after!.y-before!.y).toBeCloseTo(-180,0);
  18 |  expect(await pane(page).locator('canvas').evaluate(c=>Array.from((c as HTMLCanvasElement).getContext('2d')!.getImageData(0,0,(c as HTMLCanvasElement).width,(c as HTMLCanvasElement).height).data).some((v,i)=>i%4===3&&v>0))).toBe(true);
  19 |  await page.getByRole('button',{name:'Detener captura'}).click();await page.getByLabel('Observación de la sesión').fill('Resultado observado');await page.getByRole('button',{name:'Guardar sesión en proyecto'}).click();await expect(controls(page).getByRole('status').first()).toContainText('guardada');
  20 |  const s=(await stored(page)).pageSessions[0];expect(s.clickCount).toBe(2);expect(s.clicks).toHaveLength(2);expect(s.clicks[1].source).toBe('keyboard');expect(s.clicks[1].y).toBeGreaterThan(400);expect(s.clicks.every((v:{route:string;area:string})=>v.route==='/tracking'&&!!v.area)).toBe(true);expect(JSON.stringify(s)).not.toContain('NEVER_STORE_FORM_TEXT');
  21 |  const beforeReload=await stored(page);await page.reload();expect(await stored(page)).toEqual(beforeReload);
  22 | });
  23 | test('tracking6: wheel without movement, effective scroll and maximum depth',async({page})=>{
  24 |  await page.goto('/hci-lab-ia/#/tracking');await start(page);await pane(page).evaluate(el=>el.dispatchEvent(new WheelEvent('wheel',{deltaY:-100,bubbles:true})));await expect(metric(page,'Eventos de rueda')).toHaveText('1');await expect(metric(page,'Desplazamientos efectivos')).toHaveText('0');
  25 |  await pane(page).focus();await page.keyboard.press('End');await expect(metric(page,'Profundidad visible máxima')).toHaveText('100.0%');await expect(metric(page,'Desplazamientos efectivos')).not.toHaveText('0');
  26 | });
  27 | test('tracking6: simulation pause, resume, mode changes and cancel discard',async({page})=>{
  28 |  await page.goto('/hci-lab-ia/#/tracking');await start(page);await page.getByLabel('Modo de recorrido',{exact:true}).selectOption('F');await page.getByRole('button',{name:'Iniciar recorrido',exact:true}).click();await pane(page).scrollIntoViewIfNeeded();await page.waitForTimeout(650);await page.getByRole('button',{name:'Pausar recorrido'}).click();
  29 |  await page.getByLabel('Capa del mapa').selectOption('simulation');const count=await controls(page).getByText(/Muestras de la capa:/).textContent();expect(count).not.toContain(': 0');await page.waitForTimeout(400);expect(await controls(page).getByText(/Muestras de la capa:/).textContent()).toBe(count);
  30 |  await page.getByLabel('Modo de recorrido').selectOption('Gutenberg');await page.getByRole('button',{name:'Continuar recorrido'}).click();await pane(page).scrollIntoViewIfNeeded();await page.waitForTimeout(650);await page.getByRole('button',{name:'Detener recorrido'}).click();await page.getByRole('button',{name:'Preparar otra sesión'}).click();await page.getByRole('button',{name:'Cancelar',exact:true}).click();await expect(page.getByRole('button',{name:'Detener captura'})).toBeEnabled();
  31 |  await page.getByRole('button',{name:'Detener captura'}).click();await page.getByRole('button',{name:'Guardar sesión en proyecto'}).click();const s=(await stored(page)).pageSessions[0];expect(s.simulation.some((p:{source:string})=>p.source==='simulated-F')).toBe(true);expect(s.simulation.some((p:{source:string})=>p.source==='simulated-Gutenberg')).toBe(true);expect(s.pointer).toEqual([]);expect(s.gaze).toEqual([]);expect(s.modeChanges.map((m:{mode:string})=>m.mode)).toEqual(['cursor','F','Gutenberg']);
  32 | });
  33 | test('tracking6: page geometry, growing results, route stops and shared controls',async({page})=>{
  34 |  await page.goto('/hci-lab-ia/#/quality');await page.getByRole('button',{name:'Seguimiento de página'}).click();await start(page);await page.getByRole('button',{name:'Seguimiento de página'}).click();await page.locator('main h1').click();
  35 |  await page.evaluate(()=>{const p=document.createElement('p');p.textContent='New results';p.style.height='600px';document.querySelector('main')!.append(p);});await page.waitForTimeout(450);await page.getByRole('button',{name:'Seguimiento de página'}).click();await expect(page.getByRole('button',{name:'Detener captura'})).toBeEnabled();await expect(metric(page,'Clics / activaciones')).toHaveText('1');
  36 |  await page.evaluate(()=>{location.hash='#/tracking';});await expect(page.locator('main')).toBeFocused();await expect(page.getByRole('button',{name:'Detener captura'})).toBeDisabled();await expect(controls(page).getByRole('status').first()).toContainText('ruta');await expect(page.locator('#tracking-controls')).toHaveCount(1);await expect(page.locator('.tracking-document-overlay')).toHaveCount(0);
  37 |  await page.getByRole('button',{name:'Guardar sesión en proyecto'}).click();expect((await stored(page)).pageSessions[0].route).toBe('/quality');
  38 | });
  39 | test('tracking6: backup recovery, reset, reports and JSON/CSV',async({page},info)=>{
  40 |  await page.addInitScript(project=>{if(!sessionStorage.getItem('tracking6-seed')){localStorage.setItem('hci-lab-ia-project-v2',JSON.stringify(project));sessionStorage.setItem('tracking6-seed','yes');}},representativeProject());
  41 |  await page.goto('/hci-lab-ia/#/tracking');await start(page);await pane(page).getByRole('button',{name:'Ir al formulario'}).click();await page.getByRole('button',{name:'Detener captura'}).click();await page.getByLabel('Observación de la sesión').fill('New tracking evidence');await page.getByRole('button',{name:'Guardar sesión en proyecto'}).click();const before=await stored(page);
  42 |  for(const [label,name]of [['Descargar JSON','hci-seguimiento-ux.json'],['Descargar CSV','hci-seguimiento-ux.csv']]){const promise=page.waitForEvent('download');await page.getByRole('button',{name:label,exact:true}).first().click();expect((await promise).suggestedFilename()).toBe(name);}
  43 |  await page.getByRole('button',{name:'Gestionar proyecto'}).click();const backup=page.waitForEvent('download');await page.getByRole('button',{name:'Descargar respaldo JSON'}).click();const file=info.outputPath('tracking-project.json');await(await backup).saveAs(file);await page.getByRole('button',{name:'Restablecer proyecto',exact:true}).click();await page.getByRole('button',{name:'Borrar datos y restablecer'}).click();await page.reload();expect((await stored(page)).pageSessions).toEqual([]);expect((await stored(page)).trackingSessions).toEqual([]);
> 44 |  await page.getByRole('button',{name:'Gestionar proyecto'}).click();await page.locator('dialog input[type=file]').setInputFiles(file);await page.getByRole('button',{name:'Reemplazar proyecto',exact:true}).click();expect(await stored(page)).toEqual(before);await page.evaluate(()=>location.hash='#/reports');await page.getByRole('heading',{name:/Sesiones guardadas/}).locator('..').locator('summary').first().click();await expect(page.getByText('New tracking evidence')).toBeVisible();
     |                                                                                                                                                                                                              ^ Error: locator.click: Test timeout of 30000ms exceeded.
  45 | });
  46 | test('tracking6: six languages, both conditions, themes, focus, responsive axe',async({page},info)=>{
  47 |  await page.goto('/hci-lab-ia/#/tracking');for(const lang of trackingLanguages){const r=trackingResources[lang];await page.locator('.language select').selectOption(lang);await expect(page.getByRole('heading',{name:r.title,exact:true})).toBeVisible();await expect(page.getByRole('button',{name:r.cameraStart})).toBeDisabled();await page.getByLabel(r.task,{exact:true}).fill('USER_TEXT');await page.getByLabel(r.condition,{exact:true}).selectOption('bad');await expect(page.getByText(r.badHelp,{exact:true})).toBeVisible();await page.getByLabel(r.condition,{exact:true}).selectOption('good');await expect(page.getByLabel(r.task,{exact:true})).toHaveValue('USER_TEXT');}
  48 |  await page.locator('.language select').selectOption('es-CO');for(const [theme,contrast]of [['light','false'],['dark','false'],['light','true'],['dark','true']]){await page.evaluate(([theme,contrast])=>{document.documentElement.dataset.theme=theme;document.documentElement.dataset.contrast=contrast;},[theme,contrast]);const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(axe.violations.map(v=>({id:v.id,target:v.nodes.map(n=>n.target)}))).toEqual([]);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);await page.screenshot({path:info.outputPath(`tracking-${theme}-${contrast}.png`),fullPage:true});}
  49 |  await page.getByRole('button',{name:'Seguimiento de página'}).click();await expect(controls(page)).toBeFocused();await page.keyboard.press('Tab');expect(await page.evaluate(()=>document.activeElement?.matches('select'))).toBe(true);
  50 | });
  51 | 
```