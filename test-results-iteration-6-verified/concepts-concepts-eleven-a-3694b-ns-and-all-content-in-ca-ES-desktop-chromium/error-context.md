# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: concepts.spec.ts >> concepts: eleven activities in both conditions and all content in ca-ES
- Location: tests\e2e\concepts.spec.ts:50:3

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:4173/hci-lab-ia/#/concepts
Call log:
  - navigating to "http://127.0.0.1:4173/hci-lab-ia/#/concepts", waiting until "load"

```

# Test source

```ts
  1   | ﻿import { test,expect } from '@playwright/test';
  2   | import type { Page } from '@playwright/test';
  3   | import AxeBuilder from '@axe-core/playwright';
  4   | import { conceptResources } from '../../src/enhancements/concepts/locales';
  5   | import { conceptIds } from '../../src/enhancements/concepts/model';
  6   | import type { ConceptId } from '../../src/enhancements/concepts/model';
  7   | import { emptyProject } from '../../src/projectBackup';
  8   | import { manageResources } from '../../src/manageLocales';
  9   | type Language=keyof typeof conceptResources;
  10  | type Labels=typeof conceptResources['es-CO']['ui'];
  11  | const read=(page:Page)=>page.evaluate(()=>JSON.parse(localStorage.getItem('hci-lab-ia-project-v2')!));
  12  | async function button(page:Page,labels:Labels,key:keyof Labels){await page.locator('.concept-activity').getByRole('button',{name:labels[key],exact:true}).click();}
  13  | async function finishActivity(page:Page,id:ConceptId,good:boolean,ui:Labels){
  14  |   const trial=page.locator('.concept-test-area');
  15  |   switch(id){
  16  |     case 'ux':
  17  |       await trial.getByRole('combobox',{name:ui.destination,exact:true}).selectOption('museum');await button(page,ui,'continueMobile');
  18  |       if(!good){await expect(trial.getByRole('combobox',{name:ui.destination,exact:true})).toHaveValue('');await trial.getByRole('combobox',{name:ui.destination,exact:true}).selectOption('museum');}
  19  |       await button(page,ui,'finishTrip');break;
  20  |     case 'usability':
  21  |       if(!good){await button(page,ui,'planB');await expect(page.locator('.concept-activity [role=alert]')).toHaveText(ui.planError);await button(page,ui,'showDetails');}
  22  |       await button(page,ui,good?'visit':'planA');break;
  23  |     case 'accessibility':await button(page,ui,good?'interrupted':'unknown');break;
  24  |     case 'awareness':
  25  |       await trial.getByLabel(ui.noteLabel).fill('Nota original ✍️');await button(page,ui,'statusSaveAction');
  26  |       await expect(trial.getByRole('button',{name:ui.yesSaved,exact:true})).toBeEnabled();await button(page,ui,good?'yesSaved':'noConfirmation');break;
  27  |     case 'engagement':await button(page,ui,'withoutNotices');break;
  28  |     case 'emotions':
  29  |       await trial.getByLabel(ui.coupon).fill('ERROR');await button(page,ui,'applyCoupon');await expect(trial.getByLabel(ui.coupon)).toHaveValue('ERROR');
  30  |       await trial.getByLabel(ui.coupon).fill('CALMA');await button(page,ui,'applyCoupon');break;
  31  |     case 'ergonomics':
  32  |       if(!good){await button(page,ui,'checkLayout');await expect(page.locator('.concept-activity [role=alert]')).toHaveText(ui.layoutError);await trial.getByRole('slider').nth(0).focus();for(let i=0;i<5;i++)await page.keyboard.press('ArrowRight');await trial.getByRole('slider').nth(1).focus();await page.keyboard.press('ArrowRight');}
  33  |       await button(page,ui,'checkLayout');break;
  34  |     case 'cognition':
  35  |       await button(page,ui,'continueKit');if(!good){await expect(trial.getByText(ui.packingList,{exact:true})).toHaveCount(0);await button(page,ui,'showList');}
  36  |       for(const key of ['water','map','keys'] as const)await trial.getByRole('checkbox',{name:ui[key],exact:true}).check();await button(page,ui,'checkKit');break;
  37  |     case 'information':
  38  |       if(!good)await button(page,ui,'categoryHint');await trial.getByRole('button',{name:ui.books,exact:true}).click();await button(page,ui,'audiobooks');break;
  39  |     case 'universal':
  40  |       if(!good)await button(page,ui,'addAlternative');await trial.getByLabel(ui.channel).selectOption('textChannel');await button(page,ui,'checkChannel');break;
  41  |     case 'responsibleAI':
  42  |       await button(page,ui,'sourceReview');await expect(trial.getByText(ui.sourceText,{exact:true})).toBeVisible();
  43  |       await trial.getByRole('combobox',{name:ui.decision,exact:true}).selectOption('editDecision');await trial.getByLabel(ui.reason).fill('Justificación original: minimizar datos.');await trial.getByRole('textbox',{name:ui.edit,exact:true}).fill('Solo la dirección indicada.');await button(page,ui,'finishReview');break;
  44  |   }
  45  |   await expect(page.locator('.concept-activity h3.concept-focus')).toHaveText(ui.result);
  46  |   await expect(page.locator('.concept-activity h3.concept-focus')).toBeFocused();
  47  | }
  48  | 
  49  | for(const language of Object.keys(conceptResources) as Language[]){
  50  |   test(`concepts: eleven activities in both conditions and all content in ${language}`,async({page})=>{
  51  |     test.setTimeout(120000);const resource=conceptResources[language],ui=resource.ui;
> 52  |     await page.goto('/hci-lab-ia/#/concepts');await page.locator('.language select').selectOption(language);
      |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:4173/hci-lab-ia/#/concepts
  53  |     await expect(page.locator('.concept-catalog-card')).toHaveCount(11);
  54  |     for(const [index,id] of conceptIds.entries())for(const good of [true,false]){
  55  |       await page.locator(`#open-concept-${index}`).click();await expect(page.locator('.concept-activity')).toHaveCount(1);await expect(page.locator('.concept-catalog-card')).toHaveCount(0);
  56  |       if(!good)await page.getByRole('combobox',{name:ui.condition,exact:true}).selectOption('bad');
  57  |       await expect(page.locator('.concept-activity h2')).toHaveText(resource.concepts[index].name);await expect(page.getByText(resource.concepts[index].instructions,{exact:true})).toBeVisible();
  58  |       await button(page,ui,'start');await finishActivity(page,id,good,ui);
  59  |       await page.getByRole('textbox',{name:ui.notes,exact:true}).fill(`Observación original ${id} ${good?'A':'B'}`);
  60  |       await button(page,ui,'saveResults');await expect(page.locator('.concept-activity [role=status]')).toHaveText(ui.saved);
  61  |       await expect(page.locator('.concept-module')).not.toContainText('conceptLab.');
  62  |       await button(page,ui,'back');await expect(page.locator(`#open-concept-${index}`)).toBeFocused();
  63  |     }
  64  |     const state=await read(page);expect(state.evidence).toHaveLength(22);
  65  |     for(const evidence of state.evidence){expect(evidence.participant).toBe('');expect(evidence.scores.seconds).toBeGreaterThanOrEqual(0);expect(evidence.scores.interactions).toBeGreaterThan(0);expect(evidence.concept.outcome).toBe('completed');expect(evidence.scores.emotion).toBeUndefined();expect(evidence.scores.confidenceAfter).toBeUndefined();}
  66  |     const expectedInteractions=[[3,4],[1,3],[1,1],[2,2],[1,1],[2,2],[1,8],[5,6],[2,3],[2,3],[3,3]];
  67  |     for(const [index,id] of conceptIds.entries())for(const [conditionIndex,condition] of ['good','bad'].entries()){
  68  |       const evidence=state.evidence.find((record:{concept:{id:ConceptId};condition:string})=>record.concept.id===id&&record.condition===condition);
  69  |       expect(evidence.scores.interactions,`${id} ${condition}`).toBe(expectedInteractions[index][conditionIndex]);
  70  |       if(id==='engagement'||id==='responsibleAI')expect(evidence.scores.errors).toBeUndefined();
  71  |       else expect(evidence.scores.errors).toBe(id==='emotions'||condition==='bad'&&(id==='usability'||id==='ergonomics')?1:0);
  72  |     }
  73  |     await page.getByRole('button',{name:ui.evidence,exact:true}).click();await expect(page.locator('.concept-evidence-record')).toHaveCount(22);await expect(page.getByRole('heading',{name:ui.evidenceTitle})).toBeFocused();
  74  |     await page.reload();expect((await read(page)).evidence).toEqual(state.evidence);
  75  |   });
  76  | }
  77  | 
  78  | for(const theme of ['light','dark','contrast','dark-contrast']){
  79  |   test(`concepts: axe, focus and layout for all eleven activities in both conditions, ${theme}`,async({page},testInfo)=>{
  80  |     test.setTimeout(120000);
  81  |     await page.addInitScript(theme=>localStorage.setItem('hci-prefs-v2',JSON.stringify({dark:theme.includes('dark'),contrast:theme.includes('contrast'),font:100,spacing:false,dyslexia:false,motion:true})),theme);
  82  |     await page.goto('/hci-lab-ia/#/concepts');const ui=conceptResources['es-CO'].ui;
  83  |     let result=await new AxeBuilder({page}).include('.concept-module').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(result.violations).toEqual([]);
  84  |     await page.screenshot({path:testInfo.outputPath(`catalog-${theme}.png`),fullPage:true});
  85  |     await page.screenshot({path:testInfo.outputPath(`catalog-viewport-${theme}.png`)});
  86  |     for(const [index,id] of conceptIds.entries())for(const good of [true,false]){
  87  |       await page.locator(`#open-concept-${index}`).click();if(!good)await page.getByRole('combobox',{name:ui.condition,exact:true}).selectOption('bad');await button(page,ui,'start');
  88  |       result=await new AxeBuilder({page}).include('.concept-module').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  89  |       expect(result.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})),`${id} ${good}`).toEqual([]);
  90  |       expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${id} ${good}`).toBe(true);
  91  |       if(id==='responsibleAI'&&!good){await page.screenshot({path:testInfo.outputPath(`activity-${theme}.png`),fullPage:true});await page.screenshot({path:testInfo.outputPath(`activity-viewport-${theme}.png`)});}
  92  |       await button(page,ui,'cancel');
  93  |       if(id==='emotions'&&good||id==='responsibleAI'&&!good){
  94  |         result=await new AxeBuilder({page}).include('.concept-module').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(result.violations).toEqual([]);
  95  |       }
  96  |       if(id==='responsibleAI'&&!good){
  97  |         await button(page,ui,'saveResults');await button(page,ui,'evidence');
  98  |         await expect(page.getByRole('heading',{name:ui.evidenceTitle})).toBeFocused();
  99  |         result=await new AxeBuilder({page}).include('.concept-module').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(result.violations).toEqual([]);
  100 |         await page.evaluate(()=>window.scrollTo(0,0));
  101 |         await page.screenshot({path:testInfo.outputPath(`evidence-${theme}.png`),fullPage:true});
  102 |       }
  103 |       await button(page,ui,'back');
  104 |     }
  105 |   });
  106 | }
  107 | 
  108 | test('concepts: search, keyboard, explicit diagnosis, retry, condition change and preserved drafts',async({page})=>{
  109 |   await page.goto('/hci-lab-ia/#/concepts');const ui=conceptResources['es-CO'].ui;
  110 |   await page.getByRole('combobox',{name:ui.topic,exact:true}).selectOption('2');await expect(page.locator('.concept-catalog-card')).toHaveCount(2);
  111 |   await page.getByLabel(ui.search).fill('COGNICION');await expect(page.locator('.concept-catalog-card')).toHaveCount(1);await page.getByLabel(ui.search).fill('sin-coincidencias');await expect(page.getByText(ui.noMatches)).toBeVisible();
  112 |   await page.getByRole('button',{name:ui.clear}).click();await expect(page.locator('.concept-catalog-card')).toHaveCount(11);
  113 |   await page.getByLabel(ui.diagAnswer).selectOption('3');await expect(page.getByText(ui.reviewAnswer,{exact:true})).toHaveCount(0);await page.getByRole('button',{name:ui.check,exact:true}).click();await expect(page.getByText(conceptResources['es-CO'].diagnosis.explanations[2],{exact:true})).toBeVisible();
  114 |   await page.getByRole('button',{name:ui.retry}).click();await expect(page.getByLabel(ui.diagAnswer)).toBeFocused();await page.getByLabel(ui.diagAnswer).selectOption('1');await page.getByRole('button',{name:ui.check,exact:true}).click();await expect(page.getByText(ui.correctAnswer,{exact:true})).toBeVisible();
  115 |   await page.locator('#open-concept-1').focus();await page.keyboard.press('Enter');await expect(page.locator('.concept-activity .concept-focus')).toBeFocused();
  116 |   await page.getByRole('textbox',{name:ui.notes,exact:true}).fill('Texto conservado ✍️');await page.getByLabel(ui.alias).fill('Alias libre');
  117 |   await page.getByRole('button',{name:ui.start}).focus();await page.keyboard.press('Enter');
  118 |   await expect(page.getByRole('combobox',{name:ui.condition,exact:true})).toBeEnabled();await page.getByRole('combobox',{name:ui.condition,exact:true}).selectOption('bad');
  119 |   await expect(page.getByText(ui.conditionReset,{exact:true})).toBeVisible();await expect(page.getByRole('textbox',{name:ui.notes,exact:true})).toHaveValue('Texto conservado ✍️');
  120 |   await button(page,ui,'start');await page.getByRole('button',{name:ui.planA,exact:true}).focus();await page.keyboard.press('Enter');await expect(page.locator('.concept-activity .concept-focus')).toBeFocused();
  121 |   await button(page,ui,'saveResults');await button(page,ui,'repeat');await expect(page.locator('.concept-activity')).not.toContainText('Interacciones:');await button(page,ui,'start');await button(page,ui,'cancel');await expect(page.getByText(ui.cancelledHelp)).toBeVisible();
  122 |   await button(page,ui,'back');await expect(page.locator('#open-concept-1')).toBeFocused();await page.locator('#open-concept-1').click();await expect(page.getByLabel(ui.alias)).toHaveValue('Alias libre');await expect(page.getByRole('textbox',{name:ui.notes,exact:true})).toHaveValue('Texto conservado ✍️');
  123 | });
  124 | 
  125 | test('concepts: completes and saves a trial using Tab and Enter, with visible focus',async({page})=>{
  126 |   const ui=conceptResources['es-CO'].ui;await page.goto('/hci-lab-ia/#/concepts');await page.locator('#open-concept-1').click();
  127 |   await page.keyboard.press('Tab');await expect(page.getByRole('combobox',{name:ui.confidenceBefore,exact:true})).toBeFocused();
  128 |   await page.keyboard.press('Tab');await expect(page.getByRole('button',{name:ui.start,exact:true})).toBeFocused();await page.keyboard.press('Enter');
  129 |   await expect(page.locator('.concept-activity h3.concept-focus')).toBeFocused();await page.keyboard.press('Tab');
  130 |   await expect(page.getByRole('button',{name:ui.visit,exact:true})).toBeFocused();await page.keyboard.press('Enter');
  131 |   await page.keyboard.press('Tab');await expect(page.getByRole('combobox',{name:ui.confidenceAfter,exact:true})).toBeFocused();
  132 |   await page.keyboard.press('Tab');await expect(page.getByRole('button',{name:ui.saveResults,exact:true})).toBeFocused();
  133 |   expect(await page.getByRole('button',{name:ui.saveResults,exact:true}).evaluate(element=>getComputedStyle(element).outlineStyle)).not.toBe('none');
  134 |   await page.keyboard.press('Enter');await expect(page.locator('.concept-activity [role=status]')).toHaveText(ui.saved);expect((await read(page)).evidence).toHaveLength(1);
  135 | });
  136 | 
  137 | test('concepts: global reset cancels pending work, clears drafts and evidence, and stays empty on reload',async({page})=>{
  138 |   await page.goto('/hci-lab-ia/#/concepts');const ui=conceptResources['es-CO'].ui;
  139 |   await page.locator('#open-concept-3').click();await page.getByRole('textbox',{name:ui.notes,exact:true}).fill('Observación real');await button(page,ui,'saveObservation');await expect(page.getByText(ui.findingSaved)).toBeVisible();
  140 |   await button(page,ui,'start');await page.getByLabel(ui.noteLabel).fill('Pendiente');await button(page,ui,'statusSaveAction');
  141 |   await page.getByRole('button',{name:'Gestionar proyecto',exact:true}).click();await page.getByRole('button',{name:'Restablecer proyecto',exact:true}).click();await page.getByRole('button',{name:'Borrar datos y restablecer',exact:true}).click();
  142 |   await expect(page.locator('.concept-activity')).toHaveCount(0);await expect(page.locator('.concept-catalog-card')).toHaveCount(11);await page.waitForTimeout(1100);expect(await read(page)).toEqual(emptyProject());
  143 |   await page.locator('#open-concept-3').click();await expect(page.getByRole('textbox',{name:ui.notes,exact:true})).toHaveValue('');await button(page,ui,'start');await expect(page.getByLabel(ui.noteLabel)).toHaveValue('');
  144 |   await page.reload();expect(await read(page)).toEqual(emptyProject());
  145 | });
  146 | 
  147 | test('concepts: saved decisions survive complete backup and recovery; languages preserve all user text',async({page},testInfo)=>{
  148 |   await page.goto('/hci-lab-ia/#/concepts');const es=conceptResources['es-CO'].ui,fr=conceptResources['fr-FR'].ui;
  149 |   await page.locator('#open-concept-10').click();await page.getByRole('textbox',{name:es.notes,exact:true}).fill('Observación sin traducir');await button(page,es,'start');await page.getByRole('combobox',{name:es.decision,exact:true}).selectOption('editDecision');await page.getByLabel(es.reason).fill('Razón en español');await page.getByRole('textbox',{name:es.edit,exact:true}).fill('Propuesta escrita');
  150 |   await page.locator('.language select').selectOption('fr-FR');await expect(page.getByRole('textbox',{name:fr.notes,exact:true})).toHaveValue('Observación sin traducir');await expect(page.getByLabel(fr.reason)).toHaveValue('Razón en español');await expect(page.getByRole('textbox',{name:fr.edit,exact:true})).toHaveValue('Propuesta escrita');
  151 |   await button(page,fr,'finishReview');await button(page,fr,'saveResults');const original=await read(page);
  152 |   const manage=manageResources['fr-FR'];
```