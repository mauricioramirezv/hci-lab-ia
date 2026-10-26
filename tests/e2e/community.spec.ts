import {test,expect,type Page} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {communityLocales} from '../../src/features/community/locales';

const base='/hci-lab-ia/',groupId='11111111-1111-4111-8111-111111111111',workspaceId='22222222-2222-4222-8222-222222222222';
const account={id:'33333333-3333-4333-8333-333333333333',email:'synthetic@example.invalid',displayName:'Synthetic',platformRole:'participant',globalRoles:['teacher'],permissions:['group:manage'],emailVerified:true,status:'active',version:1};
type Write={path:string;body:Record<string,unknown>;headers:Record<string,string>};
async function fixture(page:Page,language:keyof typeof communityLocales,authenticated=true){
  await page.addInitScript(language=>localStorage.setItem('hci-language',language),language);
  const writes:Write[]=[];let shared=false;let suggestion:Record<string,unknown>|undefined;
  const respond=(items:unknown[])=>({items,total:items.length,limit:25,offset:0});
  await page.route('**/api/**',async route=>{
    const request=route.request(),path=new URL(request.url()).pathname,method=request.method();
    const send=(body:unknown,status=200)=>route.fulfill({status,contentType:'application/json',body:JSON.stringify(body)});
    if(path.endsWith('/accounts/me'))return authenticated?send({account,csrfToken:'synthetic-csrf'}):send({code:'UNAUTHENTICATED'},401);
    if(method==='GET'){
      if(path.endsWith('/groups'))return send(respond([{id:groupId,name:'Synthetic group',description:'Synthetic team workspace',role:'leader',joinedAt:'2026-10-25T12:00:00Z'}]));
      if(path.endsWith('/members'))return send(respond([{accountId:account.id,role:'leader',joinedAt:'2026-10-25T12:00:00Z'}]));
      if(path.endsWith('/invitations'))return send(respond([]));
      if(path.includes('/api/learning/')&&path.endsWith('/workspaces'))return send(respond([{id:workspaceId,name:'Synthetic workspace'}]));
      if(path.endsWith('/workspaces'))return send(respond(shared?[{workspaceId,sharedBy:account.id,sharedAt:'2026-10-25T12:00:00Z'}]:[]));
      if(path.endsWith('/history'))return send(respond([]));
      if(path.endsWith('/suggestions'))return send(respond(suggestion?[suggestion]:[]));
      if(path.endsWith('/suggestions/44444444-4444-4444-8444-444444444444'))return send(suggestion);
      return send({code:'UNEXPECTED_READ'},404);
    }
    const body=request.postDataJSON()??{};writes.push({path,body,headers:request.headers()});
    if(method==='PUT'&&path.endsWith('/workspaces/'+workspaceId)){shared=true;return route.fulfill({status:204});}
    if(path.endsWith('/invitations'))return send({id:'55555555-5555-4555-8555-555555555555',token:'synthetic-private-invitation-token',expiresAt:'2026-11-01T12:00:00Z'},201);
    if(path.endsWith('/suggestions')){suggestion={id:'44444444-4444-4444-8444-444444444444',...body,authorId:null,status:'received',version:1,createdAt:'2026-10-25T12:00:00Z',updatedAt:'2026-10-25T12:00:00Z'};return send({item:suggestion,replayed:false},201);}
    return send({code:'UNEXPECTED_WRITE'},500);
  });
  return writes;
}

test('visitors can open Community without generating remote work or writes',async({page})=>{
  const copy=communityLocales['es-CO'],writes=await fixture(page,'es-CO',false);const communityReads:string[]=[];page.on('request',request=>{if(request.url().includes('/api/community/'))communityReads.push(request.url());});
  for(const route of ['/grupos','/sugerencias']){await page.goto(base+'#'+route);await expect(page.getByRole('status')).toHaveText(copy.needAccount);await expect(page.getByRole('link',{name:copy.publicLink})).toBeVisible();}
  expect(writes).toEqual([]);expect(communityReads).toEqual([]);
});

for(const language of Object.keys(communityLocales) as Array<keyof typeof communityLocales>){
  test(`Community progressive forms, keyboard and accessibility in ${language}`,async({page})=>{
    const copy=communityLocales[language],writes=await fixture(page,language);
    await page.goto(base+'#/grupos');await expect(page.getByRole('heading',{name:copy.groupsTitle,level:1,exact:true})).toBeVisible();
    const group=page.getByRole('button',{name:/Synthetic group/});await group.focus();await page.keyboard.press('Enter');await expect(page.getByRole('heading',{name:'Synthetic group',exact:true})).toBeFocused();
    const invitations=page.getByText(copy.invitations,{exact:true});await invitations.focus();await page.keyboard.press('Enter');await expect(page.getByRole('form',{name:copy.createInvitation})).toBeVisible();
    await page.getByLabel(copy.invitationEmail,{exact:true}).fill('member@example.invalid');await page.getByRole('button',{name:copy.createInvitation,exact:true}).click();await expect(page.getByLabel(copy.invitationLink,{exact:true})).toHaveValue(/#\/grupos\?invite=synthetic-private-invitation-token$/);
    await page.getByText(copy.workspaces,{exact:true}).click();await page.getByLabel(copy.chooseWorkspace,{exact:true}).selectOption(workspaceId);await page.getByRole('button',{name:copy.share,exact:true}).click();await expect(page.getByRole('status')).toContainText(copy.shared);
    const groupAccessibility=await new AxeBuilder({page}).include('main').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(groupAccessibility.violations).toEqual([]);
    await page.goto(base+'#/sugerencias');await expect(page.getByRole('heading',{name:copy.suggestionsTitle,level:1,exact:true})).toBeVisible();const create=page.getByText(copy.createSuggestion,{exact:true});await create.focus();await page.keyboard.press('Space');const form=page.getByRole('form',{name:copy.createSuggestion});await expect(form).toBeVisible();
    await page.getByLabel(copy.title,{exact:true}).fill('Synthetic improvement');await page.keyboard.press('Tab');await expect(page.getByLabel(copy.suggestionDescription,{exact:true})).toBeFocused();await page.keyboard.type('Improve keyboard focus visibility');await page.getByLabel(copy.anonymous,{exact:true}).check();await page.getByRole('button',{name:copy.send,exact:true}).click();await expect(page.getByRole('status')).toContainText(copy.suggestionCreated);await expect(page.getByRole('heading',{name:'Synthetic improvement'})).toBeFocused();
    expect(writes.every(write=>write.headers['x-csrf-token']==='synthetic-csrf')).toBe(true);const sent=writes.find(write=>write.path.endsWith('/suggestions'));expect(sent?.headers['idempotency-key']).toMatch(/^[0-9a-f-]{36}$/);expect(sent?.body.anonymous).toBe(true);const storage=await page.evaluate(()=>Object.keys(localStorage).map(key=>localStorage.getItem(key)).join(''));expect(storage).not.toContain('synthetic-private-invitation-token');expect(storage).not.toContain('synthetic-csrf');
    const suggestionAccessibility=await new AxeBuilder({page}).include('main').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(suggestionAccessibility.violations).toEqual([]);
  });
}
