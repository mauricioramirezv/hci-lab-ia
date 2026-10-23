import {test,expect} from '@playwright/test';
import {closureResources} from '../../src/app/locales/closure';
const text=closureResources['es-CO'];
test('route loading: announces delayed section while preserving global controls and keyboard shortcut',async({page})=>{
 await page.goto('/hci-lab-ia/');await expect(page.locator('main h1')).toBeVisible();
 let release=()=>{};const held=new Promise<void>(resolve=>{release=resolve;});
 await page.route('**/assets/*.js',async route=>{await held;await route.continue();});
 try{
  await page.evaluate(()=>{location.hash='#/research';});await expect(page.getByRole('status').filter({hasText:text.loading})).toBeVisible();await expect(page.getByRole('status').filter({hasText:text.loading})).toHaveAttribute('aria-busy','true');
  await page.keyboard.press('Alt+Shift+KeyV');await expect(page.getByRole('dialog',{name:'Preferencias de visualización',exact:true})).toBeVisible();await page.keyboard.press('Escape');
 }finally{release();}
 await expect(page.getByRole('button',{name:'Crear persona',exact:true})).toBeVisible();await expect(page.locator('main h1')).toHaveAccessibleDescription(/.+/);
});
test('route loading: failed module offers an accessible retry without losing saved data',async({page})=>{
 await page.goto('/hci-lab-ia/');await expect(page.locator('main h1')).toBeVisible();const before=await page.evaluate(()=>localStorage.getItem('hci-lab-ia-project-v2'));
 await page.route('**/assets/*.js',route=>route.abort());await page.evaluate(()=>{location.hash='#/research';});await expect(page.getByRole('heading',{name:text.loadError,exact:true})).toBeVisible();await expect(page.getByRole('alert')).toContainText(text.loadHelp);expect(await page.evaluate(()=>localStorage.getItem('hci-lab-ia-project-v2'))).toBe(before);
 await page.unroute('**/assets/*.js');await page.getByRole('button',{name:text.reload,exact:true}).click();await expect(page.getByRole('button',{name:'Crear persona',exact:true})).toBeVisible();expect(await page.evaluate(()=>localStorage.getItem('hci-lab-ia-project-v2'))).toBe(before);
});
