import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('factory reset cancels safely, resets project and preferences, and persists',async({page})=>{
  await page.goto('/hci-lab-ia/');
  await page.getByRole('button',{name:'Cargar caso: cita médica'}).click();
  await page.getByRole('button',{name:'Gestionar proyecto',exact:true}).click();
  await page.getByRole('button',{name:'Restablecer proyecto',exact:true}).click();
  await expect(page.getByRole('dialog')).toBeVisible();await page.getByRole('button',{name:'Cancelar',exact:true}).click();
  expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('hci-lab-ia-project-v2')!).personas.length)).toBe(1);
  await page.getByRole('button',{name:'Gestionar proyecto',exact:true}).click();
  await page.getByRole('button',{name:'Restablecer proyecto',exact:true}).click();await page.getByRole('button',{name:'Borrar datos y restablecer'}).click();
  await page.reload();expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('hci-lab-ia-project-v2')!).personas.length)).toBe(0);
  expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('hci-prefs-v2')!).dark)).toBe(false);
});
test('concepts are grouped and produce evidence from an actual task',async({page})=>{
  await page.goto('/hci-lab-ia/#/concepts');await page.getByRole('combobox',{name:'Temática',exact:true}).selectOption('0');
  await expect(page.getByRole('heading',{name:'Accesibilidad',exact:true})).toHaveCount(0);
  await page.getByRole('button',{name:'Abrir actividad: Usabilidad',exact:true}).click();
  await page.getByRole('button',{name:'Iniciar prueba',exact:true}).click();await page.getByRole('button',{name:'Una visita · 12 €',exact:true}).click();
  await page.getByLabel('Alias opcional').fill('P01');await page.getByRole('textbox',{name:'Observación',exact:true}).fill('Acción clara y sin errores.');await page.getByRole('button',{name:'Guardar resultados',exact:true}).click();
  expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('hci-lab-ia-project-v2')!).evidence[0].scores.interactions)).toBe(1);
});
test('page telemetry separates real clicks, scroll and simulated points',async({page},testInfo)=>{
  await page.goto('/hci-lab-ia/#/quality');await page.getByRole('button',{name:'Seguimiento de página'}).click();const tracker=page.locator('.page-tracker');
  await tracker.getByLabel('Alias (opcional)',{exact:true}).fill('P02');await tracker.getByLabel('Tarea',{exact:true}).fill('Consultar comandos');await tracker.getByLabel('Modo de recorrido',{exact:true}).selectOption('F');await tracker.getByRole('button',{name:'Iniciar captura'}).click();await tracker.getByRole('button',{name:'Iniciar recorrido',exact:true}).click();
  await page.locator('main h1').click();await tracker.getByRole('button',{name:'Seguimiento de página'}).click();
  await page.mouse.move(400,400);await page.mouse.wheel(0,550);await page.waitForTimeout(1200);
  await page.getByRole('button',{name:'Seguimiento de página'}).click();await tracker.getByRole('button',{name:'Detener captura'}).click();await tracker.getByLabel('Observación de la sesión').fill('Datos separados por canal.');await tracker.getByRole('button',{name:'Guardar sesión en proyecto'}).click();
  const s=await page.evaluate(()=>JSON.parse(localStorage.getItem('hci-lab-ia-project-v2')!).pageSessions[0]);expect(s.clicks.length).toBe(1);expect(s.simulation.length).toBeGreaterThan(0);expect(s.gaze.length).toBe(0);expect(s.scroll.length).toBeGreaterThan(1);expect(s.participant).toBe('P02');
  await tracker.getByLabel('Mostrar mapa').check();await page.screenshot({path:`/tmp/hci24-tracker-${testInfo.project.name}.png`});
  await tracker.getByRole('button',{name:'Seguimiento de página'}).click();
  await page.getByRole('button',{name:'Gestionar proyecto',exact:true}).click();
  const backup=page.waitForEvent('download');await page.getByRole('button',{name:'Descargar respaldo JSON',exact:true}).click();
  expect((await backup).suggestedFilename()).toBe('hci-lab-ia-project.json');
});
test('Raw TLX, report download and human AI decisions persist',async({page})=>{
  await page.goto('/hci-lab-ia/#/user-testing');await page.getByRole('button',{name:'Raw TLX',exact:true}).click();const tlx=page.locator('form').filter({has:page.getByRole('heading',{name:'Carga de trabajo: Raw NASA-TLX'})});
  await tlx.getByLabel('Alias opcional').fill('P03');await tlx.getByLabel('Interfaz o tarea evaluada').fill('Reserva');await tlx.getByLabel('Observaciones').fill('Confirmación comprendida');
  for(const text of ['Exigencia mental','Exigencia física','Exigencia temporal','Rendimiento: 0 excelente, 100 deficiente','Esfuerzo','Frustración'])await tlx.getByLabel(text,{exact:true}).fill('30');
  await tlx.getByRole('button',{name:'Guardar Raw TLX'}).click();await page.goto('/hci-lab-ia/#/ai');await page.getByLabel('Contexto y evidencia observada').fill('Estado comunicado solo por color');await page.getByRole('button',{name:'Generar propuesta simulada'}).click();await page.getByLabel('Propuesta editable').fill('Añadir confirmación redundante');await page.getByLabel('Justificación humana').fill('Necesita redundancia');await page.getByRole('button',{name:'Aplicar propuesta editada'}).click();
  await page.goto('/hci-lab-ia/#/reports');await page.getByRole('button',{name:'Generar informe',exact:true}).click();await page.getByRole('button',{name:'Revisar vista previa',exact:true}).click();const download=page.waitForEvent('download');await page.getByRole('button',{name:'Exportar informe Markdown'}).click();expect((await download).suggestedFilename()).toBe('hci-informe.md');
  expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('hci-lab-ia-project-v2')!).evidence[0].scores.rawTLX)).toBe(30);
});
test('chatbot cancellation and rubric save work',async({page})=>{
  await page.goto('/hci-lab-ia/#/chatbots');const chat=page.locator('section').filter({has:page.getByRole('heading',{name:'Chatbot B: buena práctica'})});await chat.getByLabel('Mensaje editable').fill('Revisar accesibilidad');await chat.getByRole('button',{name:'Enviar mensaje'}).click();await expect(chat.getByText('Generando respuesta simulada…')).toBeVisible();await chat.getByRole('button',{name:'Detener respuesta'}).click();
  await chat.getByLabel('Respuesta editable').fill('Respuesta revisada tras detener');await chat.getByLabel('Alias opcional').fill('P04');for(const label of ['Claridad','Control','Tono','Transparencia'])await chat.getByLabel(label,{exact:true}).selectOption('4');await chat.getByLabel('Evidencia de la evaluación').fill('Se pudo detener la respuesta.');await chat.getByRole('button',{name:'Guardar rúbrica del chatbot'}).click();expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('hci-lab-ia-project-v2')!).evidence[0].condition)).toBe('B-buena');
});
test('new routes have no serious automatic accessibility violations',async({page})=>{
  for(const route of ['concepts','experiments','chatbots','reports','accessibility']){await page.goto(`/hci-lab-ia/#/${route}`);const results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(results.violations.filter(v=>['serious','critical'].includes(v.impact || ''))).toEqual([]);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}
});
test('eight experimental attempts are measured and SUS requires all responses',async({page})=>{
  await page.goto('/hci-lab-ia/#/experiments');await page.getByLabel('Alias opcional').fill('P05');await page.getByRole('button',{name:'Iniciar práctica'}).click();for(let i=0;i<2;i++){const status=await page.locator('.i7 [role=status]').innerText();const target=status.match(/Seleccione (\d+)/)![1];await page.getByRole('button',{name:`Objetivo ${target}`,exact:true}).click();}await page.getByRole('button',{name:'Iniciar medición'}).click();
  for(let i=0;i<8;i++){const status=await page.locator('.i7 [role=status]').innerText();const target=status.match(/Seleccione (\d+)/)![1];await page.getByRole('button',{name:`Objetivo ${target}`,exact:true}).click();}
  await page.getByLabel('Interpretación y limitaciones').fill('Primera condición; falta comparar con objetivos pequeños.');await page.getByRole('button',{name:'Guardar experimento'}).click();expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('hci-lab-ia-project-v2')!).evidence[0].scores.trials)).toBe(8);
  await page.goto('/hci-lab-ia/#/user-testing');await page.getByRole('button',{name:'SUS',exact:true}).click();await expect(page.getByRole('button',{name:'Guardar SUS',exact:true})).toBeDisabled();await page.getByLabel('Alias opcional').fill('P05');await page.getByLabel('Interfaz o tarea evaluada').fill('Reserva');for(let i=1;i<=10;i++)await page.getByLabel(`Respuesta SUS ${i}`,{exact:true}).selectOption(i%2===1?'5':'1');await page.getByRole('button',{name:'Guardar SUS',exact:true}).click();expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('hci-lab-ia-project-v2')!).evidence.find((e:{kind:string})=>e.kind==='sus').scores.sus)).toBe(100);
});
