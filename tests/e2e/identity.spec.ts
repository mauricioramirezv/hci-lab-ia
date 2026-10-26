import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {identityLocales} from '../../src/features/identity/locales';

for(const language of Object.keys(identityLocales) as Array<keyof typeof identityLocales>){
  test(`account disclosure, confirmation and accessible feedback preserve ${language}`,async({page},testInfo)=>{
    const copy=identityLocales[language],writes:Array<{path:string;body:Record<string,unknown>}>=[];
    await page.addInitScript(language=>localStorage.setItem('hci-language',language),language);
    await page.route('**/api/**',async route=>{
      const request=route.request(),path=new URL(request.url()).pathname;
      if(request.method()==='GET')return route.fulfill({status:401,contentType:'application/json',body:JSON.stringify({code:'UNAUTHENTICATED'})});
      writes.push({path,body:request.postDataJSON()});
      return route.fulfill({status:202,contentType:'application/json',body:JSON.stringify({message:'accepted'})});
    });
    await page.goto('/hci-lab-ia/#/cuenta');
    await expect(page.getByRole('heading',{name:copy.title,exact:true})).toBeVisible();
    await expect(page.locator('#identity-login-panel')).toBeVisible();
    await expect(page.locator('#identity-recovery-panel')).toBeHidden();
    await expect(page.locator('#identity-register-panel')).toBeHidden();
    await expect(page.locator('.identity-disclosure h2')).toHaveText([copy.login,copy.forgot,copy.register]);
    expect(writes).toEqual([]);
    await page.locator('#identity-register-heading').focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#identity-register-heading')).toHaveAttribute('aria-expanded','true');
    await expect(page.locator('#identity-login-panel')).toBeHidden();
    const form=page.getByRole('form',{name:copy.register});
    await form.getByLabel(copy.name,{exact:true}).fill('Nombre sintético');
    await form.getByLabel(copy.lastName,{exact:true}).fill('Apellido sintético');
    await form.getByLabel(copy.email,{exact:true}).fill('synthetic@example.invalid');
    await form.getByLabel(copy.password,{exact:true}).fill('Synthetic test password 2026');
    await form.getByLabel(copy.confirmPassword,{exact:true}).fill('Different test password 2026');
    await expect(form.getByText(copy.emailValid)).toBeVisible();
    await expect(form.getByText(copy.passwordStrength.strong)).toBeVisible();
    await expect(form.getByText(copy.passwordMismatch)).toBeVisible();
    await expect(form.getByRole('button',{name:copy.register,exact:true})).toBeDisabled();
    expect(writes).toEqual([]);
    await form.getByLabel(copy.confirmPassword,{exact:true}).fill('Synthetic test password 2026');
    await expect(form.getByText(copy.passwordMatch)).toBeVisible();
    await expect(form.getByRole('button',{name:copy.register,exact:true})).toBeEnabled();
    await form.getByRole('button',{name:copy.register,exact:true}).click();
    await expect(page.getByRole('status')).toHaveText(copy.registrationReceived);
    expect(writes).toHaveLength(1);
    expect(writes[0].body).toMatchObject({displayName:'Nombre sintético',lastName:'Apellido sintético',email:'synthetic@example.invalid'});
    await expect(page.locator('.identity-feedback')).toBeFocused();
    const a11y=await new AxeBuilder({page}).include('main').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
    expect(a11y.violations).toEqual([]);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
    if(language==='es-CO')await page.screenshot({path:testInfo.outputPath('cuenta.png'),fullPage:true});
    await page.locator('#identity-recovery-heading').click();
    await expect(page.locator('#identity-register-panel')).toBeHidden();
    await expect(page.locator('#identity-recovery-panel')).toBeVisible();
    expect(writes).toHaveLength(1);
  });
}

test('a verification link opens on the current account page and removes the token from the URL',async({page})=>{
  const copy=identityLocales['es-CO'],tokens:string[]=[];
  await page.addInitScript(()=>localStorage.setItem('hci-language','es-CO'));
  await page.route('**/api/**',async route=>{
    const request=route.request();
    if(request.method()==='POST'&&request.url().endsWith('/email-verifications')){
      tokens.push(request.postDataJSON().token);
      return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({verified:true})});
    }
    return route.fulfill({status:401,contentType:'application/json',body:JSON.stringify({code:'UNAUTHENTICATED'})});
  });
  await page.goto('/hci-lab-ia/#/cuenta');
  await expect(page.locator('#identity-login-panel')).toBeVisible();
  await page.locator('#identity-register-heading').click();
  await page.evaluate(()=>{location.hash='/cuenta?verify=synthetic-verification-token';});
  await expect(page.getByRole('status')).toHaveText(copy.verifySent);
  await expect(page.locator('#identity-login-panel')).toBeVisible();
  expect(tokens).toEqual(['synthetic-verification-token']);
  expect(page.url()).not.toContain('verify=');
});
