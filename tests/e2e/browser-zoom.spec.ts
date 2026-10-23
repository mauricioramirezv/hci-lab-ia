import {discardChanges} from '../support/crud';
import { chromium, test, expect } from '@playwright/test';
import {displayResources} from '../../src/features/accessibility/locales';

test('actual Chromium browser zoom at 200%', async ({ browserName }, testInfo) => {
  expect(browserName).toBe('chromium');
  test.skip(testInfo.project.name !== 'desktop-chromium', 'Browser zoom uses a desktop Chromium extension.');
  const extension = decodeURIComponent(new URL('../fixtures/zoom-extension', import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1');
  const context = await chromium.launchPersistentContext(testInfo.outputPath('profile'), {
    channel:'chromium', headless:true, viewport:null, deviceScaleFactor:undefined,
    args:[`--disable-extensions-except=${extension}`, `--load-extension=${extension}`,'--window-size=1440,1000'],
  });
  try {
    const worker = context.serviceWorkers()[0] || await context.waitForEvent('serviceworker');
    const page = context.pages()[0];
    const screenshot=async(name:string)=>{
      const session=await context.newCDPSession(page);
      try{const capture=await session.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});const pending=page.waitForEvent('download');await page.evaluate(({data,name})=>{const link=document.createElement('a');link.href=`data:image/png;base64,${data}`;link.download=name;link.click();},{data:capture.data,name});await(await pending).saveAs(testInfo.outputPath(name));}finally{await session.detach();}
    };
    await page.goto('http://127.0.0.1:4173/hci-lab-ia/');
    const zoom = await worker.evaluate(async () => {
      // Browser tabs API changes real page zoom, including CSS pixels and media queries.
      const api = (globalThis as unknown as {chrome:{tabs:{query:(q:object)=>Promise<{id:number}[]>;setZoom:(id:number,z:number)=>Promise<void>;getZoom:(id:number)=>Promise<number>}}}).chrome;
      const tabs = await api.tabs.query({});
      await api.tabs.setZoom(tabs[0].id,2);
      return api.tabs.getZoom(tabs[0].id);
    });
    expect(zoom).toBe(2);
    const preferences=displayResources['es-CO'];
    await page.getByRole('button',{name:preferences.title,exact:true}).click();
    const displayDialog=page.getByRole('dialog',{name:preferences.title,exact:true});
    for(let i=0;i<4;i++)await displayDialog.getByRole('button',{name:preferences.increase,exact:true}).click();
    for(const label of [preferences.spacing,preferences.font,preferences.contrast,preferences.motion])await displayDialog.getByRole('checkbox',{name:label,exact:true}).check();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
    await page.keyboard.press('Escape');
    for(const route of ['/','/lab','/lab/users','/concepts','/research','/practices','/devices','/multimodal','/tracking','/experiments','/chatbots','/reports','/accessibility','/evaluation','/user-testing','/metrics','/ai','/quality','/course']){
      await page.goto(`http://127.0.0.1:4173/hci-lab-ia/#${route}`);
      await expect(page.locator('main h1')).toBeVisible();
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`200% text and real zoom: ${route}`).toBe(true);
    }
    await screenshot('zoom-200-text-200.png');
    await page.getByRole('button',{name:preferences.title,exact:true}).click();
    await displayDialog.getByRole('button',{name:preferences.restore,exact:true}).focus();
    await page.keyboard.press('Enter');
    await expect(displayDialog.getByRole('status')).toHaveText(preferences.restored);
    await page.keyboard.press('Escape');
    await expect(page.getByRole('button',{name:preferences.title,exact:true})).toBeFocused();
    await page.getByRole('button',{name:'Gestionar proyecto',exact:true}).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.getByRole('button',{name:'Restablecer proyecto',exact:true}).click();
    await expect(page.getByRole('button',{name:'Cancelar',exact:true})).toBeFocused();
    await expect(page.getByRole('button',{name:'Borrar datos y restablecer'})).toBeInViewport();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
    await page.keyboard.press('Escape');
    await expect(page.getByRole('button',{name:'Gestionar proyecto',exact:true})).toBeFocused();
    for (const route of ['/', '/lab', '/lab/users', '/concepts', '/research', '/practices', '/devices', '/multimodal', '/tracking', '/experiments', '/chatbots', '/reports', '/accessibility', '/evaluation', '/user-testing', '/metrics', '/ai', '/quality', '/course']) {
      await page.goto(`http://127.0.0.1:4173/hci-lab-ia/#${route}`);
      await expect(page.locator('main h1')).toBeVisible();
      expect.soft(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth+1),route).toBe(true);
      if (route === '/lab/users') {
        await page.getByRole('button',{name:'Crear usuario',exact:true}).focus();await page.keyboard.press('Enter');
        await expect(page.locator('.users-page h2')).toBeFocused();
        await page.getByLabel('Nombre ficticio',{exact:true}).fill('Zoom user');
        await page.getByLabel('Correo de prueba',{exact:true}).fill('zoom@example.test');
        await page.getByRole('button',{name:'Guardar',exact:true}).click();
        await expect(page.getByRole('status')).toBeFocused();
        await page.getByRole('button',{name:'Eliminar usuario: Zoom user',exact:true}).click();
        await expect(page.getByRole('dialog').getByRole('button',{name:'Cancelar',exact:true})).toBeFocused();
        await expect(page.getByRole('dialog').getByRole('button',{name:'Eliminar usuario',exact:true})).toBeInViewport();
        expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
        await page.keyboard.press('Escape');
        await expect(page.getByRole('button',{name:'Eliminar usuario: Zoom user',exact:true})).toBeFocused();
        await screenshot('zoom-200-users.png');
      }
      if (route === '/concepts') {
        await page.locator('#open-concept-6').click();
        await page.getByRole('combobox',{name:'Condición',exact:true}).selectOption('bad');
        await page.getByRole('button',{name:'Iniciar prueba',exact:true}).focus();
        await page.keyboard.press('Enter');
        await expect(page.locator('.concept-activity h3.concept-focus')).toBeFocused();
        expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth+1)).toBe(true);
        await page.getByRole('button',{name:'Cancelar prueba',exact:true}).focus();
        await page.keyboard.press('Enter');
        await expect(page.getByText('Prueba cancelada',{exact:true})).toBeVisible();
      }
      if (route === '/lab') {
        await page.getByRole('button',{name:'Crear reserva',exact:true}).click();
        await page.getByLabel('Contexto',{exact:true}).selectOption('university');
        await page.getByLabel('Servicio',{exact:true}).selectOption('workshop');
        await page.getByRole('button',{name:'Continuar',exact:true}).click();
        await expect(page.locator('.activity-panel h2')).toBeFocused();
        expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
        await page.getByRole('button',{name:'Cancelar',exact:true}).focus();await page.keyboard.press('Enter');
        await discardChanges(page);await expect(page.getByRole('status')).toBeFocused();
      }
      if (route === '/research') {
        await page.getByRole('button',{name:'Crear persona',exact:true}).click();
        await expect(page.locator('form h2')).toBeFocused();
        await page.locator('summary').filter({hasText:'Mapa de empatía (opcional)'}).click();
        expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
        await page.getByRole('button',{name:'Cancelar',exact:true}).focus();await page.keyboard.press('Enter');
        await expect(page.getByRole('status')).toBeFocused();
      }
      if (route === '/practices') {
        await page.locator('#open-pattern-3').click();
        await page.getByRole('combobox',{name:'Condición',exact:true}).selectOption('bad');
        await page.getByRole('button',{name:'Comparar características y coste anual',exact:true}).click();
        expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth+1)).toBe(true);
        await page.getByRole('button',{name:'Cancelar',exact:true}).focus();
        await page.keyboard.press('Enter');
        await expect(page.locator('.pattern-runtime [role=status]')).toHaveText('Acción cancelada; no se aplicó ningún cambio externo.');
      }
      if (route === '/' || route === '/lab' || route === '/research' || route === '/concepts' || route === '/practices') {
        await screenshot(`zoom-200-${route === '/'?'home':route === '/lab'?'lab':route === '/research'?'research':route === '/practices'?'patterns':'concepts'}.png`);
      }
    }
  } finally { await context.close(); }
});
