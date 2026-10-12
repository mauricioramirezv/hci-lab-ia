import { chromium, test, expect } from '@playwright/test';

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
    await page.goto('http://127.0.0.1:4173/hci-lab-ia/');
    const zoom = await worker.evaluate(async () => {
      // Browser tabs API changes real page zoom, including CSS pixels and media queries.
      const api = (globalThis as unknown as {chrome:{tabs:{query:(q:object)=>Promise<{id:number}[]>;setZoom:(id:number,z:number)=>Promise<void>;getZoom:(id:number)=>Promise<number>}}}).chrome;
      const tabs = await api.tabs.query({});
      await api.tabs.setZoom(tabs[0].id,2);
      return api.tabs.getZoom(tabs[0].id);
    });
    expect(zoom).toBe(2);
    await page.getByRole('button',{name:'Gestionar proyecto',exact:true}).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.getByRole('button',{name:'Restablecer proyecto',exact:true}).click();
    await expect(page.getByRole('button',{name:'Cancelar',exact:true})).toBeFocused();
    await expect(page.getByRole('button',{name:'Borrar datos y restablecer'})).toBeInViewport();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
    await page.keyboard.press('Escape');
    await expect(page.getByRole('button',{name:'Gestionar proyecto',exact:true})).toBeFocused();
    for (const route of ['/', '/lab', '/concepts', '/research', '/practices', '/devices', '/multimodal', '/tracking', '/experiments', '/chatbots', '/reports', '/accessibility', '/evaluation', '/user-testing', '/metrics', '/ai', '/quality', '/course']) {
      await page.goto(`http://127.0.0.1:4173/hci-lab-ia/#${route}`);
      await expect(page.locator('main h1')).toBeVisible();
      expect.soft(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth+1),route).toBe(true);
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
        await page.getByLabel('Contexto',{exact:true}).selectOption('university');
        await page.getByLabel('Servicio',{exact:true}).selectOption('workshop');
        await page.getByRole('button',{name:'Continuar',exact:true}).click();
        await expect(page.locator('.activity-panel h2')).toBeFocused();
        expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
        await page.getByRole('button',{name:'Cancelar',exact:true}).focus();await page.keyboard.press('Enter');
        await expect(page.getByRole('status')).toBeFocused();
      }
      if (route === '/research') {
        await page.getByRole('button',{name:'Nueva persona',exact:true}).click();
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
        const session = await context.newCDPSession(page);
        const capture = await session.send('Page.captureScreenshot', {format:'png',captureBeyondViewport:false});
        const pending = page.waitForEvent('download');
        await page.evaluate(data => {
          const link = document.createElement('a');
          link.href = `data:image/png;base64,${data}`; link.download = 'zoom.png'; link.click();
        },capture.data);
        await (await pending).saveAs(testInfo.outputPath(`zoom-200-${route === '/'?'home':route === '/lab'?'lab':route === '/research'?'research':route === '/practices'?'patterns':'concepts'}.png`));
        await session.detach();
      }
    }
  } finally { await context.close(); }
});
