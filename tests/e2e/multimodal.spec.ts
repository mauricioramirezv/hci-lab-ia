import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const languages=['es-CO','en-US','pt-BR','fr-FR','it-IT','ca-ES'];
const sectionTitles:Record<string,string[]>={
 'es-CO':['Dispositivo','Demostración de tarea','Alerta por múltiples canales','Comparación de dispositivos','Evidencias guardadas'],
 'en-US':['Device','Task demonstration','Multichannel alert','Device comparison','Saved evidence'],
 'pt-BR':['Dispositivo','Demonstração de tarefa','Alerta por vários canais','Comparação de dispositivos','Evidências salvas'],
 'fr-FR':['Appareil','Démonstration de tâche','Alerte multicanale','Comparaison des appareils','Preuves enregistrées'],
 'it-IT':['Dispositivo','Dimostrazione del compito','Avviso su più canali','Confronto dei dispositivi','Evidenze salvate'],
 'ca-ES':['Dispositiu','Demostració de tasca','Avís per diversos canals','Comparació de dispositius','Evidències desades'],
};
test('multimodal evidence persists and is exported with the project', async ({ page }) => {
 await page.goto('/hci-lab-ia/#/multimodal');
 await page.locator('#multimodal-evidence-heading').click();
 await page.getByRole('combobox',{name:'Percepción del color',exact:true}).selectOption('protanopia');
 await page.getByRole('button',{name:'Confirmar',exact:true}).click();
 await page.getByLabel('Observación, problema y corrección propuesta').fill('Texto y símbolo permiten identificar la confirmación.');
 await page.locator('#multimodal-evidence-panel').getByRole('button',{name:'Guardar evidencia',exact:true}).click();
 await expect(page.getByText('Evidencia guardada en el proyecto',{exact:true})).toBeVisible();
 await page.reload();await page.locator('#multimodal-evidence-heading').click();
 await expect(page.getByText('Texto y símbolo permiten identificar la confirmación.',{exact:true})).toBeVisible();
 const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('hci-lab-ia-project-v2') || '{}'));
 expect(stored.multimodalEvidence[0]).toMatchObject({device:'watch',vision:'protanopia'});
 const download = page.waitForEvent('download');
 await page.getByRole('button',{name:'Gestionar proyecto',exact:true}).click();
 await page.getByRole('button',{name:'Descargar respaldo JSON',exact:true}).click();
 expect((await download).suggestedFilename()).toBe('hci-lab-ia-project.json');
});
test('vehicle controls, keyboard and automatic accessibility check', async ({ page }) => {
 await page.goto('/hci-lab-ia/#/multimodal');
 await page.getByRole('combobox',{name:'Dispositivo',exact:true}).selectOption('car');
 await page.getByLabel('Simular vehículo en movimiento').check();
 await expect(page.getByRole('button',{name:'Navegar',exact:true})).toBeDisabled();
 await page.locator('#multimodal-channels-heading').click();
 await page.getByLabel('Comando (confirmar, cancelar, navegar)').fill('navegar');
 await page.getByLabel('Comando (confirmar, cancelar, navegar)').press('Enter');
 await expect(page.getByRole('status',{name:'Estado de la demostración'})).toHaveText('Ruta simulada preparada');
 const results = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
 expect(results.violations.filter(v => ['serious','critical'].includes(v.impact || ''))).toEqual([]);
 expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('multimodal sections are translated and operable in all six languages',async({page})=>{
 await page.goto('/hci-lab-ia/#/multimodal');
 let previousLabels:string[]=[];
 for(const language of languages){
  await page.locator('.language select').selectOption(language);
  const sectionIds=['multimodal-controls','multimodal-demo','multimodal-channels','multimodal-devices','multimodal-evidence'];const labels:string[]=[];
  const translatedLabels=sectionTitles[language];
  for(const [index,id,expanded] of sectionIds.map((id,index)=>[index,id,index<2] as const)){
   const heading=page.locator(`#${id}-heading`);await expect(heading).toBeVisible();await expect(heading).toHaveText(translatedLabels[index]);await expect(heading).toHaveAttribute('aria-expanded',String(expanded));const label=(await heading.innerText()).trim();labels.push(label);
   if(!expanded){await heading.focus();await page.keyboard.press('Enter');await expect(heading).toHaveAttribute('aria-expanded','true');await expect(page.locator(`#${id}-panel`)).toBeVisible();await page.keyboard.press('Enter');await expect(heading).toHaveAttribute('aria-expanded','false');}
  }
  expect(new Set(labels).size).toBe(labels.length);if(previousLabels.length&&language!=='es-CO')expect(labels).not.toEqual(previousLabels);previousLabels=labels;
 }
});
test('all device simulations have working primary actions', async ({ page }) => {
 await page.goto('/hci-lab-ia/#/multimodal');
 for (const [device, button, status] of [['desktop','Confirmar','Confirmación registrada'],['tablet','Confirmar','Confirmación registrada'],['mobile','Confirmar','Confirmación registrada'],['tv','Reproducir','Reproducción simulada iniciada'],['kiosk','Solicitar turno','Turno simulado A-01'],['iot','Cambiar luz','Encendida']]) {
  await page.getByRole('combobox',{name:'Dispositivo',exact:true}).selectOption(device);
  await page.getByRole('button',{name:button,exact:true}).click();
  await expect(page.getByRole('status',{name:'Estado de la demostración'})).toContainText(status);
 }
});
