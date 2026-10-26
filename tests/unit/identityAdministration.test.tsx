import {afterEach,describe,expect,it,vi} from 'vitest';
import {cleanup,fireEvent,render,screen,waitFor} from '@testing-library/react';
import '../../src/app/i18n';
import {IdentityProvider,IdentityPage} from '../../src/features/identity/presentation';
import {identityClient} from '../../src/features/identity/infrastructure/client';
import type {IdentityAccount} from '../../src/features/identity/domain';
import {identityLocales} from '../../src/features/identity/locales';

afterEach(()=>{cleanup();vi.restoreAllMocks();});
describe('account administration from the browser',()=>{
  it('assigns global roles and account states without conflating group responsibilities',async()=>{
    const admin:IdentityAccount={id:'admin',email:'admin@example.invalid',displayName:'Synthetic admin',emailVerified:true,platformRole:'admin',globalRoles:['participant','administrator'],permissions:['account:manage','role:assign'],status:'active',version:1};
    const teacher={...admin,id:'teacher',email:'teacher@example.invalid',platformRole:'participant' as const,globalRoles:['participant','teacher','evaluator'] as IdentityAccount['globalRoles'],permissions:[],disabled:false,version:4};
    vi.spyOn(identityClient,'me').mockResolvedValue({account:admin,csrfToken:'fixture'});
    vi.spyOn(identityClient,'adminList').mockResolvedValue({items:[teacher]});
    const update=vi.spyOn(identityClient,'adminUpdate').mockResolvedValue({updated:true});
    render(<IdentityProvider><IdentityPage/></IdentityProvider>);
    const copy=identityLocales['es-CO'];
    fireEvent.change(await screen.findByLabelText(copy.accountState),{target:{value:'inactive'}});
    fireEvent.click(screen.getByRole('button',{name:copy.saveState}));
    await waitFor(()=>expect(update).toHaveBeenCalledWith('teacher',{globalRoles:['participant','teacher','evaluator'],status:'inactive',version:4}));
    fireEvent.click(screen.getByRole('checkbox',{name:copy.administrator}));
    fireEvent.click(screen.getByRole('button',{name:copy.assignRoles}));
    await waitFor(()=>expect(update).toHaveBeenLastCalledWith('teacher',{globalRoles:['participant','teacher','evaluator','administrator'],status:'active',version:4}));
  });
});
