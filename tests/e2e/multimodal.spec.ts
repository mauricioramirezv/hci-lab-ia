import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('multimodal evidence persists and is exported with the project', async ({ page }) => {
 await page.goto('/hci-lab-ia/#/multimodal');
 await page.getByRole('combobox',{name:'Percepción del color',exact:true}).selectOption('protanopia');
 await page.getByRole('button',{name:'Confirmar',exact:true}).click();
 await page.getByLabel('Observación, problema y corrección propuesta').fill('Texto y símbolo permiten identificar la confirmación.');
 await page.getByRole('button',{name:'Guardar evidencia',exact:true}).click();
 await expect(page.getByText('Evidencia guardada en el proyecto',{exact:true})).toBeVisible();
 await page.reload();
 await expect(page.getByText('Texto y símbolo permiten identificar la confirmación.',{exact:true})).toBeVisible();
 const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('hci-lab-ia-project-v2') || '{}'));
 expect(stored.multimodalEvidence[0]).toMatchObject({device:'watch',vision:'protanopia'});
 const download = page.waitForEvent('download');
 await page.getByRole('button',{name:'Exportar proyecto',exact:true}).click();
 expect((await download).suggestedFilename()).toBe('hci-lab-ia-project.json');
});
test('vehicle controls, keyboard and automatic accessibility check', async ({ page }) => {
 await page.goto('/hci-lab-ia/#/multimodal');
 await page.getByRole('combobox',{name:'Dispositivo',exact:true}).selectOption('car');
 await page.getByLabel('Simular vehículo en movimiento').check();
 await expect(page.getByRole('button',{name:'Navegar',exact:true})).toBeDisabled();
 await page.getByLabel('Comando (confirmar, cancelar, navegar)').fill('navegar');
 await page.getByLabel('Comando (confirmar, cancelar, navegar)').press('Enter');
 await expect(page.getByRole('status',{name:'Estado de la demostración'})).toHaveText('Ruta simulada preparada');
 const results = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
 expect(results.violations.filter(v => ['serious','critical'].includes(v.impact || ''))).toEqual([]);
 expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
test('all device simulations have working primary actions', async ({ page }) => {
 await page.goto('/hci-lab-ia/#/multimodal');
 for (const [device, button, status] of [['desktop','Confirmar','Confirmación registrada'],['tablet','Confirmar','Confirmación registrada'],['mobile','Confirmar','Confirmación registrada'],['tv','Reproducir','Reproducción simulada iniciada'],['kiosk','Solicitar turno','Turno simulado A-01'],['iot','Cambiar luz','Encendida']]) {
  await page.getByRole('combobox',{name:'Dispositivo',exact:true}).selectOption(device);
  await page.getByRole('button',{name:button,exact:true}).click();
  await expect(page.getByRole('status',{name:'Estado de la demostración'})).toContainText(status);
 }
});
