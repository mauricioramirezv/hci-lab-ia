# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: iteration7.spec.ts >> iteration7: full module content and authored text in it-IT
- Location: tests\e2e\iteration7.spec.ts:14:37

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByLabel('Risposta SUS 1')
Expected: visible
Error: strict mode violation: getByLabel('Risposta SUS 1') resolved to 2 elements:
    1) <select required="" aria-label="Risposta SUS 1">…</select> aka getByLabel('Risposta SUS 1', { exact: true })
    2) <select required="" aria-label="Risposta SUS 10">…</select> aka getByLabel('Risposta SUS 10')

Call log:
  - Expect "toBeVisible" getByLabel('Risposta SUS 1') with timeout 5000ms
  - waiting for getByLabel('Risposta SUS 1')

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - link "Vai al contenuto" [ref=e4] [cursor=pointer]:
    - /url: "#main-content"
  - generic [ref=e5]:
    - banner [ref=e6]:
      - button "Apri menu" [ref=e7] [cursor=pointer]
      - strong [ref=e10]: HCI Lab + IA
      - complementary [ref=e11]:
        - button "Monitoraggio della pagina" [ref=e12] [cursor=pointer]
      - button "Gestisci progetto" [ref=e14] [cursor=pointer]
      - generic [ref=e15]:
        - generic [ref=e20]: Lingua
        - combobox "Lingua" [ref=e21]:
          - option "ES"
          - option "EN"
          - option "PT"
          - option "FR"
          - option "IT" [selected]
          - option "CA"
      - button "Tema scuro" [ref=e22] [cursor=pointer]
    - main [ref=e25]:
      - generic [ref=e26]:
        - generic [ref=e28]:
          - text: SUS / Raw TLX
          - heading "Usabilità e carico mentale" [level=1] [ref=e29]
          - paragraph [ref=e30]: Rispondi dopo un’attività. SUS e Raw TLX sono moduli indipendenti; nessuna risposta precompilata né partecipante inventato.
        - generic [ref=e31]:
          - button "SUS" [active] [ref=e32] [cursor=pointer]
          - button "Raw TLX" [ref=e33] [cursor=pointer]
          - button "Indietro" [ref=e34] [cursor=pointer]
        - generic [ref=e35]:
          - heading "Scala SUS" [level=2] [ref=e36]
          - paragraph [ref=e37]: "Dopo l’uso, rispondi ai dieci item: 1 completamente in disaccordo, 5 completamente d’accordo. SUS va da 0 a 100 e non è una percentuale di usabilità. Mantieni la prima impressione."
          - generic [ref=e38]:
            - generic [ref=e39]:
              - text: Alias facoltativo
              - textbox "Alias facoltativo" [ref=e40]
            - generic [ref=e41]:
              - text: Interfaccia o attività valutata
              - textbox "Interfaccia o attività valutata" [ref=e42]
          - generic [ref=e43]:
            - text: 1. Userei questo sistema frequentemente.
            - combobox "Risposta SUS 1" [ref=e44]:
              - option "In attesa" [selected]
              - option "1"
              - option "2"
              - option "3"
              - option "4"
              - option "5"
          - generic [ref=e45]:
            - text: 2. Il sistema è inutilmente complesso.
            - combobox "Risposta SUS 2" [ref=e46]:
              - option "In attesa" [selected]
              - option "1"
              - option "2"
              - option "3"
              - option "4"
              - option "5"
          - generic [ref=e47]:
            - text: 3. Il sistema è facile da usare.
            - combobox "Risposta SUS 3" [ref=e48]:
              - option "In attesa" [selected]
              - option "1"
              - option "2"
              - option "3"
              - option "4"
              - option "5"
          - generic [ref=e49]:
            - text: 4. Avrei bisogno di supporto tecnico.
            - combobox "Risposta SUS 4" [ref=e50]:
              - option "In attesa" [selected]
              - option "1"
              - option "2"
              - option "3"
              - option "4"
              - option "5"
          - generic [ref=e51]:
            - text: 5. Le funzioni sono ben integrate.
            - combobox "Risposta SUS 5" [ref=e52]:
              - option "In attesa" [selected]
              - option "1"
              - option "2"
              - option "3"
              - option "4"
              - option "5"
          - generic [ref=e53]:
            - text: 6. C’è troppa incoerenza.
            - combobox "Risposta SUS 6" [ref=e54]:
              - option "In attesa" [selected]
              - option "1"
              - option "2"
              - option "3"
              - option "4"
              - option "5"
          - generic [ref=e55]:
            - text: 7. Si impara rapidamente.
            - combobox "Risposta SUS 7" [ref=e56]:
              - option "In attesa" [selected]
              - option "1"
              - option "2"
              - option "3"
              - option "4"
              - option "5"
          - generic [ref=e57]:
            - text: 8. È scomodo da usare.
            - combobox "Risposta SUS 8" [ref=e58]:
              - option "In attesa" [selected]
              - option "1"
              - option "2"
              - option "3"
              - option "4"
              - option "5"
          - generic [ref=e59]:
            - text: 9. Mi sento sicuro nell’usarlo.
            - combobox "Risposta SUS 9" [ref=e60]:
              - option "In attesa" [selected]
              - option "1"
              - option "2"
              - option "3"
              - option "4"
              - option "5"
          - generic [ref=e61]:
            - text: 10. Devo imparare molto prima di usarlo.
            - combobox "Risposta SUS 10" [ref=e62]:
              - option "In attesa" [selected]
              - option "1"
              - option "2"
              - option "3"
              - option "4"
              - option "5"
          - generic [ref=e63]:
            - text: Osservazioni
            - textbox "Osservazioni" [ref=e64]
          - paragraph [ref=e65]: "SUS: In attesa"
          - generic [ref=e66]:
            - button "Salva SUS" [disabled] [ref=e67]
            - button "Nuovo record" [ref=e68] [cursor=pointer]
          - status
        - generic [ref=e69]:
          - heading "Record salvati" [level=2] [ref=e70]
          - paragraph [ref=e71]: Nessun record. Completa un’attività per salvare evidenze.
          - link "Consulta Rapporti" [ref=e72] [cursor=pointer]:
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
  8  | test('iteration7: Fitts and Hick, both conditions, practice exclusion, errors, cancellation and saved trials',async({page})=>{await page.goto('/hci-lab-ia/#/experiments');await expect(page.getByRole('button',{name:'Iniciar medición'})).toBeDisabled();for(const kind of ['Fitts','Hick']){await page.getByRole('button',{name:kind,exact:true}).click();for(const condition of ['simple','complex']){await page.getByLabel('Condición',{exact:true}).selectOption(condition);await page.getByRole('button',{name:'Iniciar práctica'}).click();await trials(page,2);expect((await stored(page)).evidence).toHaveLength(kind==='Fitts'?(condition==='simple'?0:1):(condition==='simple'?2:3));await page.getByRole('button',{name:'Iniciar medición'}).click();await page.locator('.i7-board').click({position:{x:4,y:4}});await expect(page.getByText('Tiempo (s):', {exact:false})).toContainText('Errores: 1');await trials(page,8,kind==='Hick');await page.getByRole('button',{name:'Guardar experimento'}).click();await expect(page.getByRole('button',{name:'Guardar experimento'})).toBeDisabled();}}const evidence=(await stored(page)).evidence;expect(evidence).toHaveLength(4);for(const e of evidence){expect(e.experiment.trials).toHaveLength(8);expect(e.experiment.practiceCount).toBe(2);expect(e.scores.errors).toBe(1);expect(e.participant).toBe('');expect(e.experiment.trials.every((r:{seconds:number})=>r.seconds>=0)).toBe(true);}await page.getByRole('button',{name:'Repetir',exact:true}).click();await page.getByRole('button',{name:'Cancelar',exact:true}).click();expect((await stored(page)).evidence).toHaveLength(4);await page.getByRole('button',{name:'Iniciar práctica'}).click();await page.getByLabel('Condición',{exact:true}).selectOption('simple');await expect(page.getByRole('button',{name:'Iniciar medición'})).toBeDisabled();await page.reload();expect((await stored(page)).evidence).toHaveLength(4);});
  9  | test('iteration7: known SUS and Raw TLX, incomplete and invalid answers, no fabricated session',async({page})=>{await page.goto('/hci-lab-ia/#/user-testing');await page.getByRole('button',{name:'SUS',exact:true}).click();await expect(page.getByRole('button',{name:'Guardar SUS'})).toBeDisabled();await page.getByLabel('Interfaz o tarea evaluada',{exact:true}).fill('Task with SUS');for(let i=1;i<=10;i++)await page.getByLabel(`Respuesta SUS ${i}`,{exact:true}).selectOption(i%2?'5':'1');await expect(page.getByText('SUS: 100.0/100',{exact:true})).toBeVisible();await page.getByRole('button',{name:'Guardar SUS'}).click();await page.getByRole('button',{name:'Raw TLX',exact:true}).click();const dims=['Exigencia mental','Exigencia física','Exigencia temporal','Rendimiento: 0 excelente, 100 deficiente','Esfuerzo','Frustración'];await page.getByLabel('Interfaz o tarea evaluada',{exact:true}).fill('Task with workload');await page.getByLabel(dims[0],{exact:true}).fill('101');await expect(page.getByRole('button',{name:'Guardar Raw TLX'})).toBeDisabled();for(let i=0;i<6;i++)await page.getByLabel(dims[i],{exact:true}).fill(String((i+1)*10));await expect(page.getByText('Raw TLX: 35.0/100',{exact:true})).toBeVisible();await page.getByRole('button',{name:'Guardar Raw TLX'}).click();const s=await stored(page);expect(s.sessions).toEqual([]);expect(s.evidence[0].scores.response1).toBe(5);expect(s.evidence[0].scores.sus).toBe(100);expect(s.evidence[1].scores.rawTLX).toBe(35);await page.reload();expect((await stored(page)).evidence).toHaveLength(2);});
  10 | test('iteration7: findings create edit delete, validation preserves input, no global score',async({page})=>{await page.goto('/hci-lab-ia/#/evaluation');await expect(page.locator('.i7 details')).toHaveCount(10);await page.getByRole('button',{name:'Nuevo hallazgo'}).click();await page.getByLabel('Problema observado',{exact:true}).fill('Original human problem');await page.getByRole('button',{name:'Guardar',exact:true}).click();await expect(page.getByLabel('Problema observado',{exact:true})).toHaveValue('Original human problem');await page.getByLabel('Interfaz o tarea evaluada',{exact:true}).fill('Booking');await page.getByLabel('Evidencia o ubicación',{exact:true}).fill('Review step');await page.getByLabel('Recomendación de corrección',{exact:true}).fill('Show status');await page.getByLabel('Heurística',{exact:true}).selectOption('h3');await page.getByLabel('Gravedad',{exact:true}).selectOption('3');await page.getByRole('button',{name:'Guardar',exact:true}).click();expect((await stored(page)).findings[0]).toMatchObject({task:'Booking',heuristicId:'h3',severity:3});await page.getByRole('button',{name:'Editar',exact:true}).click();await page.getByLabel('Problema observado',{exact:true}).fill('Edited human problem');await page.getByRole('button',{name:'Guardar',exact:true}).click();expect((await stored(page)).findings).toHaveLength(1);expect((await stored(page)).findings[0].problem).toBe('Edited human problem');await page.getByRole('button',{name:'Eliminar',exact:true}).click();await page.getByRole('button',{name:'Cancelar',exact:true}).click();expect((await stored(page)).findings).toHaveLength(1);await page.getByRole('button',{name:'Eliminar',exact:true}).click();await page.getByRole('alert').getByRole('button',{name:'Eliminar',exact:true}).click();expect((await stored(page)).findings).toEqual([]);});
  11 | test('iteration7: AI decisions, explicit one-time incorporation, no automatic findings and linked scenario',async({page})=>{await page.goto('/hci-lab-ia/#/ai');await page.getByLabel('Contexto y evidencia observada').fill('Observed colour-only confirmation');await page.getByRole('button',{name:'Generar propuesta simulada'}).click();await page.getByLabel('Justificación humana').fill('Needs manual review');await page.getByRole('button',{name:'Aceptar propuesta',exact:true}).click();expect((await stored(page)).findings).toEqual([]);expect((await stored(page)).evidence).toHaveLength(1);await page.getByLabel('Tipo de propuesta',{exact:true}).selectOption('persona');await page.getByRole('button',{name:'Generar propuesta simulada'}).click();await page.getByLabel('Propuesta editable').fill('Human edited fictional persona');await page.getByRole('button',{name:'Aplicar propuesta editada'}).click();for(const [key,value]of [['Nombre ficticio','Fictional test persona'],['Contexto','University'],['Objetivo de la persona','Finish a booking'],['Necesidades o barreras','Low vision'],['Dispositivo','Tablet']])await page.getByLabel(key,{exact:true}).fill(value);await page.getByRole('button',{name:'Incorporar tras revisión humana',exact:true}).click();expect((await stored(page)).personas).toHaveLength(1);await expect(page.getByRole('button',{name:'Incorporar tras revisión humana',exact:true})).toBeDisabled();await page.getByLabel('Tipo de propuesta',{exact:true}).selectOption('scenario');await page.getByRole('button',{name:'Generar propuesta simulada'}).click();await page.getByRole('button',{name:'Aceptar propuesta',exact:true}).click();await page.getByLabel('Persona ficticia',{exact:true}).selectOption({index:1});for(const [key,value]of [['Título del escenario','Interrupted booking'],['Contexto','University'],['Tarea del escenario','Confirm'],['Restricción o dificultad','Connection lost'],['Criterio de éxito observable','No duplicate booking']])await page.getByLabel(key,{exact:true}).fill(value);await page.getByRole('button',{name:'Incorporar tras revisión humana',exact:true}).click();const p=await stored(page);expect(p.scenarios[0].personaId).toBe(p.personas[0].id);expect(p.scenarios[0].fictional).toBe(true);await page.getByLabel('Tipo de propuesta',{exact:true}).selectOption('evaluation');await page.getByRole('button',{name:'Generar propuesta simulada'}).click();await page.getByRole('button',{name:'Rechazar propuesta'}).click();expect((await stored(page)).findings).toEqual([]);expect((await stored(page)).evidence.map((e:{condition:string})=>e.condition)).toEqual(['aceptar','editar','aceptar','rechazar']);});
  12 | test('iteration7: both chatbots, stop edit regenerate and save human rubric',async({page})=>{await page.goto('/hci-lab-ia/#/chatbots');for(const good of [false,true]){const chat=page.locator('.i7-chat-grid>section').nth(good?1:0);await chat.getByLabel('Mensaje editable').fill('Check keyboard access');await chat.getByRole('button',{name:'Enviar mensaje'}).click();if(good){await expect(chat.getByRole('status')).toContainText('Generando');await page.waitForTimeout(180);await chat.getByRole('button',{name:'Detener respuesta'}).click();await expect(chat.getByLabel('Respuesta editable')).toBeFocused();await chat.getByLabel('Respuesta editable').fill('Edited by human');await chat.getByRole('button',{name:'Regenerar'}).click();await chat.getByRole('button',{name:'Detener respuesta'}).click();await chat.getByLabel('Respuesta editable').fill('Reviewed response');}else{await expect(chat.getByRole('button',{name:'Detener respuesta'})).toHaveCount(0);await expect(chat.getByText('Su interfaz es accesible al 100 %.',{exact:false})).toBeVisible();}for(const key of ['Claridad','Control','Tono','Transparencia'])await chat.getByLabel(key,{exact:true}).selectOption('4');await chat.getByLabel('Evidencia de la evaluación').fill('Human judgement');await chat.getByRole('button',{name:'Guardar rúbrica del chatbot'}).click();}const s=await stored(page);expect(s.evidence).toHaveLength(2);expect(s.evidence.every((e:{chatbot:{human:boolean}})=>e.chatbot.human)).toBe(true);expect(s.evidence[1].chatbot.response).toBe('Reviewed response');expect(s.evidence[1].scores.transparency).toBe(4);});
  13 | test('iteration7: backup recovery, reports and reset clear active work across reload',async({page})=>{await page.goto('/hci-lab-ia/#/user-testing');await page.getByRole('button',{name:'SUS',exact:true}).click();await page.getByLabel('Interfaz o tarea evaluada').fill('Persisted task');for(let i=1;i<=10;i++)await page.getByLabel(`Respuesta SUS ${i}`,{exact:true}).selectOption('3');await page.getByRole('button',{name:'Guardar SUS'}).click();const original=await stored(page);await page.goto('/hci-lab-ia/#/reports');await expect(page.getByText('Persisted task',{exact:false})).toBeVisible();await page.getByRole('button',{name:'Gestionar proyecto',exact:true}).click();const dl=page.waitForEvent('download');await page.getByRole('button',{name:'Descargar respaldo JSON'}).click();const stream=await(await dl).createReadStream();let body='';for await(const chunk of stream!)body+=chunk.toString();expect(JSON.parse(body).evidence[0].scores.sus).toBe(50);await page.getByRole('button',{name:'Restablecer proyecto',exact:true}).click();await page.getByRole('button',{name:'Borrar datos y restablecer'}).click();await page.reload();expect((await stored(page)).evidence).toEqual([]);await page.getByRole('button',{name:'Gestionar proyecto',exact:true}).click();await page.locator('dialog input[type=file]').setInputFiles({name:'iteration7.json',mimeType:'application/json',buffer:new TextEncoder().encode(body)});await page.getByRole('button',{name:'Reemplazar y recuperar'}).click();expect((await stored(page)).evidence).toEqual(original.evidence);});
> 14 | for(const language of evalLanguages)test(`iteration7: full module content and authored text in ${language}`,async({page})=>{const r=evaluationResources[language];await page.addInitScript(lang=>localStorage.setItem('hci-language',lang),language);for(const [route,title]of [['experiments','experiment'],['evaluation','evaluation'],['ai','aiTitle'],['chatbots','chatTitle'],['user-testing','testing']]){await page.goto(`/hci-lab-ia/#/${route}`);await expect(page.locator('.i7')).not.toContainText('evaluationLab.');if(route!=='experiments')await expect(page.getByRole('heading',{name:r[title],exact:true})).toBeVisible();if(route==='evaluation'){for(const h of heuristicContent(language)){const detail=page.locator('.i7 details').filter({has:page.getByText(h.name,{exact:true})});await detail.locator('summary').click();await expect(detail).toContainText(h.question);await expect(detail).toContainText(h.example);}}if(route==='ai'){await page.getByLabel(r.prompt,{exact:true}).fill('USER_AUTHORED_TEXT');await page.getByRole('button',{name:r.generate}).click();await expect(page.getByLabel(r.proposal)).toContainText('USER_AUTHORED_TEXT');}if(route==='user-testing'){await page.getByRole('button',{name:'SUS',exact:true}).click();for(let i=1;i<=10;i++)await expect(page.getByLabel(r.susResponse.replace('{{number}}',String(i)))).toBeVisible();}expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}});
     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               ^ Error: expect(locator).toBeVisible() failed
  15 | for(const theme of ['light','dark','contrast','dark-contrast'])test(`iteration7: strict axe, keyboard and responsive layout in ${theme}`,async({page},info)=>{await page.addInitScript(name=>localStorage.setItem('hci-prefs-v2',JSON.stringify({dark:name.includes('dark'),contrast:name.includes('contrast'),font:100,spacing:false,dyslexia:false,motion:true})),theme);for(const route of ['experiments','evaluation','ai','chatbots','user-testing']){await page.goto(`/hci-lab-ia/#/${route}`);if(route==='evaluation')await page.getByRole('button',{name:'Nuevo hallazgo'}).click();if(route==='user-testing')await page.getByRole('button',{name:'Raw TLX',exact:true}).click();const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(axe.violations.map(v=>v.id)).toEqual([]);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.screenshot({path:info.outputPath(`${route}-${theme}.png`)});}});
  16 | 
```