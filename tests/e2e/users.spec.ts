import {discardChanges} from '../support/crud';
import {test,expect} from '@playwright/test';
import type {Page} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {userResources} from '../../src/features/users/locales';
import {manageResources} from '../../src/features/project/locales';
import {trackingResources} from '../../src/features/tracking/locales';
import {emptyProject} from '../../src/features/project/domain';
import type {ProjectState} from '../../src/features/project/domain';
const u=userResources['es-CO'],m=manageResources['es-CO'],tr=trackingResources['es-CO'];
const read=(page:Page):Promise<ProjectState>=>page.evaluate(()=>JSON.parse(localStorage.getItem('hci-lab-ia-project-v2')!));
const button=(page:Page,key:string)=>page.getByRole('button',{name:u[key],exact:true});
async function create(page:Page,name='Ana',email='ana@example.test',role='student'){
 await button(page,'create').click();await page.getByLabel(u.name,{exact:true}).fill(name);await page.getByLabel(u.email,{exact:true}).fill(email);await page.getByLabel(u.role,{exact:true}).selectOption(role);await button(page,'save').click();await expect(page.getByRole('status')).toHaveText(u.saved);
}
async function manage(page:Page){await page.getByRole('button',{name:m.title,exact:true}).click();}
async function reset(page:Page){await manage(page);await page.getByRole('button',{name:m.reset,exact:true}).click();await page.getByRole('button',{name:m.confirmReset,exact:true}).click();}
test.beforeEach(async({page})=>{await page.goto('/hci-lab-ia/#/lab/users');});

test('users: validation, duplicates, own email edit, independent details and cancellation',async({page})=>{
 await expect(page.locator('#lab-section-reservations-heading')).toHaveAttribute('aria-expanded','false');await page.locator('#lab-section-reservations-heading').click();await expect(page.getByRole('navigation',{name:'Laboratorio',exact:true}).getByRole('link',{name:u.reservations,exact:true})).toBeVisible();
 await button(page,'create').click();await button(page,'save').click();await expect(page.locator('#user-name')).toBeFocused();await expect(page.getByText(u.nameRequired)).toBeVisible();
 await page.getByLabel(u.name,{exact:true}).fill(' Ana ');await page.getByLabel(u.email,{exact:true}).fill('ana@');await button(page,'save').click();await expect(page.getByText(u.emailInvalid)).toBeVisible();await expect(page.locator('#user-name')).toHaveValue(' Ana ');
 await page.getByLabel(u.email,{exact:true}).fill(' Ana@example.test ');await button(page,'save').click();await expect(page.getByRole('status')).toHaveText(u.saved);const original=(await read(page)).users![0];
 await button(page,'create').click();await page.locator('#user-name').fill('Other');await page.locator('#user-email').fill('ANA@EXAMPLE.TEST');await button(page,'save').click();await expect(page.getByText(u.emailDuplicate)).toBeVisible();await button(page,'cancel').click();await discardChanges(page);expect((await read(page)).users).toEqual([original]);
 await page.getByRole('button',{name:`${u.edit}: Ana`,exact:true}).click();await page.locator('#user-name').fill('Cancelled');await button(page,'cancel').click();await discardChanges(page);expect((await read(page)).users).toEqual([original]);
 await page.getByRole('button',{name:`${u.edit}: Ana`,exact:true}).click();await page.locator('#user-name').fill('Ana edited');await page.locator('#user-email').fill('ANA@example.test');await button(page,'save').click();const edited=(await read(page)).users![0];expect(edited).toMatchObject({id:original.id,createdAt:original.createdAt,name:'Ana edited'});
 await page.getByRole('button',{name:`${u.detail}: Ana edited`,exact:true}).click();await expect(page.getByText(original.id,{exact:true})).toBeVisible();await button(page,'back').click();await page.reload();await expect(page.getByRole('heading',{name:'Ana edited',exact:true})).toBeVisible();
});
test('users: status, confirmed deletion, cancellation, keyboard focus and exact undo',async({page})=>{
 await create(page);const original=(await read(page)).users![0];await page.getByRole('button',{name:`${u.deactivate}: Ana`,exact:true}).click();expect((await read(page)).users![0].status).toBe('inactive');
 await page.getByRole('button',{name:`${u.activate}: Ana`,exact:true}).click();expect((await read(page)).users![0]).toEqual(original);
 const remove=page.getByRole('button',{name:`${u.delete}: Ana`,exact:true});await remove.click();await expect(page.getByRole('dialog').getByRole('button',{name:u.cancel,exact:true})).toBeFocused();await page.keyboard.press('Escape');await expect(remove).toBeFocused();expect((await read(page)).users).toEqual([original]);
 await remove.click();await page.getByRole('dialog').getByRole('button',{name:u.delete,exact:true}).click();expect((await read(page)).users).toEqual([]);await expect(page.getByRole('status')).toBeFocused();await button(page,'undo').click();expect((await read(page)).users).toEqual([original]);
 const before=await read(page);await page.locator('#users-example-heading').click();await page.locator('#user-example-email').fill('broken');await button(page,'check').click();await expect(page.getByText(u.badFeedback)).toBeVisible();await expect(page.getByText(u.emailInvalid)).toBeVisible();expect(await read(page)).toEqual(before);
});
test('users: searches, filters and orders saved records',async({page})=>{
 await create(page,'Zed','z@example.test','teacher');await create(page,'Ana','a@example.test');await page.getByRole('button',{name:`${u.deactivate}: Zed`,exact:true}).click();
 const names=()=>page.locator('.users-list').getByRole('heading',{level:4}).allTextContents();expect(await names()).toEqual(['Ana','Zed']);
 await page.getByLabel(u.search,{exact:true}).fill(' Z@EXAMPLE ');expect(await names()).toEqual(['Zed']);await page.getByLabel(u.search,{exact:true}).fill('');
 await page.locator('.users-filters').getByLabel(u.role,{exact:true}).selectOption('teacher');await page.locator('.users-filters').getByLabel(u.status,{exact:true}).selectOption('inactive');expect(await names()).toEqual(['Zed']);
 await page.locator('.users-filters').getByLabel(u.status,{exact:true}).selectOption('active');await expect(page.getByText(u.noResults)).toBeVisible();
 await page.locator('.users-filters').getByLabel(u.role,{exact:true}).selectOption('');await page.locator('.users-filters').getByLabel(u.status,{exact:true}).selectOption('');await page.getByLabel(u.sort,{exact:true}).selectOption('oldest');expect(await names()).toEqual(['Zed','Ana']);await page.getByLabel(u.sort,{exact:true}).selectOption('newest');expect(await names()).toEqual(['Ana','Zed']);
});
test('users: failed storage preserves drafts, data and evidence, then retries',async({page})=>{
 await create(page);const before=await read(page);
 await button(page,'create').click();await page.locator('#user-name').fill('Retry');await page.locator('#user-email').fill('retry@example.test');
 await page.evaluate(()=>{const original=Storage.prototype.setItem;Storage.prototype.setItem=function(key,value){if(key==='hci-lab-ia-project-v2')throw Error('quota');original.call(this,key,value);};(window as Window&{restoreWrites?:()=>void}).restoreWrites=()=>{Storage.prototype.setItem=original;};});
 await button(page,'save').click();await expect(page.locator('.users-page [role=alert]')).toHaveText(u.storageFailed);expect(await read(page)).toEqual(before);await expect(page.locator('#user-name')).toHaveValue('Retry');await expect(page.getByText(u.saved,{exact:true})).toHaveCount(0);
 await page.evaluate(()=>(window as Window&{restoreWrites?:()=>void}).restoreWrites!());await button(page,'save').click();expect((await read(page)).users).toHaveLength(2);expect((await read(page)).evidence).toHaveLength(2);
 await page.reload();await expect(page.getByRole('heading',{name:'Retry',exact:true})).toBeVisible();
});
test('users: backup download, global reset, recovery, old backups and report exports',async({page},testInfo)=>{
 await create(page);const before=await read(page);await manage(page);const download=page.waitForEvent('download');await page.getByRole('button',{name:m.backup,exact:true}).click();const path=testInfo.outputPath('users-backup.json');await (await download).saveAs(path);await page.keyboard.press('Escape');
 await reset(page);expect((await read(page)).users).toEqual([]);await expect(button(page,'undo')).toHaveCount(0);
 await manage(page);await page.locator('dialog input[type=file]').setInputFiles(path);await page.getByRole('button',{name:m.confirmRecover,exact:true}).click();expect(await read(page)).toEqual(before);
 await page.goto('/hci-lab-ia/#/reports');await expect(page.getByText('Usuario ficticio',{exact:true}).first()).toBeVisible();
 await page.getByRole('button',{name:'Generar informe',exact:true}).click();await page.getByRole('button',{name:'Revisar vista previa',exact:true}).click();const report=page.waitForEvent('download');await page.getByRole('button',{name:'Exportar informe Markdown',exact:true}).click();expect((await report).suggestedFilename()).toBe('hci-informe.md');
 await page.goto('/hci-lab-ia/#/lab/users');const legacy=emptyProject();delete legacy.users;legacy.scenarios=[{id:'legacy',title:'Existing scenario',actor:'A',context:'C',task:'T',constraint:'C',success:'S'}];
 await manage(page);await page.locator('dialog input[type=file]').evaluate((node,content)=>{const input=node as HTMLInputElement,transfer=new DataTransfer();transfer.items.add(new File([content],'legacy.json',{type:'application/json'}));input.files=transfer.files;input.dispatchEvent(new Event('change',{bubbles:true}));},JSON.stringify(legacy));await page.getByRole('button',{name:m.confirmRecover,exact:true}).click();expect((await read(page)).users).toEqual([]);expect((await read(page)).scenarios).toEqual(legacy.scenarios);await page.reload();expect((await read(page)).scenarios).toEqual(legacy.scenarios);
});
test('users: page UX capture remains available and reportable',async({page})=>{
 await page.locator('.page-tracker > button').click();const tracker=page.locator('.page-tracker');await tracker.getByLabel(tr.task,{exact:true}).fill('Review fictitious users');await tracker.getByRole('button',{name:tr.start,exact:true}).click();await tracker.locator(':scope > button').click();await page.locator('main h1').click();
 await page.locator('.page-tracker > button').click();await tracker.getByRole('button',{name:tr.stop,exact:true}).click();await tracker.getByRole('button',{name:tr.save,exact:true}).click();
 const sessions=(await read(page)).pageSessions!;expect(sessions).toHaveLength(1);expect(sessions[0]).toMatchObject({route:'/lab/users',task:'Review fictitious users'});expect(sessions[0].clicks.length).toBeGreaterThan(0);
 await page.goto('/hci-lab-ia/#/reports');await expect(page.getByRole('checkbox',{name:'Incluir en el informe: Review fictitious users',exact:true})).toBeVisible();
});
test('users: six languages, keyboard, themes, 200% text, mobile and axe',async({page},testInfo)=>{
 test.setTimeout(120000);await create(page,'RAW Júlia','raw@example.test');
 for(const [lang,strings]of Object.entries(userResources)){
  await page.locator('.language select').selectOption(lang);await expect(page.getByRole('heading',{level:1})).toHaveText(strings.title);await expect(page.getByRole('heading',{name:'RAW Júlia',exact:true})).toBeVisible();
  await page.getByRole('button',{name:strings.create,exact:true}).focus();await page.keyboard.press('Enter');await expect(page.locator('.users-view-heading')).toBeFocused();await expect(page.locator('#user-name')).toHaveAccessibleName(strings.name);await page.getByRole('button',{name:strings.cancel,exact:true}).click();
 }
 await page.locator('.language select').selectOption('es-CO');
 for(const theme of ['light','dark','contrast']){
  await page.evaluate(theme=>{document.documentElement.dataset.theme=theme==='dark'?'dark':'light';document.documentElement.dataset.contrast=String(theme==='contrast');document.documentElement.style.fontSize='200%';},theme);
  const violations=(await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations;expect(violations).toEqual([]);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);await page.screenshot({path:testInfo.outputPath(`users-${theme}.png`),fullPage:true});
 }
 await button(page,'create').click();await button(page,'save').click();expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);
});
