import {test,expect} from '@playwright/test';
import type {Page} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {patternResources} from '../../src/enhancements/patterns/locales';
import {patternIds} from '../../src/enhancements/patterns/model';
import type {PatternId} from '../../src/enhancements/patterns/model';
import {emptyProject} from '../../src/projectBackup';
import {representativeProject} from '../fixtures/representativeProject';
import {manageResources} from '../../src/manageLocales';
type Language=keyof typeof patternResources;
type Labels=typeof patternResources['es-CO']['ui'];
const read=(page:Page)=>page.evaluate(()=>JSON.parse(localStorage.getItem('hci-lab-ia-project-v2')!));
const activity=(page:Page)=>page.locator('.pattern-activity');
async function action(page:Page,ui:Labels,key:keyof Labels){await activity(page).getByRole('button',{name:ui[key],exact:true}).click();}
async function finish(page:Page,id:PatternId,good:boolean,ui:Labels){
  const example=page.locator('.pattern-example');
  switch(id){
    case 'form':
      await example.getByRole('textbox',{name:ui.request,exact:true}).fill('Solicitud escrita sin traducir');
      await example.getByRole('textbox',{name:ui.email,exact:true}).fill('incorrecto');await action(page,ui,'send');
      await expect(example.getByRole('alert')).toHaveText(ui.emailError);await expect(example.getByRole('textbox',{name:ui.email,exact:true})).toBeFocused();
      await expect(example.getByRole('textbox',{name:ui.request,exact:true})).toHaveValue('Solicitud escrita sin traducir');
      if(!good)await expect(example.getByText(ui.formBadError,{exact:true})).toBeVisible();
      await example.getByRole('textbox',{name:ui.email,exact:true}).fill('persona@example.test');await action(page,ui,'send');
      await expect(example.getByRole('status')).toHaveText(ui.formLabDone);break;
    case 'navigation':
      await action(page,ui,'openBilling');await expect(example.locator('h4.pattern-focus')).toBeFocused();await action(page,ui,'openInvoices');
      await example.getByRole('combobox',{name:ui.where,exact:true}).selectOption('billing');await action(page,ui,'checkLocation');await expect(example.getByRole('alert')).toHaveText(ui.locationError);
      await example.getByRole('combobox',{name:ui.where,exact:true}).selectOption('invoices');await action(page,ui,'checkLocation');await expect(example.getByRole('status')).toHaveText(ui.locationDone.replace('{{name}}',ui.invoices));
      await action(page,ui,'previous');await expect(example.locator('h4.pattern-focus')).toBeFocused();await expect(example.locator('h4.pattern-focus')).toHaveText(good?ui.billing:ui.areaOne);
      await action(page,ui,'previous');await expect(example.locator('h4.pattern-focus')).toHaveText(ui.help);break;
    case 'feedback':
      await example.getByRole('textbox',{name:ui.document,exact:true}).fill('');await action(page,ui,'prepare');await expect(example.getByRole('alert')).toHaveText(ui.documentError);
      await example.getByRole('textbox',{name:ui.document,exact:true}).fill('Constancia original');await action(page,ui,'prepare');await expect(example.getByRole('button',{name:ui.cancel,exact:true})).toBeEnabled();
      await expect(example.locator('.pattern-runtime [role=status]')).toHaveText(ui.feedbackLabDone);
      if(good)await expect(example.getByRole('progressbar')).toHaveAttribute('value','3');
      else{await expect(example.getByText(ui.briefDone,{exact:true})).toBeVisible();await expect(example.getByText(ui.briefDone,{exact:true})).toHaveCount(0);}
      break;
    case 'choice':{
      if(!good){await expect(example.getByRole('radio',{name:ui.advanced,exact:true})).toBeChecked();await expect(example.getByRole('table')).toHaveCount(0);}
      else{await action(page,ui,'continue');await expect(example.getByRole('alert')).toHaveText(ui.choiceError);}
      await action(page,ui,'compare');await expect(example.getByRole('table')).toBeVisible();const tableRegion=example.getByRole('region',{name:ui.compare,exact:true});await tableRegion.focus();await expect(tableRegion).toBeFocused();
      if(await tableRegion.evaluate(element=>element.scrollWidth>element.clientWidth)){await page.keyboard.press('ArrowRight');await expect.poll(()=>tableRegion.evaluate(element=>element.scrollLeft)).toBeGreaterThan(0);}
      await example.getByRole('radio',{name:ui.basic,exact:true}).check();await action(page,ui,'continue');await expect(example.getByRole('status')).toHaveText(ui.choiceDone.replace('{{name}}',ui.basic));
      await action(page,ui,'cancel');await expect(example.getByRole('status')).toHaveText(ui.cancelled);await expect(example.getByRole('radio',{name:ui.basic,exact:true})).not.toBeChecked();break;
    }
    case 'content':
      await example.getByRole('searchbox',{name:ui.findLabel,exact:true}).fill('sin-coincidencia-zzzz');await action(page,ui,'find');await expect(example.getByRole('alert')).toHaveText(ui.notFound);
      await example.getByRole('searchbox',{name:ui.findLabel,exact:true}).fill(ui.returns);await action(page,ui,'find');await expect(example.getByRole('status')).toHaveText(ui.found.replace('{{name}}',ui.returns));
      await example.getByRole('combobox',{name:ui.deadline,exact:true}).selectOption('30');await action(page,ui,'checkContent');await expect(example.getByRole('alert')).toHaveText(ui.contentError);
      await example.getByRole('combobox',{name:ui.deadline,exact:true}).selectOption('14');await action(page,ui,'checkContent');await expect(example.getByRole('status')).toHaveText(ui.contentDone);break;
    case 'privacy':
      if(good)await expect(example.getByRole('checkbox',{name:ui.analytics,exact:true})).not.toBeChecked();else await expect(example.getByRole('checkbox',{name:ui.analytics,exact:true})).toBeChecked();
      await example.getByRole('checkbox',{name:ui.analytics,exact:true}).check();await example.getByRole('checkbox',{name:ui.photos,exact:true}).uncheck();await action(page,ui,'accept');await expect(example.getByRole('status')).toHaveText(ui.privacyDone);
      await expect(example.locator('.pattern-runtime')).toContainText(`${ui.analytics}: ${ui.yes}`);await expect(example.locator('.pattern-runtime')).toContainText(`${ui.photos}: ${ui.no}`);
      await action(page,ui,'reject');await expect(example.getByRole('checkbox',{name:ui.analytics,exact:true})).not.toBeChecked();await expect(example.locator('.pattern-runtime')).toContainText(`${ui.analytics}: ${ui.no}`);break;
  }
}
for(const language of Object.keys(patternResources) as Language[]){
  test(`patterns: six categories, both conditions, observations and full translations in ${language}`,async({page},testInfo)=>{
    test.setTimeout(90000);const resource=patternResources[language],ui=resource.ui;
    await page.goto('/hci-lab-ia/#/practices');await page.locator('.language select').selectOption(language);await expect(page.locator('.pattern-card')).toHaveCount(6);
    for(const [index,id] of patternIds.entries()){
      await page.getByRole('combobox',{name:ui.category,exact:true}).selectOption(String(index));await expect(page.locator('.pattern-card')).toHaveCount(1);
      await expect(page.locator('.pattern-module').getByRole('status')).toHaveText(ui.count.replace('{{count}}','1'));
      for(const text of Object.values(resource.patterns[index]).slice(0,8))await expect(page.locator('.pattern-card')).toContainText(text);
      for(const good of [true,false]){
        await page.locator(`#open-pattern-${index}`).click();await expect(activity(page).locator('h2')).toBeFocused();await expect(page.locator('.pattern-card')).toHaveCount(0);
        if(!good)await page.getByRole('combobox',{name:ui.condition,exact:true}).selectOption('bad');
        expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
        await expect(page.getByText(resource.patterns[index].instructions,{exact:true})).toBeVisible();await finish(page,id,good,ui);
        expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
        await activity(page).getByRole('textbox',{name:ui.identified,exact:true}).fill(`Mi problema ${id} ${good?'A':'B'} ✍️`);await activity(page).getByRole('textbox',{name:ui.principle,exact:true}).fill('Mi principio escrito');await activity(page).getByRole('textbox',{name:ui.correction,exact:true}).fill('Mi corrección\nSin traducción');
        await action(page,ui,'save');await expect(page.locator('#pattern-message')).toHaveText(ui.saved);await expect(activity(page).getByRole('button',{name:ui.save,exact:true})).toBeDisabled();
        await expect(page.locator('.pattern-module')).not.toContainText('patternLab.');await action(page,ui,'back');await expect(page.locator(`#open-pattern-${index}`)).toBeFocused();
      }
    }
    const state=await read(page);expect(state.evidence).toHaveLength(12);
    for(const record of state.evidence){expect(record.kind).toBe('pattern');expect(record.participant).toBe('');expect(record.scores).toEqual({});expect(record.pattern.correction).toBe('Mi corrección\nSin traducción');}
    await page.locator('.pattern-module').getByRole('link',{name:ui.reports,exact:true}).click();await expect(page.locator('main')).toBeFocused();await expect(page.locator('.pattern-record')).toHaveCount(12);
    await page.locator('.pattern-record>summary').first().click();await expect(page.locator('.pattern-record').first()).toContainText('Mi principio escrito');await expect(page.locator('.pattern-record').first()).toContainText(ui.identified);
    expect((await new AxeBuilder({page}).include('.r8').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);
    if(language==='es-CO'){await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:testInfo.outputPath('evidence-panel.png'),fullPage:true});}
    await page.reload();expect((await read(page)).evidence).toEqual(state.evidence);
  });
}
for(const theme of ['light','dark','contrast','dark-contrast']){
  test(`patterns: axe, focus and responsive layout for every example and condition, ${theme}`,async({page},testInfo)=>{
    test.setTimeout(120000);const ui=patternResources['es-CO'].ui;
    await page.addInitScript(theme=>localStorage.setItem('hci-prefs-v2',JSON.stringify({dark:theme.includes('dark'),contrast:theme.includes('contrast'),font:100,spacing:false,dyslexia:false,motion:true})),theme);
    await page.goto('/hci-lab-ia/#/practices');expect((await new AxeBuilder({page}).include('.pattern-module').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);
    await page.screenshot({path:testInfo.outputPath(`catalog-${theme}.png`),fullPage:true});await page.screenshot({path:testInfo.outputPath(`catalog-viewport-${theme}.png`)});
    for(const [index,id] of patternIds.entries())for(const good of [true,false]){
      await page.locator(`#open-pattern-${index}`).click();await expect(activity(page).locator('h2')).toBeFocused();if(!good)await page.getByRole('combobox',{name:ui.condition,exact:true}).selectOption('bad');
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
      let result=await new AxeBuilder({page}).include('.pattern-module').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(result.violations,`${id} ${good?'good':'bad'} before`).toEqual([]);
      await finish(page,id,good,ui);result=await new AxeBuilder({page}).include('.pattern-module').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(result.violations,`${id} ${good?'good':'bad'} after`).toEqual([]);
      if(!good&&(id==='form'||id==='choice'||id==='privacy')){await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:testInfo.outputPath(`${id}-bad-${theme}.png`),fullPage:true});}
      await action(page,ui,'back');
    }
  });
}
test('patterns: search, filters, keyboard, validation, condition changes and restart preserve user text',async({page})=>{
  const es=patternResources['es-CO'].ui,fr=patternResources['fr-FR'].ui;await page.goto('/hci-lab-ia/#/practices');
  await page.getByRole('searchbox',{name:es.search,exact:true}).fill('NAVEGACION');await expect(page.locator('.pattern-card')).toHaveCount(1);await page.getByRole('searchbox',{name:es.search,exact:true}).fill('zzzz');await expect(page.getByText(es.empty,{exact:true})).toBeVisible();await page.getByRole('button',{name:es.clear,exact:true}).click();
  await page.locator('#open-pattern-0').focus();await page.keyboard.press('Enter');await expect(activity(page).locator('h2')).toBeFocused();await page.keyboard.press('Tab');await expect(page.getByRole('combobox',{name:es.condition,exact:true})).toBeFocused();
  await page.keyboard.press('ArrowDown');await expect(page.getByRole('combobox',{name:es.condition,exact:true})).toHaveValue('bad');await expect(page.locator('#pattern-example-title')).toBeFocused();await page.keyboard.press('Tab');await expect(page.getByRole('textbox',{name:es.email,exact:true})).toBeFocused();
  expect(await page.getByRole('textbox',{name:es.email,exact:true}).evaluate(e=>{const style=getComputedStyle(e);return style.outlineStyle!=='none'||style.boxShadow!=='none';})).toBe(true);
  await page.keyboard.type('usuario@example.test');await page.keyboard.press('Tab');await page.keyboard.type('Solicitud original');await page.keyboard.press('Tab');await page.keyboard.press('Enter');await expect(page.locator('.pattern-runtime [role=status]')).toHaveText(es.formLabDone);
  await action(page,es,'save');await expect(page.getByRole('textbox',{name:es.identified,exact:true})).toBeFocused();await expect(page.locator('#pattern-message')).toHaveAttribute('role','alert');
  await page.getByRole('textbox',{name:es.identified,exact:true}).fill('Observación original');await page.getByRole('textbox',{name:es.principle,exact:true}).fill('Mi principio');await page.getByRole('textbox',{name:es.correction,exact:true}).fill('Mi solución');await page.getByRole('textbox',{name:es.alias,exact:true}).fill('Alias libre');
  await page.getByRole('combobox',{name:es.condition,exact:true}).selectOption('good');await expect(page.locator('#pattern-example-title')).toBeFocused();await expect(page.locator('#pattern-message')).toHaveText(es.changed);await expect(page.getByRole('textbox',{name:es.email,exact:true})).toHaveValue('usuario@example.test');
  await action(page,es,'restart');await expect(page.locator('#pattern-example-title')).toBeFocused();await expect(page.locator('#pattern-message')).toHaveText(es.restarted);await expect(page.getByRole('textbox',{name:es.identified,exact:true})).toHaveValue('Observación original');
  await page.locator('.language select').selectOption('fr-FR');await expect(page.getByRole('textbox',{name:fr.request,exact:true})).toHaveValue('Solicitud original');await expect(page.getByRole('textbox',{name:fr.alias,exact:true})).toHaveValue('Alias libre');await expect(page.getByRole('textbox',{name:fr.correction,exact:true})).toHaveValue('Mi solución');
  await action(page,fr,'save');await action(page,fr,'back');await page.locator('#open-pattern-5').click();await expect(page.getByRole('textbox',{name:fr.alias,exact:true})).toHaveValue('Alias libre');await action(page,fr,'back');await page.locator('#open-pattern-0').click();await expect(page.getByRole('textbox',{name:fr.request,exact:true})).toHaveValue('Solicitud original');
});
test('patterns: cancelling and resetting pending feedback stops the example and retains authored input',async({page})=>{
  const ui=patternResources['es-CO'].ui;await page.goto('/hci-lab-ia/#/practices');await page.locator('#open-pattern-2').click();await page.getByRole('textbox',{name:ui.document,exact:true}).fill('Mi constancia');
  await action(page,ui,'prepare');await action(page,ui,'cancel');await expect(page.locator('.pattern-runtime [role=status]')).toHaveText(ui.cancelled);await page.waitForTimeout(1400);await expect(page.getByRole('progressbar')).toHaveAttribute('value','0');
  await action(page,ui,'prepare');await page.getByRole('combobox',{name:ui.condition,exact:true}).selectOption('bad');await page.waitForTimeout(1400);await expect(page.locator('.pattern-runtime [role=status]')).toHaveText(ui.idle);await expect(page.getByRole('textbox',{name:ui.document,exact:true})).toHaveValue('Mi constancia');
  await action(page,ui,'prepare');await action(page,ui,'restart');await page.waitForTimeout(1400);await expect(page.locator('.pattern-runtime [role=status]')).toHaveText(ui.idle);
  await action(page,ui,'prepare');await action(page,ui,'back');await page.waitForTimeout(1400);await page.locator('#open-pattern-2').click();await expect(page.locator('.pattern-runtime [role=status]')).toHaveText(ui.idle);
});
test('patterns: evidence survives backup/recovery and CSV/Markdown; reset clears drafts and pending work',async({page},testInfo)=>{
  const original=representativeProject();await page.goto('/hci-lab-ia/#/practices');await page.evaluate(project=>localStorage.setItem('hci-lab-ia-project-v2',JSON.stringify(project)),original);await page.reload();
  const ui=patternResources['es-CO'].ui,manage=manageResources['es-CO'];await page.locator('#open-pattern-2').click();
  await expect(page.getByRole('textbox',{name:ui.alias,exact:true})).toHaveValue([...original.evidence!].reverse().find(record=>record.participant.trim())?.participant||'');
  await page.getByRole('textbox',{name:ui.alias,exact:true}).fill('');await page.getByRole('textbox',{name:ui.identified,exact:true}).fill('Problema escrito');await page.getByRole('textbox',{name:ui.principle,exact:true}).fill('Visibilidad');await page.getByRole('textbox',{name:ui.correction,exact:true}).fill('Confirmación persistente');await action(page,ui,'save');
  const saved=await read(page);expect(saved.evidence).toHaveLength(original.evidence!.length+1);
  await page.getByRole('button',{name:manage.title,exact:true}).click();const pending=page.waitForEvent('download');await page.getByRole('button',{name:manage.backup,exact:true}).click();const file=testInfo.outputPath('pattern-backup.json');await(await pending).saveAs(file);await page.keyboard.press('Escape');
  await page.getByRole('textbox',{name:ui.document,exact:true}).fill('Pendiente');await action(page,ui,'prepare');await page.getByRole('button',{name:manage.title,exact:true}).click();await page.getByRole('button',{name:manage.reset,exact:true}).click();await page.getByRole('dialog').getByRole('button',{name:manage.cancel,exact:true}).click();expect(await read(page)).toEqual(saved);await page.keyboard.press('Escape');
  await action(page,ui,'prepare');await page.getByRole('button',{name:manage.title,exact:true}).click();await page.getByRole('button',{name:manage.reset,exact:true}).click();await page.getByRole('button',{name:manage.confirmReset,exact:true}).click();await page.waitForTimeout(1400);expect(await read(page)).toEqual(emptyProject());await expect(page.locator('.pattern-card')).toHaveCount(6);
  await page.locator('#open-pattern-2').click();await expect(page.getByRole('textbox',{name:ui.document,exact:true})).toHaveValue('');await expect(page.getByRole('textbox',{name:ui.identified,exact:true})).toHaveValue('');
  await page.reload();expect(await read(page)).toEqual(emptyProject());
  await page.getByRole('button',{name:manage.title,exact:true}).click();await page.locator('dialog input[type=file]').setInputFiles(file);await page.getByRole('button',{name:manage.confirmRecover,exact:true}).click();expect(await read(page)).toEqual(saved);
  await page.locator('.pattern-module').getByRole('link',{name:ui.reports,exact:true}).click();await page.locator('.pattern-record>summary').click();await expect(page.locator('.pattern-record')).toContainText('Confirmación persistente');
  await page.getByRole('button',{name:'Generar informe',exact:true}).click();await page.getByRole('button',{name:'Revisar vista previa',exact:true}).click();for(const [name,filename] of [['Exportar evidencias CSV','pattern.csv'],['Exportar informe Markdown','pattern.md']]){const download=page.waitForEvent('download');await page.getByRole('button',{name}).click();const file=await download;await file.saveAs(testInfo.outputPath(filename));const stream=await file.createReadStream();let text='';for await(const chunk of stream!)text+=chunk.toString();expect(text).toContain('Problema escrito');expect(text).toContain('Visibilidad');expect(text).toContain('Confirmación persistente');}
  const before=await read(page),invalid={...before,evidence:[{...before.evidence.at(-1),pattern:{id:'form',problem:'x'}}]},pendingInvalid=page.waitForEvent('download');
  await page.evaluate(value=>{const link=document.createElement('a'),url=URL.createObjectURL(new Blob([JSON.stringify(value)],{type:'application/json'}));link.href=url;link.download='incomplete-pattern.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);},invalid);
  const invalidFile=testInfo.outputPath('incomplete-pattern.json');await(await pendingInvalid).saveAs(invalidFile);await page.getByRole('button',{name:manage.title,exact:true}).click();await page.locator('dialog input[type=file]').setInputFiles(invalidFile);await expect(page.getByRole('alert')).toHaveText(manage.invalid);expect(await read(page)).toEqual(before);
});
