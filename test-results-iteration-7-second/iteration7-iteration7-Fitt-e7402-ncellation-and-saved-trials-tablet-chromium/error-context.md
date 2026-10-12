# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: iteration7.spec.ts >> iteration7: Fitts and Hick, both conditions, practice exclusion, errors, cancellation and saved trials
- Location: tests\e2e\iteration7.spec.ts:8:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('.i7-board')
    - locator resolved to <div tabindex="0" role="region" aria-label="Fitts" class="i7-board fitts">…</div>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <section class="panel">…</section> intercepts pointer events
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <section class="panel">…</section> intercepts pointer events
    - retrying click action
      - waiting 100ms
    55 × waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <section class="panel">…</section> intercepts pointer events
     - retrying click action
       - waiting 500ms

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
        - generic [ref=e28]:
          - text: Experimento
          - heading "Fitts / Hick" [level=1] [ref=e29]
          - paragraph [ref=e30]: "Actividad breve de aprendizaje: no demuestra una ley ni estima parámetros poblacionales. Teclado y ratón producen tareas distintas; registre cómo interactuó y alterne el orden de condiciones al comparar."
        - generic [ref=e31]:
          - generic [ref=e32]:
            - button "Fitts" [pressed] [ref=e33] [cursor=pointer]
            - button "Hick" [ref=e34] [cursor=pointer]
          - heading "Fitts · Objetivo" [level=2] [ref=e35]
          - paragraph [ref=e36]: Compare el tiempo y los errores al seleccionar objetivos de distinto tamaño.
          - heading "Instrucciones" [level=3] [ref=e37]
          - paragraph [ref=e38]: Seleccione el número indicado. Se mide desde su aparición hasta la activación correcta; los objetivos equivocados y el fondo cuentan como errores. D es distancia entre centros, W es ancho e ID = log₂(D/W + 1). El primer intento no tiene distancia previa.
          - generic [ref=e39]:
            - generic [ref=e40]:
              - text: Condición
              - combobox "Condición" [ref=e41]:
                - 'option "Objetivos grandes: 64 px" [selected]'
                - 'option "Objetivos pequeños: 24 px"'
            - generic [ref=e42]:
              - text: Alias opcional
              - textbox "Alias opcional" [ref=e43]
          - paragraph [ref=e44]: Cambiar experimento o condición cancela el intento abierto y reinicia práctica y medición. Los registros guardados se conservan.
          - generic [ref=e45]:
            - button "Iniciar práctica" [disabled] [ref=e46]
            - button "Iniciar medición" [disabled] [ref=e47]
            - button "Cancelar" [ref=e48] [cursor=pointer]
          - status [ref=e49]: "Medición: 8 intentos. Intento 1/8. Seleccione 3."
          - paragraph [ref=e50]: "Tiempo (s): 29.21 · Errores: 0"
          - region "Fitts" [active] [ref=e51]:
            - button "Objetivo 1" [ref=e53] [cursor=pointer]: "1"
            - button "Objetivo 2" [ref=e55] [cursor=pointer]: "2"
            - button "Objetivo 3" [pressed] [ref=e57] [cursor=pointer]: "3"
            - button "Objetivo 4" [ref=e59] [cursor=pointer]: "4"
            - button "Objetivo 5" [ref=e61] [cursor=pointer]: "5"
            - button "Objetivo 6" [ref=e63] [cursor=pointer]: "6"
          - generic [ref=e64]:
            - heading "Resultado" [level=2] [ref=e65]
            - paragraph [ref=e66]: Pendiente
        - generic [ref=e67]:
          - heading "Registros guardados" [level=2] [ref=e68]
          - paragraph [ref=e69]: Todavía no hay registros. Complete una actividad para guardar evidencia.
          - link "Consultar Informes" [ref=e70] [cursor=pointer]:
            - /url: "#/reports"
```

# Test source

```ts
  1  | import {test,expect} from '@playwright/test';
  2  | import type {Page} from '@playwright/test';
  3  | import AxeBuilder from '@axe-core/playwright';
  4  | import {evalLanguages,evaluationResources} from '../../src/iteration7/locales';
  5  | import {heuristicContent} from '../../src/iteration7/heuristics';
  6  | const stored=(p:Page)=>p.evaluate(()=>JSON.parse(localStorage.getItem('hci-lab-ia-project-v2')||'{}'));
  7  | async function trials(page:Page,count:number,keyboard=false){for(let i=0;i<count;i++){const status=await page.locator('.i7 [role=status]').innerText();const target=status.match(/Seleccione (\d+)/)![1];const button=page.getByRole('button',{name:`Objetivo ${target}`,exact:true});if(keyboard){await button.focus();await page.keyboard.press('Enter');}else await button.click();}}
> 8  | test('iteration7: Fitts and Hick, both conditions, practice exclusion, errors, cancellation and saved trials',async({page})=>{await page.goto('/hci-lab-ia/#/experiments');await expect(page.getByRole('button',{name:'Iniciar medición'})).toBeDisabled();for(const kind of ['Fitts','Hick']){await page.getByRole('button',{name:kind,exact:true}).click();for(const condition of ['simple','complex']){await page.getByLabel('Condición',{exact:true}).selectOption(condition);await page.getByRole('button',{name:'Iniciar práctica'}).click();await trials(page,2);expect((await stored(page)).evidence).toHaveLength(kind==='Fitts'?(condition==='simple'?0:1):(condition==='simple'?2:3));await page.getByRole('button',{name:'Iniciar medición'}).click();await page.locator('.i7-board').click({position:{x:4,y:4}});await expect(page.getByText('Tiempo (s):', {exact:false})).toContainText('Errores: 1');await trials(page,8,kind==='Hick');await page.getByRole('button',{name:'Guardar experimento'}).click();await expect(page.getByRole('button',{name:'Guardar experimento'})).toBeDisabled();}}const evidence=(await stored(page)).evidence;expect(evidence).toHaveLength(4);for(const e of evidence){expect(e.experiment.trials).toHaveLength(8);expect(e.experiment.practiceCount).toBe(2);expect(e.scores.errors).toBe(1);expect(e.participant).toBe('');expect(e.experiment.trials.every((r:{seconds:number})=>r.seconds>=0)).toBe(true);}await page.getByRole('button',{name:'Repetir',exact:true}).click();await page.getByRole('button',{name:'Cancelar',exact:true}).click();expect((await stored(page)).evidence).toHaveLength(4);await page.getByRole('button',{name:'Iniciar práctica'}).click();await page.getByLabel('Condición',{exact:true}).selectOption('simple');await expect(page.getByRole('button',{name:'Iniciar medición'})).toBeDisabled();await page.reload();expect((await stored(page)).evidence).toHaveLength(4);});
     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   ^ Error: locator.click: Test timeout of 30000ms exceeded.
  9  | test('iteration7: known SUS and Raw TLX, incomplete and invalid answers, no fabricated session',async({page})=>{await page.goto('/hci-lab-ia/#/user-testing');await page.getByRole('button',{name:'SUS',exact:true}).click();await expect(page.getByRole('button',{name:'Guardar SUS'})).toBeDisabled();await page.getByLabel('Interfaz o tarea evaluada',{exact:true}).fill('Task with SUS');for(let i=1;i<=10;i++)await page.getByLabel(`Respuesta SUS ${i}`,{exact:true}).selectOption(i%2?'5':'1');await expect(page.getByText('SUS: 100.0/100',{exact:true})).toBeVisible();await page.getByRole('button',{name:'Guardar SUS'}).click();await page.getByRole('button',{name:'Raw TLX',exact:true}).click();const dims=['Exigencia mental','Exigencia física','Exigencia temporal','Rendimiento: 0 excelente, 100 deficiente','Esfuerzo','Frustración'];await page.getByLabel('Interfaz o tarea evaluada',{exact:true}).fill('Task with workload');await page.getByLabel(dims[0],{exact:true}).fill('101');await expect(page.getByRole('button',{name:'Guardar Raw TLX'})).toBeDisabled();for(let i=0;i<6;i++)await page.getByLabel(dims[i],{exact:true}).fill(String((i+1)*10));await expect(page.getByText('Raw TLX: 35.0/100',{exact:true})).toBeVisible();await page.getByRole('button',{name:'Guardar Raw TLX'}).click();const s=await stored(page);expect(s.sessions).toEqual([]);expect(s.evidence[0].scores.response1).toBe(5);expect(s.evidence[0].scores.sus).toBe(100);expect(s.evidence[1].scores.rawTLX).toBe(35);await page.reload();expect((await stored(page)).evidence).toHaveLength(2);});
  10 | test('iteration7: findings create edit delete, validation preserves input, no global score',async({page})=>{await page.goto('/hci-lab-ia/#/evaluation');await expect(page.locator('.i7 details')).toHaveCount(10);await page.getByRole('button',{name:'Nuevo hallazgo'}).click();await page.getByLabel('Problema observado',{exact:true}).fill('Original human problem');await page.getByRole('button',{name:'Guardar',exact:true}).click();await expect(page.getByLabel('Problema observado',{exact:true})).toHaveValue('Original human problem');await page.getByLabel('Interfaz o tarea evaluada',{exact:true}).fill('Booking');await page.getByLabel('Evidencia o ubicación',{exact:true}).fill('Review step');await page.getByLabel('Recomendación de corrección',{exact:true}).fill('Show status');await page.getByLabel('Heurística',{exact:true}).selectOption('h3');await page.getByLabel('Gravedad',{exact:true}).selectOption('3');await page.getByRole('button',{name:'Guardar',exact:true}).click();expect((await stored(page)).findings[0]).toMatchObject({task:'Booking',heuristicId:'h3',severity:3});await page.getByRole('button',{name:'Editar',exact:true}).click();await page.getByLabel('Problema observado',{exact:true}).fill('Edited human problem');await page.getByRole('button',{name:'Guardar',exact:true}).click();expect((await stored(page)).findings).toHaveLength(1);expect((await stored(page)).findings[0].problem).toBe('Edited human problem');await page.getByRole('button',{name:'Eliminar',exact:true}).click();await page.getByRole('button',{name:'Cancelar',exact:true}).click();expect((await stored(page)).findings).toHaveLength(1);await page.getByRole('button',{name:'Eliminar',exact:true}).click();await page.getByRole('alert').getByRole('button',{name:'Eliminar',exact:true}).click();expect((await stored(page)).findings).toEqual([]);});
  11 | test('iteration7: AI decisions, explicit one-time incorporation, no automatic findings and linked scenario',async({page})=>{await page.goto('/hci-lab-ia/#/ai');await page.getByLabel('Contexto y evidencia observada').fill('Observed colour-only confirmation');await page.getByRole('button',{name:'Generar propuesta simulada'}).click();await page.getByLabel('Justificación humana').fill('Needs manual review');await page.getByRole('button',{name:'Aceptar propuesta',exact:true}).click();expect((await stored(page)).findings).toEqual([]);expect((await stored(page)).evidence).toHaveLength(1);await page.getByLabel('Tipo de propuesta',{exact:true}).selectOption('persona');await page.getByRole('button',{name:'Generar propuesta simulada'}).click();await page.getByLabel('Propuesta editable').fill('Human edited fictional persona');await page.getByRole('button',{name:'Aplicar propuesta editada'}).click();for(const [key,value]of [['Nombre ficticio','Fictional test persona'],['Contexto','University'],['Objetivo de la persona','Finish a booking'],['Necesidades o barreras','Low vision'],['Dispositivo','Tablet']])await page.getByLabel(key,{exact:true}).fill(value);await page.getByRole('button',{name:'Incorporar tras revisión humana',exact:true}).click();expect((await stored(page)).personas).toHaveLength(1);await expect(page.getByRole('button',{name:'Incorporar tras revisión humana',exact:true})).toBeDisabled();await page.getByLabel('Tipo de propuesta',{exact:true}).selectOption('scenario');await page.getByRole('button',{name:'Generar propuesta simulada'}).click();await page.getByRole('button',{name:'Aceptar propuesta',exact:true}).click();await page.getByLabel('Persona ficticia',{exact:true}).selectOption({index:1});for(const [key,value]of [['Título del escenario','Interrupted booking'],['Contexto','University'],['Tarea del escenario','Confirm'],['Restricción o dificultad','Connection lost'],['Criterio de éxito observable','No duplicate booking']])await page.getByLabel(key,{exact:true}).fill(value);await page.getByRole('button',{name:'Incorporar tras revisión humana',exact:true}).click();const p=await stored(page);expect(p.scenarios[0].personaId).toBe(p.personas[0].id);expect(p.scenarios[0].fictional).toBe(true);await page.getByLabel('Tipo de propuesta',{exact:true}).selectOption('evaluation');await page.getByRole('button',{name:'Generar propuesta simulada'}).click();await page.getByRole('button',{name:'Rechazar propuesta'}).click();expect((await stored(page)).findings).toEqual([]);expect((await stored(page)).evidence.map((e:{condition:string})=>e.condition)).toEqual(['aceptar','editar','aceptar','rechazar']);});
  12 | test('iteration7: both chatbots, stop edit regenerate and save human rubric',async({page})=>{await page.goto('/hci-lab-ia/#/chatbots');for(const good of [false,true]){const chat=page.locator('.i7-chat-grid>section').nth(good?1:0);await chat.getByLabel('Mensaje editable').fill('Check keyboard access');await chat.getByRole('button',{name:'Enviar mensaje'}).click();if(good){await expect(chat.getByRole('status')).toContainText('Generando');await page.waitForTimeout(180);await chat.getByRole('button',{name:'Detener respuesta'}).click();await expect(chat.getByLabel('Respuesta editable')).toBeFocused();await chat.getByLabel('Respuesta editable').fill('Edited by human');await chat.getByRole('button',{name:'Regenerar'}).click();await chat.getByRole('button',{name:'Detener respuesta'}).click();await chat.getByLabel('Respuesta editable').fill('Reviewed response');}else{await expect(chat.getByRole('button',{name:'Detener respuesta'})).toHaveCount(0);await expect(chat.getByText('Su interfaz es accesible al 100 %.',{exact:false})).toBeVisible();}for(const key of ['Claridad','Control','Tono','Transparencia'])await chat.getByLabel(key,{exact:true}).selectOption('4');await chat.getByLabel('Evidencia de la evaluación').fill('Human judgement');await chat.getByRole('button',{name:'Guardar rúbrica del chatbot'}).click();}const s=await stored(page);expect(s.evidence).toHaveLength(2);expect(s.evidence.every((e:{chatbot:{human:boolean}})=>e.chatbot.human)).toBe(true);expect(s.evidence[1].chatbot.response).toBe('Reviewed response');expect(s.evidence[1].scores.transparency).toBe(4);});
  13 | test('iteration7: backup recovery, reports and reset clear active work across reload',async({page})=>{await page.goto('/hci-lab-ia/#/user-testing');await page.getByRole('button',{name:'SUS',exact:true}).click();await page.getByLabel('Interfaz o tarea evaluada').fill('Persisted task');for(let i=1;i<=10;i++)await page.getByLabel(`Respuesta SUS ${i}`,{exact:true}).selectOption('3');await page.getByRole('button',{name:'Guardar SUS'}).click();const original=await stored(page);await page.goto('/hci-lab-ia/#/reports');await expect(page.locator('summary').filter({hasText:'Persisted task'})).toBeVisible();await page.getByRole('button',{name:'Gestionar proyecto',exact:true}).click();const dl=page.waitForEvent('download');await page.getByRole('button',{name:'Descargar respaldo JSON'}).click();const stream=await(await dl).createReadStream();let body='';for await(const chunk of stream!)body+=chunk.toString();expect(JSON.parse(body).evidence[0].scores.sus).toBe(50);await page.getByRole('button',{name:'Restablecer proyecto',exact:true}).click();await page.getByRole('button',{name:'Borrar datos y restablecer'}).click();await page.reload();expect((await stored(page)).evidence).toEqual([]);await page.getByRole('button',{name:'Gestionar proyecto',exact:true}).click();await page.locator('dialog input[type=file]').setInputFiles({name:'iteration7.json',mimeType:'application/json',buffer:new TextEncoder().encode(body)});await page.getByRole('button',{name:'Reemplazar y recuperar'}).click();expect((await stored(page)).evidence).toEqual(original.evidence);});
  14 | for(const language of evalLanguages)test(`iteration7: full module content and authored text in ${language}`,async({page})=>{const r=evaluationResources[language];await page.addInitScript(lang=>localStorage.setItem('hci-language',lang),language);for(const [route,title]of [['experiments','experiment'],['evaluation','evaluation'],['ai','aiTitle'],['chatbots','chatTitle'],['user-testing','testing']]){await page.goto(`/hci-lab-ia/#/${route}`);await expect(page.locator('.i7')).not.toContainText('evaluationLab.');if(route!=='experiments')await expect(page.getByRole('heading',{name:r[title],exact:true})).toBeVisible();if(route==='evaluation'){for(const h of heuristicContent(language)){const detail=page.locator('.i7 details').filter({has:page.getByText(h.name,{exact:true})});await detail.locator('summary').click();await expect(detail).toContainText(h.question);await expect(detail).toContainText(h.example);}}if(route==='ai'){await page.getByLabel(r.prompt,{exact:true}).fill('USER_AUTHORED_TEXT');await page.getByRole('button',{name:r.generate}).click();await expect(page.getByLabel(r.proposal)).toContainText('USER_AUTHORED_TEXT');}if(route==='user-testing'){await page.getByRole('button',{name:'SUS',exact:true}).click();for(let i=1;i<=10;i++)await expect(page.getByLabel(r.susResponse.replace('{{number}}',String(i)),{exact:true})).toBeVisible();}expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}});
  15 | for(const theme of ['light','dark','contrast','dark-contrast'])test(`iteration7: strict axe, keyboard and responsive layout in ${theme}`,async({page},info)=>{await page.addInitScript(name=>localStorage.setItem('hci-prefs-v2',JSON.stringify({dark:name.includes('dark'),contrast:name.includes('contrast'),font:100,spacing:false,dyslexia:false,motion:true})),theme);for(const route of ['experiments','evaluation','ai','chatbots','user-testing']){await page.goto(`/hci-lab-ia/#/${route}`);if(route==='evaluation')await page.getByRole('button',{name:'Nuevo hallazgo'}).click();if(route==='user-testing')await page.getByRole('button',{name:'Raw TLX',exact:true}).click();const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(axe.violations.map(v=>v.id)).toEqual([]);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.screenshot({path:info.outputPath(`${route}-${theme}.png`)});}});
  16 | 
```