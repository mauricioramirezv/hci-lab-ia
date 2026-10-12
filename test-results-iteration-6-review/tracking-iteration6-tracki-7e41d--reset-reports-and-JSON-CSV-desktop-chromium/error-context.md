# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tracking-iteration6.spec.ts >> tracking6: backup recovery, reset, reports and JSON/CSV
- Location: tests\e2e\tracking-iteration6.spec.ts:39:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('New tracking evidence')
Expected: visible
Error: strict mode violation: getByText('New tracking evidence') resolved to 2 elements:
    1) <p>New tracking evidence</p> aka getByText('New tracking evidence', { exact: true })
    2) <pre class="report-text"># HCI Lab + IA — Informe académico↵Generado: 2026…</pre> aka getByText('# HCI Lab + IA — Informe acad')

Call log:
  - Expect "toBeVisible" getByText('New tracking evidence') with timeout 5000ms
  - waiting for getByText('New tracking evidence')

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
    - status [ref=f1e141]: Respaldo recuperado. Los datos se guardaron y las actividades abiertas se reiniciaron.
    - main [ref=f1e142]:
      - generic [ref=f1e144]:
        - text: EVIDENCIA ACADÉMICA
        - heading "Informes, sesiones y comparación" [level=1] [ref=f1e145]
        - paragraph [ref=f1e146]: Exporte resultados con contexto. Los datos de demostración se identifican y no cuentan como resultados de participantes.
      - generic [ref=f1e147]:
        - button "Exportar informe Markdown" [ref=f1e148] [cursor=pointer]
        - button "Imprimir / guardar PDF" [ref=f1e149] [cursor=pointer]
        - button "Exportar evidencias CSV" [ref=f1e150] [cursor=pointer]
      - generic [ref=f1e151]:
        - text: Filtrar por participante, tarea, versión o tipo
        - textbox "Filtrar por participante, tarea, versión o tipo" [ref=f1e152]
      - generic [ref=f1e153]:
        - heading "Comparación antes/después" [level=2] [ref=f1e154]
        - paragraph [ref=f1e155]: Seleccione registros del mismo participante, tarea y tipo. Justifique equivalencia de condiciones y cambios; no se calcula significancia estadística.
        - generic [ref=f1e156]:
          - text: Antes
          - combobox "Antes" [ref=f1e157]:
            - option "Seleccione evidencia" [selected]
            - option "P01 · Actividad concept · buena · v2.4"
            - option "P01 · Actividad experiment · buena · v2.4"
            - option "P01 · Actividad tlx · buena · v2.4"
            - option "P01 · Actividad chatbot · buena · v2.4"
        - generic [ref=f1e158]:
          - text: Después
          - combobox "Después" [ref=f1e159]:
            - option "Seleccione evidencia" [selected]
            - option "P01 · Actividad concept · buena · v2.4"
            - option "P01 · Actividad experiment · buena · v2.4"
            - option "P01 · Actividad tlx · buena · v2.4"
            - option "P01 · Actividad chatbot · buena · v2.4"
        - generic [ref=f1e160]:
          - text: Hallazgo, corrección, interpretación y limitaciones
          - textbox "Hallazgo, corrección, interpretación y limitaciones" [ref=f1e161]
        - button "Guardar comparación" [disabled] [ref=f1e162]
        - status
      - generic [ref=f1e163]:
        - heading "Sesiones guardadas · 1" [level=2] [ref=f1e164]
        - group [ref=f1e165]:
          - generic "2026-10-10T17:59:58.420Z · P01 · Explorar servicios · Ejemplo para seguimiento" [active] [ref=f1e166] [cursor=pointer]
          - paragraph [ref=f1e167]: /tracking · example-content · 906 × 1588px
          - paragraph [ref=f1e168]: New tracking evidence
          - generic [ref=f1e169]:
            - generic [ref=f1e170]:
              - generic [ref=f1e171]:
                - term [ref=f1e172]: Clics / activaciones
                - definition [ref=f1e173]: "1"
              - generic [ref=f1e174]:
                - term [ref=f1e175]: Eventos de rueda
                - definition [ref=f1e176]: "0"
              - generic [ref=f1e177]:
                - term [ref=f1e178]: Desplazamientos efectivos
                - definition [ref=f1e179]: "1"
              - generic [ref=f1e180]:
                - term [ref=f1e181]: Profundidad visible máxima
                - definition [ref=f1e182]: 55.8%
              - generic [ref=f1e183]:
                - term [ref=f1e184]: Duración (segundos)
                - definition [ref=f1e185]: "0.1"
            - paragraph [ref=f1e186]: Scroll no demuestra lectura ni atención. El cursor es una aproximación, no mirada medida. No se infieren emociones.
            - group [ref=f1e187]:
              - generic "Resumen textual de muestras por zona" [ref=f1e188] [cursor=pointer]
            - generic [ref=f1e189]:
              - button "Descargar JSON" [ref=f1e190] [cursor=pointer]
              - button "Descargar CSV" [ref=f1e191] [cursor=pointer]
      - generic [ref=f1e192]:
        - heading "Sesiones de página" [level=2] [ref=f1e193]
        - article [ref=f1e194]:
          - heading "P01 · /quality" [level=3] [ref=f1e195]
          - paragraph [ref=f1e196]: Consultar · v2.4 · 1 clics · 50.0% profundidad · 10.0 s
          - paragraph [ref=f1e197]: Sesión de página
          - button "Exportar sesión" [ref=f1e198] [cursor=pointer]
          - button "Eliminar sesión" [ref=f1e199] [cursor=pointer]
      - generic [ref=f1e200]:
        - heading "Sesiones del área de ejemplos" [level=2] [ref=f1e201]
        - article [ref=f1e202]:
          - paragraph [ref=f1e203]: 2026-10-09T15:00:00.000Z · good · 1 clics · Sesión de ejemplo
          - button "Eliminar sesión de ejemplo" [ref=f1e204] [cursor=pointer]
      - region [ref=f1e206]:
        - heading "Observaciones de patrones" [level=2] [ref=f1e207]
        - paragraph [ref=f1e208]: Texto escrito por el estudiante; no es una medición automática.
        - paragraph [ref=f1e209]: No hay observaciones de patrones guardadas que coincidan con el filtro.
      - generic [ref=f1e210]:
        - heading "Evidencias guardadas" [level=2] [ref=f1e211]
        - group [ref=f1e212]:
          - generic "P01 · Actividad concept · buena" [ref=f1e213] [cursor=pointer]
        - group [ref=f1e214]:
          - generic "P01 · Actividad experiment · buena" [ref=f1e215] [cursor=pointer]
        - group [ref=f1e216]:
          - generic "P01 · Actividad tlx · buena" [ref=f1e217] [cursor=pointer]
        - group [ref=f1e218]:
          - generic "P01 · Actividad chatbot · buena" [ref=f1e219] [cursor=pointer]
        - group [ref=f1e220]:
          - generic "P01 · Actividad ai · buena" [ref=f1e221] [cursor=pointer]
        - group [ref=f1e222]:
          - generic "P01 · Actividad comparison · buena" [ref=f1e223] [cursor=pointer]
      - generic [ref=f1e224]:
        - heading "Informe académico" [level=2] [ref=f1e225]
        - generic [ref=f1e226]: "# HCI Lab + IA — Informe académico Generado: 2026-10-10T17:59:59.627Z ## Contexto y alcance Proyecto local de aprendizaje y evaluación. Identifique objetivos, contexto y limitaciones en las evidencias de cada tarea. ## Resumen de registros Personas: 1; escenarios: 1; hallazgos: 1; sesiones UX: 1; evidencias adicionales: 6. SUS medio: 75/100 (no es un porcentaje de conformidad). Tiempo medio de flujos completados: 30 s. Discrepancia humano-IA: 100.0% (edición o rechazo sobre decisiones registradas). ## Personas y escenarios - Ana: Reservar una asesoría sin perder la información ingresada.; contexto: Realiza trámites desde casa y alterna entre tableta y celular.; barrera: Baja experiencia digital y visión reducida. - Cambio de dispositivo: Reservar una asesoría UX.; éxito: Finaliza en menos de 3 minutos, sin repetir datos y comprende el estado. ## Hallazgos y correcciones - Visibilidad del estado · S2 · validated Problema: Estado poco visible Evidencia: Observación P01 Corrección propuesta: Mostrar confirmación ## Pruebas UX y SUS - P01 · Reservar: éxito true, 30 s, 1 errores, SUS 75 (respuestas: 4, 2, 4, 2, 4, 2, 4, 2, 4, 2), SEQ 6, emoción declarada 4. Sesión UX ## Actividades, carga de trabajo y comparaciones ### Actividad concept — P01 ID: evidence-0; fecha: 2026-10-09T15:00:00.000Z; tipo: concept; condición: buena; versión: v2.4 Resultados: {\"seconds\":12,\"score\":50} Interpretación: Evidencia representativa ### Actividad experiment — P01 ID: evidence-1; fecha: 2026-10-09T15:00:00.000Z; tipo: experiment; condición: buena; versión: v2.4 Resultados: {\"seconds\":12,\"score\":50} Interpretación: Evidencia representativa ### Actividad tlx — P01 ID: evidence-2; fecha: 2026-10-09T15:00:00.000Z; tipo: tlx; condición: buena; versión: v2.4 Resultados: {\"seconds\":12,\"score\":50} Interpretación: Evidencia representativa ### Actividad chatbot — P01 ID: evidence-3; fecha: 2026-10-09T15:00:00.000Z; tipo: chatbot; condición: buena; versión: v2.4 Resultados: {\"seconds\":12,\"score\":50} Interpretación: Evidencia representativa ### Actividad ai — P01 ID: evidence-4; fecha: 2026-10-09T15:00:00.000Z; tipo: ai; condición: buena; versión: v2.4 Resultados: {\"seconds\":12,\"score\":50} Interpretación: Evidencia representativa ### Actividad comparison — P01 ID: evidence-5; fecha: 2026-10-09T15:00:00.000Z; tipo: comparison; condición: buena; versión: v2.4 Resultados: {\"seconds\":12,\"score\":50} Interpretación: Evidencia representativa ## Telemetría de páginas - P01 · Consultar · /quality · v2.4: 1 clics, 1 muestras del cursor, 1 de mirada estimada y 1 simuladas; profundidad 50.0%; 10.0 s. Geometría 800×1600; error de validación cámara 10 px. Registros limitados: false. Exposición por tramo (s): {\"0-10%\":2}. Sesión de página - P01 · Explorar servicios · /tracking · good: 1 clics, 0 muestras del cursor, 0 de mirada estimada y 0 simuladas; profundidad 55.8%; 0.1 s. Geometría 906×1588; error de validación cámara no disponible px. Registros limitados: false. Exposición por tramo (s): {}. New tracking evidence ## Telemetría del área de ejemplos - good: 1 clics; profundidad 50.0%; 10.0 s. Sesión de ejemplo ## Evidencia multimodal - watch · good · protanopia: Símbolo y texto ## Limitaciones Scroll no demuestra lectura; cursor no demuestra mirada. Recorridos simulados no son mediciones humanas. Webcam ofrece estimaciones dependientes de calibración. Las tareas didácticas y cuestionarios no certifican accesibilidad. Raw TLX usa el promedio sin ponderación de seis dimensiones. No se infieren emociones desde la cámara. ## Referencias - WCAG 2.2: https://www.w3.org/TR/WCAG22/ - NASA-TLX: https://www.nasa.gov/human-systems-integration-division/nasa-task-load-index-tlx/ - Microsoft HAI: https://www.microsoft.com/en-us/research/project/guidelines-for-human-ai-interaction/ - Google PAIR: https://pair.withgoogle.com/guidebook/ - WebGazer: https://webgazer.cs.brown.edu/"
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
> 44 |  await page.getByRole('button',{name:'Gestionar proyecto'}).click();await page.locator('dialog input[type=file]').setInputFiles(file);await page.getByRole('button',{name:'Reemplazar y recuperar',exact:true}).click();expect(await stored(page)).toEqual(before);await page.evaluate(()=>location.hash='#/reports');await page.getByRole('heading',{name:/Sesiones guardadas/}).locator('..').locator('summary').first().click();await expect(page.getByText('New tracking evidence')).toBeVisible();
     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          ^ Error: expect(locator).toBeVisible() failed
  45 | });
  46 | test('tracking6: six languages, both conditions, themes, focus, responsive axe',async({page},info)=>{
  47 |  await page.goto('/hci-lab-ia/#/tracking');for(const lang of trackingLanguages){const r=trackingResources[lang];await page.locator('.language select').selectOption(lang);await expect(page.getByRole('heading',{name:r.title,exact:true})).toBeVisible();await expect(page.getByRole('button',{name:r.cameraStart})).toBeDisabled();await page.getByLabel(r.task,{exact:true}).fill('USER_TEXT');await page.getByLabel(r.condition,{exact:true}).selectOption('bad');await expect(page.getByText(r.badHelp,{exact:true})).toBeVisible();await page.getByLabel(r.condition,{exact:true}).selectOption('good');await expect(page.getByLabel(r.task,{exact:true})).toHaveValue('USER_TEXT');}
  48 |  await page.locator('.language select').selectOption('es-CO');for(const [theme,contrast]of [['light','false'],['dark','false'],['light','true'],['dark','true']]){await page.evaluate(([theme,contrast])=>{document.documentElement.dataset.theme=theme;document.documentElement.dataset.contrast=contrast;},[theme,contrast]);const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(axe.violations.map(v=>({id:v.id,target:v.nodes.map(n=>n.target)}))).toEqual([]);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);await page.screenshot({path:info.outputPath(`tracking-${theme}-${contrast}.png`),fullPage:true});}
  49 |  await page.getByRole('button',{name:'Seguimiento de página'}).click();await expect(controls(page)).toBeFocused();await page.keyboard.press('Tab');expect(await page.evaluate(()=>document.activeElement?.matches('select'))).toBe(true);
  50 | });
  51 | 
```