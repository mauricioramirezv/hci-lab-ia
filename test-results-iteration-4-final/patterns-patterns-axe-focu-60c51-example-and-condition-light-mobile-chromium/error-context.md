# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: patterns.spec.ts >> patterns: axe, focus and responsive layout for every example and condition, light
- Location: tests\e2e\patterns.spec.ts:81:3

# Error details

```
Error: choice good before

expect(received).toEqual(expected) // deep equality

- Expected  -  1
+ Received  + 52

- Array []
+ Array [
+   Object {
+     "description": "Ensure elements that have scrollable content are accessible by keyboard in Safari",
+     "help": "Scrollable region must have keyboard access",
+     "helpUrl": "https://dequeuniversity.com/rules/axe/4.13/scrollable-region-focusable?application=playwright",
+     "id": "scrollable-region-focusable",
+     "impact": "serious",
+     "nodes": Array [
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": null,
+             "id": "focusable-content",
+             "impact": "serious",
+             "message": "Element should have focusable content",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": null,
+             "id": "focusable-element",
+             "impact": "serious",
+             "message": "Element should be focusable",
+             "relatedNodes": Array [],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element should have focusable content
+   Element should be focusable",
+         "html": "<div class=\"pattern-table-wrap\">",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".pattern-table-wrap",
+         ],
+       },
+     ],
+     "tags": Array [
+       "cat.keyboard",
+       "wcag2a",
+       "wcag211",
+       "wcag213",
+       "TTv5",
+       "TT4.a",
+       "EN-301-549",
+       "EN-9.2.1.1",
+       "EN-9.2.1.3",
+       "RGAAv4",
+       "RGAA-7.3.2",
+     ],
+   },
+ ]
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
      - complementary "Controles de seguimiento de la página" [ref=e11]:
        - button "Seguimiento de página" [ref=e12] [cursor=pointer]
      - button "Gestionar proyecto" [ref=e15] [cursor=pointer]
      - generic [ref=e16]:
        - generic [ref=e21]: Idioma
        - combobox "Idioma" [ref=e22]:
          - option "ES" [selected]
          - option "EN"
          - option "PT"
          - option "FR"
          - option "IT"
          - option "CA"
      - button "Oscuro" [ref=e23] [cursor=pointer]
    - main [ref=e26]:
      - generic [ref=e27]:
        - generic [ref=e29]:
          - text: IHC · CATÁLOGO DE PRÁCTICAS
          - heading "Patrones y antipatrones" [level=1] [ref=e30]
          - paragraph [ref=e31]: Explore seis problemas de diseño, pruebe ejemplos propios y registre su diagnóstico y propuesta de mejora.
        - region [ref=e32]:
          - generic [ref=e33]:
            - heading "Decisiones" [active] [level=2] [ref=e34]
            - generic [ref=e35]:
              - text: Condición
              - combobox "Condición" [ref=e36]:
                - option "Buena práctica" [selected]
                - option "Antipatrón"
          - paragraph [ref=e37]: Cambiar de condición reinicia navegación, progreso y elecciones. Conserva los textos escritos y las observaciones guardadas.
          - heading "Instrucciones" [level=3] [ref=e38]
          - paragraph [ref=e39]: Compare capacidad y coste anual para guardar 3 GB. Elija y continúe, o cancele. Ninguna elección se califica automáticamente como correcta.
          - paragraph [ref=e40]:
            - strong [ref=e41]: "Buena práctica:"
            - text: Opciones comparables, recomendación explicada y salida disponible.
          - heading "Heurística de Nielsen" [level=3] [ref=e42]
          - paragraph [ref=e43]: Control y libertad del usuario
          - paragraph [ref=e44]: Comparar antes de decidir y disponer de una salida mantiene el control, incluso si se ofrece una recomendación.
          - paragraph [ref=e45]:
            - strong [ref=e46]: "Recomendación de mejora:"
            - text: Explicar coste total y criterio de recomendación; evitar preselecciones interesadas y ofrecer cancelar.
          - generic [ref=e47]:
            - heading "Ejemplo interactivo" [level=3] [ref=e48]
            - paragraph [ref=e49]: "Demostración local: no envía solicitudes, contrata servicios ni solicita permisos reales. Los problemas se limitan a la muestra."
            - paragraph [ref=e50]: Compare planes para almacenar 3 GB durante un año. Los precios son ficticios, expresados en fichas; no se contrata ningún servicio.
            - generic [ref=e51]:
              - table [ref=e53]:
                - caption [ref=e54]: Comparar características y coste anual
                - rowgroup [ref=e55]:
                  - row [ref=e56]:
                    - columnheader "Plan elegido" [ref=e57]
                    - columnheader "Capacidad" [ref=e58]
                    - columnheader "Fichas al mes" [ref=e59]
                    - columnheader "Fichas al año" [ref=e60]
                - rowgroup [ref=e61]:
                  - row [ref=e62]:
                    - rowheader "Básico" [ref=e63]
                    - cell "5 GB" [ref=e64]
                    - cell "0" [ref=e65]
                    - cell "0" [ref=e66]
                  - row [ref=e67]:
                    - rowheader "Avanzado" [ref=e68]
                    - cell "50 GB" [ref=e69]
                    - cell "12" [ref=e70]
                    - cell "144" [ref=e71]
              - paragraph [ref=e72]: Básico cubre los 3 GB del ejercicio sin coste. La recomendación se basa en esa necesidad; usted puede decidir otra opción.
              - group "Plan elegido" [ref=e73]:
                - generic [ref=e75]:
                  - radio "Básico" [ref=e76]
                  - text: Básico
                - generic [ref=e77]:
                  - radio "Avanzado" [ref=e78]
                  - text: Avanzado
            - generic [ref=e79]:
              - button "Comparar características y coste anual" [ref=e80] [cursor=pointer]
              - button "Continuar con el plan elegido" [ref=e81] [cursor=pointer]
              - button "Cancelar" [ref=e82] [cursor=pointer]
            - generic [ref=e83]:
              - heading "Estado del ejemplo" [level=4] [ref=e84]
              - status [ref=e85]: Listo para probar
          - button "Reiniciar ejemplo" [ref=e87] [cursor=pointer]
          - generic [ref=e88]:
            - heading "Registrar evidencia" [level=3] [ref=e89]
            - paragraph [ref=e90]: Registre su propia observación. No se generan puntuaciones ni conclusiones automáticas.
            - generic [ref=e91]:
              - text: Alias opcional
              - textbox "Alias opcional" [ref=e92]
            - paragraph [ref=e93]: Puede editar o dejar vacío el alias. Se reutiliza el último alias guardado si está disponible; no se exige identificación.
            - generic [ref=e94]:
              - text: Problema que identificó
              - textbox "Problema que identificó" [ref=e95]
            - generic [ref=e96]:
              - text: Principio afectado
              - textbox "Principio afectado" [ref=e97]
            - generic [ref=e98]:
              - text: Cómo lo corregiría
              - textbox "Cómo lo corregiría" [ref=e99]
            - generic [ref=e100]:
              - button "Guardar observación" [ref=e101] [cursor=pointer]
              - link "Consultar evidencia en Informes" [ref=e102] [cursor=pointer]:
                - /url: "#/reports"
          - button "Volver al catálogo" [ref=e104] [cursor=pointer]
```

# Test source

```ts
  1   | import {test,expect} from '@playwright/test';
  2   | import type {Page} from '@playwright/test';
  3   | import AxeBuilder from '@axe-core/playwright';
  4   | import {patternResources} from '../../src/enhancements/patterns/locales';
  5   | import {patternIds} from '../../src/enhancements/patterns/model';
  6   | import type {PatternId} from '../../src/enhancements/patterns/model';
  7   | import {emptyProject} from '../../src/projectBackup';
  8   | import {representativeProject} from '../fixtures/representativeProject';
  9   | import {manageResources} from '../../src/manageLocales';
  10  | type Language=keyof typeof patternResources;
  11  | type Labels=typeof patternResources['es-CO']['ui'];
  12  | const read=(page:Page)=>page.evaluate(()=>JSON.parse(localStorage.getItem('hci-lab-ia-project-v2')!));
  13  | const activity=(page:Page)=>page.locator('.pattern-activity');
  14  | async function action(page:Page,ui:Labels,key:keyof Labels){await activity(page).getByRole('button',{name:ui[key],exact:true}).click();}
  15  | async function finish(page:Page,id:PatternId,good:boolean,ui:Labels){
  16  |   const example=page.locator('.pattern-example');
  17  |   switch(id){
  18  |     case 'form':
  19  |       await example.getByRole('textbox',{name:ui.request,exact:true}).fill('Solicitud escrita sin traducir');
  20  |       await example.getByRole('textbox',{name:ui.email,exact:true}).fill('incorrecto');await action(page,ui,'send');
  21  |       await expect(example.getByRole('alert')).toHaveText(ui.emailError);await expect(example.getByRole('textbox',{name:ui.email,exact:true})).toBeFocused();
  22  |       await expect(example.getByRole('textbox',{name:ui.request,exact:true})).toHaveValue('Solicitud escrita sin traducir');
  23  |       if(!good)await expect(example.getByText(ui.formBadError,{exact:true})).toBeVisible();
  24  |       await example.getByRole('textbox',{name:ui.email,exact:true}).fill('persona@example.test');await action(page,ui,'send');
  25  |       await expect(example.getByRole('status')).toHaveText(ui.formLabDone);break;
  26  |     case 'navigation':
  27  |       await action(page,ui,'openBilling');await expect(example.locator('h4.pattern-focus')).toBeFocused();await action(page,ui,'openInvoices');
  28  |       await example.getByRole('combobox',{name:ui.where,exact:true}).selectOption('billing');await action(page,ui,'checkLocation');await expect(example.getByRole('alert')).toHaveText(ui.locationError);
  29  |       await example.getByRole('combobox',{name:ui.where,exact:true}).selectOption('invoices');await action(page,ui,'checkLocation');await expect(example.getByRole('status')).toHaveText(ui.locationDone.replace('{{name}}',ui.invoices));
  30  |       await action(page,ui,'previous');await expect(example.locator('h4.pattern-focus')).toBeFocused();await expect(example.locator('h4.pattern-focus')).toHaveText(good?ui.billing:ui.areaOne);
  31  |       await action(page,ui,'previous');await expect(example.locator('h4.pattern-focus')).toHaveText(ui.help);break;
  32  |     case 'feedback':
  33  |       await example.getByRole('textbox',{name:ui.document,exact:true}).fill('');await action(page,ui,'prepare');await expect(example.getByRole('alert')).toHaveText(ui.documentError);
  34  |       await example.getByRole('textbox',{name:ui.document,exact:true}).fill('Constancia original');await action(page,ui,'prepare');await expect(example.getByRole('button',{name:ui.cancel,exact:true})).toBeEnabled();
  35  |       await expect(example.locator('.pattern-runtime [role=status]')).toHaveText(ui.feedbackLabDone);
  36  |       if(good)await expect(example.getByRole('progressbar')).toHaveAttribute('value','3');
  37  |       else{await expect(example.getByText(ui.briefDone,{exact:true})).toBeVisible();await expect(example.getByText(ui.briefDone,{exact:true})).toHaveCount(0);}
  38  |       break;
  39  |     case 'choice':
  40  |       if(!good){await expect(example.getByRole('radio',{name:ui.advanced,exact:true})).toBeChecked();await expect(example.getByRole('table')).toHaveCount(0);}
  41  |       else{await action(page,ui,'continue');await expect(example.getByRole('alert')).toHaveText(ui.choiceError);}
  42  |       await action(page,ui,'compare');await expect(example.getByRole('table')).toBeVisible();await example.getByRole('radio',{name:ui.basic,exact:true}).check();await action(page,ui,'continue');await expect(example.getByRole('status')).toHaveText(ui.choiceDone.replace('{{name}}',ui.basic));
  43  |       await action(page,ui,'cancel');await expect(example.getByRole('status')).toHaveText(ui.cancelled);await expect(example.getByRole('radio',{name:ui.basic,exact:true})).not.toBeChecked();break;
  44  |     case 'content':
  45  |       await example.getByRole('searchbox',{name:ui.findLabel,exact:true}).fill('sin-coincidencia-zzzz');await action(page,ui,'find');await expect(example.getByRole('alert')).toHaveText(ui.notFound);
  46  |       await example.getByRole('searchbox',{name:ui.findLabel,exact:true}).fill(ui.returns);await action(page,ui,'find');await expect(example.getByRole('status')).toHaveText(ui.found.replace('{{name}}',ui.returns));
  47  |       await example.getByRole('combobox',{name:ui.deadline,exact:true}).selectOption('30');await action(page,ui,'checkContent');await expect(example.getByRole('alert')).toHaveText(ui.contentError);
  48  |       await example.getByRole('combobox',{name:ui.deadline,exact:true}).selectOption('14');await action(page,ui,'checkContent');await expect(example.getByRole('status')).toHaveText(ui.contentDone);break;
  49  |     case 'privacy':
  50  |       if(good)await expect(example.getByRole('checkbox',{name:ui.analytics,exact:true})).not.toBeChecked();else await expect(example.getByRole('checkbox',{name:ui.analytics,exact:true})).toBeChecked();
  51  |       await example.getByRole('checkbox',{name:ui.analytics,exact:true}).check();await example.getByRole('checkbox',{name:ui.photos,exact:true}).uncheck();await action(page,ui,'accept');await expect(example.getByRole('status')).toHaveText(ui.privacyDone);
  52  |       await expect(example.locator('.pattern-runtime')).toContainText(`${ui.analytics}: ${ui.yes}`);await expect(example.locator('.pattern-runtime')).toContainText(`${ui.photos}: ${ui.no}`);
  53  |       await action(page,ui,'reject');await expect(example.getByRole('checkbox',{name:ui.analytics,exact:true})).not.toBeChecked();await expect(example.locator('.pattern-runtime')).toContainText(`${ui.analytics}: ${ui.no}`);break;
  54  |   }
  55  | }
  56  | for(const language of Object.keys(patternResources) as Language[]){
  57  |   test(`patterns: six categories, both conditions, observations and full translations in ${language}`,async({page})=>{
  58  |     test.setTimeout(90000);const resource=patternResources[language],ui=resource.ui;
  59  |     await page.goto('/hci-lab-ia/#/practices');await page.locator('.language select').selectOption(language);await expect(page.locator('.pattern-card')).toHaveCount(6);
  60  |     for(const [index,id] of patternIds.entries()){
  61  |       await page.getByRole('combobox',{name:ui.category,exact:true}).selectOption(String(index));await expect(page.locator('.pattern-card')).toHaveCount(1);
  62  |       for(const text of Object.values(resource.patterns[index]).slice(0,8))await expect(page.locator('.pattern-card')).toContainText(text);
  63  |       for(const good of [true,false]){
  64  |         await page.locator(`#open-pattern-${index}`).click();await expect(activity(page).locator('h2')).toBeFocused();await expect(page.locator('.pattern-card')).toHaveCount(0);
  65  |         if(!good)await page.getByRole('combobox',{name:ui.condition,exact:true}).selectOption('bad');
  66  |         await expect(page.getByText(resource.patterns[index].instructions,{exact:true})).toBeVisible();await finish(page,id,good,ui);
  67  |         await activity(page).getByRole('textbox',{name:ui.identified,exact:true}).fill(`Mi problema ${id} ${good?'A':'B'} ✍️`);await activity(page).getByRole('textbox',{name:ui.principle,exact:true}).fill('Mi principio escrito');await activity(page).getByRole('textbox',{name:ui.correction,exact:true}).fill('Mi corrección\nSin traducción');
  68  |         await action(page,ui,'save');await expect(page.locator('#pattern-message')).toHaveText(ui.saved);await expect(activity(page).getByRole('button',{name:ui.save,exact:true})).toBeDisabled();
  69  |         await expect(page.locator('.pattern-module')).not.toContainText('patternLab.');await action(page,ui,'back');await expect(page.locator(`#open-pattern-${index}`)).toBeFocused();
  70  |       }
  71  |     }
  72  |     const state=await read(page);expect(state.evidence).toHaveLength(12);
  73  |     for(const record of state.evidence){expect(record.kind).toBe('pattern');expect(record.participant).toBe('');expect(record.scores).toEqual({});expect(record.pattern.correction).toBe('Mi corrección\nSin traducción');}
  74  |     await page.locator('.pattern-module').getByRole('link',{name:ui.reports,exact:true}).click();await expect(page.locator('main')).toBeFocused();await expect(page.locator('.pattern-record')).toHaveCount(12);
  75  |     await page.locator('.pattern-record summary').first().click();await expect(page.locator('.pattern-record').first()).toContainText('Mi principio escrito');await expect(page.locator('.pattern-record').first()).toContainText(ui.identified);
  76  |     expect((await new AxeBuilder({page}).include('.pattern-module').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);
  77  |     await page.reload();expect((await read(page)).evidence).toEqual(state.evidence);
  78  |   });
  79  | }
  80  | for(const theme of ['light','dark','contrast','dark-contrast']){
  81  |   test(`patterns: axe, focus and responsive layout for every example and condition, ${theme}`,async({page},testInfo)=>{
  82  |     test.setTimeout(120000);const ui=patternResources['es-CO'].ui;
  83  |     await page.addInitScript(theme=>localStorage.setItem('hci-prefs-v2',JSON.stringify({dark:theme.includes('dark'),contrast:theme.includes('contrast'),font:100,spacing:false,dyslexia:false,motion:true})),theme);
  84  |     await page.goto('/hci-lab-ia/#/practices');expect((await new AxeBuilder({page}).include('.pattern-module').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);
  85  |     await page.screenshot({path:testInfo.outputPath(`catalog-${theme}.png`),fullPage:true});await page.screenshot({path:testInfo.outputPath(`catalog-viewport-${theme}.png`)});
  86  |     for(const [index,id] of patternIds.entries())for(const good of [true,false]){
  87  |       await page.locator(`#open-pattern-${index}`).click();await expect(activity(page).locator('h2')).toBeFocused();if(!good)await page.getByRole('combobox',{name:ui.condition,exact:true}).selectOption('bad');
  88  |       expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
> 89  |       let result=await new AxeBuilder({page}).include('.pattern-module').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(result.violations,`${id} ${good?'good':'bad'} before`).toEqual([]);
      |                                                                                                                                                                                            ^ Error: choice good before
  90  |       await finish(page,id,good,ui);result=await new AxeBuilder({page}).include('.pattern-module').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(result.violations,`${id} ${good?'good':'bad'} after`).toEqual([]);
  91  |       if(!good&&(id==='form'||id==='choice'||id==='privacy')){await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:testInfo.outputPath(`${id}-bad-${theme}.png`),fullPage:true});}
  92  |       await action(page,ui,'back');
  93  |     }
  94  |   });
  95  | }
  96  | test('patterns: search, filters, keyboard, validation, condition changes and restart preserve user text',async({page})=>{
  97  |   const es=patternResources['es-CO'].ui,fr=patternResources['fr-FR'].ui;await page.goto('/hci-lab-ia/#/practices');
  98  |   await page.getByRole('searchbox',{name:es.search,exact:true}).fill('NAVEGACION');await expect(page.locator('.pattern-card')).toHaveCount(1);await page.getByRole('searchbox',{name:es.search,exact:true}).fill('zzzz');await expect(page.getByText(es.empty,{exact:true})).toBeVisible();await page.getByRole('button',{name:es.clear,exact:true}).click();
  99  |   await page.locator('#open-pattern-0').focus();await page.keyboard.press('Enter');await expect(activity(page).locator('h2')).toBeFocused();await page.keyboard.press('Tab');await expect(page.getByRole('combobox',{name:es.condition,exact:true})).toBeFocused();
  100 |   await page.keyboard.press('ArrowDown');await page.keyboard.press('Tab');await expect(page.getByRole('textbox',{name:es.email,exact:true})).toBeFocused();
  101 |   expect(await page.getByRole('textbox',{name:es.email,exact:true}).evaluate(e=>{const style=getComputedStyle(e);return style.outlineStyle!=='none'||style.boxShadow!=='none';})).toBe(true);
  102 |   await page.keyboard.type('usuario@example.test');await page.keyboard.press('Tab');await page.keyboard.type('Solicitud original');await page.keyboard.press('Tab');await page.keyboard.press('Enter');await expect(page.locator('.pattern-runtime [role=status]')).toHaveText(es.formLabDone);
  103 |   await action(page,es,'save');await expect(page.getByRole('textbox',{name:es.identified,exact:true})).toBeFocused();await expect(page.locator('#pattern-message')).toHaveAttribute('role','alert');
  104 |   await page.getByRole('textbox',{name:es.identified,exact:true}).fill('Observación original');await page.getByRole('textbox',{name:es.principle,exact:true}).fill('Mi principio');await page.getByRole('textbox',{name:es.correction,exact:true}).fill('Mi solución');await page.getByRole('textbox',{name:es.alias,exact:true}).fill('Alias libre');
  105 |   await page.getByRole('combobox',{name:es.condition,exact:true}).selectOption('good');await expect(page.locator('#pattern-example-title')).toBeFocused();await expect(page.locator('#pattern-message')).toHaveText(es.changed);await expect(page.getByRole('textbox',{name:es.email,exact:true})).toHaveValue('usuario@example.test');
  106 |   await action(page,es,'restart');await expect(page.locator('#pattern-example-title')).toBeFocused();await expect(page.locator('#pattern-message')).toHaveText(es.restarted);await expect(page.getByRole('textbox',{name:es.identified,exact:true})).toHaveValue('Observación original');
  107 |   await page.locator('.language select').selectOption('fr-FR');await expect(page.getByRole('textbox',{name:fr.request,exact:true})).toHaveValue('Solicitud original');await expect(page.getByRole('textbox',{name:fr.alias,exact:true})).toHaveValue('Alias libre');await expect(page.getByRole('textbox',{name:fr.correction,exact:true})).toHaveValue('Mi solución');
  108 |   await action(page,fr,'save');await action(page,fr,'back');await page.locator('#open-pattern-5').click();await expect(page.getByRole('textbox',{name:fr.alias,exact:true})).toHaveValue('Alias libre');await action(page,fr,'back');await page.locator('#open-pattern-0').click();await expect(page.getByRole('textbox',{name:fr.request,exact:true})).toHaveValue('Solicitud original');
  109 | });
  110 | test('patterns: cancelling and resetting pending feedback stops the example and retains authored input',async({page})=>{
  111 |   const ui=patternResources['es-CO'].ui;await page.goto('/hci-lab-ia/#/practices');await page.locator('#open-pattern-2').click();await page.getByRole('textbox',{name:ui.document,exact:true}).fill('Mi constancia');
  112 |   await action(page,ui,'prepare');await action(page,ui,'cancel');await expect(page.locator('.pattern-runtime [role=status]')).toHaveText(ui.cancelled);await page.waitForTimeout(1400);await expect(page.getByRole('progressbar')).toHaveAttribute('value','0');
  113 |   await action(page,ui,'prepare');await page.getByRole('combobox',{name:ui.condition,exact:true}).selectOption('bad');await page.waitForTimeout(1400);await expect(page.locator('.pattern-runtime [role=status]')).toHaveText(ui.idle);await expect(page.getByRole('textbox',{name:ui.document,exact:true})).toHaveValue('Mi constancia');
  114 |   await action(page,ui,'prepare');await action(page,ui,'restart');await page.waitForTimeout(1400);await expect(page.locator('.pattern-runtime [role=status]')).toHaveText(ui.idle);
  115 |   await action(page,ui,'prepare');await action(page,ui,'back');await page.waitForTimeout(1400);await page.locator('#open-pattern-2').click();await expect(page.locator('.pattern-runtime [role=status]')).toHaveText(ui.idle);
  116 | });
  117 | test('patterns: evidence survives backup/recovery and CSV/Markdown; reset clears drafts and pending work',async({page},testInfo)=>{
  118 |   const original=representativeProject();await page.goto('/hci-lab-ia/#/practices');await page.evaluate(project=>localStorage.setItem('hci-lab-ia-project-v2',JSON.stringify(project)),original);await page.reload();
  119 |   const ui=patternResources['es-CO'].ui,manage=manageResources['es-CO'];await page.locator('#open-pattern-2').click();
  120 |   await expect(page.getByRole('textbox',{name:ui.alias,exact:true})).toHaveValue([...original.evidence!].reverse().find(record=>record.participant.trim())?.participant||'');
  121 |   await page.getByRole('textbox',{name:ui.alias,exact:true}).fill('');await page.getByRole('textbox',{name:ui.identified,exact:true}).fill('Problema escrito');await page.getByRole('textbox',{name:ui.principle,exact:true}).fill('Visibilidad');await page.getByRole('textbox',{name:ui.correction,exact:true}).fill('Confirmación persistente');await action(page,ui,'save');
  122 |   const saved=await read(page);expect(saved.evidence).toHaveLength(original.evidence!.length+1);
  123 |   await page.getByRole('button',{name:manage.title,exact:true}).click();const pending=page.waitForEvent('download');await page.getByRole('button',{name:manage.backup,exact:true}).click();const file=testInfo.outputPath('pattern-backup.json');await(await pending).saveAs(file);await page.keyboard.press('Escape');
  124 |   await page.getByRole('textbox',{name:ui.document,exact:true}).fill('Pendiente');await action(page,ui,'prepare');await page.getByRole('button',{name:manage.title,exact:true}).click();await page.getByRole('button',{name:manage.reset,exact:true}).click();await page.getByRole('dialog').getByRole('button',{name:manage.cancel,exact:true}).click();expect(await read(page)).toEqual(saved);await page.keyboard.press('Escape');
  125 |   await action(page,ui,'prepare');await page.getByRole('button',{name:manage.title,exact:true}).click();await page.getByRole('button',{name:manage.reset,exact:true}).click();await page.getByRole('button',{name:manage.confirmReset,exact:true}).click();await page.waitForTimeout(1400);expect(await read(page)).toEqual(emptyProject());await expect(page.locator('.pattern-card')).toHaveCount(6);
  126 |   await page.locator('#open-pattern-2').click();await expect(page.getByRole('textbox',{name:ui.document,exact:true})).toHaveValue('');await expect(page.getByRole('textbox',{name:ui.identified,exact:true})).toHaveValue('');
  127 |   await page.reload();expect(await read(page)).toEqual(emptyProject());
  128 |   await page.getByRole('button',{name:manage.title,exact:true}).click();await page.locator('dialog input[type=file]').setInputFiles(file);await page.getByRole('button',{name:manage.confirmRecover,exact:true}).click();expect(await read(page)).toEqual(saved);
  129 |   await page.locator('.pattern-module').getByRole('link',{name:ui.reports,exact:true}).click();await page.locator('.pattern-record summary').click();await expect(page.locator('.pattern-record')).toContainText('Confirmación persistente');
  130 |   for(const [name,filename] of [['Exportar evidencias CSV','pattern.csv'],['Exportar informe Markdown','pattern.md']]){const download=page.waitForEvent('download');await page.getByRole('button',{name}).click();const file=await download;await file.saveAs(testInfo.outputPath(filename));const stream=await file.createReadStream();let text='';for await(const chunk of stream!)text+=chunk.toString();expect(text).toContain('Problema escrito');expect(text).toContain('Visibilidad');expect(text).toContain('Confirmación persistente');}
  131 |   const before=await read(page),invalid={...before,evidence:[{...before.evidence.at(-1),pattern:{id:'form',problem:'x'}}]},pendingInvalid=page.waitForEvent('download');
  132 |   await page.evaluate(value=>{const link=document.createElement('a'),url=URL.createObjectURL(new Blob([JSON.stringify(value)],{type:'application/json'}));link.href=url;link.download='incomplete-pattern.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);},invalid);
  133 |   const invalidFile=testInfo.outputPath('incomplete-pattern.json');await(await pendingInvalid).saveAs(invalidFile);await page.getByRole('button',{name:manage.title,exact:true}).click();await page.locator('dialog input[type=file]').setInputFiles(invalidFile);await expect(page.getByRole('alert')).toHaveText(manage.invalid);expect(await read(page)).toEqual(before);
  134 | });
  135 | 
```