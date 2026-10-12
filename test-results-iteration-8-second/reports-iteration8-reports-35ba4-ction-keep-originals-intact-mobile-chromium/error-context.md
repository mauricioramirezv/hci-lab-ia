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
  - generic [ref=e5]:
    - banner [ref=e6]:
      - button "Abrir menú" [ref=e7] [cursor=pointer]
      - strong [ref=e10]: HCI Lab + IA
      - complementary [ref=e11]:
        - button "Seguimiento de página" [ref=e12] [cursor=pointer]
      - button "Gestionar proyecto" [ref=e14] [cursor=pointer]
      - generic [ref=e15]:
        - generic [ref=e20]: Idioma
        - combobox "Idioma" [ref=e21]:
          - option "ES" [selected]
          - option "EN"
          - option "PT"
          - option "FR"
          - option "IT"
          - option "CA"
      - button "Oscuro" [ref=e22] [cursor=pointer]
    - main [ref=e25]:
      - generic [ref=e26]:
        - generic [ref=e29]:
          - text: HCI LAB + IA
          - heading "Informes del proyecto" [level=1] [ref=e30]
          - paragraph [ref=e31]: Revise evidencias con contexto, seleccione registros y prepare un informe sin modificar los datos originales.
        - region [ref=e32]:
          - heading "Resumen del proyecto" [level=2] [ref=e33]
          - generic [ref=e34]:
            - generic [ref=e35]:
              - term [ref=e36]: Persona y mapa de empatía
              - definition [ref=e37]: "1"
            - generic [ref=e38]:
              - term [ref=e39]: Escenario
              - definition [ref=e40]: "1"
            - generic [ref=e41]:
              - term [ref=e42]: Reserva ficticia
              - definition [ref=e43]: "1"
            - generic [ref=e44]:
              - term [ref=e45]: Hallazgo heurístico
              - definition [ref=e46]: "1"
            - generic [ref=e47]:
              - term [ref=e48]: Prueba de usabilidad
              - definition [ref=e49]: "3"
            - generic [ref=e50]:
              - term [ref=e51]: Actividad de Conceptos
              - definition [ref=e52]: "1"
            - generic [ref=e53]:
              - term [ref=e54]: Patrón o antipatrón
              - definition [ref=e55]: "1"
            - generic [ref=e56]:
              - term [ref=e57]: SUS
              - definition [ref=e58]: "1"
            - generic [ref=e59]:
              - term [ref=e60]: Raw NASA-TLX
              - definition [ref=e61]: "1"
            - generic [ref=e62]:
              - term [ref=e63]: Experimento de Fitts o Hick
              - definition [ref=e64]: "2"
            - generic [ref=e65]:
              - term [ref=e66]: Rúbrica humana de chatbot
              - definition [ref=e67]: "1"
            - generic [ref=e68]:
              - term [ref=e69]: Decisión humana sobre IA simulada
              - definition [ref=e70]: "1"
            - generic [ref=e71]:
              - term [ref=e72]: Sesiones guardadas de Seguimiento UX
              - definition [ref=e73]: "2"
            - generic [ref=e74]:
              - term [ref=e75]: Actividad multimodal
              - definition [ref=e76]: "1"
            - generic [ref=e77]:
              - term [ref=e78]: Evento del flujo de reserva
              - definition [ref=e79]: "1"
            - generic [ref=e80]:
              - term [ref=e81]: Lista de comprobación de accesibilidad
              - definition [ref=e82]: "1"
          - paragraph [ref=e83]: Indicadores por tarea, condición, versión y método; solo usan valores presentes y finitos. Media = suma / n. Un cero observado se conserva; si falta información no se calcula.
          - paragraph [ref=e84]: "Tiempo: duración registrada en segundos. Errores: conteo observado. Éxito: media de 0/1, proporción de tareas completadas. SUS: puntuación del instrumento (0–100). Raw TLX: promedio sin ponderación de seis dimensiones (0–100). Nunca se promedian tareas ni métodos distintos."
          - group [ref=e85]:
            - generic "Prueba de usabilidad · Legacy task · No registrado · No registrado · Prueba de usabilidad" [ref=e86] [cursor=pointer]
          - group [ref=e87]:
            - generic "Prueba de usabilidad · Reserva · Buena práctica · iteration7 · Prueba de usabilidad" [ref=e88] [cursor=pointer]
          - group [ref=e89]:
            - generic "Prueba de usabilidad · Reserva · Antipatrón · iteration7 · Prueba de usabilidad" [ref=e90] [cursor=pointer]
          - group [ref=e91]:
            - generic "SUS · Reserva · Datos autodeclarados · iteration7 · SUS" [ref=e92] [cursor=pointer]
          - group [ref=e93]:
            - generic "Raw NASA-TLX · Reserva · Datos autodeclarados · iteration7 · Raw NASA-TLX" [ref=e94] [cursor=pointer]
          - group [ref=e95]:
            - 'generic "Experimento de Fitts o Hick · Fitts · Objetivos grandes: 64 px · iteration7 · Fitts · Puntero · Intento medido: 8" [ref=e96] [cursor=pointer]'
          - group [ref=e97]:
            - 'generic "Experimento de Fitts o Hick · Hick · 3 opciones · iteration7 · Hick · Teclado · Intento medido: 8" [ref=e98] [cursor=pointer]'
          - paragraph [ref=e99]: SUS no es un porcentaje de usabilidad. Scroll no demuestra lectura ni comprensión; cursor y simulación no son mirada real. La cámara solo aporta estimaciones con su validación registrada. Una lista de comprobación no certifica accesibilidad. El acuerdo humano–IA no mide precisión del modelo.
        - region [ref=e100]:
          - heading "Evidencias guardadas" [level=2] [ref=e101]
          - generic [ref=e102]:
            - generic [ref=e103]:
              - text: Buscar evidencias
              - searchbox "Buscar evidencias" [ref=e104]
            - generic [ref=e105]:
              - text: Tipo
              - combobox "Tipo" [ref=e106]:
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
            - generic [ref=e107]:
              - text: Condición
              - combobox "Condición" [ref=e108]:
                - option "Todos" [selected]
                - option "No registrado"
                - option "Buena práctica"
                - option "Revisado y validado"
                - option "Antipatrón"
                - option "Datos autodeclarados"
                - 'option "Objetivos grandes: 64 px"'
                - 'option "Chatbot B: buena práctica"'
                - option "Aceptar propuesta"
          - generic [ref=e109]:
            - button "Limpiar filtros" [ref=e110] [cursor=pointer]
            - button "Seleccionar todos los registros" [ref=e111] [cursor=pointer]
            - button "Quitar selección" [ref=e112] [cursor=pointer]
          - paragraph [ref=e113]: La búsqueda solo cambia la lista visible; no cambia la selección. Antes de exportar revise todos los registros incluidos en la vista previa.
          - status [ref=e114]: "Registros seleccionados: 20 · Evidencias guardadas: 20/20"
          - article [ref=e115]:
            - generic [ref=e116]:
              - 'checkbox "Incluir en el informe: Persona ficticia Álex" [checked] [ref=e117]'
              - text: "Incluir en el informe: Persona ficticia Álex"
            - group [ref=e118]:
              - generic "Persona y mapa de empatía · Persona ficticia Álex · No registrado" [ref=e119] [cursor=pointer]
          - article [ref=e120]:
            - generic [ref=e121]:
              - 'checkbox "Incluir en el informe: Escenario ficticio" [checked] [ref=e122]'
              - text: "Incluir en el informe: Escenario ficticio"
            - group [ref=e123]:
              - generic "Escenario · Escenario ficticio · No registrado" [ref=e124] [cursor=pointer]
          - article [ref=e125]:
            - generic [ref=e126]:
              - 'checkbox "Incluir en el informe: Asesoría universitaria ficticia" [checked] [ref=e127]'
              - text: "Incluir en el informe: Asesoría universitaria ficticia"
            - group [ref=e128]:
              - generic "Reserva ficticia · Asesoría universitaria ficticia · Buena práctica" [ref=e129] [cursor=pointer]
          - article [ref=e130]:
            - generic [ref=e131]:
              - 'checkbox "Incluir en el informe: Reserva" [checked] [ref=e132]'
              - text: "Incluir en el informe: Reserva"
            - group [ref=e133]:
              - generic "Hallazgo heurístico · Reserva · Revisado y validado" [ref=e134] [cursor=pointer]
          - article [ref=e135]:
            - generic [ref=e136]:
              - 'checkbox "Incluir en el informe: Legacy task" [checked] [ref=e137]'
              - text: "Incluir en el informe: Legacy task"
            - group [ref=e138]:
              - generic "Prueba de usabilidad · Legacy task · No registrado" [ref=e139] [cursor=pointer]
          - article [ref=e140]:
            - generic [ref=e141]:
              - 'checkbox "Incluir en el informe: Emociones" [checked] [ref=e142]'
              - text: "Incluir en el informe: Emociones"
            - group [ref=e143]:
              - generic "Actividad de Conceptos · Emociones · Buena práctica" [ref=e144] [cursor=pointer]
          - article [ref=e145]:
            - generic [ref=e146]:
              - 'checkbox "Incluir en el informe: Formulario" [checked] [ref=e147]'
              - text: "Incluir en el informe: Formulario"
            - group [ref=e148]:
              - generic "Patrón o antipatrón · Formulario · Antipatrón" [ref=e149] [cursor=pointer]
          - article [ref=e150]:
            - generic [ref=e151]:
              - 'checkbox "Incluir en el informe: Reserva" [checked] [ref=e152]'
              - text: "Incluir en el informe: Reserva"
            - group [ref=e153]:
              - generic "Prueba de usabilidad · Reserva · Buena práctica" [ref=e154] [cursor=pointer]
          - article [ref=e155]:
            - generic [ref=e156]:
              - 'checkbox "Incluir en el informe: Reserva" [checked] [ref=e157]'
              - text: "Incluir en el informe: Reserva"
            - group [ref=e158]:
              - generic "Prueba de usabilidad · Reserva · Antipatrón" [ref=e159] [cursor=pointer]
          - article [ref=e160]:
            - generic [ref=e161]:
              - 'checkbox "Incluir en el informe: Reserva" [checked] [ref=e162]'
              - text: "Incluir en el informe: Reserva"
            - group [ref=e163]:
              - generic "SUS · Reserva · Datos autodeclarados" [ref=e164] [cursor=pointer]
          - article [ref=e165]:
            - generic [ref=e166]:
              - 'checkbox "Incluir en el informe: Reserva" [checked] [ref=e167]'
              - text: "Incluir en el informe: Reserva"
            - group [ref=e168]:
              - generic "Raw NASA-TLX · Reserva · Datos autodeclarados" [ref=e169] [cursor=pointer]
          - article [ref=e170]:
            - generic [ref=e171]:
              - 'checkbox "Incluir en el informe: Fitts" [checked] [ref=e172]'
              - text: "Incluir en el informe: Fitts"
            - group [ref=e173]:
              - 'generic "Experimento de Fitts o Hick · Fitts · Objetivos grandes: 64 px" [ref=e174] [cursor=pointer]'
          - article [ref=e175]:
            - generic [ref=e176]:
              - 'checkbox "Incluir en el informe: Hick" [checked] [ref=e177]'
              - text: "Incluir en el informe: Hick"
            - group [ref=e178]:
              - generic "Experimento de Fitts o Hick · Hick · 3 opciones" [ref=e179] [cursor=pointer]
          - article [ref=e180]:
            - generic [ref=e181]:
              - 'checkbox "Incluir en el informe: Reserva" [checked] [ref=e182]'
              - text: "Incluir en el informe: Reserva"
            - group [ref=e183]:
              - 'generic "Rúbrica humana de chatbot · Reserva · Chatbot B: buena práctica" [ref=e184] [cursor=pointer]'
          - article [ref=e185]:
            - generic [ref=e186]:
              - 'checkbox "Incluir en el informe: USER_AI_CONTEXT" [checked] [ref=e187]'
              - text: "Incluir en el informe: USER_AI_CONTEXT"
            - group [ref=e188]:
              - generic "Decisión humana sobre IA simulada · USER_AI_CONTEXT · Aceptar propuesta" [ref=e189] [cursor=pointer]
          - article [ref=e190]:
            - generic [ref=e191]:
              - 'checkbox "Incluir en el informe: USER_TRACK_TASK" [checked] [ref=e192]'
              - text: "Incluir en el informe: USER_TRACK_TASK"
            - group [ref=e193]:
              - generic "Sesiones guardadas de Seguimiento UX · USER_TRACK_TASK · Buena práctica" [ref=e194] [cursor=pointer]
          - article [ref=e195]:
            - generic [ref=e196]:
              - 'checkbox "Incluir en el informe: Sesiones guardadas de Seguimiento UX" [checked] [ref=e197]'
              - text: "Incluir en el informe: Sesiones guardadas de Seguimiento UX"
            - group [ref=e198]:
              - generic "Sesiones guardadas de Seguimiento UX · Sesiones guardadas de Seguimiento UX · Antipatrón" [ref=e199] [cursor=pointer]
          - article [ref=e200]:
            - generic [ref=e201]:
              - 'checkbox "Incluir en el informe: Actividad multimodal" [checked] [ref=e202]'
              - text: "Incluir en el informe: Actividad multimodal"
            - group [ref=e203]:
              - generic "Actividad multimodal · Actividad multimodal · Buena práctica" [ref=e204] [cursor=pointer]
          - article [ref=e205]:
            - generic [ref=e206]:
              - 'checkbox "Incluir en el informe: booking-good" [checked] [ref=e207]'
              - text: "Incluir en el informe: booking-good"
            - group [ref=e208]:
              - generic "Evento del flujo de reserva · booking-good · No registrado" [ref=e209] [cursor=pointer]
          - article [ref=e210]:
            - generic [ref=e211]:
              - 'checkbox "Incluir en el informe: Lista de comprobación de accesibilidad" [checked] [ref=e212]'
              - text: "Incluir en el informe: Lista de comprobación de accesibilidad"
            - group [ref=e213]:
              - generic "Lista de comprobación de accesibilidad · Lista de comprobación de accesibilidad · No registrado" [ref=e214] [cursor=pointer]
        - region [ref=e215]:
          - heading "Generar informe" [level=2] [ref=e216]
          - paragraph [ref=e217]: El borrador y la selección solo se guardan al pulsar Guardar. Exportar usa la vista previa y nunca guarda ni modifica evidencias.
          - paragraph [ref=e218]: "Registros seleccionados: 20"
          - button "Generar informe" [ref=e219] [cursor=pointer]
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