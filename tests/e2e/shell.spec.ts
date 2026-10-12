import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { shellResources } from '../../src/shellLocales';
import { manageResources } from '../../src/manageLocales';

const routes = ['/', '/lab', '/concepts', '/research', '/practices', '/devices', '/multimodal', '/tracking', '/experiments', '/chatbots', '/reports', '/accessibility', '/evaluation', '/user-testing', '/metrics', '/ai', '/quality', '/course'];
for (const theme of ['light', 'dark', 'contrast', 'dark-contrast']) {
  test(`all routes: axe and layout in ${theme}`, async ({ page }, testInfo) => {
    await page.addInitScript((theme) => localStorage.setItem('hci-prefs-v2', JSON.stringify({dark:theme.includes('dark'),contrast:theme.includes('contrast'),font:100,spacing:false,dyslexia:false,motion:true})), theme);
    for (const route of routes) {
      await page.goto(`/hci-lab-ia/#${route}`);
      await expect(page.locator('main h1')).toBeVisible();
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      await testInfo.attach(`${theme}-${route.replace('/', '') || 'home'}-axe`, { body: JSON.stringify(results.violations, null, 2), contentType:'application/json' });
      expect.soft(results.violations.map(v => ({id:v.id, impact:v.impact, targets:v.nodes.map(n=>n.target)})), route).toEqual([]);
      expect.soft(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${route}: horizontal overflow`).toBe(true);
      if (route === '/') await page.screenshot({path:testInfo.outputPath(`${theme}-home.png`),fullPage:true});
    }
  });
}

test('mobile menu: hidden links, Escape, focus trap and route focus', async ({ page }) => {
  await page.setViewportSize({width:360,height:800});
  await page.goto('/hci-lab-ia/');
  const opener = page.getByRole('button',{name:'Abrir menú'});
  await expect(page.getByRole('link',{name:'Laboratorio',exact:true})).toBeHidden();
  await opener.focus(); await page.keyboard.press('Enter');
  await expect(opener).toHaveAttribute('aria-expanded','true');
  await expect(page.getByRole('button',{name:'Cerrar',exact:true})).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(page.locator('.sidebar nav a').last()).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button',{name:'Cerrar',exact:true})).toBeFocused();
  await page.keyboard.press('Escape'); await expect(opener).toBeFocused();
  await page.keyboard.press('Enter');
  await page.getByRole('link',{name:'Laboratorio',exact:true}).click();
  await expect(page.locator('main')).toBeFocused();
  await expect(opener).toHaveAttribute('aria-expanded','false');
});

test('six languages translate the common shell', async ({page}) => {
  await page.goto('/hci-lab-ia/');
  for (const [lang, label] of [['es-CO','Inicio y aprendizaje'],['en-US','Home and learning'],['pt-BR','Início e aprendizagem'],['fr-FR','Accueil et apprentissage'],['it-IT','Home e apprendimento'],['ca-ES','Inici i aprenentatge']]) {
    await page.locator('.language select').selectOption(lang);
    await expect(page.locator('.nav-group h2').first()).toHaveText(label);
    await expect(page.locator('main')).toHaveAttribute('lang',lang);
    const labels = shellResources[lang as keyof typeof shellResources];
    await expect(page.locator('.page-tracker > button')).toHaveText(labels.tracker);
    await expect(page.locator('.skip-link')).toHaveText(labels.skip);
    await expect(page.getByRole('button',{name:manageResources[lang as keyof typeof manageResources].title,exact:true})).toHaveCount(1);
    await expect(page.locator('.project-actions')).toHaveCount(0);
  }
});

test('responsive review: desktop, tablet, mobile and 200% text', async ({page}, testInfo) => {
  for (const [name,width,height] of [['desktop',1440,900],['tablet',768,1024],['mobile',360,800]] as const) {
    await page.setViewportSize({width,height});
    await page.goto('/hci-lab-ia/');
    for (const font of [100,200]) {
      await page.evaluate(font => document.documentElement.style.fontSize=`${font}%`,font);
      expect.soft(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth+1),`${name} ${font}%`).toBe(true);
      await page.screenshot({path:testInfo.outputPath(`${name}-${font}.png`),fullPage:true});
    }
  }
});
