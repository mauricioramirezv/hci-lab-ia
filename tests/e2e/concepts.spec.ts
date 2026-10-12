import { test,expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { conceptResources } from '../../src/enhancements/concepts/locales';
import { conceptIds } from '../../src/enhancements/concepts/model';
import type { ConceptId } from '../../src/enhancements/concepts/model';
import { emptyProject } from '../../src/projectBackup';
import { manageResources } from '../../src/manageLocales';
type Language=keyof typeof conceptResources;
type Labels=typeof conceptResources['es-CO']['ui'];
const read=(page:Page)=>page.evaluate(()=>JSON.parse(localStorage.getItem('hci-lab-ia-project-v2')!));
async function button(page:Page,labels:Labels,key:keyof Labels){await page.locator('.concept-activity').getByRole('button',{name:labels[key],exact:true}).click();}
async function finishActivity(page:Page,id:ConceptId,good:boolean,ui:Labels){
  const trial=page.locator('.concept-test-area');
  switch(id){
    case 'ux':
      await trial.getByRole('combobox',{name:ui.destination,exact:true}).selectOption('museum');await button(page,ui,'continueMobile');
      if(!good){await expect(trial.getByRole('combobox',{name:ui.destination,exact:true})).toHaveValue('');await trial.getByRole('combobox',{name:ui.destination,exact:true}).selectOption('museum');}
      await button(page,ui,'finishTrip');break;
    case 'usability':
      if(!good){await button(page,ui,'planB');await expect(page.locator('.concept-activity [role=alert]')).toHaveText(ui.planError);await button(page,ui,'showDetails');}
      await button(page,ui,good?'visit':'planA');break;
    case 'accessibility':await button(page,ui,good?'interrupted':'unknown');break;
    case 'awareness':
      await trial.getByLabel(ui.noteLabel).fill('Nota original ✍️');await button(page,ui,'statusSaveAction');
      await expect(trial.getByRole('button',{name:ui.yesSaved,exact:true})).toBeEnabled();await button(page,ui,good?'yesSaved':'noConfirmation');break;
    case 'engagement':await button(page,ui,'withoutNotices');break;
    case 'emotions':
      await trial.getByLabel(ui.coupon).fill('ERROR');await button(page,ui,'applyCoupon');await expect(trial.getByLabel(ui.coupon)).toHaveValue('ERROR');
      await trial.getByLabel(ui.coupon).fill('CALMA');await button(page,ui,'applyCoupon');break;
    case 'ergonomics':
      if(!good){await button(page,ui,'checkLayout');await expect(page.locator('.concept-activity [role=alert]')).toHaveText(ui.layoutError);await trial.getByRole('slider').nth(0).focus();for(let i=0;i<5;i++)await page.keyboard.press('ArrowRight');await trial.getByRole('slider').nth(1).focus();await page.keyboard.press('ArrowRight');}
      await button(page,ui,'checkLayout');break;
    case 'cognition':
      await button(page,ui,'continueKit');if(!good){await expect(trial.getByText(ui.packingList,{exact:true})).toHaveCount(0);await button(page,ui,'showList');}
      for(const key of ['water','map','keys'] as const)await trial.getByRole('checkbox',{name:ui[key],exact:true}).check();await button(page,ui,'checkKit');break;
    case 'information':
      if(!good)await button(page,ui,'categoryHint');await trial.getByRole('button',{name:ui.books,exact:true}).click();await button(page,ui,'audiobooks');break;
    case 'universal':
      if(!good)await button(page,ui,'addAlternative');await trial.getByLabel(ui.channel).selectOption('textChannel');await button(page,ui,'checkChannel');break;
    case 'responsibleAI':
      await button(page,ui,'sourceReview');await expect(trial.getByText(ui.sourceText,{exact:true})).toBeVisible();
      await trial.getByRole('combobox',{name:ui.decision,exact:true}).selectOption('editDecision');await trial.getByLabel(ui.reason).fill('Justificación original: minimizar datos.');await trial.getByRole('textbox',{name:ui.edit,exact:true}).fill('Solo la dirección indicada.');await button(page,ui,'finishReview');break;
  }
  await expect(page.locator('.concept-activity h3.concept-focus')).toHaveText(ui.result);
  await expect(page.locator('.concept-activity h3.concept-focus')).toBeFocused();
}

for(const language of Object.keys(conceptResources) as Language[]){
  test(`concepts: eleven activities in both conditions and all content in ${language}`,async({page})=>{
    test.setTimeout(120000);const resource=conceptResources[language],ui=resource.ui;
    await page.goto('/hci-lab-ia/#/concepts');await page.locator('.language select').selectOption(language);
    await expect(page.locator('.concept-catalog-card')).toHaveCount(11);
    for(const [index,id] of conceptIds.entries())for(const good of [true,false]){
      await page.locator(`#open-concept-${index}`).click();await expect(page.locator('.concept-activity')).toHaveCount(1);await expect(page.locator('.concept-catalog-card')).toHaveCount(0);
      if(!good)await page.getByRole('combobox',{name:ui.condition,exact:true}).selectOption('bad');
      await expect(page.locator('.concept-activity h2')).toHaveText(resource.concepts[index].name);await expect(page.getByText(resource.concepts[index].instructions,{exact:true})).toBeVisible();
      await button(page,ui,'start');await finishActivity(page,id,good,ui);
      await page.getByRole('textbox',{name:ui.notes,exact:true}).fill(`Observación original ${id} ${good?'A':'B'}`);
      await button(page,ui,'saveResults');await expect(page.locator('.concept-activity [role=status]')).toHaveText(ui.saved);
      await expect(page.locator('.concept-module')).not.toContainText('conceptLab.');
      await button(page,ui,'back');await expect(page.locator(`#open-concept-${index}`)).toBeFocused();
    }
    const state=await read(page);expect(state.evidence).toHaveLength(22);
    for(const evidence of state.evidence){expect(evidence.participant).toBe('');expect(evidence.scores.seconds).toBeGreaterThanOrEqual(0);expect(evidence.scores.interactions).toBeGreaterThan(0);expect(evidence.concept.outcome).toBe('completed');expect(evidence.scores.emotion).toBeUndefined();expect(evidence.scores.confidenceAfter).toBeUndefined();}
    const expectedInteractions=[[3,4],[1,3],[1,1],[2,2],[1,1],[2,2],[1,8],[5,6],[2,3],[2,3],[3,3]];
    for(const [index,id] of conceptIds.entries())for(const [conditionIndex,condition] of ['good','bad'].entries()){
      const evidence=state.evidence.find((record:{concept:{id:ConceptId};condition:string})=>record.concept.id===id&&record.condition===condition);
      expect(evidence.scores.interactions,`${id} ${condition}`).toBe(expectedInteractions[index][conditionIndex]);
      if(id==='engagement'||id==='responsibleAI')expect(evidence.scores.errors).toBeUndefined();
      else expect(evidence.scores.errors).toBe(id==='emotions'||condition==='bad'&&(id==='usability'||id==='ergonomics')?1:0);
    }
    await page.getByRole('button',{name:ui.evidence,exact:true}).click();await expect(page.locator('.concept-evidence-record')).toHaveCount(22);await expect(page.getByRole('heading',{name:ui.evidenceTitle})).toBeFocused();
    await page.reload();expect((await read(page)).evidence).toEqual(state.evidence);
  });
}

for(const theme of ['light','dark','contrast','dark-contrast']){
  test(`concepts: axe, focus and layout for all eleven activities in both conditions, ${theme}`,async({page},testInfo)=>{
    test.setTimeout(120000);
    await page.addInitScript(theme=>localStorage.setItem('hci-prefs-v2',JSON.stringify({dark:theme.includes('dark'),contrast:theme.includes('contrast'),font:100,spacing:false,dyslexia:false,motion:true})),theme);
    await page.goto('/hci-lab-ia/#/concepts');const ui=conceptResources['es-CO'].ui;
    let result=await new AxeBuilder({page}).include('.concept-module').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(result.violations).toEqual([]);
    await page.screenshot({path:testInfo.outputPath(`catalog-${theme}.png`),fullPage:true});
    await page.screenshot({path:testInfo.outputPath(`catalog-viewport-${theme}.png`)});
    for(const [index,id] of conceptIds.entries())for(const good of [true,false]){
      await page.locator(`#open-concept-${index}`).click();if(!good)await page.getByRole('combobox',{name:ui.condition,exact:true}).selectOption('bad');await button(page,ui,'start');
      result=await new AxeBuilder({page}).include('.concept-module').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
      expect(result.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})),`${id} ${good}`).toEqual([]);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${id} ${good}`).toBe(true);
      if(id==='responsibleAI'&&!good){await page.screenshot({path:testInfo.outputPath(`activity-${theme}.png`),fullPage:true});await page.screenshot({path:testInfo.outputPath(`activity-viewport-${theme}.png`)});}
      await button(page,ui,'cancel');
      if(id==='emotions'&&good||id==='responsibleAI'&&!good){
        result=await new AxeBuilder({page}).include('.concept-module').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(result.violations).toEqual([]);
      }
      if(id==='responsibleAI'&&!good){
        await button(page,ui,'saveResults');await button(page,ui,'evidence');
        await expect(page.getByRole('heading',{name:ui.evidenceTitle})).toBeFocused();
        result=await new AxeBuilder({page}).include('.concept-module').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(result.violations).toEqual([]);
        await page.evaluate(()=>window.scrollTo(0,0));
        await page.screenshot({path:testInfo.outputPath(`evidence-${theme}.png`),fullPage:true});
      }
      await button(page,ui,'back');
    }
  });
}

test('concepts: search, keyboard, explicit diagnosis, retry, condition change and preserved drafts',async({page})=>{
  await page.goto('/hci-lab-ia/#/concepts');const ui=conceptResources['es-CO'].ui;
  await page.getByRole('combobox',{name:ui.topic,exact:true}).selectOption('2');await expect(page.locator('.concept-catalog-card')).toHaveCount(2);
  await page.getByLabel(ui.search).fill('COGNICION');await expect(page.locator('.concept-catalog-card')).toHaveCount(1);await page.getByLabel(ui.search).fill('sin-coincidencias');await expect(page.getByText(ui.noMatches)).toBeVisible();
  await page.getByRole('button',{name:ui.clear}).click();await expect(page.locator('.concept-catalog-card')).toHaveCount(11);
  await page.getByLabel(ui.diagAnswer).selectOption('3');await expect(page.getByText(ui.reviewAnswer,{exact:true})).toHaveCount(0);await page.getByRole('button',{name:ui.check,exact:true}).click();await expect(page.getByText(conceptResources['es-CO'].diagnosis.explanations[2],{exact:true})).toBeVisible();
  await page.getByRole('button',{name:ui.retry}).click();await expect(page.getByLabel(ui.diagAnswer)).toBeFocused();await page.getByLabel(ui.diagAnswer).selectOption('1');await page.getByRole('button',{name:ui.check,exact:true}).click();await expect(page.getByText(ui.correctAnswer,{exact:true})).toBeVisible();
  await page.locator('#open-concept-1').focus();await page.keyboard.press('Enter');await expect(page.locator('.concept-activity .concept-focus')).toBeFocused();
  await page.getByRole('textbox',{name:ui.notes,exact:true}).fill('Texto conservado ✍️');await page.getByLabel(ui.alias).fill('Alias libre');
  await page.getByRole('button',{name:ui.start}).focus();await page.keyboard.press('Enter');
  await expect(page.getByRole('combobox',{name:ui.condition,exact:true})).toBeEnabled();await page.getByRole('combobox',{name:ui.condition,exact:true}).selectOption('bad');
  await expect(page.getByText(ui.conditionReset,{exact:true})).toBeVisible();await expect(page.getByRole('textbox',{name:ui.notes,exact:true})).toHaveValue('Texto conservado ✍️');
  await button(page,ui,'start');await page.getByRole('button',{name:ui.planA,exact:true}).focus();await page.keyboard.press('Enter');await expect(page.locator('.concept-activity .concept-focus')).toBeFocused();
  await button(page,ui,'saveResults');await button(page,ui,'repeat');await expect(page.locator('.concept-activity')).not.toContainText('Interacciones:');await button(page,ui,'start');await button(page,ui,'cancel');await expect(page.getByText(ui.cancelledHelp)).toBeVisible();
  await button(page,ui,'back');await expect(page.locator('#open-concept-1')).toBeFocused();await page.locator('#open-concept-1').click();await expect(page.getByLabel(ui.alias)).toHaveValue('Alias libre');await expect(page.getByRole('textbox',{name:ui.notes,exact:true})).toHaveValue('Texto conservado ✍️');
});

test('concepts: completes and saves a trial using Tab and Enter, with visible focus',async({page})=>{
  const ui=conceptResources['es-CO'].ui;await page.goto('/hci-lab-ia/#/concepts');await page.locator('#open-concept-1').click();
  await page.keyboard.press('Tab');await expect(page.getByRole('combobox',{name:ui.confidenceBefore,exact:true})).toBeFocused();
  await page.keyboard.press('Tab');await expect(page.getByRole('button',{name:ui.start,exact:true})).toBeFocused();await page.keyboard.press('Enter');
  await expect(page.locator('.concept-activity h3.concept-focus')).toBeFocused();await page.keyboard.press('Tab');
  await expect(page.getByRole('button',{name:ui.visit,exact:true})).toBeFocused();await page.keyboard.press('Enter');
  await page.keyboard.press('Tab');await expect(page.getByRole('combobox',{name:ui.confidenceAfter,exact:true})).toBeFocused();
  await page.keyboard.press('Tab');await expect(page.getByRole('button',{name:ui.saveResults,exact:true})).toBeFocused();
  expect(await page.getByRole('button',{name:ui.saveResults,exact:true}).evaluate(element=>getComputedStyle(element).outlineStyle)).not.toBe('none');
  await page.keyboard.press('Enter');await expect(page.locator('.concept-activity [role=status]')).toHaveText(ui.saved);expect((await read(page)).evidence).toHaveLength(1);
});

test('concepts: global reset cancels pending work, clears drafts and evidence, and stays empty on reload',async({page})=>{
  await page.goto('/hci-lab-ia/#/concepts');const ui=conceptResources['es-CO'].ui;
  await page.locator('#open-concept-3').click();await page.getByRole('textbox',{name:ui.notes,exact:true}).fill('Observación real');await button(page,ui,'saveObservation');await expect(page.getByText(ui.findingSaved)).toBeVisible();
  await button(page,ui,'start');await page.getByLabel(ui.noteLabel).fill('Pendiente');await button(page,ui,'statusSaveAction');
  await page.getByRole('button',{name:'Gestionar proyecto',exact:true}).click();await page.getByRole('button',{name:'Restablecer proyecto',exact:true}).click();await page.getByRole('button',{name:'Borrar datos y restablecer',exact:true}).click();
  await expect(page.locator('.concept-activity')).toHaveCount(0);await expect(page.locator('.concept-catalog-card')).toHaveCount(11);await page.waitForTimeout(1100);expect(await read(page)).toEqual(emptyProject());
  await page.locator('#open-concept-3').click();await expect(page.getByRole('textbox',{name:ui.notes,exact:true})).toHaveValue('');await button(page,ui,'start');await expect(page.getByLabel(ui.noteLabel)).toHaveValue('');
  await page.reload();expect(await read(page)).toEqual(emptyProject());
});

test('concepts: saved decisions survive complete backup and recovery; languages preserve all user text',async({page},testInfo)=>{
  await page.goto('/hci-lab-ia/#/concepts');const es=conceptResources['es-CO'].ui,fr=conceptResources['fr-FR'].ui;
  await page.locator('#open-concept-10').click();await page.getByRole('textbox',{name:es.notes,exact:true}).fill('Observación sin traducir');await button(page,es,'start');await page.getByRole('combobox',{name:es.decision,exact:true}).selectOption('editDecision');await page.getByLabel(es.reason).fill('Razón en español');await page.getByRole('textbox',{name:es.edit,exact:true}).fill('Propuesta escrita');
  await page.locator('.language select').selectOption('fr-FR');await expect(page.getByRole('textbox',{name:fr.notes,exact:true})).toHaveValue('Observación sin traducir');await expect(page.getByLabel(fr.reason)).toHaveValue('Razón en español');await expect(page.getByRole('textbox',{name:fr.edit,exact:true})).toHaveValue('Propuesta escrita');
  await button(page,fr,'finishReview');await button(page,fr,'saveResults');const original=await read(page);
  const manage=manageResources['fr-FR'];
  await page.getByRole('button',{name:manage.title,exact:true}).click();const download=page.waitForEvent('download');await page.getByRole('button',{name:manage.backup,exact:true}).click();const file=testInfo.outputPath('concept-evidence.json');await (await download).saveAs(file);await page.keyboard.press('Escape');
  await page.getByRole('button',{name:manage.title,exact:true}).click();await page.getByRole('button',{name:manage.reset,exact:true}).click();await page.getByRole('button',{name:manage.confirmReset,exact:true}).click();
  await page.getByRole('button',{name:manage.title,exact:true}).click();await page.locator('dialog input[type=file]').setInputFiles(file);await page.getByRole('button',{name:manage.confirmRecover,exact:true}).click();expect(await read(page)).toEqual(original);
  await page.getByRole('button',{name:fr.evidence,exact:true}).click();await expect(page.getByText('Razón en español',{exact:true})).toBeVisible();await expect(page.getByText('Propuesta escrita',{exact:true})).toBeVisible();
  await page.evaluate(()=>document.documentElement.style.fontSize='200%');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
});


