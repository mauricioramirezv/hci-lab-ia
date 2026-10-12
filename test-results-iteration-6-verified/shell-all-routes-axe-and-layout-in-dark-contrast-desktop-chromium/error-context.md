# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: shell.spec.ts >> all routes: axe and layout in dark-contrast
- Location: tests\e2e\shell.spec.ts:8:3

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:4173/hci-lab-ia/#/
Call log:
  - navigating to "http://127.0.0.1:4173/hci-lab-ia/#/", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import AxeBuilder from '@axe-core/playwright';
  3  | import { shellResources } from '../../src/shellLocales';
  4  | import { manageResources } from '../../src/manageLocales';
  5  | 
  6  | const routes = ['/', '/lab', '/concepts', '/research', '/practices', '/devices', '/multimodal', '/tracking', '/experiments', '/chatbots', '/reports', '/accessibility', '/evaluation', '/user-testing', '/metrics', '/ai', '/quality', '/course'];
  7  | for (const theme of ['light', 'dark', 'contrast', 'dark-contrast']) {
  8  |   test(`all routes: axe and layout in ${theme}`, async ({ page }, testInfo) => {
  9  |     await page.addInitScript((theme) => localStorage.setItem('hci-prefs-v2', JSON.stringify({dark:theme.includes('dark'),contrast:theme.includes('contrast'),font:100,spacing:false,dyslexia:false,motion:true})), theme);
  10 |     for (const route of routes) {
> 11 |       await page.goto(`/hci-lab-ia/#${route}`);
     |                  ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:4173/hci-lab-ia/#/
  12 |       await expect(page.locator('main h1')).toBeVisible();
  13 |       const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  14 |       await testInfo.attach(`${theme}-${route.replace('/', '') || 'home'}-axe`, { body: JSON.stringify(results.violations, null, 2), contentType:'application/json' });
  15 |       expect.soft(results.violations.map(v => ({id:v.id, impact:v.impact, targets:v.nodes.map(n=>n.target)})), route).toEqual([]);
  16 |       expect.soft(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${route}: horizontal overflow`).toBe(true);
  17 |       if (route === '/') await page.screenshot({path:testInfo.outputPath(`${theme}-home.png`),fullPage:true});
  18 |     }
  19 |   });
  20 | }
  21 | 
  22 | test('mobile menu: hidden links, Escape, focus trap and route focus', async ({ page }) => {
  23 |   await page.setViewportSize({width:360,height:800});
  24 |   await page.goto('/hci-lab-ia/');
  25 |   const opener = page.getByRole('button',{name:'Abrir menú'});
  26 |   await expect(page.getByRole('link',{name:'Laboratorio',exact:true})).toBeHidden();
  27 |   await opener.focus(); await page.keyboard.press('Enter');
  28 |   await expect(opener).toHaveAttribute('aria-expanded','true');
  29 |   await expect(page.getByRole('button',{name:'Cerrar',exact:true})).toBeFocused();
  30 |   await page.keyboard.press('Shift+Tab');
  31 |   await expect(page.locator('.sidebar nav a').last()).toBeFocused();
  32 |   await page.keyboard.press('Tab');
  33 |   await expect(page.getByRole('button',{name:'Cerrar',exact:true})).toBeFocused();
  34 |   await page.keyboard.press('Escape'); await expect(opener).toBeFocused();
  35 |   await page.keyboard.press('Enter');
  36 |   await page.getByRole('link',{name:'Laboratorio',exact:true}).click();
  37 |   await expect(page.locator('main')).toBeFocused();
  38 |   await expect(opener).toHaveAttribute('aria-expanded','false');
  39 | });
  40 | 
  41 | test('six languages translate the common shell', async ({page}) => {
  42 |   await page.goto('/hci-lab-ia/');
  43 |   for (const [lang, label] of [['es-CO','Inicio y aprendizaje'],['en-US','Home and learning'],['pt-BR','Início e aprendizagem'],['fr-FR','Accueil et apprentissage'],['it-IT','Home e apprendimento'],['ca-ES','Inici i aprenentatge']]) {
  44 |     await page.locator('.language select').selectOption(lang);
  45 |     await expect(page.locator('.nav-group h2').first()).toHaveText(label);
  46 |     await expect(page.locator('main')).toHaveAttribute('lang',lang);
  47 |     const labels = shellResources[lang as keyof typeof shellResources];
  48 |     await expect(page.locator('.page-tracker > button')).toHaveText(labels.tracker);
  49 |     await expect(page.locator('.skip-link')).toHaveText(labels.skip);
  50 |     await expect(page.getByRole('button',{name:manageResources[lang as keyof typeof manageResources].title,exact:true})).toHaveCount(1);
  51 |     await expect(page.locator('.project-actions')).toHaveCount(0);
  52 |   }
  53 | });
  54 | 
  55 | test('responsive review: desktop, tablet, mobile and 200% text', async ({page}, testInfo) => {
  56 |   for (const [name,width,height] of [['desktop',1440,900],['tablet',768,1024],['mobile',360,800]] as const) {
  57 |     await page.setViewportSize({width,height});
  58 |     await page.goto('/hci-lab-ia/');
  59 |     for (const font of [100,200]) {
  60 |       await page.evaluate(font => document.documentElement.style.fontSize=`${font}%`,font);
  61 |       expect.soft(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth+1),`${name} ${font}%`).toBe(true);
  62 |       await page.screenshot({path:testInfo.outputPath(`${name}-${font}.png`),fullPage:true});
  63 |     }
  64 |   }
  65 | });
  66 | 
```