import {test,expect,type Page} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {emptyProject} from '../../src/features/project';
import {synchronizationLocales} from '../../src/features/synchronization/locales';
import {identityLocales} from '../../src/features/identity/locales';

const workspaceId='11111111-1111-4111-8111-111111111111';
const account={id:'22222222-2222-4222-8222-222222222222',email:'synthetic@example.invalid',displayName:'Synthetic participant',platformRole:'participant',globalRoles:['participant','teacher'],permissions:[],emailVerified:true,status:'active',version:1};
const copy=synchronizationLocales['es-CO'];
const base='/hci-lab-ia/';
type Write={path:string;body:Record<string,unknown>;headers:Record<string,string>};
async function fixture(page:Page,authenticated=false){
  const project=emptyProject();
  project.personas=[{id:'local-persona',name:'Persona de prueba',age:'40',context:'Contexto ficticio',goal:'Completar la práctica',barrier:'Tiempo limitado',device:'Tableta',empathy:{says:'',thinks:'',does:'',feels:''}}];
  project.scenarios=[{id:'local-scenario',personaId:'local-persona',title:'Escenario de prueba',actor:'Persona de prueba',context:'Laboratorio',task:'Practicar',constraint:'Tiempo limitado',success:'Completar'}];
  await page.addInitScript(({project})=>{localStorage.setItem('hci-lab-ia-project-v2',JSON.stringify(project));localStorage.setItem('hci-language','es-CO');},{project});
  const writes:Write[]=[];
  const state={authenticated,conflict:false,unavailable:false,expireAfterPersona:false};
  await page.route('**/api/**',async route=>{
    const request=route.request(),path=new URL(request.url()).pathname,method=request.method();
    const send=(body:unknown,status=200,headers:Record<string,string>={})=>route.fulfill({status,contentType:'application/json',body:JSON.stringify(body),headers});
    if(method==='GET'){
      if(path.endsWith('/accounts/me'))return state.authenticated?send({account,csrfToken:'synthetic-csrf'}):send({code:'UNAUTHENTICATED'},401);
      if(path.endsWith('/workspaces'))return send({items:[{id:workspaceId,nombre:'Espacio de prueba'}]});
      return send({items:[]});
    }
    writes.push({path,body:request.postDataJSON()??{},headers:request.headers()});
    if(path.endsWith('/sessions')){state.authenticated=true;return send({account,csrfToken:'synthetic-csrf',expiresAt:'2099-01-01T00:00:00Z'},200,{'set-cookie':'hci_identity_session=synthetic-session; Path=/; HttpOnly; SameSite=Lax'});}
    if(path.endsWith('/personas')){
      if(state.conflict){state.conflict=false;return send({code:'VERSION_CONFLICT',requestId:'sync-test-request'},409);}
      if(state.expireAfterPersona)state.authenticated=false;
      return send({item:{id:'33333333-3333-4333-8333-333333333333'},replayed:false},201);
    }
    if(path.endsWith('/scenarios')){
      if(state.unavailable){state.unavailable=false;return send({code:'DEPENDENCY_UNAVAILABLE'},503);}
      return send({item:{id:'44444444-4444-4444-8444-444444444444'},replayed:false},201);
    }
    return send({code:'UNEXPECTED_WRITE'},500);
  });
  return {project,writes,state};
}
async function prepare(page:Page){
  await page.goto(base+'#/sync');
  await page.getByRole('button',{name:copy.loadWorkspaces,exact:true}).click();
  await page.locator('#sync-workspace').selectOption(workspaceId);
  await page.getByRole('checkbox',{name:copy.category.learning,exact:true}).check();
  await page.getByRole('button',{name:copy.preview,exact:true}).click();
  await expect(page.getByRole('heading',{name:copy.previewTitle})).toBeFocused();
}
async function localProject(page:Page){return page.evaluate(()=>JSON.parse(localStorage.getItem('hci-lab-ia-project-v2')!));}

test('visitor completes a local reservation and cannot trigger remote writes',async({page})=>{
  const {writes}=await fixture(page);
  await page.goto(base+'#/lab');
  await page.getByRole('button',{name:'Crear reserva',exact:true}).click();
  await page.getByLabel('Contexto',{exact:true}).selectOption('university');
  await page.getByLabel('Servicio',{exact:true}).selectOption('advice');
  await page.getByRole('button',{name:'Continuar',exact:true}).click();
  await page.getByLabel('Fecha',{exact:true}).fill('2099-10-15');
  await page.getByLabel('Hora',{exact:true}).selectOption('10:30');
  await page.getByRole('button',{name:'Continuar',exact:true}).click();
  await page.getByRole('button',{name:'Guardar',exact:true}).click();
  await expect.poll(async()=>(await localProject(page)).appointments.length).toBe(1);
  await page.goto(base+'#/sync');
  await expect(page.getByText(copy.visitor,{exact:true})).toBeVisible();
  await expect(page.getByRole('button',{name:copy.send,exact:true})).toHaveCount(0);
  expect(writes).toEqual([]);
  const accessibility=await new AxeBuilder({page}).include('main').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  expect(accessibility.violations).toEqual([]);
});

test('account login enables deliberate synchronization, conflict review and safe retry',async({page,context})=>{
  const {writes,state,project}=await fixture(page);
  await page.goto(base+'#/cuenta');
  await page.locator('#identity-login-email').fill(account.email);
  await page.locator('#identity-login-password').fill('Synthetic safe password 2026');
  await page.locator('form').filter({has:page.locator('#identity-login-email')}).locator('button[type="submit"]').click();
  await expect(page.locator('#identity-name')).toHaveValue(account.displayName);
  expect((await context.cookies()).find(cookie=>cookie.name==='hci_identity_session')?.httpOnly).toBe(true);
  expect(await page.evaluate(()=>document.cookie)).not.toContain('synthetic-session');
  await prepare(page);
  expect(writes.map(write=>write.path)).toEqual(['/api/identity/v1/sessions']);
  state.conflict=true;
  await page.getByRole('button',{name:copy.send,exact:true}).click();
  await expect(page.getByRole('alert')).toContainText(copy.error.conflict);
  await expect(page.getByRole('alert')).toContainText('sync-test-request');
  expect(await localProject(page)).toEqual(project);
  const first=writes.at(-1)!;
  expect(first.headers['x-csrf-token']).toBe('synthetic-csrf');
  expect(first.headers['idempotency-key']).toMatch(/^[0-9a-f-]{36}$/);
  await page.getByRole('button',{name:copy.retry,exact:true}).click();
  await expect(page.getByRole('status').filter({hasText:'Envío completado'})).toBeVisible();
  const personas=writes.filter(write=>write.path.endsWith('/personas'));
  expect(personas).toHaveLength(2);expect(personas[1].headers['idempotency-key']).toBe(first.headers['idempotency-key']);
  expect(writes.at(-1)?.body.personaId).toBe('33333333-3333-4333-8333-333333333333');
  expect(await localProject(page)).toEqual(project);
  const count=writes.length;
  await page.getByRole('button',{name:copy.send,exact:true}).click();
  await expect(page.locator('.sync-content')).toHaveAttribute('aria-busy','false');
  expect(writes).toHaveLength(count);
  const stored=await page.evaluate(()=>Object.keys(localStorage).filter(key=>key.startsWith('hci-lab-ia-sync')).map(key=>localStorage.getItem(key)).join(''));
  expect(stored).not.toMatch(/synthetic-csrf|synthetic-session|password|accessToken/);
  const accessibility=await new AxeBuilder({page}).include('main').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  expect(accessibility.violations).toEqual([]);
});

test('a service failure preserves partial progress and resumes after a page reload',async({page})=>{
  const {writes,state,project}=await fixture(page,true);
  state.unavailable=true;
  await prepare(page);
  await page.getByRole('button',{name:copy.send,exact:true}).click();
  await expect(page.getByRole('alert')).toContainText(copy.error.unavailable);
  expect(writes.filter(write=>write.path.endsWith('/personas'))).toHaveLength(1);
  const pending=writes.at(-1)!;
  await prepare(page);
  await page.getByRole('button',{name:copy.send,exact:true}).click();
  await expect(page.getByRole('status').filter({hasText:'Envío completado'})).toBeVisible();
  expect(writes.filter(write=>write.path.endsWith('/personas'))).toHaveLength(1);
  expect(writes.at(-1)?.headers['idempotency-key']).toBe(pending.headers['idempotency-key']);
  expect(await localProject(page)).toEqual(project);
});

test('expired sessions stop subsequent writes and preserve local work',async({page})=>{
  const {writes,state,project}=await fixture(page,true);
  state.expireAfterPersona=true;
  await prepare(page);
  await page.getByRole('button',{name:copy.send,exact:true}).click();
  await expect(page.getByText(copy.visitor,{exact:true})).toBeVisible();
  expect(writes).toHaveLength(1);expect(writes[0].path).toContain('/personas');
  expect(await localProject(page)).toEqual(project);
});

for(const language of Object.keys(synchronizationLocales) as Array<keyof typeof synchronizationLocales>){
  test(`account and synchronization preserve ${language}`,async({page})=>{
    await fixture(page);
    await page.goto(base+'#/sync');
    await page.locator('header select').selectOption(language);
    const translated=synchronizationLocales[language];
    await expect(page.getByRole('heading',{name:translated.title,exact:true})).toBeVisible();
    await expect(page.getByText(translated.visitor,{exact:true})).toBeVisible();
    await expect(page.locator('main')).toHaveAttribute('lang',language);
    await expect(page.locator('.topbar').getByRole('link',{name:identityLocales[language].accountNav,exact:true})).toBeVisible();
    await expect(page.locator('.sidebar nav a').filter({hasText:identityLocales[language].accountNav})).toHaveCount(0);
    await expect(page.getByRole('link',{name:translated.localTitle,exact:true})).toHaveAttribute('href','#/lab');
    await page.locator('.topbar').getByRole('link',{name:identityLocales[language].accountNav,exact:true}).click();
    await expect(page.getByRole('heading',{name:identityLocales[language].title,exact:true})).toBeVisible();
    await expect(page.locator('#identity-login-password')).toHaveAttribute('type','password');
  });
}
