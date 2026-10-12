# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: reports-iteration8.spec.ts >> reports8: every module, search filters details and explicit selection keep originals intact
- Location: tests\e2e\reports-iteration8.spec.ts:13:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.selectOption: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByLabel('Tipo', { exact: true })

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
        - generic [ref=e145]:
          - text: HCI LAB + IA
          - heading "Informes del proyecto" [level=1] [ref=e146]
          - paragraph [ref=e147]: Revise evidencias con contexto, seleccione registros y prepare un informe sin modificar los datos originales.
        - region [ref=e148]:
          - heading "Resumen del proyecto" [level=2] [ref=e149]
          - generic [ref=e150]:
            - generic [ref=e151]:
              - term [ref=e152]: Persona y mapa de empatía
              - definition [ref=e153]: "1"
            - generic [ref=e154]:
              - term [ref=e155]: Escenario
              - definition [ref=e156]: "1"
            - generic [ref=e157]:
              - term [ref=e158]: Reserva ficticia
              - definition [ref=e159]: "1"
            - generic [ref=e160]:
              - term [ref=e161]: Hallazgo heurístico
              - definition [ref=e162]: "1"
            - generic [ref=e163]:
              - term [ref=e164]: Prueba de usabilidad
              - definition [ref=e165]: "3"
            - generic [ref=e166]:
              - term [ref=e167]: Actividad de Conceptos
              - definition [ref=e168]: "1"
            - generic [ref=e169]:
              - term [ref=e170]: Patrón o antipatrón
              - definition [ref=e171]: "1"
            - generic [ref=e172]:
              - term [ref=e173]: SUS
              - definition [ref=e174]: "1"
            - generic [ref=e175]:
              - term [ref=e176]: Raw NASA-TLX
              - definition [ref=e177]: "1"
            - generic [ref=e178]:
              - term [ref=e179]: Experimento de Fitts o Hick
              - definition [ref=e180]: "2"
            - generic [ref=e181]:
              - term [ref=e182]: Rúbrica humana de chatbot
              - definition [ref=e183]: "1"
            - generic [ref=e184]:
              - term [ref=e185]: Decisión humana sobre IA simulada
              - definition [ref=e186]: "1"
            - generic [ref=e187]:
              - term [ref=e188]: Sesiones guardadas de Seguimiento UX
              - definition [ref=e189]: "2"
            - generic [ref=e190]:
              - term [ref=e191]: Actividad multimodal
              - definition [ref=e192]: "1"
            - generic [ref=e193]:
              - term [ref=e194]: Evento del flujo de reserva
              - definition [ref=e195]: "1"
            - generic [ref=e196]:
              - term [ref=e197]: Lista de comprobación de accesibilidad
              - definition [ref=e198]: "1"
          - paragraph [ref=e199]: Indicadores por tarea, condición, versión y método; solo usan valores presentes y finitos. Media = suma / n. Un cero observado se conserva; si falta información no se calcula.
          - paragraph [ref=e200]: "Tiempo: duración registrada en segundos. Errores: conteo observado. Éxito: media de 0/1, proporción de tareas completadas. SUS: puntuación del instrumento (0–100). Raw TLX: promedio sin ponderación de seis dimensiones (0–100). Nunca se promedian tareas ni métodos distintos."
          - group [ref=e201]:
            - generic "Prueba de usabilidad · Legacy task · No registrado · No registrado · Prueba de usabilidad" [ref=e202] [cursor=pointer]
          - group [ref=e203]:
            - generic "Prueba de usabilidad · Reserva · Buena práctica · iteration7 · Prueba de usabilidad" [ref=e204] [cursor=pointer]
          - group [ref=e205]:
            - generic "Prueba de usabilidad · Reserva · Antipatrón · iteration7 · Prueba de usabilidad" [ref=e206] [cursor=pointer]
          - group [ref=e207]:
            - generic "SUS · Reserva · Datos autodeclarados · iteration7 · SUS" [ref=e208] [cursor=pointer]
          - group [ref=e209]:
            - generic "Raw NASA-TLX · Reserva · Datos autodeclarados · iteration7 · Raw NASA-TLX" [ref=e210] [cursor=pointer]
          - group [ref=e211]:
            - 'generic "Experimento de Fitts o Hick · Fitts · Objetivos grandes: 64 px · iteration7 · Fitts · Puntero · Intento medido: 8" [ref=e212] [cursor=pointer]'
          - group [ref=e213]:
            - 'generic "Experimento de Fitts o Hick · Hick · 3 opciones · iteration7 · Hick · Teclado · Intento medido: 8" [ref=e214] [cursor=pointer]'
          - paragraph [ref=e215]: SUS no es un porcentaje de usabilidad. Scroll no demuestra lectura ni comprensión; cursor y simulación no son mirada real. La cámara solo aporta estimaciones con su validación registrada. Una lista de comprobación no certifica accesibilidad. El acuerdo humano–IA no mide precisión del modelo.
        - region [ref=e216]:
          - heading "Evidencias guardadas" [level=2] [ref=e217]
          - generic [ref=e218]:
            - generic [ref=e219]:
              - text: Buscar evidencias
              - searchbox "Buscar evidencias" [ref=e220]
            - generic [ref=e221]:
              - text: Tipo
              - combobox "Tipo" [ref=e222]:
                - option "Todos" [selected]
                - option "Persona y mapa de empatía"
                - option "Escenario"
                - option "Reserva ficticia"
                - option "Hallazgo heurístico"
                - option "Prueba de usabilidad"
                - option "Actividad de Conceptos"
                - option "Patrón o antipatrón"
                - option "SUS"
                - option "Raw NASA-TLX"
                - option "Experimento de Fitts o Hick"
                - option "Rúbrica humana de chatbot"
                - option "Decisión humana sobre IA simulada"
                - option "Sesiones guardadas de Seguimiento UX"
                - option "Actividad multimodal"
                - option "Evento del flujo de reserva"
                - option "Lista de comprobación de accesibilidad"
            - generic [ref=e223]:
              - text: Condición
              - combobox "Condición" [ref=e224]:
                - option "Todos" [selected]
                - option "No registrado"
                - option "Buena práctica"
                - option "Revisado y validado"
                - option "Antipatrón"
                - option "Datos autodeclarados"
                - 'option "Objetivos grandes: 64 px"'
                - 'option "Chatbot B: buena práctica"'
                - option "Aceptar propuesta"
          - generic [ref=e225]:
            - button "Limpiar filtros" [ref=e226] [cursor=pointer]
            - button "Seleccionar todos los registros" [ref=e227] [cursor=pointer]
            - button "Quitar selección" [ref=e228] [cursor=pointer]
          - paragraph [ref=e229]: La búsqueda solo cambia la lista visible; no cambia la selección. Antes de exportar revise todos los registros incluidos en la vista previa.
          - status [ref=e230]: "Registros seleccionados: 20 · Evidencias guardadas: 20/20"
          - article [ref=e231]:
            - generic [ref=e232]:
              - 'checkbox "Incluir en el informe: Persona ficticia Álex" [checked] [ref=e233]'
              - text: "Incluir en el informe: Persona ficticia Álex"
            - group [ref=e234]:
              - generic "Persona y mapa de empatía · Persona ficticia Álex · No registrado" [ref=e235] [cursor=pointer]
          - article [ref=e236]:
            - generic [ref=e237]:
              - 'checkbox "Incluir en el informe: Escenario ficticio" [checked] [ref=e238]'
              - text: "Incluir en el informe: Escenario ficticio"
            - group [ref=e239]:
              - generic "Escenario · Escenario ficticio · No registrado" [ref=e240] [cursor=pointer]
          - article [ref=e241]:
            - generic [ref=e242]:
              - 'checkbox "Incluir en el informe: Asesoría universitaria ficticia" [checked] [ref=e243]'
              - text: "Incluir en el informe: Asesoría universitaria ficticia"
            - group [ref=e244]:
              - generic "Reserva ficticia · Asesoría universitaria ficticia · Buena práctica" [ref=e245] [cursor=pointer]
          - article [ref=e246]:
            - generic [ref=e247]:
              - 'checkbox "Incluir en el informe: Reserva" [checked] [ref=e248]'
              - text: "Incluir en el informe: Reserva"
            - group [ref=e249]:
              - generic "Hallazgo heurístico · Reserva · Revisado y validado" [ref=e250] [cursor=pointer]
          - article [ref=e251]:
            - generic [ref=e252]:
              - 'checkbox "Incluir en el informe: Legacy task" [checked] [ref=e253]'
              - text: "Incluir en el informe: Legacy task"
            - group [ref=e254]:
              - generic "Prueba de usabilidad · Legacy task · No registrado" [ref=e255] [cursor=pointer]
          - article [ref=e256]:
            - generic [ref=e257]:
              - 'checkbox "Incluir en el informe: Emociones" [checked] [ref=e258]'
              - text: "Incluir en el informe: Emociones"
            - group [ref=e259]:
              - generic "Actividad de Conceptos · Emociones · Buena práctica" [ref=e260] [cursor=pointer]
          - article [ref=e261]:
            - generic [ref=e262]:
              - 'checkbox "Incluir en el informe: Formulario" [checked] [ref=e263]'
              - text: "Incluir en el informe: Formulario"
            - group [ref=e264]:
              - generic "Patrón o antipatrón · Formulario · Antipatrón" [ref=e265] [cursor=pointer]
          - article [ref=e266]:
            - generic [ref=e267]:
              - 'checkbox "Incluir en el informe: Reserva" [checked] [ref=e268]'
              - text: "Incluir en el informe: Reserva"
            - group [ref=e269]:
              - generic "Prueba de usabilidad · Reserva · Buena práctica" [ref=e270] [cursor=pointer]
          - article [ref=e271]:
            - generic [ref=e272]:
              - 'checkbox "Incluir en el informe: Reserva" [checked] [ref=e273]'
              - text: "Incluir en el informe: Reserva"
            - group [ref=e274]:
              - generic "Prueba de usabilidad · Reserva · Antipatrón" [ref=e275] [cursor=pointer]
          - article [ref=e276]:
            - generic [ref=e277]:
              - 'checkbox "Incluir en el informe: Reserva" [checked] [ref=e278]'
              - text: "Incluir en el informe: Reserva"
            - group [ref=e279]:
              - generic "SUS · Reserva · Datos autodeclarados" [ref=e280] [cursor=pointer]
          - article [ref=e281]:
            - generic [ref=e282]:
              - 'checkbox "Incluir en el informe: Reserva" [checked] [ref=e283]'
              - text: "Incluir en el informe: Reserva"
            - group [ref=e284]:
              - generic "Raw NASA-TLX · Reserva · Datos autodeclarados" [ref=e285] [cursor=pointer]
          - article [ref=e286]:
            - generic [ref=e287]:
              - 'checkbox "Incluir en el informe: Fitts" [checked] [ref=e288]'
              - text: "Incluir en el informe: Fitts"
            - group [ref=e289]:
              - 'generic "Experimento de Fitts o Hick · Fitts · Objetivos grandes: 64 px" [ref=e290] [cursor=pointer]'
          - article [ref=e291]:
            - generic [ref=e292]:
              - 'checkbox "Incluir en el informe: Hick" [checked] [ref=e293]'
              - text: "Incluir en el informe: Hick"
            - group [ref=e294]:
              - generic "Experimento de Fitts o Hick · Hick · 3 opciones" [ref=e295] [cursor=pointer]
          - article [ref=e296]:
            - generic [ref=e297]:
              - 'checkbox "Incluir en el informe: Reserva" [checked] [ref=e298]'
              - text: "Incluir en el informe: Reserva"
            - group [ref=e299]:
              - 'generic "Rúbrica humana de chatbot · Reserva · Chatbot B: buena práctica" [ref=e300] [cursor=pointer]'
          - article [ref=e301]:
            - generic [ref=e302]:
              - 'checkbox "Incluir en el informe: USER_AI_CONTEXT" [checked] [ref=e303]'
              - text: "Incluir en el informe: USER_AI_CONTEXT"
            - group [ref=e304]:
              - generic "Decisión humana sobre IA simulada · USER_AI_CONTEXT · Aceptar propuesta" [ref=e305] [cursor=pointer]
          - article [ref=e306]:
            - generic [ref=e307]:
              - 'checkbox "Incluir en el informe: USER_TRACK_TASK" [checked] [ref=e308]'
              - text: "Incluir en el informe: USER_TRACK_TASK"
            - group [ref=e309]:
              - generic "Sesiones guardadas de Seguimiento UX · USER_TRACK_TASK · Buena práctica" [ref=e310] [cursor=pointer]
          - article [ref=e311]:
            - generic [ref=e312]:
              - 'checkbox "Incluir en el informe: Sesiones guardadas de Seguimiento UX" [checked] [ref=e313]'
              - text: "Incluir en el informe: Sesiones guardadas de Seguimiento UX"
            - group [ref=e314]:
              - generic "Sesiones guardadas de Seguimiento UX · Sesiones guardadas de Seguimiento UX · Antipatrón" [ref=e315] [cursor=pointer]
          - article [ref=e316]:
            - generic [ref=e317]:
              - 'checkbox "Incluir en el informe: Actividad multimodal" [checked] [ref=e318]'
              - text: "Incluir en el informe: Actividad multimodal"
            - group [ref=e319]:
              - generic "Actividad multimodal · Actividad multimodal · Buena práctica" [ref=e320] [cursor=pointer]
          - article [ref=e321]:
            - generic [ref=e322]:
              - 'checkbox "Incluir en el informe: booking-good" [checked] [ref=e323]'
              - text: "Incluir en el informe: booking-good"
            - group [ref=e324]:
              - generic "Evento del flujo de reserva · booking-good · No registrado" [ref=e325] [cursor=pointer]
          - article [ref=e326]:
            - generic [ref=e327]:
              - 'checkbox "Incluir en el informe: Lista de comprobación de accesibilidad" [checked] [ref=e328]'
              - text: "Incluir en el informe: Lista de comprobación de accesibilidad"
            - group [ref=e329]:
              - generic "Lista de comprobación de accesibilidad · Lista de comprobación de accesibilidad · No registrado" [ref=e330] [cursor=pointer]
        - region [ref=e331]:
          - heading "Generar informe" [level=2] [ref=e332]
          - paragraph [ref=e333]: El borrador y la selección solo se guardan al pulsar Guardar. Exportar usa la vista previa y nunca guarda ni modifica evidencias.
          - paragraph [ref=e334]: "Registros seleccionados: 20"
          - button "Generar informe" [ref=e335] [cursor=pointer]
        - status
```

# Test source

```ts
  1  | import {test,expect} from '@playwright/test';
  2  | import type {Page} from '@playwright/test';
  3  | import AxeBuilder from '@axe-core/playwright';
  4  | import {reportsProject} from '../fixtures/reportsProject';
  5  | import {reportLanguages,reportResources} from '../../src/reports/locales';
  6  | import {collectRecords,emptyDraft,buildReport,blocksMarkdown,evidenceCSV} from '../../src/reports/model';
  7  | import {emptyProject} from '../../src/projectBackup';
  8  | async function seed(page:Page,language='es-CO',theme='light'){await page.addInitScript(({project,language,theme})=>{if(!sessionStorage.getItem('r8seed')){localStorage.setItem('hci-lab-ia-project-v2',JSON.stringify(project));sessionStorage.setItem('r8seed','1');}localStorage.setItem('hci-language',language);localStorage.setItem('hci-prefs-v2',JSON.stringify({dark:theme.includes('dark'),contrast:theme.includes('contrast'),font:100,spacing:false,dyslexia:false,motion:true}));},{project:reportsProject(),language,theme});await page.goto('/hci-lab-ia/#/reports');}
  9  | const snapshot=(page:Page)=>page.evaluate(()=>JSON.parse(localStorage.getItem('hci-lab-ia-project-v2')||'{}'));
  10 | async function preview(page:Page,r=reportResources['es-CO']){await page.getByRole('button',{name:r.generate,exact:true}).click();await page.getByRole('button',{name:r.previewAction,exact:true}).click();await expect(page.getByRole('heading',{name:r.preview,exact:true})).toBeFocused();}
  11 | async function downloaded(page:Page,name:string){const pending=page.waitForEvent('download');await page.getByRole('button',{name,exact:true}).click();const download=await pending,stream=await download.createReadStream();let body='';for await(const chunk of stream!)body+=chunk.toString();return {download,body};}
  12 | test('reports8: empty project guides activities without empty forms or invented metric zeros',async({page})=>{await page.goto('/hci-lab-ia/#/reports');await expect(page.getByRole('heading',{name:'Resumen del proyecto',exact:true})).toBeVisible();await expect(page.locator('.r8 input,.r8 textarea,.r8 select')).toHaveCount(0);await expect(page.locator('.r8')).toContainText('Todavía no hay evidencias');await expect(page.locator('.r8')).not.toContainText('SUS: 0');await expect(page.locator('.r8')).not.toContainText('Media: 0');await expect(page.locator('.r8').getByRole('link',{name:'Actividad de Conceptos',exact:true})).toHaveAttribute('href','#/concepts');expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);});
> 13 | test('reports8: every module, search filters details and explicit selection keep originals intact',async({page})=>{await seed(page);const original=await snapshot(page);const records=collectRecords(original);await expect(page.locator('.r8-record')).toHaveCount(records.length);await page.getByLabel('Tipo',{exact:true}).selectOption('persona');await expect(page.locator('.r8-record')).toHaveCount(1);await page.locator('.r8-record>details>summary').click();for(const text of ['USER_SAYS','USER_THINKS','USER_DOES','USER_FEELS'])await expect(page.locator('.r8-record')).toContainText(text);await page.getByRole('button',{name:'Limpiar filtros'}).click();await page.getByLabel('Buscar evidencias').fill('álex');await expect(page.locator('.r8-record')).toHaveCount(2);await page.getByLabel('Buscar evidencias').fill('no-matches');await expect(page.getByText('No hay registros con estos filtros.',{exact:false})).toBeVisible();await page.getByRole('button',{name:'Limpiar filtros'}).click();await page.getByLabel('Tipo',{exact:true}).selectOption('tracking');await page.getByLabel('Condición',{exact:true}).selectOption('good');await expect(page.locator('.r8-record')).toHaveCount(1);await page.locator('.r8-record>details>summary').click();await expect(page.locator('.r8-record')).toContainText('Mirada estimada por cámara');await page.locator('.r8-record').getByText('Datos originales y muestras',{exact:true}).click();await expect(page.locator('.r8-record pre')).toContainText('"y": 900');await page.getByRole('button',{name:'Quitar selección'}).click();await page.locator('.r8-record input[type=checkbox]').check();await preview(page);await expect(page.locator('.r8-document')).toContainText('USER_TRACK_NOTE');await expect(page.locator('.r8-document')).not.toContainText('USER_NOTE_sus');expect(await snapshot(page)).toEqual(original);});
     |                                                                                                                                                                                                                                                                                                                                ^ Error: locator.selectOption: Test timeout of 30000ms exceeded.
  14 | test('reports8: equivalent comparison, incompatible groups and clear units',async({page})=>{await seed(page);await page.getByRole('button',{name:'Generar informe',exact:true}).click();const before=page.getByRole('group',{name:'Antes',exact:true}),after=page.getByRole('group',{name:'Después',exact:true});await before.getByLabel(/ux-before$/).check();await after.getByLabel(/ux-after$/).check();await expect(page.locator('#r8-comparison').locator('..')).toContainText('20.000 → 10.000');await expect(page.locator('#r8-comparison').locator('..')).toContainText('Diferencia: -10.000');await page.getByLabel('Justificación de comparabilidad').fill('USER_COMPARABILITY: same task and timing method');await page.getByLabel('Incluir comparación justificada').check();await page.getByRole('button',{name:'Revisar vista previa'}).click();await expect(page.locator('.r8-document')).toContainText('USER_COMPARABILITY');await expect(page.locator('.r8-document')).toContainText('no demuestra causalidad');await page.getByLabel('Justificación de comparabilidad').fill('Changed');await expect(page.locator('.r8-preview')).toHaveCount(0);await after.getByLabel(/ux-after$/).uncheck();await after.getByLabel(/sus$/).check();await expect(page.getByText('No se puede comparar:',{exact:false})).toBeVisible();await expect(page.getByLabel('Incluir comparación justificada')).toBeDisabled();});
  15 | for(const lang of reportLanguages)test(`reports8: preview and all file exports agree in ${lang}`,async({page},info)=>{const r=reportResources[lang];await seed(page,lang);const original=await snapshot(page);await preview(page,r);await expect(page.locator('.r8-document')).toContainText(r.identification);await expect(page.locator('.r8-document')).toContainText(r.cautions);await expect(page.locator('.r8-document')).toContainText('USER_FEELS');await expect(page.locator('.r8-document')).not.toContainText('undefined');const md=await downloaded(page,r.md),csv=await downloaded(page,r.csv),json=await downloaded(page,r.json);const data=JSON.parse(json.body),records=collectRecords(original),draft=emptyDraft(records);expect(md.body).toBe(blocksMarkdown(buildReport(records,draft,lang)));expect(csv.body).toBe(evidenceCSV(records,lang));expect(data.report).toBe(md.body);expect(data.records).toHaveLength(records.length);expect(data.records.find((x:{key:string})=>x.key==='pageSessions:page').data.gaze).toEqual(original.pageSessions[0].gaze);expect(await snapshot(page)).toEqual(original);for(const x of [md,csv,json])await x.download.saveAs(info.outputPath(x.download.suggestedFilename()));expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations.map(v=>v.id)).toEqual([]);});
  16 | test('reports8: explicit draft saving reload backup reset and recovery',async({page},info)=>{await seed(page);await page.getByRole('button',{name:'Generar informe',exact:true}).click();await page.getByLabel('Nombre del proyecto',{exact:true}).fill('USER_PROJECT_DRAFT');await page.getByLabel('Interpretación escrita por el estudiante').fill('USER_INTERPRETATION_DRAFT');await page.getByRole('button',{name:'Guardar borrador del informe'}).click();await expect(page.getByText('Borrador guardado.',{exact:true})).toBeVisible();const original=await snapshot(page);await page.reload();await page.getByRole('button',{name:'Generar informe',exact:true}).click();await expect(page.getByLabel('Nombre del proyecto')).toHaveValue('USER_PROJECT_DRAFT');await page.getByRole('button',{name:'Gestionar proyecto',exact:true}).click();const pending=page.waitForEvent('download');await page.getByRole('button',{name:'Descargar respaldo JSON'}).click();const backup=await pending,file=info.outputPath('backup.json');await backup.saveAs(file);await page.getByRole('button',{name:'Restablecer proyecto',exact:true}).click();await page.getByRole('button',{name:'Borrar datos y restablecer'}).click();expect(await snapshot(page)).toEqual(emptyProject());await page.reload();await expect(page.locator('.r8-record')).toHaveCount(0);await page.getByRole('button',{name:'Gestionar proyecto',exact:true}).click();await page.locator('dialog input[type=file]').setInputFiles(file);await page.getByRole('button',{name:'Reemplazar y recuperar'}).click();expect(await snapshot(page)).toEqual(original);await page.getByRole('button',{name:'Generar informe',exact:true}).click();await expect(page.getByLabel('Nombre del proyecto')).toHaveValue('USER_PROJECT_DRAFT');});
  17 | for(const theme of ['light','dark','contrast','dark-contrast'])test(`reports8: keyboard focus themes responsive and print layout in ${theme}`,async({page},info)=>{await seed(page,'es-CO',theme);await page.getByRole('button',{name:'Generar informe',exact:true}).focus();await page.keyboard.press('Enter');await expect(page.getByRole('heading',{name:'Identificación y objetivo del proyecto',exact:true})).toBeFocused();await page.keyboard.press('Tab');await expect(page.getByLabel('Nombre del proyecto')).toBeFocused();await page.getByLabel('Nombre del proyecto').fill('PROYECTO ÁÉÍÓÚ');await page.getByRole('button',{name:'Revisar vista previa'}).click();await expect(page.getByRole('heading',{name:'Vista previa del informe',exact:true})).toBeFocused();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations.map(v=>v.id)).toEqual([]);await page.screenshot({path:info.outputPath(`reports-${theme}.png`)});await page.emulateMedia({media:'print'});await expect(page.locator('.r8-filters')).not.toBeVisible();await expect(page.locator('.r8-document')).toBeVisible();expect(await page.locator('.r8-document').evaluate(el=>[...el.querySelectorAll('td')].every(cell=>cell.scrollWidth<=cell.clientWidth+1))).toBe(true);if(info.project.name==='desktop-chromium'&&theme==='light')await page.pdf({path:info.outputPath('informe-impresion.pdf'),preferCSSPageSize:true,printBackground:true});});
  18 | 
```