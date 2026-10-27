import {expect,test} from '@playwright/test';
import type {Page} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {crudProject} from '../fixtures/crudProject';
import {crudResources} from '../../src/app/locales/crud';
import {activityResources} from '../../src/app/locales/projectActivities';
import {userResources} from '../../src/features/users/locales';
import {evaluationResources} from '../../src/features/evaluation/locales';
import {manageResources} from '../../src/features/project/locales';
import {discardChanges} from '../support/crud';
import type {ProjectState} from '../../src/features/project/domain';
const c=crudResources['es-CO'],a=activityResources['es-CO'],u=userResources['es-CO'],e=evaluationResources['es-CO'],m=manageResources['es-CO'];
const cases=[
 {name:'reservations',route:'/lab',collection:'appointments',record:'[data-booking]',field:'#date',invalid:'2000-01-01',value:'2099-10-20',savedField:'date',title:'editBooking'},
 {name:'users',route:'/lab/users',collection:'users',record:'.users-list li',field:'#user-name',invalid:' ',value:'RAW revised',savedField:'name',title:'editUser'},
 {name:'personas',route:'/research',collection:'personas',record:'[data-persona]',field:'#name',invalid:' ',value:'RAW revised',savedField:'name',title:'editPersona'},
 {name:'scenarios',route:'/research',collection:'scenarios',record:'[data-scenario]',field:'#task',invalid:' ',value:'RAW revised',savedField:'task',title:'editScenario'},
 {name:'findings',route:'/evaluation',collection:'findings',record:'[data-finding]',field:'#finding-problem',invalid:' ',value:'RAW revised',savedField:'problem',title:'editFinding'},
] as const;
const read=(page:Page):Promise<ProjectState>=>page.evaluate(()=>JSON.parse(localStorage.getItem('hci-lab-ia-project-v2')!));
async function seed(page:Page,route:string){await page.goto('/hci-lab-ia/');await page.evaluate(project=>localStorage.setItem('hci-lab-ia-project-v2',JSON.stringify(project)),crudProject());await page.goto(`/hci-lab-ia/#${route}`);await page.reload();}
async function openLabPage(page:Page,section:'reservations'|'users',label:string){
 const currentPage=section==='users'?page.locator('#reservation-create-heading'):page.locator('#users-create-heading');
 await expect(currentPage).toBeVisible();
 await expect(page).toHaveURL(section==='users'?/#\/lab$/:/#\/lab\/users$/);
 const heading=page.locator(`#lab-section-${section}-heading`);
 if(await heading.getAttribute('aria-expanded')!=='true')await heading.click();
 await expect(heading).toHaveAttribute('aria-expanded','true');
 const link=page.locator('.lab-navigation').getByRole('link',{name:label,exact:true});
 await expect(link).toBeVisible();await link.click();
}
async function failWrites(page:Page,blocked:boolean){await page.evaluate(blocked=>{
 const host=window as Window&{crudWriteBlock?:{blocked:boolean}};
 if(!host.crudWriteBlock){const flag={blocked},write=Storage.prototype.setItem;host.crudWriteBlock=flag;Storage.prototype.setItem=function(key,value){if(key==='hci-lab-ia-project-v2'&&flag.blocked)throw Error('quota');write.call(this,key,value);};}else host.crudWriteBlock.blocked=blocked;
},blocked);}
for(const config of cases)test(`CRUD consistency: ${config.name} details, drafts, failure, metadata, recovery and deletion`,async({page},info)=>{
 await seed(page,config.route);if(config.route==='/research'){const section=page.getByRole('button',{name:config.name==='scenarios'?a.scenarios:a.personas,exact:true});if(await section.getAttribute('aria-expanded')!=='true')await section.click();}const original=await read(page),record=page.locator(config.record).first();
 await record.getByRole('button',{name:new RegExp('^'+c.view)}).click();await expect(page.locator('main :is(h2,h3,h4)[tabindex="-1"]').last()).toBeFocused();await expect(page.locator('form')).toHaveCount(0);await page.getByRole('button',{name:c.back,exact:true}).click();
 const edit=()=>page.locator(config.record).first().getByRole('button',{name:new RegExp('^'+c.edit)}).click();
 await edit();await expect(page.locator('main :is(h2,h3,h4)[tabindex="-1"]').last()).toContainText(c[config.title]);await expect(page.locator(config.record)).toHaveCount(0);
 await page.locator(config.field).fill(config.value);await page.getByRole('button',{name:c.cancel,exact:true}).click();const warning=page.getByRole('dialog',{name:c.unsavedTitle,exact:true});await expect(warning.getByRole('button',{name:c.stay,exact:true})).toBeFocused();await page.keyboard.press('Escape');await expect(page.locator(config.field)).toHaveValue(config.value);expect(await read(page)).toEqual(original);
 await page.getByRole('button',{name:c.cancel,exact:true}).click();await discardChanges(page);expect(await read(page)).toEqual(original);
 await edit();await page.locator(config.field).fill(config.invalid);await page.getByRole('button',{name:config.name==='reservations'?a.next:c.save,exact:true}).click();await expect(page.locator(config.field)).toHaveAttribute('aria-invalid','true');await expect(page.locator(config.field)).toHaveValue(config.invalid);
 await page.locator(config.field).fill(config.value);if(config.name==='reservations')await page.getByRole('button',{name:a.next,exact:true}).click();
 const beforeFailure=await read(page);await failWrites(page,true);await page.getByRole('button',{name:c.save,exact:true}).click();expect(await read(page)).toEqual(beforeFailure);if(config.name!=='reservations')await expect(page.locator(config.field)).toHaveValue(config.value);await expect(page.locator('.management-notice[role=alert]')).toBeVisible();
 await failWrites(page,false);await page.getByRole('button',{name:c.save,exact:true}).click();const saved=await read(page),item=saved[config.collection]![0] as unknown as Record<string,unknown>,before=original[config.collection]![0] as unknown as Record<string,unknown>;
 expect(item[config.savedField]).toBe(config.value);expect(item.id).toBe(before.id);expect(item.createdAt).toBe(before.createdAt);expect(saved.sessions).toEqual(original.sessions);expect(saved.pageSessions).toEqual(original.pageSessions);expect(saved.evidence?.slice(0,original.evidence!.length)).toEqual(original.evidence);await expect(page.locator('main').getByRole('status')).toBeFocused();
 await page.reload();expect(await read(page)).toEqual(saved);await page.getByRole('button',{name:m.title,exact:true}).click();const download=page.waitForEvent('download');await page.getByRole('button',{name:m.backup,exact:true}).click();const path=info.outputPath('crud-backup.json');await (await download).saveAs(path);await page.keyboard.press('Escape');
 await page.getByRole('button',{name:m.title,exact:true}).click();await page.getByRole('button',{name:m.reset,exact:true}).click();await page.getByRole('button',{name:m.confirmReset,exact:true}).click();expect((await read(page))[config.collection]).toEqual([]);await expect(page.getByRole('dialog')).toHaveCount(0);
 await page.getByRole('button',{name:m.title,exact:true}).click();await page.locator('dialog input[type=file]').setInputFiles(path);await page.getByRole('button',{name:m.confirmRecover,exact:true}).click();expect(await read(page)).toEqual(saved);if(config.route==='/research'){const section=page.getByRole('button',{name:config.name==='scenarios'?a.scenarios:a.personas,exact:true});if(await section.getAttribute('aria-expanded')!=='true')await section.click();if(config.name==='personas'){const scenarios=page.getByRole('button',{name:a.scenarios,exact:true});if(await scenarios.getAttribute('aria-expanded')!=='true')await scenarios.click();}}
 if(config.name==='personas'){
  await page.locator(config.record).first().getByRole('button',{name:a.delete,exact:true}).click();await expect(page.locator('main').getByRole('status')).toHaveText(a.deleteBlocked);
  await page.locator('[data-scenario]').first().getByRole('button',{name:a.delete,exact:true}).click();await page.getByRole('dialog').getByRole('button',{name:a.delete,exact:true}).click();
 }
 const removeLabel=config.name==='reservations'?a.cancelBooking:config.name==='users'?u.delete:config.name==='findings'?e.remove:a.delete;
 const remove=page.locator(config.record).first().getByRole('button',{name:new RegExp('^'+removeLabel)});const beforeDelete=await read(page);await remove.click();const dialog=page.getByRole('dialog');await expect(dialog.getByRole('button',{name:c.cancel,exact:true})).toBeFocused();await page.keyboard.press('Escape');await expect(remove).toBeFocused();expect(await read(page)).toEqual(beforeDelete);
 await remove.click();await dialog.getByRole('button',{name:removeLabel,exact:true}).click();await expect(page.locator('main').getByRole('status')).toBeFocused();
 if(config.name==='reservations'){expect((await read(page)).appointments[0].status).toBe('cancelled');expect((await read(page)).appointments[0].id).toBe(before.id);}
 else expect((await read(page))[config.collection]).toEqual([]);
 if(config.name==='users'){await page.getByRole('button',{name:u.undo,exact:true}).click();expect((await read(page)).users).toEqual(beforeDelete.users);}
});

test('CRUD consistency: links, browser back and reset respect an unsaved draft',async({page})=>{
 await seed(page,'/lab');await openLabPage(page,'users',u.title);await page.getByRole('button',{name:u.create,exact:true}).click();await page.locator('#user-name').fill('RAW pending');
 await openLabPage(page,'reservations',u.reservations);await expect(page.getByRole('dialog',{name:c.unsavedTitle,exact:true})).toBeVisible();await page.keyboard.press('Escape');await expect(page.locator('#user-name')).toHaveValue('RAW pending');
 page.once('dialog',dialog=>dialog.dismiss());await page.goBack();await expect(page).toHaveURL(/#\/lab\/users$/);await expect(page.locator('#user-name')).toHaveValue('RAW pending');
 page.once('dialog',dialog=>dialog.accept());await page.goBack();await expect(page).toHaveURL(/#\/lab$/);await expect(page.locator('#reservation-create-heading')).toBeVisible();
 await openLabPage(page,'users',u.title);await page.getByRole('button',{name:u.create,exact:true}).click();await page.locator('#user-name').fill('RAW pending link');
 await openLabPage(page,'reservations',u.reservations);await discardChanges(page);await expect(page).toHaveURL(/#\/lab$/);
 await openLabPage(page,'users',u.title);await page.getByRole('button',{name:u.create,exact:true}).click();await page.locator('#user-name').fill('RAW pending reset');
 await page.getByRole('button',{name:m.title,exact:true}).click();await page.getByRole('button',{name:m.reset,exact:true}).click();await page.getByRole('button',{name:m.confirmReset,exact:true}).click();await expect(page.locator('form')).toHaveCount(0);await expect(page.getByRole('dialog')).toHaveCount(0);expect((await read(page)).users).toEqual([]);
});

test('CRUD consistency: translated forms and accessible warnings in six languages and themes',async({page},info)=>{
 test.setTimeout(180000);await seed(page,'/lab');
 for(const lang of Object.keys(crudResources)){
  await page.locator('.language select').selectOption(lang);const common=crudResources[lang],activity=activityResources[lang as keyof typeof activityResources],users=userResources[lang],evaluation=evaluationResources[lang];
  for(const [route,create,field]of [['/lab',common.createBooking,'#context'],['/lab/users',users.create,'#user-name'],['/research',activity.newPersona,'#name'],['/research',activity.newScenario,'#title'],['/evaluation',evaluation.newFinding,'#finding-problem']]){
   await page.goto(`/hci-lab-ia/#${route}`);if(route==='/research'){const section=page.getByRole('button',{name:create===activity.newScenario?activity.scenarios:activity.personas,exact:true});if(await section.getAttribute('aria-expanded')!=='true')await section.click();}await page.getByRole('button',{name:create,exact:true}).click();await expect(page.getByText(common.required,{exact:true})).toBeVisible();
   if(route==='/lab')await page.locator(field).selectOption('university');else await page.locator(field).fill('RAW authored');
   await page.getByRole('button',{name:common.cancel,exact:true}).click();await expect(page.getByRole('dialog',{name:common.unsavedTitle,exact:true})).toBeVisible();await expect(page.getByRole('dialog').getByRole('button',{name:common.stay,exact:true})).toBeFocused();
   const theme=Object.keys(crudResources).indexOf(lang)%3;await page.evaluate(theme=>{document.documentElement.dataset.theme=theme===1?'dark':'light';document.documentElement.dataset.contrast=String(theme===2);document.documentElement.style.fontSize='200%';},theme);
   expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);await page.getByRole('dialog').getByRole('button',{name:common.discard,exact:true}).click();
  }
 }
 await page.screenshot({path:info.outputPath('crud-content-200.png'),fullPage:true});
});
