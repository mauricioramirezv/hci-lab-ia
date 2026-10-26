import {test,expect} from '@playwright/test';
import {activityLanguages} from '../../src/app/locales/projectActivities';
import {userResources} from '../../src/features/users/locales';
import {crudResources} from '../../src/app/locales/crud';
import {displayResources} from '../../src/features/accessibility/locales';
import {discardChanges} from '../support/crud';

test('laboratory navigation stays inside translated cards and protects unfinished forms',async({page},info)=>{
 test.setTimeout(90000);
 const writes:string[]=[];page.on('request',request=>{if(['POST','PUT','PATCH','DELETE'].includes(request.method()))writes.push(request.url());});
 for(const language of activityLanguages){
  await page.goto('/hci-lab-ia/#/lab');await page.locator('.language select').selectOption(language);
  const create=page.locator('#reservation-create-heading');
  await expect(page.locator('#lab-section-reservations-heading').locator('..')).toHaveJSProperty('tagName','H2');
  await expect(create.locator('..')).toHaveJSProperty('tagName','H3');
  await expect(create).toHaveAttribute('aria-expanded','false');
  await expect(page.locator('main > .lab-navigation')).toHaveCount(0);
  await expect(page.locator('.lab-navigation a')).toBeHidden();
  await create.focus();await page.keyboard.press('Enter');
  await expect(create).toHaveAttribute('aria-expanded','true');await expect(page.locator('#context')).toBeVisible();
  await expect(page.locator('#reservation-create-panel h4')).toBeFocused();
  await page.locator('#context').selectOption('university');await page.locator('#service').selectOption('workshop');
  await create.click();await expect(page.getByRole('dialog',{name:crudResources[language].unsavedTitle,exact:true})).toBeVisible();
  await page.keyboard.press('Escape');await expect(page.locator('#context')).toHaveValue('university');await expect(page.locator('#service')).toHaveValue('workshop');
  await create.click();await discardChanges(page,language);await expect(create).toHaveAttribute('aria-expanded','false');
  const users=page.locator('#lab-section-users-heading');await users.focus();await page.keyboard.press('Enter');
  const link=page.locator('#lab-section-users-panel').getByRole('link',{name:userResources[language].title,exact:true});await expect(link).toBeVisible();await link.click();
  await expect(page.locator('#lab-section-users-heading')).toHaveAttribute('aria-expanded','true');
  const userCreate=page.locator('#users-create-heading');await expect(userCreate).toHaveAttribute('aria-expanded','false');await userCreate.click();
  await page.locator('#user-name').fill('Synthetic draft');await page.locator('#user-email').fill('synthetic@example.invalid');
  await userCreate.click();await expect(page.getByRole('dialog',{name:crudResources[language].unsavedTitle,exact:true})).toBeVisible();await page.keyboard.press('Escape');
  await expect(page.locator('#user-name')).toHaveValue('Synthetic draft');await userCreate.click();await discardChanges(page,language);await expect(userCreate).toHaveAttribute('aria-expanded','false');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 }
 expect(writes).toEqual([]);await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:info.outputPath('laboratory-cards.png'),fullPage:true});
});

test('shared typography gives cards readable white titles and consistent toolbar controls',async({page},info)=>{
 await page.goto('/hci-lab-ia/#/lab');
 const metrics=await page.evaluate(()=>{
  const style=(selector:string)=>getComputedStyle(document.querySelector(selector)!);
  const controls=[...document.querySelectorAll('.topbar .reset-control > button,.topbar .topbar-account,.topbar .page-tracker > button')].map(node=>{const value=getComputedStyle(node);return {family:value.fontFamily,size:value.fontSize,weight:value.fontWeight};});
  const h1=style('main h1'),h2=style('#lab-section-reservations-heading'),body=style('main'),brand=style('.top-title strong'),subtitle=style('.top-title span');
  return {controls,h1:parseFloat(h1.fontSize),h2:parseFloat(h2.fontSize),body:parseFloat(body.fontSize),family:[h1.fontFamily,h2.fontFamily,body.fontFamily],color:h2.color,context:parseFloat(style('.page-head .eyebrow').fontSize),brand:parseFloat(brand.fontSize),subtitle:parseFloat(subtitle.fontSize),subtitleDisplay:subtitle.display};
 });
 expect(new Set(metrics.controls.map(item=>`${item.family}|${item.size}|${item.weight}`)).size).toBe(1);
 expect(metrics.controls[0].weight).toBe('700');expect(new Set(metrics.family).size).toBe(1);
 expect(metrics.h1).toBeGreaterThan(metrics.h2);expect(metrics.h2).toBeGreaterThan(metrics.body);expect(metrics.context).toBeGreaterThanOrEqual(16);
 expect(metrics.color).toBe('rgb(255, 255, 255)');expect(metrics.brand).toBeGreaterThan(16);expect(metrics.subtitle).toBeGreaterThanOrEqual(16);expect(metrics.subtitleDisplay).not.toBe('none');
 await page.screenshot({path:info.outputPath('laboratory-typography.png'),fullPage:true});
});

test('reading spacing overrides the shared titles, body and toolbar without changing their sizes',async({page})=>{
 await page.goto('/hci-lab-ia/#/lab');await page.locator('.language select').selectOption('es-CO');
 const strings=displayResources['es-CO'];
 const selectors=['main h1','#lab-section-reservations-heading','#reservation-condition-panel p','.page-head p','.topbar .reset-control > button','.topbar .topbar-account','.topbar .page-tracker > button'];
 const before=await page.evaluate(items=>items.map(selector=>parseFloat(getComputedStyle(document.querySelector(selector)!).fontSize)),selectors);
 await page.locator('.topbar').getByRole('button',{name:strings.title,exact:true}).click();
 const dialog=page.getByRole('dialog',{name:strings.title,exact:true});
 await dialog.getByRole('checkbox',{name:strings.spacing,exact:true}).check();await page.keyboard.press('Escape');
 await expect(page.locator('html')).toHaveAttribute('data-spacing','true');
 const metrics=await page.evaluate(items=>items.map(selector=>{const style=getComputedStyle(document.querySelector(selector)!);const size=parseFloat(style.fontSize);return {selector,size,line:parseFloat(style.lineHeight)/size,letter:parseFloat(style.letterSpacing)/size,word:parseFloat(style.wordSpacing)/size};}),selectors);
 for(const [index,item] of metrics.entries()){
  expect(item.size,item.selector).toBe(before[index]);expect(item.line,item.selector).toBeCloseTo(1.8,2);expect(item.letter,item.selector).toBeCloseTo(.08,2);expect(item.word,item.selector).toBeCloseTo(.16,2);
 }
 await page.locator('.topbar').getByRole('button',{name:strings.title,exact:true}).click();
 await dialog.getByRole('checkbox',{name:strings.spacing,exact:true}).uncheck();await page.keyboard.press('Escape');
 const restored=await page.locator('main h1').evaluate(node=>{const style=getComputedStyle(node);return {line:parseFloat(style.lineHeight)/parseFloat(style.fontSize),letter:parseFloat(style.letterSpacing)};});
 expect(restored.line).toBeCloseTo(1.25,2);expect(restored.letter).toBeLessThan(0);
});
