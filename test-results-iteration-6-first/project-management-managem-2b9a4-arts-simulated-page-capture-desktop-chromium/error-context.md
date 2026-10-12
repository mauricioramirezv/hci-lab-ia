# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: project-management.spec.ts >> management: reset aborts active microphone and speech, clears forms and restarts simulated page capture
- Location: tests\e2e\project-management.spec.ts:123:1

# Error details

```
Error: expect(locator).toBeFocused() failed

Locator: locator('[data-management-notice]')
Expected: focused
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeFocused" locator('[data-management-notice]') with timeout 5000ms
  - waiting for locator('[data-management-notice]')

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
  - text: HCI · v2.2
  - heading "Interacción multimodal" [level=1]
  - paragraph: Compare contextos, pruebe canales de respuesta y guarde observaciones propias.
  - text: Dispositivo
  - combobox "Dispositivo":
    - option "PC"
    - option "Tableta"
    - option "Celular"
    - option "Smartwatch" [selected]
    - option "Vehículo"
    - option "Televisión"
    - option "Kiosco"
    - option "IoT"
  - text: Práctica
  - combobox "Práctica":
    - option "Buena práctica" [selected]
    - option "Mala práctica"
  - heading "Demostración de tarea · Smartwatch" [level=2]
  - paragraph: "Simulación educativa: no controla dispositivos físicos."
  - text: 10:30
  - paragraph: Cita mañana a las 10:30
  - button "Confirmar"
  - button "Cancelar"
  - status "Estado de la demostración": Pendiente
  - heading "Color y señales redundantes" [level=2]
  - text: Percepción del color
  - combobox "Percepción del color":
    - option "Visión normal" [selected]
    - option "Protanopia"
    - option "Deuteranopia"
    - option "Tritanopia"
    - option "Acromatopsia"
  - strong: "Error: falta confirmar"
  - strong: Confirmado
  - strong: Pendiente
  - paragraph: "Compare estados con color solo y con texto + símbolo. WCAG 1.4.1: no comunicar información únicamente mediante color."
  - paragraph: "Filtros didácticos aproximados: no reproducen la percepción individual ni certifican accesibilidad."
  - link "WCAG 1.4.1":
    - /url: https://www.w3.org/WAI/WCAG22/Understanding/use-of-color
  - heading "Voz y alternativa escrita" [level=2]
  - text: Comando (confirmar, cancelar, navegar)
  - textbox "Comando (confirmar, cancelar, navegar)"
  - button "Ejecutar comando"
  - button "Leer estado"
  - button "Activar micrófono"
  - button "Detener voz"
  - paragraph: El reconocimiento puede enviar audio al servicio del navegador. Actívelo solo si acepta; la alternativa escrita está siempre disponible.
  - heading "Alerta por múltiples canales" [level=2]
  - paragraph: "Alerta visual: revise la cita"
  - button "Probar vibración"
  - button "Probar sonido"
  - heading "Comparación de dispositivos" [level=2]
  - region "Comparación de dispositivos":
    - 'table "Simulación educativa: no controla dispositivos físicos."':
      - caption: "Simulación educativa: no controla dispositivos físicos."
      - rowgroup:
        - row "Dispositivo Contexto Atención disponible Entrada Ergonomía Riesgo contextual Adaptación accesible":
          - columnheader "Dispositivo"
          - columnheader "Contexto"
          - columnheader "Atención disponible"
          - columnheader "Entrada"
          - columnheader "Ergonomía"
          - columnheader "Riesgo contextual"
          - columnheader "Adaptación accesible"
      - rowgroup:
        - row "PC Trabajo sentado Sostenida Teclado / ratón Postura y atajos Fatiga Teclado y zoom":
          - rowheader "PC"
          - cell "Trabajo sentado"
          - cell "Sostenida"
          - cell "Teclado / ratón"
          - cell "Postura y atajos"
          - cell "Fatiga"
          - cell "Teclado y zoom"
        - row "Tableta Uso en mano Intermitente Táctil / teclado Peso y alcance Precisión táctil Orientación y objetivos amplios":
          - rowheader "Tableta"
          - cell "Uso en mano"
          - cell "Intermitente"
          - cell "Táctil / teclado"
          - cell "Peso y alcance"
          - cell "Precisión táctil"
          - cell "Orientación y objetivos amplios"
        - row "Celular Movilidad Interrumpida Táctil / voz Una mano Distracción Texto escalable y foco":
          - rowheader "Celular"
          - cell "Movilidad"
          - cell "Interrumpida"
          - cell "Táctil / voz"
          - cell "Una mano"
          - cell "Distracción"
          - cell "Texto escalable y foco"
        - row "Smartwatch Consulta breve De un vistazo Táctil / voz Pantalla mínima Omisión de alertas Texto, voz y vibración opcional":
          - rowheader "Smartwatch"
          - cell "Consulta breve"
          - cell "De un vistazo"
          - cell "Táctil / voz"
          - cell "Pantalla mínima"
          - cell "Omisión de alertas"
          - cell "Texto, voz y vibración opcional"
        - row "Vehículo Conducción simulada Primaria en la vía Voz preferente Distancia de alcance Distracción crítica Bloquear edición en movimiento":
          - rowheader "Vehículo"
          - cell "Conducción simulada"
          - cell "Primaria en la vía"
          - cell "Voz preferente"
          - cell "Distancia de alcance"
          - cell "Distracción crítica"
          - cell "Bloquear edición en movimiento"
        - row "Televisión Sala de estar A distancia Control / teclado Distancia de lectura Foco perdido Foco visible y texto grande":
          - rowheader "Televisión"
          - cell "Sala de estar"
          - cell "A distancia"
          - cell "Control / teclado"
          - cell "Distancia de lectura"
          - cell "Foco perdido"
          - cell "Foco visible y texto grande"
        - row "Kiosco Servicio público Limitada por fila Táctil / teclado Altura y alcance Privacidad compartida Alcance y salida clara":
          - rowheader "Kiosco"
          - cell "Servicio público"
          - cell "Limitada por fila"
          - cell "Táctil / teclado"
          - cell "Altura y alcance"
          - cell "Privacidad compartida"
          - cell "Alcance y salida clara"
        - row "IoT Hogar conectado Variable Voz / controles Ubicación física Estado incierto Estado textual y control alternativo":
          - rowheader "IoT"
          - cell "Hogar conectado"
          - cell "Variable"
          - cell "Voz / controles"
          - cell "Ubicación física"
          - cell "Estado incierto"
          - cell "Estado textual y control alternativo"
  - heading "Guardar evidencia" [level=2]
  - paragraph: Describa lo que comprobó. El laboratorio no inventa resultados de usabilidad.
  - text: Observación, problema y corrección propuesta
  - textbox "Observación, problema y corrección propuesta"
  - text: Confianza percibida (autoinforme de 1 a 5)
  - combobox "Confianza percibida (autoinforme de 1 a 5)":
    - option "1"
    - option "2"
    - option "3" [selected]
    - option "4"
    - option "5"
  - button "Guardar evidencia"
  - status
  - heading "Evidencias guardadas" [level=3]
  - paragraph: Aún no hay evidencias.
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import type { Page } from '@playwright/test';
  3   | import AxeBuilder from '@axe-core/playwright';
  4   | import { representativeProject } from '../fixtures/representativeProject';
  5   | import { sampleProject } from '../../src/domain';
  6   | import { defaultPrefs, emptyProject, createBackup } from '../../src/projectBackup';
  7   | import { manageResources } from '../../src/manageLocales';
  8   | 
  9   | const project=representativeProject();
  10  | const prefs={...defaultPrefs,dark:true,font:125,spacing:true,motion:true};
  11  | async function seed(page:Page,language='es-CO') {
  12  |   await page.addInitScript(({project,prefs,language})=>{
  13  |     if (!sessionStorage.getItem('management-test-seeded')) {
  14  |       localStorage.setItem('hci-lab-ia-project-v2',JSON.stringify(project));
  15  |       localStorage.setItem('hci-prefs-v2',JSON.stringify(prefs));
  16  |       localStorage.setItem('hci-language',language);
  17  |       sessionStorage.setItem('management-test-seeded','yes');
  18  |     }
  19  |   },{project,prefs,language});
  20  | }
  21  | const snapshot=(page:Page)=>page.evaluate(()=>({project:JSON.parse(localStorage.getItem('hci-lab-ia-project-v2')!),prefs:JSON.parse(localStorage.getItem('hci-prefs-v2')!),language:localStorage.getItem('hci-language')}));
  22  | async function open(page:Page,language:keyof typeof manageResources='es-CO') {
  23  |   await page.getByRole('button',{name:manageResources[language].title,exact:true}).click();
  24  |   await expect(page.getByRole('dialog')).toBeVisible();
  25  | }
  26  | async function reset(page:Page,language:keyof typeof manageResources='es-CO') {
  27  |   await open(page,language);
  28  |   await page.getByRole('button',{name:manageResources[language].reset,exact:true}).click();
  29  |   await page.getByRole('button',{name:manageResources[language].confirmReset,exact:true}).click();
> 30  |   await expect(page.locator('[data-management-notice]')).toBeFocused();
      |                                                          ^ Error: expect(locator).toBeFocused() failed
  31  | }
  32  | async function upload(page:Page,content:string) {
  33  |   await page.locator('dialog input[type=file]').evaluate((node,content)=>{
  34  |     const input=node as HTMLInputElement, transfer=new DataTransfer();
  35  |     transfer.items.add(new File([content],'project.json',{type:'application/json'}));
  36  |     input.files=transfer.files;input.dispatchEvent(new Event('change',{bubbles:true}));
  37  |   },content);
  38  | }
  39  | 
  40  | test('management: cancel is unchanged; reset clears every collection and preferences across reload, preserving language',async({page})=>{
  41  |   await seed(page,'en-US');await page.goto('/hci-lab-ia/#/research');
  42  |   const before=await snapshot(page);
  43  |   await open(page,'en-US');await page.getByRole('button',{name:manageResources['en-US'].reset,exact:true}).click();
  44  |   await expect(page.getByRole('dialog')).toHaveAccessibleName(manageResources['en-US'].resetTitle);
  45  |   await expect(page.getByRole('dialog')).toHaveAccessibleDescription(manageResources['en-US'].resetWarning);
  46  |   await expect(page.getByRole('button',{name:manageResources['en-US'].cancel,exact:true})).toBeFocused();
  47  |   await page.keyboard.press('Enter');expect(await snapshot(page)).toEqual(before);
  48  |   await expect(page.getByRole('button',{name:manageResources['en-US'].title,exact:true})).toBeFocused();
  49  |   await reset(page,'en-US');
  50  |   await expect(page.locator('[data-management-notice]')).toHaveText(manageResources['en-US'].resetDone);
  51  |   expect(await snapshot(page)).toEqual({project:emptyProject(),prefs:defaultPrefs,language:'en-US'});
  52  |   await page.reload();expect(await snapshot(page)).toEqual({project:emptyProject(),prefs:defaultPrefs,language:'en-US'});
  53  |   await expect(page.locator('main')).toHaveAttribute('lang','en-US');
  54  | });
  55  | 
  56  | test('management: export and recover all modules with settings; cancel and confirmation are transactional',async({page},testInfo)=>{
  57  |   await seed(page,'ca-ES');await page.goto('/hci-lab-ia/#/reports');const before=await snapshot(page);
  58  |   await open(page,'ca-ES');const downloadPromise=page.waitForEvent('download');
  59  |   await page.getByRole('button',{name:manageResources['ca-ES'].backup,exact:true}).click();
  60  |   const file=testInfo.outputPath('complete-project.json');await (await downloadPromise).saveAs(file);
  61  |   expect(await snapshot(page)).toEqual(before);await page.keyboard.press('Escape');
  62  |   await reset(page,'ca-ES');const cleared=await snapshot(page);
  63  |   await open(page,'ca-ES');await page.locator('dialog input[type=file]').setInputFiles(file);
  64  |   await expect(page.getByRole('button',{name:manageResources['ca-ES'].confirmRecover})).toBeVisible();
  65  |   await expect(page.getByRole('dialog')).toHaveAccessibleName(manageResources['ca-ES'].recoverTitle);
  66  |   await expect(page.getByRole('dialog')).toHaveAccessibleDescription(manageResources['ca-ES'].recoverWarning);
  67  |   expect(await snapshot(page)).toEqual(cleared);await page.keyboard.press('Escape');expect(await snapshot(page)).toEqual(cleared);
  68  |   await open(page,'ca-ES');await page.locator('dialog input[type=file]').setInputFiles(file);
  69  |   await page.getByRole('button',{name:manageResources['ca-ES'].confirmRecover}).click();
  70  |   await expect(page.locator('[data-management-notice]')).toHaveText(manageResources['ca-ES'].recoverDone);
  71  |   expect(await snapshot(page)).toEqual(before);await page.reload();expect(await snapshot(page)).toEqual(before);
  72  | });
  73  | 
  74  | test('management: rejects invalid JSON, incomplete structure, versions and nested fields without changes; recovers legacy v2',async({page})=>{
  75  |   await seed(page);await page.goto('/hci-lab-ia/');const before=await snapshot(page);await open(page);
  76  |   for (const content of ['{',JSON.stringify({version:2}),JSON.stringify({...project,version:9}),JSON.stringify({...project,pageSessions:[{id:'invalid'}]})]) {
  77  |     await upload(page,content);await expect(page.getByRole('alert')).toHaveText(manageResources['es-CO'].invalid);
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
```